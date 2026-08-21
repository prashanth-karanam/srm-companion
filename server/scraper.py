"""
Scraper — Playwright + stealth per-user login and data fetch
No CAPTCHA: correct credentials + stealth = zero CAPTCHA, every time.
"""
import sys
if hasattr(sys.stdout, 'reconfigure'):
    try: sys.stdout.reconfigure(encoding='utf-8')
    except: pass

import asyncio
import re
import json
import random
from datetime import datetime

import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ─── One login at a time to avoid SRM flagging burst logins ──────────────────
_LOGIN_LOCK = asyncio.Semaphore(1)

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

# ─── Stealth login ────────────────────────────────────────────────────────────
async def stealth_login(srm_id: str, password: str) -> dict:
    """
    One-time browser login using playwright-stealth.
    Human-like typing. No CAPTCHA on correct first attempt.
    Returns {"success": True, "cookies": {...}} or {"success": False, "error": "..."}
    """
    try:
        from playwright.async_api import async_playwright
        from playwright_stealth import stealth_async
    except ImportError:
        return {"success": False, "error": "playwright / playwright-stealth not installed"}

    username = srm_id if "@" in srm_id else f"{srm_id}@srmist.edu.in"

    async with _LOGIN_LOCK:
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
            await stealth_async(page)   # ← patches webdriver, WebGL, canvas, plugins

            await page.goto("https://academia.srmist.edu.in", wait_until="domcontentloaded", timeout=30000)
            await asyncio.sleep(random.uniform(1.5, 2.5))

            # ── Find Zoho IAM iframe ──────────────────────────────────────────
            frame = page
            for _ in range(12):
                for f in page.frames:
                    if "signin" in f.url or "accounts" in f.url:
                        frame = f
                        break
                if frame is not page:
                    break
                await asyncio.sleep(1)

            # ── Type email ────────────────────────────────────────────────────
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

            # ── Click Next ────────────────────────────────────────────────────
            for sel in ["#nextbtn", 'button[type="submit"]', 'input[type="submit"]']:
                try:
                    btn = frame.locator(sel).first
                    if await btn.count() > 0 and await btn.is_visible():
                        await btn.click()
                        break
                except Exception:
                    pass

            await asyncio.sleep(random.uniform(1.2, 2.0))

            # Re-find frame after possible navigation
            for f in page.frames:
                if "accounts" in f.url or "signin" in f.url:
                    frame = f
                    break

            # ── Type password ─────────────────────────────────────────────────
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

            # ── Submit ────────────────────────────────────────────────────────
            for sel in ["#nextbtn", "#signin", 'button[type="submit"]']:
                try:
                    btn = frame.locator(sel).first
                    if await btn.count() > 0 and await btn.is_visible():
                        await btn.click()
                        break
                except Exception:
                    pass

            # ── Wait for portal ───────────────────────────────────────────────
            try:
                await page.wait_for_url(
                    lambda u: "academia.srmist.edu.in" in u and "signin" not in u,
                    timeout=22000
                )
            except Exception:
                pass

            await asyncio.sleep(2)

            if "signin" in page.url:
                await browser.close()
                await pw.stop()
                return {"success": False, "error": "Login failed — check SRM ID and password"}

            # ── Extract cookies ───────────────────────────────────────────────
            all_cookies = await ctx.cookies()
            cookies = {c["name"]: c["value"] for c in all_cookies}

            await browser.close()
            await pw.stop()

            if not cookies:
                return {"success": False, "error": "No cookies received — login may have failed"}

            return {"success": True, "cookies": cookies}

        except Exception as e:
            try:
                if browser: await browser.close()
                if pw: await pw.stop()
            except Exception:
                pass
            return {"success": False, "error": f"Browser error: {e}"}


async def _human_type(element, text: str):
    """Type text with human-like random delays between keystrokes"""
    for char in text:
        await element.type(char, delay=random.randint(80, 160))


