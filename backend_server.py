"""
SRM Companion - High-Precision Schedule Override & Live Class Cancellation Engine
Powered by Inception Labs Mercury AI Engine + SRM Portal Live Scraper
Student: Karanam Sai Prasanth (RA2611026010283)
"""

import sys
import os
import json
import uuid
import re
import time
import requests
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

_active_sessions = {}

# ── SRM Portal Scraper Integration ──────────────────────────────────────────
try:
    from srm_scraper import load_scraped_data, start_background_scraper
    SCRAPER_AVAILABLE = True
    print("[Backend] SRM Portal Scraper loaded ✅")
except ImportError as _e:
    SCRAPER_AVAILABLE = False
    print(f"[Backend] Scraper not available: {_e}")
    def load_scraped_data():
        return {"status": "not_installed", "attendance": [], "circulars": [], "calendar": []}
    def start_background_scraper(**kw): pass

# Inception Labs AI Client
class InceptionLabsClient:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://chat.inceptionlabs.ai/',
        }
        self.token = None
        self.messages = []

    def refresh_token(self):
        try:
            self.session.get('https://chat.inceptionlabs.ai', headers=self.headers, timeout=10)
            res = self.session.get('https://chat.inceptionlabs.ai/api/session', headers=self.headers, timeout=10)
            if res.status_code == 200:
                self.token = res.json().get('token')
                return True
        except Exception as e:
            print("Inception token error:", e)
        return False

    def get_reply(self, user_text, system_context=None):
        if not self.token:
            if not self.refresh_token():
                return "Error: Unable to connect to Inception Labs session."

        prompt_history = []
        if system_context:
            prompt_history.append({
                "id": f"msg-{uuid.uuid4().hex[:8]}",
                "role": "system",
                "parts": [{"type": "text", "text": system_context}]
            })

        prompt_history.extend(self.messages[-8:])
        prompt_history.append({
            "id": f"msg-{uuid.uuid4().hex[:8]}",
            "role": "user",
            "parts": [{"type": "text", "text": user_text}]
        })

        chat_headers = {
            **self.headers,
            'Content-Type': 'application/json',
            'x-session-token': self.token,
        }

        payload = {
            "messages": prompt_history,
            "reasoningEffort": "medium",
            "webSearchEnabled": False,
            "voiceMode": False,
            "timezone": "Asia/Kolkata"
        }

        try:
            res = self.session.post('https://chat.inceptionlabs.ai/api/chat', headers=chat_headers, json=payload, stream=True, timeout=20)
            if res.status_code != 200:
                if self.refresh_token():
                    chat_headers['x-session-token'] = self.token
                    res = self.session.post('https://chat.inceptionlabs.ai/api/chat', headers=chat_headers, json=payload, stream=True, timeout=20)

            if res.status_code != 200:
                return f"Error from Inception Labs (HTTP {res.status_code})"

            full_reply = ""
            for line in res.iter_lines():
                if not line:
                    continue
                decoded = line.decode('utf-8', errors='ignore')
                if decoded.startswith('data: '):
                    data_str = decoded[6:]
                    if data_str == '[DONE]':
                        break
                    try:
                        event = json.loads(data_str)
                        if event.get('type') == 'text-delta':
                            full_reply += event.get('delta', '')
                    except Exception:
                        pass

            self.messages.append({"id": f"msg-{uuid.uuid4().hex[:8]}", "role": "user", "parts": [{"type": "text", "text": user_text}]})
            self.messages.append({"id": f"msg-{uuid.uuid4().hex[:8]}", "role": "assistant", "parts": [{"type": "text", "text": full_reply}]})
            return full_reply
        except Exception as e:
            return f"Inception Error: {str(e)}"

ai_engine = InceptionLabsClient()
ai_engine.refresh_token()

# Active Schedule Dynamic Overrides Store (Live Timetable Modifications)
SCHEDULE_OVERRIDES = [
    {
        "id": "ov-bio-today",
        "type": "CLASS_CANCELLED",
        "subject": "Introduction to Computational Biology",
        "code": "26BTB1001T",
        "dayOrder": "Day 2",
        "hour": 8,
        "reason": "No bio cls for today (Optional hour cancelled by Prof. Sivasankareswari)",
        "sourceGroup": "P1 26-30 CSE AI ML BIO",
        "timestamp": "Today"
    }
]

