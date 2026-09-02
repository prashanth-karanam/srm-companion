const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const NEW_CAPTCHA_SUITE = `// ─── Rock-Solid Live SRM Portal Captcha Engine (Direct from sp.srmist.edu.in) ──
function parseCleanCookies(setCookieHeader) {
    if (!setCookieHeader) return '';
    const parts = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
    const clean = [];
    for (const raw of parts) {
        for (const item of String(raw).split(/,\\s*(?=[A-Za-z0-9_-]+=)/)) {
            const m = item.match(/([A-Za-z0-9_-]+)=([^;]+)/);
            if (m && !['path', 'domain', 'expires', 'httponly', 'secure', 'samesite', 'max-age'].includes(m[1].toLowerCase())) {
                clean.push(\`\${m[1]}=\${m[2].trim()}\`);
            }
        }
    }
    return clean.join('; ');
}

function safeBinaryToBase64(str) {
    if (!str || typeof str !== 'string') return null;
    if (str.startsWith('data:image')) return str;
    
    // Check if clean base64 string
    const cleanBase64 = str.replace(/\\s/g, '');
    if (/^[A-Za-z0-9+/=]+$/.test(cleanBase64) && cleanBase64.length > 30) {
        return 'data:image/png;base64,' + cleanBase64;
    }

    try {
        let binary = '';
        for (let i = 0; i < str.length; i++) {
            binary += String.fromCharCode(str.charCodeAt(i) & 0xff);
        }
        return 'data:image/png;base64,' + btoa(binary);
    } catch (_) {
        return null;
    }
}

async function fetchLiveCaptcha(force = false) {
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;

    const box = document.getElementById('captcha-box');
    if (!box) return;

    // 1. Show sleek loading indicator while live portal captcha downloads
    box.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:#0f141c;border-radius:6px;font-size:0.75rem;color:#38bdf8;border:1px solid #1e293b;"><span style="animation:pulse 1s infinite;">⏳ Fetching SRM...</span></div>';

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

    // 2. Try Direct Native On-Device CapacitorHttp (bypasses CORS, loads live SRM portal captcha)
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (capacitorHttp) {
        try {
            console.log('[Captcha] Fetching live session from sp.srmist.edu.in...');
            const pageRes = await capacitorHttp.get({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                },
                connectTimeout: 6000,
                readTimeout: 6000
            });

            const rawCookie = pageRes.headers ? (pageRes.headers['Set-Cookie'] || pageRes.headers['set-cookie'] || '') : '';
            const cleanCookie = parseCleanCookies(rawCookie);
            if (cleanCookie) _liveCookies = cleanCookie;

            console.log('[Captcha] Fetching SCaptchaServlet with cookies:', _liveCookies ? 'Found' : 'None');
            const imgRes = await capacitorHttp.get({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now(),
                headers: {
                    'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                    'Cookie': _liveCookies || '',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
                },
                responseType: 'base64',
                connectTimeout: 6000,
                readTimeout: 6000
            });

            if (imgRes && imgRes.data) {
                const formattedUrl = safeBinaryToBase64(imgRes.data);
                if (formattedUrl) {
                    _currentCaptchaCode = ''; // Live portal mode — validation on SRM server
                    setCaptchaImage(formattedUrl);
                    console.log('✅ Live SRM portal captcha rendered successfully!');
                    return;
                }
            }
        } catch (err) {
            console.warn('[Captcha] Native live portal fetch error:', err);
        }
    }

    // 3. Try Backend API Proxy fallback if running in browser
    try {
        const res = await apiFetch('/api/captcha', { timeoutMs: 3000 });
        if (res && res.success && res.captchaImg) {
            _liveCookies = res.cookies || '';
            _hiddenFields = res.hidden_fields || {};
            _secConfig = res.sec_config || {};
            _currentCaptchaCode = ''; // Live mode
            setCaptchaImage(res.captchaImg);
            console.log('✅ Live API captcha rendered successfully!');
            return;
        }
    } catch (_) {}

    // 4. Offline Fallback: Render local client security captcha
    console.log('[Captcha] Network unavailable, using local client security captcha fallback');
    const localDataUrl = generateClientSecurityCaptcha();
    if (localDataUrl) {
        setCaptchaImage(localDataUrl);
    }
}
`;

const startMarker = '// ─── Safe Captcha Image Helper';
const endMarker = 'function refreshCaptcha()';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + NEW_CAPTCHA_SUITE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Successfully installed Rock-Solid Live SRM Portal Captcha Engine!');
} else {
    console.error('Could not find markers for captcha replacement:', sIdx, eIdx);
}
