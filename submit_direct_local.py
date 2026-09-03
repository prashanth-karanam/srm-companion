import urllib.request
import urllib.parse
import http.cookiejar
import json
import base64
import time
import re
from bs4 import BeautifulSoup

base_url = 'https://sp.srmist.edu.in'

with open('direct_ctx.json') as f:
    ctx = json.load(f)

cj = http.cookiejar.CookieJar()
opener = urllib.request.build_opener(urllib.request.HTTPCookieProcessor(cj))

# Restore cookies into jar
for name, value, domain, path in ctx['cookies']:
    ck = http.cookiejar.Cookie(
        version=0, name=name, value=value, port=None, port_specified=False,
        domain=domain, domain_specified=True, domain_initial_dot=False,
        path=path, path_specified=True, secure=True, expires=None, discard=True, comment=None,
        comment_url=None, rest={'HttpOnly': None}, rfc2109=False
    )
    cj.set_cookie(ck)

domainFieldName = ctx['domainFieldName']
captchaFieldName = ctx['captchaFieldName']
randomDelimiter = ctx['randomDelimiter']
hidden_fields = ctx['hidden_fields']

reversed_host = "sp.srmist.edu.in"[::-1]
dval = base64.b64encode(reversed_host.encode()).decode()

trap_payload = f"4{randomDelimiter}18"
cval = base64.b64encode(trap_payload.encode()).decode()

now = int(time.time() * 1000)
telemetry = {
    "startTime": now - 3500,
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
    "submitTime": now,
    "timeOnPageMs": 3500
}

payload = {
    'username': 'sk1325',
    'password': 'Swap@99630',
    'captcha': 'zVRvjx',
    domainFieldName: dval,
    captchaFieldName: cval,
    'telemetryPayload': base64.b64encode(json.dumps(telemetry).encode()).decode()
}

if hidden_fields:
    payload.update(hidden_fields)

data = urllib.parse.urlencode(payload).encode('utf-8')

req = urllib.request.Request(
    f'{base_url}/srmiststudentportal/LoginServlet',
    data=data,
    headers={
        'User-Agent': telemetry['userAgent'],
        'Content-Type': 'application/x-www-form-urlencoded',
        'Referer': f'{base_url}/srmiststudentportal/students/loginManager/youLogin.jsp',
        'Origin': base_url,
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Connection': 'keep-alive'
    }
)

res = opener.open(req)
html = res.read().decode('utf-8', errors='ignore')
print('LoginServlet response status:', res.status, 'Length:', len(html))

soup = BeautifulSoup(html, 'html.parser')
alert = soup.find(class_=re.compile(r'alert', re.I))
if alert:
    print('Alert Detected:', alert.get_text(strip=True))
else:
    print('No alert detected! Page title:', soup.title.get_text(strip=True) if soup.title else 'None')
    if '.theGR8LoginLoader' in html:
        print('Contains .theGR8LoginLoader!')
    else:
        print('Snippet:', html[:400].strip())

print('Cookies after login:')
for c in cj:
    print(f'  {c.name} = {c.value[:15]}... domain={c.domain} path={c.path}')
