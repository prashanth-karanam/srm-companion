import asyncio
import httpx
import re
import base64
import json
import time
from bs4 import BeautifulSoup

edge_base = 'https://srm-edge-gateway.srm-companion.workers.dev/srm-edge'

with open('edge_scrape_ctx.json') as f:
    ctx = json.load(f)

jsessionid = ctx['jsessionid']
domainFieldName = ctx['domainFieldName']
captchaFieldName = ctx['captchaFieldName']
randomDelimiter = ctx['randomDelimiter']
nonce = ctx['nonce']

reversed_host = "sp.srmist.edu.in"[::-1]
dval = base64.b64encode(reversed_host.encode()).decode()

trap_payload = f"4{randomDelimiter}12"
cval = base64.b64encode(trap_payload.encode()).decode()

telemetry = {
    "startTime": int(time.time()*1000) - 3500,
    "currentDomain": "sp.srmist.edu.in",
    "timezoneOffset": -330,
    "screenWidth": 1920,
    "screenHeight": 1080,
    "colorDepth": 24,
    "platform": "Win32",
    "userAgent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/128.0.0.0 Safari/537.36",
    "mouseClicks": 3,
    "mouseMovements": 25,
    "keystrokeCount": 18,
    "typingSpeedMs": 210,
    "canvasHash": "c4d812a",
    "submitTime": int(time.time()*1000),
    "timeOnPageMs": 3500
}

payload = {
    'username': 'sk1325',
    'password': 'Swap@99630',
    'captcha': 'Ejtutv',
    domainFieldName: dval,
    captchaFieldName: cval,
    'telemetryPayload': base64.b64encode(json.dumps(telemetry).encode()).decode()
}

async def run_scrape():
    headers = {
        'User-Agent': telemetry['userAgent'],
        'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
        'Origin': 'https://sp.srmist.edu.in'
    }
    
    # Cookie jar with ONLY JSESSIONID
    client_cookies = {'JSESSIONID': jsessionid}

    async with httpx.AsyncClient(headers=headers, cookies=client_cookies, timeout=20.0, follow_redirects=True) as client:
        # 1. POST to LoginServlet
        r_login = await client.post(f'{edge_base}/srmiststudentportal/LoginServlet', data=payload)
        login_html = r_login.text
        print('1. LoginServlet status:', r_login.status_code, 'Length:', len(login_html))
        
        # Check alerts
        soup = BeautifulSoup(login_html, 'html.parser')
        alert = soup.find(class_=re.compile(r'alert', re.I))
        if alert:
            print('   ALERT DETECTED:', alert.get_text(strip=True))
        elif '.theGR8LoginLoader' in login_html or 'Please wait login screen' in login_html:
            print('   SUCCESS: .theGR8LoginLoader received!')
            
            # Follow loader to youLogin.jsp
            r_follow = await client.post(
                f'{edge_base}/srmiststudentportal/students/loginManager/youLogin.jsp',
                data={},
                headers={'Referer': f'{edge_base}/srmiststudentportal/LoginServlet'}
            )
            print('2. youLogin.jsp followed! Status:', r_follow.status_code, 'Length:', len(r_follow.text))
            
            # Now fetch studentProfile.jsp!
            report_headers = {
                'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp',
                'X-Requested-With': 'XMLHttpRequest'
            }
            r_prof = await client.post(
                f'{edge_base}/srmiststudentportal/students/report/studentProfile.jsp',
                data={'iden': '1', 'filter': '', 'hdnFormDetails': '1', 'csrfPreventionSalt': ''},
                headers=report_headers
            )
            print('3. studentProfile.jsp status:', r_prof.status_code, 'Length:', len(r_prof.text))
            
            # Check for name
            soup_prof = BeautifulSoup(r_prof.text, 'html.parser')
            for td in soup_prof.find_all('td'):
                txt = td.get_text(strip=True)
                if 'Student Name' in txt:
                    nxt = td.find_next_sibling('td')
                    print('   🎉 STUDENT NAME:', nxt.get_text(strip=True) if nxt else '')
                elif 'Register No' in txt:
                    nxt = td.find_next_sibling('td')
                    print('   🎉 REGISTER NO:', nxt.get_text(strip=True) if nxt else '')

asyncio.run(run_scrape())
