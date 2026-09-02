const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const PURE_REAL_SRM_CAPTCHA_ENGINE = `// ─── 100% Real SRM Portal Captcha Engine (Zero Fake Captcha Fallbacks) ────────
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

function formatCaptchaDataUrl(rawData) {
    if (!rawData) return null;
    if (typeof rawData === 'string') {
        if (rawData.startsWith('data:image/')) return rawData;
        const clean = rawData.trim().replace(/\\s+/g, '');
        if (clean.length > 30) {
            if (clean.startsWith('iVBORw0KGgo') || /^[A-Za-z0-9+/=]+$/.test(clean)) {
                return 'data:image/png;base64,' + clean;
            }
            if (clean.startsWith('/9j/')) {
                return 'data:image/jpeg;base64,' + clean;
            }
        }
        try {
            let binary = '';
            for (let i = 0; i < clean.length; i++) {
                binary += String.fromCharCode(clean.charCodeAt(i) & 0xff);
            }
            return 'data:image/png;base64,' + btoa(binary);
        } catch (_) {}
    }
    return null;
}

let _isFetchingCaptcha = false;

async function fetchLiveCaptcha(force = false) {
    if (_isFetchingCaptcha && !force) return;
    _isFetchingCaptcha = true;
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;
    _currentCaptchaCode = ''; // Always 100% Real Live SRM Mode

    const box = document.getElementById('captcha-box');
    if (!box) { _isFetchingCaptcha = false; return; }

    // Display loading pulse while connecting to sp.srmist.edu.in
    box.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:var(--card-elevated);border-radius:6px;font-size:0.75rem;color:var(--accent);border:1px solid var(--card-border);"><span style="animation:pulse 1s infinite;">⏳ Loading SRM...</span></div>';

    const setCaptchaImage = (imgSrc) => {
        _captchaLoadTime = Date.now();
        if (!box || !imgSrc) return;
        box.innerHTML = '';
        const img = document.createElement('img');
        img.id = 'live-captcha-img';
        img.style.height = '42px';
        img.style.maxWidth = '140px';
        img.style.borderRadius = '6px';
        img.style.display = 'block';
        img.style.imageRendering = 'crisp-edges';
        img.style.objectFit = 'contain';
        img.alt = 'SRM CAPTCHA';

        img.onerror = () => {
            box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Retry</div>';
        };

        img.src = imgSrc;
        box.appendChild(img);
    };

    // 1. Direct Native On-Device CapacitorHttp to sp.srmist.edu.in
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (capacitorHttp) {
        try {
            console.log('[Captcha] Fetching official loginManager/youLogin.jsp from SRM...');
            const pageRes = await capacitorHttp.get({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                headers: { 
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                },
                connectTimeout: 8000,
                readTimeout: 8000
            });

            const rawCookie = pageRes.headers ? (pageRes.headers['Set-Cookie'] || pageRes.headers['set-cookie'] || '') : '';
            const cleanCookie = parseCleanCookies(rawCookie);
            if (cleanCookie) _liveCookies = cleanCookie;

            // Extract the real dynamic token from the HTML (e.g. data-src="/srmiststudentportal/SCaptchaServlet?ts=...&token=...")
            let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
            if (pageRes.data && typeof pageRes.data === 'string') {
                const tokenMatch = pageRes.data.match(/data-src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i) || 
                                   pageRes.data.match(/src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i);
                if (tokenMatch) {
                    const extractedPath = tokenMatch[1].trim();
                    dynamicCaptchaUrl = extractedPath.startsWith('http') ? extractedPath : ('https://sp.srmist.edu.in' + (extractedPath.startsWith('/') ? '' : '/') + extractedPath);
                    console.log('[Captcha] Acquired official tokenized URL:', dynamicCaptchaUrl);
                }
            }

            console.log('[Captcha] Fetching official live PNG image from SCaptchaServlet...');
            const imgRes = await capacitorHttp.get({
                url: dynamicCaptchaUrl,
                headers: {
                    'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                    'Cookie': _liveCookies || '',
                    'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
                },
                responseType: 'base64',
                connectTimeout: 8000,
                readTimeout: 8000
            });

            if (imgRes && imgRes.data) {
                const formattedUrl = formatCaptchaDataUrl(imgRes.data);
                if (formattedUrl) {
                    setCaptchaImage(formattedUrl);
                    console.log('✅ Real official SRM portal captcha rendered!');
                    _isFetchingCaptcha = false;
                    return;
                }
            }
        } catch (err) {
            console.warn('[Captcha] Direct SRM portal fetch error:', err);
        }
    }

    // 2. Direct browser fetch if running in browser with CORS extension or proxy
    try {
        const res = await apiFetch('/api/captcha', { timeoutMs: 3000 });
        if (res && res.success && res.captchaImg) {
            _liveCookies = res.cookies || '';
            _hiddenFields = res.hidden_fields || {};
            _secConfig = res.sec_config || {};
            setCaptchaImage(res.captchaImg);
            console.log('✅ Real official SRM captcha rendered via proxy!');
            _isFetchingCaptcha = false;
            return;
        }
    } catch (_) {}

    // 3. If completely offline: show Retry button (NO FAKE CAPTCHA)
    box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Load SRM</div>';
    _isFetchingCaptcha = false;
}
`;

const startMarker = '// ─── Client-Side Security Captcha (Instant Offline Generator)';
const endMarker = 'function refreshCaptcha()';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + PURE_REAL_SRM_CAPTCHA_ENGINE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Completely removed all fake captcha generators!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
