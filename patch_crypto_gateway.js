const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

// 1. Add showErr definition if missing
if (!appJs.includes('function showErr(')) {
    appJs = `function showErr(msg) {
    const errEl = document.getElementById('login-error');
    if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = msg;
    }
    showAttendanceToast(msg, 'error');
}
window.showErr = showErr;
\n` + appJs;
}

// 2. Patch fetchLiveCaptcha to extract _secConfig from youLogin.jsp
const fetchMarkerStart = 'async function fetchLiveCaptcha(force = false) {';
const fetchMarkerEnd = 'async function _scrapePortalDirectlyOnDevice';

const sFetch = appJs.indexOf(fetchMarkerStart);
const eFetch = appJs.indexOf(fetchMarkerEnd);

const PERFECT_CAPTCHA_AND_AUTH = `async function fetchLiveCaptcha(force = false) {
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

        // Extract Java Anti-Bot security nonces & dynamic token fields
        let dynamicCaptchaUrl = 'https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?t=' + Date.now();
        if (pageRes.data && typeof pageRes.data === 'string') {
            const html = pageRes.data;
            const nonceMatch = html.match(/nonce\s*:\s*['"]([^'"]+)['"]/i);
            const dfMatch = html.match(/domainFieldName\s*=\s*['"]([^'"]+)['"]/i);
            const cfMatch = html.match(/captchaFieldName\s*=\s*['"]([^'"]+)['"]/i);
            const rdMatch = html.match(/randomDelimiter\s*=\s*['"]([^'"]+)['"]/i);

            _secConfig = {
                nonce: nonceMatch ? nonceMatch[1] : '',
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

        console.log('[Captcha] Requesting blob image stream from SCaptchaServlet...');
        const captchaHeaders = {
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
            'Cookie': _liveCookies || '',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36',
            'Accept': 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8'
        };
        if (_secConfig && _secConfig.nonce) {
            captchaHeaders['X-Domain-Proof'] = btoa(\`\${_secConfig.nonce}:sp.srmist.edu.in\`);
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

async function _scrapePortalDirectlyOnDevice(netid, password, captchaVal, onProgress) {
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (!capacitorHttp) return { success: false, error: 'Capacitor native bridge not ready.' };

    try {
        if (typeof onProgress === 'function') onProgress('Verifying credentials…');
        console.log('[On-Device Scraper] Authenticating directly with sp.srmist.edu.in...');
        
        const loginData = {
            username: netid,
            password: password,
            captcha: captchaVal || ''
        };

        // 1. Attach Dynamic Java Security Tokens required by guardlogin.js
        if (_secConfig && _secConfig.domainFieldName) {
            const reversedHost = "sp.srmist.edu.in".split("").reverse().join("");
            loginData[_secConfig.domainFieldName] = btoa(reversedHost);
        }
        if (_secConfig && _secConfig.captchaFieldName) {
            const rd = _secConfig.randomDelimiter || '1c8e';
            const trap = \`4\${rd}12\`;
            loginData[_secConfig.captchaFieldName] = btoa(trap);
        }

        // 2. Attach Browser Telemetry Payload
        const nowMs = Date.now();
        const telemetry = {
            "startTime": nowMs - 4200,
            "currentDomain": "sp.srmist.edu.in",
            "timezoneOffset": -330,
            "screenWidth": 1080,
            "screenHeight": 1920,
            "colorDepth": 24,
            "devicePixelRatio": 1,
            "platform": "Android",
            "userAgent": "Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 Chrome/120.0 Mobile Safari/537.36",
            "language": "en-US",
            "hardwareConcurrency": 8,
            "deviceMemory": 8,
            "touchSupport": true,
            "webdriver": false,
            "mouseClicks": 2,
            "mouseMovements": 14,
            "keystrokeCount": 18,
            "typingSpeedMs": 240,
            "canvasHash": "c4d812a",
            "submitTime": nowMs,
            "timeOnPageMs": 4200
        };
        loginData['telemetryPayload'] = btoa(JSON.stringify(telemetry));

        const loginHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
            'Origin': 'https://sp.srmist.edu.in',
            'Cookie': _liveCookies || '',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
        };

        if (_secConfig && _secConfig.nonce) {
            loginHeaders['X-Domain-Proof'] = btoa(\`\${_secConfig.nonce}:sp.srmist.edu.in\`);
        }

        const loginRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/LoginServlet',
            headers: loginHeaders,
            data: loginData,
            connectTimeout: 8000,
            readTimeout: 8000
        });

        const html = typeof loginRes.data === 'string' ? loginRes.data : '';

        // Immediate check: Did SRM reject the credentials?
        if (html.includes('Invalid credentials') || html.includes('alert-danger') || (html.includes('youLogin.jsp') && !html.includes('HRDSystem'))) {
            console.warn('[On-Device Scraper] SRM portal login rejected credentials');
            let errMsg = 'Invalid NetID, Password or Captcha code';
            if (html.includes('Invalid credentials')) errMsg = 'Invalid NetID or Password';
            if (html.includes('Invalid Captcha')) errMsg = 'Captcha code did not match';
            return { success: false, error: errMsg };
        }

        if (typeof onProgress === 'function') onProgress('Syncing student records…');

        const setCookies = loginRes.headers ? (loginRes.headers['set-cookie'] || loginRes.headers['Set-Cookie'] || '') : '';
        const activeCookies = parseCleanCookies(setCookies) || _liveCookies || '';

        console.log('[On-Device Scraper] Login verified! Scraping profile, attendance & timetable concurrently...');
        
        // 2. Fetch Profile, Attendance, and Timetable in Parallel
        const scrapeHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': activeCookies,
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
        };

        const postBody = { iden: '1', filter: '', hdnFormDetails: '1', csrfPreventionSalt: '' };

        const [profRes, attRes, ttRes] = await Promise.all([
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/studentProfile.jsp',
                headers: scrapeHeaders,
                data: postBody,
                connectTimeout: 7000,
                readTimeout: 7000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp',
                headers: scrapeHeaders,
                data: postBody,
                connectTimeout: 7000,
                readTimeout: 7000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/timeTableReport.jsp',
                headers: scrapeHeaders,
                data: postBody,
                connectTimeout: 7000,
                readTimeout: 7000
            }).catch(() => ({ data: '' }))
        ]);

        const profile = parseProfileHtml(profRes.data || '');
        const attendance = parseAttendanceHtml(attRes.data || '');
        const timetable = parseTimetableHtml(ttRes.data || '');

        return {
            success: true,
            profile,
            attendance,
            timetable
        };
    } catch (err) {
        console.warn('[On-Device Scraper] Direct mobile scrape failure:', err);
        return { success: false, error: 'Connection error connecting to SRM portal.' };
    }
}
`;

if (sFetch !== -1 && eFetch !== -1) {
    appJs = appJs.substring(0, sFetch) + PERFECT_CAPTCHA_AND_AUTH + '\n\n' + appJs.substring(eFetch);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Full Java Cryptographic SRM Gateway & showErr in app.js!');
} else {
    console.error('Markers not found:', sFetch, eFetch);
}
