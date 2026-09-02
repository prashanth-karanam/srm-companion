"""
SRM Companion - Smart One-Time Browser Login + Persistent API Client
Multi-user: Accepts dynamic per-request credentials.

Strategy (you were right — there IS a better way):
  1. ONE-TIME: Use Playwright browser to login (handles JS encryption, CSRF, etc.)
  2. Dump session cookies to srm_cookies.json
  3. FOREVER AFTER: Use plain `requests` with those cookies — zero browser needed
  4. Cookies last 24-48 hours typically; auto-re-login when expired
  5. All data hits Zoho Creator JSON API directly — clean structured JSON

This is exactly how mobile apps work:
  - Login once (browser or OAuth)
  - Get token/cookie
  - Use token for all API calls (no browser for data fetching)
"""

import sys
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

import os
import json
import re
import time
import threading
from datetime import datetime
import requests
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

# ─── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR         = os.path.dirname(os.path.abspath(__file__))
CREDENTIALS_FILE = os.path.join(BASE_DIR, "credentials.json")
COOKIE_FILE      = os.path.join(BASE_DIR, "srm_cookies.json")
OUTPUT_FILE      = os.path.join(BASE_DIR, "scraped_data.json")

SCRAPE_INTERVAL  = 900  # 15 minutes

# ─── Zoho Creator Report URLs ─────────────────────────────────────────────
# These are the direct JSON API endpoints the portal frontend uses internally
ZOHO_OWNER       = "srmuniv"
ZOHO_APP         = "academia-academic-services"
CREATOR_BASE     = f"https://creator.zoho.com/api/v2/{ZOHO_OWNER}/{ZOHO_APP}/report"

REPORT_URLS = {
    "attendance": f"{CREATOR_BASE}/My_Attendance",
    "timetable" : f"{CREATOR_BASE}/My_Time_Table",
    "calendar"  : f"{CREATOR_BASE}/My_Academic_Calender",
    "circulars" : f"{CREATOR_BASE}/My_Circulars",
    "hostel"    : f"{CREATOR_BASE}/My_Hostel_Details",
    "grades"    : f"{CREATOR_BASE}/My_Grade_Book",
    "fees"      : f"{CREATOR_BASE}/My_Fee_Details",
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
    "Referer"   : "https://academia.srmist.edu.in/",
    "Accept"    : "application/json, text/html, */*",
}

# ─── Credentials ─────────────────────────────────────────────────────────────
def load_credentials():
    if not os.path.exists(CREDENTIALS_FILE):
        print("ERROR: credentials.json not found. Run: python credentials_setup.py")
        return None, None
    with open(CREDENTIALS_FILE, "r", encoding="utf-8") as f:
        creds = json.load(f)
    return creds.get("username", "").strip(), creds.get("password", "").strip()

def save_output(data: dict):
    data["last_scraped"]    = datetime.now().strftime("%d-%m-%Y %H:%M:%S")
    data["last_scraped_ts"] = int(time.time())
    with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"[{datetime.now().strftime('%H:%M:%S')}] ✅ Data saved → scraped_data.json")