# Structured Faculty Notices Store
STRUCTURED_ANNOUNCEMENTS = [
    {
        "id": "ann-1",
        "subject": "Introduction to Computational Biology",
        "code": "26BTB1001T",
        "category": "Schedule / Cancellation",
        "title": "Optional Hours & Today's Class Cancelled",
        "detail": "Prof. Sivasankareswari: Day Order 2 (4:00 PM) optional class cancelled for today. Day Order 3 (9:45 AM) is also optional.",
        "faculty": "Prof. Sivasankareswari E",
        "venue": "UB 601 (6th Floor)",
        "sourceGroup": "P1 26-30 CSE AI ML BIO",
        "priority": "HIGH",
        "timestamp": "Today"
    },
    {
        "id": "ann-2",
        "subject": "Chemistry for Computer Science",
        "code": "26CYB1002J",
        "category": "Xerox / Lab Venue",
        "title": "Chemistry Lab Venue & Observation Book",
        "detail": "Reach Pink Coloured building opposite to Main University Building, 1st Floor Lab 4. Bring lab manual and observation notebook.",
        "faculty": "Dr. John Bosco A / Archit Jain",
        "venue": "Pink Building 1st Fl Lab 4",
        "sourceGroup": "AI ML P1 Chemistry",
        "priority": "HIGH",
        "timestamp": "Today"
    },
    {
        "id": "ann-3",
        "subject": "Programming for Problem Solving",
        "code": "26CSE1002J",
        "category": "Assignment / Code",
        "title": "PPS Lab Program 3 & 4 Submissions",
        "detail": "Complete C programs on pointers, 1D arrays, and recursion with sample outputs. Submit in observation book.",
        "faculty": "Sheeba Rachel S",
        "venue": "Tech Park 3rd Fl Lab",
        "sourceGroup": "P1 C programming",
        "priority": "MEDIUM",
        "timestamp": "Recent"
    },
    {
        "id": "ann-4",
        "subject": "Workshop Practice",
        "code": "26MEE1001L",
        "category": "Xerox / Materials",
        "title": "Sheet Metal Manual Printout",
        "detail": "Get Sheet Metal & Fitting manuals printed from Tech Park / Java Xerox before Day 3 lab session.",
        "faculty": "Dr. Manoj Samson R",
        "venue": "BEL Ground Fl Sheet Metal Lab",
        "sourceGroup": "Batch 1 Official",
        "priority": "HIGH",
        "timestamp": "Upcoming"
    },
    {
        "id": "ann-5",
        "subject": "Calculus and Linear Algebra",
        "code": "26MAB1001T",
        "category": "Exam / Tutorial",
        "title": "Unit 1 Eigenvalues & Cayley-Hamilton Tutorial",
        "detail": "Tutorial problems for Unit 1 Matrix Diagonalization and Quadratic forms to be submitted before CLA-1.",
        "faculty": "Dr. N. Parvathi",
        "venue": "UB 601 (Slot B)",
        "sourceGroup": "AI ML P1 MATHS 26-27 odd",
        "priority": "MEDIUM",
        "timestamp": "Recent"
    }
]

