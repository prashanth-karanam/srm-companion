"""
Scraper — Playwright + stealth per-user login and data fetch
CAPTCHA support: if SRM shows CAPTCHA, we capture it and return to the frontend.
The user solves it in the app, sends the answer back, and we complete the login.
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

import asyncio
import re
import json
import random
import base64
import uuid
from datetime import datetime

import httpx

# ─── Per-user lock + 3-browser pool ──────────────────────────────────────────
_USER_LOCKS: dict[str, asyncio.Lock] = {}
_BROWSER_POOL = asyncio.Semaphore(3)

# ─── CAPTCHA session store (holds open browser until user solves) ─────────────
_CAPTCHA_SESSIONS: dict[str, dict] = {}

ZOHO_OWNER   = "srmuniv"
ZOHO_APP     = "academia-academic-services"
CREATOR_BASE = f"https://creator.zoho.com/api/v2/{ZOHO_OWNER}/{ZOHO_APP}/report"

REPORT_URLS = {
    "attendance": f"{CREATOR_BASE}/My_Attendance",
    "timetable" : f"{CREATOR_BASE}/My_Time_Table",
    "calendar"  : f"{CREATOR_BASE}/My_Academic_Calender",
    "circulars" : f"{CREATOR_BASE}/My_Circulars",
}

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"


# ─── CAPTCHA completion (called when user submits CAPTCHA answer) ─────────────
async def complete_captcha_login(session_id: str, captcha_text: str) -> dict:
    sess = _CAPTCHA_SESSIONS.pop(session_id, None)
    if not sess:
        return {"success": False, "error": "CAPTCHA session expired — please login again"}

    page    = sess["page"]
    browser = sess["browser"]
    pw      = sess["pw"]
    frame   = sess["frame"]
    sel     = sess["captcha_input_sel"]
    srm_id  = sess["srm_id"]

    try:
        await frame.locator(sel).fill(captcha_text)
        await asyncio.sleep(0.4)

        # Submit
        for btn_sel in ["#nextbtn", "#signin", 'button[type="submit"]']:
            try:
                btn = frame.locator(btn_sel).first
                if await btn.count() > 0 and await btn.is_visible():
                    await btn.click()
                    break
            except Exception:
                pass

        try:
            await page.wait_for_url(
                lambda u: "academia.srmist.edu.in" in u and "signin" not in u,
                timeout=15000
            )
        except Exception:
            pass

        await asyncio.sleep(1.5)

        if "signin" in page.url:
            # CAPTCHA wrong — take new screenshot
            img_b64 = None
            for img_sel in ['img[id*="captcha"]', 'img[src*="captcha"]', 'img[alt*="captcha"]']:
                try:
                    el = frame.locator(img_sel).first
                    if await el.count() > 0:
                        img_b64 = base64.b64encode(await el.screenshot()).decode()
                        break
                except Exception:
                    pass

            new_sess_id = str(uuid.uuid4())
            _CAPTCHA_SESSIONS[new_sess_id] = sess
            _CAPTCHA_SESSIONS[new_sess_id]["session_id"] = new_sess_id

            return {
                "success": False,
                "captcha": True,
                "captcha_img": img_b64,
                "session_id": new_sess_id,
                "error": "CAPTCHA incorrect — try again",
            }

        all_cookies = await page.context.cookies()
        cookies = {c["name"]: c["value"] for c in all_cookies}
        await browser.close()
        await pw.stop()
        return {"success": True, "cookies": cookies}

    except Exception as e:
        try:
            await browser.close()
            await pw.stop()
        except Exception:
            pass
        return {"success": False, "error": f"Error after CAPTCHA: {e}"}


# ─── Stealth login ────────────────────────────────────────────────────────────
async def stealth_login(srm_id: str, password: str) -> dict:
    """
    Logs in to SRM portal.
    If CAPTCHA is detected, returns:
      {"success": False, "captcha": True, "captcha_img": "<base64>", "session_id": "..."}
    Frontend shows image → user types → calls complete_captcha_login().
    """
    try:
        from playwright.async_api import async_playwright
        from playwright_stealth import stealth_async
    except ImportError:
        return {"success": False, "error": "playwright not installed"}

    username = srm_id if "@" in srm_id else f"{srm_id}@srmist.edu.in"

    if srm_id not in _USER_LOCKS:
        _USER_LOCKS[srm_id] = asyncio.Lock()

    async with _USER_LOCKS[srm_id]:
        async with _BROWSER_POOL:
            pw      = None
            browser = None
            try:
                pw      = await async_playwright().start()
                browser = await pw.chromium.launch(
                    headless=True,
                    args=[
                        "--disable-blink-features=AutomationControlled",
                        "--no-sandbox",
                        "--disable-dev-shm-usage",
                        "--disable-gpu",
                    ]
                )
                ctx = await browser.new_context(
                    viewport={"width": 1280, "height": 800},
                    user_agent=UA,
                    locale="en-IN",
                    timezone_id="Asia/Kolkata",
                )
                page = await ctx.new_page()
                await stealth_async(page)

                await page.goto("https://academia.srmist.edu.in", wait_until="domcontentloaded", timeout=30000)
                await asyncio.sleep(random.uniform(1.5, 2.5))

                # ── Find Zoho IAM iframe ──────────────────────────────────────
                frame = page
                for _ in range(12):
                    for f in page.frames:
                        if "signin" in f.url or "accounts" in f.url:
                            frame = f
                            break
                    if frame is not page:
                        break
                    await asyncio.sleep(1)

                # ── Type email ────────────────────────────────────────────────
                for sel in ['input[name="LOGIN_ID"]', 'input[type="email"]', "#Email"]:
                    try:
                        el = frame.locator(sel).first
                        if await el.count() > 0:
                            await el.fill("")
                            await _human_type(el, username)
                            break
                    except Exception:
                        pass

                await asyncio.sleep(random.uniform(0.9, 1.4))

                # ── Click Next ────────────────────────────────────────────────
                for sel in ["#nextbtn", 'button[type="submit"]', 'input[type="submit"]']:
                    try:
                        btn = frame.locator(sel).first
                        if await btn.count() > 0 and await btn.is_visible():
                            await btn.click()
                            break
                    except Exception:
                        pass

                await asyncio.sleep(random.uniform(1.2, 2.0))

                for f in page.frames:
                    if "accounts" in f.url or "signin" in f.url:
                        frame = f
                        break

                # ── Type password ─────────────────────────────────────────────
                for sel in ['input[name="PASSWORD"]', 'input[type="password"]', "#Password"]:
                    try:
                        el = frame.locator(sel).first
                        if await el.count() > 0:
                            await el.fill("")
                            await _human_type(el, password)
                            break
                    except Exception:
                        pass

                await asyncio.sleep(random.uniform(0.8, 1.3))

                # ── Submit ────────────────────────────────────────────────────
                for sel in ["#nextbtn", "#signin", 'button[type="submit"]']:
                    try:
                        btn = frame.locator(sel).first
                        if await btn.count() > 0 and await btn.is_visible():
                            await btn.click()
                            break
                    except Exception:
                        pass

                # ── Wait for portal or CAPTCHA ────────────────────────────────
                await asyncio.sleep(2.5)

                # ── Check for CAPTCHA ─────────────────────────────────────────
                captcha_input_sel = None
                for sel in ['input[name="captcha"]', 'input[id*="captcha"]', 'input[placeholder*="captcha"]', 'input[name*="CAPTCHA"]']:
                    try:
                        el = frame.locator(sel).first
                        if await el.count() > 0:
                            captcha_input_sel = sel
                            break
                    except Exception:
                        pass

                if captcha_input_sel:
                    # CAPTCHA detected — screenshot it
                    img_b64 = None
                    for img_sel in ['img[id*="captcha"]', 'img[src*="captcha"]', 'img[alt*="captcha"]', '.captcha img', '#captchaImage']:
                        try:
                            el = frame.locator(img_sel).first
                            if await el.count() > 0:
                                img_b64 = base64.b64encode(await el.screenshot()).decode()
                                break
                        except Exception:
                            pass

                    if not img_b64:
                        # Fallback: screenshot full page
                        img_b64 = base64.b64encode(await page.screenshot()).decode()

                    # Store open browser session for CAPTCHA completion
                    sess_id = str(uuid.uuid4())
                    _CAPTCHA_SESSIONS[sess_id] = {
                        "page": page, "browser": browser, "pw": pw,
                        "frame": frame, "captcha_input_sel": captcha_input_sel,
                        "srm_id": srm_id,
                    }
                    # DON'T close browser — keep it alive for answer
                    return {
                        "success": False,
                        "captcha": True,
                        "captcha_img": img_b64,
                        "session_id": sess_id,
                    }

                # ── Normal wait for portal ────────────────────────────────────
                try:
                    await page.wait_for_url(
                        lambda u: "academia.srmist.edu.in" in u and "signin" not in u,
                        timeout=18000
                    )
                except Exception:
                    pass

                await asyncio.sleep(1.5)

                if "signin" in page.url:
                    await browser.close()
                    await pw.stop()
                    return {"success": False, "error": "Login failed — check SRM ID and password"}

                all_cookies = await ctx.cookies()
                cookies = {c["name"]: c["value"] for c in all_cookies}
                await browser.close()
                await pw.stop()

                if not cookies:
                    return {"success": False, "error": "No cookies — login may have failed"}

                return {"success": True, "cookies": cookies}

            except Exception as e:
                try:
                    if browser: await browser.close()
                    if pw: await pw.stop()
                except Exception:
                    pass
                return {"success": False, "error": f"Browser error: {e}"}


async def _human_type(element, text: str):
    for char in text:
        await element.type(char, delay=random.randint(80, 160))


# ─── Session test ─────────────────────────────────────────────────────────────
async def test_session(cookies: dict) -> bool:
    headers = {"User-Agent": UA, "Referer": "https://academia.srmist.edu.in/"}
    try:
        async with httpx.AsyncClient(cookies=cookies, headers=headers, timeout=8, follow_redirects=True) as client:
            r = await client.get(REPORT_URLS["attendance"], params={"limit": 1})
            if r.status_code == 200:
                d = r.json()
                return d.get("code") == 3000 or "data" in d
    except Exception:
        pass
    return False


# ─── Async HTTP helpers ───────────────────────────────────────────────────────
async def _fetch_report(cookies: dict, name: str) -> list:
    headers = {"User-Agent": UA, "Referer": "https://academia.srmist.edu.in/"}
    try:
        async with httpx.AsyncClient(cookies=cookies, headers=headers, timeout=15, follow_redirects=True) as client:
            r = await client.get(REPORT_URLS[name], params={"limit": 200})
            if r.status_code == 200:
                return r.json().get("data", [])
    except Exception as e:
        print(f"[Scraper] {name} error: {e}")
    return []


# ─── Scrape all data concurrently ────────────────────────────────────────────
async def scrape_with_cookies(cookies: dict) -> dict | None:
    attendance, timetable, calendar, circulars = await asyncio.gather(
        _fetch_report(cookies, "attendance"),
        _fetch_report(cookies, "timetable"),
        _fetch_report(cookies, "calendar"),
        _fetch_report(cookies, "circulars"),
    )

    if not attendance and not calendar:
        return None

    att_parsed  = _parse_attendance(attendance)
    cal_parsed  = _parse_calendar(calendar)
    circ_parsed = _parse_circulars(circulars)

    today = datetime.now().strftime("%d-%m-%Y")
    today_entry = next((e for e in cal_parsed if e.get("date", "").replace("/", "-") == today), None)

    return {
        "status"            : "success",
        "attendance"        : att_parsed,
        "timetable"         : {"periods": _parse_timetable(timetable)},
        "calendar"          : cal_parsed,
        "circulars"         : circ_parsed,
        "today_is_holiday"  : today_entry["status"] == "Holiday" if today_entry else False,
        "today_day_order"   : today_entry.get("day_order") if today_entry else None,
        "today_holiday_name": today_entry.get("remarks") if today_entry and today_entry.get("status") == "Holiday" else None,
        "last_scraped"      : datetime.now().strftime("%d-%m-%Y %H:%M"),
    }


# ─── Parsers ──────────────────────────────────────────────────────────────────
def _parse_attendance(records: list) -> list:
    out = []
    for rec in records:
        code      = re.sub(r"\s*Regular\s*$", "", str(rec.get("CourseCode", rec.get("Course_Code", "")))).strip()
        title     = str(rec.get("CourseTitle", rec.get("Course_Title", rec.get("Subject", "")))).strip()
        conducted = str(rec.get("HoursConducted", rec.get("Conducted", "0"))).strip()
        absent    = str(rec.get("HoursAbsent", rec.get("Absent", "0"))).strip()
        pct       = str(rec.get("Attendance", rec.get("Percentage", ""))).strip()
        try:
            c, a = float(conducted or 0), float(absent or 0)
            att = c - a
            if not pct and c > 0:
                pct = f"{att/c*100:.1f}"
        except Exception:
            att = 0
        if not code and not title:
            continue
        out.append({
            "code": code, "title": title,
            "conducted": conducted, "attended": str(int(float(conducted or 0) - float(absent or 0))),
            "absent": absent, "percentage": pct,
        })
    return out


def _parse_timetable(records: list) -> list:
    out = []
    for rec in records:
        out.append({
            "day_order"  : str(rec.get("Day_Order", "")),
            "hour"       : str(rec.get("Hour", rec.get("Period", ""))),
            "course_code": str(rec.get("CourseCode", rec.get("Course_Code", ""))),
            "course_name": str(rec.get("CourseTitle", rec.get("Subject", ""))),
            "faculty"    : str(rec.get("Faculty", "")),
            "room"       : str(rec.get("RoomNo", rec.get("Room", ""))),
            "slot"       : str(rec.get("Slot", "")),
        })
    return out


def _parse_calendar(records: list) -> list:
    out = []
    for rec in records:
        out.append({
            "date"     : str(rec.get("Date", "")),
            "day"      : str(rec.get("Day", "")),
            "day_order": str(rec.get("Day_Order", "")),
            "status"   : str(rec.get("Status", "")),
            "remarks"  : str(rec.get("Remarks", "")),
        })
    return out


def _parse_circulars(records: list) -> list:
    out = []
    for rec in records:
        out.append({
            "title"  : str(rec.get("Title", "")),
            "date"   : str(rec.get("Date", "")),
            "details": str(rec.get("Details", "")),
        })
    return out