def load_scraped_data() -> dict:
    if os.path.exists(OUTPUT_FILE):
        try:
            with open(OUTPUT_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            pass
    return {
        "attendance": [], "timetable": {}, "calendar": [], "circulars": [],
        "last_scraped": None, "last_scraped_ts": 0, "status": "never_scraped",
        "today_is_holiday": False, "today_day_order": None
    }

# ─── Cookie Management ────────────────────────────────────────────────────────
def save_cookies(session: requests.Session):
    with open(COOKIE_FILE, "w") as f:
        json.dump(dict(session.cookies), f, indent=2)
    print(f"[Cookies] Saved {len(session.cookies)} cookies → srm_cookies.json")

def load_cookies_into(session: requests.Session) -> bool:
    if not os.path.exists(COOKIE_FILE):
        return False
    try:
        with open(COOKIE_FILE, "r") as f:
            cookies = json.load(f)
        if not cookies:
            return False
        session.cookies.update(cookies)
        print(f"[Cookies] Loaded {len(cookies)} saved cookies")
        return True
    except Exception:
        return False


# ─── Phase 1: One-Time Browser Login (Playwright) ────────────────────────────

def browser_login_and_save_cookies(username: str, password: str, headless: bool = False) -> bool:
    """
    Uses Playwright browser to login once.
    After success, saves cookies → srm_cookies.json.
    From then on, only plain requests are used.
    
    headless=False shows the browser window so you can see/interact.
    headless=True runs invisibly in background.
    """
    try:
        from playwright.sync_api import sync_playwright, TimeoutError as PWT
    except ImportError:
        print("[Browser] Playwright not installed. Run: pip install playwright && python -m playwright install chromium")
        return False

    print(f"\n[Browser] One-time login for {username}...")
    print(f"[Browser] headless={'hidden' if headless else 'VISIBLE (you can see it)'}")

    pw = None
    browser = None
    try:
        pw      = sync_playwright().start()
        browser = pw.chromium.launch(
            headless=headless,
            args=["--disable-blink-features=AutomationControlled", "--no-sandbox"]
        )
        ctx  = browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent=HEADERS["User-Agent"]
        )
        page = ctx.new_page()
        page.goto("https://academia.srmist.edu.in", timeout=30000, wait_until="domcontentloaded")
        time.sleep(2)

        # Find the Zoho IAM iframe
        frame = page
        for attempt in range(10):
            frames = page.frames
            for f in frames:
                if "signin" in f.url or "accounts" in f.url:
                    frame = f
                    break
            if frame is not page:
                break
            time.sleep(1)

        print(f"[Browser] Found login frame: {frame.url[:60]}")

        # Fill email
        for sel in ['input[name="LOGIN_ID"]', 'input[type="email"]', '#Email', 'input[placeholder*="mail"]']:
            try:
                if frame.locator(sel).count() > 0:
                    frame.locator(sel).first.fill(username)
                    print(f"[Browser] Email entered via: {sel}")
                    break
            except Exception:
                pass

        # Click Next if needed
        for sel in ['#nextbtn', 'button[type="submit"]', 'input[type="submit"]']:
            try:
                btn = frame.locator(sel).first
                if btn.count() > 0 and btn.is_visible():
                    btn.click()
                    time.sleep(2)
                    break
            except Exception:
                pass

        # Refresh frame reference after navigation
        frames = page.frames
        for f in frames:
            if "accounts" in f.url or "signin" in f.url:
                frame = f
                break

        # Fill password
        for sel in ['input[name="PASSWORD"]', 'input[type="password"]', '#Password']:
            try:
                if frame.locator(sel).count() > 0:
                    frame.locator(sel).first.fill(password)
                    print(f"[Browser] Password entered via: {sel}")
                    break
            except Exception:
                pass

        # Submit
        for sel in ['#nextbtn', '#signin', 'button[type="submit"]', 'input[type="submit"]']:
            try:
                btn = frame.locator(sel).first
                if btn.count() > 0 and btn.is_visible():
                    btn.click()
                    break
            except Exception:
                pass

        # Wait for portal to load
        print("[Browser] Waiting for portal...")
        try:
            page.wait_for_url(lambda u: "academia.srmist.edu.in" in u and "signin" not in u, timeout=25000)
        except PWT:
            pass
        time.sleep(3)

        # Extract and save ALL cookies (this is the permanent token)
        all_cookies = ctx.cookies()
        if not all_cookies:
            page.screenshot(path=os.path.join(BASE_DIR, "login_debug.png"))
            print("[Browser] ❌ No cookies. Screenshot saved: login_debug.png")
            return False

        # Save in requests-compatible format
        cookie_dict = {c["name"]: c["value"] for c in all_cookies}
        with open(COOKIE_FILE, "w") as f:
            json.dump(cookie_dict, f, indent=2)

        print(f"[Browser] ✅ Login successful! {len(cookie_dict)} cookies saved → srm_cookies.json")
        print("[Browser] From now on, NO browser needed — using saved cookies only.")
        return True

    except Exception as e:
        print(f"[Browser] Login error: {e}")
        try:
            page.screenshot(path=os.path.join(BASE_DIR, "login_debug.png"))
        except Exception:
            pass
        return False
    finally:
        try:
            if browser: browser.close()
            if pw: pw.stop()
        except Exception:
            pass


# ─── Phase 2: Pure Requests API (No Browser) ─────────────────────────────────

