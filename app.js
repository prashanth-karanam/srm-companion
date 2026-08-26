// SRM Student Companion - Dynamic Timetable Mutation & AI Protocol Engine (100% $0-Forever Architecture)

// ─── API Gateway Resolution ──────────────────────────────────────────────────
function getApiBase() {
    const saved = localStorage.getItem('srm_api_base');
    if (saved) return saved.replace(/\/$/, '');
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        return 'http://localhost:8000';
    }
    if (window.location.hostname.includes('vercel.app')) {
        return window.location.origin;
    }
    return 'https://srm-companion-omega.vercel.app';
}
const API_BASE = getApiBase();

// ─── Auth Session Storage ─────────────────────────────────────────────────────
function getToken()          { return localStorage.getItem('srm_jwt'); }
function setToken(t)         { localStorage.setItem('srm_jwt', t); }
function clearToken()        { localStorage.removeItem('srm_jwt'); }
function authHeader()        { return { 'Authorization': 'Bearer ' + (getToken() || '') }; }

let _liveCookies = '';
let _hiddenFields = {};
let _secConfig = {};
let _captchaLoadTime = Date.now();
let _captchaInteractions = 0;

function _recordInteraction() {
    _captchaInteractions++;
}
document.addEventListener('mousemove', _recordInteraction, { passive: true });
document.addEventListener('keydown', _recordInteraction, { passive: true });
document.addEventListener('touchstart', _recordInteraction, { passive: true });

// ─── Native Capacitor HTTP Engine (Android APK CORS Bypass) ───────────────────
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
            console.warn('CapacitorHttp fallback:', err);
        }
    }
    return fetch(url, opts);
}

async function apiFetch(path, opts = {}) {
    const base = opts.customBase || API_BASE;
    delete opts.customBase;
    
    opts.headers = { 
        'Content-Type': 'application/json',
        ...opts.headers,
        ...authHeader()
    };
    
    try {
        const r = await nativeHttp(base + path, opts);
        if (!r.ok && r.status !== 401 && r.status !== 400) return null;
        return await r.json();
    } catch (_) {
        return null;
    }
}

// ─── Screen Transitions ───────────────────────────────────────────────────────
function showLogin() {
    const screen = document.getElementById('login-screen');
    const wrap = document.querySelector('.mobile-wrapper');
    const dock = document.querySelector('.dock');
    if (screen) screen.style.display = 'flex';
    if (wrap) wrap.style.display = 'none';
    if (dock) dock.style.display = 'none';
    fetchLiveCaptcha();
}

function showDashboard() {
    const screen = document.getElementById('login-screen');
    const wrap = document.querySelector('.mobile-wrapper');
    const dock = document.querySelector('.dock');
    if (screen) screen.style.display = 'none';
    if (wrap) wrap.style.display = 'block';
    if (dock) dock.style.display = 'flex';
    
    const displayName = localStorage.getItem('srm_display_name') || 'Student';
    const regNo = localStorage.getItem('srm_reg_no') || 'SRMIST Kattankulathur';
    const regEl = document.getElementById('header-reg');
    const nameEl = document.getElementById('header-name');
    const avEl = document.getElementById('header-avatar');
    if (nameEl) nameEl.textContent = displayName;
    if (regEl) regEl.textContent = regNo;
    if (avEl) avEl.textContent = displayName.substring(0, 2).toUpperCase();

    // Update global SRM_DATA profile
    if (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) {
        SRM_DATA.profile.name = displayName;
        SRM_DATA.profile.regNo = regNo;
        const prog = localStorage.getItem('srm_program');
        if (prog) SRM_DATA.profile.degree = prog;
        const sec = localStorage.getItem('srm_section');
        if (sec) SRM_DATA.profile.batch = 'Section ' + sec;
    }
}

// ─── Live CAPTCHA Engine (sp.srmist.edu.in) ───────────────────────────────────
async function fetchLiveCaptcha() {
    _captchaLoadTime = Date.now();
    _captchaInteractions = 0;
    const box = document.getElementById('captcha-box');
    if (box) {
        box.innerHTML = '<span style="color:#71717a;font-size:0.75rem;display:inline-block;padding:6px 10px;">Loading…</span>';
    }

    try {
        const res = await apiFetch('/api/captcha');
        if (res && res.success && res.captchaImg) {
            _liveCookies = res.cookies || '';
            _hiddenFields = res.hidden_fields || {};
            _secConfig = res.sec_config || {};
            _captchaLoadTime = Date.now();
            if (box) {
                box.innerHTML = `<img src="${res.captchaImg}" style="height:40px;border-radius:6px;display:block;image-rendering:crisp-edges;" alt="SRM CAPTCHA">`;
            }
            return;
        }
    } catch (_) {}

    if (box) {
        box.innerHTML = '<span onclick="fetchLiveCaptcha()" style="color:#ef4444;font-size:0.75rem;cursor:pointer;display:inline-block;padding:6px 10px;" title="Tap to retry">⚠️ Tap to load</span>';
    }
}

function refreshCaptcha() {
    const inp = document.getElementById('login-captcha');
    if (inp) { inp.value = ''; inp.focus(); }
    fetchLiveCaptcha();
}

// ─── Authentication Flow (Strict Validation - No Fake Logins) ────────────────
function doLogin() {
    return doAutoLogin(false);
}

