const fs = require('fs');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const INSTANT_OFFICIAL_CAPTCHA_ENGINE = `function createOfficialSrmCaptchaSvg(captchaText) {
    if (!captchaText) return '';
    const width = 175;
    const height = 45;
    let svg = '<svg xmlns="http://www.w3.org/2000/svg" width="' + width + '" height="' + height + '">';
    svg += '<rect width="100%" height="100%" fill="#f2f2f2"/>';
    for (let i = 0; i < 8; i++) {
        const x1 = Math.random() * width;
        const y1 = Math.random() * height;
        const x2 = Math.random() * width;
        const y2 = Math.random() * height;
        const r = Math.floor(Math.random() * 200);
        const g = Math.floor(Math.random() * 200);
        const b = Math.floor(Math.random() * 200);
        svg += '<line x1="' + x1 + '" y1="' + y1 + '" x2="' + x2 + '" y2="' + y2 + '" stroke="rgba(' + r + ',' + g + ',' + b + ',0.5)" stroke-width="2"/>';
    }
    const spacing = 135 / Math.max(captchaText.length, 1);
    for (let j = 0; j < captchaText.length; j++) {
        const x = 15 + (j * spacing);
        const y = 32 + (Math.random() * 6 - 3);
        const angle = (Math.random() * 50) - 25;
        svg += '<text x="' + x + '" y="' + y + '" transform="rotate(' + angle + ', ' + x + ', ' + y + ')" font-family="monospace, sans-serif" font-size="28" font-weight="bold" fill="#333">' + captchaText[j] + '</text>';
    }
    svg += '</svg>';
    return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
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

    const doNativeGet = async (url, headers = {}, responseType = 'text', timeoutMs = 7000) => {
        const cap = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
        if (cap) {
            return await cap.get({
                url: url,
                headers: headers,
                responseType: responseType,
                connectTimeout: timeoutMs,
                readTimeout: timeoutMs
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
        console.log('[Captcha] Fetching official youLogin.jsp from SRM...');
        const pageRes = await doNativeGet('https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp', {
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
        }, 'text', 6000);

        const rawCookie = pageRes.headers ? (pageRes.headers['set-cookie'] || pageRes.headers['Set-Cookie'] || '') : '';
        if (rawCookie) _liveCookies = mergeCookies(_liveCookies, rawCookie);

        let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
        let nonceVal = '';
        let serverCaptchaText = '';

        if (pageRes.data && typeof pageRes.data === 'string') {
            const html = pageRes.data;
            const nonceMatch = html.match(/nonce\\s*:\\s*['"]([^'"]+)['"]/i);
            const dfMatch = html.match(/domainFieldName\\s*=\\s*['"]([^'"]+)['"]/i);
            const cfMatch = html.match(/captchaFieldName\\s*=\\s*['"]([^'"]+)['"]/i);
            const rdMatch = html.match(/randomDelimiter\\s*=\\s*['"]([^'"]+)['"]/i);
            const textMatch = html.match(/captchaText\\s*=\\s*['"]([^'"]+)['"]/i);

            nonceVal = nonceMatch ? nonceMatch[1] : '';
            serverCaptchaText = textMatch ? textMatch[1] : '';

            _secConfig = {
                nonce: nonceVal,
                domainFieldName: dfMatch ? dfMatch[1] : '',
                captchaFieldName: cfMatch ? cfMatch[1] : '',
                randomDelimiter: rdMatch ? rdMatch[1] : '',
                captchaText: serverCaptchaText
            };
            console.log('[Captcha] Extracted SRM Security Tokens & Live Captcha Text:', _secConfig);

            // Step 1: Render official SRM Captcha INSTANTLY (0ms latency!)
            if (serverCaptchaText) {
                const instantSvgUrl = createOfficialSrmCaptchaSvg(serverCaptchaText);
                setCaptchaImage(instantSvgUrl);
                console.log('⚡ Rendered official SRM Captcha instantly from live portal payload!');
            }

            const tokenMatch = html.match(/data-src=['"]([^'"]*SCaptchaServlet[^'"]*)['"]/i) || 
                               html.match(/src=['"]([^'"]*SCaptchaServlet[^'"]*)['"]/i);
            if (tokenMatch) {
                const extractedPath = tokenMatch[1].trim().replace(/&amp;/g, '&');
                dynamicCaptchaUrl = extractedPath.startsWith('http') ? extractedPath : ('https://sp.srmist.edu.in' + (extractedPath.startsWith('/') ? '' : '/') + extractedPath);
            }
        }

        // Step 2: Attempt PNG blob upgrade in background (non-blocking)
        const captchaHeaders = {
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
            'Cookie': _liveCookies || '',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        };

        if (nonceVal) {
            captchaHeaders['X-Domain-Proof'] = btoa(nonceVal + ':sp.srmist.edu.in');
        }

        const imgRes = await doNativeGet(dynamicCaptchaUrl, captchaHeaders, 'blob', 3000).catch(() => null);

        if (imgRes && imgRes.data) {
            const formattedUrl = formatCaptchaDataUrl(imgRes.data);
            if (formattedUrl) {
                setCaptchaImage(formattedUrl);
                console.log('✅ Upgraded to high-definition PNG captcha stream from SRM!');
                return;
            }
        }
    } catch (e) {
        console.warn('[Captcha] Direct fetch error:', e);
    }

    _isFetchingCaptcha = false;
    if (box && !box.querySelector('img')) {
        box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Retry</div>';
    }
}
`;

const sIdx = appJs.indexOf('async function fetchLiveCaptcha(force = false) {');
const eIdx = appJs.indexOf('async function _scrapePortalDirectlyOnDevice');

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + INSTANT_OFFICIAL_CAPTCHA_ENGINE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Instant Official SRM Captcha Engine in app.js!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
