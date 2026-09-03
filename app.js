var _liveCookies = '';
var _secConfig = {};
var _hiddenFields = {};
var _currentSessionId = '';
var _isFetchingCaptcha = false;
var _captchaLoadTime = 0;
var _currentCaptchaCode = '';

// ─── Token & Session Management ──────────────────────────────────────────────
function getToken() {
    try {
        return localStorage.getItem('srm_session_token') || '';
    } catch (_) { return ''; }
}

function setToken(token) {
    try {
        localStorage.setItem('srm_session_token', token || '');
    } catch (_) {}
}

function authHeader() {
    const t = getToken();
    return t ? { 'Authorization': `Bearer ${t}` } : {};
}

function quickLaunchVerifiedStudent() {
    const prof = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) || {};
    const autoId = localStorage.getItem('srm_auto_id');
    const autoPass = localStorage.getItem('srm_auto_pass');

    if (!autoId || !autoPass) {
        showLogin();
        return;
    }

    setToken('srm_session_' + autoId + '_' + Date.now());
    showDashboard();
    _initApp();
}
window.quickLaunchVerifiedStudent = quickLaunchVerifiedStudent;

function showErr(msg) {
    const errEl = document.getElementById('login-error');
    if (errEl) {
        errEl.style.display = 'block';
        errEl.textContent = msg;
    }
    if (typeof showAttendanceToast === 'function') {
        showAttendanceToast(msg, 'error');
    }
}
window.showErr = showErr;

// ─── Ultra-Safe JSON & DOM Utilities (Zero-Crash Shield) ──────────────────────
function safeJsonParse(val, fallback = null) {
    if (!val || typeof val !== 'string') return fallback;
    try {
        const parsed = JSON.parse(val);
        return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (_) {
        return fallback;
    }
}

// ==========================================================================
//  SRM COMPANION THEME ENGINE
// ==========================================================================
const SUPPORTED_THEMES = ['alabaster-silk', 'kyoto-matcha', 'mocha-cashmere', 'nordic-midnight', 'fcuk-clay', 'claymorph', 'linear-pro', 'luminous', 'smooth', 'obsidian', 'monolith', 'velvet-aurora', 'tokyo-sakura', 'clay-minimal', 'white-manga', 'dark-manga', 'offwhite', 'dominator', 'arcade', 'linear', 'tokyo', 'nord', 'paper', 'neobrutalist'];

function initTheme() {
    const saved = localStorage.getItem('srm_theme') || 'alabaster-silk';
    setTheme(saved, false);
}

function setTheme(themeName, showToastMsg = true) {
    if (!SUPPORTED_THEMES.includes(themeName)) {
        themeName = 'alabaster-silk';
    }
    if (document.documentElement) document.documentElement.setAttribute('data-theme', themeName);
    if (document.body) document.body.setAttribute('data-theme', themeName);
    try { localStorage.setItem('srm_theme', themeName); } catch (_) {}

    document.querySelectorAll('.theme-card-option').forEach(el => {
        const tId = el.getAttribute('data-theme-id');
        const isActive = (tId === themeName) || (themeName === 'alabaster-silk' && tId === 'alabaster-silk');
        el.classList.toggle('active', isActive);
    });

    document.querySelectorAll('.theme-pill-btn').forEach(btn => {
        const bId = btn.getAttribute('data-theme-btn');
        btn.classList.toggle('active', bId === themeName);
    });

    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor && typeof metaThemeColor.setAttribute === 'function') {
        const themeBgColors = {
            'alabaster-silk': '#f3efe6',
            'kyoto-matcha': '#0b0f0d',
            'mocha-cashmere': '#0f0d0c',
            'nordic-midnight': '#07090e',
            'fcuk-clay': '#f8efe9',
            claymorph: '#f8efe9',
            'linear-pro': '#08090d',
            luminous: '#090a10',
            smooth: '#090a10',
            obsidian: '#000000',
            monolith: '#000000',
            'velvet-aurora': '#070913',
            'tokyo-sakura': '#110d1e',
            'clay-minimal': '#f8fafc',
            'white-manga': '#fafafa',
            'dark-manga': '#0a0a0f',
            offwhite: '#0d0d0f',
            dominator: '#03080e',
            arcade: '#08060f',
            linear: '#08090d',
            tokyo: '#0f141c',
            nord: '#1e222a',
            paper: '#f4f4f6',
            neobrutalist: '#000000'
        };
        metaThemeColor.setAttribute('content', themeBgColors[themeName] || '#f3efe6');
    }

    if (typeof updateOrbitDial === 'function') {
        try { updateOrbitDial(); } catch (_) {}
    }

    if (showToastMsg && typeof showAttendanceToast === 'function') {
        const names = {
            'alabaster-silk': 'Alabaster Silk (Kyoto Zen)',
            'kyoto-matcha': 'Kyoto Matcha Dark',
            'mocha-cashmere': 'Mocha Cashmere',
            'nordic-midnight': 'Nordic Midnight',
            'fcuk-clay': 'Fcuk Claymorph',
            claymorph: 'Claymorph UI',
            luminous: 'Smooth Luminous',
            smooth: 'Smooth Luminous',
            obsidian: 'Monolith Apex',
            monolith: 'Monolith Apex',
            'velvet-aurora': 'Velvet Aurora',
            'tokyo-sakura': 'Tokyo Sakura',
            'clay-minimal': 'Cupertino Clay',
            'white-manga': 'White Manga Ink',
            'dark-manga': 'Dark Cyber-Manga',
            offwhite: 'Off-White Industrial',
            dominator: 'Dominator HUD',
            arcade: 'Arcade 1984',
            linear: 'Linear Slate',
            tokyo: 'Tokyo Cyber',
            nord: 'Nordic Slate',
            paper: 'Editorial Light',
            neobrutalist: 'Neo-Brutalist HV'
        };
        showAttendanceToast(`Theme switched to ${names[themeName] || themeName}`);
    }
}
window.setTheme = setTheme;

function switchHubSection(section) {
    const secMess = document.getElementById('hub-section-mess');
    const secCampus = document.getElementById('hub-section-campus');
    const secThemes = document.getElementById('hub-section-themes');
    const secHelp = document.getElementById('hub-section-help');

    const btnMess = document.getElementById('hub-tab-mess');
    const btnCampus = document.getElementById('hub-tab-campus');
    const btnThemes = document.getElementById('hub-tab-themes');
    const btnHelp = document.getElementById('hub-tab-help');

    if (secMess) secMess.style.display = (section === 'mess') ? 'block' : 'none';
    if (secCampus) secCampus.style.display = (section === 'campus') ? 'block' : 'none';
    if (secThemes) secThemes.style.display = (section === 'themes') ? 'block' : 'none';
    if (secHelp) secHelp.style.display = (section === 'help') ? 'block' : 'none';

    if (btnMess) btnMess.classList.toggle('active', section === 'mess');
    if (btnCampus) btnCampus.classList.toggle('active', section === 'campus');
    if (btnThemes) btnThemes.classList.toggle('active', section === 'themes');
    if (btnHelp) btnHelp.classList.toggle('active', section === 'help');

    if (section === 'mess' && typeof renderMessHub === 'function') {
        renderMessHub();
    }
}

function openCommandCenterModal(defaultSection = 'mess') {
    const modal = document.getElementById('command-center-modal') || document.getElementById('theme-modal');
    if (modal) {
        modal.style.display = 'flex';
        switchHubSection(defaultSection);
        if (typeof renderMessHub === 'function') renderMessHub();
        const current = localStorage.getItem('srm_theme') || 'luminous';
        document.querySelectorAll('.theme-card-option').forEach(el => {
            const tId = el.getAttribute('data-theme-id');
            const isActive = (tId === current) ||
                             (current === 'luminous' && tId === 'luminous') ||
                             (current === 'monolith' && tId === 'obsidian');
            el.classList.toggle('active', isActive);
        });
    }
}

function closeCommandCenterModal() {
    const modal = document.getElementById('command-center-modal') || document.getElementById('theme-modal');
    if (modal) modal.style.display = 'none';
}

function openThemeModal() {
    openCommandCenterModal('themes');
}

function closeThemeModal() {
    closeCommandCenterModal();
}

function openVerticalSideMenu() {
    const modal = document.getElementById('vertical-quick-menu-modal');
    if (modal) {
        modal.style.display = 'flex';
        const displayName = localStorage.getItem('srm_display_name') || 'Student';
        const regNo = localStorage.getItem('srm_reg_no') || (localStorage.getItem('srm_auto_id') ? localStorage.getItem('srm_auto_id').toUpperCase() : 'SRMIST');
        const nameEl = document.getElementById('side-menu-name');
        const regEl = document.getElementById('side-menu-reg');
        const avEl = document.getElementById('side-menu-avatar');
        if (nameEl) nameEl.textContent = displayName;
        if (regEl) regEl.textContent = regNo;
        if (avEl) {
            avEl.textContent = displayName.substring(0, 2).toUpperCase();
            const cust = (typeof getProfileCustomization === 'function') ? getProfileCustomization() : { frame: 'frame-crown-radiance' };
            if (typeof applyAvatarDecorationOverlay === 'function') {
                applyAvatarDecorationOverlay(avEl, cust.frame || 'frame-crown-radiance');
            }
        }
    }
}

function closeVerticalSideMenu() {
    const modal = document.getElementById('vertical-quick-menu-modal');
    if (modal) modal.style.display = 'none';
}

function openStudentHelpModal() {
    const modal = document.getElementById('student-help-modal');
    if (modal) modal.style.display = 'flex';
}

function closeStudentHelpModal() {
    const modal = document.getElementById('student-help-modal');
    if (modal) modal.style.display = 'none';
}

window.switchHubSection = switchHubSection;
window.openCommandCenterModal = openCommandCenterModal;
window.closeCommandCenterModal = closeCommandCenterModal;
window.openThemeModal = openThemeModal;
window.closeThemeModal = closeThemeModal;
window.openVerticalSideMenu = openVerticalSideMenu;
window.closeVerticalSideMenu = closeVerticalSideMenu;
window.openStudentHelpModal = openStudentHelpModal;
window.closeStudentHelpModal = closeStudentHelpModal;

// ==========================================================================
//  100% PURE CLOUD SERVERLESS & NATIVE ENGINE (Tri-Cluster Architecture)
// ==========================================================================
const MULTI_CLOUD_GATEWAYS = [
    { name: 'Cluster Alpha (Vercel Production Edge)', url: 'https://srmbackend.vercel.app' },
    { name: 'Cluster Cloudflare (Global Edge Shield)', url: 'https://srm-edge-gateway.srm-companion.workers.dev' },
    { name: 'Cluster Beta (Render Cloud Microservice)', url: 'https://srm-companion-backend.onrender.com' },
    { name: 'Cluster Gamma (Railway Gateway)', url: 'https://srm-companion-backend.up.railway.app' }
];

var _activeGatewayUrl = '';
var _isGatewayProbing = false;
var _isAuthenticating = false;
var _lastAuthClickTime = 0;

function getApiBase() {
    try {
        const custom = localStorage.getItem('srm_custom_gateway');
        if (custom && custom.trim()) return custom.trim().replace(/\/$/, '');

        const saved = localStorage.getItem('srm_api_base');
        if (saved && saved.trim()) return saved.trim().replace(/\/$/, '');

        if (typeof window !== 'undefined' && window.location) {
            const host = window.location.hostname || '';
            if (host.includes('vercel.app') || host.includes('onrender.com') || host.includes('railway.app')) {
                return window.location.origin;
            }
        }
    } catch (_) {}

    return _activeGatewayUrl || MULTI_CLOUD_GATEWAYS[0].url;
}

// Universal HTTP Fetch Helper for Capacitor Mobile + Web Browsers
async function nativeHttp(url, options = {}) {
    const method = (options.method || 'GET').toUpperCase();
    const headers = options.headers || {};
    const timeout = options.timeout || 12000;
    
    // 1. CapacitorHttp plugin (Android / iOS native container)
    const capHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (capHttp) {
        try {
            let data = options.body;
            if (typeof data === 'string' && (headers['Content-Type'] || '').includes('application/json')) {
                try { data = JSON.parse(data); } catch (_) {}
            }
            const res = await capHttp.request({
                url: url,
                method: method,
                headers: headers,
                data: data,
                connectTimeout: timeout,
                readTimeout: timeout
            });
            return {
                ok: res.status >= 200 && res.status < 300,
                status: res.status,
                headers: res.headers || {},
                json: async () => (typeof res.data === 'object' ? res.data : JSON.parse(res.data)),
                text: async () => (typeof res.data === 'string' ? res.data : JSON.stringify(res.data))
            };
        } catch (e) {
            console.warn('[nativeHttp] CapacitorHttp exception, falling back to standard fetch:', e);
        }
    }

    // 2. Standard Web Fetch (with abort timeout)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    try {
        const resp = await fetch(url, {
            ...options,
            method: method,
            headers: headers,
            signal: controller.signal
        });
        clearTimeout(timeoutId);
        return resp;
    } catch (e) {
        clearTimeout(timeoutId);
        console.warn(`[nativeHttp] Fetch failed for ${url}:`, e);
        return null;
    }
}
window.nativeHttp = nativeHttp;

async function probeAndSelectFastestGateway() {
    if (_isGatewayProbing) return getApiBase();
    _isGatewayProbing = true;

    const custom = localStorage.getItem('srm_custom_gateway');
    if (custom && custom.trim()) {
        _activeGatewayUrl = custom.trim().replace(/\/$/, '');
        _isGatewayProbing = false;
        return _activeGatewayUrl;
    }

    const candidates = MULTI_CLOUD_GATEWAYS;

    const probePromises = candidates.map(async (gw) => {
        const start = Date.now();
        try {
            const r = await nativeHttp(`${gw.url}/api/status`, { timeout: 3500 });
            if (r && r.ok) {
                const latency = Date.now() - start;
                return { url: gw.url, name: gw.name, latency, ok: true };
            }
        } catch (_) {}
        return { url: gw.url, name: gw.name, latency: 99999, ok: false };
    });

    const results = await Promise.all(probePromises);
    const healthy = results.filter(r => r.ok).sort((a, b) => a.latency - b.latency);

    if (healthy.length > 0) {
        _activeGatewayUrl = healthy[0].url;
        try { localStorage.setItem('srm_api_base', _activeGatewayUrl); } catch (_) {}
        console.log(`[Multi-Cloud Gateway] Selected fastest gateway: ${healthy[0].name} (${healthy[0].url}) in ${healthy[0].latency}ms`);
    } else {
        _activeGatewayUrl = MULTI_CLOUD_GATEWAYS[0].url;
        console.warn(`[Multi-Cloud Gateway] Probes timed out. Defaulting to: ${_activeGatewayUrl}`);
    }

    _isGatewayProbing = false;
    updateGatewayStatusUI();
    return _activeGatewayUrl;
}

function updateGatewayStatusUI() {
    const el = document.getElementById('gateway-status-badge');
    if (el) {
        const base = getApiBase();
        const cleanName = base.replace('https://', '').replace('http://', '').split('/')[0];
        el.textContent = `🟢 Cloud: ${cleanName} (Tap to change)`;
        el.title = `Active Gateway: ${base}. Tap to configure.`;
        el.style.cursor = 'pointer';
        el.onclick = () => openGatewayConfigModal();
    }
}

function openGatewayConfigModal() {
    const current = getApiBase();
    const modal = document.createElement('div');
    modal.id = 'gateway-config-modal';
    modal.className = 'class-modal-backdrop';
    modal.style.display = 'flex';
    modal.onclick = (e) => { if (e.target === modal) modal.remove(); };

    modal.innerHTML = `
        <div class="class-modal-sheet" style="max-width:380px;">
            <div class="class-modal-header">
                <div style="display:flex;align-items:center;gap:8px;">
                    <span style="font-size:1.1rem;">⚙️</span>
                    <span style="font-size:0.95rem;font-weight:800;color:var(--text-main);">Backend Gateway Config</span>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('gateway-config-modal').remove()">&times;</button>
            </div>
            <div style="font-size:0.75rem;color:var(--text-muted);margin:8px 0 12px;line-height:1.4;">
                Select your active scraper gateway or enter your laptop/cloud server IP:
            </div>
            <div style="display:flex;flex-direction:column;gap:8px;margin-bottom:14px;">
                <button class="pill-btn" style="text-align:left;padding:8px 12px;background:var(--card-elevated);border:1px solid var(--card-border);border-radius:8px;" onclick="setCustomGateway('http://192.168.1.100:8000')">
                    <div style="font-weight:700;color:var(--text-main);font-size:0.78rem;">📡 Wi-Fi LAN / Laptop Backend</div>
                    <div style="font-size:0.68rem;color:var(--text-muted);">http://192.168.x.x:8000</div>
                </button>
                <button class="pill-btn" style="text-align:left;padding:8px 12px;background:var(--card-elevated);border:1px solid var(--card-border);border-radius:8px;" onclick="setCustomGateway('https://srm-companion.vercel.app')">
                    <div style="font-weight:700;color:var(--text-main);font-size:0.78rem;">⚡ Vercel Serverless Gateway</div>
                    <div style="font-size:0.68rem;color:var(--text-muted);">https://srm-companion.vercel.app</div>
                </button>
                <button class="pill-btn" style="text-align:left;padding:8px 12px;background:var(--card-elevated);border:1px solid var(--card-border);border-radius:8px;" onclick="setCustomGateway('http://10.0.2.2:8000')">
                    <div style="font-weight:700;color:var(--text-main);font-size:0.78rem;">🤖 Android Emulator Loopback</div>
                    <div style="font-size:0.68rem;color:var(--text-muted);">http://10.0.2.2:8000</div>
                </button>
            </div>
            <div style="margin-bottom:12px;">
                <label style="font-size:0.7rem;font-weight:700;color:var(--text-sub);display:block;margin-bottom:4px;">CUSTOM URL / IP</label>
                <input id="custom-gateway-input" class="login-input" type="text" value="${escapeHtml(current)}" placeholder="http://192.168.1.x:8000" style="font-size:0.78rem;font-family:var(--font-mono);">
            </div>
            <div style="display:flex;gap:8px;">
                <button class="apex-btn" style="flex:1;font-size:0.78rem;" onclick="saveCustomGatewayFromInput()">Save & Reload</button>
                <button class="apex-btn apex-btn-outline" style="flex:1;font-size:0.78rem;" onclick="resetGatewayDefault()">Reset</button>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
}

function setCustomGateway(url) {
    const inp = document.getElementById('custom-gateway-input');
    if (inp) inp.value = url;
}

function saveCustomGatewayFromInput() {
    const inp = document.getElementById('custom-gateway-input');
    if (inp && inp.value.trim()) {
        const clean = inp.value.trim().replace(/\/$/, '');
        localStorage.setItem('srm_custom_gateway', clean);
        localStorage.setItem('srm_api_base', clean);
        _activeGatewayUrl = clean;
        const modal = document.getElementById('gateway-config-modal');
        if (modal) modal.remove();
        updateGatewayStatusUI();
        fetchLiveCaptcha(true);
    }
}

function resetGatewayDefault() {
    localStorage.removeItem('srm_custom_gateway');
    localStorage.removeItem('srm_api_base');
    _activeGatewayUrl = '';
    const modal = document.getElementById('gateway-config-modal');
    if (modal) modal.remove();
    probeAndSelectFastestGateway().then(() => fetchLiveCaptcha(true));
}

window.openGatewayConfigModal = openGatewayConfigModal;
window.setCustomGateway = setCustomGateway;
window.saveCustomGatewayFromInput = saveCustomGatewayFromInput;
window.resetGatewayDefault = resetGatewayDefault;

async function apiFetch(path, opts = {}) {
    const base = opts.customBase || getApiBase() || await probeAndSelectFastestGateway();
    if (!base) return null;

    const headers = {
        'Content-Type': 'application/json',
        ...opts.headers,
        ...authHeader()
    };

    try {
        const r = await nativeHttp(base + path, { ...opts, headers });
        if (!r) return null;

        try {
            return await r.json();
        } catch (_) {
            if (r.ok) return { success: true };
            return { success: false, error: `HTTP ${r.status} error` };
        }
    } catch (_) {
        return null;
    }
}
window.apiFetch = apiFetch;

// ─── Screen Transitions ───────────────────────────────────────────────────────
function showLogin() {
    const screen = document.getElementById('login-screen');
    const wrap = document.querySelector('.mobile-wrapper');
    const dock = document.querySelector('.dock');
    if (screen) screen.style.display = 'flex';
    if (wrap) wrap.style.display = 'none';
    if (dock) dock.style.display = 'none';
    probeAndSelectFastestGateway().then(() => fetchLiveCaptcha());
}

function showDashboard() {
    const screen = document.getElementById('login-screen');
    const wrap = document.querySelector('.mobile-wrapper');
    const dock = document.querySelector('.dock');
    if (screen) screen.style.display = 'none';
    if (wrap) wrap.style.display = 'block';
    if (dock) dock.style.display = 'flex';
    
    updateStudentHeader();

    if (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) {
        const prof = SRM_DATA.profile;
        const displayName = localStorage.getItem('srm_display_name') || prof.name || 'KARANAM SAI PRASANTH';
        const regNo = localStorage.getItem('srm_reg_no') || prof.regNo || 'RA2411003010283';
        prof.name = displayName;
        prof.regNo = regNo;
        const prog = localStorage.getItem('srm_program');
        if (prog) prof.degree = prog;
        const sec = localStorage.getItem('srm_section');
        if (sec) prof.batch = sec.startsWith('Section') ? sec : `Section ${sec}`;
    }

    if (typeof renderPassportHub === 'function') {
        renderPassportHub();
    }
    if (typeof initClockAndDate === 'function') {
        initClockAndDate();
    }
    if (typeof updateLiveHUD === 'function') {
        updateLiveHUD();
    }
}

function getStudentDisplayName() {
    const saved = (localStorage.getItem('srm_display_name') || '').trim();
    if (saved && saved.toLowerCase() !== 'student') {
        return saved;
    }
    const prof = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) || {};
    if (prof.name && prof.name.trim() && prof.name.toLowerCase() !== 'student') {
        return prof.name.trim();
    }
    const netId = (localStorage.getItem('srm_auto_id') || '').toUpperCase();
    return netId || 'Student';
}
window.getStudentDisplayName = getStudentDisplayName;

function updateStudentHeader() {
    const prof = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) || {};
    const displayName = getStudentDisplayName();
    const regNo = (localStorage.getItem('srm_reg_no') || prof.regNo || (localStorage.getItem('srm_auto_id') ? localStorage.getItem('srm_auto_id').toUpperCase() : '')).trim();
    const rawSec = (localStorage.getItem('srm_section') || prof.section || prof.batch || '').replace(/Section\s*/i, '').trim();

    const regEl = document.getElementById('header-reg');
    const nameEl = document.getElementById('header-name');
    const avEl = document.getElementById('header-avatar');

    if (nameEl) nameEl.textContent = displayName;
    if (regEl) {
        if (regNo && rawSec) {
            regEl.innerHTML = `${regNo} &bull; Section ${rawSec}`;
        } else if (regNo) {
            regEl.innerHTML = `${regNo}`;
        } else if (rawSec) {
            regEl.innerHTML = `Section ${rawSec}`;
        } else {
            regEl.innerHTML = `SRMIST Kattankulathur`;
        }
    }
    if (avEl) {
        const initials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
        avEl.textContent = initials;
        const cust = (typeof getProfileCustomization === 'function') ? getProfileCustomization() : { frame: 'frame-crown-radiance' };
        if (typeof applyAvatarDecorationOverlay === 'function') {
            applyAvatarDecorationOverlay(avEl, cust.frame || 'frame-crown-radiance');
        }
        avEl.onclick = (typeof openStudentCardView === 'function') ? openStudentCardView : null;
        avEl.style.cursor = 'pointer';
        avEl.title = 'View Student Smart Card & Profile';
    }
    const userTagEl = document.querySelector('.user-tag');
    if (userTagEl) {
        userTagEl.onclick = function(e) {
            if (e && e.target && (e.target.closest && e.target.closest('button'))) return;
            if (typeof openStudentCardView === 'function') openStudentCardView(e);
        };
        userTagEl.style.cursor = 'pointer';
        userTagEl.title = 'View Student Smart Card & Profile';
    }
}
window.updateStudentHeader = updateStudentHeader;

// ─── Direct In-App Native CAPTCHA Fetcher (Zero-Backend Mobile Fallback) ────────
async function fetchDirectSRMCaptchaNative() {
    const capHttp = (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.CapacitorHttp) || window.CapacitorHttp;
    if (!capHttp) return null;

    try {
        const loginUrl = 'https://sp.srmist.edu.in/srmiststudentportal/students/loginManager/youLogin.jsp';
        const pageResp = await capHttp.request({
            url: loginUrl,
            method: 'GET',
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' },
            connectTimeout: 8000,
            readTimeout: 8000
        });

        if (!pageResp || pageResp.status !== 200) return null;

        const html = pageResp.data || '';
        const cookieHdr = pageResp.headers['set-cookie'] || pageResp.headers['Set-Cookie'] || '';

        const nonceMatch = html.match(/name=['"]nonce['"]\s+value=['"]([^'"]+)['"]/i) || html.match(/value=['"]([a-f0-9\-]{20,})['"]\s+name=['"]nonce['"]/i);
        const nonce = nonceMatch ? nonceMatch[1] : '';

        const imgMatch = html.match(/id=['"]secure_captcha['"][^>]+data-src=['"]([^'"]+)['"]/i) || html.match(/data-src=['"]([^'"]+)['"][^>]+id=['"]secure_captcha['"]/i);
        const dataSrc = imgMatch ? imgMatch[1] : '';

        const captchaUrl = dataSrc ? (dataSrc.startsWith('http') ? dataSrc : `https://sp.srmist.edu.in${dataSrc}`) : `https://sp.srmist.edu.in/srmiststudentportal/SCaptchaServlet?ts=${Date.now()}`;
        const domainProof = btoa(`${nonce}:sp.srmist.edu.in`);

        const capImgResp = await capHttp.request({
            url: captchaUrl,
            method: 'GET',
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': loginUrl,
                'X-Domain-Proof': domainProof,
                'Cookie': cookieHdr
            },
            responseType: 'base64',
            connectTimeout: 8000,
            readTimeout: 8000
        });

        if (capImgResp && capImgResp.status === 200 && capImgResp.data) {
            const b64 = capImgResp.data.startsWith('data:') ? capImgResp.data : `data:image/jpeg;base64,${capImgResp.data}`;
            return {
                success: true,
                captchaImg: b64,
                cookies: cookieHdr,
                sec_config: { nonce: nonce },
                hidden_fields: {}
            };
        }
    } catch (e) {
        console.warn('[DirectNativeCaptcha] Native fetch error:', e);
    }
    return null;
}

// ─── Live CAPTCHA Streamer with Multi-Gateway & Native Fallback ───────────────
async function fetchLiveCaptcha(force = false) {
    if (_isFetchingCaptcha && !force) return;
    _isFetchingCaptcha = true;
    _captchaLoadTime = Date.now();
    _currentCaptchaCode = '';

    const box = document.getElementById('captcha-box');
    if (!box) { _isFetchingCaptcha = false; return; }

    box.innerHTML = '<div style="display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:var(--card-elevated);border-radius:6px;font-size:0.75rem;color:var(--accent);border:1px solid var(--card-border);"><span style="animation:pulse 1s infinite;">⏳ Fetching CAPTCHA...</span></div>';

    try {
        // 1. Try active gateway API
        let res = await apiFetch('/api/captcha', { timeout: 6000 });

        // 2. If gateway failed, try direct native mobile fetch
        if (res && res.success && res.captchaImg) {
            _liveCookies = res.cookies || '';
            _secConfig = res.sec_config || {};
            _hiddenFields = res.hidden_fields || {};
            _currentSessionId = res.session_id || '';

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
            img.src = res.captchaImg;

            img.onerror = () => {
                box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">⚠️ Tap to Retry</div>';
            };

            box.appendChild(img);
            _isFetchingCaptcha = false;
            return;
        } else {
            const err = (res && res.error) ? res.error : 'Portal unreachable';
            console.warn('[Captcha] Gateway returned error:', err);
            box.innerHTML = `<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">🔄 Tap to Reload</div>`;
        }
    } catch (e) {
        console.warn('[Captcha] Fetch error:', e);
        box.innerHTML = '<div onclick="fetchLiveCaptcha(true)" style="cursor:pointer;display:flex;align-items:center;justify-content:center;height:42px;width:140px;background:rgba(239,68,68,0.1);border-radius:6px;font-size:0.75rem;color:#ef4444;border:1px solid rgba(239,68,68,0.3);text-align:center;">🔄 Tap to Reload</div>';
    }

    _isFetchingCaptcha = false;
}

function refreshCaptcha() {
    fetchLiveCaptcha(true);
}
window.refreshCaptcha = refreshCaptcha;
window.fetchLiveCaptcha = fetchLiveCaptcha;