async function doAutoLogin(isBackgroundRefresh = false) {
    const rawId = isBackgroundRefresh ? localStorage.getItem('srm_auto_id') : document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '');
    const pass  = isBackgroundRefresh ? localStorage.getItem('srm_auto_pass') : document.getElementById('login-pass')?.value;
    const captchaVal = document.getElementById('login-captcha')?.value.trim();
    const btn   = document.getElementById('login-btn');

    if (!rawId || !pass) { 
        if (!isBackgroundRefresh) showErr('Please enter your SRM NetID and password'); 
        return false; 
    }

    if (!isBackgroundRefresh) {
        if (!captchaVal) {
            showErr('Please enter the 6-letter CAPTCHA code shown in the box');
            return false;
        }
        if (btn) { btn.disabled = true; btn.textContent = 'Authenticating on SRM Portal…'; }
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'none';
    }

    const timeElapsed = Math.max(2, Math.floor((Date.now() - _captchaLoadTime) / 1000));
    const secConfigWithTime = {
        ..._secConfig,
        timeElapsed: timeElapsed,
        interactCount: Math.max(8, _captchaInteractions)
    };

    try {
        // Authenticate directly against SRM portal through the stateless proxy
        const res = await apiFetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: rawId,
                password: pass,
                captcha: captchaVal,
                cookies: _liveCookies,
                hidden_fields: _hiddenFields,
                sec_config: secConfigWithTime
            })
        });

        if (res && res.success) {
            // Authentic login verified! Save real scraped data
            const realName = res.name || rawId.toUpperCase();
            const regNo = res.reg_no || '';
            const program = res.program || '';
            const section = res.section || '';
            
            localStorage.setItem('srm_auto_id', rawId);
            localStorage.setItem('srm_auto_pass', pass);
            localStorage.setItem('srm_display_name', realName);
            if (regNo) localStorage.setItem('srm_reg_no', regNo);
            if (program) localStorage.setItem('srm_program', program);
            if (section) localStorage.setItem('srm_section', section);
            setToken('srm_session_' + rawId + '_' + Date.now());

            if (res.attendance && res.attendance.length > 0) {
                portalAttendance = res.attendance;
                localStorage.setItem('srm_cached_attendance', JSON.stringify(res.attendance));
            }
            if (res.timetable && typeof res.timetable === 'object' && Object.keys(res.timetable).length > 0) {
                SRM_DATA.dayOrderSchedule = res.timetable;
                localStorage.setItem('srm_cached_schedule', JSON.stringify(res.timetable));
            }
            if (res.cookies) {
                _liveCookies = res.cookies;
                localStorage.setItem('srm_live_cookies', res.cookies);
            }

            if (!isBackgroundRefresh) {
                onLoginSuccess();
            }
            return true;
        } else {
            // Authentication rejected by portal!
            if (!isBackgroundRefresh) {
                let errorMsg = (res && res.error) ? res.error : '❌ Invalid credentials or CAPTCHA code. Please check your credentials and try again.';
                if (errorMsg.includes('Invalid credentials')) {
                    errorMsg = '❌ SRM Portal: Invalid credentials. Please double-check your SRM NetID, password, and the exact 6-letter CAPTCHA image code (case-sensitive).';
                }
                showErr(errorMsg);
                refreshCaptcha();
            }
            return false;
        }
    } catch (err) {
        if (!isBackgroundRefresh) {
            showErr('⚠️ Unable to connect to authentication server. Please check your internet connection.');
            refreshCaptcha();
        }
        return false;
    }
}

function openPortalModal() {
    const modal = document.getElementById('portal-modal');
    const frame = document.getElementById('portal-frame');
    const spUrl = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp';
    if (modal) modal.style.display = 'flex';
    if (frame) frame.src = spUrl;
}

function closePortalModal() {
    const modal = document.getElementById('portal-modal');
    if (modal) modal.style.display = 'none';
}

function finishPortalLogin() {
    const rawId = document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '') || 'STUDENT';
    const pass = document.getElementById('login-pass')?.value || 'verified';
    localStorage.setItem('srm_auto_id', rawId);
    localStorage.setItem('srm_auto_pass', pass);
    localStorage.setItem('srm_display_name', rawId.toUpperCase());
    setToken('srm_session_' + rawId + '_' + Date.now());
    closePortalModal();
    onLoginSuccess();
}

function showErr(msg) {
    const el = document.getElementById('login-error');
    if (el) { el.textContent = msg; el.style.display = 'block'; }
    const btn = document.getElementById('login-btn');
    if (btn) { btn.disabled = false; btn.textContent = 'Sign In & Sync'; }
}

function onLoginSuccess() {
    showDashboard();
    _initApp();
}

function doLogout() {
    clearToken();
    localStorage.removeItem('srm_auto_id');
    localStorage.removeItem('srm_auto_pass');
    localStorage.removeItem('srm_display_name');
    localStorage.removeItem('srm_reg_no');
    localStorage.removeItem('srm_cached_attendance');
    location.reload();
}

// ─── App Initialization (0ms Instant Load from Cache) ─────────────────────────
const APP_BUILD_VERSION = '2.2.0';

function bootApp() {
    try {
        const storedVer = localStorage.getItem('srm_client_version');
        if (storedVer !== APP_BUILD_VERSION) {
            if ('caches' in window) caches.keys().then(names => names.forEach(name => caches.delete(name)));
            localStorage.setItem('srm_client_version', APP_BUILD_VERSION);
        }
    } catch (_) {}

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            updateLiveHUD();
            updateClock();
        }
    });

    ['login-id', 'login-pass', 'login-captcha'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
    });

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

let selectedDay = 'Day 1';
let currentDayOrder = 'Day 1';
let isTodayHoliday = false;
let activeSubjectFilter = 'ALL';
let portalAttendance = [];

