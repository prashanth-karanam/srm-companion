// SRM Student Companion - Dynamic Timetable Mutation & AI Override Engine

// ─── API Config — swap to your Railway URL when deployed ──────────────────────
const API_BASE = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000'          // local dev
    : 'https://YOUR-APP.railway.app';  // ← replace with your Railway URL after deploy

// ─── Auth ─────────────────────────────────────────────────────────────────────
function getToken()          { return localStorage.getItem('srm_jwt'); }
function setToken(t)         { localStorage.setItem('srm_jwt', t); }
function clearToken()        { localStorage.removeItem('srm_jwt'); }
function authHeader()        { return { 'Authorization': 'Bearer ' + getToken() }; }

async function apiFetch(path, opts = {}) {
    opts.headers = { ...opts.headers, ...authHeader() };
    const r = await fetch(API_BASE + path, opts);
    if (r.status === 401) { clearToken(); showLogin(); return null; }
    return r.json();
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
}

async function doLogin() {
    const btn   = document.getElementById('login-btn');
    const errEl = document.getElementById('login-error');
    const id    = document.getElementById('login-id').value.trim();
    const pass  = document.getElementById('login-pass').value;

    if (!id || !pass) { showErr('Enter your SRM ID and password'); return; }

    btn.disabled = true; btn.textContent = 'Signing in…';
    errEl.style.display = 'none';

    try {
        const r = await fetch(API_BASE + '/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ srm_id: id, password: pass }),
        });
        const d = await r.json();
        if (r.ok && d.token) {
            setToken(d.token);
            showDashboard();
            syncWithBackend();
        } else {
            showErr(d.detail || 'Invalid SRM ID or password');
        }
    } catch (_) {
        showErr('Cannot reach server — check your connection');
    } finally {
        btn.disabled = false; btn.textContent = 'Sign In';
    }
}

function showErr(msg) {
    const el = document.getElementById('login-error');
    el.textContent = msg; el.style.display = 'block';
}

// Enter key triggers login
document.addEventListener('DOMContentLoaded', () => {
    ['login-id', 'login-pass'].forEach(id => {
        document.getElementById(id)?.addEventListener('keydown', e => {
            if (e.key === 'Enter') doLogin();
        });
    });
    if (!getToken()) { showLogin(); } else { showDashboard(); }
});

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

document.addEventListener('DOMContentLoaded', () => {
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
    
    setInterval(updateLiveHUD, 10000);
    setInterval(updateClock, 1000);
    setInterval(syncWithBackend, 4000);
});

let portalAttendance = [];

async function syncWithBackend() {
    if (!getToken()) return;

    // Sync announcements + overrides (local backend still handles WhatsApp AI)
    try {
        const d = await (await fetch('http://localhost:8000/api/announcements')).json();
        if (d?.success) {
            if (d.announcements) { announcementsData = d.announcements; renderAnnouncements(); }
            if (d.overrides)     { scheduleOverrides = d.overrides; renderDaySchedule(selectedDay); updateLiveHUD(); }
        }
    } catch (_) {}

    // Sync portal data from cloud API (attendance + holiday)
    const res = await apiFetch('/api/me/data');
    if (res?.success && res.data) {
        const d = res.data;
        if (d.today_is_holiday) {
            isTodayHoliday = true;
            const badge = document.getElementById('current-day-badge');
            if (badge) { badge.textContent = 'Holiday · ' + (d.today_holiday_name || 'Official'); badge.style.color = '#ef4444'; }
            updateLiveHUD();
        }
        if (d.attendance?.length) { portalAttendance = d.attendance; renderAttendance(d.last_scraped); }
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

// Inception Labs Mercury AI Copilot Engine
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

async function handleAISend() {
    const input = document.getElementById('ai-input');
    const prompt = input.value.trim();
    if (!prompt) return;

    input.value = '';
    appendChatMessage('user', prompt);

    const loadingId = appendChatMessage('ai', 'Thinking with Inception AI...');

    try {
        const response = await fetch('http://localhost:8000/api/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: prompt })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.reply) {
                updateChatMessage(loadingId, formatMarkdown(data.reply));
                return;
            }
        }
        throw new Error('Local server failed');
    } catch (err) {
        try {
            const fallbackResp = await fetch('https://text.pollinations.ai/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    messages: [
                        { role: 'system', content: 'You are an academic tutor for SRM 1st year student Karanam Sai Prasanth.' },
                        { role: 'user', content: prompt }
                    ]
                })
            });
            const text = await fallbackResp.text();
            updateChatMessage(loadingId, formatMarkdown(text));
        } catch (e2) {
            updateChatMessage(loadingId, 'Unable to get AI response. Please verify connection.');
        }
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

function sendP2PMessage() {
    const input = document.getElementById('p2p-input');
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;

    const msg = {
        id: 'p2p-' + Date.now(),
        sender: 'Sai Prasanth',
        text: text,
        mode: navigator.onLine ? 'ONLINE' : 'P2P_OFFLINE',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    if (navigator.onLine) {
        // Online: send to cloud server API + local broadcast
        try {
            apiFetch('/api/me/chat', {
                method: 'POST',
                body: JSON.stringify(msg),
            });
        } catch (_) {}
    }

    // Always broadcast locally to nearby peers via P2P Mesh
    if (p2pChannel) {
        try { p2pChannel.postMessage(msg); } catch (_) {}
    }

    // Render locally & save to phone storage
    renderP2PMessage(msg, true);
    saveP2PMessage(msg);

    input.value = '';
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
        const history = JSON.parse(localStorage.getItem('srm_p2p_history') || '[]');
        history.forEach(msg => renderP2PMessage(msg, msg.sender === 'Sai Prasanth'));
    } catch (_) {}
}

function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

document.addEventListener('DOMContentLoaded', () => {
    initP2PMesh();
});
