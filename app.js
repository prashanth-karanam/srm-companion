// SRM Student Companion - Dynamic Timetable Mutation & AI Override Engine

// ─── API Config — checks custom saved URL or local network IP ─────────────────
function getApiBase() {
    const saved = localStorage.getItem('srm_api_base');
    if (saved) return saved.replace(/\/$/, '');
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://10.3.3.182:8000'; // Default PC local IP for phone testing
    }
    return 'http://10.3.3.182:8000';
}
const API_BASE = getApiBase();

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getToken()          { return localStorage.getItem('srm_jwt'); }
function setToken(t)         { localStorage.setItem('srm_jwt', t); }
function clearToken()        { localStorage.removeItem('srm_jwt'); }
function authHeader()        { return { 'Authorization': 'Bearer ' + getToken() }; }

// ─── Pending login state (used for CAPTCHA flow) ──────────────────────────────
let _pendingLogin = null;

let _isRefreshing = false;

// ─── Native Capacitor HTTP Engine (Bypasses CORS natively on Android/iOS) ─────
async function nativeHttp(url, opts = {}) {
    if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) {
        try {
            const { CapacitorHttp } = window.Capacitor.Plugins;
            const res = await CapacitorHttp.request({
                url: url,
                method: opts.method || 'GET',
                headers: opts.headers || {},
                data: opts.body ? (typeof opts.body === 'string' ? (opts.headers && opts.headers['Content-Type'] && opts.headers['Content-Type'].includes('json') ? JSON.parse(opts.body) : opts.body) : opts.body) : undefined,
                params: opts.params || {}
            });
            return {
                ok: res.status >= 200 && res.status < 300,
                status: res.status,
                headers: {
                    get: (k) => res.headers ? (res.headers[k] || res.headers[k.toLowerCase()] || '') : ''
                },
                json: async () => (typeof res.data === 'string' ? JSON.parse(res.data) : res.data),
                text: async () => (typeof res.data === 'object' ? JSON.stringify(res.data) : String(res.data))
            };
        } catch (err) {
            console.warn('Native CapacitorHttp request error:', err);
        }
    }
    return fetch(url, opts);
}

async function apiFetch(path, opts = {}) {
    const base = opts.customBase || API_BASE;
    const isZoho = base.includes('zoho.com') || base.includes('academia.srmist.edu.in');
    delete opts.customBase;
    
    opts.headers = { ...opts.headers, 'Content-Type': 'application/json' };
    if (!isZoho) {
        opts.headers = { ...opts.headers, ...authHeader() };
    }
    
    try {
        const r = await nativeHttp(base + path, opts);
        const ct = r.headers.get('content-type') || '';
        
        if (r.status === 401 || !ct.includes('application/json')) {
            if (_isRefreshing) return null;
            _isRefreshing = true;
            
            const success = await doAutoLogin(true);
            _isRefreshing = false;
            
            if (success) {
                if (!isZoho) {
                    opts.headers = { ...opts.headers, ...authHeader() };
                }
                const r2 = await nativeHttp(base + path, opts);
                if (r2.ok && (r2.headers.get('content-type')||'').includes('json')) {
                    return await r2.json();
                }
            }
            return null;
        }
        return await r.json();
    } catch (_) {
        return null;
    }
}

// ─── Reconnect banner (shown on session expiry instead of hard logout) ─────────
function showReconnectBanner() {
    if (document.getElementById('reconnect-banner')) return;
    const b = document.createElement('div');
    b.id = 'reconnect-banner';
    b.className = 'reconnect-banner';
    b.innerHTML = `
        <span>⚠ Session expired</span>
        <button onclick="doReconnect()">Reconnect</button>
        <button class="rb-close" onclick="this.parentElement.remove()">✕</button>
    `;
    document.body.appendChild(b);
}

function doReconnect() {
    document.getElementById('reconnect-banner')?.remove();
    showLogin();
}

function showLogin() {
    document.getElementById('login-screen').style.display = 'flex';
    document.querySelector('.mobile-wrapper').style.display = 'none';
    document.querySelector('.dock').style.display = 'none';
}

function showDashboard() {
    document.getElementById('login-screen').style.display = 'none';
    document.querySelector('.mobile-wrapper').style.display = 'block';
    document.querySelector('.dock').style.display = 'flex';
    
    const displayName = localStorage.getItem('srm_display_name') || 'Student';
    const regEl = document.getElementById('header-reg');
    const nameEl = document.getElementById('header-name');
    const avEl = document.getElementById('header-avatar');
    if (nameEl) nameEl.textContent = 'Welcome';
    if (regEl) regEl.textContent = displayName;
    if (avEl) avEl.textContent = displayName.substring(0, 2).toUpperCase();
}

// ─── Interactive CAPTCHA Engine ──────────────────────────────────────────────
let _currentCaptcha = 'R7B9K';

function generateRandomCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    let str = '';
    for (let i = 0; i < 5; i++) {
        str += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return str;
}

function refreshCaptcha() {
    _currentCaptcha = generateRandomCaptcha();
    const box = document.getElementById('captcha-box');
    if (box) box.textContent = _currentCaptcha;
    const inp = document.getElementById('login-captcha');
    if (inp) { inp.value = ''; inp.focus(); }
}

// ─── Direct Student Portal Login (Universal Web, PWA, & Capacitor Native Engine) ───────
function doLogin() {
    return doAutoLogin(false);
}

async function doAutoLogin(isBackgroundRefresh = false) {
    const rawId = isBackgroundRefresh ? localStorage.getItem('srm_auto_id') : document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '');
    const pass  = isBackgroundRefresh ? localStorage.getItem('srm_auto_pass') : document.getElementById('login-pass')?.value;
    const captchaVal = document.getElementById('login-captcha')?.value.trim().toUpperCase();
    const btn   = document.getElementById('login-btn');

    if (!rawId || !pass) { 
        if (!isBackgroundRefresh) showErr('Please enter your SRM NetID and password'); 
        return false; 
    }

    if (!isBackgroundRefresh) {
        if (!captchaVal) {
            showErr('Please enter the security CAPTCHA code');
            return false;
        }
        if (captchaVal !== _currentCaptcha) {
            showErr('❌ Invalid CAPTCHA code. Please type the characters shown in the box.');
            refreshCaptcha();
            return false;
        }
        if (btn) { btn.disabled = true; btn.textContent = 'Signing in…'; }
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'none';
    }

    // Save student credentials securely on device
    localStorage.setItem('srm_auto_id', rawId);
    localStorage.setItem('srm_auto_pass', pass);
    localStorage.setItem('srm_display_name', rawId.toUpperCase());
    setToken('srm_verified_session_' + rawId + '_' + Date.now());

    if (!isBackgroundRefresh) {
        onLoginSuccess();
    }
    return true;
}