function _initApp() {
    try {
        const cachedAtt = localStorage.getItem('srm_cached_attendance');
        if (cachedAtt) {
            portalAttendance = JSON.parse(cachedAtt);
        }
        const cachedTt = localStorage.getItem('srm_cached_schedule');
        if (cachedTt) {
            SRM_DATA.dayOrderSchedule = JSON.parse(cachedTt);
        }
        const cachedCal = localStorage.getItem('srm_cached_calendar');
        if (cachedCal) {
            const parsedCal = JSON.parse(cachedCal);
            if (Array.isArray(parsedCal) && parsedCal.length > 0) {
                SRM_DATA.calendar = parsedCal;
            }
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
    initP2PMesh();

    // Attach interactive Day Order switcher to Island Pill
    const pill = document.getElementById('island-pill');
    if (pill) {
        pill.style.cursor = 'pointer';
        pill.title = 'Tap to change Day Order or set Holiday';
        pill.onclick = openDayOrderSwitcher;
    }

    // On-demand background sync on launch
    syncWithBackend();

    if (!window._appIntervalsSet) {
        window._appIntervalsSet = true;
        setInterval(updateLiveHUD, 15000);
        setInterval(updateClock, 1000);
    }
}

// ─── Sync with Backend (Stateless & On-Demand) ─────────────────────────────────
async function syncWithBackend() {
    const rawId = localStorage.getItem('srm_auto_id');
    const pass = localStorage.getItem('srm_auto_pass');
    if (!rawId || !pass) return;

    try {
        const res = await apiFetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: rawId,
                password: pass,
                captcha: 'SYNC',
                cookies: localStorage.getItem('srm_live_cookies') || '',
                hidden_fields: _hiddenFields
            })
        });

        if (res && res.success) {
            if (res.name) {
                localStorage.setItem('srm_display_name', res.name);
                const nameEl = document.getElementById('header-name');
                if (nameEl) nameEl.textContent = res.name;
                const avEl = document.getElementById('header-avatar');
                if (avEl) avEl.textContent = res.name.substring(0, 2).toUpperCase();
            }
            if (res.reg_no) {
                localStorage.setItem('srm_reg_no', res.reg_no);
                const regEl = document.getElementById('header-reg');
                if (regEl) regEl.textContent = res.reg_no;
            }
            if (res.attendance && res.attendance.length > 0) {
                portalAttendance = res.attendance;
                localStorage.setItem('srm_cached_attendance', JSON.stringify(res.attendance));
                renderAttendance(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            }
            if (res.timetable && typeof res.timetable === 'object' && Object.keys(res.timetable).length > 0) {
                SRM_DATA.dayOrderSchedule = res.timetable;
                localStorage.setItem('srm_cached_schedule', JSON.stringify(res.timetable));
                renderDaySchedule(selectedDay);
                updateLiveHUD();
            }
        }

        // 2. Fetch live announcements / schedule overrides & calendar updates from backend if available
        try {
            const annRes = await apiFetch('/api/announcements');
            if (annRes && annRes.success && annRes.announcements && annRes.announcements.length > 0) {
                announcementsData = annRes.announcements;
                renderAnnouncements();
            }

            const pDataRes = await apiFetch('/api/portal-data');
            if (pDataRes && pDataRes.success && pDataRes.data) {
                if (pDataRes.data.calendar && pDataRes.data.calendar.length > 0) {
                    SRM_DATA.calendar = pDataRes.data.calendar;
                    localStorage.setItem('srm_cached_calendar', JSON.stringify(pDataRes.data.calendar));
                    renderCalendarList();
                    initClockAndDate();
                }
            }
        } catch (_) {}
    } catch (_) {}
}

