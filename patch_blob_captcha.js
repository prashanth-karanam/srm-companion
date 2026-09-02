const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const PURE_CORRECT_CAPTCHA_ENGINE = `// ─── 100% Real SRM Portal Captcha Engine (Direct Blob Base64 Bridge) ─────────
let _currentCaptchaCode = '';
let _isFetchingCaptcha = false;

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
    if (!rawData || typeof rawData !== 'string') return null;
    const clean = rawData.trim().replace(/\\s+/g, '');
    if (clean.startsWith('data:image/')) return clean;
    if (clean.length > 20) {
        return 'data:image/png;base64,' + clean;
    }
    return null;
}

async function fetchLiveCaptcha(force = false) {
    if (_isFetchingCaptcha && !force) return;
    _isFetchingCaptcha = true;
    _captchaLoadTime = Date.now();
    _currentCaptchaCode = '';

    const box = document.getElementById('captcha-box');
    if (!box) { _isFetchingCaptcha = false; return; }

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
        _isFetchingCaptcha = false;
    };

    // Helper: Execute native request with CapacitorHttp or standard fetch
    const doNativeGet = async (url, headers = {}, responseType = 'text') => {
        const cap = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
        if (cap) {
            return await cap.get({
                url: url,
                headers: headers,
                responseType: responseType,
                connectTimeout: 9000,
                readTimeout: 9000
            });
        }
        
        // Fallback: standard fetch (Capacitor intercepts fetch automatically when enabled)
        const resp = await fetch(url, {
            method: 'GET',
            headers: headers,
            credentials: 'include'
        });
        
        let data;
        if (responseType === 'blob' || responseType === 'arraybuffer') {
            const blob = await resp.blob();
            data = await new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } else {
            data = await resp.text();
        }
        
        const hdrs = {};
        resp.headers.forEach((v, k) => { hdrs[k] = v; });
        return { data, headers: hdrs, status: resp.status };
    };

    try {
        console.log('[Captcha] Fetching official loginManager/youLogin.jsp from SRM...');
        const pageRes = await doNativeGet('https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }, 'text');

        const rawCookie = pageRes.headers ? (pageRes.headers['set-cookie'] || pageRes.headers['Set-Cookie'] || '') : '';
        const cleanCookie = parseCleanCookies(rawCookie);
        if (cleanCookie) _liveCookies = cleanCookie;

        // Extract the exact dynamic tokenized captcha URL
        let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
        if (pageRes.data && typeof pageRes.data === 'string') {
            const tokenMatch = pageRes.data.match(/data-src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i) || 
                               pageRes.data.match(/src=[\'"]([^\'"]*SCaptchaServlet[^\'"]*)[\'"]/i);
            if (tokenMatch) {
                const extractedPath = tokenMatch[1].trim().replace(/&amp;/g, '&');
                dynamicCaptchaUrl = extractedPath.startsWith('http') ? extractedPath : ('https://sp.srmist.edu.in' + (extractedPath.startsWith('/') ? '' : '/') + extractedPath);
                console.log('[Captcha] Found official tokenized URL:', dynamicCaptchaUrl);
            }
        }

        console.log('[Captcha] Requesting blob image stream from SCaptchaServlet...');
        const imgRes = await doNativeGet(dynamicCaptchaUrl, {
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
            'Cookie': _liveCookies || '',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        }, 'blob');

        if (imgRes && imgRes.data) {
            const formattedUrl = formatCaptchaDataUrl(imgRes.data);
            if (formattedUrl) {
                setCaptchaImage(formattedUrl);
                console.log('✅ Real official SRM portal captcha rendered successfully!');
                return;
            }
        }
    } catch (err) {
        console.warn('[Captcha] Primary portal fetch failed:', err);
    }

    // Proxy fallback if running in browser
    try {
        const res = await apiFetch('/api/captcha', { timeoutMs: 3000 });
        if (res && res.success && res.captchaImg) {
            _liveCookies = res.cookies || '';
            _hiddenFields = res.hidden_fields || {};
            _secConfig = res.sec_config || {};
            setCaptchaImage(res.captchaImg);
            console.log('✅ Real official SRM captcha rendered via proxy!');
            return;
        }
    } catch (_) {}

    // Show Retry button if completely offline
    box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Retry</div>';
    _isFetchingCaptcha = false;
}

// Auto-warmup on device ready
document.addEventListener('deviceready', () => { setTimeout(() => fetchLiveCaptcha(true), 300); }, false);
window.addEventListener('load', () => { setTimeout(() => fetchLiveCaptcha(false), 500); }, false);
`;

const sIdx = appJs.indexOf("// ─── 100% Real SRM Portal Captcha Engine");
const eIdx = appJs.indexOf("function refreshCaptcha()");

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + PURE_CORRECT_CAPTCHA_ENGINE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Correct Blob Base64 Captcha Engine!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