class SRMAcademiaAPI:
    """
    Pure requests-based data fetcher.
    Uses saved cookies — zero browser involvement.
    """

    def __init__(self, netid=None, password=None):
        retry   = Retry(total=3, backoff_factor=1, status_forcelist=[500, 502, 503, 504])
        adapter = HTTPAdapter(max_retries=retry)
        self.session = requests.Session()
        self.session.mount("https://", adapter)
        self.session.headers.update(HEADERS)
        _file_user, _file_pass = load_credentials()
        self.username = netid or _file_user
        self.password = password or _file_pass

    def ensure_authenticated(self) -> bool:
        """Load cookies and verify session. Re-login if expired."""
        load_cookies_into(self.session)

        if self._test_session():
            return True

        print("[API] Session invalid/expired. Triggering one-time browser login...")
        if browser_login_and_save_cookies(self.username, self.password, headless=True):
            # Reload the fresh cookies
            self.session.cookies.clear()
            load_cookies_into(self.session)
            return self._test_session()
        return False

    def _test_session(self) -> bool:
        """Quick check: can we hit a protected API endpoint?"""
        try:
            r = self.session.get(
                REPORT_URLS["attendance"],
                params={"limit": 1},
                timeout=10
            )
            if r.status_code == 200:
                d = r.json()
                # Zoho returns {"code": 3000, "data": [...]} on success
                return d.get("code") == 3000 or "data" in d
        except Exception:
            pass
        return False

    def _fetch_report(self, name: str) -> list:
        """Fetch a Zoho Creator report and return the data list"""
        url = REPORT_URLS.get(name)
        if not url:
            return []
        try:
            r = self.session.get(url, params={"limit": 200}, timeout=20)
            if r.status_code == 200:
                return r.json().get("data", [])
        except Exception as e:
            print(f"[API] Error fetching {name}: {e}")
        return []

    def get_attendance(self) -> list:
        print("[API] Fetching attendance...")
        records = self._fetch_report("attendance")
        attendance = []
        for rec in records:
            code      = re.sub(r"\s*Regular\s*$", "", rec.get("CourseCode", rec.get("Course_Code", ""))).strip()
            title     = rec.get("CourseTitle", rec.get("Course_Title", rec.get("Subject", ""))).strip()
            conducted = str(rec.get("HoursConducted", rec.get("Conducted", "0"))).strip()
            absent    = str(rec.get("HoursAbsent", rec.get("Absent", "0"))).strip()
            pct       = str(rec.get("Attendance", rec.get("Percentage", ""))).strip()
            slot      = rec.get("Slot", "")
            faculty   = rec.get("FacultyName", rec.get("Faculty", ""))
            room      = rec.get("RoomNo", rec.get("Room_No", ""))

            try:
                c = float(conducted or 0)
                a = float(absent or 0)
                att = c - a
                if not pct and c > 0:
                    pct = f"{att/c*100:.1f}"
            except Exception:
                att = 0

            if code or title:
                attendance.append({
                    "subject"   : title,
                    "code"      : code,
                    "slot"      : slot,
                    "faculty"   : faculty,
                    "room"      : room,
                    "conducted" : conducted,
                    "absent"    : absent,
                    "attended"  : str(int(att)),
                    "percentage": pct,
                    "danger"    : float(pct or 0) < 75,
                })
        print(f"[API] Attendance: {len(attendance)} subjects")
        return attendance

    def get_calendar(self) -> list:
        print("[API] Fetching calendar...")
        records = self._fetch_report("calendar")
        calendar = []
        seen_dates = set()
        for rec in records:
            date      = str(rec.get("Date", rec.get("date", ""))).strip()
            if not date or date in seen_dates:
                continue
            seen_dates.add(date)
            day       = str(rec.get("Day", "")).strip()
            status    = str(rec.get("Status", rec.get("Working_Status", "Working"))).strip()
            day_order = str(rec.get("Day_Order", rec.get("DayOrder", "-"))).strip()
            remarks   = str(rec.get("Remarks", rec.get("Holiday_Name", "-"))).strip()
            is_holiday = "holiday" in status.lower()
            calendar.append({
                "date"     : date,
                "day"      : day,
                "status"   : "Holiday" if is_holiday else "Working",
                "day_order": day_order,
                "remarks"  : remarks,
                "week"     : rec.get("Week", ""),
            })
        print(f"[API] Calendar: {len(calendar)} entries, {sum(1 for c in calendar if c['status']=='Holiday')} holidays")
        return calendar

    def get_circulars(self) -> list:
        print("[API] Fetching circulars...")
        records = self._fetch_report("circulars")
        circulars = []
        for rec in records:
            title   = str(rec.get("Title", rec.get("Subject", rec.get("Circular_Title", "")))).strip()
            content = str(rec.get("Content", rec.get("Message", ""))).strip()
            date    = str(rec.get("Date", datetime.now().strftime("%d-%m-%Y"))).strip()
            text    = (title + " " + content).lower()
            circulars.append({
                "title"           : title,
                "content"         : content,
                "date"            : date,
                "is_holiday_notice": any(kw in text for kw in ["holiday", "off", "no class", "closed"]),
                "is_cancellation" : any(kw in text for kw in ["cancel", "postpone", "reschedule"]),
            })
        print(f"[API] Circulars: {len(circulars)} notices")
        return circulars

    def get_timetable(self) -> dict:
        print("[API] Fetching timetable...")
        records = self._fetch_report("timetable")
        periods = []
        for rec in records:
            periods.append({
                "slot"   : rec.get("Slot", ""),
                "subject": rec.get("CourseTitle", rec.get("Subject", "")),
                "code"   : rec.get("CourseCode", ""),
                "faculty": rec.get("FacultyName", ""),
                "room"   : rec.get("RoomNo", ""),
                "time"   : rec.get("Time", ""),
            })
        print(f"[API] Timetable: {len(periods)} periods")
        return {"periods": periods, "current_day_order": None}

    def scrape_all(self) -> dict:
        print("\n" + "="*55)
        print(f"  SRM API SCRAPE — {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}")
        print("="*55)

        if not self.username:
            return {"status": "no_credentials"}

        if not self.ensure_authenticated():
            return {"status": "login_failed", "error": "Cannot authenticate with SRM portal"}

        data = {
            "status"    : "success",
            "attendance": self.get_attendance(),
            "timetable" : self.get_timetable(),
            "calendar"  : self.get_calendar(),
            "circulars" : self.get_circulars(),
        }

        today_str   = datetime.now().strftime("%d-%m-%Y")
        today_entry = next(
            (e for e in data["calendar"]
             if e.get("date", "").replace("/", "-").strip() == today_str), None
        )
        data["today_is_holiday"]   = today_entry["status"] == "Holiday" if today_entry else False
        data["today_day_order"]    = today_entry.get("day_order") if today_entry else None
        data["today_holiday_name"] = today_entry.get("remarks") if data["today_is_holiday"] else None

        # Check circulars for surprise holiday announcements
        today_hols = [c for c in data["circulars"]
                      if c["is_holiday_notice"] and today_str in c.get("date","") + c.get("content","")]
        if today_hols and not data["today_is_holiday"]:
            data["today_is_holiday"]   = True
            data["today_holiday_name"] = today_hols[0]["title"]
            print(f"[HOLIDAY ALERT] Circular says today is holiday: {today_hols[0]['title']}")

        save_output(data)
        return data