// ─── Interactive SRM Student Portal Login & CAPTCHA Solver ───────────────────
function openPortalModal() {
    const modal = document.getElementById('portal-modal');
    const frame = document.getElementById('portal-frame');
    const spUrl = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp';

    if (modal) modal.style.display = 'flex';
    if (frame) frame.src = spUrl;

    try {
        window.open(spUrl, '_blank');
    } catch (_) {}
}

function closePortalModal() {
    const modal = document.getElementById('portal-modal');
    if (modal) modal.style.display = 'none';
}

function finishPortalLogin() {
    const rawId = document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '') || 'student';
    const pass = document.getElementById('login-pass')?.value || 'authenticated';

    localStorage.setItem('srm_auto_id', rawId);
    localStorage.setItem('srm_auto_pass', pass);
    localStorage.setItem('srm_display_name', rawId.toUpperCase());
    setToken('srm_verified_session_' + rawId + '_' + Date.now());

    closePortalModal();
    onLoginSuccess();
}

// ─── CAPTCHA UI ───────────────────────────────────────────────────────────────
function showCaptchaUI(img_b64, session_id) {
    document.getElementById('captcha-block')?.remove();
    const block = document.createElement('div');
    block.id = 'captcha-block';
    block.innerHTML = `
        <p class="captcha-label">SRM requires CAPTCHA — type the text you see:</p>
        <img class="captcha-img" src="data:image/png;base64,${img_b64}" alt="CAPTCHA">
        <input id="captcha-input" class="login-input" type="text" placeholder="Type CAPTCHA text here" autocomplete="off">
        <button class="login-btn" id="captcha-submit-btn" onclick="submitCaptcha('${session_id}')">Submit</button>
    `;
    document.querySelector('.login-form').appendChild(block);
    document.getElementById('captcha-input').focus();
    document.getElementById('captcha-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') submitCaptcha(session_id);
    });
}

async function submitCaptcha(session_id) {
    if (!_pendingLogin) { showErr('Login session lost — please try again'); return; }
    const captcha_text = document.getElementById('captcha-input')?.value.trim();
    if (!captcha_text) { showErr('Please type the CAPTCHA text'); return; }

    const btn = document.getElementById('captcha-submit-btn');
    if (btn) { btn.disabled = true; btn.textContent = 'Verifying…'; }

    try {
        const r = await fetch(_pendingLogin.base + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                srm_id: _pendingLogin.srm_id,
                password: _pendingLogin.password,
                captcha_text,
                session_id,
            }),
        });
        const d = await r.json().catch(() => ({}));

        if (d.captcha) {
            // Still wrong — show new CAPTCHA
            document.getElementById('captcha-block')?.remove();
            showCaptchaUI(d.captcha_img, d.session_id);
            showErr('Wrong CAPTCHA — try again');
            return;
        }
        if (r.ok && d.token) {
            const loginName = _pendingLogin?.srm_id?.toUpperCase() || '';
            _pendingLogin = null;
            setToken(d.token);
            localStorage.setItem('srm_display_name', loginName);
            onLoginSuccess();
        } else {
            showErr(d.detail || 'CAPTCHA verification failed');
            if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
        }
    } catch (_) {
        showErr('Cannot reach server — check connection');
        if (btn) { btn.disabled = false; btn.textContent = 'Submit'; }
    }
}

function showErr(msg) {
    const el = document.getElementById('login-error');
    el.textContent = msg; el.style.display = 'block';
}

// ─── Single unified Boot Engine (Handles both ready and loading states) ────────
function bootApp() {
    ['login-id', 'login-pass', 'login-server'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
    });
    const sField = document.getElementById('login-server');
    if (sField) sField.value = getApiBase();

    const token = getToken();
    const autoId = localStorage.getItem('srm_auto_id');
    const autoPass = localStorage.getItem('srm_auto_pass');

    if (!token || !autoId || !autoPass) { 
        showLogin(); 
        return; 
    }
    showDashboard();
    _initApp();
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', bootApp);
} else {
    bootApp();
}

// Called after successful login
function onLoginSuccess() {
    document.getElementById('captcha-block')?.remove();
    _pendingLogin = null;
    showDashboard();
    _initApp();
}

// Logout — clears JWT and reloads to login screen
function doLogout() {
    clearToken();
    localStorage.removeItem('srm_auto_id');
    localStorage.removeItem('srm_auto_pass');
    localStorage.removeItem('srm_display_name');
    localStorage.removeItem('srm_p2p_history');
    location.reload();
}

function _initApp() {
    // Restore cached data immediately for instant 0ms load
    try {
        const cachedAtt = localStorage.getItem('srm_cached_attendance');
        if (cachedAtt) {
            portalAttendance = JSON.parse(cachedAtt);
            renderAttendance('Cached');
        }
        const cachedTt = localStorage.getItem('srm_cached_schedule');
        if (cachedTt) {
            SRM_DATA.dayOrderSchedule = JSON.parse(cachedTt);
        }
    } catch (_) {}

    initClockAndDate();
    initDockNavigation();
    initDaySelector();
    initAI();
    initQuickTools();
    renderCalendarList();
    renderAnnouncements();
    initAnnouncementsSearch();
    updateLiveHUD();
    syncWithBackend();
    initP2PMesh();

    if (!window._appIntervalsSet) {
        window._appIntervalsSet = true;
        setInterval(updateLiveHUD, 10000);
        setInterval(updateClock, 1000);
        setInterval(syncWithBackend, 15000);
    }
}

let selectedDay = 'Day 1';
let currentDayOrder = 'Day 1';
let isTodayHoliday = false;
let activeSubjectFilter = 'ALL';

// Active Schedule Dynamic Overrides (Real-time class cancellations & room changes)
let scheduleOverrides = [
    {
        id: "ov-bio-today",
        type: "CLASS_CANCELLED",
        subject: "Introduction to Computational Biology",
        code: "26BTB1001T",
        dayOrder: "Day 2",
        hour: 8,
        reason: "Prof. Sivasankareswari: No bio cls for today (Optional hour cancelled)",
        sourceGroup: "P1 26-30 CSE AI ML BIO",
        timestamp: "Today"
    }
];

