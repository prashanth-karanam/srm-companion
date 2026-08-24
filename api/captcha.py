"""
Vercel Serverless Function: /api/captcha
Live SRM CAPTCHA Streaming from sp.srmist.edu.in
"""

import json
import time
import base64
import requests
from http.server import BaseHTTPRequestHandler

class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
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