# ─── Background Auto-Scraper ──────────────────────────────────────────────────

_thread    = None
_stop_flag = threading.Event()

def run_auto_scraper(interval=SCRAPE_INTERVAL):
    _stop_flag.clear()
    print(f"[AutoScraper] Running every {interval}s ({interval//60}min)")
    while not _stop_flag.is_set():
        try:
            SRMAcademiaAPI().scrape_all()
        except Exception as e:
            print(f"[AutoScraper] Error: {e}")
        for _ in range(interval // 5):
            if _stop_flag.is_set(): break
            time.sleep(5)

def start_background_scraper(interval=SCRAPE_INTERVAL):
    global _thread
    if _thread and _thread.is_alive():
        return
    _thread = threading.Thread(target=run_auto_scraper, args=(interval,), daemon=True)
    _thread.start()

def stop_background_scraper():
    _stop_flag.set()


# ─── Standalone Run ───────────────────────────────────────────────────────────

if __name__ == "__main__":
    import argparse
    parser = argparse.ArgumentParser()
    parser.add_argument("--login",    action="store_true", help="Force fresh browser login (saves cookies)")
    parser.add_argument("--visible",  action="store_true", help="Show browser window during login")
    parser.add_argument("--watch",    action="store_true", help="Keep scraping every 15 minutes")
    parser.add_argument("--interval", type=int, default=900)
    args = parser.parse_args()

    username, password = load_credentials()

    if args.login or not os.path.exists(COOKIE_FILE):
        print("[Setup] Running one-time browser login...")
        browser_login_and_save_cookies(username, password, headless=not args.visible)

    if args.watch:
        run_auto_scraper(interval=args.interval)
    else:
        data = SRMAcademiaAPI().scrape_all()
        print("\n────── RESULT ──────")
        print(f"Status        : {data.get('status')}")
        print(f"Today Holiday : {data.get('today_is_holiday')} ({data.get('today_holiday_name','-')})")
        print(f"Day Order     : {data.get('today_day_order')}")
        print(f"Attendance    : {len(data.get('attendance',[]))} subjects")
        print(f"Circulars     : {len(data.get('circulars',[]))} notices")
        print(f"Calendar      : {len(data.get('calendar',[]))} entries")
        if data.get("error"):
            print(f"Error         : {data['error']}")
        print("────────────────────")
