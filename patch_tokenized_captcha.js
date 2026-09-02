const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const PERFECT_LIVE_CAPTCHA_ENGINE = `// ─── Official Live SRM Portal Captcha Engine (Tokenized SCaptchaServlet) ─────
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

async function fetchLiveCaptcha(force = false) {
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;

    const box = document.getElementById('captcha-box');
    if (!box) return;

    // Loading pulse
    box.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:#0f141c;border-radius:6px;font-size:0.75rem;color:#38bdf8;border:1px solid #1e293b;"><span style="animation:pulse 1s infinite;">⏳ Fetching SRM...</span></div>';

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
        img.alt = 'SRM CAPTCHA';

        img.onerror = () => {
            console.warn('[Captcha] Image render fallback');
            img.onerror = null;
            const fallbackUrl = generateClientSecurityCaptcha();
            if (fallbackUrl) img.src = fallbackUrl;
        };

        img.src = imgSrc;
        box.appendChild(img);

        if (isLive) {
            _currentCaptchaCode = ''; // Official live mode — validated on SRM portal
        }
    };

    // 1. Direct Native On-Device CapacitorHttp (Bypasses CORS & fetches real tokenized captcha)
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (capacitorHttp) {
        try {
            console.log('[Captcha] Loading youLogin.jsp to acquire dynamic token & cookies...');
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

            // Extract the EXACT dynamic tokenized captcha URL from youLogin.jsp HTML
            let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
            if (pageRes.data && typeof pageRes.data === 'string') {
                const tokenMatch = pageRes.data.match(/data-src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i) || 
                                   pageRes.data.match(/src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i);
                if (tokenMatch) {
                    const extractedPath = tokenMatch[1].trim();
                    dynamicCaptchaUrl = extractedPath.startsWith('http') ? extractedPath : ('https://sp.srmist.edu.in' + (extractedPath.startsWith('/') ? '' : '/') + extractedPath);
                    console.log('[Captcha] Extracted official tokenized URL:', dynamicCaptchaUrl);
                }
            }

            console.log('[Captcha] Downloading official live SRM captcha image...');
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
                    setCaptchaImage(formattedUrl, true);
                    console.log('✅ Official live SRM portal captcha displayed successfully!');
                    return;
                }
            }
        } catch (err) {
            console.warn('[Captcha] Native live portal fetch failed, switching to backup:', err);
        }
    }

    // 2. Fallback to local security captcha if offline
    console.log('[Captcha] Offline mode fallback active');
    const localDataUrl = generateClientSecurityCaptcha();
    if (localDataUrl) {
        setCaptchaImage(localDataUrl, false);
    }
}
`;

const startMarker = '// ─── Ultra-Resilient Live SRM Portal Captcha Engine';
const endMarker = 'function refreshCaptcha()';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker, sIdx);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + PERFECT_LIVE_CAPTCHA_ENGINE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Official Tokenized SRM Captcha Engine!');
} else {
    console.error('Could not find markers:', sIdx, eIdx);
}