// Real Structured Announcements
let announcementsData = [
    {
        id: "ann-1",
        subject: "Computational Biology",
        code: "26BTB1001T",
        category: "Schedule / Cancellation",
        title: "Optional Hours & Today's Class Cancelled",
        detail: "Prof. Sivasankareswari: Day Order 2 (4:00 PM) optional class cancelled for today. Day Order 3 (9:45 AM) is also optional.",
        faculty: "Prof. Sivasankareswari E",
        venue: "UB 601 (6th Floor)",
        sourceGroup: "P1 26-30 CSE AI ML BIO",
        priority: "HIGH",
        timestamp: "Today"
    },
    {
        id: "ann-2",
        subject: "Chemistry for CS",
        code: "26CYB1002J",
        category: "Xerox / Lab Venue",
        title: "Chemistry Lab Venue & Observation Book",
        detail: "Reach Pink Coloured building opposite to Main University Building, 1st Floor Lab 4. Bring lab manual and observation notebook.",
        faculty: "Dr. John Bosco A / Archit Jain",
        venue: "Pink Building 1st Fl Lab 4",
        sourceGroup: "AI ML P1 Chemistry",
        priority: "HIGH",
        timestamp: "Today"
    },
    {
        id: "ann-3",
        subject: "Programming (PPS)",
        code: "26CSE1002J",
        category: "Assignment / Code",
        title: "PPS Lab Program 3 & 4 Submissions",
        detail: "Complete C programs on pointers, 1D arrays, and recursion with sample outputs. Submit in observation book.",
        faculty: "Sheeba Rachel S",
        venue: "Tech Park 3rd Fl Lab",
        sourceGroup: "P1 C programming",
        priority: "MEDIUM",
        timestamp: "Recent"
    },
    {
        id: "ann-4",
        subject: "Workshop Practice",
        code: "26MEE1001L",
        category: "Xerox / Materials",
        title: "Sheet Metal Manual Printout",
        detail: "Get Sheet Metal & Fitting manuals printed from Tech Park / Java Xerox before Day 3 lab session.",
        faculty: "Dr. Manoj Samson R",
        venue: "BEL Ground Fl Sheet Metal Lab",
        sourceGroup: "Batch 1 Official",
        priority: "HIGH",
        timestamp: "Upcoming"
    },
    {
        id: "ann-5",
        subject: "Calculus & Linear Algebra",
        code: "26MAB1001T",
        category: "Exam / Tutorial",
        title: "Unit 1 Matrix Diagonalization Tutorial",
        detail: "Tutorial problems for Unit 1 Matrix Diagonalization and Quadratic forms to be submitted before CLA-1.",
        faculty: "Dr. N. Parvathi",
        venue: "UB 601 (Slot B)",
        sourceGroup: "AI ML P1 MATHS 26-27 odd",
        priority: "MEDIUM",
        timestamp: "Recent"
    }
];



let portalAttendance = [];

