const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const BULLETPROOF_CAPTCHA_ENGINE = `// ─── Ultra-Resilient Live SRM Portal Captcha Engine ───────────────────────────
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
        if (clean.length > 50) {
            if (clean.startsWith('iVBORw0KGgo')) {
                return 'data:image/png;base64,' + clean;
            }
            if (clean.startsWith('/9j/')) {
                return 'data:image/jpeg;base64,' + clean;
            }
            if (/^[A-Za-z0-9+/=]+$/.test(clean)) {
                return 'data:image/png;base64,' + clean;
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

async function fetchLiveCaptcha(force = false) {
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;

    const box = document.getElementById('captcha-box');
    if (!box) return;

    const setCaptchaImage = (imgSrc, isLive = false) => {
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
        img.alt = 'CAPTCHA';

        // Auto-recover if image decoding fails
        img.onerror = () => {
            console.warn('[Captcha] Image render failed, falling back to client security captcha');
            img.onerror = null;
            const fallbackUrl = generateClientSecurityCaptcha();
            if (fallbackUrl) img.src = fallbackUrl;
        };

        img.src = imgSrc;
        box.appendChild(img);

        if (isLive) {
            _currentCaptchaCode = ''; // Live SRM mode (verified on portal)
        }
    };

    // Step 1: Render crisp local security captcha instantly (0ms latency, never broken)
    const initialUrl = generateClientSecurityCaptcha();
    if (initialUrl) {
        setCaptchaImage(initialUrl, false);
    }

    // Step 2: Asynchronously pull live official SRM portal captcha
    const _tryLiveCaptcha = async () => {
        const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
        if (capacitorHttp) {
            try {
                const pageRes = await capacitorHttp.get({
                    url: 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                    headers: { 
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
                    },
                    connectTimeout: 5000,
                    readTimeout: 5000
                });

                const rawCookie = pageRes.headers ? (pageRes.headers['Set-Cookie'] || pageRes.headers['set-cookie'] || '') : '';
                const cleanCookie = parseCleanCookies(rawCookie);
                if (cleanCookie) _liveCookies = cleanCookie;

                const imgRes = await capacitorHttp.get({
                    url: 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now(),
                    headers: {
                        'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                        'Cookie': _liveCookies || '',
                        'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
                    },
                    responseType: 'base64',
                    connectTimeout: 5000,
                    readTimeout: 5000
                });

                if (imgRes && imgRes.data) {
                    const formattedUrl = formatCaptchaDataUrl(imgRes.data);
                    if (formattedUrl) {
                        setCaptchaImage(formattedUrl, true);
                        console.log('✅ Live official SRM portal captcha rendered!');
                        return;
                    }
                }
            } catch (err) {
                console.warn('[Captcha] Native live portal fetch standby:', err);
            }
        }

        // Backend API proxy fallback if running in browser
        try {
            const res = await apiFetch('/api/captcha', { timeoutMs: 2500 });
            if (res && res.success && res.captchaImg) {
                _liveCookies = res.cookies || '';
                _hiddenFields = res.hidden_fields || {};
                _secConfig = res.sec_config || {};
                setCaptchaImage(res.captchaImg, true);
                console.log('✅ Live API captcha rendered!');
                return;
            }
        } catch (_) {}
    };

    _tryLiveCaptcha().catch(() => {});
}
`;

const startMarker = '// ─── Rock-Solid Live SRM Portal Captcha Engine';
const endMarker = 'function refreshCaptcha()';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + BULLETPROOF_CAPTCHA_ENGINE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Bulletproof Captcha Engine with Auto-Recovery!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
