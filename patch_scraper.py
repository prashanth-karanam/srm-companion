import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_JS_PATH = r'C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion\app.js'

with open(APP_JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    code = f.read()

ON_DEVICE_SCRAPER = '''// ─── On-Device Native SRM Scraper & HTML Parsers (100% Serverless) ───────────
function parseAttendanceHtml(html) {
    const rows = [];
    if (!html || typeof html !== 'string') return rows;
    const trMatches = html.match(/<tr[^>]*>[\\s\\S]*?<\\/tr>/gi) || [];
    for (const tr of trMatches) {
        if (tr.includes('<th')) continue;
        const tds = (tr.match(/<td[^>]*>([\\s\\S]*?)<\\/td>/gi) || []).map(td => td.replace(/<[^>]+>/g, '').trim());
        if (tds.length >= 6) {
            const code = tds[0];
            const title = tds[1];
            const conducted = parseFloat(tds[2]) || 0;
            const attended = parseFloat(tds[3]) || 0;
            const absent = parseFloat(tds[4]) || 0;
            const pct = tds[7] || tds[5] || '0.00';
            if (code && title) {
                rows.push({ code, subject: title, conducted, attended, absent, percentage: pct });
            }
        }
    }
    return rows;
}

function parseProfileHtml(html) {
    const profile = {};
    if (!html || typeof html !== 'string') return profile;
    const textClean = html.replace(/<script[\\s\\S]*?<\\/script>/gi, '').replace(/<style[\\s\\S]*?<\\/style>/gi, '');
    
    const regMatch = textClean.match(/Register\\s*No\\.?|Registration\\s*No\\.?[\\s\\S]*?<div[^>]*>([A-Z0-9]+)<\\/div>/i);
    if (regMatch) profile.regNo = regMatch[1].trim();

    const emailMatch = textClean.match(/Email\\s*ID[\\s\\S]*?<div[^>]*>([a-zA-Z0-9._%+-]+@srmist\\.edu\\.in)<\\/div>/i);
    if (emailMatch) profile.email = emailMatch[1].trim();

    const progMatch = textClean.match(/Program[\\s\\S]*?<div[^>]*>([\\s\\S]*?)<\\/div>/i);
    if (progMatch) profile.program = progMatch[1].replace(/<[^>]+>/g, '').trim();

    const secMatch = textClean.match(/Section[\\s\\S]*?<div[^>]*>([A-Za-z0-9]+)<\\/div>/i);
    if (secMatch) profile.section = secMatch[1].trim();

    const nameMatch = textClean.match(/Student\\s*Name[\\s\\S]*?<div[^>]*>([\\s\\S]*?)<\\/div>/i);
    if (nameMatch) profile.name = nameMatch[1].replace(/<[^>]+>/g, '').trim();

    return profile;
}

function parseTimetableHtml(html) {
    const timetable = { 1: [], 2: [], 3: [], 4: [], 5: [] };
    if (!html || typeof html !== 'string') return timetable;
    const trMatches = html.match(/<tr[^>]*>[\\s\\S]*?<\\/tr>/gi) || [];
    for (const tr of trMatches) {
        const dayMatch = tr.match(/Day\\s*([1-5])/i);
        if (dayMatch) {
            const dayNum = parseInt(dayMatch[1]);
            const tds = (tr.match(/<td[^>]*>([\\s\\S]*?)<\\/td>/gi) || []).map(td => td.replace(/<[^>]+>/g, '').trim());
            if (tds.length > 1) {
                timetable[dayNum] = tds.slice(1).map(slot => {
                    const parts = slot.split(/\\s*-\\s*|\\n+/).map(s => s.trim()).filter(Boolean);
                    return {
                        subject: parts[0] || 'Free Period',
                        code: parts[1] || '',
                        room: parts[2] || '',
                        slot: parts[3] || ''
                    };
                });
            }
        }
    }
    return timetable;
}

async function _scrapePortalDirectlyOnDevice(netid, password, captchaVal) {
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
                'Cookie': _liveCookies || ''
            },
            data: `username=${encodeURIComponent(netid)}&password=${encodeURIComponent(password)}&captcha=${encodeURIComponent(captchaVal || '')}`
        });

        const setCookies = loginRes.headers ? (loginRes.headers['Set-Cookie'] || loginRes.headers['set-cookie'] || '') : '';
        const activeCookies = setCookies || _liveCookies || '';

        // 1. Fetch Profile
        const profRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/studentProfile.jsp',
            headers: { 'Cookie': activeCookies, 'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp' },
            data: 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt='
        });
        const profile = parseProfileHtml(profRes.data || '');

        // 2. Fetch Attendance
        const attRes = await capacitorHttp.post({
            url: 'https://sp.srmist.edu.in/srmiststudentportal/students/report/attendanceReport.jsp',
            headers: { 'Cookie': activeCookies, 'Referer': 'https://sp.srmist.edu.in/srmiststudentportal/students/template/HRDSystem.jsp' },
            data: 'iden=1&filter=&hdnFormDetails=1&csrfPreventionSalt='
        });
        const attendance = parseAttendanceHtml(attRes.data || '');

        // 3. Fetch Timetable
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
        console.warn('[On-Device Scraper] Direct mobile scrape fallback:', err);
        return null;
    }
}

async function _kickBackendLogin(netid, password, captchaVal) {
    try {
        // Step 1: Try Direct On-Device Native Scraper (100% Serverless on Mobile)
        const onDeviceRes = await _scrapePortalDirectlyOnDevice(netid, password, captchaVal);
        let resp = onDeviceRes;

        // Step 2: Fallback to Cloud Backend if running in browser / testing
        if (!resp || !resp.success) {
            try {
                resp = await apiFetch('/api/login', {
                    method: 'POST',
                    body: JSON.stringify({ netid, password, captcha: captchaVal || '' }),
                    headers: { 'Content-Type': 'application/json' },
                    timeoutMs: 8000
                });
            } catch (_) {}
        }

        if (resp && resp.success) {
            const profile = resp.profile || {};
            if (profile.name)    { localStorage.setItem('srm_display_name', profile.name); }
            if (profile.regNo)   { localStorage.setItem('srm_reg_no', profile.regNo); }
            if (profile.program) { localStorage.setItem('srm_program', profile.program); }
            if (profile.section) { localStorage.setItem('srm_section', profile.section); }
            if (resp.attendance && resp.attendance.length) { 
                localStorage.setItem('srm_attendance_cache', JSON.stringify(resp.attendance)); 
            }
            if (resp.timetable && Object.keys(resp.timetable).length) { 
                localStorage.setItem('srm_timetable_cache', JSON.stringify(resp.timetable)); 
            }
            showAttendanceToast(`Welcome, ${profile.name || netid.toUpperCase()}!`, 'success');
            if (typeof loadAttendanceData === 'function') loadAttendanceData();
            if (typeof loadTimetable === 'function') loadTimetable();
        } else if (resp && resp.error) {
            showAttendanceToast('Portal status: ' + resp.error, 'info');
        }
    } catch (e) {
        console.warn('[SRM] Authentication sync notice:', e.message);
    }
}
'''

start_marker = 'async function _kickBackendLogin'
end_marker = 'async function doAutoLogin'

start_idx = code.find(start_marker)
end_idx = code.find(end_marker, start_idx)

if start_idx != -1 and end_idx != -1:
    code = code[:start_idx] + ON_DEVICE_SCRAPER + "\n\n" + code[end_idx:]
    with open(APP_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully replaced with on-device scraper!")
else:
    print("Could not find markers:", start_idx, end_idx)
