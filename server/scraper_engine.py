"""
High-Performance Concurrent SRM Student Portal Scraper Engine
Direct HTTP Protocol Handshake (sp.srmist.edu.in)
Eliminates slow headless browsers and bypasses mobile CORS limitations.
"""

import re
import time
import uuid
import base64
import json
import math
import logging
from typing import Dict, Any, Tuple, Optional
import httpx
from bs4 import BeautifulSoup

logger = logging.getLogger("srm_scraper_engine")

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

LOGIN_URL = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp'
SERVLET_URL = 'https://sp.srmist.edu.in/srmiststudentportal/LoginServlet'
BASE_REPORT = 'https://sp.srmist.edu.in/srmiststudentportal/students/report/'


async def fetch_portal_captcha() -> Dict[str, Any]:
    """
    Fetches a fresh CAPTCHA and cryptographic security nonces from SRM.
    """
    async with httpx.AsyncClient(headers=HEADERS, timeout=12.0, follow_redirects=True) as client:
        r_page = await client.get(LOGIN_URL)
        html = r_page.text
        soup = BeautifulSoup(html, 'html.parser')

        # 1. Extract dynamic Java tokens
        nonce_match = re.search(r"nonce\s*:\s*['\"]([^'\"]+)['\"]", html)
        nonce = nonce_match.group(1) if nonce_match else ""

        df_match = re.search(r"domainFieldName\s*=\s*['\"]([^'\"]+)['\"]", html)
        domainFieldName = df_match.group(1) if df_match else ""

        cf_match = re.search(r"captchaFieldName\s*=\s*['\"]([^'\"]+)['\"]", html)
        captchaFieldName = cf_match.group(1) if cf_match else ""

        rd_match = re.search(r"randomDelimiter\s*=\s*['\"]([^'\"]+)['\"]", html)
        randomDelimiter = rd_match.group(1) if rd_match else ""

        # 2. Extract captcha URL from data-src
        img = soup.find('img', id='secure_captcha')
        data_src = img.get('data-src') if img else None

        if data_src:
            captcha_url = f"https://sp.srmist.edu.in{data_src}" if data_src.startswith('/') else data_src
        else:
            ts = int(time.time() * 1000)
            captcha_url = f"https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?ts={ts}"

        # 3. Extract hidden inputs & honeypots
        form = soup.find('form')
        hidden_fields = {}
        if form:
            for inp in form.find_all('input'):
                name = inp.get('name')
                if name and name not in ['username', 'password', 'captcha']:
                    hidden_fields[name] = inp.get('value', '')

        # 4. Fetch CAPTCHA image with mandatory X-Domain-Proof header
        domain_proof = base64.b64encode(f"{nonce}:sp.srmist.edu.in".encode('utf-8')).decode('utf-8')
        cap_headers = {
            'X-Domain-Proof': domain_proof,
            'Referer': LOGIN_URL
        }

        cap_res = await client.get(captcha_url, headers=cap_headers)
        b64_img = base64.b64encode(cap_res.content).decode('utf-8')

        # Extract session cookies
        cookies_str = "; ".join([f"{c.name}={c.value}" for c in client.cookies.jar])
        sec_config = {
            "nonce": nonce,
            "domainFieldName": domainFieldName,
            "captchaFieldName": captchaFieldName,
            "randomDelimiter": randomDelimiter
        }

        # Stateless self-contained token for 100% serverless multi-container persistence
        stateless_payload = {
            "cookies": cookies_str,
            "sec_config": sec_config,
            "hidden_fields": hidden_fields,
            "created_at": time.time()
        }
        session_id = base64.urlsafe_b64encode(json.dumps(stateless_payload).encode('utf-8')).decode('utf-8')

        return {
            "success": True,
            "session_id": session_id,
            "captchaImg": f"data:image/jpeg;base64,{b64_img}",
            "cookies": cookies_str,
            "sec_config": sec_config,
            "hidden_fields": hidden_fields
        }