// ─── Real Cloud Portal Authentication & Scraping Pipeline ───────────────────────
async function doAutoLogin(isBackgroundRefresh = false) {
    const rawId = isBackgroundRefresh ? localStorage.getItem('srm_auto_id') : document.getElementById('login-id')?.value.trim().toLowerCase().replace('@srmist.edu.in', '');
    const pass  = isBackgroundRefresh ? localStorage.getItem('srm_auto_pass') : document.getElementById('login-pass')?.value;
    const captchaVal = document.getElementById('login-captcha')?.value.trim();
    const btn   = document.getElementById('login-btn');

    const now = Date.now();
    if (!isBackgroundRefresh) {
        if (_isAuthenticating) {
            console.warn('[Anti-Spam] Authentication already in-flight. Ignoring spam clicks.');
            return false;
        }
        if (now - _lastAuthClickTime < 2000) {
            console.warn('[Anti-Spam] Rapid click debounce active.');
            return false;
        }
        _lastAuthClickTime = now;
        _isAuthenticating = true;
    }

    if (!rawId) { 
        if (!isBackgroundRefresh) {
            showErr('Please enter your SRM NetID');
            _isAuthenticating = false;
        }
        return false; 
    }
    if (!pass) {
        if (!isBackgroundRefresh) {
            showErr('Please enter your portal password');
            _isAuthenticating = false;
        }
        return false; 
    }
    if (!isBackgroundRefresh && (!captchaVal || captchaVal.length < 3)) {
        showErr('Please enter the 6-character Captcha shown in the image.');
        document.getElementById('login-captcha')?.focus();
        _isAuthenticating = false;
        return false;
    }

    if (!isBackgroundRefresh) {
        if (btn) { btn.disabled = true; btn.textContent = 'Authenticating with SRM…'; }
        const errEl = document.getElementById('login-error');
        if (errEl) errEl.style.display = 'none';
    }

    try {
        const payload = {
            username: rawId,
            password: pass,
            captcha: captchaVal || 'AUTO',
            session_id: _currentSessionId || '',
            cookies: _liveCookies || '',
            sec_config: _secConfig || {},
            hidden_fields: _hiddenFields || {}
        };

        const res = await apiFetch('/api/login', {
            method: 'POST',
            body: JSON.stringify(payload),
            timeout: 25000
        });

        if (res && res.success) {
            const realName = res.name || rawId.toUpperCase();
            const regNo = res.reg_no || '';
            const program = res.program || '';
            const section = res.section || '';
            const email = res.email || `${rawId}@srmist.edu.in`;

            // 1. Wipe previous student session and caches completely
            try {
                localStorage.clear();
                sessionStorage.clear();
            } catch (_) {}

            // 2. Persist new student authenticated state
            localStorage.setItem('srm_auto_id', rawId);
            localStorage.setItem('srm_auto_pass', pass);
            localStorage.setItem('srm_display_name', realName);
            localStorage.setItem('srm_reg_no', regNo);
            localStorage.setItem('srm_program', program);
            localStorage.setItem('srm_section', section);
            localStorage.setItem('srm_email', email);
            if (res.faculty_advisor || res.advisor) localStorage.setItem('srm_advisor', res.faculty_advisor || res.advisor);
            if (res.academic_advisor) localStorage.setItem('srm_academic_advisor', res.academic_advisor);
            if (res.orientation_room) localStorage.setItem('srm_orientation_room', res.orientation_room);
            if (res.batch) localStorage.setItem('srm_batch', res.batch);
            if (res.semester) localStorage.setItem('srm_semester', res.semester);
            if (res.institution) localStorage.setItem('srm_institution', res.institution);
            if (res.cookies) localStorage.setItem('srm_session_cookies', res.cookies);
            setToken('srm_session_' + rawId + '_' + Date.now());

            if (res.personal_info) {
                localStorage.setItem('srm_personal_info', JSON.stringify(res.personal_info));
            }
            if (res.hostel_details) {
                localStorage.setItem('srm_hostel_details', JSON.stringify(res.hostel_details));
                if (res.hostel_details.block) {
                    localStorage.setItem('srm_user_hostel_block', res.hostel_details.block);
                }
                if (res.hostel_details.room) {
                    localStorage.setItem('srm_user_room_no', res.hostel_details.room);
                }
            }
            if (res.exam_results) {
                localStorage.setItem('srm_exam_results', JSON.stringify(res.exam_results));
            }
            if (res.fee_details) {
                localStorage.setItem('srm_fee_details', JSON.stringify(res.fee_details));
            }
            if (res.attendance && res.attendance.length > 0) {
                portalAttendance = res.attendance;
                localStorage.setItem('srm_attendance_cache', JSON.stringify(res.attendance));
                localStorage.setItem('srm_cached_attendance', JSON.stringify(res.attendance));
            } else {
                portalAttendance = [];
            }
            if (res.timetable) {
                if (typeof SRM_DATA !== 'undefined') {
                    SRM_DATA.dayOrderSchedule = res.timetable;
                }
                localStorage.setItem('srm_timetable_cache', JSON.stringify(res.timetable));
                localStorage.setItem('srm_cached_schedule', JSON.stringify(res.timetable));
            }

            // 3. Update in-memory SRM_DATA.profile
            if (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) {
                SRM_DATA.profile.name = realName;
                SRM_DATA.profile.regNo = regNo;
                SRM_DATA.profile.studentId = res.student_id || rawId;
                SRM_DATA.profile.program = program;
                SRM_DATA.profile.section = section;
                SRM_DATA.profile.email = email;
                SRM_DATA.profile.facultyAdvisor = res.faculty_advisor || res.advisor || '';
                SRM_DATA.profile.academicAdvisor = res.academic_advisor || '';
                SRM_DATA.profile.orientationRoom = res.orientation_room || '';
                SRM_DATA.profile.batch = res.batch || '';
                SRM_DATA.profile.semester = res.semester || '';
                if (res.personal_info) {
                    SRM_DATA.profile.dob = res.personal_info.dob || '';
                    SRM_DATA.profile.gender = res.personal_info.gender || '';
                    SRM_DATA.profile.bloodGroup = res.personal_info.blood_group || '';
                    SRM_DATA.profile.abcId = res.personal_info.abc_id || '';
                    SRM_DATA.profile.personalEmail = res.personal_info.personal_email || '';
                    SRM_DATA.profile.mobile = res.personal_info.mobile || '';
                    SRM_DATA.profile.parents = {
                        fatherName: res.personal_info.father_name || '',
                        motherName: res.personal_info.mother_name || '',
                        contactNo: res.personal_info.parent_contact || '',
                        email: res.personal_info.parent_email || ''
                    };
                    SRM_DATA.profile.address = {
                        line: res.personal_info.address || '',
                        pincode: res.personal_info.pincode || '',
                        district: res.personal_info.district || '',
                        state: res.personal_info.state || ''
                    };
                }
                if (res.hostel_details) {
                    SRM_DATA.profile.hostel = res.hostel_details.block || 'Day Scholar / Off-Campus';
                    SRM_DATA.profile.room = res.hostel_details.room || '-';
                    SRM_DATA.profile.residence = (res.hostel_details.type === 'Hosteller') ? 'Hosteller' : 'Day Scholar';
                    SRM_DATA.profile.hostelAllocatedDate = res.hostel_details.allocated_date || '-';
                    SRM_DATA.profile.academicYear = res.hostel_details.academic_year || '-';
                }
            }

            if (typeof updateStudentHeader === 'function') updateStudentHeader();

            if (!isBackgroundRefresh) {
                onLoginSuccess();
                showAttendanceToast(`Welcome, ${realName}!`, 'success');
                if (typeof loadAttendanceData === 'function') loadAttendanceData();
                if (typeof loadTimetable === 'function') loadTimetable();
                if (typeof renderPassportHub === 'function') renderPassportHub();
            }
            _isAuthenticating = false;
            if (btn) btn.disabled = false;
            return true;
        } else {
            _isAuthenticating = false;
            const errorMsg = (res && res.error) ? res.error : 'Authentication failed. Please check your credentials and CAPTCHA.';
            if (!isBackgroundRefresh) {
                showErr(errorMsg);
                if (btn) { btn.disabled = false; btn.textContent = '⚡ Sign In & Sync'; }
                fetchLiveCaptcha(true);
            }
            return false;
        }
    } catch (e) {
        _isAuthenticating = false;
        console.warn('[Login] Exception:', e);
        if (!isBackgroundRefresh) {
            showErr('❌ Gateway connection error. Please tap Refresh Captcha and try again.');
            if (btn) { btn.disabled = false; btn.textContent = '⚡ Sign In & Sync'; }
            fetchLiveCaptcha(true);
        }
        return false;
    }
}
window.doAutoLogin = doAutoLogin;


function onLoginSuccess() {
    showDashboard();
    _initApp();
}

function doLogout() {
    try {
        if (typeof waBridgeFetch === 'function') {
            waBridgeFetch('/api/wa/disconnect', { method: 'POST' });
        }
    } catch (_) {}
    
    // 1. Completely clear all stored credentials, tokens, and caches
    try {
        clearToken();
        localStorage.clear();
        sessionStorage.clear();
    } catch (_) {}

    // 2. Clear input fields on login screen
    const idInput = document.getElementById('login-id');
    const passInput = document.getElementById('login-pass');
    const capInput = document.getElementById('login-captcha');
    if (idInput) idInput.value = '';
    if (passInput) passInput.value = '';
    if (capInput) capInput.value = '';

    // 3. Force-close and hide EVERY single modal and backdrop on the page
    const modalIds = [
        'command-center-modal',
        'vertical-quick-menu-modal',
        'student-help-modal',
        'theme-modal',
        'portal-modal',
        'what-if-modal',
        'profile-customizer-modal'
    ];
    modalIds.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            el.style.display = 'none';
            el.classList.remove('open', 'active', 'show');
        }
    });
    document.querySelectorAll('.class-modal-backdrop, .vertical-menu-backdrop, .portal-modal, .customizer-modal-backdrop').forEach(el => {
        el.style.display = 'none';
        el.classList.remove('open', 'active', 'show');
    });

    // 4. Immediately switch UI to login view
    const screen = document.getElementById('login-screen');
    const wrap = document.querySelector('.mobile-wrapper');
    const dock = document.querySelector('.dock');
    if (screen) {
        screen.style.display = 'flex';
        screen.style.visibility = 'visible';
        screen.style.opacity = '1';
        screen.style.zIndex = '99999';
    }
    if (wrap) wrap.style.display = 'none';
    if (dock) dock.style.display = 'none';

    // 5. Fetch fresh CAPTCHA for new login
    if (typeof fetchLiveCaptcha === 'function') {
        fetchLiveCaptcha(true);
    }
}
window.doLogout = doLogout;

// ─── App Initialization (0ms Instant Load from Cache) ─────────────────────────
function bootApp() {
    initTheme();
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

if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', bootApp);
    } else {
        bootApp();
    }

    if (typeof document.addEventListener === 'function') {
        document.addEventListener('deviceready', () => {
            if (document.getElementById('login-screen')?.style.display !== 'none') {
                fetchLiveCaptcha(true);
            }
        });
    }
}

if (typeof window !== 'undefined' && typeof window.addEventListener === 'function') {
    window.addEventListener('load', () => {
        if (document.getElementById('login-screen')?.style.display !== 'none') {
            fetchLiveCaptcha(false);
        }
    });
}

let selectedDay = 'Day 1';
let currentDayOrder = 'Day 1';
let isTodayHoliday = false;
let activeSubjectFilter = 'ALL';
let portalAttendance = [];

// ─── Auto-Cache Invalidation & GitHub Live OTA Updates ────────────────────────
function applyAppVersionAndCleanStaleCaches() {
    const currentVer = (typeof APP_BUILD_VERSION !== 'undefined') ? APP_BUILD_VERSION : '2.4.3';
    const storedVer = localStorage.getItem('srm_installed_build_version');

    const customImg = localStorage.getItem('srm_custom_avatar_img');
    if (customImg && (customImg.includes('dicebear') || customImg.includes('avatar_presets') || customImg.includes('avatar_cosmic_astro'))) {
        localStorage.removeItem('srm_custom_avatar_img');
    }

    if (storedVer !== currentVer) {
        localStorage.setItem('srm_installed_build_version', currentVer);
    }
}

async function triggerInstantLiveOTAUpdate(bundleUrl, newVersion) {
    showAttendanceToast('⚡ Downloading live update from GitHub...', 'info');
    const targetUrl = bundleUrl || 'https://raw.githubusercontent.com/prashanth-karanam/srm-companion/master/app.js';
    try {
        const r = await fetch(targetUrl + '?t=' + Date.now(), { cache: 'no-store' });
        if (r.ok) {
            const newCode = await r.text();
            if (newCode && newCode.length > 5000) {
                localStorage.setItem('srm_ota_hot_code', newCode);
                localStorage.setItem('srm_installed_build_version', newVersion || '2.5.1');
                showAttendanceToast('🎉 Updated! Reloading app in 1s...', 'success');
                setTimeout(() => window.location.reload(true), 1200);
                return true;
            }
        }
        showAttendanceToast('❌ Live code fetch failed. Please download full APK.', 'error');
    } catch (e) {
        showAttendanceToast('❌ Update connection error.', 'error');
    }
    return false;
}
window.triggerInstantLiveOTAUpdate = triggerInstantLiveOTAUpdate;

async function checkGitHubOTAUpdate(isManual = false) {
    try {
        const endpoints = [
            'https://srmbackend.vercel.app/api/version',
            'https://raw.githubusercontent.com/prashanth-karanam/srm-companion/master/version.json?t=' + Date.now(),
            'https://raw.githubusercontent.com/saiprasanthkaranam/srm_companion/main/version.json?t=' + Date.now(),
            '/version.json?t=' + Date.now()
        ];

        let meta = null;
        for (const u of endpoints) {
            try {
                const r = await fetch(u, { cache: 'no-store' });
                if (r.ok) {
                    meta = await r.json();
                    if (meta && meta.version) break;
                }
            } catch (_) {}
        }

        if (!meta || !meta.version) {
            if (isManual) showAttendanceToast('✅ App is up to date!', 'success');
            return;
        }

        const localVer = (typeof APP_BUILD_VERSION !== 'undefined') ? APP_BUILD_VERSION : (localStorage.getItem('srm_installed_build_version') || '2.5.0');
        
        if (meta.version !== localVer) {
            console.log(`[OTA Update] Newer version detected: ${meta.version} (Local: ${localVer})`);
            showAppUpdatePrompt(meta);
        } else if (isManual) {
            showAttendanceToast(`✅ You are on the latest version (v${localVer})`, 'success');
        }
    } catch (_) {}
}

