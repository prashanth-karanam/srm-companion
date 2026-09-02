const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const STRICT_AUTHENTICATION_SUITE = `async function _scrapePortalDirectlyOnDevice(netid, password, captchaVal) {
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (!capacitorHttp) return null;

    try {
        console.log('[On-Device Scraper] Authenticating directly with sp.srmist.edu.in...');
        const loginRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/LoginServlet',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                'Origin': 'https://sp.srmist.edu.in',
                'Cookie': _liveCookies || '',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
            },
            data: \`username=\${encodeURIComponent(netid)}&password=\${encodeURIComponent(password)}&captcha=\${encodeURIComponent(captchaVal || '')}\`
        });

        const html = typeof loginRes.data === 'string' ? loginRes.data : '';

        // Check if SRM rejected the authentication
        if (html.includes('Invalid credentials') || html.includes('alert-danger') || html.includes('youLogin.jsp') || html.includes('login_form')) {
            console.warn('[On-Device Scraper] SRM portal login rejected credentials');
            let errMsg = 'Invalid NetID, Password or Captcha code';
            if (html.includes('Invalid credentials')) errMsg = 'Invalid NetID or Password';
            if (html.includes('Invalid Captcha')) errMsg = 'Captcha code did not match';
            return { success: false, error: errMsg };
        }

        const setCookies = loginRes.headers ? (loginRes.headers['Set-Cookie'] || loginRes.headers['set-cookie'] || '') : '';
        const activeCookies = parseCleanCookies(setCookies) || _liveCookies || '';

        // 1. Fetch Profile
        console.log('[On-Device Scraper] Loading student profile from SRM...');
        const profRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/studentProfile.jsp',
            headers: { 'Cookie': activeCookies, 'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp' },
            data: 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt='
        });
        const profile = parseProfileHtml(profRes.data || '');

        // 2. Fetch Attendance
        console.log('[On-Device Scraper] Loading attendance records from SRM...');
        const attRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp',
            headers: { 'Cookie': activeCookies, 'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp' },
            data: 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt='
        });
        const attendance = parseAttendanceHtml(attRes.data || '');

        // 3. Fetch Timetable
        console.log('[On-Device Scraper] Loading timetable from SRM...');
        const ttRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/timeTableReport.jsp',
            headers: { 'Cookie': activeCookies, 'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp' },
            data: 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt='
        });
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
        if (btn) { btn.disabled = true; btn.textContent = 'Authenticating with SRM…'; }
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'none';
    }

    try {
        // Step 1: Real On-Device SRM Portal Authentication
        const res = await _scrapePortalDirectlyOnDevice(rawId, pass, captchaVal);

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
        } else if (res && !res.success) {
            if (!isBackgroundRefresh) {
                showErr('❌ ' + (res.error || 'Invalid NetID, Password or Captcha'));
                if (btn) { btn.disabled = false; btn.textContent = '⚡ Sign In & Sync'; }
                fetchLiveCaptcha(true); // Get fresh captcha for next attempt
            }
            return false;
        }
    } catch (e) {
        console.warn('[Login] Authentication error:', e);
        if (!isBackgroundRefresh) {
            showErr('❌ Portal connection error. Please try again.');
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
    appJs = appJs.substring(0, sIdx) + STRICT_AUTHENTICATION_SUITE + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Strict Real SRM Portal Authentication Engine!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