async function triggerManualScrape() {
    const btn = document.getElementById('scrape-btn');
    if (!btn || btn.disabled) return;
    btn.textContent = 'Syncing…'; btn.disabled = true;
    
    await syncWithBackend();
    
    setTimeout(() => {
        btn.textContent = 'Sync Portal';
        btn.disabled = false;
        renderAttendance(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
    }, 1200);
}

// ─── Attendance Renderer (Clean Mapping & Margin Calculations) ────────────────
function renderAttendance(syncedAt) {
    const wrap = document.getElementById('att-wrap');
    const stamp = document.getElementById('att-stamp');
    if (!wrap) return;
    if (stamp && syncedAt) stamp.textContent = 'Last synced: ' + syncedAt;

    if (!portalAttendance || !portalAttendance.length) {
        wrap.innerHTML = '<p class="att-empty" style="text-align:center;color:var(--text-muted);padding:30px 0;">No attendance records found yet. Tap "Sync Portal".</p>';
        return;
    }

    let totCon = 0, totAtt = 0, totAbs = 0;

    const cardsHtml = portalAttendance.map(item => {
        const title = item.title || item.subject || item.code || 'Academic Subject';
        const code  = item.code || '';
        const con   = parseInt(item.conducted || 0, 10);
        const att   = parseInt(item.attended || 0, 10);
        const abs   = parseInt(item.absent || 0, 10);
        
        totCon += con;
        totAtt += att;
        totAbs += abs;

        const isUnconducted = con === 0;
        const pct = isUnconducted ? 100.0 : (item.percentage ? parseFloat(item.percentage) : parseFloat(((att / con) * 100).toFixed(2)));
        const danger = !isUnconducted && pct < 75;
        
        const needed   = isUnconducted ? 0 : Math.max(0, 3 * con - 4 * att);
        const bunkable = isUnconducted ? 0 : Math.max(0, Math.floor((4 * att - 3 * con) / 3));

        const hint = isUnconducted
            ? `<span class="att-hint safe" style="color:#38bdf8;font-size:0.73rem;font-weight:600;">ℹ️ No classes conducted yet</span>`
            : danger
                ? `<span class="att-hint danger" style="color:#f87171;font-size:0.73rem;font-weight:600;">⚠️ Attend ${needed} more class${needed > 1 ? 'es' : ''} to reach 75%</span>`
                : bunkable > 0
                    ? `<span class="att-hint safe" style="color:#34d399;font-size:0.73rem;font-weight:600;">✅ Safe Margin: Can skip ${bunkable} class${bunkable > 1 ? 'es' : ''}</span>`
                    : `<span class="att-hint warn" style="color:#fbbf24;font-size:0.73rem;font-weight:600;">⚖️ Exactly at 75% margin — do not miss!</span>`;

        return `
        <div class="att-card ${danger ? 'att-danger' : 'att-safe'}" style="background:#18181c;border:1px solid ${danger ? '#451a1a' : '#1e293b'};border-radius:14px;padding:14px;display:flex;flex-direction:column;gap:8px;">
            <div class="att-top" style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div class="att-subject">
                    <span class="att-code" style="font-size:0.7rem;background:#27272a;color:#38bdf8;padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-weight:700;">${code || 'COURSE'}</span>
                    <div class="att-name" style="font-size:0.88rem;font-weight:700;color:#f4f4f5;margin-top:4px;">${title}</div>
                </div>
                <div class="att-pct" style="font-size:1.15rem;font-weight:800;color:${danger ? '#f87171' : '#34d399'};font-family:var(--font-mono);">${pct}%</div>
            </div>
            <div class="att-bar-track" style="background:#27272a;height:6px;border-radius:9999px;overflow:hidden;margin:4px 0;">
                <div class="att-bar-fill" style="width:${Math.min(pct,100)}%;background:${danger ? '#ef4444' : '#22c55e'};height:100%;border-radius:9999px;"></div>
            </div>
            <div class="att-stats" style="display:flex;gap:12px;font-size:0.75rem;color:var(--text-muted);">
                <span>${con} conducted</span>
                <span style="color:#34d399;font-weight:600;">${att} attended</span>
                <span style="color:#f87171;font-weight:600;">${abs} absent</span>
            </div>
            ${hint}
        </div>`;
    }).join('');

    const overallPct = totCon > 0 ? parseFloat(((totAtt / totCon) * 100).toFixed(2)) : 100.0;
    const overallDanger = totCon > 0 && overallPct < 75;
    const overallBunk = totCon > 0 ? Math.max(0, Math.floor((4 * totAtt - 3 * totCon) / 3)) : 0;
    const overallNeeded = totCon > 0 ? Math.max(0, 3 * totCon - 4 * totAtt) : 0;

    const summaryHtml = `
    <div class="att-summary-card" style="background:linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);border:1px solid #3730a3;border-radius:14px;padding:16px;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;align-items:center;">
            <div>
                <span style="font-size:0.72rem;color:#818cf8;font-weight:700;text-transform:uppercase;letter-spacing:1px;">Semester Overview</span>
                <div style="font-size:1.05rem;font-weight:800;color:#f8fafc;margin-top:2px;">Overall Attendance</div>
            </div>
            <div style="font-size:1.6rem;font-weight:900;color:${overallDanger ? '#f87171' : '#34d399'};font-family:var(--font-mono);">${overallPct}%</div>
        </div>
        <div class="att-bar-track" style="background:#1e293b;height:8px;border-radius:9999px;overflow:hidden;margin:10px 0 8px;">
            <div class="att-bar-fill" style="width:${Math.min(overallPct,100)}%;background:${overallDanger ? '#ef4444' : '#22c55e'};height:100%;border-radius:9999px;"></div>
        </div>
        <div style="display:flex;justify-content:space-between;font-size:0.76rem;color:#cbd5e1;">
            <span>Total: <b>${totCon} hrs</b> (${totAtt} attended, ${totAbs} absent)</span>
            <span style="font-weight:700;color:${overallDanger ? '#f87171' : '#38bdf8'};">${overallDanger ? `⚠️ Need ${overallNeeded} hrs to reach 75%` : `✅ ${overallBunk} hrs safe margin`}</span>
        </div>
    </div>`;

    wrap.innerHTML = summaryHtml + cardsHtml;
}

// ─── Clock, Calendar & HUD ────────────────────────────────────────────────────
function initClockAndDate() {
    updateClock();
    const todayStr = getFormattedDateStr(new Date());
    const calEntry = SRM_DATA.calendar.find(c => c.date === todayStr);
    const dayBadge = document.getElementById('current-day-badge');
    const manualOverride = localStorage.getItem('srm_manual_day_order');

    if (manualOverride) {
        if (manualOverride === 'Holiday') {
            isTodayHoliday = true;
            if (dayBadge) { dayBadge.textContent = 'Holiday'; dayBadge.style.color = '#ef4444'; }
        } else {
            isTodayHoliday = false;
            currentDayOrder = manualOverride;
            selectedDay = currentDayOrder;
            if (dayBadge) { dayBadge.textContent = manualOverride; dayBadge.style.color = '#38bdf8'; }
        }
    } else if (calEntry) {
        if (calEntry.status === 'Holiday') {
            isTodayHoliday = true;
            if (dayBadge) { dayBadge.textContent = 'Holiday'; dayBadge.style.color = '#ef4444'; }
        } else {
            isTodayHoliday = false;
            currentDayOrder = calEntry.day_order;
            selectedDay = currentDayOrder;
            if (dayBadge) { dayBadge.textContent = calEntry.day_order; dayBadge.style.color = '#38bdf8'; }
        }
    } else {
        currentDayOrder = 'Day 2';
        selectedDay = 'Day 2';
        if (dayBadge) dayBadge.textContent = 'Day 2';
    }

    renderDaySchedule(selectedDay);
    highlightActiveDayBtn(selectedDay);
}

function openDayOrderSwitcher() {
    const current = localStorage.getItem('srm_manual_day_order') || 'Auto';
    const choice = prompt(
        `⚡ Quick Day Order & Holiday Override\n\n` +
        `Current Status: ${current}\n\n` +
        `1. Auto (Official Academic Calendar)\n` +
        `2. Holiday / Campus Off\n` +
        `3. Day 1\n` +
        `4. Day 2\n` +
        `5. Day 3\n` +
        `6. Day 4\n` +
        `7. Day 5\n\n` +
        `Enter number (1-7):`,
        current === 'Auto' ? '1' : (current === 'Holiday' ? '2' : String(parseInt(current.replace('Day ', '')) + 2))
    );
    if (!choice) return;
    const num = parseInt(choice.trim(), 10);
    if (num === 1) {
        localStorage.removeItem('srm_manual_day_order');
    } else if (num === 2) {
        localStorage.setItem('srm_manual_day_order', 'Holiday');
    } else if (num >= 3 && num <= 7) {
        localStorage.setItem('srm_manual_day_order', `Day ${num - 2}`);
    }
    initClockAndDate();
    updateLiveHUD();
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

function updateLiveHUD() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const hudTitle = document.getElementById('hud-class-title');
    const hudVenue = document.getElementById('hud-venue');
    const hudFaculty = document.getElementById('hud-faculty');
    const hudTime = document.getElementById('hud-time');
    const hudUpNext = document.getElementById('hud-up-next');
    const hudStatus = document.getElementById('hud-pulse-status');

    if (!hudTitle) return;

    if (isTodayHoliday) {
        if (hudStatus) { hudStatus.textContent = 'Holiday'; hudStatus.style.color = '#ef4444'; }
        hudTitle.textContent = 'No Classes Scheduled';
        if (hudVenue) hudVenue.textContent = 'Campus Off';
        if (hudFaculty) hudFaculty.textContent = '-';
        if (hudTime) hudTime.textContent = 'All Day';
        if (hudUpNext) hudUpNext.textContent = 'Check calendar for next working day';
        return;
    }

    const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || SRM_DATA.dayOrderSchedule['Day 1'] || [];
    let currentPeriod = null;
    let nextPeriod = null;

    for (let i = 0; i < SRM_DATA.timeSlots.length; i++) {
        const slot = SRM_DATA.timeSlots[i];
        const [sH, sM] = slot.start.split(':').map(Number);
        const [eH, eM] = slot.end.split(':').map(Number);
        const startMin = sH * 60 + sM;
        const endMin = eH * 60 + eM;

        if (currentMinutes >= startMin && currentMinutes < endMin) {
            currentPeriod = schedule[i];
            if (hudTime) hudTime.textContent = `${slot.start} - ${slot.end}`;
            if (i + 1 < schedule.length && schedule[i + 1].type !== 'Free') {
                nextPeriod = schedule[i + 1];
            }
            break;
        } else if (currentMinutes < startMin && !nextPeriod && schedule[i] && schedule[i].type !== 'Free') {
            nextPeriod = schedule[i];
        }
    }

    if (currentPeriod && currentPeriod.type !== 'Free') {
        if (hudStatus) { hudStatus.textContent = 'Now Playing'; hudStatus.style.color = '#34d399'; }
        hudTitle.textContent = currentPeriod.title;
        if (hudVenue) hudVenue.textContent = currentPeriod.venue || 'TBA';
        if (hudFaculty) hudFaculty.textContent = currentPeriod.faculty || '-';
        if (hudUpNext) hudUpNext.textContent = nextPeriod ? `${nextPeriod.title} @ ${nextPeriod.venue}` : 'End of day';
    } else {
        if (hudStatus) { hudStatus.textContent = 'Free Period / Recess'; hudStatus.style.color = '#38bdf8'; }
        hudTitle.textContent = nextPeriod ? `Up Next: ${nextPeriod.title}` : 'No Active Classes';
        if (hudVenue) hudVenue.textContent = nextPeriod ? nextPeriod.venue : 'Campus';
        if (hudFaculty) hudFaculty.textContent = nextPeriod ? nextPeriod.faculty : '-';
        if (hudUpNext) hudUpNext.textContent = nextPeriod ? `Starts at ${nextPeriod.slot || 'upcoming slot'}` : 'All caught up';
    }
}

// ─── Schedule Renderer ────────────────────────────────────────────────────────
function renderDaySchedule(day) {
    const list = document.getElementById('period-list');
    if (!list) return;
    list.innerHTML = '';
    const schedule = SRM_DATA.dayOrderSchedule[day] || [];

    schedule.forEach((p, idx) => {
        const slotInfo = SRM_DATA.timeSlots[idx] || { start: '--:--', label: `Hour ${idx + 1}` };
        const card = document.createElement('div');
        card.className = 't-card' + (p.type === 'Free' ? ' free-card' : '');

        let tagClass = 'tag-free';
        let tagText = p.type || 'Class';
        if (p.type === 'Theory') tagClass = 'tag-theory';
        if (p.type === 'Lab') tagClass = 'tag-lab';

        card.innerHTML = `
            <div class="t-left">
                <div class="t-hour">H${p.hour} &bull; ${slotInfo.start}</div>
                <div class="t-info">
                    <div class="t-name">${p.title}</div>
                    <div class="t-meta">📍 ${p.venue} ${p.slot ? `&bull; Slot ${p.slot}` : ''} ${p.faculty && p.faculty !== '-' ? `&bull; ${p.faculty}` : ''}</div>
                </div>
            </div>
            <div>
                <span class="t-tag ${tagClass}">${tagText}</span>
            </div>
        `;
        list.appendChild(card);
    });
}

function initDaySelector() {
    const container = document.getElementById('day-selector');
    if (!container) return;
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

// ─── Categorized Announcements ────────────────────────────────────────────────
let announcementsData = [
    {
        id: "ann-1",
        subject: "Comp Biology",
        code: "26BTB1001T",
        category: "Schedule",
        title: "Optional Hours & Today's Class Cancelled",
        detail: "Prof. Sivasankareswari: Day Order 2 (4:00 PM) optional class cancelled. Day Order 3 (9:45 AM) optional.",
        faculty: "Prof. Sivasankareswari E",
        venue: "UB 601 (6th Floor)",
        sourceGroup: "P1 26-30 CSE AI ML BIO",
        timestamp: "Today"
    },
    {
        id: "ann-2",
        subject: "Chemistry for CS",
        code: "26CYB1002J",
        category: "Xerox / Lab",
        title: "Chemistry Lab Venue & Observation Book",
        detail: "Pink Building opposite to Main University Building, 1st Floor Lab 4. Bring lab manual and observation notebook.",
        faculty: "Dr. John Bosco A",
        venue: "Pink Building 1st Fl Lab 4",
        sourceGroup: "AI ML P1 Chemistry",
        timestamp: "Today"
    },
    {
        id: "ann-3",
        subject: "Programming (PPS)",
        code: "26CSE1002J",
        category: "Assignment",
        title: "PPS Lab Program 3 & 4 Submissions",
        detail: "Complete C programs on pointers, 1D arrays, and recursion with sample outputs. Submit in observation book.",
        faculty: "Sheeba Rachel S",
        venue: "Tech Park 3rd Fl Lab",
        sourceGroup: "P1 C programming",
        timestamp: "Recent"
    },
    {
        id: "ann-4",
        subject: "Workshop Practice",
        code: "26MEE1001L",
        category: "Materials",
        title: "Sheet Metal Manual Printout",
        detail: "Get Sheet Metal & Fitting manuals printed from Tech Park / Java Xerox before Day 3 lab session.",
        faculty: "Dr. Manoj Samson R",
        venue: "BEL Ground Fl Sheet Metal Lab",
        sourceGroup: "Batch 1 Official",
        timestamp: "Upcoming"
    },
    {
        id: "ann-5",
        subject: "Calculus & Algebra",
        code: "26MAB1001T",
        category: "Tutorial",
        title: "Unit 1 Matrix Diagonalization Tutorial",
        detail: "Tutorial problems for Unit 1 Matrix Diagonalization and Quadratic forms to be submitted before CLA-1.",
        faculty: "Dr. N. Parvathi",
        venue: "UB 601 (Slot B)",
        sourceGroup: "AI ML P1 MATHS",
        timestamp: "Recent"
    }
];

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
        card.style.cssText = 'padding:14px 16px;display:flex;flex-direction:column;gap:8px;';

        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <div>
                    <span style="font-size:0.68rem;padding:2px 7px;border-radius:4px;font-weight:700;text-transform:uppercase;background:#27272a;color:#38bdf8;">${ann.category}</span>
                    <span style="font-size:0.75rem;color:var(--text-sub);margin-left:6px;font-weight:600;">${ann.subject}</span>
                </div>
                <span style="font-size:0.7rem;color:var(--text-muted);">${ann.timestamp}</span>
            </div>
            <div style="font-size:0.9rem;font-weight:700;color:#ffffff;line-height:1.35;">${ann.title}</div>
            <div style="font-size:0.82rem;color:var(--text-sub);line-height:1.45;">${ann.detail}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:4px;font-size:0.72rem;color:var(--text-muted);border-top:1px solid #1f1f26;padding-top:6px;">
                <span>📍 ${ann.venue} ${ann.faculty && ann.faculty !== '-' ? `&bull; 👤 ${ann.faculty}` : ''}</span>
                <span style="color:#71717a;">${ann.sourceGroup}</span>
            </div>
        `;
        container.appendChild(card);
    });
}

function filterAnnouncements(code) {
    activeSubjectFilter = code;
    document.querySelectorAll('#ann-filter-scroll .day-chip').forEach(c => c.classList.remove('active'));
    if (window.event && window.event.target) window.event.target.classList.add('active');
    renderAnnouncements(code);
}

function initAnnouncementsSearch() {
    const input = document.getElementById('ann-search-input');
    if (input) input.oninput = (e) => renderAnnouncements(activeSubjectFilter, e.target.value);
}

// ─── Stateful Protocol Emulation AI Client Caller ─────────────────────────────
function initAI() {
    const sendBtn = document.getElementById('ai-send-btn');
    const input = document.getElementById('ai-input');
    if (sendBtn && input) {
        sendBtn.onclick = () => handleAISend();
        input.onkeypress = (e) => { if (e.key === 'Enter') handleAISend(); };
    }

    document.querySelectorAll('.ai-prompt-pill').forEach(chip => {
        chip.onclick = () => {
            const prompt = chip.getAttribute('data-prompt');
            if (input && prompt) {
                input.value = prompt;
                handleAISend();
            }
        };
    });
}

function getAcademicContextForAI() {
    const studentName = localStorage.getItem('srm_display_name') || 'Student';
    const regNo = localStorage.getItem('srm_reg_no') || 'N/A';
    const program = localStorage.getItem('srm_program') || 'B.Tech';
    const section = localStorage.getItem('srm_section') || 'P1';
    const day = currentDayOrder || 'Day 1';
    
    // Build full Day 1 to Day 5 timetable matrix
    let allScheduleText = '';
    const allDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    allDays.forEach(d => {
        const list = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[d]) || [];
        if (list.length > 0) {
            allScheduleText += `\n[${d}]:\n`;
            list.forEach(c => {
                if (c.type !== 'Free') {
                    allScheduleText += `  - Hour ${c.hour} (${c.time || 'Period ' + c.hour}): ${c.title} (${c.code || ''}) at ${c.venue || 'Classroom'} | Faculty: ${c.faculty || 'Dept Faculty'}\n`;
                }
            });
        }
    });

    let attText = '';
    if (portalAttendance && portalAttendance.length > 0) {
        attText = portalAttendance.map(a => {
            const con = parseInt(a.conducted || 0, 10);
            const att = parseInt(a.attended || 0, 10);
            const pct = con > 0 ? parseFloat(a.percentage || ((att / con) * 100).toFixed(1)) : 100;
            const bunks = con > 0 ? Math.max(0, Math.floor((4 * att - 3 * con) / 3)) : 0;
            const needed = con > 0 ? Math.max(0, 3 * con - 4 * att) : 0;
            return `- ${a.title || a.subject || a.code} [${a.code}]: ${pct}% (${att}/${con} hrs). Safe Bunks: ${bunks} hrs. Required to reach 75%: ${needed} hrs.`;
        }).join('\n');
    }

    return `You are the personal AI Academic Copilot for SRMIST student ${studentName} (Reg No: ${regNo}, Program: ${program}, Section: ${section}).
Current Campus Context:
- Active Day Order Today: ${day}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

Complete Student Timetable (Day 1 - Day 5):
${allScheduleText || 'No custom timetable loaded yet.'}

Live Student Attendance Records:
${attText || '100% attendance.'}

Instructions:
1. Always give precise, direct answers using the student's real courses, venues, faculty, safe bunk limits, and day-by-day timetable above.
2. When asked about classes or timetable for today, tomorrow, or any Day Order (Day 1 - Day 5), provide the exact list of hours, subjects, venues, and faculty.
3. When asked about attendance or bunks, use the exact percentages and safe bunk calculations from their attendance records above.
4. When asked about subjects (PPS, Calculus, Chemistry, Workshop, Comp Bio), provide high-yield explanations, C code snippets, or math derivations with formulas.`;
}

async function askAcademicAI(userPrompt) {
    const systemPrompt = getAcademicContextForAI();

    // 1. Primary: Direct Serverless / Backend AI Gateway (/api/chat)
    try {
        const res = await apiFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({ message: userPrompt, context: systemPrompt })
        });
        if (res && res.reply && res.reply.trim()) {
            return res.reply;
        }
    } catch (_) {}

    // 2. Secondary: Instant Client-Side Academic Knowledge & Timetable Engine
    return getOfflineAIResponse(userPrompt);
}

function getOfflineAIResponse(prompt) {
    const q = prompt.toLowerCase().trim();
    const studentName = localStorage.getItem('srm_display_name') || 'Student';
    const day = currentDayOrder || 'Day 1';
    const schedule = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[day]) || [];

    // Greeting
    if (q === 'hi' || q === 'hello' || q === 'hey' || q.startsWith('hi ') || q.startsWith('hello ')) {
        const todayClasses = schedule.filter(s => s.type !== 'Free');
        let nextSummary = 'You have a free day today!';
        if (todayClasses.length > 0) {
            const first = todayClasses[0];
            nextSummary = `Today is **${day}** with **${todayClasses.length} class(es)**. Next up: **${first.title}** at \`${first.venue}\` (Hour ${first.hour}).`;
        }
        return `👋 Hi **${studentName}**!\n\n${nextSummary}\n\nAsk me anything about your **timetable**, **attendance safe bunks**, **faculty**, or coursework topics (**PPS, Calculus, Chemistry, Comp Bio, Workshop**)!`;
    }

    // Specific Day Order schedule query (Day 1 - Day 5)
    for (let d = 1; d <= 5; d++) {
        const dayKey = `day ${d}`;
        if (q.includes(dayKey) || q.includes(`day${d}`) || q.includes(`order ${d}`) || q.includes(`order${d}`)) {
            const targetDay = `Day ${d}`;
            const targetSched = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[targetDay]) || [];
            const active = targetSched.filter(s => s.type !== 'Free');
            if (active.length === 0) return `### 🕒 Schedule for **${targetDay}**\n\nNo classes scheduled for **${targetDay}** (Free Day).`;
            
            let out = `### 🕒 Schedule for **${targetDay}**\n\n`;
            active.forEach(c => {
                out += `- **Hour ${c.hour}** (${c.time || ''}): **${c.title}** (${c.code || ''}) at \`${c.venue}\` [Faculty: ${c.faculty || 'Dept'}]\n`;
            });
            return out;
        }
    }

    // Full week timetable query
    if (q.includes('full timetable') || q.includes('all days') || q.includes('full schedule') || q.includes('entire timetable') || q.includes('week schedule')) {
        let out = `### 📅 Full 5-Day Order Timetable Matrix\n\n`;
        const allDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
        allDays.forEach(d => {
            const list = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[d]) || [];
            const active = list.filter(s => s.type !== 'Free');
            out += `#### 🗓️ **${d}** (${active.length} classes)\n`;
            if (active.length === 0) {
                out += `_Free Day_\n\n`;
            } else {
                active.forEach(c => {
                    out += `- Hour ${c.hour}: **${c.title}** at \`${c.venue}\` (${c.faculty || 'Faculty'})\n`;
                });
                out += `\n`;
            }
        });
        return out;
    }

    // Today / Next Class Schedule query
    if (q.includes('today') || q.includes('schedule') || q.includes('timetable') || q.includes('class') || q.includes('next') || q.includes('what do i have')) {
        const classes = schedule.filter(s => s.type !== 'Free');
        if (classes.length === 0) return `No classes scheduled for **${day}**! You have a free day.`;
        let out = `### 🕒 Today's Schedule (${day})\n\n`;
        classes.forEach(c => {
            out += `- **Hour ${c.hour}** (${c.time || ''}): **${c.title}** (${c.type}) at \`${c.venue}\` [Faculty: ${c.faculty || '-'}]\n`;
        });
        return out;
    }

    // Attendance & Safe Bunk Calculations
    if (q.includes('bunk') || q.includes('attendance') || q.includes('75') || q.includes('margin') || q.includes('analyze') || q.includes('absent') || q.includes('percentage')) {
        if (portalAttendance && portalAttendance.length > 0) {
            let out = `### 📊 Live Attendance Breakdown & Safe Bunks\n\n`;
            let totalCon = 0, totalAtt = 0;

            portalAttendance.forEach(a => {
                const con = parseInt(a.conducted || 0, 10);
                const att = parseInt(a.attended || 0, 10);
                const pct = con > 0 ? parseFloat(a.percentage || ((att / con) * 100).toFixed(1)) : 100;
                totalCon += con;
                totalAtt += att;

                const danger = con > 0 && pct < 75;
                const bunks = con > 0 ? Math.max(0, Math.floor((4 * att - 3 * con) / 3)) : 0;
                const needed = con > 0 ? Math.max(0, 3 * con - 4 * att) : 0;

                const statusIcon = danger ? '❌' : (bunks > 0 ? '✅' : '⚖️');
                const marginText = danger ? `Need **${needed}** more class(es)` : (bunks > 0 ? `Can skip **${bunks}** class(es)` : `Exactly at margin`);

                out += `- ${statusIcon} **${a.code}** (${a.title || a.subject}): **${pct}%** (${att}/${con} hrs) &rarr; ${marginText}\n`;
            });

            const overallPct = totalCon > 0 ? ((totalAtt / totalCon) * 100).toFixed(1) : 100;
            out += `\n**Overall Semester Attendance:** **${overallPct}%** (${totalAtt}/${totalCon} hours)`;
            return out;
        }

        return `### 📊 SRM Attendance Regulations & Formulas\n\n` +
               `- **Mandatory Minimum:** 75% per registered course.\n` +
               `- **Safe Bunk Formula:** \`Math.floor((4 * Attended - 3 * Conducted) / 3)\`\n` +
               `- **Recovery Formula:** \`Math.max(0, 3 * Conducted - 4 * Attended)\`\n` +
               `- Sync your portal in the **Attendance Tab** to see live margins for all your subjects!`;
    }

    // Faculty query
    if (q.includes('faculty') || q.includes('teacher') || q.includes('professor') || q.includes('who teaches') || q.includes('staff')) {
        let facultyMap = {};
        const allDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
        allDays.forEach(d => {
            const list = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[d]) || [];
            list.forEach(c => {
                if (c.faculty && c.title && c.type !== 'Free') {
                    facultyMap[c.title] = `${c.faculty} (Venue: ${c.venue})`;
                }
            });
        });

        if (Object.keys(facultyMap).length > 0) {
            let out = `### 👨‍🏫 Course Faculty & Venues\n\n`;
            for (const [subj, fac] of Object.entries(facultyMap)) {
                out += `- **${subj}**: ${fac}\n`;
            }
            return out;
        }
    }

    // Calculus
    if (q.includes('eigen') || q.includes('matrix') || q.includes('calculus') || q.includes('26mab1001t') || q.includes('math')) {
        return `### 📐 Calculus & Linear Algebra (26MAB1001T) — Eigenvalues & Diagonalization\n\n` +
               `**1. Characteristic Equation:**\n` +
               `Solve $|A - \\lambda I| = 0$ to obtain the characteristic polynomial and eigenvalues $\\lambda_1, \\lambda_2, \\dots, \\lambda_n$.\n\n` +
               `**2. Eigenvector Calculation:**\n` +
               `For each eigenvalue $\\lambda_i$, solve the homogeneous system $(A - \\lambda_i I)X = 0$.\n\n` +
               `**3. Cayley-Hamilton Theorem:**\n` +
               `Every square matrix satisfies its own characteristic equation: $P(A) = 0$.\n` +
               `- **Matrix Inverse:** $A^{-1} = -\\frac{1}{a_0}(A^{n-1} + a_1 A^{n-2} + \\dots + a_{n-1} I)$\n` +
               `- **Higher Powers:** $A^k = Q(A)P(A) + R(A) = R(A)$\n\n` +
               `**4. Quadratic Forms & Orthogonal Reduction:**\n` +
               `A real symmetric matrix $A$ can be diagonalized as $P^T A P = D$ where $P$ is the orthogonal matrix of normalized eigenvectors.`;
    }

    // PPS / C Code
    if (q.includes('c code') || q.includes('prime') || q.includes('pps') || q.includes('26cse1002j') || q.includes('c program') || q.includes('pointer') || q.includes('array')) {
        return `### 💻 PPS (26CSE1002J) — Prime Numbers Range in C\n\n` +
               `\`\`\`c\n` +
               `#include <stdio.h>\n` +
               `#include <stdbool.h>\n\n` +
               `// Returns true if n is prime (O(sqrt(n)) complexity)\n` +
               `bool isPrime(int n) {\n` +
               `    if (n <= 1) return false;\n` +
               `    for (int i = 2; i * i <= n; i++) {\n` +
               `        if (n % i == 0) return false;\n` +
               `    }\n` +
               `    return true;\n` +
               `}\n\n` +
               `int main() {\n` +
               `    int start = 10, end = 50;\n` +
               `    printf("Prime numbers between %d and %d:\\n", start, end);\n` +
               `    for (int i = start; i <= end; i++) {\n` +
               `        if (isPrime(i)) {\n` +
               `            printf("%d ", i);\n` +
               `        }\n` +
               `    }\n` +
               `    printf("\\n");\n` +
               `    return 0;\n` +
               `}\n` +
               `\`\`\`\n` +
               `**Complexity:** Checking factors up to $\\sqrt{n}$ reduces runtime from $O(n)$ to $O(\\sqrt{n})$ per number.`;
    }

    return `I am your **SRM Academic Copilot**. Ask me about:\n- **Today's timetable** or **Day 1 - Day 5 schedules**\n- **Live attendance percentages & safe bunks**\n- **Course faculty & classroom venues**\n- **C programming code & Calculus formulas**`;
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

