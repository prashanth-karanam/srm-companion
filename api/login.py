"""
Vercel Serverless Function: /api/login
Logs into sp.srmist.edu.in, verifies credentials & CAPTCHA, scrapes attendance
"""

import json
import requests
from bs4 import BeautifulSoup
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_POST(self):
        content_length = int(self.headers.get('Content-Length', 0))
        post_data = self.rfile.read(content_length)

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
