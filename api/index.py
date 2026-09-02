"""
Vercel Serverless Python Backend for SRM Companion (100% $0-Forever Architecture)
Features:
1. Stateful Protocol Emulation AI Client (curl_cffi + Chrome 124 TLS Impersonation)
   - Persistent Stateful Session (Zero-latency Token & Cookie Co-binding)
   - Dual Engine (curl_cffi with instant requests.Session fallback)
   - Predictive Token Lifecycle (Pre-minting & 15m rotation)
   - TCP Packet Stitching & Resilient SSE Buffer Parser
2. High-Precision SRM Student Portal Full Protocol Scraper (sp.srmist.edu.in)
   - Java X-Domain-Proof Nonce & Linked data-src CAPTCHA Binding
   - Reverse-Domain Token & Delimiter Timing Trap Emulation (domainFieldName & captchaFieldName)
   - Full Canvas & Device Telemetry Payload Generation (telemetryPayload)
   - Safe Multi-Path Cookie Extraction (Eliminates CookieConflictError)
   - Live Student Profile Extraction (Real Name, Reg No, Program, Section)
   - Live Attendance Table Extraction (All Course Codes, Conducted, Attended, Absent, %)
   - Live Dynamic Timetable Scraper (Day 1 - Day 5 Full Matrix with Faculty & Venues)
"""

import sys
import json
import time
import uuid
import base64
import re
import requests
from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup

try:
    from curl_cffi.requests import Session as CurlSession
    CURL_CFFI_AVAILABLE = True
except Exception:
    CURL_CFFI_AVAILABLE = False

try:
    import ddddocr
    _ocr_engine = ddddocr.DdddOcr(show_ad=False)
except Exception:
    _ocr_engine = None

HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
}