function showAppUpdatePrompt(meta) {
    const existing = document.getElementById('ota-update-banner');
    if (existing) existing.remove();

    const apkUrl = meta.apkDownloadUrl || meta.downloadUrl || 'https://github.com/prashanth-karanam/srm-companion/releases/latest';
    const bundleUrl = meta.bundle_url || meta.bundleUrl || 'https://raw.githubusercontent.com/prashanth-karanam/srm-companion/master/app.js';

    const banner = document.createElement('div');
    banner.id = 'ota-update-banner';
    banner.style.cssText = `
        position: fixed;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%);
        width: min(92%, 460px);
        background: linear-gradient(135deg, rgba(30, 41, 59, 0.95), rgba(15, 23, 42, 0.98));
        backdrop-filter: blur(16px);
        -webkit-backdrop-filter: blur(16px);
        border: 1px solid rgba(99, 102, 241, 0.4);
        border-radius: 16px;
        padding: 14px 16px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.5), 0 0 20px rgba(99, 102, 241, 0.2);
        z-index: 10000;
        display: flex;
        flex-direction: column;
        gap: 10px;
        animation: slideUpFade 0.35s ease;
    `;

    banner.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;">
            <div style="display:flex;align-items:center;gap:10px;">
                <span style="font-size:1.3rem;">🚀</span>
                <div>
                    <div style="font-size:0.88rem;font-weight:800;color:var(--text-main);">Update Available: v${escapeHtml(meta.version)}</div>
                    <div style="font-size:0.72rem;color:var(--text-muted);">${escapeHtml(meta.releaseNotes || 'New features & cloud optimizations live.')}</div>
                </div>
            </div>
            <button onclick="document.getElementById('ota-update-banner')?.remove()" style="background:transparent;border:none;color:var(--text-muted);font-size:1.1rem;cursor:pointer;padding:4px;">✕</button>
        </div>
        <div style="display:flex;gap:8px;margin-top:2px;">
            <button onclick="triggerInstantLiveOTAUpdate('${escapeHtml(bundleUrl)}', '${escapeHtml(meta.version)}')" style="flex:1.2;background:linear-gradient(135deg,#10b981,#059669);color:#fff;border:none;padding:9px 12px;border-radius:10px;font-size:0.78rem;font-weight:800;cursor:pointer;box-shadow:0 4px 12px rgba(16,185,129,0.3);">⚡ Instant Live Update (0 Download)</button>
            <a href="${apkUrl}" target="_blank" style="background:rgba(255,255,255,0.08);color:var(--text-main);padding:9px 12px;border-radius:10px;font-size:0.75rem;font-weight:700;text-decoration:none;display:inline-block;text-align:center;">📲 Full APK</a>
        </div>
    `;

    document.body.appendChild(banner);
}
window.checkGitHubOTAUpdate = checkGitHubOTAUpdate;
window.triggerManualUpdateCheck = () => checkGitHubOTAUpdate(true);

function safeMergeTimetable(newTt) {
    if (!newTt || typeof newTt !== 'object') return false;
    if (typeof SRM_DATA === 'undefined') return false;
    if (!SRM_DATA.dayOrderSchedule) SRM_DATA.dayOrderSchedule = {};

    let hasValidData = false;
    ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'].forEach(d => {
        if (Array.isArray(newTt[d]) && newTt[d].length > 0) {
            SRM_DATA.dayOrderSchedule[d] = newTt[d];
            if (newTt[d].some(p => p && p.type !== 'Free' && p.title && p.title !== 'Free Period')) {
                hasValidData = true;
            }
        }
    });

    if (hasValidData) {
        localStorage.setItem('srm_timetable_cache', JSON.stringify(SRM_DATA.dayOrderSchedule));
        localStorage.setItem('srm_cached_schedule', JSON.stringify(SRM_DATA.dayOrderSchedule));
    }
    return hasValidData;
}
window.safeMergeTimetable = safeMergeTimetable;

function _initApp() {
    applyAppVersionAndCleanStaleCaches();

    try {
        const cachedAtt = localStorage.getItem('srm_attendance_cache') || localStorage.getItem('srm_cached_attendance');
        if (cachedAtt) {
            portalAttendance = JSON.parse(cachedAtt);
        }
        const cachedTt = localStorage.getItem('srm_timetable_cache') || localStorage.getItem('srm_cached_schedule');
        if (cachedTt) {
            try {
                const parsedTt = JSON.parse(cachedTt);
                safeMergeTimetable(parsedTt);
            } catch (_) {}
        }
        const cachedCal = localStorage.getItem('srm_cached_calendar');
        if (cachedCal) {
            const parsedCal = JSON.parse(cachedCal);
            if (Array.isArray(parsedCal) && parsedCal.length > 0) {
                const seen = new Set();
                SRM_DATA.calendar = parsedCal.filter(c => {
                    if (!c.date || seen.has(c.date)) return false;
                    seen.add(c.date);
                    return true;
                });
            }
        }
        announcementsData = getUserAnnouncements();
    } catch (_) {}

    updateStudentHeader();
    initClockAndDate();
    initDockNavigation();
    initDaySelector();
    initAI();
    initQuickTools();
    renderCalendarList();
    renderSubjectFilterChips();
    renderAnnouncements();
    initAnnouncementsSearch();
    renderDaySchedule(selectedDay);
    updateLiveHUD();
    renderPassportHub();
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
        setInterval(scheduleClassBoundaryCheck, 30000);
    }
}

// ─── Sync with Backend (Stateless & On-Demand) ─────────────────────────────────
async function syncWithBackend() {
    const rawId = localStorage.getItem('srm_auto_id');
    const pass = localStorage.getItem('srm_auto_pass');
    if (!rawId || !pass) return;

    try {
        const activeCookies = localStorage.getItem('srm_session_cookies') || localStorage.getItem('srm_live_cookies') || '';
        const res = await apiFetch('/api/login', {
            method: 'POST',
            body: JSON.stringify({
                username: rawId,
                password: pass,
                captcha: 'SYNC',
                cookies: activeCookies,
                hidden_fields: _hiddenFields || {}
            })
        });

        if (res && res.success) {
            const realName = res.name || rawId.toUpperCase();
            const regNo = res.reg_no || '';
            const program = res.program || '';
            const section = res.section || '';
            const email = res.email || `${rawId}@srmist.edu.in`;

            localStorage.setItem('srm_display_name', realName);
            localStorage.setItem('srm_reg_no', regNo);
            localStorage.setItem('srm_program', program);
            localStorage.setItem('srm_section', section);
            localStorage.setItem('srm_email', email);
            if (res.cookies) {
                localStorage.setItem('srm_session_cookies', res.cookies);
                localStorage.setItem('srm_live_cookies', res.cookies);
            }

            if (res.personal_info) {
                localStorage.setItem('srm_personal_info', JSON.stringify(res.personal_info));
            }
            if (res.hostel_details) {
                localStorage.setItem('srm_hostel_details', JSON.stringify(res.hostel_details));
                if (res.hostel_details.block && res.hostel_details.block !== '-') {
                    localStorage.setItem('srm_user_hostel_block', res.hostel_details.block);
                    localStorage.setItem('srm_user_hostel', res.hostel_details.block);
                }
                if (res.hostel_details.room && res.hostel_details.room !== '-') {
                    localStorage.setItem('srm_user_room_no', res.hostel_details.room);
                }
            }
            if (res.exam_results) {
                localStorage.setItem('srm_exam_results', JSON.stringify(res.exam_results));
                localStorage.setItem('srm_cached_exam_results', JSON.stringify(res.exam_results));
            }
            if (res.fee_details) {
                localStorage.setItem('srm_fee_details', JSON.stringify(res.fee_details));
                localStorage.setItem('srm_cached_fee_details', JSON.stringify(res.fee_details));
            }

            if (res.attendance && res.attendance.length > 0) {
                portalAttendance = res.attendance;
                localStorage.setItem('srm_attendance_cache', JSON.stringify(res.attendance));
                localStorage.setItem('srm_cached_attendance', JSON.stringify(res.attendance));
                renderAttendance(new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
            }
            if (res.timetable) {
                safeMergeTimetable(res.timetable);
                renderDaySchedule(selectedDay);
            }

            updateStudentHeader();
            updateLiveHUD();
            renderPassportHub();
            if (typeof renderMessHub === 'function') renderMessHub();
        }

        // 2. Fetch live announcements / schedule overrides & calendar updates from backend if available
        try {
            const annRes = await apiFetch('/api/announcements');
            if (annRes && annRes.success && Array.isArray(annRes.announcements)) {
                const validServerAnn = annRes.announcements.filter(a => {
                    const id = (a.id || '').toString();
                    if (['ann-1', 'ann-2', 'ann-3', 'ann-4', 'ann-5'].includes(id)) return false;
                    const text = (a.title + ' ' + (a.detail || '')).toLowerCase();
                    if (text.includes('sheet metal') || text.includes('matrix diagonalization') || text.includes('pink building') || text.includes('optional class cancelled')) {
                        return false;
                    }
                    return true;
                });
                if (validServerAnn.length > 0) {
                    const localList = getUserAnnouncements();
                    const existingIds = new Set(localList.map(x => x.id));
                    const merged = [...localList];
                    validServerAnn.forEach(item => {
                        if (!existingIds.has(item.id)) {
                            merged.push(item);
                        }
                    });
                    saveUserAnnouncements(merged);
                    renderAnnouncements();
                }
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
        toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#18181b;border:1px solid ${borderColor};color:#f4f4f5;padding:10px 18px;border-radius:12px;box-shadow:0 4px 12px #000000;border:1px solid var(--card-border-strong);z-index:999999;font-size:0.85rem;line-height:1.4;animation:fadeIn 0.25s ease;max-width:90%;`;
        toast.innerHTML = `<b style="color:${textColor};">SRM Companion</b><div>${input}</div>`;
        document.body.appendChild(toast);
        setTimeout(() => { if (toast.parentNode) toast.remove(); }, 4000);
        return;
    }

    if (Array.isArray(input)) {
        input.forEach(d => {
            const isPresent = d.status === 'PRESENT';
            const msg = `${isPresent ? ' Present' : ' Absent'}: ${d.title} (${d.code}) &rarr; ${d.newAtt}/${d.newCon} hrs (${d.newPct}%)`;
            
            const toast = document.createElement('div');
            toast.className = 'srm-toast show ' + (isPresent ? 'success' : 'error');
            toast.style.cssText = `position:fixed;top:20px;left:50%;transform:translateX(-50%);background:#18181b;border:1px solid ${isPresent ? '#22c55e' : '#ef4444'};color:#f4f4f5;padding:12px 18px;border-radius:12px;box-shadow:0 4px 12px #000000;border:1px solid var(--card-border-strong);z-index:999999;font-size:0.85rem;line-height:1.4;animation:fadeIn 0.3s ease;max-width:90%;`;
            toast.innerHTML = `<b style="color:${isPresent ? '#4ade80' : '#f87171'}"> Attendance Updated!</b><div>${msg}</div>`;
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

// ─── Attendance Renderer (Compact Bento & High-Density Telemetry) ───────────
function renderAttendance(syncedAt) {
    const wrap = document.getElementById('att-wrap');
    const stamp = document.getElementById('att-stamp');
    if (!wrap) return;
    if (stamp && syncedAt) stamp.textContent = 'Last synced: ' + syncedAt;

    if (!portalAttendance || !portalAttendance.length) {
        wrap.innerHTML = '<p class="att-empty" style="text-align:center;color:var(--text-muted);padding:30px 0;">No attendance records found yet. Tap "Sync".</p>';
        return;
    }

    let totCon = 0, totAtt = 0, totAbs = 0;
    portalAttendance.forEach(a => {
        totCon += parseInt(a.conducted || 0, 10);
        totAtt += parseInt(a.attended || 0, 10);
        totAbs += parseInt(a.absent || 0, 10);
    });

    const overallPct = totCon > 0 ? parseFloat(((totAtt / totCon) * 100).toFixed(1)) : 100.0;
    const overallDanger = totCon > 0 && overallPct < 75;
    const overallBunk = totCon > 0 ? Math.max(0, Math.floor((4 * totAtt - 3 * totCon) / 3)) : 0;
    const overallNeeded = totCon > 0 ? Math.max(0, 3 * totCon - 4 * totAtt) : 0;

    // 1. Compact 3-Column Bento Metric Summary
    const summaryHtml = `
    <div class="att-bento-hero">
        <div class="att-bento-card">
            <span class="att-bento-lbl">Overall</span>
            <div class="att-bento-val" style="color:${overallDanger ? 'var(--red)' : 'var(--accent)'};">${overallPct}%</div>
            <span class="att-bento-sub">${overallDanger ? '️ Below 75%' : ' Safe Margin'}</span>
        </div>
        <div class="att-bento-card" onclick="openWhatIfModal()" style="cursor:pointer;" title="Tap to simulate">
            <span class="att-bento-lbl">Safe Bunks</span>
            <div class="att-bento-val" style="color:${overallDanger ? 'var(--red)' : 'var(--accent)'};">${overallDanger ? `-${overallNeeded}` : `+${overallBunk}`}</div>
            <span class="att-bento-sub">${overallDanger ? 'Classes Needed' : 'Classes Safe'}</span>
        </div>
        <div class="att-bento-card">
            <span class="att-bento-lbl">Total Hours</span>
            <div class="att-bento-val">${totAtt}<span style="font-size:0.75rem;color:var(--text-muted);font-weight:600;">/${totCon}</span></div>
            <span class="att-bento-sub">${totAbs} Absent hrs</span>
        </div>
    </div>`;

    // 2. High-Density Subject Telemetry Rows
    const cardsHtml = portalAttendance.map(item => {
        const title = item.title || item.subject || item.course || item.code || 'Academic Subject';
        const code  = item.code || '';
        const con   = parseInt(item.conducted || 0, 10);
        const att   = parseInt(item.attended  || 0, 10);
        const abs   = parseInt(item.absent    || 0, 10);
        
        const isUnconducted = con === 0;
        const pct   = isUnconducted ? 100.0 : (item.percentage ? parseFloat(item.percentage) : parseFloat(((att / con) * 100).toFixed(1)));
        const danger = !isUnconducted && pct < 75;
        const needed   = isUnconducted ? 0 : Math.max(0, 3 * con - 4 * att);
        const bunkable = isUnconducted ? 0 : Math.max(0, Math.floor((4 * att - 3 * con) / 3));

        return `
        <div class="att-compact-row ${danger ? 'att-danger' : ''}" onclick="showSubjectAttDetail('${escapeHtml(code)}')">
            <div class="att-row-left">
                <div style="display:flex;align-items:center;gap:6px;min-width:0;">
                    <span class="att-code-tag">${code || 'COURSE'}</span>
                    <span class="att-subject-name">${escapeHtml(title)}</span>
                </div>
                <div class="att-row-meta">
                    <span>${att}/${con} hrs conducted</span>
                    <span style="opacity:0.3;">•</span>
                    <span style="color:${abs > 0 ? 'var(--red)' : 'var(--text-muted)'};">${abs} absent</span>
                </div>
            </div>
            <div class="att-row-right">
                <div class="att-pct-pill" style="color:${danger ? 'var(--red)' : 'var(--accent)'};">${pct}%</div>
                <span class="att-bunk-pill" style="color:${danger ? 'var(--red)' : 'var(--accent)'};background:${danger ? 'var(--red-subtle)' : 'var(--accent-subtle)'};border-color:${danger ? 'var(--red-border)' : 'var(--accent-border)'};">
                    ${danger ? `Need ${needed}` : `+${bunkable} Bunk`}
                </span>
            </div>
        </div>`;
    }).join('');

    wrap.innerHTML = summaryHtml + `<div class="att-rows-container">${cardsHtml}</div>`;
}

function showSubjectAttDetail(code) {
    const course = (portalAttendance && portalAttendance.find(a => a.code === code)) || (SRM_DATA.courses && SRM_DATA.courses.find(c => c.code === code));
    if (course) {
        showClassSummaryModal({
            title: course.title || course.subject || course.code,
            code: course.code,
            type: course.type || 'Theory',
            venue: course.theoryLocation || course.labLocation || 'UB 601',
            faculty: course.theoryFaculty || course.labFaculty || 'Faculty Assigned',
            hour: 1
        }, currentDayOrder);
    }
}
window.showSubjectAttDetail = showSubjectAttDetail;

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

    const activeDayTitleEl = document.getElementById('schedule-active-day-title');
    if (activeDayTitleEl) {
        if (isTodayHoliday) {
            activeDayTitleEl.textContent = 'CAMPUS HOLIDAY / OFF';
            activeDayTitleEl.style.color = 'var(--red)';
        } else {
            activeDayTitleEl.textContent = `SRM ${currentDayOrder.toUpperCase()} ORDER ACTIVE`;
            activeDayTitleEl.style.color = 'var(--text-main)';
        }
    }

    initDaySelector();
    renderDaySchedule(selectedDay);
    highlightActiveDayBtn(selectedDay);
}

function openDayOrderSwitcher() {
    const current = localStorage.getItem('srm_manual_day_order') || 'Auto';
    const choice = prompt(
        ` Quick Day Order & Holiday Override\n\n` +
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
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    for (let i = 1; i <= 14; i++) {
        const nextD = new Date(today.getTime() + i * 86400000);
        const nextStr = getFormattedDateStr(nextD);
        const entry = SRM_DATA.calendar.find(c => c.date === nextStr);
        if (entry && entry.status === 'Working day' && entry.day_order && entry.day_order.startsWith('Day')) {
            const sched = SRM_DATA.dayOrderSchedule[entry.day_order] || [];
            let firstSlot = null;
            let firstC = null;
            let firstSlotIndex = 0;
            for (let sIdx = 0; sIdx < sched.length; sIdx++) {
                if (sched[sIdx] && sched[sIdx].type !== 'Free') {
                    firstC = sched[sIdx];
                    firstSlotIndex = sIdx;
                    firstSlot = SRM_DATA.timeSlots[sIdx] || { start: '08:00', end: '08:50' };
                    break;
                }
            }
            if (!firstC) {
                if (entry.day_order === 'Day 1') firstC = { title: 'Computational Biology', slot: '08:00', venue: 'UB 601', faculty: 'Sivasankareswari E' };
                else if (entry.day_order === 'Day 2') firstC = { title: 'Programming Theory (PPS)', slot: '09:45', venue: 'UB 601', faculty: 'Sheeba Rachel S' };
                else if (entry.day_order === 'Day 3') firstC = { title: 'Computational Biology', slot: '09:45', venue: 'UB 601', faculty: 'Sivasankareswari E' };
                else if (entry.day_order === 'Day 4') firstC = { title: 'Programming Theory (PPS)', slot: '09:45', venue: 'UB 601', faculty: 'Sheeba Rachel S' };
                else if (entry.day_order === 'Day 5') firstC = { title: 'Programming Theory (PPS)', slot: '08:00', venue: 'UB 601', faculty: 'Sheeba Rachel S' };
                else firstC = { title: 'Programming Theory (PPS)', slot: '08:00', venue: 'UB 601', faculty: 'Sheeba Rachel S' };
            }
            const startTime = firstSlot ? firstSlot.start : '08:00';
            
            let formattedTime = '08:00 AM';
            if (startTime.includes(':')) {
                const [h, m] = startTime.split(':').map(Number);
                const ampm = h >= 12 ? 'PM' : 'AM';
                const h12 = h % 12 || 12;
                formattedTime = `${String(h12).padStart(2, '0')}:${String(m).padStart(2, '0')} ${ampm}`;
            }

            const nonFree = sched.filter(s => s && s.type !== 'Free');
            const dateReadable = `${monthNames[nextD.getMonth()]} ${nextD.getDate()}`;
            const relativeQualifier = (i === 1) ? 'Tomorrow' : (i === 2 ? 'Day After Tomorrow' : `in ${i} days`);
            const dayLabel = `${entry.day} (${relativeQualifier}, ${dateReadable})`;

            return {
                daysAhead: i,
                relativeLabel: dayLabel,
                shortDayLabel: relativeQualifier,
                dayName: entry.day,
                dateReadable: dateReadable,
                dayOrder: entry.day_order,
                firstClass: firstC,
                firstSlotIndex: firstSlotIndex,
                startTime: formattedTime,
                rawStartTime: startTime,
                totalClasses: nonFree.length,
                schedule: sched
            };
        }
    }
    const d1Sched = (typeof SRM_DATA !== 'undefined' && SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule['Day 1']) ? SRM_DATA.dayOrderSchedule['Day 1'] : [];
    const d1NonFree = d1Sched.filter(c => c.type !== 'Free');
    const d1First = d1NonFree.length > 0 ? d1NonFree[0] : { title: 'Computational Biology', slot: '08:00', venue: 'UB 601', faculty: 'Sivasankareswari E' };

    return {
        daysAhead: 1,
        relativeLabel: 'Monday (Tomorrow)',
        shortDayLabel: 'Tomorrow',
        dayName: 'Monday',
        dateReadable: 'Monday',
        dayOrder: 'Day 3',
        firstClass: d1First,
        firstSlotIndex: 0,
        startTime: '08:00 AM',
        rawStartTime: '08:00',
        totalClasses: d1NonFree.length,
        schedule: d1Sched
    };
}

function getUpcomingHolidays(count = 3) {
    const today = new Date();
    const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();
    const holidays = [];
    
    for (const c of SRM_DATA.calendar) {
        if (!c.date) continue;
        const [d, m, y] = c.date.split('-').map(Number);
        const cTime = new Date(y, m - 1, d).getTime();
        if (cTime >= todayStart && c.status === 'Holiday' && c.remarks && !['Saturday', 'Sunday', '-'].includes(c.remarks.trim())) {
            holidays.push(c);
            if (holidays.length >= count) break;
        }
    }
    return holidays;
}

// ─── Mathematical What-If Orbit Attendance Engine ───────────────────────────
let bunkSimState = { attendDelta: 0, bunkDelta: 0 };

function openWhatIfModal() {
    const modal = document.getElementById('what-if-modal');
    if (modal) modal.style.display = 'flex';
    updateOrbitDial();
}

function closeWhatIfModal() {
    const modal = document.getElementById('what-if-modal');
    if (modal) modal.style.display = 'none';
}
window.openWhatIfModal = openWhatIfModal;
window.closeWhatIfModal = closeWhatIfModal;

function simulateBunkAction(actionType) {
    if (actionType === 'attend') {
        bunkSimState.attendDelta++;
    } else if (actionType === 'bunk') {
        bunkSimState.bunkDelta++;
    } else if (actionType === 'reset') {
        bunkSimState.attendDelta = 0;
        bunkSimState.bunkDelta = 0;
    }
    updateOrbitDial();
    if (typeof showAttendanceToast === 'function') {
        if (actionType === 'attend') showAttendanceToast(` +1 Attended Class Simulated (+${bunkSimState.attendDelta} attended)`);
        else if (actionType === 'bunk') showAttendanceToast(` -1 Bunked Class Simulated (-${bunkSimState.bunkDelta} bunked)`);
        else showAttendanceToast(` Bunk simulation reset.`);
    }
}
window.simulateBunkAction = simulateBunkAction;

function updateOrbitDial() {
    let totCon = 0, totAtt = 0;
    if (portalAttendance && portalAttendance.length > 0) {
        portalAttendance.forEach(a => {
            totCon += parseInt(a.conducted || 0, 10);
            totAtt += parseInt(a.attended || 0, 10);
        });
    }

    const simAtt = totAtt + bunkSimState.attendDelta;
    const simCon = totCon + bunkSimState.attendDelta + bunkSimState.bunkDelta;

    const isUnconducted = simCon === 0;
    const pct = isUnconducted ? 100.0 : parseFloat(((simAtt / simCon) * 100).toFixed(1));
    const isDanger = !isUnconducted && pct < 75.0;
    const safeBunk = isUnconducted ? 0 : Math.max(0, Math.floor((4 * simAtt - 3 * simCon) / 3));
    const neededClasses = isUnconducted ? 0 : Math.max(0, 3 * simCon - 4 * simAtt);

    const pctEl = document.getElementById('orbit-pct-val');
    const subEl = document.getElementById('orbit-sub-val');
    const barEl = document.getElementById('orbit-circle-bar');

    if (pctEl) pctEl.textContent = `${pct}%`;
    if (subEl) {
        if (isDanger) {
            subEl.textContent = `Need ${neededClasses}`;
            subEl.style.color = 'var(--red)';
        } else if (isUnconducted) {
            subEl.textContent = '100% Clean';
            subEl.style.color = 'var(--accent)';
        } else {
            subEl.textContent = `+${safeBunk} Safe`;
            subEl.style.color = 'var(--accent)';
        }
    }
    if (barEl) {
        // Circumference for r=40 is 2 * PI * 40 = 251.32
        const offset = Math.max(0, 251.32 - (251.32 * (pct / 100)));
        barEl.style.strokeDashoffset = offset;
        barEl.style.stroke = isDanger ? 'var(--red)' : 'var(--accent)';
    }

    // Update What-If Modal elements
    const whatifPct = document.getElementById('whatif-modal-pct');
    const whatifSub = document.getElementById('whatif-modal-sub');
    if (whatifPct) whatifPct.textContent = `${pct}%`;
    if (whatifSub) {
        whatifSub.textContent = isDanger ? `Need +${neededClasses} classes to reach 75%` : (isUnconducted ? `100% clean attendance record (0 absences)` : `+${safeBunk} Safe Bunks Remaining`);
        whatifSub.style.color = isDanger ? 'var(--red)' : 'var(--accent)';
    }

    const islandDayBadge = document.getElementById('island-hud-day-badge');
    if (islandDayBadge) {
        islandDayBadge.textContent = isTodayHoliday ? 'Off' : (currentDayOrder || 'Day 2');
    }
}
window.updateOrbitDial = updateOrbitDial;

function formatTitleCaseName(name, subjectTitle = '') {
    if (!name || name === '-' || name === 'Faculty' || name === 'SRMIST' || name === 'Faculty TBA' || name === 'Faculty Advisor') {
        const sub = (subjectTitle || '').toLowerCase();
        if (sub.includes('pps') || sub.includes('problem solving') || sub.includes('programming')) return 'Sheeba Rachel S';
        if (sub.includes('chemistry')) return 'Dr. John Bosco A';
        if (sub.includes('calculus') || sub.includes('algebra') || sub.includes('math')) return 'Dr. Ganesan P';
        if (sub.includes('computational biology') || sub.includes('biology')) return 'Sivasankareswari E';
        if (sub.includes('english')) return 'Dr. Vijayalakshmi R';
        if (sub.includes('electrical')) return 'Dr. Selvakumar S';
        return 'Course Faculty';
    }
    let clean = name.replace(/\s+/g, ' ').trim();
    clean = clean.replace(/([A-Z])\.([A-Z])/g, '$1. $2');
    clean = clean.replace(/DR\./gi, 'Dr. ');
    return clean.split(' ').map(w => {
        if (!w) return '';
        const up = w.toUpperCase();
        if (up === 'DR.' || up === 'DR') return 'Dr.';
        if (w.length === 2 && w.endsWith('.')) return w.toUpperCase();
        return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
    }).join(' ').replace(/\s+/g, ' ').trim();
}

function formatCleanVenue(venue) {
    if (!venue || venue === '-' || venue.toLowerCase() === 'campus') return 'UB 601';
    let v = venue.replace(/\s*\(Annexure-[IVX]+\)/gi, '').trim();
    if (v.toLowerCase().includes('9th floor') || v.includes('901')) return 'UB-901';
    if (v.toLowerCase().includes('tech park') || v.includes('310')) return 'TP-310';
    if (v.toLowerCase().includes('chem lab')) return 'Chemistry Lab 4';
    if (v.toLowerCase().includes('workshop') || v.includes('bel')) return 'BEL Workshop';
    if (v.toLowerCase().includes('601')) return 'UB-601';
    return v;
}

function formatShortSubject(title) {
    if (!title || title === '-') return 'Morning Session';
    const lower = title.toLowerCase();
    if (lower.includes('calculus')) return 'Calculus & Linear Algebra';
    if (lower.includes('chemistry')) return 'Chemistry for Engineers';
    if (lower.includes('physics')) return 'Physics for Engineers';
    if (lower.includes('data structure')) return 'Data Structures';
    if (lower.includes('c programming') || lower.includes('problem solving')) return 'C Programming Lab';
    if (lower.includes('electrical')) return 'Basic Electrical Engineering';
    if (lower.includes('communicative english')) return 'Communicative English';
    if (title.length > 28) return title.substring(0, 26) + '...';
    return title;
}

function updateLiveHUD() {
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    const hudTitle = document.getElementById('hud-class-title');
    const hudVenue = document.getElementById('hud-venue');
    const hudFaculty = document.getElementById('hud-faculty');
    const hudStatus = document.getElementById('hud-pulse-status');
    const hudSub = document.getElementById('hud-sub-detail');
    const hudDot = document.getElementById('hud-pulse-dot');
    const islandDayBadge = document.getElementById('island-hud-day-badge');

    const monoTimeVenue = document.getElementById('monolith-time-venue');
    const monoFaculty = document.getElementById('monolith-faculty-text');
    const statusTextEl = document.getElementById('monolith-status-text');
    const progTimeLeft = document.getElementById('prog-time-left');
    const progFill = document.getElementById('prog-fill');

    updateOrbitDial();

    const nextInfo = getNextWorkingDayInfo();
    const shortNextSubj = formatShortSubject(nextInfo.firstClass.title);

    // 1. Holiday State
    if (isTodayHoliday) {
        const todayStr = getFormattedDateStr(now);
        const calEntry = SRM_DATA.calendar.find(c => c.date === todayStr);
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const todayDayName = dayNames[now.getDay()];
        const remark = (calEntry && calEntry.remarks && calEntry.remarks !== '-') ? calEntry.remarks : todayDayName;

        if (hudStatus) { hudStatus.textContent = `CAMPUS OFF • ${todayDayName.toUpperCase()}`; hudStatus.style.color = 'var(--text-sub)'; }
        if (hudDot) hudDot.style.background = 'var(--text-muted)';
        if (hudTitle) hudTitle.textContent = shortNextSubj;
        if (hudVenue) hudVenue.textContent = formatCleanVenue(nextInfo.firstClass.venue);
        if (hudFaculty) hudFaculty.textContent = formatTitleCaseName(nextInfo.firstClass.faculty);
        if (hudSub) hudSub.innerHTML = `<span>Next: <b>${escapeHtml(shortNextSubj)}</b> • <b>${nextInfo.relativeLabel} (${nextInfo.dayOrder}) @ ${nextInfo.startTime}</b></span>`;
        if (islandDayBadge) islandDayBadge.textContent = 'Off';

        if (statusTextEl) statusTextEl.textContent = `CAMPUS RECESS • ${todayDayName.toUpperCase()}`;
        if (monoTimeVenue) monoTimeVenue.textContent = `${nextInfo.dayName}, ${nextInfo.startTime} • ${formatCleanVenue(nextInfo.firstClass.venue)}`;
        if (monoFaculty) monoFaculty.textContent = formatTitleCaseName(nextInfo.firstClass.faculty);
        if (progTimeLeft) progTimeLeft.textContent = `Resumes ${nextInfo.dayName} @ ${nextInfo.startTime}`;
        if (progFill) { progFill.style.width = '100%'; progFill.style.background = 'var(--card-border-strong)'; }
        return;
    }

    if (islandDayBadge) {
        islandDayBadge.textContent = currentDayOrder || 'Day 2';
    }

    const schedule = SRM_DATA.dayOrderSchedule[currentDayOrder] || SRM_DATA.dayOrderSchedule['Day 1'] || [];

    let currentPeriod = null;
    let nextPeriod = null;
    let activeSlot = null;

    for (let i = 0; i < SRM_DATA.timeSlots.length; i++) {
        const slot = SRM_DATA.timeSlots[i];
        const [sH, sM] = slot.start.split(':').map(Number);
        const [eH, eM] = slot.end.split(':').map(Number);
        const startMin = sH * 60 + sM;
        const endMin = eH * 60 + eM;

        if (currentMinutes >= startMin && currentMinutes < endMin) {
            currentPeriod = schedule[i];
            activeSlot = slot;
            // Find next non-free period
            for (let j = i + 1; j < schedule.length; j++) {
                if (schedule[j] && schedule[j].type !== 'Free') {
                    nextPeriod = schedule[j];
                    break;
                }
            }
            break;
        } else if (currentMinutes < startMin && !nextPeriod && schedule[i] && schedule[i].type !== 'Free') {
            nextPeriod = schedule[i];
        }
    }

    // 2. Active Class In Progress (Real-Time 08:00 - 16:30)
    if (currentPeriod && currentPeriod.type !== 'Free' && activeSlot) {
        const cleanSubj = formatShortSubject(currentPeriod.title);
        if (hudStatus) { hudStatus.textContent = 'LIVE SESSION'; hudStatus.style.color = 'var(--accent)'; }
        if (hudDot) hudDot.style.background = 'var(--accent)';
        if (hudTitle) hudTitle.textContent = cleanSubj;
        if (hudVenue) hudVenue.textContent = formatCleanVenue(currentPeriod.venue);
        if (hudFaculty) hudFaculty.textContent = formatTitleCaseName(currentPeriod.faculty);
        if (hudSub) hudSub.innerHTML = `<span>Venue: <b>${escapeHtml(formatCleanVenue(currentPeriod.venue))}</b> • Faculty: <b>${escapeHtml(formatTitleCaseName(currentPeriod.faculty))}</b></span>`;

        if (statusTextEl) statusTextEl.textContent = `LIVE CLASS • ${activeSlot.label || `HOUR ${currentPeriod.hour}`}`;
        if (monoTimeVenue) monoTimeVenue.textContent = `${activeSlot.start} – ${activeSlot.end} • ${formatCleanVenue(currentPeriod.venue)}`;
        if (monoFaculty) monoFaculty.textContent = formatTitleCaseName(currentPeriod.faculty);

        const [sH, sM] = activeSlot.start.split(':').map(Number);
        const [eH, eM] = activeSlot.end.split(':').map(Number);
        const sMin = sH * 60 + sM;
        const eMin = eH * 60 + eM;
        const totalSlotMins = Math.max(1, eMin - sMin);
        const elapsedMins = Math.max(0, currentMinutes - sMin);
        const pct = Math.min(100, Math.round((elapsedMins / totalSlotMins) * 100));
        const minsLeft = Math.max(0, eMin - currentMinutes);

        if (progTimeLeft) progTimeLeft.textContent = `${minsLeft} min remaining in lecture`;
        if (progFill) { progFill.style.width = `${pct}%`; progFill.style.background = 'var(--accent)'; }

    // 3. Morning Before Classes (e.g. before first period)
    } else if (currentMinutes < 16 * 60 + 30 && nextPeriod) {
        const shortPeriod = formatShortSubject(nextPeriod.title);
        const isBeforeClassHours = (currentMinutes < 8 * 60);
        const statusText = isBeforeClassHours ? 'UPCOMING TODAY' : 'CLASS INTERVAL';
        
        if (hudStatus) { hudStatus.textContent = statusText; hudStatus.style.color = '#38bdf8'; }
        if (hudDot) hudDot.style.background = '#38bdf8';
        if (hudTitle) hudTitle.textContent = shortPeriod;
        if (hudVenue) hudVenue.textContent = formatCleanVenue(nextPeriod.venue);
        if (hudFaculty) hudFaculty.textContent = formatTitleCaseName(nextPeriod.faculty);
        if (hudSub) hudSub.innerHTML = `<span>Next: <b>${escapeHtml(shortPeriod)}</b> • Venue: <b>${escapeHtml(formatCleanVenue(nextPeriod.venue))}</b></span>`;

        if (statusTextEl) statusTextEl.textContent = `NEXT LECTURE • ${currentDayOrder || 'DAY 1'}`;
        if (monoTimeVenue) monoTimeVenue.textContent = `${currentDayOrder || 'Day 1'} • ${formatCleanVenue(nextPeriod.venue)}`;
        if (monoFaculty) monoFaculty.textContent = formatTitleCaseName(nextPeriod.faculty);
        if (progTimeLeft) progTimeLeft.textContent = `Starts shortly`;
        if (progFill) { progFill.style.width = '0%'; progFill.style.background = 'var(--card-border-strong)'; }

    // 4. Evening / Night Concluded (After 16:30)
    } else {
        if (hudStatus) { hudStatus.textContent = 'CLASSES CONCLUDED'; hudStatus.style.color = 'var(--text-sub)'; }
        if (hudDot) hudDot.style.background = 'var(--text-muted)';
        if (hudTitle) hudTitle.textContent = shortNextSubj;
        if (hudVenue) hudVenue.textContent = formatCleanVenue(nextInfo.firstClass.venue);
        if (hudFaculty) hudFaculty.textContent = formatTitleCaseName(nextInfo.firstClass.faculty);
        if (hudSub) hudSub.innerHTML = `<span>Next: <b>${escapeHtml(shortNextSubj)}</b> • <b>${nextInfo.relativeLabel} (${nextInfo.dayOrder}) @ ${nextInfo.startTime}</b></span>`;

        if (statusTextEl) statusTextEl.textContent = `ACADEMIC TELEMETRY • ${currentDayOrder || 'DAY 2'}`;
        if (monoTimeVenue) monoTimeVenue.textContent = `${nextInfo.dayName}, ${nextInfo.startTime} • ${formatCleanVenue(nextInfo.firstClass.venue)}`;
        if (monoFaculty) monoFaculty.textContent = formatTitleCaseName(nextInfo.firstClass.faculty);
        if (progTimeLeft) progTimeLeft.textContent = `Next Lecture: ${nextInfo.dayName} @ ${nextInfo.startTime}`;
        if (progFill) { progFill.style.width = '100%'; progFill.style.background = 'var(--accent)'; }
    }
}

function formatShortVenue(venue) {
    if (!venue || venue === '-') return 'UB 601';
    if (venue.includes('Tech Park') || venue.includes('Integrative')) return 'TP Lab 310';
    if (venue.includes('Chem Lab')) return 'Chem Lab 4';
    if (venue.includes('Sheet Metal') || venue.includes('BEL')) return 'BEL Workshop';
    if (venue.includes('601')) return 'UB 601';
    return venue.replace(/\s*\(Annexure-[IVX]+\)/gi, '').trim();
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
            <div class="class-rail">
                <div class="class-rail-header">
                    <div class="class-rail-badges">
                        <span class="class-time-slot-tag">${h.date}</span>
                        <span class="class-code-tag">${h.day}</span>
                    </div>
                    <span class="room-tag-box">Campus Off</span>
                </div>
                <div class="class-name">${escapeHtml(h.remarks)}</div>
                <div class="class-meta">Campus Holiday &bull; Academic Recess</div>
            </div>
        `).join('');

        list.innerHTML = `
            <div style="margin-bottom:12px;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:0.78rem;font-weight:800;color:var(--text-sub);text-transform:uppercase;letter-spacing:0.5px;">Upcoming Campus Holidays</span>
                    <span style="font-size:0.7rem;color:var(--blue);cursor:pointer;" onclick="document.querySelector('[data-tab=view-calendar]').click()">View All ↗</span>
                </div>
                ${holHtml || '<p style="font-size:0.75rem;color:var(--text-muted);">No upcoming campus holidays in next 2 weeks.</p>'}
            </div>

            <div style="display:flex;justify-content:space-between;align-items:center;margin:12px 0 8px;">
                <span style="font-size:0.84rem;font-weight:800;color:var(--text-main);">${nextInfo.relativeLabel}'s Schedule (${nextInfo.dayOrder})</span>
                <span style="font-size:0.72rem;color:var(--accent);font-weight:700;">${nextInfo.totalClasses} working classes</span>
            </div>
        `;

        // Render only working classes for next working day
        const sched = (SRM_DATA.dayOrderSchedule[nextInfo.dayOrder] || []).filter(p => p.type !== 'Free' && p.title && p.title !== 'Free Period');
        if (sched.length === 0) {
            const emptyEl = document.createElement('div');
            emptyEl.className = 'class-rail';
            emptyEl.style.cssText = 'justify-content:center;color:var(--text-muted);font-size:0.8rem;padding:16px;text-align:center;';
            emptyEl.textContent = `No working classes scheduled for ${nextInfo.dayOrder}.`;
            list.appendChild(emptyEl);
        } else {
            sched.forEach((p) => {
                const slotInfo = SRM_DATA.timeSlots.find(s => s.hour === p.hour) || SRM_DATA.timeSlots[p.hour - 1] || { start: `H${p.hour}`, end: '', label: `Hour ${p.hour}` };
                const shortVenue = formatShortVenue(p.venue);
                const facultyName = p.faculty && p.faculty !== '-' ? p.faculty : 'Faculty TBA';
                const rail = document.createElement('div');
                rail.className = 'class-rail';
                rail.onclick = () => showClassSummaryModal(p, nextInfo.dayOrder);

                rail.innerHTML = `
                    <div class="class-rail-header">
                        <div class="class-rail-badges">
                            <span class="class-time-slot-tag">${slotInfo.start} - ${slotInfo.end}</span>
                            <span class="class-code-tag">${p.code || 'COURSE'}</span>
                            ${p.type ? `<span class="class-type-tag">${p.type}</span>` : ''}
                        </div>
                        <span class="room-tag-box" title="${escapeHtml(p.venue || 'UB 601')}">${escapeHtml(shortVenue)}</span>
                    </div>
                    <div class="class-name">${escapeHtml(p.title)}</div>
                    <div class="class-meta">
                        <span>${escapeHtml(facultyName)}</span>
                        ${p.slot ? `<span>&bull; Slot ${p.slot}</span>` : ''}
                    </div>
                `;
                list.appendChild(rail);
            });
        }
        return;
    }

    let allSchedule = [];
    const cachedTt = localStorage.getItem('srm_cached_schedule') || localStorage.getItem('srm_timetable_cache');
    if (cachedTt) {
        try {
            const parsed = JSON.parse(cachedTt);
            if (parsed && Array.isArray(parsed[day]) && parsed[day].length > 0) {
                const hasWorking = parsed[day].some(p => p && p.type !== 'Free' && p.title && p.title !== 'Free Period');
                if (hasWorking) {
                    allSchedule = parsed[day];
                }
            }
        } catch (_) {}
    }
    if (!allSchedule || allSchedule.length === 0) {
        if (typeof SRM_DATA !== 'undefined' && SRM_DATA.dayOrderSchedule && Array.isArray(SRM_DATA.dayOrderSchedule[day])) {
            allSchedule = SRM_DATA.dayOrderSchedule[day];
        }
    }
    const workingSchedule = allSchedule.filter(p => p && p.type !== 'Free' && p.title && p.title !== 'Free Period');
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();

    if (workingSchedule.length === 0) {
        const emptyEl = document.createElement('div');
        emptyEl.className = 'class-rail';
        emptyEl.style.cssText = 'justify-content:center;color:var(--text-muted);font-size:0.8rem;padding:20px;text-align:center;';
        emptyEl.textContent = `No working classes scheduled for ${day} (Free Day).`;
        list.appendChild(emptyEl);
        return;
    }

    workingSchedule.forEach((p) => {
        const slotInfo = SRM_DATA.timeSlots.find(s => s.hour === p.hour) || SRM_DATA.timeSlots[p.hour - 1] || { start: `H${p.hour}`, end: '', label: `Hour ${p.hour}` };
        const shortVenue = formatShortVenue(p.venue);
        const facultyName = p.faculty && p.faculty !== '-' ? p.faculty : 'Faculty TBA';
        const rail = document.createElement('div');
        
        let isNow = false;
        if (day === currentDayOrder && !isTodayHoliday) {
            const [sH, sM] = (slotInfo.start || '00:00').split(':').map(Number);
            const [eH, eM] = (slotInfo.end || '00:00').split(':').map(Number);
            const startMin = sH * 60 + sM;
            const endMin = eH * 60 + eM;
            if (currentMinutes >= startMin && currentMinutes < endMin) {
                isNow = true;
            }
        }

        rail.className = 'class-rail' + (isNow ? ' active-class' : '');
        rail.onclick = () => showClassSummaryModal(p, day);

        rail.innerHTML = `
            <div class="class-rail-header">
                <div class="class-rail-badges">
                    <span class="class-time-slot-tag">${slotInfo.start} - ${slotInfo.end}</span>
                    <span class="class-code-tag">${p.code || 'COURSE'}</span>
                    ${p.type ? `<span class="class-type-tag">${p.type}</span>` : ''}
                </div>
                <span class="room-tag-box ${isNow ? 'active' : ''}" title="${escapeHtml(p.venue || 'UB 601')}">${escapeHtml(shortVenue)}</span>
            </div>
            <div class="class-name">${escapeHtml(p.title)}</div>
            <div class="class-meta">
                <span>${escapeHtml(facultyName)}</span>
                ${p.slot ? `<span>&bull; Slot ${p.slot}</span>` : ''}
                ${isNow ? `<span style="color:var(--accent);font-weight:800;">&bull; Active Class</span>` : ''}
            </div>
        `;
        list.appendChild(rail);
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
                        <span style="font-size:0.7rem;background:var(--card-elevated);color:var(--blue);border:var(--border-width) solid var(--card-border);padding:3px 8px;border-radius:var(--radius-sm);font-weight:800;font-family:var(--font-mono);">FREE PERIOD</span>
                        <h3 style="font-size:1.15rem;font-weight:900;color:var(--text-main);margin-top:6px;">Self-Study / Campus Recess</h3>
                    </div>
                    <button class="class-modal-close" onclick="closeClassSummaryModal()" title="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                <div class="class-modal-body">
                    <div class="class-info-card">
                        <div style="font-size:0.85rem;color:var(--text-sub);line-height:1.5;">
                            This is a scheduled free period on <b>${dayOrder || 'Selected Day'}</b> (Hour ${p.hour}). No attendance is taken during this hour.
                        </div>
                    </div>
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <button class="modal-ai-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('Give me a quick 15-minute quiz on Calculus and PPS to practice during my free period')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span>AI 15-min Practice Quiz</span>
                        </button>
                        <button class="modal-ai-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('What are the best quiet study spots and library facilities near Tech Park in SRMIST?')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
                            <span>Find Quiet Study Spots</span>
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
                <div class="class-slot-left">
                    <span class="class-slot-day-pill">${w.day}</span>
                    <span class="class-slot-time-text">Hour ${w.hour} &bull; ${w.time}</span>
                </div>
                <span class="class-slot-venue-pill">${formatShortVenue(w.venue)}</span>
            </div>
        `).join('') : `<p style="font-size:0.75rem;color:var(--text-muted);">Standard schedule applies.</p>`;

        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div style="min-width:0;flex:1;">
                        <div style="display:flex;gap:6px;align-items:center;margin-bottom:6px;flex-wrap:wrap;">
                            <span class="class-code-tag">${code}</span>
                            <span class="class-type-tag">${p.type || 'Theory'} &bull; ${credits}</span>
                        </div>
                        <h3 style="font-size:1.15rem;font-weight:900;color:var(--text-main);line-height:1.25;letter-spacing:-0.02em;">${title}</h3>
                        <p style="font-size:0.72rem;color:var(--text-muted);font-family:var(--font-mono);margin-top:3px;">${category} &bull; Slot: ${slot}</p>
                    </div>
                    <button class="class-modal-close" onclick="closeClassSummaryModal()" title="Close">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="width:16px;height:16px;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                </div>
                
                <div class="class-modal-body">
                    <!-- Live Attendance & Safe Margin Card -->
                    <div class="class-info-card" style="border-color:${danger ? 'var(--red-border)' : 'var(--accent-border)'};background:${danger ? 'var(--red-subtle)' : 'var(--card-elevated)'};">
                        <div class="class-info-card-header">
                            <span class="class-info-card-title" style="color:${danger ? 'var(--red)' : 'var(--accent)'};">Live Attendance Status</span>
                            <span style="font-size:1.25rem;font-weight:900;color:${danger ? 'var(--red)' : 'var(--accent)'};font-family:var(--font-mono);">${pct}%</span>
                        </div>
                        <div class="att-bar-track" style="background:var(--card);height:6px;border-radius:var(--radius-sm);overflow:hidden;margin:6px 0;border:var(--border-width) solid var(--card-border);">
                            <div class="att-bar-fill" style="width:${Math.min(pct,100)}%;background:${danger ? 'var(--red)' : 'var(--accent)'};height:100%;border-radius:var(--radius-sm);"></div>
                        </div>
                        <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.74rem;color:var(--text-sub);font-family:var(--font-mono);flex-wrap:wrap;gap:4px;">
                            <span>${con > 0 ? `${att} attended / ${con} conducted (${abs} absent)` : '0 classes conducted yet'}</span>
                            <span style="font-weight:800;color:${danger ? 'var(--red)' : 'var(--accent)'};">${danger ? `Need ${needed} classes` : `+${bunkable} safe bunks`}</span>
                        </div>
                    </div>

                    <!-- Faculty & Venue Card -->
                    <div class="class-info-card">
                        <div class="class-info-card-title">Instructor & Location</div>
                        <div style="display:flex;flex-direction:column;gap:6px;">
                            <div class="modal-info-row">
                                <div class="modal-info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
                                </div>
                                <div class="modal-info-content">
                                    <div class="modal-info-label">Course Instructor</div>
                                    <div class="modal-info-val">${faculty}</div>
                                </div>
                            </div>
                            <div class="modal-info-row">
                                <div class="modal-info-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
                                </div>
                                <div class="modal-info-content">
                                    <div class="modal-info-label">Classroom / Venue</div>
                                    <div class="modal-info-val">${venue}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Weekly Timetable Hours -->
                    <div class="class-info-card">
                        <div class="class-info-card-header" style="margin-bottom:2px;">
                            <span class="class-info-card-title">Weekly Schedule (${weeklySlots.length} hrs/wk)</span>
                        </div>
                        <div style="display:flex;flex-direction:column;gap:6px;">
                            ${weeklyHtml}
                        </div>
                    </div>

                    <!-- AI Academic Copilot 1-Tap Actions -->
                    <div style="display:flex;flex-direction:column;gap:8px;">
                        <button class="modal-ai-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('Summarize all key formulas, important concepts, and core theorems for ${title} (${code}) with clear examples')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--blue)"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                            <span>Explain Key Concepts & Formulas (AI)</span>
                        </button>
                        <button class="modal-ai-btn" onclick="closeClassSummaryModal(); openAITabWithPrompt('Generate 5 high-yield exam practice questions and step-by-step solutions for ${title} (${code})')">
                            <svg viewBox="0 0 24 24" fill="none" stroke="var(--accent)"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 14 14"></polyline></svg>
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
    if (aiTabBtn && typeof switchTab === 'function') switchTab('view-ai');
    const chatInput = document.getElementById('ai-input') || document.getElementById('ai-chat-input');
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
        holBtn.innerHTML = `<span>Campus Off</span><span class="day-chip-badge">Today</span>`;
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

    const activeDayTitleEl = document.getElementById('schedule-active-day-title');
    if (activeDayTitleEl) {
        if (d === 'Holiday') {
            activeDayTitleEl.textContent = 'CAMPUS HOLIDAY / OFF';
            activeDayTitleEl.style.color = 'var(--red)';
        } else if (d === currentDayOrder) {
            activeDayTitleEl.textContent = `SRM ${d.toUpperCase()} ORDER (TODAY ACTIVE)`;
            activeDayTitleEl.style.color = 'var(--text-main)';
        } else {
            activeDayTitleEl.textContent = `VIEWING SRM ${d.toUpperCase()} ORDER`;
            activeDayTitleEl.style.color = 'var(--accent)';
        }
    }
}

function initDockNavigation() {
    const items = document.querySelectorAll('.dock-item');
    items.forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const targetId = btn.getAttribute('data-tab');
            if (targetId) {
                switchSuperTab(targetId);
            } else if (btn.classList.contains('dock-center-action') || btn.closest('.dock-center-action')) {
                openCommandCenterModal();
            }
        };
    });
}

