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
from http.server import HTTPServer, BaseHTTPRequestHandler

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

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
                    "id": f"ov-{Date.now() if 'Date' in globals() else uuid.uuid4().hex[:6]}",
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
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(204)

    def do_GET(self):
        if self.path == '/api/overrides':
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, "overrides": SCHEDULE_OVERRIDES}).encode('utf-8'))
        elif self.path == '/api/tasks' or self.path == '/api/announcements':
            self._set_headers(200)
            self.wfile.write(json.dumps({
                "success": True, 
                "announcements": STRUCTURED_ANNOUNCEMENTS,
                "overrides": SCHEDULE_OVERRIDES
            }).encode('utf-8'))

        elif self.path == '/api/portal-data':
            # Serve latest scraped portal data (attendance, calendar, circulars)
            self._set_headers(200)
            portal_data = load_scraped_data()
            self.wfile.write(json.dumps({"success": True, "data": portal_data}).encode('utf-8'))

        elif self.path == '/api/portal-scrape':
            # Trigger a fresh scrape right now (runs in background thread)
            self._set_headers(200)
            if SCRAPER_AVAILABLE:
                def _do_scrape():
                    try:
                        from srm_scraper import SRMAcademiaAPI
                        SRMAcademiaAPI().scrape_all()
                    except Exception as e:
                        print(f"[Manual Scrape] Error: {e}")
                import threading
                threading.Thread(target=_do_scrape, daemon=True).start()
                self.wfile.write(json.dumps({"success": True, "message": "Scrape started in background"}).encode('utf-8'))
            else:
                self.wfile.write(json.dumps({"success": False, "message": "Scraper not available"}).encode('utf-8'))

        else:
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "SRM Schedule Engine & Inception AI Live"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if self.path == '/api/chat':
            try:
                data = json.loads(post_data.decode('utf-8'))
                user_msg = data.get('message', '')
                sys_context = "You are a concise, brilliant academic tutor for Karanam Sai Prasanth, 1st year B.Tech student at SRMIST Kattankulathur studying PPS, Calculus, Chemistry, Comp Bio, and Workshop. Keep answers brief, clean, and direct with code or math formulas."
                
                reply = ai_engine.get_reply(user_msg, sys_context)
                self._set_headers(200)
                self.wfile.write(json.dumps({"reply": reply, "status": "success"}).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        elif self.path == '/api/ingest' or self.path == '/api/webhook':
            try:
                body = json.loads(post_data.decode('utf-8'))
                raw_text = body.get('text') or body.get('message') or ''
                group = body.get('groupName') or 'WhatsApp Group'

                # 1. Check for schedule changes / cancellations first
                override = analyze_and_apply_schedule_changes(raw_text, group)

                # 2. Extract general announcement
                ai_prompt = f"""Extract academic announcements for student Karanam Sai Prasanth from this text:
"{raw_text}"

Return JSON only:
{{
  "isRelevant": true,
  "subject": "Subject Name",
  "code": "Course Code",
  "category": "Xerox / Lab Venue OR Schedule / Cancellation OR Assignment / Code OR Exam / Tutorial",
  "title": "Short 3-5 word Title",
  "detail": "Clear 1-line actionable instruction",
  "priority": "HIGH / MEDIUM"
}}"""
                ai_reply = ai_engine.get_reply(ai_prompt)
                match = re.search(r'\{[\s\S]*\}', ai_reply)
                if match:
                    d = json.loads(match.group(0))
                    if d.get("isRelevant") or d.get("detail"):
                        new_ann = {
                            "id": f"ann-{uuid.uuid4().hex[:6]}",
                            "subject": d.get("subject", "General Academic"),
                            "code": d.get("code", "GENERAL"),
                            "category": d.get("category", "General Notice"),
                            "title": d.get("title", "Class Update"),
                            "detail": d.get("detail", raw_text[:80]),
                            "faculty": "-",
                            "venue": "-",
                            "sourceGroup": group,
                            "priority": d.get("priority", "HIGH"),
                            "timestamp": "Just Now"
                        }
                        STRUCTURED_ANNOUNCEMENTS.insert(0, new_ann)
                        self._set_headers(200)
                        self.wfile.write(json.dumps({"success": True, "announcement": new_ann, "override": override}).encode('utf-8'))
                        return

                self._set_headers(200)
                self.wfile.write(json.dumps({"success": False, "message": "No actionable change detected"}).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

def run(port=8000):
    server_address = ('0.0.0.0', port)
    httpd = HTTPServer(server_address, APIHandler)
    print(f"==================================================")
    print(f"🚀 SRM SCHEDULE OVERRIDE ENGINE & AI RUNNING (PORT {port})")
    print(f"==================================================")

    # Auto-start SRM portal background scraper
    if SCRAPER_AVAILABLE:
        print("[Backend] Starting SRM portal auto-scraper (every 15 min)...")
        start_background_scraper(interval=900)
    else:
        print("[Backend] ⚠️  Scraper unavailable — run: python srm_scraper.py first")

    httpd.serve_forever()

if __name__ == '__main__':
    run()