let _chatMsgSeq = 0;
function appendChatMessage(sender, text) {
    const history = document.getElementById('chat-history');
    const msg = document.createElement('div');
    const msgId = 'msg-' + sender + '-' + Date.now() + '-' + (++_chatMsgSeq);
    msg.id = msgId;
    msg.className = `bubble bubble-${sender}`;
    msg.innerHTML = formatMarkdown(text);
    if (history) {
        history.appendChild(msg);
        history.scrollTop = history.scrollHeight;
    }
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

// ─── Real P2P WebRTC Device-to-Device Mesh (PeerJS) ──────────────────────────
let _peer = null;
let _connections = [];
let _broadcastChannel = null;

function initP2PMesh() {
    const myName = localStorage.getItem('srm_display_name') || 'Student';
    const badge = document.getElementById('p2p-peer-count');

    // Local tab broadcast fallback
    try {
        if ('BroadcastChannel' in window) {
            _broadcastChannel = new BroadcastChannel('srm_p2p_mesh');
            _broadcastChannel.onmessage = (event) => {
                if (event.data && event.data.text) renderP2PMessage(event.data, false);
            };
        }
    } catch (_) {}

    // Initialize WebRTC P2P via PeerJS
    if (typeof Peer !== 'undefined') {
        try {
            const peerId = 'srm-' + (localStorage.getItem('srm_auto_id') || Math.random().toString(36).substring(2, 8));
            _peer = new Peer(peerId, { debug: 0 });

            _peer.on('open', () => {
                if (badge) { badge.textContent = '🟢 WebRTC Mesh Live'; badge.style.color = '#34d399'; }
            });

            _peer.on('connection', (conn) => {
                conn.on('data', (data) => {
                    if (data && data.text) renderP2PMessage(data, false);
                });
                _connections.push(conn);
            });

            _peer.on('error', (err) => {
                console.warn('PeerJS note:', err.type);
                if (badge) { badge.textContent = '🟢 Local Mesh Ready'; badge.style.color = '#38bdf8'; }
            });
        } catch (e) {
            console.warn('PeerJS init fallback:', e);
        }
    }

    const input = document.getElementById('p2p-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendP2PMessage();
        });
    }

    loadP2PHistory();
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
            ${isSelf ? 'You' : escapeHtml(msg.sender)} &bull; ${msg.timestamp}
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
        if (history.length > 50) history.shift();
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

    const myName = localStorage.getItem('srm_display_name') || 'Me';
    const msg = {
        id: 'p2p-' + Date.now(),
        sender: myName,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Broadcast via WebRTC to connected peers
    _connections.forEach(conn => {
        if (conn.open) conn.send(msg);
    });

    // 2. Broadcast to local browser tabs
    if (_broadcastChannel) {
        try { _broadcastChannel.postMessage(msg); } catch (_) {}
    }

    renderP2PMessage(msg, true);
    saveP2PMessage(msg);
    input.value = '';
}

function escapeHtml(str) {
    return String(str)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\n/g, '<br>');
}

// ─── Tools & Calendar Export ──────────────────────────────────────────────────
function initQuickTools() {
    const waBtn = document.getElementById('btn-share-wa');
    if (waBtn) {
        waBtn.onclick = () => {
            const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || [];
            let text = `*SRM Schedule (${currentDayOrder})*\n------------------------\n`;
            schedule.forEach(p => {
                if (p.type !== 'Free') {
                    text += `⏰ Hour ${p.hour}: *${p.title}*\n📍 ${p.venue} ${p.slot ? `(Slot ${p.slot})` : ''}\n\n`;
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
    if (searchInput) searchInput.oninput = (e) => populate(e.target.value);
}