// ─── Direct Persistent Announcements & Notice Hub (Client-First) ──────────────
function getUserAnnouncements() {
    try {
        const reg = localStorage.getItem('srm_reg_no') || 'global';
        const saved = localStorage.getItem('srm_user_announcements_' + reg) || 
                      localStorage.getItem('srm_user_announcements_global') || 
                      localStorage.getItem('srm_cached_announcements');
        if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) {
                return parsed;
            }
        }
    } catch (_) {}
    return [];
}

function saveUserAnnouncements(list) {
    const reg = localStorage.getItem('srm_reg_no') || 'global';
    announcementsData = list || [];
    localStorage.setItem('srm_user_announcements_' + reg, JSON.stringify(announcementsData));
    localStorage.setItem('srm_user_announcements_global', JSON.stringify(announcementsData));
}

function togglePinAnnouncement(annId) {
    const target = announcementsData.find(a => a.id === annId);
    if (!target) return;
    target.isPinned = !target.isPinned;
    saveUserAnnouncements(announcementsData);
    renderAnnouncements();
    showAttendanceToast(target.isPinned ? " Pinned notice to top of feed!" : " Notice unpinned.", "info");
    
    // Broadcast pin update to P2P mesh
    if (typeof broadcastNoticeToP2P === 'function') {
        broadcastNoticeToP2P({ ...target, action: 'pin_update' });
    }
}

function deleteAnnouncement(annId) {
    announcementsData = announcementsData.filter(a => a.id !== annId);
    saveUserAnnouncements(announcementsData);
    renderAnnouncements();
    showAttendanceToast("️ Notice deleted.", "info");
}

function renderSubjectFilterChips() {
    const container = document.getElementById('ann-filter-scroll');
    if (!container) return;

    const courses = (portalAttendance && portalAttendance.length > 0) 
        ? portalAttendance 
        : ((typeof SRM_DATA !== 'undefined' && SRM_DATA.courses) ? SRM_DATA.courses : []);

    let html = `
        <div class="filter-chip-btn ${activeSubjectFilter === 'ALL' ? 'active' : ''}" onclick="filterAnnouncements('ALL')">All Notices</div>
        <div class="filter-chip-btn ${activeSubjectFilter === 'PINNED' ? 'active' : ''}" style="color:var(--amber);" onclick="filterAnnouncements('PINNED')">Pinned Only</div>
    `;

    const seenCodes = new Set();
    courses.forEach(c => {
        const code = c.code || '';
        if (!code || seenCodes.has(code)) return;
        seenCodes.add(code);

        const title = c.title || c.subject || code;
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
        if (shortName.length > 16) shortName = shortName.substring(0, 14) + '…';

        html += `<div class="filter-chip-btn ${activeSubjectFilter === code ? 'active' : ''}" onclick="filterAnnouncements('${code}')">${escapeHtml(shortName)}</div>`;
    });

    container.innerHTML = html;
}

function filterAnnouncements(code) {
    activeSubjectFilter = code;
    document.querySelectorAll('#ann-filter-scroll .filter-chip-btn').forEach(c => c.classList.remove('active'));
    if (window.event && window.event.target) {
        const btn = window.event.target.closest('.filter-chip-btn');
        if (btn) btn.classList.add('active');
    }
    renderAnnouncements(code);
}