def analyze_and_apply_schedule_changes(raw_text, group_name):
    prompt = f"""
You are a strict, highly careful schedule auditor for 1st-year SRM student Karanam Sai Prasanth.
His subjects:
- 26CSE1002J: Programming for Problem Solving (PPS)
- 26MAB1001T: Calculus and Linear Algebra
- 26CYB1002J: Chemistry for Computer Science
- 26BTB1001T: Computational Biology
- 26MEE1001L: Workshop Practice

Analyze if this WhatsApp message from faculty/CR announces a CLASS CANCELLATION, ROOM CHANGE, HOLIDAY, or RESCHEDULING:
"{raw_text}"

Output STRICT JSON only:
{{
  "isScheduleChange": true/false,
  "type": "CLASS_CANCELLED / ROOM_CHANGE / DECLARED_HOLIDAY / EXTRA_CLASS",
  "subject": "Subject Name",
  "code": "Course Code or null",
  "dayOrder": "Day 1 / Day 2 / Day 3 / Day 4 / Day 5 / Today / Tomorrow",
  "hour": Hour number (1 to 8) or null,
  "newVenue": "New Room Number or null",
  "reason": "Clear 1-line reason with faculty/source",
  "confidence": "HIGH / MEDIUM / LOW"
}}
"""
    ai_reply = ai_engine.get_reply(prompt)
    match = re.search(r'\{[\s\S]*\}', ai_reply)
    if match:
        try:
            d = json.loads(match.group(0))
            if d.get("isScheduleChange") and d.get("confidence") in ["HIGH", "MEDIUM"]:
                override = {
                    "id": f"ov-{uuid.uuid4().hex[:8]}",
                    "type": d.get("type", "CLASS_CANCELLED"),
                    "subject": d.get("subject", "General"),
                    "code": d.get("code", "GENERAL"),
                    "dayOrder": d.get("dayOrder", "Today"),
                    "hour": d.get("hour"),
                    "newVenue": d.get("newVenue"),
                    "reason": d.get("reason", raw_text[:80]),
                    "sourceGroup": group_name,
                    "timestamp": "Just Now"
                }
                SCHEDULE_OVERRIDES.insert(0, override)
                return override
        except Exception as e:
            print("Override parsing error:", e)
    return None