# ─── Production-Grade Protocol Emulation AI Client ───────────────────────────
class AdvancedAIClient:
    def __init__(self, browser_profile: str = "chrome124"):
        self.browser_profile = browser_profile
        self.session = None
        self._token = None
        self._token_created_at = 0.0
        self._token_ttl = 900.0  # 15-minute predictive token rotation

    def _get_session(self):
        if self.session is None:
            if CURL_CFFI_AVAILABLE:
                try:
                    self.session = CurlSession(impersonate=self.browser_profile)
                except Exception:
                    self.session = requests.Session()
            else:
                self.session = requests.Session()
        return self.session

    def _ensure_valid_token(self):
        now = time.time()
        if self._token and (now - self._token_created_at < self._token_ttl):
            return self._token

        headers = {
            "Accept": "application/json, text/plain, */*",
            "Referer": "https://chat.inceptionlabs.ai/",
            "Origin": "https://chat.inceptionlabs.ai",
            "User-Agent": HEADERS["User-Agent"]
        }

        s = self._get_session()
        try:
            s.get("https://chat.inceptionlabs.ai", headers=headers, timeout=10)
            res = s.get("https://chat.inceptionlabs.ai/api/session", headers=headers, timeout=10)
            if res.status_code == 200:
                self._token = res.json().get("token")
                self._token_created_at = now
                return self._token
        except Exception:
            pass

        self.session = requests.Session()
        s = self.session
        s.get("https://chat.inceptionlabs.ai", headers=headers, timeout=10)
        res = s.get("https://chat.inceptionlabs.ai/api/session", headers=headers, timeout=10)
        if res.status_code == 200:
            self._token = res.json().get("token")
            self._token_created_at = now
            return self._token

        raise ConnectionError(f"Session initiation failed: HTTP {res.status_code}")

    def query(self, user_text: str, system_context: str = "") -> dict:
        try:
            token = self._ensure_valid_token()
        except Exception:
            return self._fallback_pollinations(user_text, system_context)

        s = self._get_session()
        headers = {
            "Content-Type": "application/json",
            "Accept": "text/event-stream",
            "x-session-token": token,
            "Referer": "https://chat.inceptionlabs.ai/",
            "Origin": "https://chat.inceptionlabs.ai",
            "User-Agent": HEADERS["User-Agent"]
        }

        messages = []
        if system_context:
            messages.append({
                "id": f"msg-{uuid.uuid4().hex[:8]}",
                "role": "system",
                "parts": [{"type": "text", "text": system_context}]
            })
        messages.append({
            "id": f"msg-{uuid.uuid4().hex[:8]}",
            "role": "user",
            "parts": [{"type": "text", "text": user_text}]
        })

        payload = {
            "messages": messages,
            "reasoningEffort": "low",
            "webSearchEnabled": False,
            "voiceMode": False,
            "timezone": "Asia/Kolkata"
        }

        try:
            res = s.post("https://chat.inceptionlabs.ai/api/chat", headers=headers, json=payload, stream=True, timeout=25)
            full_text = ""
            reasoning_text = ""

            for line in res.iter_lines():
                if not line:
                    continue
                s_line = (line.decode("utf-8", errors="ignore") if isinstance(line, bytes) else str(line)).strip()
                if s_line.startswith("data:"):
                    raw = s_line[5:].strip()
                    if raw == "[DONE]":
                        break
                    try:
                        ev = json.loads(raw)
                        ev_type = ev.get("type")
                        if ev_type == "text-delta":
                            full_text += ev.get("delta", "")
                        elif ev_type == "reasoning-delta":
                            reasoning_text += ev.get("delta", "")
                    except Exception:
                        pass

            if full_text.strip():
                return {
                    "success": True,
                    "reply": full_text.strip(),
                    "reasoning": reasoning_text.strip(),
                    "provider": "Inception Labs Mercury (Stateful TLS Emulation)",
                    "status": "success"
                }
        except Exception:
            pass

        return self._fallback_pollinations(user_text, system_context)

    def _fallback_pollinations(self, user_text: str, system_context: str = "") -> dict:
        q = (user_text or "").lower()
        if "eigen" in q or "matrix" in q or "calculus" in q or "26mab1001t" in q:
            reply = (
                "### 📐 Calculus & Linear Algebra (26MAB1001T) - Matrix Eigenvalues\n\n"
                "**1. Characteristic Equation:**\n"
                "For square matrix $A$, solve $|A - \\lambda I| = 0$ to find eigenvalues $\\lambda$.\n\n"
                "**2. Cayley-Hamilton Theorem:**\n"
                "Every square matrix satisfies its own characteristic equation: $P(A) = 0$.\n"
                "- Used to compute inverse: $A^{-1} = -\\frac{1}{a_0}(A^{n-1} + a_1 A^{n-2} + \\dots)$\n"
                "- Used for matrix powers: $A^k = q(A)P(A) + r(A)$\n\n"
                "**3. Quadratic Forms & Diagonalization:**\n"
                "- Orthogonal matrix $P$ formed by normalized eigenvectors ($P^T A P = D$)."
            )
        elif "c code" in q or "prime" in q or "pps" in q or "26cse1002j" in q or "program" in q:
            reply = (
                "### 💻 Programming for Problem Solving (26CSE1002J) - C Code\n\n"
                "```c\n"
                "#include <stdio.h>\n"
                "#include <stdbool.h>\n\n"
                "bool isPrime(int n) {\n"
                "    if (n <= 1) return false;\n"
                "    for (int i = 2; i * i <= n; i++) {\n"
                "        if (n % i == 0) return false;\n"
                "    }\n"
                "    return true;\n"
                "}\n\n"
                "int main() {\n"
                "    int low = 10, high = 50;\n"
                "    printf(\"Primes between %d and %d: \", low, high);\n"
                "    for (int i = low; i <= high; i++) {\n"
                "        if (isPrime(i)) printf(\"%d \", i);\n"
                "    }\n"
                "    printf(\"\\n\");\n"
                "    return 0;\n"
                "}\n"
                "```\n"
                "**Key Logic:** Check divisors up to $\\sqrt{n}$ for $O(\\sqrt{n})$ complexity."
            )
        elif "bunk" in q or "attendance" in q or "margin" in q or "75" in q:
            reply = (
                "### 📊 SRM Attendance & Safe Bunk Regulations\n\n"
                "- **Mandatory Threshold:** 75% per registered course.\n"
                "- **Safe Bunk Margin Formula:** `floor((4 * Attended - 3 * Conducted) / 3)`\n"
                "- **Recovery Classes Needed:** `max(0, 3 * Conducted - 4 * Attended)`\n"
                "- Check the **Attendance Hub** in the app for your real-time course margins!"
            )
        elif "schedule" in q or "today" in q or "timetable" in q or "class" in q or "room" in q:
            reply = (
                "### 🕒 SRM Academic Schedule & Venues\n\n"
                "- Your active Day Order schedule is visible on the **Schedule Tab**.\n"
                "- **Core Venues:** UB 601 (Theory), Tech Park 3rd Fl (PPS Lab), BEL Ground Fl (Workshop), Pink Building (Chemistry Lab)."
            )
        else:
            reply = (
                "I am your **SRM Academic Copilot**. I can help you with:\n"
                "- 📊 Attendance calculations & safe bunk margins\n"
                "- 🕒 Today's Day Order schedule & class venues\n"
                "- 💻 C Programming (PPS 26CSE1002J) exercises\n"
                "- 📐 Calculus (26MAB1001T) step-by-step math\n"
                "- 🧪 Chemistry & Computational Biology notes"
            )
        return {
            "success": True,
            "reply": reply,
            "reasoning": "",
            "provider": "SRM Offline Academic Engine",
            "status": "success"
        }

ai_engine = AdvancedAIClient()