async def login_and_scrape_all(
    username: str,
    password: str,
    captcha: str,
    session_data: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Authenticates with SRM portal and scrapes Profile, Attendance, Timetable,
    Personal details, and Hostel concurrently.
    """
    clean_username = re.sub(r'(?i)@srmist\.edu\.in$', '', username.strip()).strip()
    clean_password = password.strip()
    clean_captcha = captcha.strip()

    cookies_str = session_data.get("cookies", "")
    sec_config = session_data.get("sec_config", {})
    hidden_fields = session_data.get("hidden_fields", {})

    client_cookies = {}
    for item in cookies_str.split(';'):
        if '=' in item:
            k, v = item.strip().split('=', 1)
            client_cookies[k.strip()] = v.strip()

    async with httpx.AsyncClient(
        headers=HEADERS,
        cookies=client_cookies,
        timeout=18.0,
        follow_redirects=True
    ) as client:
        # 1. Build Authentication Payload
        login_payload = {
            'username': clean_username,
            'password': clean_password,
            'captcha': clean_captcha
        }
        if hidden_fields and isinstance(hidden_fields, dict):
            login_payload.update(hidden_fields)

        # Dynamic cryptographic headers & traps
        if sec_config and isinstance(sec_config, dict):
            nonce = sec_config.get('nonce', '')
            if nonce:
                client.headers['X-Domain-Proof'] = base64.b64encode(f"{nonce}:sp.srmist.edu.in".encode('utf-8')).decode('utf-8')

            df_name = sec_config.get('domainFieldName')
            if df_name:
                reversed_host = "sp.srmist.edu.in"[::-1]
                login_payload[df_name] = base64.b64encode(reversed_host.encode('utf-8')).decode('utf-8')

            cf_name = sec_config.get('captchaFieldName')
            rd = sec_config.get('randomDelimiter', '')
            if cf_name:
                trap_payload = f"4{rd}12"
                login_payload[cf_name] = base64.b64encode(trap_payload.encode('utf-8')).decode('utf-8')

        now_ms = int(time.time() * 1000)
        telemetry = {
            "startTime": now_ms - 3500,
            "currentDomain": "sp.srmist.edu.in",
            "timezoneOffset": -330,
            "screenWidth": 1920,
            "screenHeight": 1080,
            "colorDepth": 24,
            "platform": "Win32",
            "userAgent": HEADERS['User-Agent'],
            "mouseClicks": 3,
            "mouseMovements": 25,
            "keystrokeCount": 18,
            "typingSpeedMs": 210,
            "canvasHash": "c4d812a",
            "submitTime": now_ms,
            "timeOnPageMs": 3500
        }
        login_payload['telemetryPayload'] = base64.b64encode(json.dumps(telemetry).encode('utf-8')).decode('utf-8')

        client.headers['Referer'] = LOGIN_URL
        client.headers['Origin'] = 'https://sp.srmist.edu.in'

        # 2. Submit Login
        r_login = await client.post(SERVLET_URL, data=login_payload)
        login_html = r_login.text

        logger.info(f"LOGIN ATTEMPT for {clean_username}: HTTP {r_login.status_code}, response length={len(login_html)}")
        logger.info(f"LOGIN RESPONSE PREVIEW: {login_html[:800]}")

        # Validate Authentication Response
        soup_login = BeautifulSoup(login_html, 'html.parser')
        alert_el = soup_login.find(class_=re.compile(r'alert', re.I))
        if alert_el:
            err_msg = alert_el.get_text(strip=True)
            logger.warning(f"LOGIN ALERT DETECTED: '{err_msg}'")
            if any(k in err_msg.lower() for k in ['invalid', 'incorrect', 'remaining', 'fail', 'mismatch']):
                return {"success": False, "error": err_msg}

        if "Invalid User Name or Password" in login_html or "No of tries remaining" in login_html:
            logger.warning("LOGIN FAILED: 'Invalid User Name or Password' or 'No of tries remaining' in response")
            return {"success": False, "error": "Invalid NetID or Password. Please double-check your credentials."}

        if "Invalid Captcha Code" in login_html:
            logger.warning("LOGIN FAILED: 'Invalid Captcha Code' in response")
            return {"success": False, "error": "Invalid CAPTCHA entered. Please tap reload and try again."}

        logger.info("LOGIN SUCCESS! Proceeding to fetch student report tabs...")

        # 3. Concurrent Scraping of All Student Data Tabs
        report_headers = {
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp',
            'X-Requested-With': 'XMLHttpRequest'
        }

        async def fetch_tab(jsp_name: str, iden: str):
            try:
                res = await client.post(
                    f"{BASE_REPORT}{jsp_name}",
                    data={'iden': iden, 'filter': '', 'hdnFormDetails': iden, 'csrfPreventionSalt': ''},
                    headers=report_headers,
                    timeout=10.0
                )
                return res.text if res.status_code == 200 else ""
            except Exception as e:
                logger.warning(f"Error fetching {jsp_name}: {e}")
                return ""

        import asyncio
        html_prof, html_pers, html_att, html_tt, html_hostel = await asyncio.gather(
            fetch_tab('studentProfile.jsp', '1'),
            fetch_tab('studentPersonalDetails.jsp', '17'),
            fetch_tab('studentAttendanceDetails.jsp', '9'),
            fetch_tab('studentTimeTableDetails.jsp', '10'),
            fetch_tab('studentHostelDetails.jsp', '11')
        )

        # 4. Parse Student Profile
        profile_data = _parse_profile(html_prof, clean_username)

        # 5. Parse Personal Details
        personal_info = _parse_personal(html_pers)

        # 6. Parse Attendance with Bunk Margins
        attendance_list = _parse_attendance(html_att)

        # 7. Parse Timetable Matrix
        timetable_schedule = _parse_timetable(html_tt)

        # 8. Parse Hostel Details
        hostel_details = _parse_hostel(html_hostel)

        return {
            "success": True,
            "srm_id": clean_username,
            "name": profile_data.get("name") or clean_username.upper(),
            "reg_no": profile_data.get("reg_no", ""),
            "program": profile_data.get("program", ""),
            "section": profile_data.get("section", ""),
            "email": profile_data.get("email") or f"{clean_username}@srmist.edu.in",
            "faculty_advisor": profile_data.get("faculty_advisor", ""),
            "academic_advisor": profile_data.get("academic_advisor", ""),
            "semester": profile_data.get("semester", ""),
            "batch": profile_data.get("batch", ""),
            "orientation_room": profile_data.get("orientation_room", ""),
            "personal_info": personal_info,
            "hostel_details": hostel_details,
            "attendance": attendance_list,
            "timetable": timetable_schedule,
            "scraped_at": int(time.time()),
            "cookies": "; ".join([f"{c.name}={c.value}" for c in client.cookies.jar])
        }


# ─── Parsing Helpers ─────────────────────────────────────────────────────────

def _parse_profile(html: str, default_id: str) -> Dict[str, str]:
    data = {
        "name": "", "student_id": default_id, "reg_no": "", "program": "",
        "section": "", "email": "", "semester": "", "batch": "",
        "faculty_advisor": "", "academic_advisor": "", "orientation_room": ""
    }
    if not html:
        return data

    soup = BeautifulSoup(html, 'html.parser')
    for td in soup.find_all('td'):
        txt = td.get_text(strip=True)
        nxt = td.find_next_sibling('td')
        val = nxt.get_text(strip=True) if nxt else ""
        if not val:
            continue
        if 'Student Name' in txt: data["name"] = val
        elif 'Student ID' in txt: data["student_id"] = val
        elif 'Register No' in txt: data["reg_no"] = val
        elif 'Program' in txt: data["program"] = val
        elif 'Section' in txt: data["section"] = val
        elif 'Email ID' in txt: data["email"] = val
        elif 'Semester' in txt: data["semester"] = val
        elif 'Batch' in txt: data["batch"] = val
        elif 'Faculty Advisor' in txt: data["faculty_advisor"] = val
        elif 'Academic Advisor' in txt: data["academic_advisor"] = val
        elif 'Orientation Room' in txt: data["orientation_room"] = val
    return data


def _parse_personal(html: str) -> Dict[str, str]:
    info = {
        "dob": "", "gender": "", "blood_group": "", "abc_id": "",
        "father_name": "", "mother_name": "", "parent_contact": "",
        "parent_email": "", "address": "", "pincode": "", "district": "",
        "state": "", "personal_email": "", "mobile": ""
    }
    if not html:
        return info

    soup = BeautifulSoup(html, 'html.parser')
    for td in soup.find_all('td'):
        txt = td.get_text(strip=True)
        nxt = td.find_next_sibling('td')
        val = nxt.get_text(strip=True) if nxt else ""
        if not val:
            continue
        if 'Date of Birth' in txt: info["dob"] = val
        elif 'Gender' in txt: info["gender"] = val
        elif 'Blood Group' in txt: info["blood_group"] = val
        elif 'ABC NUMBER' in txt: info["abc_id"] = val
        elif 'Father Name' in txt: info["father_name"] = val
        elif 'Mother Name' in txt: info["mother_name"] = val
        elif 'Parent Contact' in txt: info["parent_contact"] = val
        elif 'Parent Email' in txt: info["parent_email"] = val
        elif 'Address' in txt and 'Email' not in txt: info["address"] = val
        elif 'Pincode' in txt: info["pincode"] = val
        elif 'District' in txt: info["district"] = val
        elif 'State' in txt: info["state"] = val
        elif 'Personal Email' in txt: info["personal_email"] = val
        elif 'Mobile' in txt: info["mobile"] = val
    return info


def _parse_attendance(html: str) -> list:
    attendance_list = []
    if not html:
        return attendance_list

    soup = BeautifulSoup(html, 'html.parser')
    table = soup.find('table')
    if not table:
        return attendance_list

    for row in table.find_all('tr')[1:]:
        cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
        if len(cols) >= 8 and cols[0] not in ['Total', 'Code', '']:
            try:
                conducted = int(cols[2]) if cols[2].isdigit() else 0
                attended = int(cols[3]) if cols[3].isdigit() else 0
                absent = int(cols[4]) if cols[4].isdigit() else 0
                pct_str = cols[7].replace('%', '').strip()
                pct = float(pct_str) if pct_str else 0.0

                # Bunk and recovery calculation
                # 75% threshold: Attended / Conducted >= 0.75
                # Max buncanble = floor((4 * Attended - 3 * Conducted) / 3)
                safe_bunk = math.floor((4 * attended - 3 * conducted) / 3) if conducted > 0 else 0
                safe_bunk = max(0, safe_bunk)

                recovery_needed = math.ceil((3 * conducted - 4 * attended)) if conducted > 0 else 0
                recovery_needed = max(0, recovery_needed)

                attendance_list.append({
                    "code": cols[0],
                    "title": cols[1],
                    "conducted": conducted,
                    "attended": attended,
                    "absent": absent,
                    "percentage": pct,
                    "safe_bunks": safe_bunk,
                    "recovery_needed": recovery_needed
                })
            except Exception as e:
                logger.warning(f"Error parsing attendance row: {e}")
    return attendance_list


def _parse_timetable(html: str) -> Dict[str, list]:
    schedule = {"Day 1": [], "Day 2": [], "Day 3": [], "Day 4": [], "Day 5": []}
    if not html:
        return schedule

    soup = BeautifulSoup(html, 'html.parser')
    tables = soup.find_all('table')
    if not tables:
        return schedule

    # 1. Parse Course Registration Details Table (tables[1] if exists)
    course_map = {}
    if len(tables) >= 2:
        for row in tables[1].find_all('tr')[1:]:
            cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
            if len(cols) >= 5:
                c_code = cols[0]
                c_name = cols[1]
                c_slot = cols[3]
                c_fac = cols[4].split('[')[0].strip() if cols[4] else ""

                venue_parts = []
                if len(cols) > 6 and cols[6] and cols[6] != '-':
                    venue_parts.append(cols[6])
                if len(cols) > 7 and cols[7] and cols[7] != '-':
                    venue_parts.append(cols[7])
                if len(cols) > 8 and cols[8] and cols[8] != '-':
                    venue_parts.append(cols[8])

                c_venue = " - ".join(venue_parts) if venue_parts else "Main Campus"

                entry = {
                    "title": c_name,
                    "code": c_code,
                    "slot": c_slot,
                    "faculty": c_fac,
                    "venue": c_venue
                }

                course_map[f"{c_code}_{c_slot}"] = entry
                course_map[c_code] = entry
                if any(k in c_name.upper() for k in ['LAB', 'PRACTICE']) or any(s.strip().startswith('P') for s in c_slot.split(',')):
                    course_map[f"{c_code}_LAB"] = entry

    # 2. Parse Day Order Matrix Grid (tables[0])
    for row in tables[0].find_all('tr'):
        cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
        if not cols:
            continue
        first_col = cols[0].strip()
        for day_num in range(1, 6):
            day_key = f"Day {day_num}"
            if day_key.lower() in first_col.lower():
                day_periods = []
                for hour_idx, raw_code in enumerate(cols[1:], start=1):
                    code_clean = raw_code.strip()
                    if not code_clean or code_clean == '-':
                        day_periods.append({
                            "hour": hour_idx,
                            "type": "Free",
                            "title": "Free Period",
                            "code": "",
                            "venue": "-",
                            "faculty": "-"
                        })
                    else:
                        is_lab_period = hour_idx in [7, 8, 9, 10] or code_clean.endswith('L')
                        info = course_map.get(f"{code_clean}_LAB") if (is_lab_period and f"{code_clean}_LAB" in course_map) else course_map.get(code_clean, {})
                        
                        course_title = info.get("title") or code_clean
                        is_lab = 'LAB' in course_title.upper() or 'PRACTICE' in course_title.upper() or code_clean.endswith('L')
                        
                        day_periods.append({
                            "hour": hour_idx,
                            "type": "Lab" if is_lab else "Lecture",
                            "title": course_title,
                            "code": code_clean,
                            "venue": info.get("venue") or "University Building",
                            "faculty": info.get("faculty") or "-"
                        })
                schedule[day_key] = day_periods
                break
    return schedule


def _parse_hostel(html: str) -> Dict[str, str]:
    details = {"block": "", "room": "", "mess": ""}
    if not html:
        return details

    soup = BeautifulSoup(html, 'html.parser')
    for td in soup.find_all('td'):
        txt = td.get_text(strip=True)
        nxt = td.find_next_sibling('td')
        val = nxt.get_text(strip=True) if nxt else ""
        if not val:
            continue
        if 'Hostel' in txt or 'Block' in txt: details["block"] = val
        elif 'Room' in txt: details["room"] = val
        elif 'Mess' in txt: details["mess"] = val
    return details
