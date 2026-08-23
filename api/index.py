"""
Vercel Serverless Python Backend for SRM Companion
Handles:
1. Inception Labs Mercury AI (/api/chat)
2. Live SRM CAPTCHA Streaming (/api/sp/captcha)
3. Live SRM Attendance Scraping (/api/sp/login)
"""

import json
import uuid
import time
import base64
import requests
from http.server import BaseHTTPRequestHandler
from bs4 import BeautifulSoup

# ─── Inception Labs AI Client ───────────────────────────────────────────────
class InceptionLabsClient:
    def __init__(self):
        self.session = requests.Session()
        self.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Accept': 'application/json, text/plain, */*',
            'Referer': 'https://chat.inceptionlabs.ai/',
        }
        self.token = None

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
            if res.status_code == 401:
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

            return full_reply or "No response received from Inception Labs."
        except Exception as e:
            return f"Inception Error: {str(e)}"

ai_engine = InceptionLabsClient()

# ─── Vercel Serverless Handler ───────────────────────────────────────────────
class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        if '/api/sp/captcha' in self.path:
            try:
                sess = requests.Session()
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
                }
                sess.get('https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', headers=headers, timeout=10)
                
                ts = int(time.time() * 1000)
                captcha_res = sess.get(f'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?ts={ts}', headers=headers, timeout=10)
                
                cookies_str = "; ".join([f"{k}={v}" for k, v in sess.cookies.items()])
                b64_img = base64.b64encode(captcha_res.content).decode('utf-8')

                self._set_headers(200)
                self.wfile.write(json.dumps({
                    "success": True,
                    "cookies": cookies_str,
                    "captchaImg": f"data:image/jpeg;base64,{b64_img}"
                }).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(200)
            self.wfile.write(json.dumps({"status": "SRM Inception & Portal API Online", "provider": "Inception Labs Mercury"}).encode('utf-8'))

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

        if '/api/chat' in self.path:
            try:
                body = json.loads(post_data.decode('utf-8'))
                user_msg = body.get('message') or body.get('prompt') or ''
                context = body.get('context') or "You are an elite academic tutor for SRMIST students. Answer concisely with clear code or math formulas."
                
                reply = ai_engine.get_reply(user_msg, context)
                self._set_headers(200)
                self.wfile.write(json.dumps({"reply": reply, "provider": "Inception Labs Mercury", "status": "success"}).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"error": str(e)}).encode('utf-8'))

        elif '/api/sp/login' in self.path:
            try:
                body = json.loads(post_data.decode('utf-8'))
                cookies_str = body.get('cookies') or ''
                username = body.get('username') or ''
                password = body.get('password') or ''
                captcha = body.get('captcha') or ''

                sess = requests.Session()
                headers = {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
                    'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp'
                }
                if cookies_str:
                    headers['Cookie'] = cookies_str

                login_payload = {
                    'username': username,
                    'password': password,
                    'captcha': captcha
                }

                sess.post('https://sp.srmist.edu.in/srmiststudentportal/LoginServlet', data=login_payload, headers=headers, timeout=15)
                r_att = sess.get('https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp', headers=headers, timeout=15)

                soup = BeautifulSoup(r_att.text, 'html.parser')
                attendance_list = []
                for table in soup.find_all('table'):
                    for row in table.find_all('tr')[1:]:
                        cols = [c.text.strip() for c in row.find_all(['td', 'th'])]
                        if len(cols) >= 6 and any(c.isdigit() for c in cols):
                            attendance_list.append({
                                "code": cols[0],
                                "title": cols[1],
                                "conducted": cols[2],
                                "attended": cols[3],
                                "absent": cols[4] if len(cols) > 4 else "0",
                                "percentage": cols[5] if len(cols) > 5 else "0"
                            })

                if attendance_list:
                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "success": True,
                        "attendance": attendance_list
                    }).encode('utf-8'))
                else:
                    self._set_headers(200)
                    self.wfile.write(json.dumps({
                        "success": False,
                        "error": "Login rejected or no attendance table found. Check credentials/CAPTCHA."
                    }).encode('utf-8'))
            except Exception as e:
                self._set_headers(500)
                self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
        else:
            self._set_headers(404)
            self.wfile.write(json.dumps({"error": "Endpoint not found"}).encode('utf-8'))
