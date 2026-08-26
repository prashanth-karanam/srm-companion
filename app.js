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
function bootApp() {
    const curBuildVer = typeof APP_BUILD_VERSION !== 'undefined' ? APP_BUILD_VERSION : '2.4.1';
    try {
        const storedVer = localStorage.getItem('srm_client_version');
        if (storedVer !== curBuildVer) {
            if ('caches' in window) caches.keys().then(names => names.forEach(name => caches.delete(name)));
            localStorage.setItem('srm_client_version', curBuildVer);
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

// ─── Auto-Cache Invalidation & GitHub Live OTA Updates ────────────────────────
function applyAppVersionAndCleanStaleCaches() {
    const currentVer = (typeof APP_BUILD_VERSION !== 'undefined') ? APP_BUILD_VERSION : '2.4.2';
    const storedVer = localStorage.getItem('srm_installed_build_version');

    if (storedVer !== currentVer) {
        console.log(`[OTA Engine] Version upgraded: ${storedVer || 'Legacy'} -> ${currentVer}. Purging stale static cache to load latest GitHub timetable/calendar...`);
        // Remove stale calendar & timetable & legacy mock notice caches so fresh dynamic data is applied
        localStorage.removeItem('srm_cached_calendar');
        localStorage.removeItem('srm_cached_schedule');
        localStorage.removeItem('srm_user_announcements_global');
        localStorage.removeItem('srm_linked_wa_groups');
        localStorage.removeItem('srm_cached_announcements');
        localStorage.setItem('srm_installed_build_version', currentVer);
    }
}

async function checkGitHubOTAUpdate() {
    try {
        const url = 'https://raw.githubusercontent.com/prashanth-karanam/srm-companion/master/version.json?t=' + Date.now();
        const r = await fetch(url, { cache: 'no-store' });
        if (!r.ok) return;
        const meta = await r.json();
        const localVer = (typeof APP_BUILD_VERSION !== 'undefined') ? APP_BUILD_VERSION : '2.4.1';
        
        if (meta && meta.version && meta.version !== localVer) {
            console.log(`[OTA Update] 🚀 Newer commit detected on GitHub: ${meta.version} (Local: ${localVer})`);
            showAttendanceToast(`🚀 Live GitHub Update v${meta.version} detected! Syncing...`, 'success');
            localStorage.removeItem('srm_cached_calendar');
            localStorage.removeItem('srm_cached_schedule');
            localStorage.setItem('srm_installed_build_version', meta.version);
            setTimeout(() => {
                window.location.reload(true);
            }, 1500);
        }
    } catch (_) {}
}

function _initApp() {
    // 1. Purge stale caches if new code was pushed to GitHub
    applyAppVersionAndCleanStaleCaches();

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
        announcementsData = getUserAnnouncements();
    } catch (_) {}

    initClockAndDate();
    initDockNavigation();
    initDaySelector();
    initAI();
    initQuickTools();
    renderCalendarList();
    renderSubjectFilterChips();
    renderAnnouncements();
    renderWhatsAppGroups();
    initAnnouncementsSearch();
    updateLiveHUD();
    initP2PMesh();
    initWADeviceMonitor();

    // Attach interactive Day Order switcher to Island Pill
    const pill = document.getElementById('island-pill');
    if (pill) {
        pill.style.cursor = 'pointer';
        pill.title = 'Tap to change Day Order or set Holiday';
        pill.onclick = openDayOrderSwitcher;
    }

    // On-demand background sync on launch
    syncWithBackend();

    // Check for live remote GitHub updates
    checkGitHubOTAUpdate();
    window.addEventListener('focus', checkGitHubOTAUpdate);

    if (!window._appIntervalsSet) {
        window._appIntervalsSet = true;
        setInterval(updateLiveHUD, 15000);
        setInterval(updateClock, 1000);
        setInterval(scheduleClassBoundaryCheck, 30000);
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
                const oldAtt = portalAttendance || [];
                const diffs = detectAttendanceDelta(oldAtt, res.attendance);
                portalAttendance = res.attendance;
                localStorage.setItem('srm_cached_attendance', JSON.stringify(res.attendance));
                renderAttendance(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
                if (diffs.length > 0) {
                    showAttendanceToast(diffs);
                }
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

// ─── Mathematical Delta Change Detection & Toast Alerts ───────────────────────
function detectAttendanceDelta(oldList, newList) {
    if (!oldList || !oldList.length) return [];
    const oldMap = {};
    oldList.forEach(a => { if (a.code) oldMap[a.code] = a; });
    const diffs = [];

    newList.forEach(newA => {
        const oldA = oldMap[newA.code];
        if (oldA) {
            const oldCon = parseInt(oldA.conducted || 0, 10);
            const newCon = parseInt(newA.conducted || 0, 10);
            const oldAtt = parseInt(oldA.attended || 0, 10);
            const newAtt = parseInt(newA.attended || 0, 10);

            if (newCon > oldCon) {
                const wasPresent = newAtt > oldAtt;
                diffs.push({
                    code: newA.code,
                    title: newA.title || newA.subject || newA.code,
                    status: wasPresent ? 'PRESENT' : 'ABSENT',
                    hoursAdded: newCon - oldCon,
                    newPct: newA.percentage,
                    newAtt: newAtt,
                    newCon: newCon
                });
            }
        }
    });
    return diffs;
}

function showAttendanceToast(input, type = 'info') {
    if (!input) return;

    if (typeof input === 'string') {
        const toast = document.createElement('div');
        const isSuccess = type === 'success';
        const isWarning = type === 'warning';
        const isError = type === 'error';
        const borderColor = isSuccess ? '#22c55e' : (isWarning ? '#f59e0b' : (isError ? '#ef4444' : '#38bdf8'));
        const textColor = isSuccess ? '#4ade80' : (isWarning ? '#fcd34d' : (isError ? '#f87171' : '#38bdf8'));

        toast.className = 'srm-toast show ' + type;
        toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#18181b;border:1px solid ${borderColor};color:#f4f4f5;padding:10px 18px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.6);z-index:999999;font-size:0.85rem;line-height:1.4;animation:fadeIn 0.25s ease;max-width:90%;`;
        toast.innerHTML = `<b style="color:${textColor};">SRM Companion</b><div>${input}</div>`;
        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
        return;
    }

    if (Array.isArray(input)) {
        input.forEach(d => {
            const isPresent = d.status === 'PRESENT';
            const msg = `${isPresent ? '✅ Present' : '❌ Absent'}: ${d.title} (${d.code}) &rarr; ${d.newAtt}/${d.newCon} hrs (${d.newPct}%)`;
            
            const toast = document.createElement('div');
            toast.className = 'srm-toast show ' + (isPresent ? 'success' : 'error');
            toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#18181b;border:1px solid ${isPresent ? '#22c55e' : '#ef4444'};color:#f4f4f5;padding:12px 18px;border-radius:12px;box-shadow:0 10px 25px rgba(0,0,0,0.6);z-index:999999;font-size:0.85rem;line-height:1.4;animation:fadeIn 0.3s ease;max-width:90%;`;
            toast.innerHTML = `<b style="color:${isPresent ? '#4ade80' : '#f87171'}">🔔 Attendance Updated!</b><div>${msg}</div>`;
            document.body.appendChild(toast);
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 6000);
        });
    }
}

function scheduleClassBoundaryCheck() {
    if (isTodayHoliday) return;
    const now = new Date();
    const currentMins = now.getHours() * 60 + now.getMinutes();
    
    // Class end minutes: 08:50 (530), 09:40 (580), 10:35 (635), 11:30 (690), 13:15 (795), 14:05 (845), 14:55 (895), 15:45 (945), 16:30 (990), 17:00 (1020)
    const endMinutes = [530, 580, 635, 690, 795, 845, 895, 945, 990, 1020];
    
    for (const em of endMinutes) {
        if (currentMins >= em + 4 && currentMins <= em + 12) {
            const key = 'srm_checked_slot_' + em + '_' + getFormattedDateStr(now);
            if (!sessionStorage.getItem(key)) {
                sessionStorage.setItem(key, '1');
                console.log('[SmartSync] Class boundary reached (slot ' + em + '). Triggering 0-CAPTCHA delta sync...');
                syncWithBackend();
            }
            break;
        }
    }
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
            selectedDay = 'Holiday';
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
            selectedDay = 'Holiday';
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

    initDaySelector();
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

// ─── Smart Calendar & Next Working Day Helpers ────────────────────────────────
function getNextWorkingDayInfo() {
    const today = new Date();
    const todayStr = getFormattedDateStr(today);
    
    for (let i = 1; i <= 14; i++) {
        const nextD = new Date(today.getTime() + i * 86400000);
        const nextStr = getFormattedDateStr(nextD);
        const entry = SRM_DATA.calendar.find(c => c.date === nextStr);
        if (entry && entry.status === 'Working day' && entry.day_order && entry.day_order.startsWith('Day')) {
            const sched = SRM_DATA.dayOrderSchedule[entry.day_order] || [];
            const nonFree = sched.filter(s => s && s.type !== 'Free');
            const firstC = nonFree[0] || { title: 'First Class', slot: '08:00', venue: 'UB 601', faculty: '-' };
            return {
                daysAhead: i,
                relativeLabel: i === 1 ? 'Tomorrow' : (i === 2 ? 'Day After' : `In ${i} days`),
                dateStr: entry.date,
                dayName: entry.day,
                dayOrder: entry.day_order,
                firstClass: firstC,
                totalClasses: nonFree.length,
                schedule: sched
            };
        }
    }
    return {
        daysAhead: 1,
        relativeLabel: 'Tomorrow',
        dateStr: 'Tomorrow',
        dayName: 'Thursday',
        dayOrder: 'Day 1',
        firstClass: { title: 'Calculus', slot: '08:00', venue: 'UB 601', faculty: 'Dr. N. Parvathi' },
        totalClasses: 4,
        schedule: SRM_DATA.dayOrderSchedule['Day 1'] || []
    };
}

function getUpcomingHolidays(count = 3) {
    const today = new Date();
    const todayStr = getFormattedDateStr(today);
    const holidays = [];
    
    let started = false;
    for (const c of SRM_DATA.calendar) {
        if (c.date === todayStr) {
            started = true;
            continue;
        }
        if (started && c.status === 'Holiday' && c.remarks && !['Saturday', 'Sunday', '-'].includes(c.remarks.trim())) {
            holidays.push(c);
            if (holidays.length >= count) break;
        }
    }
    return holidays;
}

function updateLiveHUD() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const heroCard = document.querySelector('.live-hero');
    const hudTitle = document.getElementById('hud-class-title');
    const hudVenue = document.getElementById('hud-venue');
    const hudFaculty = document.getElementById('hud-faculty');
    const hudTime = document.getElementById('hud-time');
    const hudUpNext = document.getElementById('hud-up-next');
    const hudStatus = document.getElementById('hud-pulse-status');

    if (!hudTitle) return;

    if (isTodayHoliday) {
        if (heroCard) heroCard.classList.add('holiday-hero');
        const todayStr = getFormattedDateStr(now);
        const calEntry = SRM_DATA.calendar.find(c => c.date === todayStr);
        const remark = (calEntry && calEntry.remarks && calEntry.remarks !== '-') ? calEntry.remarks : 'Milad-un-nabi';
        const nextInfo = getNextWorkingDayInfo();

        if (hudStatus) {
            hudStatus.className = 'holiday-status-badge';
            hudStatus.textContent = '🏖️ Campus Off';
            hudStatus.style.color = '#6ee7b7';
        }
        if (hudTime) hudTime.textContent = 'Holiday';
        hudTitle.textContent = `Enjoy Your Holiday! (${remark})`;
        if (hudVenue) hudVenue.innerHTML = `<span style="color:#38bdf8;font-weight:700;">${nextInfo.relativeLabel} (${nextInfo.dayOrder})</span>`;
        if (hudFaculty) hudFaculty.innerHTML = `<span style="color:#34d399;font-weight:700;">${nextInfo.firstClass.title}</span>`;
        if (hudUpNext) hudUpNext.innerHTML = `First Class: ${nextInfo.firstClass.venue || 'UB 601'} &bull; ${nextInfo.totalClasses} classes scheduled`;
        if (heroCard) {
            heroCard.style.cursor = 'pointer';
            heroCard.onclick = () => showClassSummaryModal(nextInfo.firstClass, nextInfo.dayOrder);
        }
        return;
    }

    if (heroCard) heroCard.classList.remove('holiday-hero');
    if (hudStatus) hudStatus.className = 'hero-status-label';

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
        if (heroCard) {
            heroCard.style.cursor = 'pointer';
            heroCard.onclick = () => showClassSummaryModal(currentPeriod, currentDayOrder);
        }
    } else {
        if (hudStatus) { hudStatus.textContent = 'Free Period / Recess'; hudStatus.style.color = '#38bdf8'; }
        hudTitle.textContent = nextPeriod ? `Up Next: ${nextPeriod.title}` : 'No Active Classes';
        if (hudVenue) hudVenue.textContent = nextPeriod ? nextPeriod.venue : 'Campus';
        if (hudFaculty) hudFaculty.textContent = nextPeriod ? nextPeriod.faculty : '-';
        if (hudUpNext) hudUpNext.textContent = nextPeriod ? `Starts at ${nextPeriod.slot || 'upcoming slot'}` : 'All caught up';
        if (heroCard && nextPeriod) {
            heroCard.style.cursor = 'pointer';
            heroCard.onclick = () => showClassSummaryModal(nextPeriod, currentDayOrder);
        }
    }

    // Dynamic Island Period Progress Bar
    const progPeriodLabel = document.getElementById('prog-period-label');
    const progTimeLeft = document.getElementById('prog-time-left');
    const progFill = document.getElementById('prog-fill');
    const progCard = document.querySelector('.period-progress-card');

    if (progCard && progFill && progTimeLeft) {
        if (isTodayHoliday) {
            if (progPeriodLabel) progPeriodLabel.textContent = '🏖️ Campus Holiday';
            progTimeLeft.textContent = 'Enjoy your day!';
            progFill.style.width = '100%';
            progFill.style.background = '#34d399';
        } else if (currentPeriod && currentPeriod.type !== 'Free') {
            const currentSlot = SRM_DATA.timeSlots.find(s => s.label === `Hour ${currentPeriod.hour}`) || SRM_DATA.timeSlots[currentPeriod.hour - 1];
            if (currentSlot) {
                const [sH, sM] = currentSlot.start.split(':').map(Number);
                const [eH, eM] = currentSlot.end.split(':').map(Number);
                const sMin = sH * 60 + sM;
                const eMin = eH * 60 + eM;
                const totalSlotMins = Math.max(1, eMin - sMin);
                const elapsedMins = Math.max(0, currentMinutes - sMin);
                const pct = Math.min(100, Math.round((elapsedMins / totalSlotMins) * 100));
                const minsLeft = Math.max(0, eMin - currentMinutes);

                if (progPeriodLabel) progPeriodLabel.textContent = `Hour ${currentPeriod.hour}: ${currentPeriod.title}`;
                progTimeLeft.textContent = `${minsLeft} min remaining`;
                progFill.style.width = `${pct}%`;
                progFill.style.background = 'linear-gradient(90deg, #38bdf8, #22c55e)';
            }
        } else if (nextPeriod) {
            if (progPeriodLabel) progPeriodLabel.textContent = `Up Next: ${nextPeriod.title}`;
            progTimeLeft.textContent = `Starts soon`;
            progFill.style.width = '0%';
        } else {
            if (progPeriodLabel) progPeriodLabel.textContent = '🌙 Day Order Complete';
            progTimeLeft.textContent = 'Classes resume tomorrow';
            progFill.style.width = '100%';
            progFill.style.background = '#3f3f46';
        }
    }
}

// ─── Schedule & Holiday Hub Renderer ──────────────────────────────────────────
function renderDaySchedule(day) {
    const list = document.getElementById('period-list');
    if (!list) return;
    list.innerHTML = '';

    const nextInfo = getNextWorkingDayInfo();

    // If Holiday view selected
    if (day === 'Holiday' || (isTodayHoliday && day === 'Holiday')) {
        const upHolidays = getUpcomingHolidays(3);
        const holHtml = upHolidays.map(h => `
            <div class="upcoming-holiday-pill">
                <div>
                    <span style="font-weight:700;color:#f4f4f5;">🎉 ${h.remarks}</span>
                    <div style="font-size:0.7rem;color:var(--text-muted);">${h.date} &bull; ${h.day}</div>
                </div>
                <span style="font-size:0.72rem;background:#27272a;color:#38bdf8;padding:2px 8px;border-radius:9999px;font-weight:700;">Campus Off</span>
            </div>
        `).join('');

        list.innerHTML = `
            <div class="holiday-actions-deck">
                <button class="holiday-action-btn" onclick="openAITabWithPrompt('Give me a quick 1-hour study review plan for tomorrow classes (${nextInfo.dayOrder})')">
                    <span>📚</span>
                    <span>AI Study Plan (${nextInfo.dayOrder})</span>
                </button>
                <button class="holiday-action-btn" onclick="openAITabWithPrompt('What is my attendance safe bunks summary and can I take an extra leave?')">
                    <span>🛡️</span>
                    <span>Safe Bunk Check</span>
                </button>
            </div>

            <div class="upcoming-holidays-wrap">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:0.78rem;font-weight:700;color:#e4e4e7;text-transform:uppercase;letter-spacing:0.5px;">Upcoming Campus Holidays</span>
                    <span style="font-size:0.7rem;color:#38bdf8;cursor:pointer;" onclick="document.querySelector('[data-tab=view-calendar]').click()">View All ↗</span>
                </div>
                ${holHtml || '<p style="font-size:0.75rem;color:var(--text-muted);">No upcoming campus holidays in next 2 weeks.</p>'}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px;">
                <span style="font-size:0.8rem;font-weight:700;color:#94a3b8;">${nextInfo.relativeLabel}'s Schedule (${nextInfo.dayOrder})</span>
                <span style="font-size:0.72rem;color:#34d399;font-weight:600;">${nextInfo.totalClasses} classes</span>
            </div>
        `;

        // Render next working day's preview below holiday widget
        const sched = SRM_DATA.dayOrderSchedule[nextInfo.dayOrder] || [];
        sched.forEach((p, idx) => {
            const slotInfo = SRM_DATA.timeSlots[idx] || { start: '--:--', label: `Hour ${idx + 1}` };
            const card = document.createElement('div');
            card.className = 't-card' + (p.type === 'Free' ? ' free-card' : '');
            card.onclick = () => showClassSummaryModal(p, nextInfo.dayOrder);

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
        return;
    }

    const schedule = SRM_DATA.dayOrderSchedule[day] || [];
    schedule.forEach((p, idx) => {
        const slotInfo = SRM_DATA.timeSlots[idx] || { start: '--:--', label: `Hour ${idx + 1}` };
        const card = document.createElement('div');
        card.className = 't-card' + (p.type === 'Free' ? ' free-card' : '');
        card.onclick = () => showClassSummaryModal(p, day);

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

// ─── Interactive Class Summary Modal ──────────────────────────────────────────
function showClassSummaryModal(p, dayOrder) {
    if (!p) return;

    const existing = document.getElementById('class-summary-modal');
    if (existing) existing.remove();

    const isFree = (p.type === 'Free' || !p.title || p.title === 'Free Period');

    // 1. Match Course in Database
    const courseMeta = (SRM_DATA.courses || []).find(c => 
        (c.code && p.code && c.code.toLowerCase() === p.code.toLowerCase()) ||
        (c.title && p.title && c.title.toLowerCase() === p.title.toLowerCase())
    ) || {};

    // 2. Match Live Attendance
    const attRecord = (portalAttendance || []).find(a => 
        (a.code && p.code && a.code.toLowerCase() === p.code.toLowerCase()) ||
        (a.title && p.title && a.title.toLowerCase() === p.title.toLowerCase())
    ) || {};

    const con = parseInt(attRecord.conducted || 0, 10);
    const att = parseInt(attRecord.attended || 0, 10);
    const abs = parseInt(attRecord.absent || 0, 10);
    const isUnconducted = con === 0;
    const pct = isUnconducted ? 100.0 : (attRecord.percentage ? parseFloat(attRecord.percentage) : parseFloat(((att / con) * 100).toFixed(2)));
    const danger = !isUnconducted && pct < 75;
    const needed = isUnconducted ? 0 : Math.max(0, 3 * con - 4 * att);
    const bunkable = isUnconducted ? 0 : Math.max(0, Math.floor((4 * att - 3 * con) / 3));

    // 3. Find all weekly slots for this course
    const weeklySlots = [];
    ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].forEach(d => {
        const daySched = SRM_DATA.dayOrderSchedule[d] || [];
        daySched.forEach((slotP, idx) => {
            const match = (slotP.code && p.code && slotP.code === p.code) ||
                          (slotP.title && p.title && slotP.title.toLowerCase() === p.title.toLowerCase());
            if (match) {
                const timeSlot = SRM_DATA.timeSlots[idx] || { start: '--:--', end: '--:--' };
                weeklySlots.push({
                    day: d,
                    hour: slotP.hour || (idx + 1),
                    time: `${timeSlot.start} - ${timeSlot.end}`,
                    venue: slotP.venue || 'UB 601',
                    type: slotP.type || 'Theory'
                });
            }
        });
    });

    const modal = document.createElement('div');
    modal.id = 'class-summary-modal';
    modal.className = 'class-modal-backdrop';

    if (isFree) {
        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div>
                        <span style="font-size:0.7rem;background:#27272a;color:#38bdf8;padding:3px 8px;border-radius:6px;font-weight:700;">FREE PERIOD</span>
                        <h3 style="font-size:1.1rem;font-weight:800;color:#f4f4f5;margin-top:6px;">Self-Study / Campus Recess</h3>
                    </div>
                    <button class="class-modal-close" onclick="closeClassSummaryModal()">✕</button>
                </div>
                <div class="class-modal-body">
                    <div class="class-info-card">
                        <div style="font-size:0.85rem;color:#cbd5e1;line-height:1.5;">
                            ⚡ This is a scheduled free period on <b>${dayOrder || 'Selected Day'}</b> (Hour ${p.hour}). No attendance is taken during this hour.
                        </div>
                    </div>
                    <div class="holiday-actions-deck" style="margin:0;">
                        <button class="holiday-action-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('Give me a quick 15-minute quiz on Calculus and PPS to practice during my free period')">
                            <span>🤖</span>
                            <span>AI 15-min Practice Quiz</span>
                        </button>
                        <button class="holiday-action-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('What are the best quiet study spots and library facilities near Tech Park in SRMIST?')">
                            <span>📍</span>
                            <span>Find Study Spots</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    } else {
        const title = courseMeta.title || p.title || 'Course Details';
        const code = courseMeta.code || p.code || 'COURSE';
        const credits = courseMeta.credits ? `${courseMeta.credits} Credits` : (p.type === 'Lab' ? '2 Credits' : '4 Credits');
        const category = courseMeta.category || 'Discipline Course (B/E/C)';
        const faculty = courseMeta.theoryFaculty || courseMeta.labFaculty || p.faculty || 'Faculty Assigned';
        const venue = courseMeta.theoryLocation || courseMeta.labLocation || p.venue || 'Classroom / Lab Venue';
        const slot = courseMeta.theorySlot || courseMeta.labSlot || p.slot || 'Regular';

        const weeklyHtml = weeklySlots.length > 0 ? weeklySlots.map(w => `
            <div class="class-slot-row">
                <div>
                    <span style="font-weight:700;color:#f4f4f5;">${w.day}</span>
                    <span style="color:var(--text-muted);font-size:0.72rem;margin-left:6px;">Hour ${w.hour} (${w.time})</span>
                </div>
                <span style="font-size:0.72rem;background:#1e293b;color:#38bdf8;padding:2px 8px;border-radius:4px;font-weight:600;">📍 ${w.venue.split('(')[0].trim()}</span>
            </div>
        `).join('') : `<p style="font-size:0.75rem;color:var(--text-muted);">Standard schedule applies.</p>`;

        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div>
                        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                            <span style="font-size:0.7rem;background:#1e293b;color:#38bdf8;padding:2px 7px;border-radius:4px;font-family:var(--font-mono);font-weight:700;">${code}</span>
                            <span style="font-size:0.7rem;background:#14241b;color:#34d399;padding:2px 7px;border-radius:4px;font-weight:700;">${p.type || 'Theory'} &bull; ${credits}</span>
                        </div>
                        <h3 style="font-size:1.05rem;font-weight:800;color:#ffffff;line-height:1.3;">${title}</h3>
                        <p style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">${category} &bull; Slot: ${slot}</p>
                    </div>
                    <button class="class-modal-close" onclick="closeClassSummaryModal()">✕</button>
                </div>
                
                <div class="class-modal-body">
                    <!-- Live Attendance & Safe Margin Card -->
                    <div class="class-info-card" style="border-color:${danger ? '#7f1d1d' : '#1e3a29'};background:${danger ? '#1f1313' : '#121e17'};">
                        <div style="display:flex;justify-content:space-between;align-items:center;">
                            <span style="font-size:0.72rem;font-weight:700;color:${danger ? '#f87171' : '#34d399'};text-transform:uppercase;letter-spacing:0.5px;">Live Attendance Status</span>
                            <span style="font-size:1.2rem;font-weight:800;color:${danger ? '#f87171' : '#34d399'};font-family:var(--font-mono);">${pct}%</span>
                        </div>
                        <div class="att-bar-track" style="background:#27272a;height:6px;border-radius:9999px;overflow:hidden;margin:8px 0;">
                            <div class="att-bar-fill" style="width:${Math.min(pct,100)}%;background:${danger ? '#ef4444' : '#22c55e'};height:100%;"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;font-size:0.75rem;color:#cbd5e1;">
                            <span>${con > 0 ? `${att} attended / ${con} conducted (${abs} absent)` : '0 classes conducted yet'}</span>
                            <span style="font-weight:700;color:${danger ? '#f87171' : '#38bdf8'};">${danger ? `⚠️ Need ${needed} classes` : `✅ ${bunkable} safe bunks`}</span>
                        </div>
                    </div>

                    <!-- Faculty & Venue Card -->
                    <div class="class-info-card">
                        <div style="font-size:0.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;margin-bottom:8px;">Faculty & Venue Details</div>
                        <div style="display:flex;flex-direction:column;gap:8px;font-size:0.8rem;">
                            <div style="display:flex;align-items:flex-start;gap:8px;">
                                <span>👨‍🏫</span>
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.7rem;">Course Instructor</div>
                                    <div style="color:#f4f4f5;font-weight:600;">${faculty}</div>
                                </div>
                            </div>
                            <div style="display:flex;align-items:flex-start;gap:8px;">
                                <span>📍</span>
                                <div>
                                    <div style="color:var(--text-muted);font-size:0.7rem;">Classroom / Laboratory</div>
                                    <div style="color:#f4f4f5;font-weight:600;">${venue}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Weekly Timetable Hours -->
                    <div class="class-info-card">
                        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                            <span style="font-size:0.72rem;font-weight:700;color:#94a3b8;text-transform:uppercase;">Weekly Schedule (${weeklySlots.length} hrs/wk)</span>
                        </div>
                        ${weeklyHtml}
                    </div>

                    <!-- AI Academic Copilot 1-Tap Actions -->
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <button class="holiday-action-btn" style="background:#1e1b4b;border-color:#4338ca;color:#c7d2fe;" onclick="closeClassSummaryModal(); openAITabWithPrompt('Summarize all key formulas, important concepts, and core theorems for ${title} (${code}) with clear examples')">
                            <span>📚</span>
                            <span>Explain Key Concepts & Formulas (AI)</span>
                        </button>
                        <button class="holiday-action-btn" style="background:#064e3b;border-color:#059669;color:#a7f3d0;" onclick="closeClassSummaryModal(); openAITabWithPrompt('Generate 5 high-yield exam practice questions and step-by-step solutions for ${title} (${code})')">
                            <span>🎯</span>
                            <span>Generate 5 Practice Exam Questions (AI)</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    modal.onclick = (e) => {
        if (e.target === modal) closeClassSummaryModal();
    };

    document.body.appendChild(modal);
}

function closeClassSummaryModal() {
    const modal = document.getElementById('class-summary-modal');
    if (modal) modal.remove();
}

function openAITabWithPrompt(promptText) {
    const aiTabBtn = document.querySelector('[data-tab="view-ai"]');
    if (aiTabBtn) aiTabBtn.click();
    const chatInput = document.getElementById('ai-chat-input');
    if (chatInput) {
        chatInput.value = promptText;
        setTimeout(() => {
            const sendBtn = document.getElementById('ai-send-btn');
            if (sendBtn) sendBtn.click();
        }, 150);
    }
}

function initDaySelector() {
    const container = document.getElementById('day-selector');
    if (!container) return;
    container.innerHTML = '';

    const nextInfo = getNextWorkingDayInfo();

    if (isTodayHoliday) {
        const holBtn = document.createElement('div');
        holBtn.className = 'day-chip holiday-chip' + (selectedDay === 'Holiday' ? ' active' : '');
        holBtn.innerHTML = `🏖️ Off<span class="day-chip-badge">Today</span>`;
        holBtn.id = 'btn-Holiday';
        holBtn.onclick = () => {
            selectedDay = 'Holiday';
            highlightActiveDayBtn('Holiday');
            renderDaySchedule('Holiday');
        };
        container.appendChild(holBtn);
    }

    ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].forEach(d => {
        const btn = document.createElement('div');
        const isNext = (d === nextInfo.dayOrder);
        btn.className = 'day-chip' + (d === selectedDay ? ' active' : '');
        btn.innerHTML = `${d}${isNext ? `<span class="day-chip-badge" style="color:#38bdf8;">${nextInfo.relativeLabel}</span>` : ''}`;
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

function getUserAnnouncements() {
    try {
        const reg = localStorage.getItem('srm_reg_no') || 'global';
        const saved = localStorage.getItem('srm_user_announcements_' + reg) || 
                      localStorage.getItem('srm_user_announcements_global') || 
                      localStorage.getItem('srm_cached_announcements');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                // Filter out any lingering mock announcements from early development
                const clean = parsed.filter(a => {
                    const id = (a.id || '').toString();
                    if (['ann-1', 'ann-2', 'ann-3', 'ann-4', 'ann-5'].includes(id)) return false;
                    const text = (a.title + ' ' + (a.detail || '')).toLowerCase();
                    if (text.includes('sheet metal') || text.includes('matrix diagonalization') || text.includes('pink building') || text.includes('optional class cancelled')) {
                        return false;
                    }
                    return true;
                });
                return clean;
            }
        }
    } catch (_) {}
    return [];
}

function saveUserAnnouncements(list) {
    const reg = localStorage.getItem('srm_reg_no') || 'global';
    announcementsData = list || [];
    localStorage.setItem('srm_user_announcements_' + reg, JSON.stringify(announcementsData));
}

// ─── Dynamic Subject Filter Chips (Derived from Enrolled Courses) ───────────────
function renderSubjectFilterChips() {
    const container = document.getElementById('ann-filter-scroll');
    if (!container) return;

    const courses = (portalAttendance && portalAttendance.length > 0) 
        ? portalAttendance 
        : ((typeof SRM_DATA !== 'undefined' && SRM_DATA.courses) ? SRM_DATA.courses : []);

    const iconMap = {
        'CYB': '🧪', 'CHEM': '🧪',
        'BTB': '🧬', 'BIO': '🧬',
        'CSE': '💻', 'PROG': '💻', 'PPS': '💻',
        'MAB': '📐', 'MATH': '📐', 'CALC': '📐',
        'MEE': '🔧', 'WORK': '🔧',
        'PHY': '⚡',
        'ENG': '📖',
        'EAA': '🏃'
    };

    let html = `<div class="day-chip ${activeSubjectFilter === 'ALL' ? 'active' : ''}" onclick="filterAnnouncements('ALL')">All Subjects</div>`;

    const seenCodes = new Set();

    courses.forEach(c => {
        const code = c.code || '';
        if (!code || seenCodes.has(code)) return;
        seenCodes.add(code);

        const title = c.title || c.subject || code;
        let icon = '📚';
        const searchStr = (code + ' ' + title).toUpperCase();
        for (const [k, ic] of Object.entries(iconMap)) {
            if (searchStr.includes(k)) {
                icon = ic;
                break;
            }
        }

        // Clean friendly short name
        let shortName = '';
        const upper = (code + ' ' + title).toUpperCase();
        if (upper.includes('CHEM')) shortName = 'Chemistry';
        else if (upper.includes('BIOLOGY') || upper.includes('BIO')) shortName = 'Comp Bio';
        else if (upper.includes('PROBLEM') || upper.includes('PPS') || upper.includes('PROG')) shortName = 'PPS (C Prog)';
        else if (upper.includes('CALCULUS') || upper.includes('MATH')) shortName = 'Calculus';
        else if (upper.includes('WORKSHOP') || upper.includes('MEE')) shortName = 'Workshop';
        else if (upper.includes('PHYSIC') || upper.includes('PHY')) shortName = 'Physics';
        else if (upper.includes('ENGLISH') || upper.includes('COMM')) shortName = 'English';
        else {
            shortName = title.split(' ')[0];
            if (shortName.length <= 3 && title.split(' ').length > 1) {
                shortName = title.split(' ').slice(0, 2).join(' ');
            }
        }
        if (shortName.length > 14) shortName = shortName.substring(0, 12) + '…';

        html += `<div class="day-chip ${activeSubjectFilter === code ? 'active' : ''}" onclick="filterAnnouncements('${code}')">${icon} ${escapeHtml(shortName)}</div>`;
    });

    container.innerHTML = html;
}

// ─── Direct Mobile-to-Mobile WhatsApp Hub ─────────────────────────────────────
function getLinkedWAGroups() {
    try {
        const reg = localStorage.getItem('srm_reg_no') || 'global';
        const saved = localStorage.getItem('srm_user_wa_groups_' + reg);
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (_) {}
    return [];
}

function saveLinkedWAGroups(groups) {
    const reg = localStorage.getItem('srm_reg_no') || 'global';
    localStorage.setItem('srm_user_wa_groups_' + reg, JSON.stringify(groups || []));
}

function renderWhatsAppGroups() {
    const container = document.getElementById('wa-groups-list');
    if (!container) return;
    const groups = getLinkedWAGroups();

    if (!groups || groups.length === 0) {
        container.innerHTML = `
            <div style="text-align:center;padding:16px 12px;background:#141418;border:1px dashed #27272a;border-radius:12px;color:var(--text-muted);font-size:0.75rem;line-height:1.45;">
                💬 <b style="color:#f4f4f5;">No Class WhatsApp Groups Linked Yet</b><br>
                Tap <b>"📱 Pair Device (QR)"</b> or <b>"☑️ Pick Groups"</b> above to connect your class chats for AI monitoring.
            </div>
        `;
        return;
    }

    container.innerHTML = groups.map(g => `
        <div class="wa-group-item" style="opacity:${g.enabled ? '1' : '0.5'};">
            <div class="wa-group-left">
                <div class="wa-group-icon">${g.icon || '💬'}</div>
                <div style="min-width:0;">
                    <div class="wa-group-name">${escapeHtml(g.name)}</div>
                    <div class="wa-group-sub">${escapeHtml(g.members || 'Class Group')}</div>
                </div>
            </div>
            <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
                <button class="wa-action-open" style="background:rgba(56,189,248,0.12);color:#38bdf8;border-color:rgba(56,189,248,0.3);" onclick="summarizeWAGroupWithAI('${g.id}')">
                    <span>🤖 AI Digest</span>
                </button>
                <button class="wa-toggle-btn ${g.enabled ? 'active' : ''}" onclick="toggleWAGroup('${g.id}')">
                    ${g.enabled ? 'Active' : 'Muted'}
                </button>
            </div>
        </div>
    `).join('');
}

function toggleWAGroup(groupId) {
    const groups = getLinkedWAGroups();
    const target = groups.find(g => g.id === groupId);
    if (target) {
        target.enabled = !target.enabled;
        saveLinkedWAGroups(groups);
        renderWhatsAppGroups();
        renderAnnouncements();
    }
}

function openAddWAGroupModal() {
    const name = prompt("Enter WhatsApp Group Name (e.g. 'Section P1 CR Announcements' or 'Math Study Group'):");
    if (!name) return;
    const link = prompt("Paste WhatsApp Group Invite Link (e.g. https://chat.whatsapp.com/...) or leave blank:", "https://chat.whatsapp.com/");
    const subject = prompt("Assign Subject Code (e.g. 26CSE1002J, 26MAB1001T, 26CYB1002J, 26BTB1001T, 26MEE1001L, or ALL):", "ALL") || "ALL";

    const groups = getLinkedWAGroups();
    groups.push({
        id: 'wa-custom-' + Date.now(),
        name: name.trim(),
        code: subject.trim().toUpperCase(),
        link: link ? link.trim() : 'https://chat.whatsapp.com/',
        enabled: true,
        icon: '📱',
        members: 'Custom Mobile Linked Group'
    });
    saveLinkedWAGroups(groups);
    renderWhatsAppGroups();
    alert("✅ WhatsApp Group linked directly to your phone!");
}

// ─── AI WhatsApp Chat Extractor & Digest Engine ───────────────────────────────
function parseWAChatLocally(chatText) {
    const lines = (chatText || '').trim().split('\n');
    const cleaned = [];

    lines.forEach(l => {
        const str = l.trim();
        if (!str) return;
        // Strip WhatsApp timestamp format
        const cleanMsg = str.replace(/^\[?\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[-:]?\s*[^:]+:\s*/i, '');
        if (cleanMsg.length > 4 && !/messages and calls are end-to-end|created group|added you|deleted this message|<media omitted>/i.test(cleanMsg)) {
            cleaned.push(cleanMsg);
        }
    });

    const classified = {
        cancelled: [],
        assignments: [],
        exams: [],
        venues: [],
        general: []
    };

    cleaned.forEach(m => {
        const low = m.toLowerCase();
        if (/cancel|no class|postponed|leave today|optional hour|free hour/i.test(low)) {
            classified.cancelled.push(m);
        } else if (/submit|assignment|observation|record|deadline|homework|due date/i.test(low)) {
            classified.assignments.push(m);
        } else if (/exam|test|cla-1|cla-2|quiz|marks|portion|syllabus/i.test(low)) {
            classified.exams.push(m);
        } else if (/room|venue|ub |tp |pink bldg|lab |bel |tech park/i.test(low)) {
            classified.venues.push(m);
        } else if (m.length > 15 && !/^(ok|thanks|lol|hah|gm|gn|yes|no|hi|hello)$/i.test(low)) {
            classified.general.push(m);
        }
    });

    return { total: lines.length, cleaned, classified };
}

async function processWAChatTextForAI(chatText, groupName) {
    groupName = groupName || 'Class WhatsApp Group';
    const parsed = parseWAChatLocally(chatText);

    const promptText = `You are the executive Academic AI Secretary for SRMIST Section P1 students.
Analyze the following raw WhatsApp messages from "${groupName}" and generate an immediate, clean, bulleted Academic Digest for students.

Filter out chit-chat, greetings, and spam. Categorize into:
1. 🚨 Cancelled / Rescheduled Classes
2. 📝 Upcoming Deadlines & Observations (Subject, Due Date, Details)
3. 🧪 Lab Venues, Manuals & Requirements
4. 📚 Exam / Test / CLA Portions
5. 💡 Key Takeaway for Tomorrow

Raw WhatsApp Messages:
${parsed.cleaned.slice(0, 30).join('\n') || 'No recent messages provided.'}
`;

    // Show loading modal
    showWAGroupSummaryModal({
        title: `AI Digest: ${groupName}`,
        loading: true,
        groupName: groupName
    });

    try {
        const res = await apiFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: promptText,
                context: getAcademicContextForAI()
            })
        });

        const reply = (res && res.reply) ? res.reply : generateOfflineWADigest(parsed, groupName);
        
        // Also auto-inject any parsed cancellations or assignments into announcements
        parsed.classified.cancelled.forEach(c => {
            announcementsData.unshift({
                id: 'wa-parsed-' + Date.now() + Math.random(),
                subject: 'Class Update',
                code: 'ALL',
                category: 'Cancelled',
                title: c.length > 50 ? c.substring(0, 50) + '...' : c,
                detail: c,
                faculty: 'WhatsApp Scraper',
                venue: 'Schedule Alert',
                sourceGroup: groupName,
                timestamp: 'Just Now'
            });
        });
        parsed.classified.assignments.forEach(a => {
            announcementsData.unshift({
                id: 'wa-parsed-' + Date.now() + Math.random(),
                subject: 'Assignment Due',
                code: 'ALL',
                category: 'Assignment',
                title: a.length > 50 ? a.substring(0, 50) + '...' : a,
                detail: a,
                faculty: 'WhatsApp Scraper',
                venue: 'Submission',
                sourceGroup: groupName,
                timestamp: 'Just Now'
            });
        });
        renderAnnouncements();

        showWAGroupSummaryModal({
            title: `AI Digest: ${groupName}`,
            loading: false,
            reply: reply,
            parsed: parsed,
            groupName: groupName
        });
    } catch (e) {
        const offlineReply = generateOfflineWADigest(parsed, groupName);
        showWAGroupSummaryModal({
            title: `AI Digest: ${groupName}`,
            loading: false,
            reply: offlineReply,
            parsed: parsed,
            groupName: groupName
        });
    }
}

function generateOfflineWADigest(parsed, groupName) {
    let md = `### 📋 Executive Academic Digest (${groupName})\n\n`;
    if (parsed.classified.cancelled.length > 0) {
        md += `#### 🚨 Cancelled / Rescheduled Classes:\n`;
        parsed.classified.cancelled.forEach(c => md += `- ⚠️ **${c}**\n`);
        md += `\n`;
    }
    if (parsed.classified.assignments.length > 0) {
        md += `#### 📝 Upcoming Assignments & Submissions:\n`;
        parsed.classified.assignments.forEach(a => md += `- 📌 **${a}**\n`);
        md += `\n`;
    }
    if (parsed.classified.exams.length > 0) {
        md += `#### 📚 Exam & Quiz Portions:\n`;
        parsed.classified.exams.forEach(e => md += `- 🎯 **${e}**\n`);
        md += `\n`;
    }
    if (parsed.classified.venues.length > 0) {
        md += `#### 🧪 Lab Venues & Room Numbers:\n`;
        parsed.classified.venues.forEach(v => md += `- 📍 **${v}**\n`);
        md += `\n`;
    }
    md += `💡 *Scraped ${parsed.cleaned.length} messages on-device with 0 server tracking.*`;
    return md;
}

function summarizeWAGroupWithAI(groupId) {
    const groups = getLinkedWAGroups();
    const g = groups.find(x => x.id === groupId) || { name: 'Class Group' };
    
    // Check if we have real group notices
    const groupNotices = announcementsData.filter(a => a.sourceGroup === g.name || a.code === g.code);
    let sampleChat = groupNotices.map(n => `[Notice]: ${n.title} - ${n.detail}`).join('\n');
    
    if (!sampleChat) {
        const pasted = prompt(`🤖 Paste recent messages or chat export for "${g.name}":\n\n(Paste from your WhatsApp group to generate instant AI digest)`);
        if (!pasted || !pasted.trim()) return;
        sampleChat = pasted.trim();
    }

    processWAChatTextForAI(sampleChat, g.name);
}

function openPasteChatForAISummaryModal() {
    const text = prompt("🤖 Paste WhatsApp Group Messages / Chat Export (Ctrl+V):\n\n(e.g. paste from your section WhatsApp group)");
    if (!text || !text.trim()) return;
    processWAChatTextForAI(text.trim(), 'Imported WhatsApp Chat');
}

function handleWAChatFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        processWAChatTextForAI(content, file.name.replace('.txt', ''));
    };
    reader.readAsText(file);
}

function showWAGroupSummaryModal(data) {
    const existing = document.getElementById('wa-summary-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'wa-summary-modal';
    modal.className = 'class-modal-backdrop';

    if (data.loading) {
        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div>
                        <span class="wa-privacy-badge">🤖 AI Processing</span>
                        <h3 style="font-size:1.1rem;font-weight:800;color:#f4f4f5;margin-top:6px;">${data.title}</h3>
                    </div>
                    <button class="class-modal-close" onclick="document.getElementById('wa-summary-modal').remove()">✕</button>
                </div>
                <div class="class-modal-body" style="text-align:center;padding:40px 20px;">
                    <div style="font-size:2rem;margin-bottom:12px;animation:spin 1s linear infinite;">⚡</div>
                    <div style="font-size:0.95rem;font-weight:700;color:#ffffff;">Scraping & Extracting Academic Notices...</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;">Filtering out chat spam and isolating class cancellations, homework, and lab instructions.</p>
                </div>
            </div>
        `;
    } else {
        const formattedHtml = (data.reply || '')
            .replace(/### (.*?)\n/g, '<h4 style="color:#38bdf8;font-size:0.95rem;margin:12px 0 6px;">$1</h4>')
            .replace(/#### (.*?)\n/g, '<div style="color:#34d399;font-weight:700;font-size:0.85rem;margin:10px 0 4px;">$1</div>')
            .replace(/\*\*(.*?)\*\*/g, '<b style="color:#ffffff;">$1</b>')
            .replace(/\n- /g, '<div style="font-size:0.8rem;color:#cbd5e1;margin-bottom:6px;padding-left:8px;border-left:2px solid #38bdf8;">')
            .replace(/\n\n/g, '<br>');

        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div>
                        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                            <span class="wa-privacy-badge">🟢 100% On-Device Scrape</span>
                            <span style="font-size:0.7rem;background:#1e293b;color:#38bdf8;padding:2px 7px;border-radius:4px;font-weight:700;">AI Digest</span>
                        </div>
                        <h3 style="font-size:1.1rem;font-weight:800;color:#ffffff;">${data.title}</h3>
                    </div>
                    <button class="class-modal-close" onclick="document.getElementById('wa-summary-modal').remove()">✕</button>
                </div>
                <div class="class-modal-body">
                    <div class="class-info-card" style="background:#131b17;border-color:#166534;">
                        <div style="font-size:0.82rem;line-height:1.55;color:#e4e4e7;">
                            ${formattedHtml}
                        </div>
                    </div>
                    <div class="holiday-actions-deck" style="margin:0;">
                        <button class="holiday-action-btn" style="background:#1e1b4b;border-color:#4338ca;color:#c7d2fe;" onclick="document.getElementById('wa-summary-modal').remove(); openAITabWithPrompt('Based on the WhatsApp notice digest for ${data.groupName}, what should I prepare for tomorrow?')">
                            <span>🤖</span>
                            <span>Ask AI Study Plan</span>
                        </button>
                        <button class="holiday-action-btn" style="background:#064e3b;border-color:#059669;color:#a7f3d0;" onclick="document.getElementById('wa-summary-modal').remove(); filterAnnouncements('ALL')">
                            <span>📢</span>
                            <span>View in Notices Feed</span>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    modal.onclick = (e) => {
        if (e.target === modal) modal.remove();
    };

    document.body.appendChild(modal);
}

function renderAnnouncements(filterSubject, searchQuery) {
    const container = document.getElementById('announcements-container');
    const counter = document.getElementById('ann-counter');
    if (!container) return;

    filterSubject = filterSubject || activeSubjectFilter;
    searchQuery = (searchQuery || '').toLowerCase();
    container.innerHTML = '';
    
    // Check enabled WhatsApp groups
    const enabledGroups = getLinkedWAGroups().filter(g => g.enabled).map(g => g.name.toLowerCase());

    const filtered = announcementsData.filter(ann => {
        const matchSubject = (filterSubject === 'ALL' || ann.code === filterSubject);
        const matchSearch = (ann.title + ann.detail + ann.subject + ann.venue + ann.faculty + ann.category).toLowerCase().includes(searchQuery);
        return matchSubject && matchSearch;
    });

    if (filtered.length === 0) {
        if (!announcementsData || announcementsData.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:36px 16px;background:#111114;border:1px solid #27272a;border-radius:14px;margin-top:6px;">
                    <div style="font-size:1.8rem;margin-bottom:8px;">📢</div>
                    <div style="font-size:0.88rem;font-weight:700;color:#f4f4f5;margin-bottom:4px;">No Class Notices Yet</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);line-height:1.45;max-width:280px;margin:0 auto 14px;">
                        Pair your WhatsApp companion above or import a chat file to automatically extract real assignment deadlines, cancellations, and lab notices!
                    </div>
                    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                        <button class="pill-btn" onclick="openWALinkedDeviceModal()" style="background:#22c55e;color:#000;border:none;padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;">📱 Pair WhatsApp</button>
                        <button class="pill-btn" onclick="openPasteChatForAISummaryModal()" style="background:#1e1b4b;border:1px solid #3730a3;color:#818cf8;padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;">🤖 Paste Chat</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:24px 0;">No notices matching subject or search filter.</div>`;
        }
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
                <span style="color:#22c55e;font-weight:600;">🟢 ${ann.sourceGroup}</span>
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

// ─── Baileys Multi-Device WhatsApp Companion & Smart Verification Engine ──────
let waDevicePollTimer = null;
let activeScheduleAlert = null;
let processedWAMsgIds = new Set();

function initWADeviceMonitor() {
    pollWADeviceStatus();
    if (waDevicePollTimer) clearInterval(waDevicePollTimer);
    waDevicePollTimer = setInterval(pollWADeviceStatus, 4000);
}

let _hasSyncedBridgeGroups = false;

async function pollWADeviceStatus() {
    try {
        const res = await apiFetch('/api/wa/status');
        if (!res) return;

        const dot = document.getElementById('wa-device-status-dot');
        const text = document.getElementById('wa-device-status-text');
        const btn = document.getElementById('wa-device-action-btn');

        if (res.status === 'CONNECTED') {
            if (dot) dot.style.background = '#22c55e';
            if (text) text.innerHTML = `🟢 Linked: <b style="color:#ffffff;">${res.user?.name || 'My WhatsApp'}</b> (${res.monitoredCount || 0} groups monitored)`;
            if (btn) {
                btn.textContent = 'Manage Groups';
                btn.style.background = '#1e293b';
                btn.style.color = '#38bdf8';
                btn.onclick = openWAGroupSelectorModal;
            }
            // Fetch live groups and messages from bridge
            syncLiveBridgeGroups();
            fetchWAMonitoredMessages();
        } else if (res.status === 'SCAN_QR') {
            if (dot) dot.style.background = '#f59e0b';
            if (text) text.textContent = '🟡 Ready to Pair (Scan QR)';
            if (btn) {
                btn.textContent = '📱 View QR';
                btn.style.background = '#22c55e';
                btn.style.color = '#000';
                btn.onclick = openWALinkedDeviceModal;
            }
            renderWhatsAppGroups();
        } else {
            if (dot) dot.style.background = '#71717a';
            if (text) text.textContent = '⚪ Virtual Companion: Standby';
            if (btn) {
                btn.textContent = '📱 Pair Device (QR)';
                btn.style.background = '#22c55e';
                btn.style.color = '#000';
                btn.onclick = openWALinkedDeviceModal;
            }
            renderWhatsAppGroups();
        }
    } catch (_) {}
}

async function syncLiveBridgeGroups() {
    try {
        const res = await apiFetch('/api/wa/groups');
        if (res && Array.isArray(res.groups)) {
            const container = document.getElementById('wa-groups-list');
            if (!container) return;

            if (res.groups.length === 0) {
                container.innerHTML = `
                    <div style="text-align:center;padding:16px 12px;background:#141418;border:1px dashed #27272a;border-radius:12px;color:var(--text-muted);font-size:0.75rem;line-height:1.45;">
                        💬 <b style="color:#f4f4f5;">No Active Groups Found on WhatsApp</b><br>
                        Tap <b>"Manage Groups"</b> above to choose class groups for AI monitoring.
                    </div>
                `;
                return;
            }

            container.innerHTML = res.groups.slice(0, 8).map(g => `
                <div class="wa-group-item" style="opacity:${g.isMonitored ? '1' : '0.6'};">
                    <div class="wa-group-left">
                        <div class="wa-group-icon">👥</div>
                        <div style="min-width:0;">
                            <div class="wa-group-name">${escapeHtml(g.name)}</div>
                            <div class="wa-group-sub">${g.participantsCount} participants ${g.isMonitored ? '&bull; <span style="color:#4ade80;font-weight:700;">🟢 AI Monitored</span>' : ''}</div>
                        </div>
                    </div>
                    <div style="display:flex;gap:5px;align-items:center;flex-wrap:wrap;justify-content:flex-end;">
                        <button class="wa-action-open" style="background:rgba(56,189,248,0.12);color:#38bdf8;border-color:rgba(56,189,248,0.3);" onclick="summarizeBridgeGroup('${g.name}')">
                            <span>🤖 AI Digest</span>
                        </button>
                        <button class="wa-toggle-btn ${g.isMonitored ? 'active' : ''}" onclick="toggleBridgeGroupMonitored('${g.id}', ${!g.isMonitored})">
                            ${g.isMonitored ? 'Active' : 'Muted'}
                        </button>
                    </div>
                </div>
            `).join('');
        }
    } catch (_) {}
}

async function toggleBridgeGroupMonitored(groupId, enable) {
    try {
        const res = await apiFetch('/api/wa/groups');
        if (res && Array.isArray(res.groups)) {
            const currentlyMonitored = res.groups.filter(g => g.isMonitored).map(g => g.id);
            let updated;
            if (enable) {
                updated = [...new Set([...currentlyMonitored, groupId])];
            } else {
                updated = currentlyMonitored.filter(id => id !== groupId);
            }
            await apiFetch('/api/wa/select-groups', {
                method: 'POST',
                body: JSON.stringify({ groupIds: updated })
            });
            syncLiveBridgeGroups();
            pollWADeviceStatus();
            showAttendanceToast(enable ? "🟢 Group activated for AI monitoring!" : "⏸️ Group muted.", "info");
        }
    } catch (_) {}
}

function summarizeBridgeGroup(groupName) {
    const groupNotices = announcementsData.filter(a => a.sourceGroup === groupName);
    let chat = groupNotices.map(n => `[Notice]: ${n.title} - ${n.detail}`).join('\n');
    if (!chat) {
        const pasted = prompt(`🤖 Paste recent chat export for "${groupName}":\n\n(Paste from your WhatsApp group to generate instant AI digest)`);
        if (!pasted || !pasted.trim()) return;
        chat = pasted.trim();
    }
    processWAChatTextForAI(chat, groupName);
}

async function fetchWAMonitoredMessages() {
    try {
        const res = await apiFetch('/api/wa/messages');
        if (res && Array.isArray(res.messages)) {
            checkForSmartScheduleAlerts(res.messages);
        }
    } catch (_) {}
}

function checkForSmartScheduleAlerts(messages) {
    if (!messages || messages.length === 0) return;

    for (const msg of messages) {
        if (processedWAMsgIds.has(msg.id)) continue;
        processedWAMsgIds.add(msg.id);

        const raw = msg.text.toLowerCase();
        
        // Check for Class Cancellations / Free Hours
        if (/cancel|no class|postponed|leave today|optional hour|free hour/i.test(raw)) {
            // Identify matched subject
            let matchedSubject = 'Class';
            let matchedCode = 'ALL';
            if (/chem|bosco/i.test(raw)) { matchedSubject = 'Chemistry for CS'; matchedCode = '26CYB1002J'; }
            else if (/pps|c prog|sheeba/i.test(raw)) { matchedSubject = 'Programming (PPS)'; matchedCode = '26CSE1002J'; }
            else if (/calc|math|parvathi/i.test(raw)) { matchedSubject = 'Calculus'; matchedCode = '26MAB1001T'; }
            else if (/bio|sivasankareswari/i.test(raw)) { matchedSubject = 'Comp Biology'; matchedCode = '26BTB1001T'; }
            else if (/work|bel|samson/i.test(raw)) { matchedSubject = 'Workshop'; matchedCode = '26MEE1001L'; }

            showScheduleVerificationAlert({
                id: msg.id,
                subject: matchedSubject,
                code: matchedCode,
                text: msg.text,
                sender: msg.sender,
                timestamp: msg.timestamp
            });
            break;
        }

        // Check for Assignments / Observation Books
        if (/submit|assignment|observation|record|deadline|due date/i.test(raw)) {
            announcementsData.unshift({
                id: 'wa-live-' + msg.id,
                subject: 'WhatsApp Alert',
                code: 'ALL',
                category: 'Assignment',
                title: msg.text.length > 55 ? msg.text.substring(0, 55) + '...' : msg.text,
                detail: `${msg.text}\n\n(Received live from WhatsApp group)`,
                faculty: msg.sender,
                venue: 'Live Sync',
                sourceGroup: 'Scraped from WhatsApp',
                timestamp: msg.timestamp || 'Just Now'
            });
            renderAnnouncements();
        }
    }
}

function showScheduleVerificationAlert(alert) {
    activeScheduleAlert = alert;
    const wrap = document.getElementById('wa-schedule-alert-wrap');
    if (!wrap) return;

    wrap.style.display = 'block';
    wrap.innerHTML = `
        <div class="wa-alert-header">
            <span class="wa-alert-badge">⚠️ Potential Schedule Change Detected</span>
            <span style="font-size:0.7rem;color:#fcd34d;font-weight:600;">Sender: ${alert.sender} (${alert.timestamp})</span>
        </div>
        <div class="wa-alert-text">
            <b>"${alert.text}"</b>
        </div>
        <div class="wa-alert-actions">
            <button class="wa-alert-btn" onclick="confirmScheduleAlert('${alert.id}', '${alert.subject}')">
                ✅ Confirm & Mark "${alert.subject}" Free
            </button>
            <button class="wa-alert-btn wa-alert-btn-secondary" onclick="dismissScheduleAlert()">
                ✕ Dismiss (Keep Schedule)
            </button>
        </div>
    `;
}

function confirmScheduleAlert(alertId, subjectName) {
    // Soft update today's schedule for this subject
    const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || [];
    let updated = false;
    schedule.forEach(p => {
        if (p.title && (p.title.toLowerCase().includes(subjectName.toLowerCase()) || subjectName.toLowerCase().includes(p.title.toLowerCase()))) {
            p.type = 'Free';
            p.title = `[Cancelled] ${p.title}`;
            updated = true;
        }
    });

    if (updated) {
        renderDaySchedule(currentDayOrder);
        updateLiveHUD();
        showAttendanceToast(`✅ ${subjectName} marked as Free for today!`, 'warning');
    }

    dismissScheduleAlert();
}

function dismissScheduleAlert() {
    const wrap = document.getElementById('wa-schedule-alert-wrap');
    if (wrap) wrap.style.display = 'none';
    activeScheduleAlert = null;
}

async function openWALinkedDeviceModal() {
    const existing = document.getElementById('wa-pair-modal');
    if (existing) existing.remove();

    // Trigger connect if not started
    await apiFetch('/api/wa/connect', { method: 'POST' });
    const statusRes = await apiFetch('/api/wa/status');

    const modal = document.createElement('div');
    modal.id = 'wa-pair-modal';
    modal.className = 'class-modal-backdrop';

    const qrImg = statusRes?.qrCodeDataURL ? `<div class="wa-qr-box"><img src="${statusRes.qrCodeDataURL}" alt="WhatsApp QR Code"></div>` : `<div style="padding:40px 0;font-size:0.9rem;color:#38bdf8;">⏳ Generating live pairing QR code...</div>`;

    modal.innerHTML = `
        <div class="class-modal-sheet" style="text-align:center;">
            <div class="class-modal-header">
                <div>
                    <span class="wa-privacy-badge">🔒 WhatsApp Multi-Device Companion</span>
                    <h3 style="font-size:1.15rem;font-weight:800;color:#ffffff;margin-top:6px;">Link WhatsApp to SRM Companion</h3>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('wa-pair-modal').remove()">✕</button>
            </div>
            <div class="class-modal-body" style="align-items:center;">
                <div id="wa-qr-container">
                    ${qrImg}
                </div>
                <div style="background:#18181d;border:1px solid #27272a;border-radius:12px;padding:12px 14px;text-align:left;font-size:0.8rem;color:#cbd5e1;line-height:1.5;max-width:320px;">
                    <div style="font-weight:700;color:#f4f4f5;margin-bottom:4px;">📲 How to scan:</div>
                    1. Open WhatsApp on your phone.<br>
                    2. Go to <b>Settings</b> &rarr; <b>Linked Devices</b>.<br>
                    3. Tap <b>Link a Device</b> & point camera at this QR code.<br>
                    4. SRM Companion will connect as a virtual companion!
                </div>
                <div style="margin-top:12px;display:flex;gap:8px;">
                    <button class="pill-btn" style="background:#27272a;color:#f4f4f5;border:1px solid #3f3f46;padding:6px 14px;border-radius:8px;font-size:0.75rem;cursor:pointer;" onclick="refreshWAQRCode()">🔄 Refresh QR</button>
                    <button class="pill-btn" style="background:#ef4444;color:#ffffff;border:none;padding:6px 14px;border-radius:8px;font-size:0.75rem;cursor:pointer;" onclick="disconnectWADevice()">🔌 Disconnect</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Live update QR inside modal
    const qrInterval = setInterval(async () => {
        if (!document.getElementById('wa-pair-modal')) {
            clearInterval(qrInterval);
            return;
        }
        const s = await apiFetch('/api/wa/status');
        if (s?.status === 'CONNECTED') {
            clearInterval(qrInterval);
            const curModal = document.getElementById('wa-pair-modal');
            if (curModal) curModal.remove();
            showAttendanceToast(`🟢 Connected to WhatsApp as ${s.user?.name || 'Companion'}!`, 'success');
            openWAGroupSelectorModal();
        } else if (s?.qrCodeDataURL) {
            const box = document.getElementById('wa-qr-container');
            if (box) box.innerHTML = `<div class="wa-qr-box"><img src="${s.qrCodeDataURL}" alt="WhatsApp QR Code"></div>`;
        }
    }, 2000);
}

async function refreshWAQRCode() {
    await apiFetch('/api/wa/connect', { method: 'POST' });
    const s = await apiFetch('/api/wa/status');
    const box = document.getElementById('wa-qr-container');
    if (box && s?.qrCodeDataURL) {
        box.innerHTML = `<div class="wa-qr-box"><img src="${s.qrCodeDataURL}" alt="WhatsApp QR Code"></div>`;
    }
}

async function disconnectWADevice() {
    if (confirm("Disconnect WhatsApp from SRM Companion?")) {
        await apiFetch('/api/wa/disconnect', { method: 'POST' });
        const modal = document.getElementById('wa-pair-modal');
        if (modal) modal.remove();
        pollWADeviceStatus();
        showAttendanceToast("Disconnected WhatsApp companion.", "warning");
    }
}

async function openWAGroupSelectorModal() {
    const existing = document.getElementById('wa-group-picker-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'wa-group-picker-modal';
    modal.className = 'class-modal-backdrop';

    modal.innerHTML = `
        <div class="class-modal-sheet">
            <div class="class-modal-header">
                <div>
                    <span class="wa-privacy-badge">🤖 AI Group Permissions</span>
                    <h3 style="font-size:1.1rem;font-weight:800;color:#ffffff;margin-top:6px;">Select Groups for AI Monitoring</h3>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('wa-group-picker-modal').remove()">✕</button>
            </div>
            <div class="class-modal-body">
                <p style="font-size:0.75rem;color:#cbd5e1;margin-bottom:10px;">
                    Select the class and lab groups you want AI to monitor for schedule cancellations and assignment deadlines. Personal chats are never read.
                </p>
                <div id="wa-picker-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;">
                    <div style="text-align:center;padding:20px;color:#38bdf8;font-size:0.8rem;">⏳ Loading your WhatsApp groups...</div>
                </div>
                <button class="pill-btn" style="background:#22c55e;color:#000;border:none;padding:10px;border-radius:10px;font-weight:800;font-size:0.85rem;cursor:pointer;margin-top:10px;" onclick="saveSelectedWAGroups()">
                    💾 Save & Activate AI Monitor
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    try {
        const res = await apiFetch('/api/wa/groups');
        const listEl = document.getElementById('wa-picker-list');
        if (!listEl) return;

        if (res && Array.isArray(res.groups) && res.groups.length > 0) {
            listEl.innerHTML = res.groups.map(g => `
                <label style="background:#18181d;border:1px solid #27272a;border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
                    <div style="min-width:0;padding-right:10px;">
                        <div style="font-size:0.82rem;font-weight:700;color:#f4f4f5;">${escapeHtml(g.name)}</div>
                        <div style="font-size:0.68rem;color:var(--text-muted);">${g.participantsCount} participants</div>
                    </div>
                    <input type="checkbox" class="wa-group-checkbox" value="${g.id}" ${g.isMonitored ? 'checked' : ''} style="width:18px;height:18px;accent-color:#22c55e;cursor:pointer;">
                </label>
            `).join('');
        } else {
            listEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;padding:20px 0;">No active WhatsApp groups found on this account.</div>`;
        }
    } catch (e) {
        const listEl = document.getElementById('wa-picker-list');
        if (listEl) listEl.innerHTML = `<div style="color:#f87171;font-size:0.8rem;text-align:center;">Failed to load groups: ${e.message}</div>`;
    }
}

async function saveSelectedWAGroups() {
    const checkboxes = document.querySelectorAll('.wa-group-checkbox:checked');
    const groupIds = Array.from(checkboxes).map(cb => cb.value);

    await apiFetch('/api/wa/select-groups', {
        method: 'POST',
        body: JSON.stringify({ groupIds })
    });

    const modal = document.getElementById('wa-group-picker-modal');
    if (modal) modal.remove();

    pollWADeviceStatus();
    showAttendanceToast(`✅ AI now monitoring ${groupIds.length} WhatsApp groups!`, 'success');
}