class APIHandler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200, content_type='application/json; charset=utf-8'):
        try:
            self.send_response(status)
            self.send_header('Content-Type', content_type)
            self.send_header('Access-Control-Allow-Origin', '*')
            self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
            self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With')
            self.end_headers()
        except Exception:
            pass

    def _send_json(self, data, status=200):
        try:
            self._set_headers(status, 'application/json; charset=utf-8')
            self.wfile.write(json.dumps(data, ensure_ascii=False).encode('utf-8'))
        except Exception:
            pass

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        path = self.path.split('?')[0].rstrip('/').lower()
        if not path: path = '/'

        # 1. API Endpoints
        if path in ['/api/overrides', '/overrides']:
            self._send_json({"success": True, "overrides": SCHEDULE_OVERRIDES})
            return
        elif path in ['/api/tasks', '/api/announcements', '/announcements', '/tasks']:
            self._send_json({
                "success": True, 
                "announcements": STRUCTURED_ANNOUNCEMENTS,
                "overrides": SCHEDULE_OVERRIDES
            })
            return
        elif path in ['/api/captcha', '/api/sp/captcha', '/captcha']:
            try:
                from api.index import fetch_srm_captcha
                res = fetch_srm_captcha()
                self._send_json(res, 200)
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)
            return
        elif path in ['/api/portal-data', '/portal-data']:
            portal_data = load_scraped_data()
            self._send_json({"success": True, "data": portal_data})
            return
        elif path in ['/api/portal-scrape', '/portal-scrape']:
            if SCRAPER_AVAILABLE:
                def _do_scrape():
                    try:
                        from srm_scraper import SRMAcademiaAPI
                        SRMAcademiaAPI().scrape_all()
                    except Exception as e:
                        print(f"[Manual Scrape] Error: {e}")
                import threading
                threading.Thread(target=_do_scrape, daemon=True).start()
                self._send_json({"success": True, "message": "Scrape started in background"})
            else:
                self._send_json({"success": False, "message": "Scraper not available"})
            return

        # 2. Serve Web Application UI & Static Assets (index.html, app.js, style.css, etc.)
        if path.startswith('/api/wa'):
            # Proxy to Baileys microservice on port 8001
            try:
                import urllib.request
                req = urllib.request.Request(f"http://127.0.0.1:8001{self.path}")
                with urllib.request.urlopen(req, timeout=5) as resp:
                    resp_data = resp.read()
                    self._set_headers(resp.status, 'application/json')
                    self.wfile.write(resp_data)
                    return
            except Exception as e:
                self._send_json({"error": f"WA Bridge not running on port 8001: {e}"}, 503)
                return

        req_file = path.lstrip('/')
        if not req_file or req_file == 'index.html':
            req_file = 'index.html'

        base_dir = os.path.dirname(os.path.abspath(__file__))
        target_file = os.path.join(base_dir, req_file)

        if os.path.exists(target_file) and os.path.isfile(target_file):
            content_type = 'text/html; charset=utf-8'
            if req_file.endswith('.js'):
                content_type = 'application/javascript; charset=utf-8'
            elif req_file.endswith('.css'):
                content_type = 'text/css; charset=utf-8'
            elif req_file.endswith('.json'):
                content_type = 'application/json; charset=utf-8'
            elif req_file.endswith('.png'):
                content_type = 'image/png'
            elif req_file.endswith('.jpg') or req_file.endswith('.jpeg'):
                content_type = 'image/jpeg'
            elif req_file.endswith('.svg'):
                content_type = 'image/svg+xml'

            try:
                with open(target_file, 'rb') as f:
                    content_bytes = f.read()
                self._set_headers(200, content_type)
                self.wfile.write(content_bytes)
            except Exception:
                pass
            return

        self._send_json({"status": "SRM Schedule Engine & Inception AI Live"})

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length) if content_length > 0 else b'{}'
        try:
            body = json.loads(post_data.decode('utf-8'))
        except Exception:
            body = {}

        path = self.path.split('?')[0].rstrip('/').lower()
        if not path: path = '/'

        if path.startswith('/api/wa'):
            # Proxy to Baileys microservice on port 8001
            try:
                import urllib.request
                req = urllib.request.Request(
                    f"http://127.0.0.1:8001{self.path}",
                    data=post_data,
                    headers={'Content-Type': 'application/json'},
                    method='POST'
                )
                with urllib.request.urlopen(req, timeout=5) as resp:
                    resp_data = resp.read()
                    self._set_headers(resp.status, 'application/json')
                    self.wfile.write(resp_data)
                    return
            except Exception as e:
                self._send_json({"error": f"WA Bridge error on port 8001: {e}"}, 503)
                return

        if path in ['/api/chat', '/chat']:
            try:
                user_msg = body.get('message') or body.get('prompt') or ''
                client_context = body.get('context') or ''
                sys_context = client_context if client_context else "You are a concise, brilliant academic tutor for an SRMIST B.Tech student studying PPS, Calculus, Chemistry, Comp Bio, and Workshop. Answer questions about their schedule, attendance, and coursework directly with precision."
                
                reply = ai_engine.get_reply(user_msg, sys_context)
                self._send_json({"reply": reply, "status": "success"})
            except Exception as e:
                self._send_json({"error": str(e)}, 500)

        elif path in ['/api/login', '/api/sp/login', '/login', '/sp/login']:
            # Submit credentials & solved CAPTCHA to sp.srmist.edu.in
            try:
                from api.index import login_and_scrape_portal
                username = body.get('username') or body.get('srm_id') or ''
                password = body.get('password') or ''
                captcha = body.get('captcha') or body.get('captcha_text') or ''
                cookies = body.get('cookies') or ''
                hidden_fields = body.get('hidden_fields') or {}
                sec_config = body.get('sec_config') or {}

                res = login_and_scrape_portal(username, password, captcha, cookies, hidden_fields, sec_config)
                self._send_json(res, 200 if res.get('success') else 401)
            except Exception as e:
                self._send_json({"success": False, "error": str(e)}, 500)

def start_wa_bridge_subprocess():
    import subprocess
    try:
        print("[Backend] Auto-starting Baileys WhatsApp Bridge on port 8001...")
        subprocess.Popen(['node', 'wa_bridge.js'], stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except Exception as e:
        print(f"[Backend] Failed to auto-start wa_bridge.js: {e}")

def run(port=8000):
    start_wa_bridge_subprocess()
    server_address = ('0.0.0.0', port)
    ThreadingHTTPServer.allow_reuse_address = True
    httpd = ThreadingHTTPServer(server_address, APIHandler)
    print(f"==================================================")
    print(f"🚀 SRM COMPANION MULTITHREADED SERVER RUNNING (PORT {port})")
    print(f"==================================================")

    # Auto-start SRM portal background scraper
    if SCRAPER_AVAILABLE:
        print("[Backend] Starting SRM portal auto-scraper (every 15 min)...")
        start_background_scraper(interval=900)
    else:
        print("[Backend] SRM Auto-Scraper standby.")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\nStopping server...")
        httpd.server_close()

if __name__ == '__main__':
    run(port=8000)