# ─── Session test ─────────────────────────────────────────────────────────────
async def test_session(cookies: dict) -> bool:
    """Quick check — are these cookies still valid against the Zoho Creator API?"""
    try:
        s = _make_session(cookies)
        r = s.get(REPORT_URLS["attendance"], params={"limit": 1}, timeout=8)
        if r.status_code == 200:
            d = r.json()
            return d.get("code") == 3000 or "data" in d
    except Exception:
        pass
    return False


# ─── Scrape all data with existing cookies ───────────────────────────────────
async def scrape_with_cookies(cookies: dict) -> dict | None:
    """
    Use saved cookies to hit Zoho Creator report API directly.
    No browser. Pure requests. Fast (< 5s for all data).
    """
    s = _make_session(cookies)

    attendance = _fetch_report(s, "attendance")
    timetable  = _fetch_report(s, "timetable")
    calendar   = _fetch_report(s, "calendar")
    circulars  = _fetch_report(s, "circulars")

    # If all empty, session probably expired
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


# ─── Helpers ──────────────────────────────────────────────────────────────────
def _make_session(cookies: dict) -> requests.Session:
    s = requests.Session()
    retry = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
    s.mount("https://", HTTPAdapter(max_retries=retry))
    s.headers.update({"User-Agent": UA, "Referer": "https://academia.srmist.edu.in/"})
    s.cookies.update(cookies)
    return s

def _fetch_report(s: requests.Session, name: str) -> list:
    try:
        r = s.get(REPORT_URLS[name], params={"limit": 200}, timeout=15)
        if r.status_code == 200:
            return r.json().get("data", [])
    except Exception as e:
        print(f"[Scraper] {name} error: {e}")
    return []

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
        if code or title:
            out.append({
                "subject"   : title,
                "code"      : code,
                "slot"      : str(rec.get("Slot", "")),
                "faculty"   : str(rec.get("FacultyName", rec.get("Faculty", ""))),
                "room"      : str(rec.get("RoomNo", rec.get("Room_No", ""))),
                "conducted" : conducted,
                "absent"    : absent,
                "attended"  : str(int(att)),
                "percentage": pct,
                "danger"    : float(pct or 0) < 75,
            })
    return out

def _parse_timetable(records: list) -> list:
    return [{
        "slot"   : str(rec.get("Slot", "")),
        "subject": str(rec.get("CourseTitle", rec.get("Subject", ""))),
        "code"   : str(rec.get("CourseCode", "")),
        "faculty": str(rec.get("FacultyName", "")),
        "room"   : str(rec.get("RoomNo", "")),
        "time"   : str(rec.get("Time", "")),
    } for rec in records]

def _parse_calendar(records: list) -> list:
    out = []
    for rec in records:
        date      = str(rec.get("Date", rec.get("date", ""))).strip()
        day       = str(rec.get("Day", "")).strip()
        status    = str(rec.get("Status", rec.get("Working_Status", "Working"))).strip()
        day_order = str(rec.get("Day_Order", rec.get("DayOrder", "-"))).strip()
        remarks   = str(rec.get("Remarks", rec.get("Holiday_Name", "-"))).strip()
        out.append({
            "date"     : date,
            "day"      : day,
            "status"   : "Holiday" if "holiday" in status.lower() else "Working",
            "day_order": day_order,
            "remarks"  : remarks,
        })
    return out

def _parse_circulars(records: list) -> list:
    out = []
    for rec in records:
        title   = str(rec.get("Title", rec.get("Subject", ""))).strip()
        content = str(rec.get("Content", rec.get("Message", ""))).strip()
        date    = str(rec.get("Date", "")).strip()
        text    = (title + " " + content).lower()
        out.append({
            "title"            : title,
            "content"          : content,
            "date"             : date,
            "is_holiday_notice": any(k in text for k in ["holiday", "off", "no class", "closed"]),
            "is_cancellation"  : any(k in text for k in ["cancel", "postpone", "reschedule"]),
        })
    return out