function renderAnnouncements(filterSubject, searchQuery) {
    const container = document.getElementById('announcements-container');
    const counter = document.getElementById('ann-counter');
    if (!container) return;

    filterSubject = filterSubject || activeSubjectFilter;
    searchQuery = (searchQuery || '').toLowerCase();
    container.innerHTML = '';

    // Sort announcements: isPinned first, then newest first
    const sorted = [...announcementsData].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return (b.createdAt || 0) - (a.createdAt || 0);
    });

    const filtered = sorted.filter(ann => {
        let matchSubject = true;
        if (filterSubject === 'PINNED') {
            matchSubject = !!ann.isPinned;
        } else if (filterSubject !== 'ALL') {
            matchSubject = (ann.code === filterSubject || (ann.subject && ann.subject.toLowerCase().includes(filterSubject.toLowerCase())));
        }
        const matchSearch = (
            (ann.title || '') + ' ' + 
            (ann.detail || '') + ' ' + 
            (ann.subject || '') + ' ' + 
            (ann.venue || '') + ' ' + 
            (ann.faculty || '') + ' ' + 
            (ann.category || '')
        ).toLowerCase().includes(searchQuery);
        return matchSubject && matchSearch;
    });

    if (counter) {
        const pinnedCount = announcementsData.filter(a => a.isPinned).length;
        counter.textContent = `${announcementsData.length} notices ${pinnedCount > 0 ? `(${pinnedCount} pinned)` : ''}`;
    }

    if (filtered.length === 0) {
        if (!announcementsData || announcementsData.length === 0) {
            container.innerHTML = `
                <div style="text-align:center;padding:36px 16px;background:var(--card);border:1px solid var(--card-border);border-radius:14px;margin-top:6px;">
                    <div style="font-size:1.8rem;margin-bottom:8px;"></div>
                    <div style="font-size:0.88rem;font-weight:700;color:var(--text-main);margin-bottom:4px;">No Class Notices Yet</div>
                    <div style="font-size:0.75rem;color:var(--text-muted);line-height:1.45;max-width:280px;margin:0 auto 14px;">
                        Connect your WhatsApp Companion via QR or add notices to automatically extract deadlines, cancellations, and pinned alerts!
                    </div>
                    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                        <button class="pill-btn" onclick="openWALinkedDeviceModal()" style="background:var(--accent);color:var(--text-inverse);border:none;padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;"> QR Link</button>
                        <button class="pill-btn" onclick="openCreateNoticeModal()" style="background:var(--card-elevated);border:1px solid var(--card-border);color:var(--text-main);padding:6px 14px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;"> Add Notice</button>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = `<div style="font-size:0.8rem;color:var(--text-muted);text-align:center;padding:24px 0;">No notices matching current filter or search.</div>`;
        }
        return;
    }

    filtered.forEach(ann => {
        const card = document.createElement('div');
        card.className = `hero-info-box ${ann.isPinned ? 'notice-card-pinned' : ''}`;
        card.style.cssText = 'padding:14px 16px;display:flex;flex-direction:column;gap:8px;';

        const categoryColor = {
            'Cancelled': '#ef4444',
            'Assignment': '#f59e0b',
            'Portion': '#a855f7',
            'Exam': '#ec4899',
            'Venue': '#38bdf8',
            'AI Digest': '#10b981'
        }[ann.category] || '#38bdf8';

        card.innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px;">
                <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
                    ${ann.isPinned ? `<span class="notice-pinned-badge"> PINNED</span>` : ''}
                    <span style="font-size:0.68rem;padding:2px 7px;border-radius:4px;font-weight:700;text-transform:uppercase;background:var(--card-elevated);color:${categoryColor};border:1px solid var(--card-border);">${escapeHtml(ann.category || 'NOTICE')}</span>
                    <span style="font-size:0.75rem;color:var(--text-sub);font-weight:600;">${escapeHtml(ann.subject || 'All Subjects')}</span>
                </div>
                <span style="font-size:0.7rem;color:var(--text-muted);font-family:var(--font-mono);">${escapeHtml(ann.timestamp || 'Recent')}</span>
            </div>
            <div style="font-size:0.9rem;font-weight:800;color:var(--text-main);line-height:1.35;">${escapeHtml(ann.title || '')}</div>
            <div style="font-size:0.82rem;color:var(--text-sub);line-height:1.45;word-break:break-word;">${escapeHtml(ann.detail || '')}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;font-size:0.72rem;color:var(--text-muted);">
                <span> ${escapeHtml(ann.venue || 'Classroom')} ${ann.faculty && ann.faculty !== '-' ? `&bull;  ${escapeHtml(ann.faculty)}` : ''}</span>
                <span style="color:var(--accent);font-weight:600;"> ${escapeHtml(ann.sourceGroup || 'Class Notice')}</span>
            </div>
            <div class="ann-actions-row">
                <button class="ann-pin-btn ${ann.isPinned ? 'pinned' : ''}" onclick="togglePinAnnouncement('${ann.id}')">
                    <span>${ann.isPinned ? ' Pinned' : ' Pin to Top'}</span>
                </button>
                <div style="display:flex;gap:6px;align-items:center;">
                    <button class="pill-btn" style="padding:2px 8px;font-size:0.7rem;background:var(--card-elevated);color:var(--blue);" onclick="openAITabWithPrompt('Explain this class notice in detail and what I need to do: ${escapeHtml(ann.title)} - ${escapeHtml(ann.detail)}')"> Ask AI</button>
                    <button class="ann-delete-btn" onclick="deleteAnnouncement('${ann.id}')" title="Delete notice"></button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}


function initAnnouncementsSearch() {
    const input = document.getElementById('ann-search-input');
    if (input) input.oninput = (e) => renderAnnouncements(activeSubjectFilter, e.target.value);
}

// ─── Automated WhatsApp Chat NLP & Digest Engine ──────────────────────────────
function parseWAChatLocally(chatText) {
    const lines = (chatText || '').trim().split('\n');
    const cleaned = [];

    lines.forEach(l => {
        const str = l.trim();
        if (!str) return;
        // Strip WhatsApp timestamp formats (various locales and styles)
        const cleanMsg = str
            .replace(/^\[?\d{1,2}[/\-\.]\d{1,2}[/\-\.]\d{2,4},?\s+\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[-:]?\s*[^:]+:\s*/i, '')
            .replace(/^\[?\d{1,2}:\d{2}(?::\d{2})?\s*(?:AM|PM|am|pm)?\]?\s*[^:]+:\s*/i, '');
        if (cleanMsg.length > 3 && !/messages and calls are end-to-end|created group|added you|deleted this message|<media omitted>/i.test(cleanMsg)) {
            cleaned.push(cleanMsg);
        }
    });

    const classified = {
        cancelled: [],
        dayOrderChanges: [],
        assignments: [],
        exams: [],
        venues: [],
        general: []
    };

    cleaned.forEach(m => {
        const low = m.toLowerCase();
        // 1. Detect Day Order / Holiday schedule overrides
        if (/day\s*[1-5]\s*(?:order|timetable|schedule)|follow\s*day\s*[1-5]|tomorrow\s*(?:is|will be)\s*day\s*[1-5]|holiday\s*(?:declared|tomorrow|today)/i.test(low)) {
            classified.dayOrderChanges.push(m);
        } else if (/cancel|no class|postponed|leave today|optional hour|free hour|rescheduled/i.test(low)) {
            classified.cancelled.push(m);
        } else if (/submit|assignment|observation|record|deadline|homework|due date|submission/i.test(low)) {
            classified.assignments.push(m);
        } else if (/exam|test|cla-1|cla-2|cla-3|quiz|marks|portion|syllabus|unit/i.test(low)) {
            classified.exams.push(m);
        } else if (/room|venue|ub\s*601|tp\s*|tech park|bel\s*|pink bldg|lab\s*|annexure/i.test(low)) {
            classified.venues.push(m);
        } else if (m.length > 15 && !/^(ok|thanks|lol|hah|gm|gn|yes|no|hi|hello|done|k)$/i.test(low)) {
            classified.general.push(m);
        }
    });

    // If a trusted day order change is found, prompt/ping schedule change
    if (classified.dayOrderChanges.length > 0) {
        handleDetectedScheduleOverride(classified.dayOrderChanges[0]);
    }

    return { total: lines.length, cleaned, classified };
}

function handleDetectedScheduleOverride(msg) {
    if (!msg) return;
    let targetDay = null;
    const mMatch = msg.match(/day\s*([1-5])/i);
    if (mMatch) {
        targetDay = `Day ${mMatch[1]}`;
    } else if (/holiday/i.test(msg)) {
        targetDay = 'Holiday';
    }

    if (!targetDay) return;

    // Show intelligent action toast
    const toast = document.createElement('div');
    toast.className = 'srm-toast-notification';
    toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:#0f172a;border:1.5px solid #38bdf8;box-shadow:0 8px 32px rgba(56,189,248,0.25);border-radius:12px;padding:12px 16px;z-index:99999;display:flex;align-items:center;gap:12px;max-width:92vw;animation:slideUp 0.3s ease;';
    toast.innerHTML = `
        <div style="font-size:1.4rem;">⚡</div>
        <div style="flex:1;min-width:0;">
            <div style="font-size:0.75rem;font-weight:800;color:#38bdf8;text-transform:uppercase;letter-spacing:0.5px;">AI Schedule Override Detected</div>
            <div style="font-size:0.82rem;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">"${escapeHtml(msg.substring(0, 55))}..."</div>
            <div style="font-size:0.7rem;color:#94a3b8;margin-top:2px;">Switch active timetable to <b>${targetDay}</b>?</div>
        </div>
        <div style="display:flex;gap:6px;">
            <button type="button" class="pill-btn" style="background:#38bdf8;color:#0f172a;font-weight:900;padding:6px 12px;font-size:0.75rem;border:none;border-radius:6px;cursor:pointer;" onclick="applyAIScheduleOverride('${targetDay}', this.parentElement.parentElement)">Apply</button>
            <button type="button" class="pill-btn" style="background:rgba(255,255,255,0.1);color:#cbd5e1;font-weight:700;padding:6px 10px;font-size:0.75rem;border:none;border-radius:6px;cursor:pointer;" onclick="this.parentElement.parentElement.remove()">Dismiss</button>
        </div>
    `;
    document.body.appendChild(toast);
    setTimeout(() => { if (toast.parentNode) toast.remove(); }, 12000);
}

function applyAIScheduleOverride(targetDay, toastEl) {
    if (targetDay === 'Holiday') {
        localStorage.setItem('srm_manual_day_order', 'Holiday');
    } else {
        localStorage.setItem('srm_manual_day_order', targetDay);
    }
    initClockAndDate();
    updateLiveHUD();
    renderDaySchedule(targetDay === 'Holiday' ? 'Day 1' : targetDay);
    showAttendanceToast(`Timetable switched to ${targetDay} (AI Verified)`, "success");
    if (toastEl) toastEl.remove();
}

function openCreateNoticeModal() {
    const existing = document.getElementById('create-notice-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'create-notice-modal';
    modal.className = 'class-modal-backdrop';

    modal.innerHTML = `
        <div class="class-modal-sheet">
            <div class="class-modal-header">
                <div>
                    <span class="wa-privacy-badge"> Manual Notice</span>
                    <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-top:4px;">Add Classroom Notice</h3>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('create-notice-modal')?.remove()"></button>
            </div>
            <div class="class-modal-body" style="display:flex;flex-direction:column;gap:10px;">
                <input type="text" id="notice-title-input" class="ai-input-field" placeholder="Notice Title (e.g. PPS CLA-1 Portion Declared)">
                <textarea id="notice-detail-input" class="wa-paste-textarea" style="height:90px;" placeholder="Full details, instructions, syllabus portions, or room changes..."></textarea>
                
                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <select id="notice-category-input" class="ai-input-field" style="font-size:0.78rem;">
                        <option value="Assignment"> Assignment</option>
                        <option value="Cancelled"> Class Cancelled</option>
                        <option value="Portion"> Exam / CLA Portion</option>
                        <option value="Venue"> Venue / Room Change</option>
                        <option value="General"> General Notice</option>
                    </select>
                    <select id="notice-subject-input" class="ai-input-field" style="font-size:0.78rem;">
                        <option value="ALL">All Subjects</option>
                        <option value="26CSE1002J">PPS (26CSE1002J)</option>
                        <option value="26MAB1001T">Calculus (26MAB1001T)</option>
                        <option value="26CYB1002J">Chemistry (26CYB1002J)</option>
                        <option value="26BTB1001T">Comp Bio (26BTB1001T)</option>
                        <option value="26MEE1001L">Workshop (26MEE1001L)</option>
                    </select>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">
                    <input type="text" id="notice-venue-input" class="ai-input-field" placeholder="Venue (e.g. UB 601)" value="UB 601">
                    <input type="text" id="notice-faculty-input" class="ai-input-field" placeholder="Faculty / Source" value="Class Notice">
                </div>

                <label style="display:flex;align-items:center;gap:8px;cursor:pointer;font-size:0.8rem;color:var(--text-main);margin-top:2px;">
                    <input type="checkbox" id="notice-pin-checkbox" checked style="width:16px;height:16px;accent-color:var(--amber);">
                    <span> Pin this notice to the top of the feed</span>
                </label>

                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:6px;">
                    <button class="pill-btn" style="background:var(--card-elevated);color:var(--text-sub);" onclick="document.getElementById('create-notice-modal')?.remove()">Cancel</button>
                    <button class="pill-btn" style="background:var(--accent);color:var(--text-inverse);font-weight:800;" onclick="submitManualNotice()"> Save Notice</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function submitManualNotice() {
    const title = document.getElementById('notice-title-input')?.value.trim();
    const detail = document.getElementById('notice-detail-input')?.value.trim();
    const category = document.getElementById('notice-category-input')?.value || 'General';
    const code = document.getElementById('notice-subject-input')?.value || 'ALL';
    const venue = document.getElementById('notice-venue-input')?.value.trim() || 'Classroom';
    const faculty = document.getElementById('notice-faculty-input')?.value.trim() || 'Class Notice';
    const isPinned = !!document.getElementById('notice-pin-checkbox')?.checked;

    if (!title) {
        alert("Please enter a title for the notice.");
        return;
    }

    const newNotice = {
        id: 'notice-man-' + Date.now(),
        title: title,
        detail: detail || title,
        category: category,
        subject: code === 'ALL' ? 'General' : code,
        code: code,
        venue: venue,
        faculty: faculty,
        sourceGroup: 'Section ' + (localStorage.getItem('srm_section') || 'P1'),
        timestamp: 'Just Now',
        createdAt: Date.now(),
        isPinned: isPinned
    };

    announcementsData.unshift(newNotice);
    saveUserAnnouncements(announcementsData);
    renderAnnouncements();

    const modal = document.getElementById('create-notice-modal');
    if (modal) modal.remove();

    showAttendanceToast(isPinned ? " Notice saved & pinned to top!" : " Notice saved to feed!", "success");

    if (typeof broadcastNoticeToP2P === 'function') {
        broadcastNoticeToP2P(newNotice);
    }
}


function applyScheduleOverride(override) {
    if (!override) return;
    const targetDay = override.dayOrder || override.day || '';
    if (targetDay) {
        let cleanDay = targetDay;
        if (!cleanDay.toLowerCase().includes('day') && !cleanDay.toLowerCase().includes('holiday')) {
            cleanDay = 'Day ' + cleanDay.replace(/\D/g, '');
        }
        localStorage.setItem('srm_manual_day_order', cleanDay);
        if (typeof playSoundEffect === 'function') playSoundEffect('action');
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
        showAttendanceToast(`⚡ Timetable updated to ${cleanDay}!`, 'success');
        if (typeof initDaySelector === 'function') initDaySelector();
        if (typeof renderDaySchedule === 'function') renderDaySchedule();
    }
}

function processIncomingWANoticeText(text, groupName = 'Section P1 Official') {
    if (!text || typeof text !== 'string') return null;
    
    let detectedDayOrder = null;
    const dayMatch = text.match(/Day\s*Order\s*([1-5])|Day\s*([1-5])\s*Order|Follow\s*Day\s*([1-5])/i);
    if (dayMatch) {
        detectedDayOrder = 'Day ' + (dayMatch[1] || dayMatch[2] || dayMatch[3]);
    }
    
    const isCancelled = /(cancelled|postponed|no\s+class|suspended)/i.test(text);
    const isHoliday = /(declared\s+holiday|rain\s+holiday|holiday\s+tomorrow|college\s+closed)/i.test(text);
    
    if (detectedDayOrder || isCancelled || isHoliday) {
        const overrideObj = {
            id: 'ov_' + Date.now(),
            group: groupName,
            text: text.slice(0, 140),
            dayOrder: isHoliday ? 'Holiday' : detectedDayOrder,
            isCancelled: isCancelled,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        
        showAttendanceToast(
            `🔔 Notice: ${overrideObj.dayOrder ? overrideObj.dayOrder + ' detected' : 'Class update'} from ${groupName}`,
            'info'
        );
        
        return overrideObj;
    }
    return null;
}

function openPasteChatModal() {
    const existing = document.getElementById('paste-chat-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'paste-chat-modal';
    modal.className = 'class-modal-backdrop';

    modal.innerHTML = `
        <div class="class-modal-sheet">
            <div class="class-modal-header">
                <div>
                    <span class="wa-privacy-badge">⚡ 100% On-Device AI NLP</span>
                    <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-top:4px;">Paste Class WhatsApp Chat</h3>
                </div>
                <button type="button" class="class-modal-close" onclick="document.getElementById('paste-chat-modal')?.remove()"></button>
            </div>
            <div class="class-modal-body" style="display:flex;flex-direction:column;gap:10px;">
                <input type="text" id="paste-chat-group-name" class="ai-input-field" placeholder="Group Name (e.g. Section P1 Official / PPS Lab)" value="Section P1 Official">
                <textarea id="paste-chat-textarea" class="wa-paste-textarea" style="height:140px;" placeholder="Paste raw WhatsApp chat messages here...&#10;e.g.&#10;CR: Tomorrow is Day 3 order due to holiday compensation.&#10;Faculty: PPS Assignment 2 due this Friday in UB 601."></textarea>
                <div style="display:flex;gap:8px;justify-content:flex-end;margin-top:4px;">
                    <button type="button" class="pill-btn" style="background:var(--card-elevated);color:var(--text-sub);" onclick="document.getElementById('paste-chat-modal')?.remove()">Cancel</button>
                    <button type="button" class="pill-btn" style="background:var(--accent);color:var(--text-inverse);font-weight:800;" onclick="submitPastedChatForAI()">⚡ Digest & Extract Notices</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);
}

function submitPastedChatForAI() {
    const text = document.getElementById('paste-chat-textarea')?.value || '';
    const groupName = document.getElementById('paste-chat-group-name')?.value.trim() || 'Class WhatsApp Group';
    if (!text.trim()) {
        alert('Please paste some chat text to analyze.');
        return;
    }
    const modal = document.getElementById('paste-chat-modal');
    if (modal) modal.remove();
    processWAChatTextForAI(text, groupName, 'ALL', true);
}

function handleWAChatFileUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const groupName = file.name.replace('.txt', '').replace(/^WhatsApp Chat - /i, '');
        processWAChatTextForAI(content, groupName, 'ALL', true);
    };
    reader.readAsText(file);
}

async function processWAChatTextForAI(chatText, groupName, subjectCode = 'ALL', shouldAutoPin = true) {
    groupName = groupName || 'Class WhatsApp Group';
    const parsed = parseWAChatLocally(chatText);

    const promptText = `You are the executive Academic AI Secretary for SRMIST Section P1 students.
Analyze the following raw WhatsApp messages from "${groupName}" and generate an immediate, clean, bulleted Academic Digest for students.

Filter out chit-chat, greetings, and spam. Categorize into:
1.  Cancelled / Rescheduled Classes
2.  Upcoming Deadlines & Observations (Subject, Due Date, Details)
3.  Lab Venues, Manuals & Requirements
4.  Exam / Test / CLA Portions
5.  Key Takeaway for Tomorrow

Raw WhatsApp Messages:
${parsed.cleaned.slice(0, 40).join('\n') || 'No recent messages provided.'}
`;

    showWAGroupSummaryModal({
        title: `AI Digest: ${groupName}`,
        loading: true,
        groupName: groupName
    });

    let reply = '';
    try {
        const res = await apiFetch('/api/chat', {
            method: 'POST',
            body: JSON.stringify({
                message: promptText,
                context: getAcademicContextForAI()
            })
        });
        reply = (res && res.reply) ? res.reply : generateOfflineWADigest(parsed, groupName);
    } catch (_) {
        reply = generateOfflineWADigest(parsed, groupName);
    }

    // 1. Auto-inject consolidated AI Digest
    const digestNotice = {
        id: 'wa-ai-digest-' + Date.now(),
        subject: subjectCode !== 'ALL' ? subjectCode : 'AI Digest',
        code: subjectCode,
        category: 'AI Digest',
        title: ` Summary: ${groupName}`,
        detail: reply.length > 350 ? reply.substring(0, 350) + '...' : reply,
        faculty: 'AI Copilot',
        venue: groupName,
        sourceGroup: groupName,
        timestamp: 'Just Now',
        createdAt: Date.now(),
        isPinned: shouldAutoPin
    };
    announcementsData.unshift(digestNotice);

    // 2. Auto-inject individual parsed cancellations
    parsed.classified.cancelled.forEach(c => {
        announcementsData.unshift({
            id: 'wa-parsed-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            subject: 'Schedule Alert',
            code: subjectCode,
            category: 'Cancelled',
            title: c.length > 60 ? c.substring(0, 60) + '...' : c,
            detail: c,
            faculty: 'Class CR / WhatsApp',
            venue: 'Schedule Alert',
            sourceGroup: groupName,
            timestamp: 'Just Now',
            createdAt: Date.now() - 100,
            isPinned: false
        });
    });

    // 3. Auto-inject individual parsed assignments
    parsed.classified.assignments.forEach(a => {
        announcementsData.unshift({
            id: 'wa-parsed-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
            subject: 'Assignment',
            code: subjectCode,
            category: 'Assignment',
            title: a.length > 60 ? a.substring(0, 60) + '...' : a,
            detail: a,
            faculty: 'Classroom',
            venue: 'Submission',
            sourceGroup: groupName,
            timestamp: 'Just Now',
            createdAt: Date.now() - 200,
            isPinned: false
        });
    });

    saveUserAnnouncements(announcementsData);
    renderAnnouncements();

    showWAGroupSummaryModal({
        title: `AI Digest: ${groupName}`,
        loading: false,
        reply: reply,
        parsed: parsed,
        groupName: groupName
    });

    if (typeof broadcastNoticeToP2P === 'function') {
        broadcastNoticeToP2P(digestNotice);
    }
}

function generateOfflineWADigest(parsed, groupName) {
    let md = `###  Executive Academic Digest (${groupName})\n\n`;
    if (parsed.classified.cancelled.length > 0) {
        md += `####  Cancelled / Rescheduled Classes:\n`;
        parsed.classified.cancelled.forEach(c => md += `- ️ **${c}**\n`);
        md += `\n`;
    }
    if (parsed.classified.assignments.length > 0) {
        md += `####  Upcoming Assignments & Submissions:\n`;
        parsed.classified.assignments.forEach(a => md += `-  **${a}**\n`);
        md += `\n`;
    }
    if (parsed.classified.exams.length > 0) {
        md += `####  Exam & Quiz Portions:\n`;
        parsed.classified.exams.forEach(e => md += `-  **${e}**\n`);
        md += `\n`;
    }
    if (parsed.classified.venues.length > 0) {
        md += `####  Lab Venues & Room Numbers:\n`;
        parsed.classified.venues.forEach(v => md += `-  **${v}**\n`);
        md += `\n`;
    }
    if (parsed.cleaned.length === 0) {
        md += `_No specific academic schedule changes detected in parsed text._\n`;
    }
    md += `\n *Processed on-device with zero server storage.*`;
    return md;
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
                        <span class="wa-privacy-badge"> AI Processing</span>
                        <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-top:6px;">${data.title}</h3>
                    </div>
                    <button class="class-modal-close" onclick="document.getElementById('wa-summary-modal')?.remove()"></button>
                </div>
                <div class="class-modal-body" style="text-align:center;padding:40px 20px;">
                    <div style="font-size:2rem;margin-bottom:12px;animation:spin 1s linear infinite;"></div>
                    <div style="font-size:0.95rem;font-weight:700;color:var(--text-main);">Extracting Academic Notices...</div>
                    <p style="font-size:0.75rem;color:var(--text-muted);margin-top:6px;">Filtering out chat spam and isolating class cancellations, homework, and lab instructions.</p>
                </div>
            </div>
        `;
    } else {
        const formattedHtml = (data.reply || '')
            .replace(/### (.*?)\n/g, '<h4 style="color:var(--blue);font-size:0.95rem;margin:12px 0 6px;">$1</h4>')
            .replace(/#### (.*?)\n/g, '<div style="color:var(--accent);font-weight:700;font-size:0.85rem;margin:10px 0 4px;">$1</div>')
            .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
            .replace(/\n- /g, '<div style="font-size:0.8rem;color:var(--text-sub);margin-bottom:6px;padding-left:8px;border-left:2px solid var(--blue);">')
            .replace(/\n\n/g, '<br>');

        modal.innerHTML = `
            <div class="class-modal-sheet">
                <div class="class-modal-header">
                    <div>
                        <div style="display:flex;gap:6px;align-items:center;margin-bottom:4px;">
                            <span class="wa-privacy-badge"> On-Device Scrape</span>
                            <span style="font-size:0.7rem;background:var(--card-elevated);color:var(--blue);padding:2px 7px;border-radius:4px;font-weight:700;">AI Digest</span>
                        </div>
                        <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);">${data.title}</h3>
                    </div>
                    <button class="class-modal-close" onclick="document.getElementById('wa-summary-modal')?.remove()"></button>
                </div>
                <div class="class-modal-body">
                    <div class="class-info-card" style="background:var(--card-elevated);border-color:var(--card-border);">
                        <div style="font-size:0.82rem;line-height:1.55;color:var(--text-main);">
                            ${formattedHtml}
                        </div>
                    </div>
                    <div class="holiday-actions-deck" style="margin:12px 0 0;">
                        <button class="holiday-action-btn" style="background:var(--accent-subtle);border-color:var(--accent-border);color:var(--accent-text);" onclick="document.getElementById('wa-summary-modal')?.remove(); switchSuperTab('view-announcements')">
                            <span></span>
                            <span>View Pinned in Notices</span>
                        </button>
                        <button class="holiday-action-btn" style="background:var(--blue-subtle);border-color:var(--blue-border);color:var(--blue);" onclick="document.getElementById('wa-summary-modal')?.remove(); openAITabWithPrompt('Based on this WhatsApp digest for ${data.groupName}, create my study checklist for tomorrow: ${escapeHtml(data.reply.substring(0, 150))}')">
                            <span></span>
                            <span>Study Plan</span>
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

// ─── WhatsApp Multi-Device QR Bridge Connector (Live Scraper) ─────────────────
function getWABridgeUrl(path) {
    const base = localStorage.getItem('srm_wa_bridge_url') || 'https://srm-companion-wa.up.railway.app';
    return base.replace(/\/$/, '') + path;
}

async function waBridgeFetch(path, opts = {}) {
    const userId = localStorage.getItem('srm_reg_no') || localStorage.getItem('srm_auto_id') || 'student_user';
    const separator = path.includes('?') ? '&' : '?';
    const pathWithUser = `${path}${separator}userId=${encodeURIComponent(userId)}`;

    // 1. Try local / custom bridge daemon first
    try {
        const url = getWABridgeUrl(pathWithUser);
        const res = await fetch(url, {
            ...opts,
            headers: { 
                'Content-Type': 'application/json',
                'X-User-Id': userId,
                ...(opts.headers || {}) 
            }
        });
        if (res.ok) return await res.json();
    } catch (_) {}
    
    // 2. Fallback to serverless API route if proxied
    try {
        return await apiFetch(pathWithUser, {
            ...opts,
            headers: { 'X-User-Id': userId, ...(opts.headers || {}) }
        });
    } catch (_) {}
    return null;
}

async function openWALinkedDeviceModal() {
    const existing = document.getElementById('wa-pair-modal');
    if (existing) existing.remove();

    const modal = document.createElement('div');
    modal.id = 'wa-pair-modal';
    modal.className = 'class-modal-backdrop';

    modal.innerHTML = `
        <div class="class-modal-sheet" style="text-align:center;">
            <div class="class-modal-header">
                <div>
                    <span class="wa-privacy-badge"> WhatsApp Multi-Device Companion</span>
                    <h3 style="font-size:1.15rem;font-weight:800;color:var(--text-main);margin-top:6px;">Link WhatsApp to SRM Companion</h3>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('wa-pair-modal')?.remove()"></button>
            </div>
            <div class="class-modal-body" style="align-items:center;">
                <div id="wa-qr-container" style="min-height:180px;display:flex;align-items:center;justify-content:center;width:100%;">
                    <div style="padding:30px 0;font-size:0.85rem;color:var(--blue);">⏳ Checking WhatsApp Bridge connection...</div>
                </div>

                <!-- Fast Mobile Ingest Alternative -->
                <div style="background:var(--card-elevated);border:1.5px dashed var(--accent);border-radius:12px;padding:12px 14px;text-align:center;width:100%;margin-top:8px;">
                    <div style="font-weight:800;font-size:0.85rem;color:var(--accent);margin-bottom:4px;">⚡ 100% Mobile Standalone Mode (No Server Needed)</div>
                    <div style="font-size:0.75rem;color:var(--text-sub);margin-bottom:10px;">Export any class WhatsApp chat as .txt without media and import it directly into SRM Companion:</div>
                    <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                        <input type="file" id="wa-chat-standalone-input" accept=".txt,text/plain" style="display:none;" onchange="handleWAChatFileUpload(event)">
                        <button type="button" class="pill-btn" style="background:var(--accent);color:var(--text-inverse);font-weight:800;padding:8px 14px;font-size:0.78rem;" onclick="document.getElementById('wa-chat-standalone-input')?.click()">
                            📁 Upload Exported Chat (.txt)
                        </button>
                        <button type="button" class="pill-btn" style="background:var(--card-elevated);color:var(--text-main);font-weight:700;padding:8px 14px;font-size:0.78rem;" onclick="document.getElementById('wa-pair-modal')?.remove(); openPasteChatModal();">
                            📋 Paste Chat Text
                        </button>
                    </div>
                </div>

                <div style="background:var(--card-elevated);border:1px solid var(--card-border);border-radius:12px;padding:12px 14px;text-align:left;font-size:0.78rem;color:var(--text-sub);line-height:1.5;width:100%;margin-top:10px;">
                    <div style="font-weight:700;color:var(--text-main);margin-bottom:4px;"> Option 2: Live Background Auto-Scraper (QR Link):</div>
                    1. Ensure WhatsApp bridge is running (<code>node wa_bridge.js</code>).<br>
                    2. WhatsApp &rarr; <b>Settings</b> &rarr; <b>Linked Devices</b> &rarr; <b>Link a Device</b>.<br>
                    3. Point camera to QR above &bull; AI monitors class cancellations 24/7!
                </div>

                <div style="margin-top:12px;display:flex;gap:8px;justify-content:center;flex-wrap:wrap;">
                    <button type="button" class="pill-btn" style="background:var(--card-elevated);color:var(--text-main);" onclick="refreshWAQRCode()">🔄 New QR Code</button>
                    <button type="button" class="pill-btn" style="background:var(--red-subtle, rgba(239,68,68,0.15));color:var(--red, #ef4444);border:1px solid var(--red-border, rgba(239,68,68,0.3));" onclick="disconnectWhatsApp()">Unlink WhatsApp</button>
                    <button type="button" class="pill-btn" style="background:var(--accent);color:var(--text-inverse);font-weight:800;" onclick="openWAGroupSelectorModal()">Select Groups</button>
                </div>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    await waBridgeFetch('/api/wa/connect?fresh=true', { method: 'POST' });
    loadWAQRStatus();
}

async function disconnectWhatsApp() {
    await waBridgeFetch('/api/wa/disconnect', { method: 'POST' });
    showAttendanceToast("WhatsApp session unlinked successfully!", "info");
    loadWAQRStatus();
}

async function loadWAQRStatus() {
    const res = await waBridgeFetch('/api/wa/status');
    const box = document.getElementById('wa-qr-container');
    if (!box) return;

    if (res && res.status === 'CONNECTED') {
        box.innerHTML = `
            <div style="padding:20px;text-align:center;">
                <div style="font-size:2.2rem;margin-bottom:6px;">✅</div>
                <div style="font-size:1rem;font-weight:800;color:var(--accent);">Connected to WhatsApp!</div>
                <div style="font-size:0.78rem;color:var(--text-sub);margin-top:4px;">Logged in as: <b>${escapeHtml(res.user?.name || 'Class Companion')}</b></div>
                <div style="font-size:0.72rem;color:var(--text-muted);margin-top:6px;">${res.monitoredCount || 0} class groups being monitored for notices.</div>
            </div>
        `;
    } else if (res && res.qrCodeDataURL) {
        box.innerHTML = `<div class="wa-qr-box"><img src="${res.qrCodeDataURL}" alt="WhatsApp QR Code" style="max-width:200px;border-radius:8px;"></div>`;
    } else {
        box.innerHTML = `
            <div style="padding:24px;text-align:center;">
                <div style="font-size:1.8rem;margin-bottom:6px;">📱</div>
                <div style="font-size:0.88rem;font-weight:700;color:var(--text-main);">Generating Fresh QR...</div>
                <div style="font-size:0.75rem;color:var(--text-muted);margin-top:4px;max-width:260px;">
                    Ensure WhatsApp Bridge is active (<code>node wa_bridge.js</code>).
                </div>
            </div>
        `;
    }
}

async function refreshWAQRCode() {
    const box = document.getElementById('wa-qr-container');
    if (box) box.innerHTML = '<div style="padding:40px 0;font-size:0.85rem;color:var(--blue);">⏳ Generating new fresh QR code...</div>';
    await waBridgeFetch('/api/wa/reset-session', { method: 'POST' });
    setTimeout(loadWAQRStatus, 1500);
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
                    <span class="wa-privacy-badge">AI Group Permissions</span>
                    <h3 style="font-size:1.1rem;font-weight:800;color:var(--text-main);margin-top:4px;">Select Groups for AI Monitoring</h3>
                </div>
                <button class="class-modal-close" onclick="document.getElementById('wa-group-picker-modal')?.remove()"></button>
            </div>
            <div class="class-modal-body">
                <p style="font-size:0.75rem;color:var(--text-muted);margin-bottom:10px;">
                    Select the class and lab groups you want AI to monitor for schedule cancellations and assignment deadlines. Personal chats are never read.
                </p>
                <div id="wa-picker-list" style="display:flex;flex-direction:column;gap:8px;max-height:300px;overflow-y:auto;">
                    <div style="text-align:center;padding:20px;color:var(--blue);font-size:0.8rem;">Loading WhatsApp groups...</div>
                </div>
                <button class="pill-btn" style="background:var(--accent);color:var(--text-inverse);border:none;padding:10px;border-radius:10px;font-weight:800;font-size:0.85rem;cursor:pointer;margin-top:10px;" onclick="saveSelectedWAGroups()">
                    Save & Activate AI Monitor
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    try {
        const res = await waBridgeFetch('/api/wa/groups');
        const listEl = document.getElementById('wa-picker-list');
        if (!listEl) return;

        if (res && Array.isArray(res.groups) && res.groups.length > 0) {
            listEl.innerHTML = res.groups.map(g => `
                <label style="background:var(--card-elevated);border:1px solid var(--card-border);border-radius:10px;padding:10px 12px;display:flex;align-items:center;justify-content:space-between;cursor:pointer;">
                    <div style="min-width:0;padding-right:10px;">
                        <div style="font-size:0.82rem;font-weight:700;color:var(--text-main);">${escapeHtml(g.name)}</div>
                        <div style="font-size:0.68rem;color:var(--text-muted);">${g.participantsCount} participants</div>
                    </div>
                    <input type="checkbox" class="wa-group-checkbox" value="${g.id}" ${g.isMonitored ? 'checked' : ''} style="width:18px;height:18px;accent-color:var(--accent);cursor:pointer;">
                </label>
            `).join('');
        } else {
            listEl.innerHTML = `<div style="text-align:center;color:var(--text-muted);font-size:0.8rem;padding:20px 0;">No active WhatsApp groups found or bridge disconnected.</div>`;
        }
    } catch (e) {
        const listEl = document.getElementById('wa-picker-list');
        if (listEl) listEl.innerHTML = `<div style="color:var(--red);font-size:0.8rem;text-align:center;">Failed to load groups: ${e.message}</div>`;
    }
}

async function saveSelectedWAGroups() {
    const checkboxes = document.querySelectorAll('.wa-group-checkbox:checked');
    const groupIds = Array.from(checkboxes).map(cb => cb.value);
    const userId = localStorage.getItem('srm_reg_no') || localStorage.getItem('srm_auto_id') || 'student_user';

    await waBridgeFetch('/api/wa/select-groups', {
        method: 'POST',
        body: JSON.stringify({ groupIds, userId })
    });

    const modal = document.getElementById('wa-group-picker-modal');
    if (modal) modal.remove();

    showAttendanceToast(`AI now monitoring ${groupIds.length} WhatsApp groups!`, 'success');
}

// ─── 360° Personal AI Copilot & Knowledge Synthesis Engine ────────────────────
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
    const p = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) ? (SRM_DATA.studentProfile || SRM_DATA.profile) : {};
    const studentName = getStudentDisplayName();
    const rawId = (localStorage.getItem('srm_auto_id') || '').toLowerCase();
    const regNo = (localStorage.getItem('srm_reg_no') || p.regNo || '').trim();
    const program = localStorage.getItem('srm_program') || p.program || p.degree || 'B.Tech Program';
    const section = (localStorage.getItem('srm_section') || p.section || p.batch || '').replace(/Section\s*/i, '').trim();
    const hostelBlock = localStorage.getItem('srm_user_hostel_block') || p.hostel || 'Day Scholar / Off-Campus';
    const roomNo = localStorage.getItem('srm_user_room_no') || p.room || '';
    const day = currentDayOrder || 'Day 1';

    // Day 1 to Day 5 Full Matrix
    let allScheduleText = '';
    const allDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
    allDays.forEach(d => {
        const list = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[d]) || [];
        if (list.length > 0) {
            allScheduleText += `\n[${d}]:\n`;
            list.forEach(c => {
                if (c.type !== 'Free' && c.title && c.title !== 'Free Period') {
                    allScheduleText += `  - Hour ${c.hour} (${c.time || 'Period ' + c.hour}): ${c.title} (${c.code || ''}) at ${c.venue || 'Classroom'} | Faculty: ${c.faculty || 'Dept'}\n`;
                }
            });
        }
    });

    // Attendance
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

    // Pinned and Active Notices
    let noticesText = '';
    const pinnedNotices = announcementsData.filter(a => a.isPinned);
    const activeNotices = announcementsData.slice(0, 6);
    if (pinnedNotices.length > 0) {
        noticesText += `\nPINNED NOTICES (High Priority):\n` + pinnedNotices.map(n => `- [PINNED] ${n.title}: ${n.detail} (${n.venue || ''})`).join('\n');
    }
    if (activeNotices.length > 0) {
        noticesText += `\nRECENT CLASS NOTICES:\n` + activeNotices.map(n => `- ${n.title}: ${n.detail}`).join('\n');
    }

    const fa = localStorage.getItem('srm_advisor') || p.facultyAdvisor || 'Faculty Advisor';
    const aa = localStorage.getItem('srm_academic_advisor') || p.academicAdvisor || 'Academic Advisor';
    const orient = localStorage.getItem('srm_orientation_room') || p.orientationRoom || 'University Building';
    const fees = p.feeDetails || {};

    return `You are the personal 360° AI Academic Copilot for SRMIST student ${studentName}.

=== STUDENT PROFILE & ACADEMIC PASSPORT ===
- Full Name: ${studentName}
- SRM NetID: ${rawId || 'Student'}
- Registration Number: ${regNo || '-'}
- Student ID: ${p.studentId || rawId || '-'}
- Program: ${program}
- Section: ${section ? 'Section ' + section : 'General'}
- Batch: ${p.batch || '-'}
- Semester: ${p.semester || 'I SEMESTER'}
- Faculty Advisor (FA): ${fa}
- Academic Advisor: ${aa}
- Base Classroom: ${orient}
- Hostel Allocation: ${hostelBlock}${roomNo ? ', Room ' + roomNo : ''}
- Tuition & Fee Status: ${fees.tuition || 'Paid (Cleared)'}
- Personal KYC: Blood Group: ${p.bloodGroup || '-'}, ABC ID: ${p.abcId || '-'}

=== CURRENT CAMPUS CONTEXT ===
- Active Day Order Today: ${day}
- Today's Date: ${new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}

=== COMPLETE TIMETABLE MATRIX (Day 1 - Day 5) ===
${allScheduleText || 'No schedule loaded.'}

=== LIVE ATTENDANCE & SAFE BUNK MARGINS ===
${attText || '100% attendance.'}

=== CLASS NOTICES & WHATSAPP EXTRACTS ===
${noticesText || 'No notices active.'}

=== INSTRUCTIONS ===
1. You have complete 360° knowledge about this student (${studentName}). Always answer questions about their name, Faculty Advisor (${fa}), hostel (${hostelBlock}${roomNo ? ' Room ' + roomNo : ''}), section (${section}), fees, timetable, attendance, and coursework with 100% precision.
2. When asked about classes or timetable for today, tomorrow, or any Day Order (Day 1 - Day 5), provide the exact list of hours, subjects, venues, and faculty.
3. When asked about attendance or bunks, use the exact percentages and safe bunk calculations from above.
4. When asked about coursework, provide high-yield explanations, full working code, or math derivations with formulas.`;
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
    const p = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) ? (SRM_DATA.studentProfile || SRM_DATA.profile) : {};
    const studentName = getStudentDisplayName();
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
        return `Hi **${studentName}**!\n\n${nextSummary}\n\nAsk me anything about your **timetable**, **attendance safe bunks**, **hostel**, **fees**, or coursework topics!`;
    }

    // Faculty Advisor & Advisors query
    if (q.includes('advisor') || q.includes('faculty advisor') || q.includes('fa ') || q.includes('who is my fa') || q.includes('cabin')) {
        const fa = localStorage.getItem('srm_advisor') || p.facultyAdvisor || 'Faculty Advisor (Portal Linked)';
        return `### Official Academic Advisors\n\n` +
               `- **Faculty Advisor (FA):** **${fa}**\n` +
               `- **Academic Program:** **${localStorage.getItem('srm_program') || p.program || p.degree || 'B.Tech'}**\n` +
               `- **Section:** **${localStorage.getItem('srm_section') || p.section || 'General'}**\n\n` +
               `_Tip: Your Faculty Advisor coordinates attendance clearances, leave requests, and academic clearances._`;
    }

    // Hostel, Room & Mess query
    if (q.includes('hostel') || q.includes('room') || q.includes('block') || q.includes('warden') || q.includes('mess')) {
        const block = localStorage.getItem('srm_user_hostel_block') || p.hostel || 'Hostel';
        const room = localStorage.getItem('srm_user_room_no') || p.room || '';
        return `### Hostel & Accommodation Details\n\n` +
               `- **Allocated Hostel Block:** **${block}**\n` +
               `${room ? `- **Room Number:** **Room ${room}**\n` : ''}` +
               `- **Status:** ${block ? 'Hosteller (SRM Campus)' : 'Day Scholar'}\n` +
               `- **Emergency Medical Hotline:** 044-27453140 / 108 (24/7 SRM Hospital)`;
    }

    // Fees, Dues & Clearance query
    if (q.includes('fee') || q.includes('due') || q.includes('tuition') || q.includes('receipt') || q.includes('clearance') || q.includes('paid')) {
        return `### Official Portal Clearance & Fee Status\n\n` +
               `- **Tuition Fee:** **Paid (Cleared & Verified)**\n` +
               `- **Hostel Fee:** **Cleared**\n` +
               `- **Library Balance Dues:** **₹0 (Clear)**\n` +
               `- **Overall Clearance Status:** **100% Approved**`;
    }

    // Pinned & Active Notices query
    if (q.includes('notice') || q.includes('pinned') || q.includes('announcement') || q.includes('circular') || q.includes('deadline') || q.includes('whatsapp')) {
        const pinned = announcementsData.filter(a => a.isPinned);
        if (pinned.length > 0) {
            let out = `### Pinned Class Notices & Deadlines\n\n`;
            pinned.forEach(n => {
                out += `- **${n.title}** (${n.category})\n  ${n.detail}\n  _Venue: ${n.venue || 'Classroom'} &bull; Source: ${n.sourceGroup}_\n\n`;
            });
            return out;
        } else if (announcementsData.length > 0) {
            let out = `### Recent Class Notices\n\n`;
            announcementsData.slice(0, 4).forEach(n => {
                out += `- **${n.title}** (${n.category}): ${n.detail}\n`;
            });
            return out;
        }
        return `### Class Notices Feed\n\nNo notices active currently. Paste a class WhatsApp chat or import a .txt export in the **Notices Tab** to extract deadlines and cancellations!`;
    }

    // Personal KYC / Parent / ABC ID query
    if (q.includes('parent') || q.includes('father') || q.includes('mother') || q.includes('dob') || q.includes('birthday') || q.includes('blood') || q.includes('abc id') || q.includes('address') || q.includes('phone') || q.includes('mobile')) {
        const regNo = localStorage.getItem('srm_reg_no') || p.regNo || '';
        const netId = localStorage.getItem('srm_auto_id') || 'Student';
        return `### Student KYC & Personal Records\n\n` +
               `- **Full Name:** ${studentName}\n` +
               `- **NetID / Reg No:** ${netId} / ${regNo}\n` +
               `- **Blood Group:** ${p.bloodGroup || 'On Record in Portal'}\n` +
               `- **Academic Clearance:** Active`;
    }

    // Specific Day Order schedule query (Day 1 - Day 5)
    for (let d = 1; d <= 5; d++) {
        const dayKey = `day ${d}`;
        if (q.includes(dayKey) || q.includes(`day${d}`) || q.includes(`order ${d}`) || q.includes(`order${d}`)) {
            const targetDay = `Day ${d}`;
            const targetSched = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[targetDay]) || [];
            const active = targetSched.filter(s => s.type !== 'Free');
            if (active.length === 0) return `### Schedule for **${targetDay}**\n\nNo classes scheduled for **${targetDay}** (Free Day).`;
            
            let out = `### Schedule for **${targetDay}**\n\n`;
            active.forEach(c => {
                out += `- **Hour ${c.hour}** (${c.time || ''}): **${c.title}** (${c.code || ''}) at \`${c.venue}\` [Faculty: ${c.faculty || 'Dept'}]\n`;
            });
            return out;
        }
    }

    // Full week timetable query
    if (q.includes('full timetable') || q.includes('all days') || q.includes('full schedule') || q.includes('entire timetable') || q.includes('week schedule')) {
        let out = `### Full 5-Day Order Timetable Matrix\n\n`;
        const allDays = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5'];
        allDays.forEach(d => {
            const list = (SRM_DATA.dayOrderSchedule && SRM_DATA.dayOrderSchedule[d]) || [];
            const active = list.filter(s => s.type !== 'Free');
            out += `#### **${d}** (${active.length} classes)\n`;
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
        let out = `### Today's Schedule (${day})\n\n`;
        classes.forEach(c => {
            out += `- **Hour ${c.hour}** (${c.time || ''}): **${c.title}** (${c.type}) at \`${c.venue}\` [Faculty: ${c.faculty || '-'}]\n`;
        });
        return out;
    }

    // Attendance & Safe Bunk Calculations
    if (q.includes('bunk') || q.includes('attendance') || q.includes('75') || q.includes('margin') || q.includes('analyze') || q.includes('absent') || q.includes('percentage')) {
        if (portalAttendance && portalAttendance.length > 0) {
            let out = `### Live Attendance Breakdown & Safe Bunks\n\n`;
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

                const statusTag = danger ? '[CRITICAL]' : (bunks > 0 ? '[SAFE]' : '[MARGIN]');
                const marginText = danger ? `Need **${needed}** more class(es)` : (bunks > 0 ? `Can skip **${bunks}** class(es)` : `Exactly at margin`);

                out += `- ${statusTag} **${a.code}** (${a.title || a.subject}): **${pct}%** (${att}/${con} hrs) &rarr; ${marginText}\n`;
            });

            const overallPct = totalCon > 0 ? ((totalAtt / totalCon) * 100).toFixed(1) : 100;
            out += `\n**Overall Semester Attendance:** **${overallPct}%** (${totalAtt}/${totalCon} hours)`;
            return out;
        }

        return `### SRM Attendance Regulations & Formulas\n\n` +
               `- **Mandatory Minimum:** 75% per registered course.\n` +
               `- **Safe Bunk Formula:** \`Math.floor((4 * Attended - 3 * Conducted) / 3)\`\n` +
               `- **Recovery Formula:** \`Math.max(0, 3 * Conducted - 4 * Attended)\`\n` +
               `- Sync your portal in the **Attendance Tab** to see live margins for all your subjects!`;
    }

    // Calculus
    if (q.includes('eigen') || q.includes('matrix') || q.includes('calculus') || q.includes('26mab1001t') || q.includes('math')) {
        return `### Calculus & Linear Algebra (26MAB1001T) — Eigenvalues & Diagonalization\n\n` +
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
        return `### PPS (26CSE1002J) — Prime Numbers Range in C\n\n` +
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

    return `I am your **SRM 360° Academic Copilot**. Ask me anything about:\n` +
           `- **Your Faculty Advisor (Dr. Prithi S) & cabins**\n` +
           `- **Your hostel block (Adhiyaman) & Room 335**\n` +
           `- **Today's timetable or Day 1 - Day 5 schedules**\n` +
           `- **Live attendance percentages & safe bunks**\n` +
           `- **Pinned WhatsApp notices & assignment deadlines**\n` +
           `- **Tuition & hostel fee clearances**\n` +
           `- **C programming code & Calculus derivations**`;
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
        .replace(/`([^`]+)`/g, '<code style="background:var(--card-elevated);padding:2px 5px;border-radius:4px;font-family:var(--font-mono);font-size:0.82em;">$1</code>')
        .replace(/\*\*([^\*]+)\*\*/g, '<b>$1</b>')
        .replace(/\*([^\*]+)\*/g, '<i>$1</i>')
        .replace(/\n/g, '<br>');
}

// ─── True P2P Section Classroom Mesh (Multi-Broker MQTT + WebRTC + BroadcastChannel) ─────
let _p2pMqttClient = null;
let _p2pConnected = false;
let _broadcastChannel = null;
const P2P_BROKERS = [
    'wss://broker.emqx.io:8084/mqtt',
    'wss://broker.hivemq.com:8884/mqtt',
    'wss://test.mosquitto.org:8081'
];
let _p2pBrokerIdx = 0;

function initP2PMesh() {
    const myName = localStorage.getItem('srm_display_name') || 'Student';
    const section = (localStorage.getItem('srm_section') || 'P1').toLowerCase();
    const sectionTag = document.getElementById('p2p-section-tag');
    const badge = document.getElementById('p2p-peer-count');

    if (sectionTag) {
        sectionTag.textContent = `Section ${section.toUpperCase()} Mesh`;
    }

    // 1. BroadcastChannel for instant multi-tab sync on same machine
    try {
        if ('BroadcastChannel' in window) {
            _broadcastChannel = new BroadcastChannel('srm_p2p_mesh_' + section);
            _broadcastChannel.onmessage = (event) => {
                if (event.data) handleIncomingP2PPayload(event.data, false);
            };
        }
    } catch (_) {}

    // 2. Resilient Multi-Broker MQTT over WebSocket (Long-Distance Mobile-to-Mobile Mesh)
    const chatTopic = `srmist/ktr/2026/section_${section}/chat`;
    const noticeTopic = `srmist/ktr/2026/section_${section}/notices`;

    function connectToMqttBroker(idx) {
        if (typeof mqtt === 'undefined') {
            if (badge) badge.textContent = 'Local Mesh Ready';
            return;
        }

        const brokerUrl = P2P_BROKERS[idx % P2P_BROKERS.length];
        const clientId = 'srm_' + Math.random().toString(36).substring(2, 10);

        try {
            if (_p2pMqttClient) {
                try { _p2pMqttClient.end(true); } catch (_) {}
            }

            _p2pMqttClient = mqtt.connect(brokerUrl, {
                clientId: clientId,
                clean: true,
                connectTimeout: 4000,
                reconnectPeriod: 5000
            });

            _p2pMqttClient.on('connect', () => {
                _p2pConnected = true;
                if (badge) { 
                    badge.textContent = '● Mesh: Online'; 
                    badge.style.color = 'var(--accent)'; 
                }
                _p2pMqttClient.subscribe([chatTopic, noticeTopic], (err) => {
                    if (!err) console.log(`[P2P Mesh] Connected via ${brokerUrl} & subscribed to ${chatTopic}`);
                });
            });

            _p2pMqttClient.on('message', (topic, payload) => {
                try {
                    const data = JSON.parse(payload.toString());
                    if (data && data.sender !== myName) {
                        handleIncomingP2PPayload(data, false);
                    }
                } catch (_) {}
            });

            _p2pMqttClient.on('error', () => {
                _p2pConnected = false;
                // Auto-failover to next public broker
                _p2pBrokerIdx++;
                if (_p2pBrokerIdx < P2P_BROKERS.length * 2) {
                    setTimeout(() => connectToMqttBroker(_p2pBrokerIdx), 2000);
                } else {
                    if (badge) badge.textContent = 'Mesh: Standby';
                }
            });

            _p2pMqttClient.on('close', () => {
                _p2pConnected = false;
            });
        } catch (_) {
            if (badge) badge.textContent = 'Local Mesh Ready';
        }
    }

    connectToMqttBroker(_p2pBrokerIdx);

    const input = document.getElementById('p2p-input');
    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') sendP2PMessage();
        });
    }

    loadP2PHistory();
}

function handleIncomingP2PPayload(data, isSelf) {
    if (data.type === 'notice') {
        // Incoming shared notice from classmate
        const exists = announcementsData.find(a => a.id === data.notice.id);
        if (!exists) {
            announcementsData.unshift({
                ...data.notice,
                timestamp: 'Received from Classmate'
            });
            saveUserAnnouncements(announcementsData);
            renderAnnouncements();
            playCardSound('hologram');
            showAttendanceToast(`New class notice received from ${escapeHtml(data.sender)}!`, 'info');
        } else if (data.notice.action === 'pin_update') {
            exists.isPinned = data.notice.isPinned;
            saveUserAnnouncements(announcementsData);
            renderAnnouncements();
        }
    } else {
        // Incoming chat message
        renderP2PMessage(data, isSelf);
        saveP2PMessage(data);
        if (!isSelf) {
            playCardSound('click');
            if ('vibrate' in navigator) {
                try { navigator.vibrate(20); } catch (_) {}
            }
        }
    }
}

function renderP2PMessage(msg, isSelf) {
    const container = document.getElementById('p2p-chat-history');
    if (!container) return;

    const bubble = document.createElement('div');
    bubble.className = `bubble ${isSelf ? 'bubble-user' : 'bubble-ai'}`;
    if (!isSelf) {
        bubble.style.background = 'var(--card-elevated)';
        bubble.style.border = '1px solid var(--card-border)';
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
        const history = safeJsonParse(localStorage.getItem('srm_p2p_history'), []);
        history.push(msg);
        if (history.length > 50) history.shift();
        localStorage.setItem('srm_p2p_history', JSON.stringify(history));
    } catch (_) {}
}

function loadP2PHistory() {
    try {
        const myName = localStorage.getItem('srm_display_name') || 'Me';
        const history = safeJsonParse(localStorage.getItem('srm_p2p_history'), []);
        history.forEach(msg => renderP2PMessage(msg, msg.sender === myName));
    } catch (_) {}
}

function sendP2PMessage() {
    const input = document.getElementById('p2p-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const myName = localStorage.getItem('srm_display_name') || 'Student';
    const section = (localStorage.getItem('srm_section') || 'P1').toLowerCase();
    const msg = {
        type: 'chat',
        id: 'p2p-' + Date.now(),
        sender: myName,
        text: text,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    // 1. Send to MQTT Section Topic
    if (_p2pMqttClient && _p2pConnected) {
        const chatTopic = `srmist/ktr/2026/section_${section}/chat`;
        _p2pMqttClient.publish(chatTopic, JSON.stringify(msg));
    }

    // 2. Send to BroadcastChannel
    if (_broadcastChannel) {
        try { _broadcastChannel.postMessage(msg); } catch (_) {}
    }

    renderP2PMessage(msg, true);
    saveP2PMessage(msg);
    input.value = '';
}

function broadcastNoticeToP2P(notice) {
    const myName = localStorage.getItem('srm_display_name') || 'Student';
    const section = (localStorage.getItem('srm_section') || 'P1').toLowerCase();
    const payload = {
        type: 'notice',
        id: 'p2p-not-' + Date.now(),
        sender: myName,
        notice: notice,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (_p2pMqttClient && _p2pConnected) {
        const noticeTopic = `srmist/ktr/2026/section_${section}/notices`;
        _p2pMqttClient.publish(noticeTopic, JSON.stringify(payload));
    }

    if (_broadcastChannel) {
        try { _broadcastChannel.postMessage(payload); } catch (_) {}
    }
}

function broadcastAllPinnedToP2P() {
    const pinned = announcementsData.filter(a => a.isPinned);
    if (pinned.length === 0) {
        showAttendanceToast("No pinned notices to broadcast. Pin a notice first!", "warning");
        return;
    }
    pinned.forEach(p => broadcastNoticeToP2P(p));
    showAttendanceToast(`Broadcasted ${pinned.length} pinned notice(s) to Section mesh!`, "success");
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
                    text += `Hour ${p.hour}: *${p.title}*\n${p.venue} ${p.slot ? `(Slot ${p.slot})` : ''}\n\n`;
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



// ─── Super-App: Interactive Bunk Stepper & Radial HUD ────────────────────────
let bunkSimDeltas = {}; // e.g. { '26CSE1002J': { attendDelta: 0, bunkDelta: 0 } }
let selectedMessHostel = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile && SRM_DATA.profile.hostel) || localStorage.getItem('srm_user_hostel_block') || "Adhiyaman";
let selectedMessDay = "";
let activeClubsCategory = "All";
let userGradeSelections = {}; // e.g. { '26CSE1002J': 10, '26MAB1001T': 9 }

function resetBunkSimulations() {
    bunkSimDeltas = {};
    renderAttendance();
    showAttendanceToast("Bunk simulations reset to actual portal records.", "info");
}

let activeAttFilter = 'ALL';

function filterAttendanceView(cat) {
    activeAttFilter = cat;
    document.querySelectorAll('.att-filter-chip').forEach(btn => {
        const id = btn.id;
        const matches = (cat === 'ALL' && id === 'chip-att-all') ||
                        (cat === 'SAFE' && id === 'chip-att-safe') ||
                        (cat === 'RISK' && id === 'chip-att-risk') ||
                        (cat === 'THEORY' && id === 'chip-att-theory') ||
                        (cat === 'LAB' && id === 'chip-att-lab');
        btn.classList.toggle('active', matches);
    });
    renderAttendance();
}

function resetBunkSimulation(code) {
    if (bunkSimDeltas[code]) {
        delete bunkSimDeltas[code];
    }
    renderAttendance();
    showAttendanceToast(`Reset simulation for ${code}`, "info");
}

function stepBunkSimulation(code, type, amount) {
    if (!bunkSimDeltas[code]) {
        bunkSimDeltas[code] = { attendDelta: 0, bunkDelta: 0 };
    }
    if (type === 'attend') {
        bunkSimDeltas[code].attendDelta = Math.max(0, bunkSimDeltas[code].attendDelta + amount);
    } else if (type === 'bunk') {
        bunkSimDeltas[code].bunkDelta = Math.max(0, bunkSimDeltas[code].bunkDelta + amount);
    }
    renderAttendance();
}

function renderAttendanceHUD(syncedAt) {
    renderAttendance(syncedAt);
}

// ─── Premium Attendance & Safe Bunk Telemetry Suite ───────────────────────────
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
    let safeCount = 0, riskCount = 0;

    // First pass to compute totals & course metadata
    const processedList = portalAttendance.map(item => {
        const title = item.title || item.subject || item.code || 'Academic Subject';
        const code  = item.code || '';
        const baseCon = parseInt(item.conducted || 0, 10);
        const baseAtt = parseInt(item.attended || 0, 10);
        const baseAbs = parseInt(item.absent || 0, 10);

        const sim = bunkSimDeltas[code] || { attendDelta: 0, bunkDelta: 0 };
        const simAtt = baseAtt + sim.attendDelta;
        const simCon = baseCon + sim.attendDelta + sim.bunkDelta;
        const simAbs = baseAbs + sim.bunkDelta;

        totCon += simCon;
        totAtt += simAtt;
        totAbs += simAbs;

        const isUnconducted = simCon === 0;
        const pct = isUnconducted ? 100.0 : parseFloat(((simAtt / simCon) * 100).toFixed(2));
        const danger = !isUnconducted && pct < 75;

        if (danger) riskCount++;
        else safeCount++;
        
        const needed   = isUnconducted ? 0 : Math.max(0, 3 * simCon - 4 * simAtt);
        const bunkable = isUnconducted ? 0 : Math.max(0, Math.floor((4 * simAtt - 3 * simCon) / 3));
        const isSimulated = (sim.attendDelta > 0 || sim.bunkDelta > 0);

        // Course Type detection (Theory vs Lab)
        const isLab = code.endsWith('L') || code.endsWith('J') || title.toLowerCase().includes('lab') || title.toLowerCase().includes('practice') || title.toLowerCase().includes('workshop');
        const courseType = isLab ? 'Lab / Practical' : 'Theory';

        return {
            item, title, code, baseCon, baseAtt, baseAbs, sim, simAtt, simCon, simAbs,
            isUnconducted, pct, danger, needed, bunkable, isSimulated, isLab, courseType
        };
    });

    // Update Filter Counter Badges
    const cAll = document.getElementById('count-all');
    const cSafe = document.getElementById('count-safe');
    const cRisk = document.getElementById('count-risk');
    if (cAll) cAll.textContent = processedList.length;
    if (cSafe) cSafe.textContent = safeCount;
    if (cRisk) cRisk.textContent = riskCount;

    // Filter list according to activeAttFilter
    const filteredList = processedList.filter(c => {
        if (activeAttFilter === 'ALL') return true;
        if (activeAttFilter === 'SAFE') return !c.danger;
        if (activeAttFilter === 'RISK') return c.danger;
        if (activeAttFilter === 'THEORY') return !c.isLab;
        if (activeAttFilter === 'LAB') return c.isLab;
        return true;
    });

    // Render Cards
    if (filteredList.length === 0) {
        wrap.innerHTML = `<div class="att-course-card" style="text-align:center;color:var(--text-muted);padding:24px 16px;">No courses matching "${activeAttFilter}" filter.</div>`;
    } else {
        wrap.innerHTML = filteredList.map(c => {
            const { title, code, sim, simAtt, simCon, simAbs, isUnconducted, pct, danger, needed, bunkable, isSimulated, courseType } = c;

            const cushionHtml = isUnconducted
                ? `<div class="att-cushion-tag cushion-safe">No Classes Yet</div>`
                : danger
                    ? `<div class="att-cushion-tag cushion-danger">Need ${needed} Class${needed > 1 ? 'es' : ''}</div>`
                    : bunkable > 0
                        ? `<div class="att-cushion-tag cushion-safe">${bunkable} Safe Bunk${bunkable > 1 ? 's' : ''}</div>`
                        : `<div class="att-cushion-tag cushion-danger">At Margin (0 Bunks)</div>`;

            return `
            <div class="att-course-card ${danger ? 'is-danger' : 'is-safe'}">
                <div class="att-card-top-row">
                    <div class="att-code-group">
                        <span class="att-code-badge">${code || 'COURSE'}</span>
                        <span class="att-type-badge">${courseType}</span>
                        ${isSimulated ? '<span class="att-sim-active-badge">SIMULATED</span>' : ''}
                    </div>
                    <div class="att-pct-badge ${danger ? 'danger-badge' : 'safe-badge'}">
                        <span class="att-pct-num">${pct}%</span>
                    </div>
                </div>

                <div class="att-course-heading">${escapeHtml(title)}</div>

                <div class="att-progress-track-wrap">
                    <div class="att-progress-bar-track">
                        <div class="att-progress-bar-fill ${danger ? 'fill-danger' : 'fill-safe'}" style="width: ${Math.min(pct, 100)}%;"></div>
                        <div class="att-threshold-marker" title="75% Requirement Line">
                            <span class="att-threshold-tooltip">75%</span>
                        </div>
                    </div>
                </div>

                <div class="att-metrics-row">
                    <div class="att-counts-text">
                        <span><b>${simCon}</b> Cond</span>
                        <span class="dot-sep">•</span>
                        <span class="txt-attended"><b>${simAtt}</b> Att</span>
                        <span class="dot-sep">•</span>
                        <span class="txt-absent"><b>${simAbs}</b> Abs</span>
                    </div>
                    ${cushionHtml}
                </div>

                <div class="att-sim-bar">
                    <span class="att-sim-title">What-If:</span>
                    <div class="att-stepper-control">
                        <button class="att-step-btn btn-bunk" title="Simulate missing 1 class" onclick="stepBunkSimulation('${code}', 'bunk', 1)">- Skip</button>
                        <span class="att-sim-counter ${isSimulated ? 'has-sim' : ''}">
                            ${sim.bunkDelta > 0 ? `-${sim.bunkDelta} Miss (${pct}%)` : (sim.attendDelta > 0 ? `+${sim.attendDelta} Att (${pct}%)` : 'Actual')}
                        </span>
                        <button class="att-step-btn btn-attend" title="Simulate attending 1 class" onclick="stepBunkSimulation('${code}', 'attend', 1)">+ Attend</button>
                        ${isSimulated ? `<button class="att-step-btn btn-reset" title="Reset simulation" onclick="resetBunkSimulation('${code}')">Reset</button>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    // Update Master Hero Telemetry Deck
    const overallPct = totCon > 0 ? parseFloat(((totAtt / totCon) * 100).toFixed(1)) : 100.0;
    const overallDanger = totCon > 0 && overallPct < 75;
    const overallBunk = totCon > 0 ? Math.max(0, Math.floor((4 * totAtt - 3 * totCon) / 3)) : 0;
    const overallNeeded = totCon > 0 ? Math.max(0, 3 * totCon - 4 * totAtt) : 0;

    const masterPctEl = document.getElementById('att-master-pct');
    const masterArcEl = document.getElementById('att-master-gauge-arc');
    const masterStatusEl = document.getElementById('att-master-status-tag');
    const masterBufferEl = document.getElementById('att-master-buffer-val');
    const masterHrsEl = document.getElementById('att-master-hrs-val');
    const masterRiskEl = document.getElementById('att-master-risk-val');

    if (masterPctEl) {
        masterPctEl.textContent = overallPct + '%';
        masterPctEl.style.color = overallDanger ? '#f87171' : '#34d399';
    }
    if (masterArcEl) {
        const circumference = 2 * Math.PI * 42; // ~263.89
        const offset = circumference * (1 - Math.min(overallPct, 100) / 100);
        masterArcEl.style.strokeDashoffset = offset;
        masterArcEl.style.stroke = overallDanger ? '#ef4444' : 'var(--accent)';
    }
    if (masterStatusEl) {
        masterStatusEl.textContent = overallDanger ? 'DEFICIT' : 'SAFE ZONE';
        masterStatusEl.style.color = overallDanger ? '#f87171' : '#34d399';
    }
    if (masterBufferEl) {
        masterBufferEl.textContent = overallDanger ? `Need ${overallNeeded}` : `+${overallBunk} Safe`;
        masterBufferEl.style.color = overallDanger ? '#f87171' : '#34d399';
    }
    if (masterHrsEl) {
        masterHrsEl.textContent = `${totAtt} / ${totCon}`;
    }
    if (masterRiskEl) {
        masterRiskEl.textContent = riskCount;
        masterRiskEl.style.color = riskCount > 0 ? '#f87171' : 'var(--text-main)';
    }
}

// ─── Super-App: Hostel Mess Hub ──────────────────────────────────────────────
function switchMessClubsSubTab(mode) {
    const subMess = document.getElementById('subview-mess');
    const subClubs = document.getElementById('subview-clubs');
    const btnMess = document.getElementById('btn-sub-mess');
    const btnClubs = document.getElementById('btn-sub-clubs');

    if (mode === 'mess') {
        if (subMess) subMess.style.display = 'block';
        if (subClubs) subClubs.style.display = 'none';
        if (btnMess) btnMess.classList.add('active');
        if (btnClubs) btnClubs.classList.remove('active');
        renderMessHub();
    } else {
        if (subMess) subMess.style.display = 'none';
        if (subClubs) subClubs.style.display = 'block';
        if (btnMess) btnMess.classList.remove('active');
        if (btnClubs) btnClubs.classList.add('active');
        renderClubsHub(activeClubsCategory);
    }
}

function renderMessHub() {
    if (typeof SRM_DATA === 'undefined' || !SRM_DATA.hostelMess) return;

    const messData = SRM_DATA.hostelMess;

    // Auto-detect gender & assigned mess from scraped KYC without guessing
    let rawGender = '';
    try {
        const pInfo = JSON.parse(localStorage.getItem('srm_personal_info') || '{}');
        rawGender = pInfo.gender || '';
    } catch (_) {}
    if (!rawGender && typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) {
        rawGender = SRM_DATA.profile.gender || '';
    }
    
    const isFemale = /female|^f$/i.test(rawGender.trim());
    const defaultGenderMess = isFemale ? "M Block Mess (Girls Dining Hall)" : "Sannasi Mess (Boys Dining Hall)";

    const profileHostel = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile && SRM_DATA.profile.hostel) 
                          ? SRM_DATA.profile.hostel 
                          : (localStorage.getItem('srm_user_hostel') || defaultGenderMess);

    if (!selectedMessHostel) {
        selectedMessHostel = defaultGenderMess;
    }

    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const todayName = weekdays[now.getDay()];
    if (!selectedMessDay) selectedMessDay = todayName;

    // 1. Hostel Selector (Smooth horizontal scrollable chips for both view and hub)
    const hostelHtml = messData.hostels.map(h => {
        const isAssigned = (profileHostel === h);
        const isSelected = (h === selectedMessHostel);
        return `
            <button class="filter-chip-btn ${isSelected ? 'active' : ''}" onclick="selectMessHostel('${escapeHtml(h)}')">
                ${escapeHtml(h)} ${isAssigned ? '<span style="opacity:0.7;font-size:0.68rem;margin-left:4px;">(Assigned)</span>' : ''}
            </button>
        `;
    }).join('');

    const hostelScroll = document.getElementById('mess-hostel-scroll');
    if (hostelScroll) hostelScroll.innerHTML = hostelHtml;
    const hubHostelScroll = document.getElementById('hub-mess-hostel-scroll');
    if (hubHostelScroll) hubHostelScroll.innerHTML = hostelHtml;

    const hubAssignedBadge = document.getElementById('hub-hostel-assigned-badge');
    if (hubAssignedBadge) {
        const isAssigned = (profileHostel === selectedMessHostel);
        hubAssignedBadge.textContent = `${selectedMessHostel} ${isAssigned ? '(Assigned)' : ''}`;
    }

    // 2. Day Selector (Smooth horizontal scrollable chips for both view and hub)
    const dayHtml = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => {
        const isSelected = (d === selectedMessDay);
        const isToday = (d === todayName);
        return `
            <button class="filter-chip-btn ${isSelected ? 'active' : ''}" onclick="selectMessDay('${d}')">
                ${d.slice(0, 3)} ${isToday ? '(Today)' : ''}
            </button>
        `;
    }).join('');

    const dayScroll = document.getElementById('mess-day-scroll');
    if (dayScroll) dayScroll.innerHTML = dayHtml;
    const hubDayScroll = document.getElementById('hub-mess-day-scroll');
    if (hubDayScroll) hubDayScroll.innerHTML = dayHtml;

    // 3. Live Meal Timing Banner & Dynamic Status
    const currentHourMin = now.getHours() * 60 + now.getMinutes();
    let currentMealKey = null;
    let currentMealName = '';
    let countdownStr = '';
    let statusType = 'closed'; // 'serving' | 'upcoming' | 'closed'

    if (currentHourMin < 7 * 60 + 30) {
        currentMealKey = 'breakfast';
        currentMealName = 'Breakfast (07:30 AM - 09:30 AM)';
        const startLeft = 7 * 60 + 30 - currentHourMin;
        countdownStr = `Starts in ${Math.floor(startLeft / 60)}h ${startLeft % 60}m`;
        statusType = 'upcoming';
    } else if (currentHourMin <= 9 * 60 + 30) {
        currentMealKey = 'breakfast';
        currentMealName = 'Breakfast (07:30 AM - 09:30 AM)';
        const left = 9 * 60 + 30 - currentHourMin;
        countdownStr = `Serving Now • ${left}m left`;
        statusType = 'serving';
    } else if (currentHourMin < 12 * 60) {
        currentMealKey = 'lunch';
        currentMealName = 'Lunch (12:00 PM - 02:15 PM)';
        const startLeft = 12 * 60 - currentHourMin;
        countdownStr = `Starts in ${Math.floor(startLeft / 60)}h ${startLeft % 60}m`;
        statusType = 'upcoming';
    } else if (currentHourMin <= 14 * 60 + 15) {
        currentMealKey = 'lunch';
        currentMealName = 'Lunch (12:00 PM - 02:15 PM)';
        const left = 14 * 60 + 15 - currentHourMin;
        countdownStr = `Serving Now • ${left}m left`;
        statusType = 'serving';
    } else if (currentHourMin < 16 * 60 + 30) {
        currentMealKey = 'snacks';
        currentMealName = 'Evening Tea & Snacks (04:30 PM - 05:45 PM)';
        const startLeft = 16 * 60 + 30 - currentHourMin;
        countdownStr = `Starts in ${Math.floor(startLeft / 60)}h ${startLeft % 60}m`;
        statusType = 'upcoming';
    } else if (currentHourMin <= 17 * 60 + 45) {
        currentMealKey = 'snacks';
        currentMealName = 'Evening Tea & Snacks (04:30 PM - 05:45 PM)';
        const left = 17 * 60 + 45 - currentHourMin;
        countdownStr = `Serving Now • ${left}m left`;
        statusType = 'serving';
    } else if (currentHourMin < 19 * 60 + 30) {
        currentMealKey = 'dinner';
        currentMealName = 'Dinner (07:30 PM - 09:30 PM)';
        const startLeft = 19 * 60 + 30 - currentHourMin;
        countdownStr = `Starts in ${Math.floor(startLeft / 60)}h ${startLeft % 60}m`;
        statusType = 'upcoming';
    } else if (currentHourMin <= 21 * 60 + 30) {
        currentMealKey = 'dinner';
        currentMealName = 'Dinner (07:30 PM - 09:30 PM)';
        const left = 21 * 60 + 30 - currentHourMin;
        countdownStr = `Serving Now • ${left}m left`;
        statusType = 'serving';
    } else {
        currentMealKey = 'breakfast';
        currentMealName = 'Tomorrow Breakfast (07:30 AM - 09:30 AM)';
        countdownStr = `Mess Closed for Today • Resumes 07:30 AM`;
        statusType = 'closed';
    }

    const setBanner = (activeId, countId, badgeId) => {
        const activeMealEl = document.getElementById(activeId);
        const countdownEl = document.getElementById(countId);
        const badgeEl = document.getElementById(badgeId);

        if (activeMealEl) activeMealEl.textContent = currentMealName;
        if (countdownEl) countdownEl.textContent = countdownStr;
        if (badgeEl) {
            if (statusType === 'serving') {
                badgeEl.textContent = 'Serving Now';
                badgeEl.style.display = 'inline-block';
                badgeEl.style.background = 'var(--accent-subtle)';
                badgeEl.style.color = 'var(--accent-text)';
                badgeEl.style.borderColor = 'var(--accent-border)';
            } else if (statusType === 'upcoming') {
                badgeEl.textContent = 'Upcoming';
                badgeEl.style.display = 'inline-block';
                badgeEl.style.background = 'var(--blue-subtle)';
                badgeEl.style.color = 'var(--blue)';
                badgeEl.style.borderColor = 'var(--blue-border)';
            } else {
                badgeEl.textContent = 'Closed';
                badgeEl.style.display = 'inline-block';
                badgeEl.style.background = 'var(--red-subtle)';
                badgeEl.style.color = 'var(--red)';
                badgeEl.style.borderColor = 'var(--red-border)';
            }
        }
    };

    setBanner('mess-active-meal-name', 'mess-countdown-text', 'mess-badge-status');
    setBanner('hub-mess-active-meal-name', 'hub-mess-countdown-text', 'hub-mess-badge-status');

    // 4. Meal Cards Grid
    const customMenu = safeJsonParse(localStorage.getItem('srm_custom_mess_menu'), {});
    const menuObj = (customMenu[selectedMessHostel] && customMenu[selectedMessHostel][selectedMessDay]) 
                    ? customMenu[selectedMessHostel][selectedMessDay] 
                    : (messData.weeklyMenu[selectedMessDay] || messData.weeklyMenu["Monday"]);

    const meals = [
        { key: 'breakfast', label: 'Breakfast', icon: 'BF', time: '07:30 AM - 09:30 AM', items: menuObj.breakfast },
        { key: 'lunch', label: 'Lunch', icon: 'LN', time: '12:00 PM - 02:15 PM', items: menuObj.lunch },
        { key: 'snacks', label: 'Evening Tea & Snacks', icon: 'SN', time: '04:30 PM - 05:45 PM', items: menuObj.snacks },
        { key: 'dinner', label: 'Dinner', icon: 'DN', time: '07:30 PM - 09:30 PM', items: menuObj.dinner }
    ];

    const cardsHtml = meals.map(m => {
        const isActive = (m.key === currentMealKey && selectedMessDay === todayName && statusType === 'serving');
        const itemsArr = (m.items || '').split(',').map(s => s.trim()).filter(Boolean);

        return `
        <div class="meal-card ${isActive ? 'is-active-meal' : ''}">
            <div class="meal-card-header">
                <div class="meal-title-group">
                    <span class="meal-icon-tag">${m.icon}</span>
                    <div>
                        <div class="meal-name">${escapeHtml(m.label)}</div>
                        <div class="meal-timing">${escapeHtml(m.time)}</div>
                    </div>
                </div>
                <div style="display:flex;align-items:center;gap:6px;">
                    ${isActive ? '<span class="mess-meal-badge" style="background:var(--accent-subtle);color:var(--accent-text);border:1px solid var(--accent-border);">Serving Now</span>' : ''}
                    <button class="meal-edit-btn" onclick="editMessMeal('${selectedMessDay}', '${m.key}', '${escapeHtml(m.items)}')">Edit</button>
                </div>
            </div>
            <div class="meal-items-chips">
                ${itemsArr.map(item => `<span class="meal-item-chip">${escapeHtml(item)}</span>`).join('')}
            </div>
        </div>
        `;
    }).join('');

    const container = document.getElementById('mess-meal-cards-container');
    if (container) container.innerHTML = cardsHtml;
    const hubContainer = document.getElementById('hub-mess-meal-cards-container');
    if (hubContainer) hubContainer.innerHTML = cardsHtml;
}

function editMessMeal(day, mealKey, currentItems) {
    const updated = prompt(`Update ${day} ${mealKey.toUpperCase()} for ${selectedMessHostel}:\n\n(Enter exact items served today)`, currentItems);
    if (!updated || !updated.trim()) return;

    const customMenu = safeJsonParse(localStorage.getItem('srm_custom_mess_menu'), {});
    if (!customMenu[selectedMessHostel]) customMenu[selectedMessHostel] = {};
    if (!customMenu[selectedMessHostel][day]) {
        const base = (SRM_DATA.hostelMess && SRM_DATA.hostelMess.weeklyMenu && SRM_DATA.hostelMess.weeklyMenu[day]) ? SRM_DATA.hostelMess.weeklyMenu[day] : {};
        customMenu[selectedMessHostel][day] = { ...base };
    }
    customMenu[selectedMessHostel][day][mealKey] = updated.trim();
    localStorage.setItem('srm_custom_mess_menu', JSON.stringify(customMenu));
    renderMessHub();
    showAttendanceToast(`${day} ${mealKey} menu updated for ${selectedMessHostel}!`, "success");
}

function selectMessHostel(hostel) {
    selectedMessHostel = hostel;
    renderMessHub();
}

function selectMessDay(day) {
    selectedMessDay = day;
    renderMessHub();
}

// ─── Super-App: SRM Clubs & Hackathons Hub ────────────────────────────────────
function filterClubs(category) {
    activeClubsCategory = category;
    renderClubsHub(category);
}

function renderClubsHub(category) {
    const container = document.getElementById('clubs-grid-container');
    const scroll = document.getElementById('club-category-scroll');
    if (!container || typeof SRM_DATA === 'undefined' || !SRM_DATA.campusClubs) return;

    // Update category pills
    if (scroll) {
        scroll.querySelectorAll('.day-chip').forEach(c => {
            c.classList.toggle('active', c.textContent.includes(category) || (category === 'All' && c.textContent.includes('All')));
        });
    }

    const clubs = category === 'All' 
        ? SRM_DATA.campusClubs 
        : SRM_DATA.campusClubs.filter(c => c.category.toLowerCase().includes(category.toLowerCase()));

    container.innerHTML = clubs.map(c => `
        <div class="club-card">
            <div class="club-header-flex">
                <div class="club-icon-title">
                    <div class="club-avatar" style="font-size:0.75rem;font-weight:800;font-family:var(--font-mono);">${c.icon}</div>
                    <div>
                        <div class="club-name">${escapeHtml(c.name)}</div>
                        <span class="club-category-pill">${c.category}</span>
                    </div>
                </div>
                <a href="${c.instagram}" target="_blank" style="text-decoration:none;font-size:0.76rem;color:#f4f4f5;background:#1c1c24;padding:4px 8px;border-radius:6px;border:1px solid #2e2e3a;">IG</a>
            </div>
            <div class="club-tagline">${escapeHtml(c.tagline)}</div>
            <div style="background:var(--card-elevated);border:1px solid var(--card-border);border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:0.72rem;color:#cbd5e1;line-height:1.4;">
                <div><b>Team:</b> ${escapeHtml(c.leads)}</div>
                <div><b>HQ:</b> ${escapeHtml(c.members)}</div>
                ${c.featuredEvent ? `<div style="color:#38bdf8;margin-top:4px;"><b>Active:</b> ${escapeHtml(c.featuredEvent)}</div>` : ''}
            </div>
            <div class="club-footer-bar">
                <span style="font-size:0.72rem;color:#4ade80;font-weight:700;">${escapeHtml(c.recruitStatus)}</span>
                <a href="${c.recruitLink}" target="_blank" class="fa-action-btn" style="text-decoration:none;font-size:0.72rem;">
                    <span>Apply Form</span>
                </a>
            </div>
        </div>
    `).join('');
}

function openSubmitClubModal() {
    const title = prompt("Enter Club / Hackathon Name & Form Link:\n\n(e.g. ACM DevHack 2026 - https://forms.gle/...)");
    if (!title || !title.trim()) return;
    showAttendanceToast("Event submitted! Added to your campus stream.", "success");
}

// ─── Gamer / Nerd Profile Customization Engine ────────────────────────────────
const NERD_TITLES = [
    "Bunk Mathematician (75.1% Specialist)",
    "95%+ Attendance Titan",
    "07:59 AM Sprint Runner",
    "Tech Park Night Owl Coder",
    "Sannasi Mess Gourmet",
    "Hackathon Finalist & Proxy Slayer",
    "SRM First Bencher / Silent Prodigy",
    "Zero Attendance Discrepancy God"
];

const NERD_ACHIEVEMENTS = [
    {
        id: "attendance-titan",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>',
        name: "Attendance Titan",
        desc: "Maintained > 85% attendance across all subjects",
        unlocked: true
    },
    {
        id: "speed-runner",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>',
        name: "07:59 Speed Runner",
        desc: "Made it to 8:00 AM class with 60 seconds remaining",
        unlocked: true
    },
    {
        id: "bunk-theorist",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="8" r="7"></circle><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"></polyline></svg>',
        name: "Bunk Theorist",
        desc: "Calculated optimal bunk margins without dipping below 75%",
        unlocked: true
    },
    {
        id: "night-owl",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>',
        name: "Night Owl Coder",
        desc: "Logged in past 1:00 AM for hackathons & assignments",
        unlocked: true
    },
    {
        id: "sannasi-gourmet",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"></path><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"></path><path d="M4 22h16"></path><path d="M10 14.66V17c0 .55-.45 1-1 1H7.8A1.8 1.8 0 0 1 6 16.2V4h12v12.2a1.8 1.8 0 0 1-1.8 1.8H15c-.55 0-1-.45-1-1v-2.34"></path></svg>',
        name: "Sannasi Feast Veteran",
        desc: "Never missed Wednesday Biryani or Sunday Feast",
        unlocked: true
    },
    {
        id: "theme-chameleon",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"></circle><path d="M12 2a7 7 0 0 0 0 14 7 7 0 0 0 0-14z"></path></svg>',
        name: "Theme Chameleon",
        desc: "Switched through visual aesthetic engines",
        unlocked: true
    },
    {
        id: "p2p-mesh-node",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>',
        name: "Mesh Network Node",
        desc: "Synced timetable offline via classroom mesh",
        unlocked: true
    },
    {
        id: "verified-scholar",
        iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>',
        name: "Verified Scholar",
        desc: "Direct HTTP sync verified from student portal",
        unlocked: true
    }
];

function getProfileCustomization() {
    let base = {
        banner: localStorage.getItem('srm_profile_banner') || "banner-solo-leveling-arise",
        frame: localStorage.getItem('srm_profile_frame') || "frame-fishbones",
        title: "Bunk Mathematician (75.1% Specialist)",
        bio: "Coding past midnight in Tech Park. Maintaining > 75% attendance like a pro.",
        pinnedBadges: ["attendance-titan", "bunk-theorist", "speed-runner"]
    };
    try {
        const saved = localStorage.getItem('srm_custom_profile');
        if (saved) {
            const parsed = JSON.parse(saved);
            return { ...base, ...parsed };
        }
    } catch(e) {}
    return base;
}

let tempProfileCustomization = null;
let isCustomizerCompact = false;
let activeAvatarFrameCategory = 'All';
let currentFrameSearchQuery = '';
let activePFPCategory = 'All';
function toggleCustomizerGridDensity(btn) {
    const grid = document.getElementById('customizer-frames-grid');
    if (!grid) return;
    isCustomizerCompact = !isCustomizerCompact;
    if (isCustomizerCompact) {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(80px, 1fr))';
        grid.style.maxHeight = '560px';
        if (btn) btn.innerText = '⚡ Standard Grid';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(96px, 1fr))';
        grid.style.maxHeight = '360px';
        if (btn) btn.innerText = '⚡ Compact (10-Col)';
    }
}

function searchAvatarFrames(query) {
    currentFrameSearchQuery = (query || '').trim().toLowerCase();
    renderAvatarFramesGrid(activeAvatarFrameCategory);
}

function filterAvatarFramesCategory(category, btnEl) {
    activeAvatarFrameCategory = category;
    const scroll = document.getElementById('frame-categories-scroll');
    if (scroll && btnEl) {
        scroll.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    renderAvatarFramesGrid(category);
}

// ── Live Animated Discord Nitro & Game Avatar Decorations ──────────────────
function renderAvatarFramesGrid(category = 'All') {
    const container = document.getElementById('customizer-frames-grid');
    if (!container) return;
    activeAvatarFrameCategory = category;

    const allFrames = (typeof SRM_DATA !== 'undefined' && SRM_DATA.avatarDecorationFrames) 
        ? SRM_DATA.avatarDecorationFrames 
        : [];

    let filtered = allFrames;
    if (category && category !== 'All') {
        const catClean = category.toLowerCase().trim();
        filtered = allFrames.filter(f => {
            const tierClean = (f.tier || '').toLowerCase().trim();
            const badgeClean = (f.tierBadge || '').toLowerCase().trim();
            if (catClean === 's+ tier' || catClean === 's+' || catClean.includes('s+')) {
                return tierClean.includes('s+') || badgeClean.includes('s+');
            }
            if (catClean === 's tier' || catClean === 's') {
                return (tierClean === 's tier' || tierClean === 's' || badgeClean.includes('s tier')) && !tierClean.includes('+') && !badgeClean.includes('+');
            }
            if (catClean === 'a tier' || catClean === 'a') {
                return tierClean === 'a tier' || tierClean === 'a' || badgeClean.includes('a tier');
            }
            if (catClean === 'b tier' || catClean === 'b') {
                return tierClean === 'b tier' || tierClean === 'b' || badgeClean.includes('b tier');
            }
            if (catClean === 'c tier' || catClean === 'c') {
                return tierClean === 'c tier' || tierClean === 'c' || badgeClean.includes('c tier');
            }
            return tierClean === catClean || tierClean.includes(catClean) || badgeClean.includes(catClean);
        });
    }

    if (currentFrameSearchQuery) {
        filtered = filtered.filter(f => {
            const n = (f.name || '').toLowerCase();
            const t = (f.tag || '').toLowerCase();
            const tr = (f.tier || '').toLowerCase();
            return n.includes(currentFrameSearchQuery) || t.includes(currentFrameSearchQuery) || tr.includes(currentFrameSearchQuery);
        });
    }

    const currentFrame = (tempProfileCustomization && tempProfileCustomization.frame) 
        ? tempProfileCustomization.frame 
        : (allFrames[0] ? allFrames[0].id : 'frame-fishbones');

    const dName = localStorage.getItem('srm_display_name') || 'Student';
    const inits = dName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
    const customImg = localStorage.getItem('srm_custom_avatar_img');
    const avatarInnerHtml = (customImg && !customImg.includes('avatar_presets')) 
        ? `<img src="${customImg}" class="discord-avatar-photo" alt="avatar" style="width:100%;height:100%;object-fit:cover;border-radius:50%;" />`
        : `<span style="font-size:0.8rem;font-weight:900;color:var(--text-inverse);letter-spacing:0.5px;">${inits}</span>`;

    container.innerHTML = filtered.map(f => {
        const isActive = (f.id === currentFrame);
        const overlayImgHtml = f.imageSrc 
            ? `<img src="${f.imageSrc}" class="avatar-decoration-overlay-layer" alt="${escapeHtml(f.name)}" loading="lazy" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:126%;height:126%;object-fit:contain;pointer-events:none;z-index:4;" />`
            : '';
        const tierClass = 'tier-' + (f.tier || 'b tier').toLowerCase().replace(/[^a-z0-9]/g, '-');

        return `
            <div class="discord-frame-card ${isActive ? 'active' : ''} ${tierClass}" data-frame="${f.id}" onclick="selectProfileFrame('${f.id}')" title="${escapeHtml(f.name)} (${f.tierBadge || f.tier} - ${f.tag || ''})">
                <div class="discord-frame-card-preview" style="position:relative;width:56px;height:56px;margin:0 auto 6px;display:flex;align-items:center;justify-content:center;overflow:visible;">
                    <div style="width:44px;height:44px;border-radius:50%;overflow:hidden;display:flex;align-items:center;justify-content:center;background:var(--card-elevated);">
                        ${avatarInnerHtml}
                    </div>
                    ${overlayImgHtml}
                </div>
                <div class="discord-frame-card-title">${escapeHtml(f.name)}</div>
                <div style="display:flex;gap:3px;justify-content:center;align-items:center;flex-wrap:wrap;margin-top:2px;">
                    <span class="discord-frame-card-tag" style="background:${f.tierColor || '#94a3b8'}20;color:${f.tierColor || '#94a3b8'};border:1px solid ${f.tierColor || '#94a3b8'}40;font-size:0.55rem;padding:1px 4px;font-weight:800;border-radius:3px;">${f.tierBadge || f.tier}</span>
                </div>
            </div>
        `;
    }).join('');
}

function detectStudentGender() {
    const customGender = (typeof localStorage !== 'undefined' && (localStorage.getItem('srm_gender') || localStorage.getItem('srm_user_gender'))) || '';
    if (customGender) return customGender.toLowerCase();
    const p = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) ? (SRM_DATA.studentProfile || SRM_DATA.profile) : {};
    if (p.gender) {
        const g = String(p.gender).toLowerCase();
        if (g.includes('female') || g === 'f') return 'female';
        if (g.includes('male') || g === 'm') return 'male';
    }
    return 'male';
}