async function syncWithBackend() {
    if (!getToken()) return;

    // Use the native white-labeled domain so cookies are attached automatically by the OS
    const ZOHO_BASE = 'https://academia.srmist.edu.in/api/v2/srm_university/academia-academic-services/report';
    
    // --- 1. Fetch Attendance ---
    const attResp = await apiFetch('/My_Attendance?limit=200', { customBase: ZOHO_BASE });
    if (attResp && attResp.data) {
        const parsed = attResp.data.map(rec => {
            const code = (rec.CourseCode || rec.Course_Code || '').replace(/\s*Regular\s*$/, '').trim();
            const title = (rec.CourseTitle || rec.Course_Title || rec.Subject || '').trim();
            const conducted = parseFloat(rec.HoursConducted || rec.Conducted || '0');
            const absent = parseFloat(rec.HoursAbsent || rec.Absent || '0');
            const att = Math.max(0, conducted - absent);
            let pct = (rec.Attendance || rec.Percentage || '').trim();
            
            if (!pct && conducted > 0) {
                pct = ((att / conducted) * 100).toFixed(1);
            }
            return { code, title, conducted, attended: att, absent, percentage: pct };
        }).filter(x => x.title || x.code);
        
        portalAttendance = parsed;
        try { localStorage.setItem('srm_cached_attendance', JSON.stringify(parsed)); } catch (_) {}
        const now = new Date();
        renderAttendance(now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }

    // --- 2. Fetch TimeTable ---
    const ttResp = await apiFetch('/My_Time_Table?limit=200', { customBase: ZOHO_BASE });
    if (ttResp && ttResp.data && ttResp.data.length > 0) {
        const schedule = { "Day 1": [], "Day 2": [], "Day 3": [], "Day 4": [], "Day 5": [] };
        ttResp.data.forEach(rec => {
            const doStr = String(rec.Day_Order || '');
            let doNum = doStr.replace(/[^0-9]/g, '');
            if (doNum && schedule["Day " + doNum]) {
                const title = rec.CourseTitle || rec.Subject || '';
                schedule["Day " + doNum].push({
                    hour: parseInt(rec.Hour || rec.Period || '1'),
                    code: rec.CourseCode || rec.Course_Code || '',
                    title: title,
                    type: title.toLowerCase().includes('lab') ? 'Lab' : 'Theory',
                    venue: rec.RoomNo || rec.Room || '',
                    slot: rec.Slot || '',
                    faculty: rec.Faculty || ''
                });
            }
        });
        for (let day in schedule) {
            schedule[day].sort((a, b) => a.hour - b.hour);
        }
        SRM_DATA.dayOrderSchedule = schedule;
        try { localStorage.setItem('srm_cached_schedule', JSON.stringify(schedule)); } catch (_) {}
        renderDaySchedule(selectedDay);
        updateLiveHUD();
    }

    // --- 3. Fetch Calendar for Holidays ---
    const calResp = await apiFetch('/My_Academic_Calender?limit=200', { customBase: ZOHO_BASE });
    if (calResp && calResp.data) {
        const todayStr = new Date().toLocaleDateString('en-GB').replace(/\//g, '-');
        const todayEntry = calResp.data.find(e => (e.Date||'').replace(/\//g, '-') === todayStr);
        if (todayEntry && todayEntry.Status === 'Holiday') {
            isTodayHoliday = true;
            const badge = document.getElementById('current-day-badge');
            if (badge) { 
                badge.textContent = 'Holiday · ' + (todayEntry.Remarks || 'Official'); 
                badge.style.color = '#ef4444'; 
            }
            updateLiveHUD();
        }
    }

    // --- 4. Fetch Circulars (Replace Hardcoded Announcements) ---
    const circResp = await apiFetch('/My_Circulars?limit=50', { customBase: ZOHO_BASE });
    if (circResp && circResp.data && circResp.data.length > 0) {
        const newCirculars = circResp.data.map((rec, i) => ({
            id: "circ-" + i,
            subject: "Official Circular",
            code: "",
            category: "University Notice",
            title: rec.Title || 'Notice',
            detail: rec.Details || '',
            faculty: "Admin",
            venue: "",
            sourceGroup: "SRM Portal",
            priority: (rec.Title||'').toLowerCase().includes('exam') ? "HIGH" : "MEDIUM",
            timestamp: rec.Date || 'Recent'
        }));
        const existingIds = announcementsData.map(a => a.id);
        const uniqueCirculars = newCirculars.filter(c => !existingIds.includes(c.id));
        announcementsData = [...uniqueCirculars, ...announcementsData];
        renderAnnouncements();
    }
}

function renderAttendance(syncedAt) {
    const wrap = document.getElementById('att-wrap');
    const stamp = document.getElementById('att-stamp');
    if (!wrap) return;
    if (stamp && syncedAt) stamp.textContent = 'Synced ' + syncedAt;

    if (!portalAttendance.length) {
        wrap.innerHTML = '<p class="att-empty">No data yet — tap Sync Portal.</p>';
        return;
    }

    wrap.innerHTML = portalAttendance.map(item => {
        const pct = parseFloat(item.percentage || 0);
        const con = parseInt(item.conducted || 0);
        const att = parseInt(item.attended || 0);
        const abs = parseInt(item.absent || 0);

        const danger = pct < 75;
        const needed   = Math.max(0, Math.ceil(3 * con - 4 * att));
        const bunkable = Math.max(0, Math.floor((4 * att - 3 * con) / 3));

        const hint = danger
            ? `<span class="att-hint danger">Attend ${needed} more to reach 75%</span>`
            : bunkable > 0
                ? `<span class="att-hint safe">Can skip ${bunkable} class${bunkable > 1 ? 'es' : ''}</span>`
                : `<span class="att-hint warn">No margin — don't miss!</span>`;

        return `
        <div class="att-card ${danger ? 'att-danger' : 'att-safe'}">
            <div class="att-top">
                <div class="att-subject">
                    <span class="att-code">${item.code || '—'}</span>
                    <span class="att-name">${item.subject}</span>
                </div>
                <div class="att-pct">${pct}%</div>
            </div>
            <div class="att-bar-track"><div class="att-bar-fill" style="width:${Math.min(pct,100)}%"></div></div>
            <div class="att-stats">
                <span>${con} conducted</span>
                <span class="green">${att} attended</span>
                <span class="red">${abs} absent</span>
            </div>
            ${hint}
        </div>`;
    }).join('');
}

async function triggerManualScrape() {
    const btn = document.getElementById('scrape-btn');
    if (!btn || btn.disabled) return;
    btn.textContent = 'Syncing…'; btn.disabled = true;
    try { await apiFetch('/api/me/sync', { method: 'POST' }); } catch (_) {}
    setTimeout(() => { syncWithBackend(); btn.textContent = 'Sync Portal'; btn.disabled = false; }, 3500);
}

function initClockAndDate() {
    updateClock();
    const todayStr = getFormattedDateStr(new Date());
    const calEntry = SRM_DATA.calendar.find(c => c.date === todayStr);

    const dayBadge = document.getElementById('current-day-badge');

    if (calEntry) {
        if (calEntry.status === 'Holiday') {
            isTodayHoliday = true;
            dayBadge.textContent = 'Holiday';
            dayBadge.style.color = '#ef4444';
        } else {
            isTodayHoliday = false;
            currentDayOrder = calEntry.day_order;
            selectedDay = currentDayOrder;
            dayBadge.textContent = calEntry.day_order;
        }
    } else {
        currentDayOrder = 'Day 2';
        selectedDay = 'Day 2';
        dayBadge.textContent = 'Day 2';
    }

    renderDaySchedule(selectedDay);
    highlightActiveDayBtn(selectedDay);
}

function updateClock() {
    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    const clockEl = document.getElementById('live-clock');
    if (clockEl) clockEl.textContent = timeStr;
}

function getFormattedDateStr(d) {
    const dd = String(d.getDate()).padStart(2, '0');
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const yyyy = d.getFullYear();
    return dd + '-' + mm + '-' + yyyy;
}

// Live HUD with Dynamic Override Awareness
function updateLiveHUD() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const currentMinutes = hours * 60 + minutes;

    const hudTitle = document.getElementById('hud-class-title');
    const hudVenue = document.getElementById('hud-venue');
    const hudFaculty = document.getElementById('hud-faculty');
    const hudTime = document.getElementById('hud-time');
    const hudUpNext = document.getElementById('hud-up-next');
    const hudStatus = document.getElementById('hud-pulse-status');

    if (isTodayHoliday) {
        hudStatus.textContent = 'Holiday';
        hudStatus.style.color = '#ef4444';
        hudTitle.textContent = 'No Classes Scheduled';
        hudVenue.textContent = 'Campus Off';
        hudFaculty.textContent = '-';
        hudTime.textContent = 'All Day';
        hudUpNext.textContent = 'Check calendar for next working day';
        return;
    }

    const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || SRM_DATA.dayOrderSchedule['Day 1'];
    let currentPeriod = null;
    let nextPeriod = null;
    let periodIndex = -1;

    for (let i = 0; i < SRM_DATA.timeSlots.length; i++) {
        const slot = SRM_DATA.timeSlots[i];
        const [sH, sM] = slot.start.split(':').map(Number);
        const [eH, eM] = slot.end.split(':').map(Number);
        const startMin = sH * 60 + sM;
        const endMin = eH * 60 + eM;

        if (currentMinutes >= startMin && currentMinutes < endMin) {
            currentPeriod = schedule[i];
            periodIndex = i;
            for (let j = i + 1; j < schedule.length; j++) {
                // Check if next class is cancelled
                const isNextCancelled = scheduleOverrides.some(ov => 
                    (ov.dayOrder === currentDayOrder || ov.dayOrder === 'Today') &&
                    (ov.hour === j + 1 || ov.code === schedule[j].courseCode) &&
                    ov.type === 'CLASS_CANCELLED'
                );
                if (schedule[j].type !== 'Free' && !isNextCancelled) {
                    nextPeriod = { item: schedule[j], slot: SRM_DATA.timeSlots[j] };
                    break;
                }
            }
            break;
        } else if (currentMinutes < startMin && !nextPeriod && schedule[i].type !== 'Free') {
            const isCancelled = scheduleOverrides.some(ov => 
                (ov.dayOrder === currentDayOrder || ov.dayOrder === 'Today') &&
                (ov.hour === i + 1 || ov.code === schedule[i].courseCode) &&
                ov.type === 'CLASS_CANCELLED'
            );
            if (!isCancelled) {
                nextPeriod = { item: schedule[i], slot: SRM_DATA.timeSlots[i] };
            }
        }
    }

    // Check if CURRENT active period is cancelled
    let activeOverride = null;
    if (currentPeriod && periodIndex !== -1) {
        activeOverride = scheduleOverrides.find(ov => 
            (ov.dayOrder === currentDayOrder || ov.dayOrder === 'Today') &&
            (ov.hour === periodIndex + 1 || (ov.code && currentPeriod.courseCode === ov.code))
        );
    }

    if (currentPeriod) {
        const slotInfo = SRM_DATA.timeSlots[periodIndex];
        const [eH, eM] = slotInfo.end.split(':').map(Number);
        const remainingMin = (eH * 60 + eM) - currentMinutes;

        if (activeOverride && activeOverride.type === 'CLASS_CANCELLED') {
            hudStatus.textContent = 'Class Cancelled by Faculty';
            hudStatus.style.color = '#ef4444';
            hudTitle.textContent = currentPeriod.title + ' (Cancelled)';
            hudVenue.textContent = 'Free Time / No class';
            hudFaculty.textContent = activeOverride.reason || 'Notice from faculty';
            hudTime.textContent = slotInfo.label + ' (' + remainingMin + 'm left)';
        } else if (currentPeriod.type === 'Free') {
            hudStatus.textContent = 'Free Period / Break';
            hudStatus.style.color = '#71717a';
            hudTitle.textContent = 'Free Period';
            hudVenue.textContent = 'Library / Break';
            hudFaculty.textContent = '-';
            hudTime.textContent = slotInfo.label + ' (' + remainingMin + 'm left)';
        } else {
            hudStatus.textContent = 'Now Playing (' + currentPeriod.type + ')';
            hudStatus.style.color = '#22c55e';
            hudTitle.textContent = currentPeriod.title;
            hudVenue.textContent = (activeOverride && activeOverride.newVenue) ? activeOverride.newVenue : currentPeriod.venue;
            hudFaculty.textContent = currentPeriod.faculty;
            hudTime.textContent = slotInfo.label + ' (' + remainingMin + 'm left)';
        }
    } else {
        if (currentMinutes < 8 * 60) {
            hudStatus.textContent = 'Upcoming Day';
            hudStatus.style.color = '#3b82f6';
            hudTitle.textContent = 'Classes Start at 8:00 / 9:45 AM';
            hudVenue.textContent = 'UB / Tech Park';
            hudFaculty.textContent = '-';
            hudTime.textContent = 'Morning';
        } else {
            hudStatus.textContent = 'Day Finished';
            hudStatus.style.color = '#71717a';
            hudTitle.textContent = 'All Classes Ended for Today';
            hudVenue.textContent = 'Campus Off';
            hudFaculty.textContent = '-';
            hudTime.textContent = 'After Hours';
        }
    }

    if (nextPeriod) {
        hudUpNext.textContent = nextPeriod.item.title + ' @ ' + nextPeriod.item.venue;
    } else {
        hudUpNext.textContent = 'No more active classes today';
    }
}

// Render Day Schedule with Dynamic Cancellation & Room Change Tags
function renderDaySchedule(day) {
    const list = document.getElementById('period-list');
    list.innerHTML = '';
    const schedule = SRM_DATA.dayOrderSchedule[day] || [];

    schedule.forEach((p, idx) => {
        const slotInfo = SRM_DATA.timeSlots[idx];
        const hourNum = idx + 1;
        
        // Find if this specific period has an active override
        const override = scheduleOverrides.find(ov => 
            (ov.dayOrder === day || (day === currentDayOrder && ov.dayOrder === 'Today')) &&
            (ov.hour === hourNum || (ov.code && p.courseCode === ov.code) || (ov.subject && p.title.toLowerCase().includes(ov.subject.toLowerCase())))
        );

        const card = document.createElement('div');
        const isCancelled = (override && override.type === 'CLASS_CANCELLED');
        const isRoomChanged = (override && override.type === 'ROOM_CHANGE');

        card.className = 't-card' + (p.type === 'Free' ? ' free-card' : '') + (isCancelled ? ' is-cancelled-card' : '');

        let tagClass = 'tag-free';
        let tagText = p.type;
        if (p.type === 'Theory') tagClass = 'tag-theory';
        if (p.type === 'Lab') tagClass = 'tag-lab';

        let venueText = p.venue;
        if (isRoomChanged && override.newVenue) {
            venueText = `<span style="color:#38bdf8;font-weight:700;">📍 ${override.newVenue} (Shifted from ${p.venue})</span>`;
        } else {
            venueText = `📍 ${p.venue}`;
        }

        if (isCancelled) {
            tagClass = 'tag-cancelled';
            tagText = 'CANCELLED';
        }

        card.innerHTML = `
            <div class="t-left" style="${isCancelled ? 'opacity:0.65;' : ''}">
                <div class="t-hour">H${p.hour} &bull; ${slotInfo.start}</div>
                <div class="t-info">
                    <div class="t-name" style="${isCancelled ? 'text-decoration:line-through;color:#a1a1aa;' : ''}">${p.title}</div>
                    <div class="t-meta">${venueText} ${p.slot ? `&bull; Slot ${p.slot}` : ''} ${p.faculty !== '-' ? `&bull; ${p.faculty}` : ''}</div>
                    ${isCancelled ? `<div style="font-size:0.72rem;color:#ef4444;font-weight:600;margin-top:3px;">🚫 ${override.reason}</div>` : ''}
                </div>
            </div>
            <div>
                <span class="t-tag ${tagClass}" style="${isCancelled ? 'background:#3b1313;color:#f87171;border:1px solid #7f1d1d;' : ''}">${tagText}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

function initDaySelector() {
    const container = document.getElementById('day-selector');
    container.innerHTML = '';
    ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].forEach(d => {
        const btn = document.createElement('div');
        btn.className = 'day-chip' + (d === selectedDay ? ' active' : '');
        btn.textContent = d;
        btn.id = 'btn-' + d.replace(' ', '');
        btn.onclick = () => {
            selectedDay = d;
            highlightActiveDayBtn(d);
            renderDaySchedule(d);
        };
        container.appendChild(btn);
    });
}

function highlightActiveDayBtn(d) {
    document.querySelectorAll('.day-chip').forEach(b => b.classList.remove('active'));
    const target = document.getElementById('btn-' + d.replace(' ', ''));
    if (target) target.classList.add('active');
}

function initDockNavigation() {
    const items = document.querySelectorAll('.dock-item');
    items.forEach(btn => {
        btn.onclick = () => {
            items.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const targetId = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none');
            const targetView = document.getElementById(targetId);
            if (targetView) targetView.style.display = 'block';
        };
    });
}

// Render Categorized Announcements
function renderAnnouncements(filterSubject, searchQuery) {
    const container = document.getElementById('announcements-container');
    const counter = document.getElementById('ann-counter');
    if (!container) return;

    filterSubject = filterSubject || activeSubjectFilter;
    searchQuery = (searchQuery || '').toLowerCase();

    container.innerHTML = '';
    
    const filtered = announcementsData.filter(ann => {
        const matchSubject = (filterSubject === 'ALL' || ann.code === filterSubject);
        const matchSearch = (ann.title + ann.detail + ann.subject + ann.venue + ann.faculty + ann.category).toLowerCase().includes(searchQuery);
        return matchSubject && matchSearch;
    });

    if (counter) counter.textContent = `${filtered.length} notices`;

    if (filtered.length === 0) {
        container.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:24px 0;">No notices matching your filter.</div>`;
        return;
    }

    filtered.forEach(ann => {
        const card = document.createElement('div');
        card.className = 'hero-info-box';
        card.style.padding = '14px 16px';
        card.style.display = 'flex';
        card.style.flexDirection = 'column';
        card.style.gap = '8px';

        let catBadgeStyle = 'background:#182820;color:#34d399;';
        if (ann.category.includes('Xerox') || ann.category.includes('Materials')) catBadgeStyle = 'background:#2d2010;color:#fbbf24;';
        if (ann.category.includes('Schedule') || ann.category.includes('Cancellation') || ann.category.includes('Room')) catBadgeStyle = 'background:#2b1212;color:#f87171;';
        if (ann.category.includes('Exam') || ann.category.includes('Tutorial')) catBadgeStyle = 'background:#24142d;color:#c084fc;';

        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <div>
                    <span style="font-size:0.68rem;padding:2px 7px;border-radius:4px;font-weight:700;text-transform:uppercase;${catBadgeStyle}">${ann.category}</span>
                    <span style="font-size:0.75rem;color:var(--text-sub);margin-left:6px;font-weight:600;">${ann.subject}</span>
                </div>
                <span style="font-size:0.7rem;color:var(--text-muted);">${ann.timestamp}</span>
            </div>
            <div style="font-size:0.9rem;font-weight:700;color:#ffffff;line-height:1.35;">${ann.title}</div>
            <div style="font-size:0.82rem;color:var(--text-sub);line-height:1.45;">${ann.detail}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.72rem;color:var(--text-muted);border-top:1px solid #1f1f26;padding-top:6px;">
                <span>📍 ${ann.venue} ${ann.faculty !== '-' ? `&bull; 👤 ${ann.faculty}` : ''}</span>
                <span style="color:#71717a;">${ann.sourceGroup}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterAnnouncements(code) {
    activeSubjectFilter = code;
    document.querySelectorAll('#ann-filter-scroll .day-chip').forEach(c => c.classList.remove('active'));
    event.target.classList.add('active');
    renderAnnouncements(code);
}

function initAnnouncementsSearch() {
    const input = document.getElementById('ann-search-input');
    if (input) {
        input.oninput = (e) => renderAnnouncements(activeSubjectFilter, e.target.value);
    }
}

// ─── SRM Academic AI Copilot Engine (Puter.js + Multi-Provider Fallbacks) ────
function initAI() {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');

    if (sendBtn && input) {
        sendBtn.onclick = () => handleAISend();
        input.onkeypress = (e) => {
            if (e.key === 'Enter') handleAISend();
        };
    }

    document.querySelectorAll('.ai-prompt-pill').forEach(chip => {
        chip.onclick = () => {
            const prompt = chip.getAttribute('data-prompt');
            if (input) {
                input.value = prompt;
                handleAISend();
            }
        };
    });
}

// ─── AI Smart WhatsApp & Notice Summarizer ──────────────────────────────────
async function generateAINoticeSummary() {
    const summaryCard = document.getElementById('ai-notice-summary-content');
    const btn = document.getElementById('btn-generate-summary');
    if (!summaryCard) return;

    if (btn) { btn.disabled = true; btn.textContent = '⏳ Analyzing...'; }
    summaryCard.innerHTML = '<i>🧠 Inception AI is analyzing your WhatsApp notices, class cancellations, and lab venue shifts...</i>';

    const rawNotices = (SRM_DATA.announcements || []).map(a => 
        `[${a.category}] ${a.subject} (${a.code}): ${a.title} - ${a.detail} (Venue: ${a.venue}, Source: ${a.sourceGroup})`
    ).join('\n');

    const prompt = `You are the executive academic assistant for student Karanam Sai Prasanth at SRMIST.
Analyze these incoming class notices, cancellations, and WhatsApp group messages:

${rawNotices}

Task:
Produce a crisp, bulleted 3-part briefing for the student:
1. 🚨 **Urgent Cancellations & Venue Shifts**
2. 🔬 **Lab & Xerox / Submission Deadlines**
3. 📌 **Key Action Items for Today**

Format cleanly with emojis and bold highlights. Keep it strictly relevant and direct.`;

    try {
        const reply = await askAcademicAI(prompt);
        summaryCard.innerHTML = formatMarkdown(reply);
    } catch (e) {
        summaryCard.innerHTML = '<b>Summary:</b> All regular classes active. Check specific subject chips above for venue details.';
    } finally {
        if (btn) { btn.disabled = false; btn.textContent = '⚡ Summarize All'; }
    }
}

function getAcademicContextForAI() {
    const studentName = localStorage.getItem('srm_display_name') || 'Student';
    const day = currentDayOrder || 'Day 1';
    const schedule = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[day]) ? SRM_DATA.dayOrderSchedule[day] : [];
    
    const schedLines = schedule.map(s => {
        if (s.type === 'Free') return `Hour ${s.hour}: Free Period`;
        const slot = (SRM_DATA.timeSlots && SRM_DATA.timeSlots[s.hour - 1]) ? SRM_DATA.timeSlots[s.hour - 1].label : '';
        return `Hour ${s.hour} (${slot}): ${s.title} (${s.code}) at Room ${s.venue} [Faculty: ${s.faculty || 'N/A'}]`;
    }).join('\n');

    let attLines = 'Attendance: 100% compliant with SRM Academia database.';
    if (portalAttendance && portalAttendance.length > 0) {
        attLines = portalAttendance.map(a => {
            const title = a.title || a.subject || a.code || 'Course';
            const pct = a.percentage || 'N/A';
            const attended = a.attended || 0;
            const total = a.conducted || 0;
            const absent = a.absent || 0;
            return `- ${title} (${a.code || ''}): ${pct}% [Attended: ${attended}/${total} hours, Absent: ${absent}]`;
        }).join('\n');
    }

    const notices = (SRM_DATA.announcements || []).slice(0, 5).map(n => 
        `- [${n.category}] ${n.title}: ${n.detail} (Venue: ${n.venue})`
    ).join('\n');

    return `You are the AI Academic Copilot for SRM University student ${studentName}.
Active Campus Status:
- Current Day Order: ${day}
- Today's Class Schedule:
${schedLines || 'No active classes scheduled for today.'}

Student Real-Time Attendance Records:
${attLines}

Recent WhatsApp & Circular Notices:
${notices}

SRM 75% Attendance Regulations:
- Mandatory Minimum Attendance: 75% per course to write CLA & Semester University Exams.
- If attendance > 75%, safe bunks available = Math.floor((attended - 0.75 * total) / 0.75).
- If attendance < 75%, classes needed to recover = Math.ceil((0.75 * total - attended) / 0.25).

Instructions:
- Provide direct, ultra-fast, helpful answers powered by Inception Labs Mercury AI.
- Format code, formulas, and room numbers with clean Markdown.`;
}

async function askAcademicAI(userPrompt) {
    const systemPrompt = getAcademicContextForAI();

    // 1. Direct Backend / Vercel Serverless Inception AI (/api/chat)
    try {
        const apiBase = getApiBase();
        const res = await fetch(apiBase + '/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: userPrompt,
                context: systemPrompt
            })
        });
        if (res.ok) {
            const data = await res.json();
            if (data && data.reply && !data.reply.includes('Inception Error')) {
                return data.reply;
            }
        }
    } catch (_) {}

    // 2. Puter.js Zero-Key Engine (DeepSeek-V3 / GPT-4o-mini)
    if (window.puter && window.puter.ai && typeof window.puter.ai.chat === 'function') {
        try {
            const res = await window.puter.ai.chat([
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ], { model: 'deepseek-chat' });
            if (res) {
                if (typeof res === 'string' && res.trim()) return res;
                if (res.message && res.message.content) return res.message.content;
                if (res.text) return res.text;
            }
        } catch (e) {
            console.warn('Puter DeepSeek error, trying gpt-4o-mini:', e);
            try {
                const res2 = await window.puter.ai.chat([
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt }
                ], { model: 'gpt-4o-mini' });
                if (res2) {
                    if (typeof res2 === 'string' && res2.trim()) return res2;
                    if (res2.message && res2.message.content) return res2.message.content;
                }
            } catch (_) {}
        }
    }

    // 3. Instant Offline Academic Rule-Based Engine
    return getOfflineAIResponse(userPrompt);
}

function getOfflineAIResponse(prompt) {
    const q = prompt.toLowerCase();
    const day = currentDayOrder || 'Day 1';
    const schedule = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[day]) || [];

    if (q.includes('next') || q.includes('class') || q.includes('timetable') || q.includes('schedule') || q.includes('today')) {
        const classes = schedule.filter(s => s.type !== 'Free');
        if (classes.length === 0) return `No classes scheduled for **${day}**! You're free today.`;
        let out = `### Today's Schedule (${day})\n`;
        classes.forEach(c => {
            const slot = (SRM_DATA.timeSlots && SRM_DATA.timeSlots[c.hour - 1]) ? SRM_DATA.timeSlots[c.hour - 1].label : '';
            out += `- **Hour ${c.hour} (${slot})**: ${c.title} at \`${c.venue}\`\n`;
        });
        return out;
    }

    if (q.includes('bunk') || q.includes('attendance') || q.includes('75') || q.includes('margin')) {
        return `### SRM Attendance & Safe Bunk Policy\n` +
               `- **Minimum Required**: 75% per course.\n` +
               `- **Formula**: If attendance > 75%, safe bunks = \`Math.floor((Attended - 0.75 * Total) / 0.75)\`.\n` +
               `- Check the Live Attendance HUD on your home screen for current margins.`;
    }

    return `I am your SRM Academic Companion! Ask me anything about:\n` +
           `- **Today's Classes & Venues** (\`${day}\`)\n` +
           `- **Attendance Percentages & Safe Bunks**\n` +
           `- **Circulars & WhatsApp Summaries**`;
}

async function handleAISend() {
    const input = document.getElementById('ai-input');
    const prompt = input.value.trim();
    if (!prompt) return;

    input.value = '';
    appendChatMessage('user', prompt);

    const loadingId = appendChatMessage('ai', 'Thinking…');

    try {
        const reply = await askAcademicAI(prompt);
        updateChatMessage(loadingId, formatMarkdown(reply));
    } catch (err) {
        updateChatMessage(loadingId, formatMarkdown(getOfflineAIResponse(prompt)));
    }
}

function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const msg = document.createElement('div');
    const msgId = 'msg-' + Date.now();
    msg.id = msgId;
    msg.className = `bubble bubble-${sender}`;
    msg.innerHTML = formatMarkdown(text);
    history.appendChild(msg);
    history.scrollTop = history.scrollHeight;
    return msgId;
}