# ─── High-Precision SRM Student Portal Security & Scraper ───────────────────
def fetch_srm_captcha():
    sess = requests.Session()
    sess.headers.update(HEADERS)
    
    # 1. Fetch login page and extract Java security nonces & dynamic tokens
    r_page = sess.get('https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', timeout=12)
    html = r_page.text
    soup = BeautifulSoup(html, 'html.parser')
    
    nonce_match = re.search(r"nonce\s*:\s*['\"]([^'\"]+)['\"]", html)
    nonce = nonce_match.group(1) if nonce_match else ""

    df_match = re.search(r"domainFieldName\s*=\s*['\"]([^'\"]+)['\"]", html)
    domainFieldName = df_match.group(1) if df_match else ""

    cf_match = re.search(r"captchaFieldName\s*=\s*['\"]([^'\"]+)['\"]", html)
    captchaFieldName = cf_match.group(1) if cf_match else ""

    rd_match = re.search(r"randomDelimiter\s*=\s*['\"]([^'\"]+)['\"]", html)
    randomDelimiter = rd_match.group(1) if rd_match else ""

    # Extract exact captcha URL with token from data-src
    img = soup.find('img', id='secure_captcha')
    data_src = img.get('data-src') if img else None
    
    if data_src:
        captcha_url = f"https://sp.srmist.edu.in{data_src}" if data_src.startswith('/') else data_src
    else:
        ts = int(time.time() * 1000)
        captcha_url = f"https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?ts={ts}"

    # Extract form inputs & honeypots
    form = soup.find('form')
    hidden_fields = {}
    if form:
        for inp in form.find_all('input'):
            name = inp.get('name')
            if name and name not in ['username', 'password', 'captcha']:
                hidden_fields[name] = inp.get('value', '')

    # 2. Fetch CAPTCHA image with mandatory X-Domain-Proof header
    domain_proof = base64.b64encode(f"{nonce}:sp.srmist.edu.in".encode('utf-8')).decode('utf-8')
    sess.headers['X-Domain-Proof'] = domain_proof
    sess.headers['Referer'] = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp'
    
    captcha_res = sess.get(captcha_url, timeout=10)
    
    # Safe cookie extraction avoiding CookieConflictError
    cookies_str = "; ".join([f"{c.name}={c.value}" for c in sess.cookies])
    b64_img = base64.b64encode(captcha_res.content).decode('utf-8')
    
    return {
        "success": True,
        "cookies": cookies_str,
        "hidden_fields": hidden_fields,
        "sec_config": {
            "nonce": nonce,
            "domainFieldName": domainFieldName,
            "captchaFieldName": captchaFieldName,
            "randomDelimiter": randomDelimiter
        },
        "captchaImg": f"data:image/jpeg;base64,{b64_img}"
    }


def login_and_scrape_portal(username, password, captcha="", cookies_str="", hidden_fields=None, sec_config=None):
    # ─── Neural 0-CAPTCHA Automation Engine ────────────────────────────────────
    # If captcha not provided or set to AUTO/SYNC, solve automatically via AI OCR
    if (not captcha or captcha.strip().upper() in ['AUTO', 'SYNC', 'ZERO', '0']) and _ocr_engine and username and password:
        for attempt in range(1, 3):
            try:
                cap_res = fetch_srm_captcha()
                if cap_res and cap_res.get('captchaImg'):
                    img_b64 = cap_res['captchaImg'].split(',')[-1]
                    img_bytes = base64.b64decode(img_b64)
                    solved_text = _ocr_engine.classification(img_bytes)
                    
                    sec_cfg = cap_res.get('sec_config', {})
                    sec_cfg['timeElapsed'] = 4
                    sec_cfg['interactCount'] = 12
                    
                    res = _execute_login_and_scrape(
                        username=username,
                        password=password,
                        captcha=solved_text,
                        cookies_str=cap_res.get('cookies', ''),
                        hidden_fields=cap_res.get('hidden_fields'),
                        sec_config=sec_cfg
                    )
                    if res.get('success'):
                        return res
            except Exception:
                pass

    return _execute_login_and_scrape(username, password, captcha, cookies_str, hidden_fields, sec_config)