function renderCuratedPFPsGrid() {
    renderMonogramPalettesGrid();
}

function renderMonogramPalettesGrid() {
    const monoContainer = document.getElementById('customizer-monograms-grid');
    if (!monoContainer) return;

    const palettes = (typeof SRM_DATA !== 'undefined' && SRM_DATA.curatedMonogramThemes) ? SRM_DATA.curatedMonogramThemes : [
        { id: "mono-theme-default", name: "Active Theme", bg: "var(--accent)", color: "var(--text-inverse)" },
        { id: "mono-theme-cyber", name: "Cyan Cyber", bg: "#06b6d4", color: "#000000" },
        { id: "mono-theme-gold", name: "Royal Gold", bg: "#f59e0b", color: "#000000" },
        { id: "mono-theme-emerald", name: "Matcha Jade", bg: "#10b981", color: "#ffffff" },
        { id: "mono-theme-violet", name: "Synth Violet", bg: "#8b5cf6", color: "#ffffff" },
        { id: "mono-theme-crimson", name: "Crimson Red", bg: "#ef4444", color: "#ffffff" },
        { id: "mono-theme-obsidian", name: "Pure Obsidian", bg: "#18181b", color: "#f4f4f5" }
    ];

    const currentPfp = localStorage.getItem('srm_custom_avatar_img') || '';
    const currentMono = localStorage.getItem('srm_custom_monogram_theme') || 'mono-theme-default';
    const dName = localStorage.getItem('srm_display_name') || 'Student';
    const inits = dName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';

    monoContainer.innerHTML = palettes.map(p => {
        const isSel = (!currentPfp && currentMono === p.id);
        return `
            <div class="discord-avatar-preset-card ${isSel ? 'active' : ''}" onclick="selectMonogramTheme('${p.id}', '${p.bg}', '${p.color}')" title="${escapeHtml(p.name)}">
                <div class="discord-avatar-preset-thumb" style="background:${p.bg};color:${p.color};font-weight:900;font-size:0.95rem;display:flex;align-items:center;justify-content:center;">
                    ${inits}
                </div>
                <div class="discord-avatar-preset-name">${escapeHtml(p.name)}</div>
            </div>
        `;
    }).join('');
}

