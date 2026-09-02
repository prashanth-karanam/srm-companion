const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const HIGH_SPEED_PARALLEL_AUTH = `async function _scrapePortalDirectlyOnDevice(netid, password, captchaVal) {
    const capacitorHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (!capacitorHttp) return null;

    try {
        console.log('[On-Device Scraper] Authenticating directly with sp.srmist.edu.in...');
        
        // 1. Submit Credentials to LoginServlet with explicit 7s mobile timeout
        const loginRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/LoginServlet',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp',
                'Origin': 'https://sp.srmist.edu.in',
                'Cookie': _liveCookies || '',
                'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
            },
            data: \`username=\${encodeURIComponent(netid)}&password=\${encodeURIComponent(password)}&captcha=\${encodeURIComponent(captchaVal || '')}\`,
            connectTimeout: 7000,
            readTimeout: 7000
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

        const setCookies = loginRes.headers ? (loginRes.headers['set-cookie'] || loginRes.headers['Set-Cookie'] || '') : '';
        const activeCookies = parseCleanCookies(setCookies) || _liveCookies || '';

        console.log('[On-Device Scraper] Login verified! Scraping profile, attendance & timetable concurrently...');
        
        // 2. Fetch Profile, Attendance, and Timetable IN PARALLEL (Blazing Fast)
        const postData = 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt=';
        const scrapeHeaders = {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Cookie': activeCookies,
            'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp',
            'User-Agent': 'Mozilla/5.0 (Linux; Android 14; Mobile) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Mobile Safari/537.36'
        };

        const [profRes, attRes, ttRes] = await Promise.all([
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/studentProfile.jsp',
                headers: scrapeHeaders,
                data: postData,
                connectTimeout: 7000,
                readTimeout: 7000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp',
                headers: scrapeHeaders,
                data: postData,
                connectTimeout: 7000,
                readTimeout: 7000
            }).catch(() => ({ data: '' })),
            capacitorHttp.post({
                url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/timeTableReport.jsp',
                headers: scrapeHeaders,
                data: postData,
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

const startMarker = 'async function _scrapePortalDirectlyOnDevice';
const endMarker = 'async function doAutoLogin';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + HIGH_SPEED_PARALLEL_AUTH + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed High-Speed Parallel Scraper with 7s Timeout!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