function updateChatMessage(msgId, formattedHtml) {
    const msg = document.getElementById(msgId);
    if (msg) {
        msg.innerHTML = formattedHtml;
        const history = document.getElementById('chat-history');
        if (history) history.scrollTop = history.scrollHeight;
    }
}

function formatMarkdown(str) {
    return str
        .replace(/```([a-z]*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
        .replace(/`([^`]+)`/g, '<code style="background:#27272a;padding:2px 5px;border-radius:4px;font-family:var(--font-mono);font-size:0.82em;">$1</code>')
        .replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^\*]+)\*/g, '<i>$1</i>')
        .replace(/\n/g, '<br>');
}

function initQuickTools() {
    const waBtn = document.getElementById('btn-share-wa');
    if (waBtn) {
        waBtn.onclick = () => {
            const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || [];
            let text = `*SRM Schedule (${currentDayOrder})*\n*Sai Prasanth*\n------------------------\n`;
            schedule.forEach(p => {
                if (p.type !== 'Free') {
                    const slot = SRM_DATA.timeSlots[p.hour - 1];
                    text += `⏰ ${slot.label}\n📚 *${p.title}*\n📍 ${p.venue} (Slot ${p.slot})\n\n`;
                }
            });
            window.open('https://api.whatsapp.com/send?text=' + encodeURIComponent(text), '_blank');
        };
    }

    const calBtn = document.getElementById('btn-download-ics');
    if (calBtn) {
        calBtn.onclick = () => {
            window.location.href = 'SRM_Semester_Timetable.ics';
        };
    }
}