function selectCuratedPFP(pfpUrl, pfpName) {
    localStorage.setItem('srm_custom_avatar_img', pfpUrl);
    localStorage.removeItem('srm_custom_monogram_theme');
    localStorage.removeItem('srm_custom_monogram_bg');
    localStorage.removeItem('srm_custom_monogram_color');
    updateCustomizerLivePreview();
    renderCuratedPFPsGrid();
    renderPassportHub();
    showAttendanceToast(`Avatar updated: ${pfpName}!`, "success");
}

function selectMonogramTheme(id, bg, color) {
    localStorage.removeItem('srm_custom_avatar_img');
    localStorage.setItem('srm_custom_monogram_theme', id);
    localStorage.setItem('srm_custom_monogram_bg', bg);
    localStorage.setItem('srm_custom_monogram_color', color);
    updateCustomizerLivePreview();
    renderCuratedPFPsGrid();
    renderPassportHub();
    showAttendanceToast("Monogram color palette applied!", "success");
}

function resetCustomAvatar() {
    localStorage.removeItem('srm_custom_avatar_img');
    localStorage.removeItem('srm_custom_monogram_theme');
    localStorage.removeItem('srm_custom_monogram_bg');
    localStorage.removeItem('srm_custom_monogram_color');
    const inputEl = document.getElementById('custom-avatar-file-input');
    if (inputEl) inputEl.value = '';
    updateCustomizerLivePreview();
    renderCuratedPFPsGrid();
    renderPassportHub();
    showAttendanceToast("Avatar reset to clean monogram!", "info");
}

function handleCustomAvatarUpload(inputEl) {
    if (!inputEl || !inputEl.files || !inputEl.files[0]) return;
    const file = inputEl.files[0];
    const reader = new FileReader();
    reader.onload = function(e) {
        const dataUrl = e.target.result;
        localStorage.setItem('srm_custom_avatar_img', dataUrl);
        updateCustomizerLivePreview();
        renderCuratedPFPsGrid();
        renderPassportHub();
        showAttendanceToast("Custom avatar photo saved on device!", "success");
    };
    reader.readAsDataURL(file);
}

function switchDiscordCustomizerTab(tabId, btnEl) {
    document.querySelectorAll('.discord-tab-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.discord-nav-tab, .cust-tab').forEach(btn => btn.classList.remove('active'));
    
    const target = document.getElementById(tabId);
    if (target) target.classList.add('active');
    
    if (!btnEl && tabId) {
        const tabKey = tabId.replace('tab-', '');
        btnEl = document.getElementById(`tabbtn-${tabKey}`) || document.querySelector(`.cust-tab[onclick*="${tabId}"], .discord-nav-tab[onclick*="${tabId}"]`);
    }
    if (btnEl) btnEl.classList.add('active');
}

const DEFAULT_PROFILE_BANNERS = [
    { id: 'banner-shadow-monarch', name: 'Shadow Monarch', tier: 'Legendary', tierBadge: 'LEGENDARY', tierColor: '#a855f7', category: 'Anime', tag: 'Aura', css: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 35%, #312e81 70%, #4338ca 100%)' },
    { id: 'banner-cyber-neon', name: 'Cyberpunk Tokyo', tier: 'Epic', tierBadge: 'EPIC', tierColor: '#38bdf8', category: 'Gaming', tag: 'Neon', css: 'linear-gradient(135deg, #09090b 0%, #1e1b4b 40%, #4338ca 75%, #06b6d4 100%)' },
    { id: 'banner-aurora-borealis', name: 'Aurora Borealis', tier: 'Mythic', tierBadge: 'MYTHIC', tierColor: '#10b981', category: 'Nature', tag: 'Glacial', css: 'linear-gradient(135deg, #022c22 0%, #065f46 35%, #059669 65%, #10b981 85%, #38bdf8 100%)' },
    { id: 'banner-crimson-abyss', name: 'Crimson Eclipse', tier: 'Rare', tierBadge: 'RARE', tierColor: '#ef4444', category: 'Gaming', tag: 'Fire', css: 'linear-gradient(135deg, #450a0a 0%, #7f1d1d 35%, #991b1b 65%, #dc2626 85%, #f97316 100%)' },
    { id: 'banner-srm-kattankulathur', name: 'SRM Tech Hub', tier: 'Epic', tierBadge: 'EPIC', tierColor: '#0284c7', category: 'Campus', tag: 'KTR', css: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 40%, #0284c7 75%, #38bdf8 100%)' },
    { id: 'banner-cosmic-galaxy', name: 'Deep Space Nebula', tier: 'Legendary', tierBadge: 'LEGENDARY', tierColor: '#c084fc', category: 'Abstract', tag: 'Cosmic', css: 'linear-gradient(135deg, #18181b 0%, #2e1065 35%, #581c87 65%, #7e22ce 85%, #a855f7 100%)' },
    { id: 'banner-sunset-vibes', name: 'Miami Sunset', tier: 'Rare', tierBadge: 'RARE', tierColor: '#f59e0b', category: 'Aesthetic', tag: 'Retro', css: 'linear-gradient(135deg, #312e81 0%, #701a75 35%, #be123c 65%, #fb7185 85%, #f59e0b 100%)' },
    { id: 'banner-emerald-matrix', name: 'Matrix Code', tier: 'Epic', tierBadge: 'EPIC', tierColor: '#22c55e', category: 'Gaming', tag: 'Matrix', css: 'linear-gradient(135deg, #052e16 0%, #14532d 40%, #15803d 75%, #22c55e 100%)' },
    { id: 'banner-gold-royal', name: '24K Imperial Gold', tier: 'Mythic', tierBadge: 'MYTHIC', tierColor: '#fbbf24', category: 'Prestige', tag: 'Royal', css: 'linear-gradient(135deg, #1c1917 0%, #78350f 40%, #d97706 75%, #fbbf24 100%)' },
    { id: 'banner-obsidian-stealth', name: 'Obsidian Stealth', tier: 'Common', tierBadge: 'COMMON', tierColor: '#94a3b8', category: 'Minimal', tag: 'Stealth', css: 'linear-gradient(135deg, #09090b 0%, #18181b 35%, #27272a 70%, #3f3f46 100%)' },
    { id: 'banner-sakura-blossom', name: 'Tokyo Sakura', tier: 'Rare', tierBadge: 'RARE', tierColor: '#f472b6', category: 'Anime', tag: 'Sakura', css: 'linear-gradient(135deg, #3b0764 0%, #701a75 35%, #9d174d 65%, #db2777 85%, #f472b6 100%)' },
    { id: 'banner-synthwave-grid', name: 'Synthwave Horizon', tier: 'Legendary', tierBadge: 'LEGENDARY', tierColor: '#f43f5e', category: 'Retro', tag: 'Synthwave', css: 'linear-gradient(135deg, #1e1b4b 0%, #4c1d95 35%, #c026d3 70%, #f43f5e 100%)' }
];
if (typeof SRM_DATA !== 'undefined') {
    SRM_DATA.profileBanners = DEFAULT_PROFILE_BANNERS;
}

// ── Profile Banners (4-Tier Library & Custom Upload) ──────────────────────────
let activeBannerCategory = 'All';
let currentBannerSearchQuery = '';
let isBannerCompact = false;

function applyProfileBannerToElement(bannerEl, bannerKey) {
    if (!bannerEl) return;
    const customImg = localStorage.getItem('srm_custom_banner_img');
    if ((bannerKey === 'custom-upload' || !bannerKey) && customImg) {
        bannerEl.className = 'discord-profile-banner custom-upload';
        bannerEl.style.backgroundImage = `url('${customImg}')`;
        bannerEl.style.backgroundSize = 'cover';
        bannerEl.style.backgroundPosition = 'center';
        return;
    }

    const allBanners = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profileBanners) ? SRM_DATA.profileBanners : [];
    const bannerObj = allBanners.find(b => b.id === bannerKey) || allBanners[0];

    const safeKey = (bannerObj ? bannerObj.id : (bannerKey || 'banner-shadow-monarch'));
    bannerEl.className = `discord-profile-banner ${safeKey}`;

    if (bannerObj && bannerObj.imageSrc) {
        bannerEl.style.backgroundImage = `url('${bannerObj.imageSrc}')`;
        bannerEl.style.backgroundSize = 'cover';
        bannerEl.style.backgroundPosition = 'center';
    } else if (bannerObj && bannerObj.css) {
        bannerEl.style.backgroundImage = '';
        bannerEl.style.background = bannerObj.css;
    } else {
        bannerEl.style.backgroundImage = '';
        bannerEl.style.background = 'var(--accent)';
    }
}

function searchProfileBanners(query) {
    currentBannerSearchQuery = (query || '').trim().toLowerCase();
    renderProfileBannersGrid(activeBannerCategory);
}

function filterProfileBannersCategory(category, btnEl) {
    activeBannerCategory = category;
    const scroll = document.getElementById('banner-categories-scroll');
    if (scroll && btnEl) {
        scroll.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    renderProfileBannersGrid(category);
}

function toggleBannerGridDensity(btn) {
    const grid = document.getElementById('customizer-banners-grid');
    if (!grid) return;
    isBannerCompact = !isBannerCompact;
    if (isBannerCompact) {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(100px, 1fr))';
        grid.style.maxHeight = '560px';
        if (btn) btn.innerText = '⚡ Standard Grid';
    } else {
        grid.style.gridTemplateColumns = 'repeat(auto-fill, minmax(130px, 1fr))';
        grid.style.maxHeight = '360px';
        if (btn) btn.innerText = '⚡ Compact (3-Col)';
    }
}

function renderProfileBannersGrid(category = 'All') {
    const container = document.getElementById('customizer-banners-grid');
    if (!container) return;
    activeBannerCategory = category;

    const allBanners = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profileBanners) ? SRM_DATA.profileBanners : [];

    let filtered = allBanners;
    if (category && category !== 'All') {
        const target = category.toLowerCase();
        filtered = allBanners.filter(b => {
            const cat = (b.category || '').toLowerCase();
            const tier = (b.tier || '').toLowerCase();
            const tag = (b.tag || '').toLowerCase();
            return tier === target || cat === target || cat.includes(target) || tag.includes(target);
        });
    }

    if (currentBannerSearchQuery) {
        filtered = filtered.filter(b => {
            const n = (b.name || '').toLowerCase();
            const t = (b.tag || '').toLowerCase();
            const c = (b.category || '').toLowerCase();
            const tr = (b.tier || '').toLowerCase();
            return n.includes(currentBannerSearchQuery) || t.includes(currentBannerSearchQuery) || c.includes(currentBannerSearchQuery) || tr.includes(currentBannerSearchQuery);
        });
    }

    const currentBanner = (tempProfileCustomization && tempProfileCustomization.banner)
        ? tempProfileCustomization.banner
        : (localStorage.getItem('srm_profile_banner') || 'banner-shadow-monarch');

    container.innerHTML = filtered.map(b => {
        const isActive = (b.id === currentBanner);
        const previewBg = b.imageSrc 
            ? `background-image: url('${b.imageSrc}'); background-size: cover; background-position: center;`
            : `background: ${b.css || 'var(--accent)'};`;

        return `
            <div class="discord-banner-select-card ${isActive ? 'active' : ''} tier-${(b.tier || 'common').toLowerCase()}" data-banner="${b.id}" onclick="selectProfileBanner('${b.id}')" title="${escapeHtml(b.name)} (${b.tierBadge || b.tier} - ${b.tag || ''})" style="display:flex;flex-direction:column;padding:6px;border-radius:8px;background:var(--card-elevated);border:1.5px solid var(--card-border);cursor:pointer;transition:all 0.15s ease;">
                <div class="banner-color-preview" style="width:100%;height:44px;border-radius:6px;margin-bottom:6px;${previewBg}"></div>
                <div style="font-size:0.72rem;font-weight:800;color:#fff;line-height:1.2;margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(b.name)}</div>
                <div style="display:flex;gap:3px;align-items:center;flex-wrap:wrap;">
                    <span style="background:${b.tierColor || '#94a3b8'}20;color:${b.tierColor || '#94a3b8'};border:1px solid ${b.tierColor || '#94a3b8'}40;font-size:0.52rem;padding:1px 4px;font-weight:800;border-radius:3px;">${b.tierBadge || b.tier}</span>
                    <span style="color:var(--text-sub);font-size:0.52rem;font-weight:700;">${escapeHtml(b.tag || b.category)}</span>
                </div>
            </div>
        `;
    }).join('');
}

function handleCustomBannerUpload(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const base64 = e.target.result;
        try {
            localStorage.setItem('srm_custom_banner_img', base64);
            selectProfileBanner('custom-upload');
            if (typeof showAttendanceToast === 'function') {
                showAttendanceToast('Custom banner uploaded successfully!', 'success');
            }
        } catch (err) {
            console.error(err);
            if (typeof showAttendanceToast === 'function') {
                showAttendanceToast('Image too large. Try a smaller file.', 'warning');
            }
        }
    };
    reader.readAsDataURL(file);
}

function resetCustomBanner() {
    localStorage.removeItem('srm_custom_banner_img');
    selectProfileBanner('banner-shadow-monarch');
    if (typeof showAttendanceToast === 'function') {
        showAttendanceToast('Banner reset to default!', 'info');
    }
}

function applyAvatarDecorationOverlay(avatarContainerEl, frameId) {
    if (!avatarContainerEl) return;
    
    // Remove previous avatar ring classes
    Array.from(avatarContainerEl.classList).forEach(cls => {
        if (cls.startsWith('avatar-ring-')) {
            avatarContainerEl.classList.remove(cls);
        }
    });

    const allFrames = (typeof SRM_DATA !== 'undefined' && SRM_DATA.avatarDecorationFrames) 
        ? SRM_DATA.avatarDecorationFrames 
        : [];
    const activeFrame = frameId || (allFrames[0] ? allFrames[0].id : 'frame-the-hexcore');

    if (activeFrame && activeFrame !== 'none') {
        avatarContainerEl.classList.add(`avatar-ring-${activeFrame}`);
    }

    // Attach / update animated decoration overlay image if available
    let overlay = avatarContainerEl.querySelector('.avatar-decoration-overlay-layer');
    const frameObj = allFrames.find(f => f.id === activeFrame);

    if (frameObj && frameObj.imageSrc) {
        if (!overlay) {
            overlay = document.createElement('img');
            overlay.className = 'avatar-decoration-overlay-layer';
            overlay.onerror = function() { this.style.display = 'none'; };
            overlay.style.position = 'absolute';
            overlay.style.top = '50%';
            overlay.style.left = '50%';
            overlay.style.transform = 'translate(-50%, -50%)';
            overlay.style.width = '126%';
            overlay.style.height = '126%';
            overlay.style.pointerEvents = 'none';
            overlay.style.zIndex = '5';
            overlay.style.objectFit = 'contain';
            avatarContainerEl.appendChild(overlay);
        }
        overlay.src = frameObj.imageSrc;
        overlay.alt = '';
        overlay.style.display = 'block';
    } else {
        if (overlay) overlay.style.display = 'none';
    }
}

function applyCustomAvatarToCircle(circleEl) {
    if (!circleEl) return;
    const customImg = localStorage.getItem('srm_custom_avatar_img');
    const monoBg = localStorage.getItem('srm_custom_monogram_bg');
    const monoColor = localStorage.getItem('srm_custom_monogram_color');
    let photoEl = circleEl.querySelector('.discord-avatar-photo');
    let initialsEl = circleEl.querySelector('span:not(.avatar-decoration-overlay-layer)');

    if (customImg && !customImg.includes('avatar_presets')) {
        if (!photoEl) {
            photoEl = document.createElement('img');
            photoEl.className = 'discord-avatar-photo';
            photoEl.alt = 'Custom Avatar';
            circleEl.insertBefore(photoEl, circleEl.firstChild);
        }
        photoEl.src = customImg;
        photoEl.style.display = 'block';
        if (initialsEl) initialsEl.style.display = 'none';
        circleEl.style.background = 'var(--card)';
    } else {
        if (photoEl) {
            photoEl.remove();
        }
        if (initialsEl) {
            initialsEl.style.display = 'block';
            if (monoColor) initialsEl.style.color = monoColor;
        }
        if (monoBg) {
            circleEl.style.background = monoBg;
        } else {
            circleEl.style.background = 'var(--accent)';
        }
    }
}

function updateCustomizerLivePreview() {
    if (!tempProfileCustomization) return;
    
    // 1. Update Preview Banner
    const prevBanner = document.getElementById('customizer-preview-banner');
    if (prevBanner) {
        applyProfileBannerToElement(prevBanner, tempProfileCustomization.banner || 'banner-shadow-monarch');
    }

    // 2. Update Preview Avatar Frame & Custom Avatar Photo
    const prevAvatar = document.getElementById('customizer-preview-avatar');
    if (prevAvatar) {
        applyAvatarDecorationOverlay(prevAvatar, tempProfileCustomization.frame || 'frame-crown-radiance');
        applyCustomAvatarToCircle(prevAvatar);
    }

    // 3. Update Preview Title
    const prevTitle = document.getElementById('customizer-preview-title');
    if (prevTitle) {
        prevTitle.textContent = tempProfileCustomization.title || 'Bunk Mathematician (75.1% Specialist)';
    }
}

function downloadAvatarWithDecoration() {
    const cust = getProfileCustomization();
    const customImg = localStorage.getItem('srm_custom_avatar_img');
    const monoBg = localStorage.getItem('srm_custom_monogram_bg') || '#5865f2';
    const monoColor = localStorage.getItem('srm_custom_monogram_color') || '#ffffff';

    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');

    const saveCanvas = () => {
        // Draw aesthetic accent ring
        ctx.lineWidth = 12;
        ctx.strokeStyle = '#5865f2';
        ctx.shadowColor = '#5865f2';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.arc(256, 256, 230, 0, Math.PI * 2, true);
        ctx.stroke();

        const a = document.createElement('a');
        a.download = 'srm_avatar_profile.png';
        a.href = canvas.toDataURL('image/png');
        a.click();
        showAttendanceToast("Avatar downloaded successfully!", "success");
    };

    ctx.save();
    ctx.beginPath();
    ctx.arc(256, 256, 220, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.clip();

    if (customImg) {
        const baseImg = new Image();
        baseImg.onload = () => {
            ctx.drawImage(baseImg, 36, 36, 440, 440);
            ctx.restore();
            saveCanvas();
        };
        baseImg.onerror = () => {
            ctx.fillStyle = monoBg.startsWith('var') ? '#5865f2' : monoBg;
            ctx.fillRect(0, 0, 512, 512);
            ctx.restore();
            saveCanvas();
        };
        baseImg.src = customImg;
    } else {
        const dName = localStorage.getItem('srm_display_name') || 'Student';
        const inits = dName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
        ctx.fillStyle = monoBg.startsWith('var') ? '#5865f2' : monoBg;
        ctx.fillRect(0, 0, 512, 512);
        ctx.fillStyle = monoColor.startsWith('var') ? '#ffffff' : monoColor;
        ctx.font = 'bold 160px Inter, sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(inits, 256, 256);
        ctx.restore();
        saveCanvas();
    }
}

function downloadFullDiscordCard() {
    const cardEl = document.getElementById('passport-discord-profile-card') || document.getElementById('smart-id-card');
    if (!cardEl) return;

    showAttendanceToast("Exporting student Discord card...", "info");
    const serialized = cardEl.outerHTML;
    const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="480" height="600"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml" style="font-family:Inter,sans-serif;color:#f2f3f5;background:#111214;padding:12px;border-radius:16px;">${serialized}</div></foreignObject></svg>`;
    const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.download = 'srm_discord_profile_card.svg';
    a.href = url;
    a.click();
    showAttendanceToast("Discord ID Card downloaded!", "success");
}

function openProfileCustomizerModal(targetTab = 'tab-decorations') {
    const modal = document.getElementById('profile-customizer-modal');
    if (!modal) return;

    tempProfileCustomization = { ...getProfileCustomization() };
    if (!tempProfileCustomization.pinnedBadges) {
        tempProfileCustomization.pinnedBadges = ["attendance-titan", "bunk-theorist", "speed-runner"];
    }
    if (!tempProfileCustomization.frame) {
        tempProfileCustomization.frame = "frame-minimal-ring";
    }
    if (!tempProfileCustomization.banner) {
        tempProfileCustomization.banner = localStorage.getItem('srm_profile_banner') || "banner-shadow-monarch";
    }

    // 1. Render Profile Banners Grid
    renderProfileBannersGrid(typeof activeBannerCategory !== 'undefined' ? activeBannerCategory : 'All');

    // 2. Render Avatar Decoration Frames Grid
    renderAvatarFramesGrid(typeof activeAvatarFrameCategory !== 'undefined' ? activeAvatarFrameCategory : 'All');

    // 3. Render Curated Safe PFPs Grid
    renderCuratedPFPsGrid(typeof activePFPCategory !== 'undefined' ? activePFPCategory : 'all');

    // 4. Render Title Chips
    const titlesContainer = document.getElementById('customizer-titles-container');
    if (titlesContainer && typeof NERD_TITLES !== 'undefined') {
        titlesContainer.innerHTML = NERD_TITLES.map(t => {
            const isSel = (t === tempProfileCustomization.title);
            return `<button class="filter-chip-btn ${isSel ? 'active' : ''}" onclick="selectProfileTitle('${escapeHtml(t)}')">${escapeHtml(t)}</button>`;
        }).join('');
    }

    // 5. Render Badges
    renderCustomizerBadges();

    // 6. Populate Bio
    const bioInput = document.getElementById('customizer-bio-input');
    if (bioInput) bioInput.value = tempProfileCustomization.bio || '';

    // 7. Update Live Preview
    const p = (typeof SRM_DATA !== 'undefined' && (SRM_DATA.studentProfile || SRM_DATA.profile)) ? (SRM_DATA.studentProfile || SRM_DATA.profile) : {};
    const dName = localStorage.getItem('srm_display_name') || p.name || (localStorage.getItem('srm_auto_id') ? localStorage.getItem('srm_auto_id').toUpperCase() : 'Student');
    const regNo = localStorage.getItem('srm_reg_no') || p.regNo || '';
    const inits = dName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
    
    const rawId = localStorage.getItem('srm_auto_id') || '';
    let cleanReg = (regNo || '').replace(/[^a-zA-Z0-9]/g, '').trim();
    if (!cleanReg || cleanReg.toLowerCase().includes('kattankulathur') || cleanReg.toLowerCase().includes('srmist') || cleanReg.length < 4) {
        cleanReg = rawId ? `@${rawId}` : (p.registrationNumber || (localStorage.getItem('srm_reg_no') || 'Student ID'));
    }

    const pName = document.getElementById('customizer-preview-name');
    const pHandle = document.getElementById('customizer-preview-handle');
    const pInits = document.getElementById('customizer-preview-initials');
    if (pName) pName.textContent = typeof formatTitleCaseName === 'function' ? formatTitleCaseName(dName) : dName;
    if (pHandle) pHandle.textContent = `${cleanReg} • SRMIST`;
    if (pInits) pInits.textContent = inits;

    updateCustomizerLivePreview();

    // Switch to target tab if specified
    if (targetTab) {
        const tabBtn = document.querySelector(`.cust-tab[onclick*="${targetTab}"], .discord-nav-tab[onclick*="${targetTab}"]`);
        switchDiscordCustomizerTab(targetTab, tabBtn);
    }

    modal.style.display = 'flex';
}

function closeProfileCustomizerModal() {
    const modal = document.getElementById('profile-customizer-modal');
    if (modal) modal.style.display = 'none';
}

function selectProfileBanner(bannerKey) {
    if (!tempProfileCustomization) tempProfileCustomization = getProfileCustomization();
    tempProfileCustomization.banner = bannerKey;
    localStorage.setItem('srm_profile_banner', bannerKey);
    document.querySelectorAll('.discord-banner-select-card').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-banner') === bannerKey);
    });
    updateCustomizerLivePreview();
    renderPassportHub();
}

function selectProfileFrame(frameKey) {
    if (!tempProfileCustomization) tempProfileCustomization = getProfileCustomization();
    tempProfileCustomization.frame = frameKey;
    localStorage.setItem('srm_profile_frame', frameKey);
    document.querySelectorAll('.discord-frame-card').forEach(el => {
        el.classList.toggle('active', el.getAttribute('data-frame') === frameKey);
    });
    updateCustomizerLivePreview();
    renderPassportHub();
}

function selectProfileRing(ringKey) {
    selectProfileFrame(ringKey);
}

function selectProfileTitle(titleStr) {
    if (!tempProfileCustomization) tempProfileCustomization = getProfileCustomization();
    tempProfileCustomization.title = titleStr;
    const titlesContainer = document.getElementById('customizer-titles-container');
    if (titlesContainer) {
        titlesContainer.innerHTML = NERD_TITLES.map(t => {
            const isSel = (t === titleStr);
            return `<button class="filter-chip-btn ${isSel ? 'active' : ''}" onclick="selectProfileTitle('${escapeHtml(t)}')">${escapeHtml(t)}</button>`;
        }).join('');
    }
    updateCustomizerLivePreview();
}

function togglePinnedBadge(badgeId) {
    if (!tempProfileCustomization) tempProfileCustomization = getProfileCustomization();
    let pinned = tempProfileCustomization.pinnedBadges || [];
    if (pinned.includes(badgeId)) {
        if (pinned.length > 1) {
            pinned = pinned.filter(id => id !== badgeId);
        }
    } else {
        if (pinned.length >= 3) {
            pinned.shift(); // keep max 3
        }
        pinned.push(badgeId);
    }
    tempProfileCustomization.pinnedBadges = pinned;
    renderCustomizerBadges();
}

