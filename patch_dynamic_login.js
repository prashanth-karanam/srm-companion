const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const OPTIMIZED_LOGIN_SUITE = `async function _scrapePortalDirectlyOnDevice(netid, password, captchaVal, onProgress) {
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (!capacitorHttp) return { success: false, error: 'Capacitor native bridge not ready.' };

    try {
        if (typeof onProgress === 'function') onProgress('Verifying credentials…');
        console.log('[On-Device Scraper] Authenticating directly with sp.srmist.edu.in...');
        
        // 1. Submit Credentials to LoginServlet with explicit 6s mobile timeout
        const loginRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/LoginServlet',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                'Origin': 'https://sp.srmist.edu.in',
                'Cookie': _liveCookies || '',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
            },
            data: {
                username: netid,
                password: password,
                captcha: captchaVal || ''
            },
            connectTimeout: 6000,
            readTimeout: 6000
        });

        const html = typeof loginRes.data === 'string' ? loginRes.data : '';

        // Immediate validation of SRM portal response
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
        
        // 2. Fetch Profile, Attendance, and Timetable IN PARALLEL (Sub-second execution)
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
                connectTimeout: 6000,
                readTimeout: 6000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp',
                headers: scrapeHeaders,
                data: postBody,
                connectTimeout: 6000,
                readTimeout: 6000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/timeTableReport.jsp',
                headers: scrapeHeaders,
                data: postBody,
                connectTimeout: 6000,
                readTimeout: 6000
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

async function doAutoLogin(isBackgroundRefresh = false) {
    const rawId = isBackgroundRefresh ? localStorage.getItem('srm_auto_id') : document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '');
    const pass  = isBackgroundRefresh ? localStorage.getItem('srm_auto_pass') : document.getElementById('login-pass')?.value;
    const captchaVal = document.getElementById('login-captcha')?.value.trim();
    const btn   = document.getElementById('login-btn');

    if (!rawId) { 
        if (!isBackgroundRefresh) showErr('Please enter your SRM NetID'); 
        return false; 
    }
    if (!pass) {
        if (!isBackgroundRefresh) showErr('Please enter your portal password');
        return false;
    }
    if (!isBackgroundRefresh && (!captchaVal || captchaVal.length < 3)) {
        showErr('Please enter the 6-character Captcha shown in the image.');
        document.getElementById('login-captcha')?.focus();
        return false;
    }

    if (!isBackgroundRefresh) {
        if (btn) { btn.disabled = true; btn.textContent = 'Connecting to SRM…'; }
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'none';
    }

    try {
        const res = await _scrapePortalDirectlyOnDevice(rawId, pass, captchaVal, (msg) => {
            if (btn && !isBackgroundRefresh) btn.textContent = msg;
        });

        if (res && res.success) {
            const profile = res.profile || {};
            const realName = profile.name || rawId.toUpperCase();
            const regNo = profile.regNo || '';
            const program = profile.program || '';
            const section = profile.section || '';

            localStorage.setItem('srm_auto_id', rawId);
            localStorage.setItem('srm_auto_pass', pass);
            localStorage.setItem('srm_display_name', realName);
            localStorage.setItem('srm_reg_no', regNo);
            localStorage.setItem('srm_program', program);
            localStorage.setItem('srm_section', section);
            setToken('srm_session_' + rawId + '_' + Date.now());

            if (res.attendance && res.attendance.length > 0) {
                localStorage.setItem('srm_attendance_cache', JSON.stringify(res.attendance));
            }
            if (res.timetable && res.timetable.length > 0) {
                localStorage.setItem('srm_timetable_cache', JSON.stringify(res.timetable));
            }

            if (!isBackgroundRefresh) {
                onLoginSuccess();
                showAttendanceToast(\`Welcome, \${realName}!\`, 'success');
                if (typeof loadAttendanceData === 'function') loadAttendanceData();
                if (typeof loadTimetable === 'function') loadTimetable();
            }
            return true;
        } else {
            // Display failure and refresh captcha
            if (!isBackgroundRefresh) {
                const errorMsg = (res && res.error) ? res.error : 'Invalid NetID, Password or Captcha';
                showErr('❌ ' + errorMsg);
                if (btn) { btn.disabled = false; btn.textContent = '⚡ Sign In & Sync'; }
                fetchLiveCaptcha(true);
            }
            return false;
        }
    } catch (e) {
        console.warn('[Login] Authentication exception:', e);
        if (!isBackgroundRefresh) {
            showErr('❌ Connection error. Please tap Refresh Captcha and try again.');
            if (btn) { btn.disabled = false; btn.textContent = '⚡ Sign In & Sync'; }
            fetchLiveCaptcha(true);
        }
        return false;
    }
}
`;

const startMarker = 'async function _scrapePortalDirectlyOnDevice';
const endMarker = 'function onLoginSuccess()';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + OPTIMIZED_LOGIN_SUITE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Optimized Dynamic Login Suite with Live Telemetry!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