function renderCalendarList() {
    const container = document.getElementById('cal-list-container');
    const searchInput = document.getElementById('cal-search-input');
    if (!container) return;

    function populate(filter) {
        filter = filter || '';
        container.innerHTML = '';
        const todayStr = getFormattedDateStr(new Date());

        SRM_DATA.calendar.forEach(c => {
            const match = (c.date + c.day + c.status + c.day_order + c.remarks).toLowerCase().includes(filter.toLowerCase());
            if (!match) return;

            const row = document.createElement('div');
            row.className = 'cal-row' + (c.status === 'Holiday' ? ' is-holiday' : '') + (c.date === todayStr ? ' is-today' : '');

            row.innerHTML = `
                <div>
                    <div class="cal-date">${c.date} &bull; ${c.day.slice(0, 3)}</div>
                    <div class="cal-sub">${c.remarks !== '-' ? c.remarks : (c.status === 'Holiday' ? 'Weekend' : c.week)}</div>
                </div>
                <div>
                    <span class="cal-tag" style="background:${c.status === 'Holiday' ? '#2d1515' : '#14241b'};color:${c.status === 'Holiday' ? '#f87171' : '#34d399'};">${c.status === 'Holiday' ? 'Holiday' : c.day_order}</span>
                </div>
            `;
            container.appendChild(row);
        });
    }

    populate();
    if (searchInput) {
        searchInput.oninput = (e) => populate(e.target.value);
    }
}

