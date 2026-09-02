import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_JS_PATH = r'C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion\app.js'

with open(APP_JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    code = f.read()

SAFE_CAPTCHA_FUNCS = '''// ─── Safe Captcha Image Helper (Prevents Raw Binary HTML Spilling) ───────────
function safeBinaryToBase64(str) {
    if (!str || typeof str !== 'string') return null;
    if (str.startsWith('data:image')) return str;
    
    // Check if already clean base64
    const cleanBase64 = str.replace(/\\s/g, '');
    if (/^[A-Za-z0-9+/=]+$/.test(cleanBase64) && cleanBase64.length > 30) {
        return 'data:image/jpeg;base64,' + cleanBase64;
    }

    // Convert raw binary string to base64 safely
    try {
        let binary = '';
        for (let i = 0; i < str.length; i++) {
            binary += String.fromCharCode(str.charCodeAt(i) & 0xff);
        }
        return 'data:image/jpeg;base64,' + btoa(binary);
    } catch (_) {
        return null;
    }
}

async function fetchLiveCaptcha(force = false) {
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;

    const box = document.getElementById('captcha-box');

    const setCaptchaImage = (imgSrc) => {
        _captchaLoadTime = Date.now();
        if (!box) return;
        box.innerHTML = '';
        const img = document.createElement('img');
        img.id = 'live-captcha-img';
        img.src = imgSrc;
        img.style.height = '42px';
        img.style.maxWidth = '140px';
        img.style.borderRadius = '6px';
        img.style.display = 'block';
        img.style.imageRendering = 'crisp-edges';
        img.style.objectFit = 'contain';
        img.alt = 'SRM CAPTCHA';
        box.appendChild(img);
    };

    // Step 1: Immediately show crisp local canvas captcha (0ms, 100% reliable)
    const localDataUrl = generateClientSecurityCaptcha();
    if (localDataUrl) {
        setCaptchaImage(localDataUrl);
    }

    // Step 2: In background, try to pull live portal captcha from sp.srmist.edu.in
    const _tryLiveCaptcha = async () => {
        // Option A: Backend API if available
        try {
            const res = await apiFetch('/api/captcha', { timeoutMs: 800 });
            if (res && res.success && res.captchaImg) {
                _liveCookies = res.cookies || '';
                _hiddenFields = res.hidden_fields || {};
                _secConfig = res.sec_config || {};
                _currentCaptchaCode = ''; // Live portal mode
                setCaptchaImage(res.captchaImg);
                return;
            }
        } catch (_) {}

        // Option B: Native Mobile CapacitorHttp
        const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
        if (!capacitorHttp) return;

        try {
            const pageRes = await capacitorHttp.get({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                headers: { 'User-Agent': 'Mozilla/5.0 (Linux; Android 14) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36' },
                connectTimeout: 1000,
                readTimeout: 1000
            });
            const setCookie = pageRes.headers ? (pageRes.headers['Set-Cookie'] || pageRes.headers['set-cookie'] || '') : '';
            if (setCookie) _liveCookies = setCookie;

            const imgRes = await capacitorHttp.get({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now(),
                headers: {
                    'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                    'Cookie': _liveCookies
                },
                responseType: 'base64',
                connectTimeout: 1000,
                readTimeout: 1000
            });

            if (imgRes && imgRes.data) {
                const formattedUrl = safeBinaryToBase64(imgRes.data);
                if (formattedUrl) {
                    _currentCaptchaCode = ''; // Live portal mode
                    setCaptchaImage(formattedUrl);
                }
            }
        } catch (_) {}
    };

    _tryLiveCaptcha().catch(() => {});
}
'''

start_marker = 'async function fetchLiveCaptcha'
end_marker = 'function refreshCaptcha()'

s_idx = code.find(start_marker)
e_idx = code.find(end_marker, s_idx)

if s_idx != -1 and e_idx != -1:
    code = code[:s_idx] + SAFE_CAPTCHA_FUNCS + "\n\n" + code[e_idx:]
    with open(APP_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully replaced fetchLiveCaptcha with safe setter and binary converter!")
else:
    print("Could not find markers:", s_idx, e_idx)