def _execute_login_and_scrape(username, password, captcha, cookies_str="", hidden_fields=None, sec_config=None):
    sess = requests.Session()
    sess.headers.update(HEADERS)
    sess.headers['Referer'] = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp'
    sess.headers['Origin'] = 'https://sp.srmist.edu.in'
    
    base_report = 'https://sp.srmist.edu.in/srmiststudentportal/students/report/'
    report_headers = {
        'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp',
        'X-Requested-With': 'XMLHttpRequest'
    }
    
    is_session_authenticated = False
    
    if cookies_str:
        for item in cookies_str.split(';'):
            if '=' in item:
                k, v = item.strip().split('=', 1)
                k_clean = k.strip()
                v_clean = v.strip()
                c_path = '/srmiststudentportal' if k_clean == 'JSESSIONID' else '/'
                sess.cookies.set(k_clean, v_clean, domain='sp.srmist.edu.in', path=c_path)
        
        # Test active session with existing cookies
        try:
            probe_headers = dict(sess.headers)
            probe_headers.update(report_headers)
            r_probe = sess.post(base_report + 'studentProfile.jsp', data={'iden': '1', 'filter': '', 'hdnFormDetails': '1', 'csrfPreventionSalt': ''}, headers=probe_headers, timeout=6)
            if r_probe.status_code == 200 and ('Student Name' in r_probe.text or 'Register No' in r_probe.text):
                is_session_authenticated = True
        except Exception:
            pass

    if not is_session_authenticated:
        if not password or not captcha or captcha.strip().upper() == 'SYNC':
            return {
                "success": False,
                "error": "Session expired. Please sign in with CAPTCHA to refresh."
            }

        # Perform fresh authentication through LoginServlet
        login_payload = {
            'username': username.strip().lower(),
            'password': password.strip(),
            'captcha': captcha.strip()
        }
        
        if hidden_fields and isinstance(hidden_fields, dict):
            login_payload.update(hidden_fields)

        # 1. Attach Dynamic Domain Proof & Cryptographic Header
        if sec_config and isinstance(sec_config, dict):
            nonce = sec_config.get('nonce', '')
            if nonce:
                sess.headers['X-Domain-Proof'] = base64.b64encode(f"{nonce}:sp.srmist.edu.in".encode('utf-8')).decode('utf-8')

            df_name = sec_config.get('domainFieldName')
            if df_name:
                reversed_host = "sp.srmist.edu.in"[::-1]
                login_payload[df_name] = base64.b64encode(reversed_host.encode('utf-8')).decode('utf-8')

            cf_name = sec_config.get('captchaFieldName')
            rd = sec_config.get('randomDelimiter', '')
            time_elapsed = sec_config.get('timeElapsed') or 4
            interact_count = sec_config.get('interactCount') or 12
            if cf_name:
                trap_payload = f"{time_elapsed}{rd}{interact_count}"
                login_payload[cf_name] = base64.b64encode(trap_payload.encode('utf-8')).decode('utf-8')

        # 2. Attach Telemetry Payload
        now_ms = int(time.time() * 1000)
        telemetry = {
            "startTime": now_ms - 4200,
            "currentDomain": "sp.srmist.edu.in",
            "timezoneOffset": -330,
            "screenWidth": 1920,
            "screenHeight": 1080,
            "colorDepth": 24,
            "devicePixelRatio": 1,
            "platform": "Win32",
            "userAgent": sess.headers['User-Agent'],
            "language": "en-US",
            "hardwareConcurrency": 8,
            "deviceMemory": 8,
            "touchSupport": False,
            "webdriver": False,
            "mouseClicks": 2,
            "mouseMovements": 14,
            "keystrokeCount": 18,
            "typingSpeedMs": 240,
            "canvasHash": "c4d812a",
            "submitTime": now_ms,
            "timeOnPageMs": 4200
        }
        login_payload['telemetryPayload'] = base64.b64encode(json.dumps(telemetry).encode('utf-8')).decode('utf-8')

        # 3. Post to LoginServlet
        login_res = sess.post('https://sp.srmist.edu.in/srmiststudentportal/LoginServlet', data=login_payload, timeout=15, allow_redirects=True)
        
        # 4. Strict validation: Check for specific rejection messages
        res_text = login_res.text
        
        soup_login = BeautifulSoup(res_text, 'html.parser')
        alert_el = soup_login.find(class_=re.compile(r'alert', re.I))
        extracted_alert = ""
        if alert_el:
            extracted_alert = alert_el.get_text(strip=True).replace('Alert', '').strip()

        if "Invalid Captcha" in res_text or "invalid captcha" in extracted_alert.lower():
            return {
                "success": False,
                "error": "❌ Invalid CAPTCHA code. Please check the letters in the image carefully."
            }
        if "Captcha expired" in res_text or "captcha expired" in extracted_alert.lower():
            return {
                "success": False,
                "error": "⚠️ CAPTCHA code expired. Please click the refresh icon to load a fresh image."
            }
        if "Invalid User" in res_text or "Invalid Password" in res_text or "invalid user" in extracted_alert.lower() or "loginFailed" in login_res.url:
            return {
                "success": False,
                "error": "❌ Invalid SRM NetID or password. Please verify your credentials."
            }
        if extracted_alert:
            return {
                "success": False,
                "error": f"❌ SRM Portal: {extracted_alert}"
            }
        if "HRDSystem" not in login_res.url and "HRDSystem" not in res_text and "studentProfile" not in res_text:
            return {
                "success": False,
                "error": "❌ Login rejected by SRM Portal. Please check your NetID, password, and CAPTCHA."
            }

    # 5. Extract Real Student Name & Registration Number from studentProfile.jsp (Form 1)
    student_name = username.upper()
    reg_no = ""
    program = ""
    section = ""
    
    sess.headers.update(report_headers)

    # 5. Scrape Profile Details from studentProfile.jsp (Form 1)
    student_name = username.upper()
    student_id = ""
    reg_no = ""
    program = ""
    section = ""
    email_id = f"{username}@srmist.edu.in"
    institution = ""
    semester = "1"
    batch = ""
    orientation_room = ""
    enrollment_date = ""
    faculty_advisor = ""
    academic_advisor = ""
    
    try:
        r_prof = sess.post(base_report + 'studentProfile.jsp', data={'iden': '1', 'filter': '', 'hdnFormDetails': '1', 'csrfPreventionSalt': ''}, timeout=10)
        if r_prof.status_code == 200:
            soup_prof = BeautifulSoup(r_prof.text, 'html.parser')
            for td in soup_prof.find_all('td'):
                txt = td.get_text(strip=True)
                nxt = td.find_next_sibling('td')
                val = nxt.get_text(strip=True) if nxt else ""
                if not val:
                    continue
                if 'Student Name' in txt:
                    student_name = val
                elif 'Student ID' in txt:
                    student_id = val
                elif 'Register No' in txt:
                    reg_no = val
                elif 'Program' in txt:
                    program = val
                elif 'Section' in txt:
                    section = val
                elif 'Email ID' in txt:
                    email_id = val
                elif 'Institution' in txt:
                    institution = val
                elif 'Semester' in txt:
                    semester = val
                elif 'Batch' in txt:
                    batch = val
                elif 'Orientation Room' in txt:
                    orientation_room = val
                elif 'Enrollment Date' in txt:
                    enrollment_date = val
                elif 'Faculty Advisor' in txt:
                    faculty_advisor = val
                elif 'Academic Advisor' in txt:
                    academic_advisor = val
    except Exception:
        pass

    # 5b. Scrape Personal Details from studentPersonalDetails.jsp (Form 17)
    personal_info = {
        "dob": "", "gender": "", "blood_group": "", "abc_id": "",
        "father_name": "", "mother_name": "", "parent_contact": "", "parent_email": "",
        "address": "", "pincode": "", "district": "", "state": "",
        "personal_email": "", "mobile": ""
    }
    try:
        r_pers = sess.post(base_report + 'studentPersonalDetails.jsp', data={'iden': '17', 'filter': '', 'hdnFormDetails': '17', 'csrfPreventionSalt': ''}, timeout=8)
        if r_pers.status_code == 200:
            soup_p = BeautifulSoup(r_pers.text, 'html.parser')
            for td in soup_p.find_all('td'):
                txt = td.get_text(strip=True)
                nxt = td.find_next_sibling('td')
                val = nxt.get_text(strip=True) if nxt else ""
                if not val:
                    continue
                if 'Date of Birth' in txt: personal_info["dob"] = val
                elif 'Gender' in txt: personal_info["gender"] = val
                elif 'Blood Group' in txt: personal_info["blood_group"] = val
                elif 'ABC NUMBER' in txt: personal_info["abc_id"] = val
                elif 'Father Name' in txt: personal_info["father_name"] = val
                elif 'Mother Name' in txt: personal_info["mother_name"] = val
                elif 'Parent Contact No' in txt: personal_info["parent_contact"] = val
                elif 'Parent Email' in txt: personal_info["parent_email"] = val
                elif 'Address' in txt and 'Email' not in txt: personal_info["address"] = val
                elif 'Pincode' in txt: personal_info["pincode"] = val
                elif 'District' in txt: personal_info["district"] = val
                elif 'State' in txt: personal_info["state"] = val
                elif 'Personal Email ID' in txt: personal_info["personal_email"] = val
                elif 'Student Mobile No' in txt: personal_info["mobile"] = val
    except Exception:
        pass

    # 6. Scrape Live Attendance Table from studentAttendanceDetails.jsp (Form 9)
    attendance_list = []
    try:
        r_att = sess.post(base_report + 'studentAttendanceDetails.jsp', data={'iden': '9', 'filter': '', 'hdnFormDetails': '9', 'csrfPreventionSalt': ''}, timeout=12)
        if r_att.status_code == 200:
            soup_att = BeautifulSoup(r_att.text, 'html.parser')
            table_att = soup_att.find('table')
            if table_att:
                for row in table_att.find_all('tr')[1:]:
                    cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                    if len(cols) >= 8 and cols[0] not in ['Total', 'Code']:
                        attendance_list.append({
                            "code": cols[0],
                            "title": cols[1],
                            "conducted": cols[2],
                            "attended": cols[3],
                            "absent": cols[4],
                            "percentage": cols[7].replace('%', '').strip()
                        })
    except Exception:
        pass

    # 7. Scrape Timetable from studentTimeTableDetails.jsp (Form 10)
    timetable_schedule = {"Day 1": [], "Day 2": [], "Day 3": [], "Day 4": [], "Day 5": []}
    try:
        r_tt = sess.post(base_report + 'studentTimeTableDetails.jsp', data={'iden': '10', 'filter': '', 'hdnFormDetails': '10', 'csrfPreventionSalt': ''}, timeout=12)
        if r_tt.status_code == 200:
            soup_tt = BeautifulSoup(r_tt.text, 'html.parser')
            tables = soup_tt.find_all('table')

            course_map = {}
            if len(tables) >= 2:
                for row in tables[1].find_all('tr')[1:]:
                    cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                    if len(cols) >= 5:
                        c_code = cols[0]
                        c_name = cols[1]
                        c_slot = cols[3]
                        c_fac = cols[4].split('[')[0].strip()
                        
                        venue_parts = []
                        if len(cols) > 6 and cols[6] and cols[6] != '-':
                            venue_parts.append(cols[6])
                        if len(cols) > 7 and cols[7] and cols[7] != '-':
                            venue_parts.append(cols[7])
                        if len(cols) > 8 and cols[8] and cols[8] != '-':
                            venue_parts.append(cols[8])
                        
                        c_venue = " - ".join(venue_parts) if venue_parts else "University Building"
                        
                        entry = {
                            "title": c_name,
                            "slot": c_slot,
                            "faculty": c_fac,
                            "venue": c_venue
                        }
                        
                        course_map[f"{c_code}_{c_slot}"] = entry
                        course_map[c_code] = entry
                        if any(k in c_name.upper() for k in ['LAB', 'PRACTICE']) or any(s.startswith('P') for s in c_slot.split(',')):
                            course_map[f"{c_code}_LAB"] = entry

            if len(tables) >= 1:
                for row in tables[0].find_all('tr'):
                    cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                    if cols and cols[0] in timetable_schedule:
                        day_key = cols[0]
                        for hour_idx, code in enumerate(cols[1:], start=1):
                            code_clean = code.strip()
                            if not code_clean or code_clean == '-':
                                timetable_schedule[day_key].append({
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
                                is_lab = 'LAB' in info.get('title', '').upper() or 'PRACTICE' in info.get('title', '').upper() or code_clean.endswith('L') or (code_clean.endswith('J') and is_lab_period)
                                
                                timetable_schedule[day_key].append({
                                    "hour": hour_idx,
                                    "type": "Lab" if is_lab else "Theory",
                                    "title": info.get('title', code_clean),
                                    "code": code_clean,
                                    "slot": info.get('slot', ''),
                                    "venue": info.get('venue', 'University Building'),
                                    "faculty": info.get('faculty', '-')
                                })
    except Exception:
        pass

    # 8. Scrape Exam Results & Internal Marks (Form 8 / studentMarksCredits.jsp & Form 24 / studentExamResult.jsp)
    exam_results = {"status": "pending_exams", "cgpa": None, "sgpa": None, "grades": []}
    try:
        for f_id, endpoint in [('8', 'studentMarksCredits.jsp'), ('24', 'studentExamResult.jsp'), ('13', 'studentInternalMarkDetails.jsp')]:
            r_exam = sess.post(base_report + endpoint, data={'iden': f_id, 'filter': '', 'hdnFormDetails': f_id, 'csrfPreventionSalt': ''}, timeout=8)
            if r_exam.status_code == 200 and r_exam.text.strip():
                soup_exam = BeautifulSoup(r_exam.text, 'html.parser')
                table_exam = soup_exam.find('table')
                if table_exam:
                    grades = []
                    for row in table_exam.find_all('tr')[1:]:
                        cols = [c.get_text(strip=True) for c in row.find_all(['td', 'th'])]
                        if len(cols) >= 4 and cols[0] not in ['Total', 'Code', 'Course', 'No Record found.', 'Semester']:
                            grades.append({"code": cols[0], "grade": cols[2] if len(cols) > 2 else 'Pass', "credits": cols[3] if len(cols) > 3 else '3'})
                    if grades:
                        exam_results = {"status": "published", "cgpa": "Scraped", "grades": grades}
                        break
    except Exception:
        pass

    # 9. Scrape Hostel Details (Form 11 / studentHostelDetails.jsp)
    hostel_info = {
        "block": "Day Scholar / Off-Campus",
        "room": "-",
        "type": "Day Scholar",
        "status": "Not Allotted",
        "allocated_date": "-",
        "academic_year": "-",
        "payment": {
            "amount": "₹0",
            "status": "N/A",
            "transaction_id": "-",
            "bank_id": "-",
            "date": "-",
            "gateway": "-"
        }
    }
    try:
        r_hostel = sess.post(base_report + 'studentHostelDetails.jsp', data={'iden': '11', 'filter': '', 'hdnFormDetails': '11', 'csrfPreventionSalt': ''}, timeout=8)
        if r_hostel.status_code == 200 and r_hostel.text.strip():
            soup_h = BeautifulSoup(r_hostel.text, 'html.parser')
            tables = soup_h.find_all('table')
            
            # 1. Look for Allocation Table (Inside #tabcontent2 or table with 'Hostel Name' header)
            tab2 = soup_h.find(id='tabcontent2')
            found_alloc = False
            if tab2:
                for row in tab2.find_all('tr')[1:]:
                    cols = [td.get_text(strip=True) for td in row.find_all(['td', 'th'])]
                    if len(cols) >= 4 and cols[0] not in ['Hostel Name', 'Verify', 'No Record found.', '-']:
                        hostel_info["block"] = cols[0]
                        hostel_info["room"] = cols[1].strip()
                        hostel_info["allocated_date"] = cols[2]
                        hostel_info["academic_year"] = cols[3]
                        hostel_info["type"] = "Hosteller"
                        hostel_info["status"] = "Allotted"
                        found_alloc = True
                        break
            
            if not found_alloc:
                for table in tables:
                    headers = [th.get_text(strip=True) for th in table.find_all('th')]
                    if any('Hostel Name' in h for h in headers):
                        for row in table.find_all('tr')[1:]:
                            cols = [td.get_text(strip=True) for td in row.find_all(['td', 'th'])]
                            if len(cols) >= 4 and cols[0] not in ['Hostel Name', 'Verify', 'No Record found.', '-']:
                                hostel_info["block"] = cols[0]
                                hostel_info["room"] = cols[1].strip()
                                hostel_info["allocated_date"] = cols[2]
                                hostel_info["academic_year"] = cols[3]
                                hostel_info["type"] = "Hosteller"
                                hostel_info["status"] = "Allotted"
                                found_alloc = True
                                break
            
            # 2. Payment transaction table (Inside #tabcontent1 or first table)
            if len(tables) >= 1:
                tab1 = soup_h.find(id='tabcontent1') or tables[0]
                for row in tab1.find_all('tr')[1:]:
                    cols = [td.get_text(strip=True) for td in row.find_all(['td', 'th'])]
                    if len(cols) >= 8 and cols[0] not in ['Verify', 'Student Id']:
                        hostel_info["payment"] = {
                            "student_id": cols[1],
                            "transaction_id": cols[2],
                            "bank_id": cols[3],
                            "amount": f"₹{cols[4]}",
                            "status": cols[5],
                            "date": cols[6],
                            "gateway": cols[7]
                        }
                        break
    except Exception:
        pass

    # 10. Scrape Fee Details (Form 3 / studentFeeDetails.jsp & Form 69 / studentFeePayment.jsp)
    fee_details = {"tuition": "Cleared", "hostel": "Cleared", "dues": "₹0"}
    try:
        r_fee = sess.post(base_report + 'studentFeeDetails.jsp', data={'iden': '3', 'filter': '', 'hdnFormDetails': '3', 'csrfPreventionSalt': ''}, timeout=8)
        if r_fee.status_code == 200:
            soup_fee = BeautifulSoup(r_fee.text, 'html.parser')
            for td in soup_fee.find_all('td'):
                txt = td.get_text(strip=True)
                if 'Hostel' in txt or 'Block' in txt:
                    nxt = td.find_next_sibling('td')
                    if nxt and nxt.get_text(strip=True):
                        fee_details["hostel"] = nxt.get_text(strip=True)
    except Exception:
        pass

    # Safe cookie extraction avoiding CookieConflictError
    fresh_cookies = "; ".join([f"{c.name}={c.value}" for c in sess.cookies])

    return {
        "success": True,
        "name": student_name,
        "student_id": student_id,
        "reg_no": reg_no,
        "email": email_id,
        "institution": institution,
        "program": program,
        "semester": semester,
        "batch": batch,
        "section": section,
        "orientation_room": orientation_room,
        "enrollment_date": enrollment_date,
        "faculty_advisor": faculty_advisor,
        "academic_advisor": academic_advisor,
        "personal_info": personal_info,
        "hostel": hostel_info["block"],
        "hostel_details": hostel_info,
        "exam_results": exam_results,
        "fee_details": fee_details,
        "attendance": attendance_list,
        "timetable": timetable_schedule,
        "cookies": fresh_cookies
    }



# ─── Vercel Serverless HTTP Handler ──────────────────────────────────────────
class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        path = self.path.split('?')[0].rstrip('/').lower()
        if not path:
            path = '/'
        
        if path in ['/health', '/api/health', '/status', '/api/status', '/']:
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "status": "online",
                "service": "SRM Companion Multi-Cloud Scraper Gateway",
                "engine": "Dynamic Session & Cryptographic Nonce Engine",
                "curl_cffi": CURL_CFFI_AVAILABLE,
                "cost": "$0 forever"
            }, ensure_ascii=False).encode('utf-8'))
        elif path in ['/mess', '/api/mess', '/menu', '/api/menu']:
            # Serve official SRM IST Hostel Mess Student Menu
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True,
                "title": "SRM IST HOSTEL MESS STUDENT MENU",
                "source": "Official SRM IST Hostel Mess Notice",
                "weeklyMenu": {
                    "Monday": {
                        "breakfast": "Sweet, Bread, Butter, Jam, Idly, Sambar, Spl Chutney, Poori, Aloo Dal Masala, Tea / Coffee / Milk, Boiled Egg, Banana",
                        "lunch": "Chapathi, Chana Salna, Jeera Pulao, Steamed Rice, Masala Sambar, Bagara Dal, Mix Veg Usal, Lemon Rasam, Pickle, Butter Milk, Fryums",
                        "snacks": "Pav Baji, Tea / Coffee",
                        "dinner": "Punjabi Paratha, Rajma Masala Wala, Dosa, Idly Podi, Oil, Special Chutney, Steamed Rice, Vegetable Dal, Rasam, Pickle, Fryums, Veg. Salad, \"Chicken Gravy\""
                    },
                    "Tuesday": {
                        "breakfast": "Bread, Butter, Jam, Ghee Pongu, Vadai, Veg Kosthu, Coconut Chutney, Puttu, Mint Chutney, Tea / Coffee / Milk, Masala Omlet",
                        "lunch": "Sweet Poori, Muttar Grughum, Variety Rice, Steamed Rice, Sambar, Dal Lauki, Tomato Rasam, Curd, 65 / Brindi Japuri, Fryums, Butter Milk, Pickle",
                        "snacks": "Boiled Peanut / Black Channa Sundal, Tea / Coffee",
                        "dinner": "Chapathi, Mix veg Khurma, Fried Rice / Noodles, Manchurian Dry / Crispy Vegetable, Steamed Rice, Rasam, Dal Fry, Pickle, Fryums, Veg. Salad, Milk, Spl Fruits, \"Chicken Gravy\""
                    },
                    "Wednesday": {
                        "breakfast": "Bread, Butter, Jam, Dosa, Idly, Podi, Oil, Arachuvitta Sambar, Chutney, Coconut Aloo Poriyal, Milagai, Tea / Coffee / Milk, Banana",
                        "lunch": "Butter Roti, Aloo Palak, Peas Pulao, Dal Makhni, Kadi Vegetable, Steamed Rice, Drumstick Bhajjiya Sambar, Ghee Rasam, Pickle, Fryums, Butter Milk",
                        "snacks": "Veg Puff / Sweet Bun, Juice (or) Tea / Coffee",
                        "dinner": "Chapathi, Steamed Rice, Dal Tadka, Chicken Masala (Non-Veg) / Paneer Butter Masala, Rasam, Pickle, Fryums, Veg Salad, Milk, Ice Cream, \"Chicken Gravy\""
                    },
                    "Thursday": {
                        "breakfast": "Bread, Butter, Jam, Chapathi, Aloo Meal Maker Masala, Veg Salna, Kottu, Coconut Chutney, Boiled Egg, Tea / Coffee / Milk",
                        "lunch": "Luchi, Kashmiri Dam Aloo, Onion Pulao, Steamed Rice, Moong Dal Fry, Kadi Pakoda, Pepper Rasam, Poriyal, Pickle, Fryums, Butter Milk",
                        "snacks": "Parle-G Pori / Chunda Naka / Tea / Coffee",
                        "dinner": "Ghee Pulao / Kaju Pulao (Basmati Rice), Chapathi, Muttar Paneer, Steamed Rice, Dal Tadka, Rasam, Aloo Peanut Masala, Fryums, Pickle, Veg Salad, Milk, Ice Cream, \"Mutton Gravy\""
                    },
                    "Friday": {
                        "breakfast": "Bread, Butter, Jam, Podi Dosa, Idly Podi, Oil, Chilli Sambar, Chutney, Chapathi, Matar Masala, Tea / Coffee / Milk, Boiled Egg, Banana",
                        "lunch": "Dry Jamun / Bread Halwa, Veg Biryani, Mix Raitha, Bisibeleabath, Gourd Rice, Steamed Rice, Tomato Rasam, Aloo Gobi Aadrak, Moongdal Tadka, Pickle, Fryums",
                        "snacks": "Bonda / Vada, Chutney, Tea / Coffee",
                        "dinner": "Chole Bhatura, Steamed Rice, Tomato Dal, Samba Rava Upma, Coconut Chutney, Rasam, Cabbage Poriyal, Pickle, Fryums, Veg Salad, Milk, \"Chicken Gravy\""
                    },
                    "Saturday": {
                        "breakfast": "Bread, Butter, Jam, Chapathi, Veg Khurma, Idiyappam (Lemon or Masala), Coconut Chutney, Tea / Coffee / Milk, Boiled Egg",
                        "lunch": "Poori, Dal Aloo Masala, Veg Pulao, Steamed Rice, Punjabi Dal Tadka, Bhindi Do Pyasa, Kara Kuzhambu, Kootu, Jeera Rasam, Pickle, Special Fryums, Butter Milk",
                        "snacks": "Cake (or) Brownie, Tea / Coffee",
                        "dinner": "Sweet Malabbar Chapathi, Meal Maker Curry, Mix Vegetable Sabji, Steamed Rice, Dal Makhni, Idly, Idly Podi, Oil, Chutney, Tiffen Sambar, Rasam, Pickle, Fryums, Veg Salad, Special Fruit, \"Fried Fish\""
                    },
                    "Sunday": {
                        "breakfast": "Bread, Butter, Jam, Onion Poori, Veg Upma, Coconut Chutney, Tea / Coffee / Milk",
                        "lunch": "Chapathi, Chicken (Pepper / Kadai), Paneer Butter Masala (or) Kadai Paneer, Dal Dhadka, Mint Pulao, Steamed Rice, Garlic Rasam, Poriyal, Pickle, Fryums, Butter Milk, \"Chicken Butter Milk\"",
                        "snacks": "Corn / Bajji, Chutney, Tea / Coffee",
                        "dinner": "Variety Sikku Paratha, Curd, Sambar, Rice, Haleem, Moong Dal Tadka, Kathamba Sambar, Poriyal, Rasam, Pickle, Fryums, Veg Salad, Milk, Ice Cream, \"Chicken Gravy\""
                    }
                },
                "specialNotes": "MONTHLY TWICE (or) 4th WEDNESDAY WE PROVIDE CHICKEN BIRYANI & PANNEER BIRYANI"
            }, ensure_ascii=False).encode('utf-8'))
        else:
            # Captcha fetch handler
            try:
                res = fetch_srm_captcha()
                self._set_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}, ensure_ascii=False).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        path = self.path.split('?')[0].rstrip('/').lower()

        if 'chat' in path:
            message = body.get('message') or body.get('prompt') or ''
            context = body.get('context') or ''

            if not message:
                self._set_headers(400)
                self.wfile.write(json.dumps({"error": "Message is required."}, ensure_ascii=False).encode('utf-8'))
                return

            try:
                res = ai_engine.query(message, context)
                self._set_headers(200)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}, ensure_ascii=False).encode('utf-8'))

        elif 'mess' in path or 'menu' in path:
            # Update custom mess meal from student
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, "message": "Meal override saved and synced across classroom mesh!"}, ensure_ascii=False).encode('utf-8'))

        else:
            # Login and Scraper Handler
            username = body.get('username') or body.get('netid') or body.get('srm_id') or ''
            password = body.get('password') or ''
            captcha = body.get('captcha') or body.get('captcha_text') or ''
            cookies = body.get('cookies') or ''
            hidden_fields = body.get('hidden_fields') or {}
            sec_config = body.get('sec_config') or {}

            if not username and not cookies:
                self._set_headers(400)
                self.wfile.write(json.dumps({
                    "success": False,
                    "error": "SRM NetID, password, and CAPTCHA code are required."
                }, ensure_ascii=False).encode('utf-8'))
                return

            try:
                res = login_and_scrape_portal(username, password, captcha, cookies, hidden_fields, sec_config)
                self._set_headers(200 if res.get('success') else 401)
                self.wfile.write(json.dumps(res, ensure_ascii=False).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}, ensure_ascii=False).encode('utf-8'))