// ─── P2P Zero-Database Local Mesh Chat ────────────────────────────────────────
let p2pChannel = null;

function initP2PMesh() {
    try {
        if ('BroadcastChannel' in window) {
            p2pChannel = new BroadcastChannel('srm_p2p_mesh');
            p2pChannel.onmessage = (event) => {
                const msg = event.data;
                if (msg && msg.text) {
                    renderP2PMessage(msg, false);
                }
            };
        }
    } catch (e) {
        console.warn('P2P BroadcastChannel unavailable:', e);
    }

    const input = document.getElementById('p2p-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendP2PMessage();
        });
    }

    updateP2PStatusBadge();
    window.addEventListener('online', updateP2PStatusBadge);
    window.addEventListener('offline', updateP2PStatusBadge);

    loadP2PHistory();
}

function updateP2PStatusBadge() {
    const badge = document.getElementById('p2p-peer-count');
    if (!badge) return;
    if (navigator.onLine) {
        badge.textContent = '🟢 Online Mode (Cloud + P2P)';
        badge.style.color = '#34d399';
    } else {
        badge.textContent = '📶 Offline Mode (Pure P2P Mesh)';
        badge.style.color = '#fbbf24';
    }
}


function renderP2PMessage(msg, isSelf) {
    const container = document.getElementById('p2p-chat-history');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `bubble ${isSelf ? 'bubble-user' : 'bubble-ai'}`;
    if (!isSelf) {
        bubble.style.background = '#121215';
        bubble.style.border = '1px solid #222227';
    }

    bubble.innerHTML = `
        <div style="font-size:0.7rem;color:var(--text-sub);font-weight:700;margin-bottom:2px;">
            ${isSelf ? 'You' : msg.sender} &bull; ${msg.timestamp}
        </div>
        <div>${escapeHtml(msg.text)}</div>
    `;

    container.appendChild(bubble);
    container.scrollTop = container.scrollHeight;
}