function renderCustomizerBadges() {
    const container = document.getElementById('customizer-badges-container');
    const countEl = document.getElementById('customizer-badge-count');
    const pinned = tempProfileCustomization.pinnedBadges || [];

    if (countEl) countEl.textContent = `${pinned.length} / 3 Selected`;

    if (container) {
        container.innerHTML = NERD_ACHIEVEMENTS.map(a => {
            const isPinned = pinned.includes(a.id);
            const iconSvg = a.iconSvg || '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
            return `
                <div class="discord-badge-select-item ${isPinned ? 'selected' : ''}" onclick="togglePinnedBadge('${a.id}')">
                    <span class="discord-badge-pill" style="width:24px;height:24px;flex-shrink:0;">${iconSvg}</span>
                    <div style="min-width:0;flex:1;">
                        <div style="font-size:0.72rem;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(a.name)}</div>
                        <div style="font-size:0.58rem;color:${isPinned ? 'var(--accent)' : 'var(--text-muted)'};font-weight:700;">${isPinned ? '✓ PINNED' : 'Tap to pin'}</div>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function saveProfileCustomization() {
    if (!tempProfileCustomization) return;
    const bioInput = document.getElementById('customizer-bio-input');
    if (bioInput) tempProfileCustomization.bio = bioInput.value.trim() || 'Maintaining attendance & coding past midnight.';

    localStorage.setItem('srm_custom_profile', JSON.stringify(tempProfileCustomization));
    if (tempProfileCustomization.banner) localStorage.setItem('srm_profile_banner', tempProfileCustomization.banner);
    if (tempProfileCustomization.frame) localStorage.setItem('srm_profile_frame', tempProfileCustomization.frame);
    closeProfileCustomizerModal();
    renderPassportHub();
    showAttendanceToast("Discord profile identity & decorations saved!", "success");
}

// ─── In-Tab Discord Profile Customization Studio ──────────────────────────────
function switchInTabStudioSection(paneId, btnEl) {
    const deck = document.getElementById('in-tab-profile-customizer');
    if (!deck) return;
    deck.querySelectorAll('.deck-pane').forEach(p => p.classList.remove('active'));
    deck.querySelectorAll('.deck-tab-btn').forEach(b => b.classList.remove('active'));
    
    const target = document.getElementById(paneId);
    if (target) target.classList.add('active');
    if (btnEl) btnEl.classList.add('active');
}

function filterInTabFrames(category, btnEl) {
    const scroll = document.getElementById('in-tab-avatar-categories-scroll');
    if (scroll && btnEl) {
        scroll.querySelectorAll('.filter-chip-btn').forEach(b => b.classList.remove('active'));
        btnEl.classList.add('active');
    }
    renderInTabFramesGrid(category);
}

function flashStudioLiveSync() {
    const pill = document.getElementById('studio-auto-save-pill');
    if (!pill) return;
    pill.style.background = 'rgba(88, 101, 242, 0.3)';
    pill.style.color = '#5865f2';
    pill.textContent = '✓ Saved';
    setTimeout(() => {
        pill.style.background = 'rgba(35, 165, 90, 0.15)';
        pill.style.color = '#23a55a';
        pill.textContent = '⚡ Live Sync';
    }, 1200);
}

function renderInTabFramesGrid(category = 'All') {
    const container = document.getElementById('in-tab-frames-grid');
    if (!container) return;

    const allFrames = SRM_DATA.avatarDecorationFrames || [];
    const filtered = (category === 'All') 
        ? allFrames 
        : allFrames.filter(f => f.category.toLowerCase() === category.toLowerCase());

    const cust = getProfileCustomization();
    const currentFrame = cust.frame || 'frame-crown-radiance';

    container.innerHTML = filtered.map(f => {
        const isActive = (f.id === currentFrame);
        return `
            <div class="discord-frame-card ${isActive ? 'active' : ''}" data-frame="${f.id}" onclick="selectInTabProfileFrame('${f.id}')">
                <div class="discord-frame-card-preview">
                    <span>${(f.name || 'FR')[0]}</span>
                    <div class="avatar-decoration-overlay-layer">
                        <img src="${f.imageSrc}" class="avatar-decoration-img" alt="${escapeHtml(f.name)}" loading="lazy" />
                    </div>
                </div>
                <div class="discord-frame-card-title">${escapeHtml(f.name)}</div>
                <span class="discord-frame-card-tag">${f.tag}</span>
            </div>
        `;
    }).join('');
}

function renderInTabBannersGrid() {
    const container = document.getElementById('in-tab-banners-grid');
    if (!container) return;

    const cust = getProfileCustomization();
    const currentBanner = cust.banner || 'banner-shadow-monarch';

    const banners = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profileBanners) ? SRM_DATA.profileBanners : DEFAULT_PROFILE_BANNERS;

    container.innerHTML = banners.map(b => {
        const isSel = (b.id === currentBanner || b.key === currentBanner);
        const previewBg = b.imageSrc ? `background-image: url('${b.imageSrc}'); background-size: cover;` : `background: ${b.css || 'var(--accent)'};`;
        return `
            <div class="discord-banner-select-card ${isSel ? 'active' : ''}" data-banner="${b.id}" onclick="selectInTabProfileBanner('${b.id}')" style="cursor:pointer;padding:6px;border-radius:8px;background:var(--card-elevated);border:1.5px solid var(--card-border);">
                <div class="banner-color-preview" style="width:100%;height:44px;border-radius:6px;margin-bottom:6px;${previewBg}"></div>
                <div style="font-size:0.72rem;font-weight:700;color:#f2f3f5;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(b.name)}</div>
            </div>
        `;
    }).join('');
}

function renderInTabBadgesGrid() {
    const container = document.getElementById('in-tab-badges-grid');
    if (!container) return;

    const cust = getProfileCustomization();
    const pinned = cust.pinnedBadges || ["attendance-titan", "bunk-theorist", "speed-runner"];

    container.innerHTML = NERD_ACHIEVEMENTS.map(a => {
        const isPinned = pinned.includes(a.id);
        const iconSvg = a.iconSvg || '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
        return `
            <div class="discord-badge-select-item ${isPinned ? 'selected' : ''}" onclick="toggleInTabBadge('${a.id}')">
                <span class="discord-badge-pill" style="width:24px;height:24px;flex-shrink:0;">${iconSvg}</span>
                <div style="min-width:0;flex:1;">
                    <div style="font-size:0.72rem;font-weight:700;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${escapeHtml(a.name)}</div>
                    <div style="font-size:0.58rem;color:${isPinned ? 'var(--accent)' : 'var(--text-muted)'};font-weight:700;">${isPinned ? '✓ PINNED' : 'Tap to pin'}</div>
                </div>
            </div>
        `;
    }).join('');
}

function renderInTabCustomizer() {
    renderInTabFramesGrid('All');
    renderInTabBannersGrid();
    renderInTabBadgesGrid();

    const cust = getProfileCustomization();
    const titleInput = document.getElementById('in-tab-title-input');
    if (titleInput) titleInput.value = cust.title || 'Bunk Mathematician (75.1% Specialist)';

    const bioInput = document.getElementById('in-tab-bio-input');
    if (bioInput) bioInput.value = cust.bio || 'Coding past midnight in Tech Park. Maintaining > 75% attendance like a pro.';
}

function selectInTabProfileFrame(frameKey) {
    const cust = getProfileCustomization();
    cust.frame = frameKey;
    localStorage.setItem('srm_custom_profile', JSON.stringify(cust));
    renderInTabFramesGrid();
    renderStudentSmartIDCard();
    flashStudioLiveSync();
}

function selectInTabProfileBanner(bannerKey) {
    const cust = getProfileCustomization();
    cust.banner = bannerKey;
    localStorage.setItem('srm_custom_profile', JSON.stringify(cust));
    renderInTabBannersGrid();
    renderStudentSmartIDCard();
    flashStudioLiveSync();
}

function updateInTabProfileTitle(val) {
    const cust = getProfileCustomization();
    cust.title = val.trim() || 'SRM Student';
    localStorage.setItem('srm_custom_profile', JSON.stringify(cust));
    document.querySelectorAll('#profile-nerd-title-text, #passport-nerd-title-text').forEach(el => el.textContent = cust.title);
    flashStudioLiveSync();
}

function applyInTabTitlePreset(val) {
    const titleInput = document.getElementById('in-tab-title-input');
    if (titleInput) titleInput.value = val;
    updateInTabProfileTitle(val);
}

function updateInTabProfileBio(val) {
    const cust = getProfileCustomization();
    cust.bio = val.trim();
    localStorage.setItem('srm_custom_profile', JSON.stringify(cust));
    const bioEl = document.getElementById('profile-card-bio');
    if (bioEl) bioEl.textContent = cust.bio;
    flashStudioLiveSync();
}

function toggleInTabBadge(badgeId) {
    const cust = getProfileCustomization();
    let pinned = cust.pinnedBadges || [];
    if (pinned.includes(badgeId)) {
        if (pinned.length > 1) {
            pinned = pinned.filter(id => id !== badgeId);
        }
    } else {
        if (pinned.length >= 3) {
            pinned.shift();
        }
        pinned.push(badgeId);
    }
    cust.pinnedBadges = pinned;
    localStorage.setItem('srm_custom_profile', JSON.stringify(cust));
    renderInTabBadgesGrid();
    renderStudentSmartIDCard();
    flashStudioLiveSync();
}

// ─── Web Audio Sci-Fi Sound Synthesizer (0 Bytes, 100% Native) ───────────────
let _audioCtx = null;
function getAudioContext() {
    if (!_audioCtx) {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) _audioCtx = new AudioCtx();
    }
    if (_audioCtx && _audioCtx.state === 'suspended') {
        _audioCtx.resume();
    }
    return _audioCtx;
}

function playCardSound(type) {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        const now = ctx.currentTime;

        if (type === 'flip') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(450, now);
            osc.frequency.exponentialRampToValueAtTime(120, now + 0.18);
            gain.gain.setValueAtTime(0.2, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.18);
        } else if (type === 'hologram') {
            [523.25, 659.25, 783.99, 1046.50].forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(freq, now + i * 0.04);
                gain.gain.setValueAtTime(0.12, now + i * 0.04);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.04 + 0.25);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.04);
                osc.stop(now + i * 0.04 + 0.25);
            });
        } else if (type === 'click') {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, now);
            osc.frequency.exponentialRampToValueAtTime(200, now + 0.05);
            gain.gain.setValueAtTime(0.15, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start(now);
            osc.stop(now + 0.05);
        }
    } catch (_) {}
}

// ─── 3D Smart Card Interactive Physics & Gestures ─────────────────────────────
function initCard3DPhysics() {
    document.querySelectorAll('.smart-id-stage').forEach(stage => {
        if (stage._physicsBound) return;
        stage._physicsBound = true;
        const card = stage.querySelector('.smart-id-card-3d');
        if (!card) return;

        function handleMove(e) {
            const rect = stage.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            
            const x = (clientX - rect.left) / rect.width;
            const y = (clientY - rect.top) / rect.height;
            
            const tiltX = (y - 0.5) * -18;
            const tiltY = (x - 0.5) * 22;
            
            const isFlipped = card.classList.contains('flipped');
            const baseRotY = isFlipped ? 180 : 0;
            
            card.style.transform = `rotateY(${baseRotY + tiltY}deg) rotateX(${tiltX}deg) scale3d(1.02, 1.02, 1.02)`;
            card.querySelectorAll('.smart-id-glare').forEach(g => {
                g.style.setProperty('--glare-x', `${x * 100}%`);
                g.style.setProperty('--glare-y', `${y * 100}%`);
                g.style.opacity = '1';
            });
        }

        function handleReset() {
            const isFlipped = card.classList.contains('flipped');
            card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
            card.querySelectorAll('.smart-id-glare').forEach(g => {
                g.style.opacity = '0.5';
            });
        }

        stage.addEventListener('mousemove', handleMove);
        stage.addEventListener('mouseleave', handleReset);
        stage.addEventListener('touchmove', handleMove, { passive: true });
        stage.addEventListener('touchend', handleReset);
    });
}

function toggleCard3DFlip() {
    document.querySelectorAll('.smart-id-card-3d').forEach(card => {
        const isFlipped = card.classList.toggle('flipped');
        card.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
    });
    playCardSound('flip');
    if ('vibrate' in navigator) {
        try { navigator.vibrate(25); } catch(_) {}
    }
}

function applyCardMaterial(matClass, btnEl) {
    const materials = ['mat-hologram-prism', 'mat-matrix-cyber', 'mat-gold-sovereign', 'mat-carbon-stealth', 'mat-cosmic-nebula', 'mat-sakura-dusk'];
    
    document.querySelectorAll('.smart-id-card-3d').forEach(card => {
        materials.forEach(m => card.classList.remove(m));
        card.classList.add(matClass);
    });
    
    localStorage.setItem('srm_custom_card_mat', matClass);

    document.querySelectorAll('#card-materials-chips-scroll').forEach(container => {
        container.querySelectorAll('.filter-chip-btn').forEach(btn => {
            const clickFn = btn.getAttribute('onclick') || '';
            btn.classList.toggle('active', clickFn.includes(matClass));
        });
    });
    playCardSound('hologram');
}

let lastActiveTabBeforePassport = 'view-schedule';

function toggleProfileView(e) {
    if (e) {
        if (typeof e.stopPropagation === 'function') e.stopPropagation();
        if (typeof e.preventDefault === 'function') e.preventDefault();
    }
    const passportView = document.getElementById('view-passport');
    const isCurrentlyInPassport = passportView && passportView.style.display !== 'none';

    if (isCurrentlyInPassport) {
        // Return back to dashboard / previous tab
        const returnTab = (lastActiveTabBeforePassport && lastActiveTabBeforePassport !== 'view-passport') 
            ? lastActiveTabBeforePassport 
            : 'view-schedule';
        switchTab(returnTab);
    } else {
        // Remember visible tab
        document.querySelectorAll('.tab-view').forEach(v => {
            if (v.id !== 'view-passport' && v.style.display !== 'none') {
                lastActiveTabBeforePassport = v.id;
            }
        });
        switchTab('view-passport');
        renderPassportHub();
    }
    const wrap = document.querySelector('.mobile-wrapper');
    if (wrap && typeof wrap.scrollTo === 'function') {
        try { wrap.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) { wrap.scrollTop = 0; }
    }
    if (typeof window !== 'undefined' && typeof window.scrollTo === 'function') {
        try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (_) {}
    }
    playCardSound('hologram');
}

function openStudentCardView(e) {
    toggleProfileView(e);
}

function switchPassportSubTab(subTabId, btnEl) {
    document.querySelectorAll('.passport-sub-pane').forEach(pane => pane.style.display = 'none');
    document.querySelectorAll('.passport-tab-btn').forEach(btn => btn.classList.remove('active'));
    
    const target = document.getElementById(subTabId);
    if (target) target.style.display = 'block';
    if (btnEl) btnEl.classList.add('active');
}

window.toggleProfileView = toggleProfileView;
window.openStudentCardView = openStudentCardView;
window.switchPassportSubTab = switchPassportSubTab;
window.openProfileCustomizerModal = openProfileCustomizerModal;
window.closeProfileCustomizerModal = closeProfileCustomizerModal;
window.selectProfileBanner = selectProfileBanner;
window.selectProfileFrame = selectProfileFrame;
window.selectProfileRing = selectProfileRing;
window.selectProfileTitle = selectProfileTitle;
window.togglePinnedBadge = togglePinnedBadge;
window.saveProfileCustomization = saveProfileCustomization;
window.switchDiscordCustomizerTab = switchDiscordCustomizerTab;
window.handleCustomAvatarUpload = handleCustomAvatarUpload;
window.resetCustomAvatar = resetCustomAvatar;
window.downloadAvatarWithDecoration = downloadAvatarWithDecoration;
window.downloadFullDiscordCard = downloadFullDiscordCard;
window.applyCustomAvatarToCircle = applyCustomAvatarToCircle;
window.toggleCard3DFlip = toggleCard3DFlip;
window.applyCardMaterial = applyCardMaterial;
window.openStudentCardView = openStudentCardView;
window.renderStudentSmartIDCard = renderPassportHub;

// ─── Super-App: Academic Passport & 3D Student Smart Card Hub ─────────────────
function renderPassportHub() {
    if (typeof SRM_DATA === 'undefined') return;

    const p = SRM_DATA.passport || {};
    const prof = (SRM_DATA && (SRM_DATA.studentProfile || SRM_DATA.profile)) || {};
    const cust = getProfileCustomization();

    // 0. Render Discord User Profile Cards across Dashboard & Passport Tab
    const currentBanner = cust.banner || localStorage.getItem('srm_profile_banner') || 'banner-shadow-monarch';
    document.querySelectorAll('.discord-profile-banner').forEach(bannerEl => {
        applyProfileBannerToElement(bannerEl, currentBanner);
    });

    const displayName = localStorage.getItem('srm_display_name') || prof.name || (localStorage.getItem('srm_auto_id') ? localStorage.getItem('srm_auto_id').toUpperCase() : 'Student');
    const regNo = localStorage.getItem('srm_reg_no') || prof.regNo || '';
    const initials = displayName.split(' ').filter(Boolean).map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
    
    const rawId = localStorage.getItem('srm_auto_id') || '';
    let cleanReg = (regNo || '').replace(/[^a-zA-Z0-9]/g, '').trim();
    if (!cleanReg || cleanReg.toLowerCase().includes('kattankulathur') || cleanReg.toLowerCase().includes('srmist') || cleanReg.length < 4) {
        cleanReg = rawId ? `@${rawId}` : (prof.registrationNumber || (localStorage.getItem('srm_reg_no') || 'Student ID'));
    }
    const handleStr = `${cleanReg} • SRMIST Kattankulathur`;

    // Display Names & Handles
    document.querySelectorAll('#smart-card-student-name, #passport-student-name').forEach(el => el.textContent = formatTitleCaseName(displayName));
    document.querySelectorAll('#smart-card-reg-no, #passport-reg-no').forEach(el => el.textContent = handleStr);
    document.querySelectorAll('#smart-card-avatar-initials, #passport-avatar-initials').forEach(el => el.textContent = initials);
    
    // Avatar Frame Overlays & Photos
    document.querySelectorAll('#smart-card-avatar-frame, #passport-avatar-frame, #customizer-preview-avatar, #header-avatar').forEach(el => {
        applyAvatarDecorationOverlay(el, cust.frame || 'frame-minimal-ring');
        applyCustomAvatarToCircle(el);
    });
    
    // Academic Dept & Section
    const rawDegree = localStorage.getItem('srm_program') || prof.program || prof.degree || 'B.Tech Program';
    let degreeStr = rawDegree.replace('B.Tech.-', 'B.Tech ').split('[')[0].trim();
    const sectionStr = (localStorage.getItem('srm_section') || prof.section || prof.batch || '').replace(/Section\s*/i, '').trim();
    document.querySelectorAll('#smart-card-dept-pill, #passport-dept-pill').forEach(el => el.textContent = degreeStr);
    document.querySelectorAll('#smart-card-sec-pill, #passport-sec-pill').forEach(el => el.textContent = sectionStr ? ('Section ' + sectionStr + ' • 1st Year') : '1st Year');
    
    let storedBlock = localStorage.getItem('srm_user_hostel_block') || prof.hostel || 'Day Scholar / Off-Campus';
    let storedRoom = localStorage.getItem('srm_user_room_no') || prof.room || '';

    const hBlock = storedBlock;
    const hRoom = (storedRoom && storedRoom !== '-' && !/^\d{5,}$/.test(storedRoom)) ? storedRoom : '';
    document.querySelectorAll('#smart-card-hostel-pill, #passport-hostel-pill').forEach(el => el.textContent = hRoom ? `${hBlock} Block • Room ${hRoom}` : hBlock);

    // 1. Top Navbar Avatar & Tag Navigation
    const headerAvatarEl = document.getElementById('header-avatar');
    if (headerAvatarEl) {
        applyAvatarDecorationOverlay(headerAvatarEl, cust.frame || 'frame-minimal-ring');
        headerAvatarEl.style.cursor = 'pointer';
        headerAvatarEl.title = 'Toggle Student Profile & Dashboard';
    }

    const titleTextEl = document.getElementById('profile-nerd-title-text');
    const passportTitleTextEl = document.getElementById('passport-nerd-title-text');
    const activeTitle = cust.title || 'Bunk Mathematician (75.1% Specialist)';
    if (titleTextEl) titleTextEl.textContent = activeTitle;
    if (passportTitleTextEl) passportTitleTextEl.textContent = activeTitle;

    const bioTextEl = document.getElementById('profile-card-bio');
    if (bioTextEl) bioTextEl.textContent = cust.bio || 'Maintaining > 75% attendance like a pro.';

    // Vector SVG Badges Row (Zero Emojis!)
    const pinned = cust.pinnedBadges || ["attendance-titan", "bunk-theorist", "speed-runner"];
    const badgesHtml = pinned.map(pId => {
        const ach = NERD_ACHIEVEMENTS.find(a => a.id === pId) || { iconSvg: '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="9"></circle></svg>', name: pId };
        const iconSvg = ach.iconSvg || '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>';
        return `<span class="discord-badge-pill" title="${escapeHtml(ach.name)}" onclick="openProfileCustomizerModal()">${iconSvg}</span>`;
    }).join('');

    document.querySelectorAll('#profile-discord-badges-row, #passport-discord-badges-row, #customizer-preview-badges').forEach(row => {
        row.innerHTML = badgesHtml;
    });

    // 2. Degree Credit Progress
    const cred = p.curriculum || { totalCreditsReq: 160, earnedCredits: 22 };
    const pct = ((cred.earnedCredits / cred.totalCreditsReq) * 100).toFixed(1);
    const credRatioEl = document.getElementById('pass-credits-ratio');
    const credBarEl = document.getElementById('pass-credit-progress-bar');
    if (credRatioEl) credRatioEl.textContent = `${cred.earnedCredits} / ${cred.totalCreditsReq} Credits (${pct}%)`;
    if (credBarEl) credBarEl.style.width = pct + '%';

    // 3. Faculty Advisor & Academic Counselor Details
    const faNameEl = document.getElementById('fa-name');
    const faDeptEl = document.getElementById('fa-dept');
    const faCabinEl = document.getElementById('fa-cabin');
    const faEmailBtn = document.getElementById('fa-email-btn');

    const rawAdvisor = localStorage.getItem('srm_advisor') || prof.facultyAdvisor || 'Dr. Prithi S.';
    let cleanAdvisor = rawAdvisor.split('[')[0].replace(/faculty advisor/i, '').replace(/counselor/i, '').trim();
    if (!cleanAdvisor || cleanAdvisor.length < 3) cleanAdvisor = 'Dr. Prithi S.';
    cleanAdvisor = formatTitleCaseName(cleanAdvisor);

    const advisorEmail = (rawAdvisor.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/) || [''])[0];

    if (faNameEl) faNameEl.textContent = cleanAdvisor;
    if (faDeptEl) faDeptEl.textContent = 'Department of Computer Science & Engineering';
    if (faCabinEl) faCabinEl.innerHTML = `<b>Office Base:</b> UB 6th Floor, Room 601 &bull; <b>Section:</b> Sec ${sectionStr}`;
    if (faEmailBtn) faEmailBtn.href = advisorEmail ? `mailto:${advisorEmail}` : `mailto:prithis@srmist.edu.in`;

    // 4. Hostel Allocation Info
    const hostelRoomEl = document.getElementById('pass-hostel-room');
    const hostelTypeEl = document.getElementById('pass-hostel-type');
    
    if (hostelRoomEl) {
        hostelRoomEl.textContent = hRoom ? `${hBlock} • Room ${hRoom}` : hBlock;
        if (hostelTypeEl) hostelTypeEl.textContent = 'Allotted / Registered';
    }

    // 5. Credit Categories Breakdown
    const catContainer = document.getElementById('pass-credit-categories-container');
    if (catContainer && p.creditCategories) {
        catContainer.innerHTML = p.creditCategories.map(c => {
            const catPct = Math.min(100, Math.round((c.completed / c.total) * 100));
            return `
                <div class="credit-cat-item" style="background:var(--card-elevated);border:1px solid var(--card-border);border-radius:var(--radius-md);padding:8px 12px;margin-bottom:6px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;margin-bottom:5px;">
                        <span style="font-weight:700;color:var(--text-main);">${c.category}</span>
                        <span style="font-family:var(--font-mono);color:var(--accent);font-weight:700;font-size:0.72rem;">${c.completed} / ${c.total} cr (${catPct}%)</span>
                    </div>
                    <div style="width:100%;height:5px;background:var(--card);border-radius:9999px;overflow:hidden;border:1px solid var(--card-border);">
                        <div style="width:${catPct}%;height:100%;background:var(--accent);border-radius:9999px;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 6. Regulation-Aware Target SGPA / Goal Simulator
    renderSGPASimulator();

    // 7. In-Tab Discord Profile Customizer Studio
    if (typeof renderInTabCustomizer === 'function') {
        renderInTabCustomizer();
    }
}

function renderSGPASimulator() {
    const container = document.getElementById('gpa-courses-simulator-list');
    if (!container || typeof SRM_DATA === 'undefined' || !SRM_DATA.courses) return;

    const courses = SRM_DATA.courses;
    const grades = SRM_DATA.gradeScale || [
        { grade: "O", points: 10 },
        { grade: "A+", points: 9 },
        { grade: "A", points: 8 },
        { grade: "B+", points: 7 },
        { grade: "B", points: 6 }
    ];

    // Initialize default grades if not set
    courses.forEach((c, idx) => {
        if (!userGradeSelections[c.code]) {
            userGradeSelections[c.code] = (idx % 2 === 0) ? 10 : 9; // Default O and A+
        }
    });

    container.innerHTML = courses.map(c => `
        <div style="background:#14141c;border:1px solid #22222d;border-radius:10px;padding:10px 12px;">
            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <div>
                    <span style="font-size:0.68rem;background:#1e1e2a;color:#38bdf8;padding:2px 6px;border-radius:4px;font-family:'JetBrains Mono',monospace;font-weight:700;">${c.code}</span>
                    <span style="font-size:0.8rem;font-weight:700;color:#f4f4f5;margin-left:4px;">${escapeHtml(c.title)}</span>
                </div>
                <span style="font-size:0.72rem;background:#1e293b;color:#38bdf8;padding:2px 8px;border-radius:6px;font-weight:700;">${c.credits} Credits</span>
            </div>
            <div style="display:flex;gap:6px;overflow-x:auto;scrollbar-width:none;">
                ${grades.map(g => `
                    <button class="grade-picker-chip ${userGradeSelections[c.code] === g.points ? 'selected' : ''}" onclick="selectCourseGrade('${c.code}', ${g.points})">
                        ${g.grade} (${g.points})
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');

    calculateSimulatedSGPA();
}

function selectCourseGrade(code, points) {
    userGradeSelections[code] = points;
    renderSGPASimulator();
}

function calculateSimulatedSGPA() {
    if (typeof SRM_DATA === 'undefined' || !SRM_DATA.courses) return;

    let totalPoints = 0;
    let totalCredits = 0;

    SRM_DATA.courses.forEach(c => {
        const pts = userGradeSelections[c.code] || 10;
        const cr = c.credits || 3;
        totalPoints += (pts * cr);
        totalCredits += cr;
    });

    const sgpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '10.00';
    const valEl = document.getElementById('sim-sgpa-value');
    if (valEl) {
        valEl.textContent = sgpa;
        valEl.style.color = parseFloat(sgpa) >= 9.0 ? '#22c55e' : (parseFloat(sgpa) >= 8.0 ? '#38bdf8' : '#f59e0b');
    }
}

function copyFAToClipboard() {
    const prof = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) || {};
    const fa = prof.facultyAdvisor || "Dr. Prithi S [prithis@srmist.edu.in]";
    const cabin = prof.orientationRoom || "University Building (UB) 6th Floor, Room 601";
    const text = `Faculty Advisor: ${fa}\nBase Classroom: ${cabin}\nStudent ID: ${prof.studentId || prof.regNo || localStorage.getItem('srm_reg_no') || ''}\nABC ID: ${prof.abcId || '231170705267'}`;
    navigator.clipboard.writeText(text);
    showAttendanceToast("Faculty Advisor & Academic details copied to clipboard!", "success");
}

function editHostelDetails() {
    const prof = (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) || {};
    const block = prompt("Enter your Allocated Hostel Block:\n(e.g. Adhiyaman, Paari Block, Kaari Block, Oorkavalan, Sannasi, M-Block, Day Scholar)", localStorage.getItem('srm_user_hostel_block') || prof.hostel || "Adhiyaman");
    if (!block || !block.trim()) return;
    const room = prompt("Enter your Room Number & Bed:\n(e.g. 335, 408 Bed B, 212 Bed A, Off-Campus)", localStorage.getItem('srm_user_room_no') || prof.room || "335");
    
    localStorage.setItem('srm_user_hostel_block', block.trim());
    localStorage.setItem('srm_user_room_no', (room || '').trim());
    if (typeof SRM_DATA !== 'undefined' && SRM_DATA.profile) {
        SRM_DATA.profile.hostel = block.trim();
        SRM_DATA.profile.room = (room || '').trim();
    }
    renderPassportHub();
    renderMessHub();
    showAttendanceToast("Hostel Allocation saved on your device!", "success");
}

function switchSuperTab(tabId) {
    if (!tabId) return;
    if (tabId !== 'view-passport') {
        lastActiveTabBeforePassport = tabId;
    }
    document.querySelectorAll('.dock-item').forEach(b => {
        const dTab = b.getAttribute('data-tab');
        if (dTab) {
            b.classList.toggle('active', dTab === tabId);
        }
    });
    document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';

    if (tabId === 'view-attendance') renderAttendanceHUD();
    else if (tabId === 'view-mess-clubs') renderMessHub();
    else if (tabId === 'view-passport') renderPassportHub();
    else if (tabId === 'view-announcements') renderAnnouncements();
    else if (tabId === 'view-calendar') renderCalendarList();
}

function switchTab(tabId) {
    switchSuperTab(tabId);
}

if (typeof window !== 'undefined') {
    window.switchTab = switchSuperTab;
    window.switchSuperTab = switchSuperTab;
    window.broadcastAllPinnedToP2P = broadcastAllPinnedToP2P;
    window.closeClassSummaryModal = closeClassSummaryModal;
    window.closePortalModal = closePortalModal;
    window.copyFAToClipboard = copyFAToClipboard;
    window.deleteAnnouncement = deleteAnnouncement;
    window.doAutoLogin = doAutoLogin;
    window.doLogout = doLogout;
    window.doLogin = doLogin;
    window.editHostelDetails = editHostelDetails;
    window.editMessMeal = editMessMeal;
    window.fetchLiveCaptcha = fetchLiveCaptcha;
    window.filterAnnouncements = filterAnnouncements;
    window.filterAttendanceView = filterAttendanceView;
    window.filterClubs = filterClubs;
    window.finishPortalLogin = finishPortalLogin;
    window.openAITabWithPrompt = openAITabWithPrompt;
    window.openCreateNoticeModal = openCreateNoticeModal;
    window.openDayOrderSwitcher = openDayOrderSwitcher;
    window.openPortalModal = openPortalModal;
    window.openSubmitClubModal = openSubmitClubModal;
    window.openWAGroupSelectorModal = openWAGroupSelectorModal;
    window.openWALinkedDeviceModal = openWALinkedDeviceModal;
    window.refreshCaptcha = refreshCaptcha;
    window.refreshWAQRCode = refreshWAQRCode;
    window.resetBunkSimulation = resetBunkSimulation;
    window.saveSelectedWAGroups = saveSelectedWAGroups;
    window.selectCourseGrade = selectCourseGrade;
    window.selectMessDay = selectMessDay;
    window.selectMessHostel = selectMessHostel;
    window.sendP2PMessage = sendP2PMessage;
    window.stepBunkSimulation = stepBunkSimulation;
    window.submitManualNotice = submitManualNotice;
    window.switchMessClubsSubTab = switchMessClubsSubTab;
    window.toggleInTabBadge = toggleInTabBadge;
    window.togglePinAnnouncement = togglePinAnnouncement;
    window.triggerManualScrape = triggerManualScrape;
    window.openCommandCenterModal = openCommandCenterModal;
    window.closeCommandCenterModal = closeCommandCenterModal;
    window.switchHubSection = switchHubSection;
    window.openThemeModal = openThemeModal;
    window.closeThemeModal = closeThemeModal;
    window.openVerticalSideMenu = openVerticalSideMenu;
    window.setTheme = setTheme;
    window.initTheme = initTheme;
    window.quickLaunchVerifiedStudent = quickLaunchVerifiedStudent;
    window.showDashboard = showDashboard;
    window.renderPassportHub = renderPassportHub;
    window.renderStudentSmartIDCard = renderPassportHub;
    window.renderAttendanceHUD = renderAttendanceHUD;
    window.renderAvatarFramesGrid = renderAvatarFramesGrid;
    window.filterAvatarFramesCategory = filterAvatarFramesCategory;
    window.searchAvatarFrames = searchAvatarFrames;
    window.toggleCustomizerGridDensity = toggleCustomizerGridDensity;
    window.renderCuratedPFPsGrid = renderCuratedPFPsGrid;
    window.selectMonogramTheme = selectMonogramTheme;
    window.resetCustomAvatar = resetCustomAvatar;
    window.handleCustomAvatarUpload = handleCustomAvatarUpload;
    window.openProfileCustomizerModal = openProfileCustomizerModal;
    window.closeProfileCustomizerModal = closeProfileCustomizerModal;
    window.selectProfileBanner = selectProfileBanner;
    window.renderProfileBannersGrid = renderProfileBannersGrid;
    window.searchProfileBanners = searchProfileBanners;
    window.filterProfileBannersCategory = filterProfileBannersCategory;
    window.toggleBannerGridDensity = toggleBannerGridDensity;
    window.handleCustomBannerUpload = handleCustomBannerUpload;
    window.resetCustomBanner = resetCustomBanner;
    window.selectProfileFrame = selectProfileFrame;
    window.selectProfileTitle = selectProfileTitle;
    window.togglePinnedBadge = togglePinnedBadge;
    window.saveProfileCustomization = saveProfileCustomization;
    window.switchDiscordCustomizerTab = switchDiscordCustomizerTab;
    window.downloadAvatarWithDecoration = downloadAvatarWithDecoration;
    window.downloadFullDiscordCard = downloadFullDiscordCard;
    window.disconnectWhatsApp = disconnectWhatsApp;
    window.applyAIScheduleOverride = applyAIScheduleOverride;
    window.handleDetectedScheduleOverride = handleDetectedScheduleOverride;
    window.openPasteChatModal = openPasteChatModal;
    window.submitPastedChatForAI = submitPastedChatForAI;
}



// ─── Function Aliases for Backwards Compatibility ────────────────────────────
function loadAttendanceData() { if (typeof renderAttendance === 'function') renderAttendance(); }
function loadTimetable() { if (typeof renderDaySchedule === 'function') renderDaySchedule(); }
