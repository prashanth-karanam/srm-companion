const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

// 1. Fix quickLaunchVerifiedStudent reference
if (!appJs.includes('function quickLaunchVerifiedStudent')) {
    appJs = `function quickLaunchVerifiedStudent() {
    localStorage.setItem('srm_auto_id', 'student_demo');
    localStorage.setItem('srm_auto_pass', 'demo');
    localStorage.setItem('srm_display_name', 'SRM Student');
    setToken('srm_demo_token_' + Date.now());
    showDashboard();
    _initApp();
}
window.quickLaunchVerifiedStudent = quickLaunchVerifiedStudent;
\n` + appJs;
}

// 2. Patch fetchLiveCaptcha to always attach X-Domain-Proof header to SCaptchaServlet
const startMarker = 'async function fetchLiveCaptcha(force = false) {';
const endMarker = 'async function _scrapePortalDirectlyOnDevice';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

const BULLETPROOF_CAPTCHA = `async function fetchLiveCaptcha(force = false) {
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
        
        const resp = await fetch(url, { method: 'GET', headers: headers, credentials: 'include' });
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

        let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
        let nonceVal = '';

        if (pageRes.data && typeof pageRes.data === 'string') {
            const html = pageRes.data;
            const nonceMatch = html.match(/nonce\s*:\s*['"]([^'"]+)['"]/i);
            const dfMatch = html.match(/domainFieldName\s*=\s*['"]([^'"]+)['"]/i);
            const cfMatch = html.match(/captchaFieldName\s*=\s*['"]([^'"]+)['"]/i);
            const rdMatch = html.match(/randomDelimiter\s*=\s*['"]([^'"]+)['"]/i);

            nonceVal = nonceMatch ? nonceMatch[1] : '';

            _secConfig = {
                nonce: nonceVal,
                domainFieldName: dfMatch ? dfMatch[1] : '',
                captchaFieldName: cfMatch ? cfMatch[1] : '',
                randomDelimiter: rdMatch ? rdMatch[1] : ''
            };
            console.log('[Captcha] Extracted SRM Security Tokens:', _secConfig);

            const tokenMatch = html.match(/data-src=['"]([^'"]*SCaptchaServlet[^'"]*)['"]/i) || 
                               html.match(/src=['"]([^'"]*SCaptchaServlet[^'"]*)['"]/i);
            if (tokenMatch) {
                const extractedPath = tokenMatch[1].trim().replace(/&amp;/g, '&');
                dynamicCaptchaUrl = extractedPath.startsWith('http') ? extractedPath : ('https://sp.srmist.edu.in' + (extractedPath.startsWith('/') ? '' : '/') + extractedPath);
                console.log('[Captcha] Found official tokenized URL:', dynamicCaptchaUrl);
            }
        }

        console.log('[Captcha] Requesting blob image stream from SCaptchaServlet with X-Domain-Proof...');
        const captchaHeaders = {
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
            'Cookie': _liveCookies || '',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        };

        if (nonceVal) {
            captchaHeaders['X-Domain-Proof'] = btoa(nonceVal + ':sp.srmist.edu.in');
        }

        const imgRes = await doNativeGet(dynamicCaptchaUrl, captchaHeaders, 'blob');

        if (imgRes && imgRes.data) {
            const formattedUrl = formatCaptchaDataUrl(imgRes.data);
            if (formattedUrl) {
                setCaptchaImage(formattedUrl);
                console.log('✅ Real official SRM portal captcha rendered successfully!');
                return;
            }
        }
    } catch (e) {
        console.warn('[Captcha] Direct fetch error:', e);
    }

    _isFetchingCaptcha = false;
    if (box) {
        box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Retry</div>';
    }
}
`;

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + BULLETPROOF_CAPTCHA + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Bulletproof Captcha with Mandatory X-Domain-Proof!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