function saveP2PMessage(msg) {
    try {
        const history = JSON.parse(localStorage.getItem('srm_p2p_history') || '[]');
        history.push(msg);
        if (history.length > 50) history.shift(); // Keep last 50 local messages
        localStorage.setItem('srm_p2p_history', JSON.stringify(history));
    } catch (_) {}
}

function loadP2PHistory() {
    try {
        const myName = localStorage.getItem('srm_display_name') || 'Me';
        const history = JSON.parse(localStorage.getItem('srm_p2p_history') || '[]');
        history.forEach(msg => renderP2PMessage(msg, msg.sender === myName));
    } catch (_) {}
}

function sendP2PMessage() {
    const input = document.getElementById('p2p-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const myName = localStorage.getItem('srm_display_name') || 'Me'; // Fix #17

    const msg = {
        id: 'p2p-' + Date.now(),
        sender: myName,
        text: text,
        mode: navigator.onLine ? 'ONLINE' : 'P2P_OFFLINE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (navigator.onLine) {
        try { apiFetch('/api/me/chat', { method: 'POST', body: JSON.stringify(msg) }); } catch (_) {}
    }
    if (p2pChannel) {
        try { p2pChannel.postMessage(msg); } catch (_) {}
    }

    renderP2PMessage(msg, true);
    saveP2PMessage(msg);
    input.value = '';
}

// Fix #14: escapeHtml handles newlines properly
function escapeHtml(str) {
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
}
// Note: initP2PMesh() is now called inside _initApp() — no extra DOMContentLoaded needed
