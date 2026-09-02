# -*- coding: utf-8 -*-
with open("app.js", "r", encoding="utf-8") as f:
    content = f.read()

super_app_js = '''
// ─── Super-App: Interactive Bunk Stepper & Radial HUD ────────────────────────
let bunkSimDeltas = {}; // e.g. { '26CSE1002J': { attendDelta: 0, bunkDelta: 0 } }
let selectedMessHostel = "Paari Block (Boys)";
let selectedMessDay = "";
let activeClubsCategory = "All";
let userGradeSelections = {}; // e.g. { '26CSE1002J': 10, '26MAB1001T': 9 }

function resetBunkSimulations() {
    bunkSimDeltas = {};
    renderAttendance();
    showAttendanceToast("🔄 Bunk simulations reset to actual portal records.", "info");
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

// ─── Enhanced Attendance & What-If Bunk Simulator ───────────────────────────
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
        
        const needed   = isUnconducted ? 0 : Math.max(0, 3 * simCon - 4 * simAtt);
        const bunkable = isUnconducted ? 0 : Math.max(0, Math.floor((4 * simAtt - 3 * simCon) / 3));

        const isSimulated = (sim.attendDelta > 0 || sim.bunkDelta > 0);

        const hint = isUnconducted
            ? `<span class="att-hint safe" style="color:#38bdf8;font-size:0.73rem;font-weight:600;">ℹ️ No classes conducted yet</span>`
            : danger
                ? `<span class="att-hint danger" style="color:#f87171;font-size:0.73rem;font-weight:600;">⚠️ Attend ${needed} more class${needed > 1 ? 'es' : ''} to reach 75%</span>`
                : bunkable > 0
                    ? `<span class="att-hint safe" style="color:#34d399;font-size:0.73rem;font-weight:600;">✅ Safe Margin: Can skip ${bunkable} class${bunkable > 1 ? 'es' : ''}</span>`
                    : `<span class="att-hint warn" style="color:#fbbf24;font-size:0.73rem;font-weight:600;">⚖️ Exactly at 75% margin — do not miss!</span>`;

        return `
        <div class="att-card ${danger ? 'att-danger' : 'att-safe'}" style="background:#141419;border:1px solid ${danger ? 'rgba(239,68,68,0.3)' : (isSimulated ? '#38bdf8' : '#22222c')};border-radius:16px;padding:15px;display:flex;flex-direction:column;gap:8px;">
            <div class="att-top" style="display:flex;justify-content:space-between;align-items:flex-start;">
                <div class="att-subject" style="min-width:0;">
                    <div style="display:flex;gap:6px;align-items:center;">
                        <span class="att-code" style="font-size:0.68rem;background:#1e1e28;color:#38bdf8;padding:2px 6px;border-radius:4px;font-family:var(--font-mono);font-weight:700;">${code || 'COURSE'}</span>
                        ${isSimulated ? '<span style="font-size:0.62rem;background:#1e293b;color:#38bdf8;padding:2px 6px;border-radius:4px;font-weight:700;">SIMULATED</span>' : ''}
                    </div>
                    <div class="att-name" style="font-size:0.88rem;font-weight:700;color:#f4f4f5;margin-top:4px;">${escapeHtml(title)}</div>
                </div>
                <div class="att-pct" style="font-size:1.2rem;font-weight:800;color:${danger ? '#f87171' : '#34d399'};font-family:var(--font-mono);">${pct}%</div>
            </div>
            <div class="att-bar-track" style="background:#1e1e28;height:6px;border-radius:9999px;overflow:hidden;margin:4px 0;">
                <div class="att-bar-fill" style="width:${Math.min(pct,100)}%;background:${danger ? '#ef4444' : '#22c55e'};height:100%;border-radius:9999px;transition:width 0.4s ease;"></div>
            </div>
            <div class="att-stats" style="display:flex;justify-content:space-between;font-size:0.74rem;color:var(--text-muted);">
                <span>${simCon} conducted</span>
                <span style="color:#34d399;font-weight:600;">${simAtt} attended</span>
                <span style="color:#f87171;font-weight:600;">${simAbs} absent</span>
            </div>
            ${hint}
            
            <!-- Interactive What-If Bunk Stepper -->
            <div class="bunk-stepper-wrap">
                <span style="font-size:0.72rem;color:#a1a1aa;font-weight:600;">What-If Simulator:</span>
                <div class="bunk-stepper-controls">
                    <button class="bunk-btn" title="Bunk 1 class" onclick="stepBunkSimulation('${code}', 'bunk', 1)" style="color:#f87171;">- Bunk</button>
                    <span class="bunk-sim-display">${sim.bunkDelta > 0 ? `+${sim.bunkDelta} Miss` : (sim.attendDelta > 0 ? `+${sim.attendDelta} Att` : 'Actual')}</span>
                    <button class="bunk-btn" title="Attend 1 class" onclick="stepBunkSimulation('${code}', 'attend', 1)" style="color:#4ade80;">+ Attend</button>
                </div>
            </div>
        </div>`;
    }).join('');

    wrap.innerHTML = cardsHtml;

    // Update Hero Radial Gauge Arc
    const overallPct = totCon > 0 ? parseFloat(((totAtt / totCon) * 100).toFixed(1)) : 100.0;
    const overallDanger = totCon > 0 && overallPct < 75;
    const overallBunk = totCon > 0 ? Math.max(0, Math.floor((4 * totAtt - 3 * totCon) / 3)) : 0;
    const overallNeeded = totCon > 0 ? Math.max(0, 3 * totCon - 4 * totAtt) : 0;

    const radPctEl = document.getElementById('radial-overall-pct');
    const radGaugeEl = document.getElementById('radial-gauge-bar');
    const radHrsEl = document.getElementById('radial-hrs-count');
    const radMarginEl = document.getElementById('radial-margin-val');

    if (radPctEl) {
        radPctEl.textContent = overallPct + '%';
        radPctEl.style.color = overallDanger ? '#f87171' : '#34d399';
    }
    if (radGaugeEl) {
        const circumference = 2 * Math.PI * 48; // ~301.59
        const offset = circumference * (1 - Math.min(overallPct, 100) / 100);
        radGaugeEl.style.strokeDashoffset = offset;
    }
    if (radHrsEl) radHrsEl.textContent = `${totAtt} / ${totCon} hrs`;
    if (radMarginEl) {
        if (overallDanger) {
            radMarginEl.textContent = `⚠️ Need ${overallNeeded} hrs`;
            radMarginEl.style.color = '#f87171';
        } else {
            radMarginEl.textContent = `✅ ${overallBunk} hrs Bunkable`;
            radMarginEl.style.color = '#4ade80';
        }
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
    const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const now = new Date();
    const todayName = weekdays[now.getDay()];
    if (!selectedMessDay) selectedMessDay = todayName;

    // 1. Hostel Selector
    const hostelScroll = document.getElementById('mess-hostel-scroll');
    if (hostelScroll) {
        hostelScroll.innerHTML = messData.hostels.map(h => `
            <div class="day-chip ${h === selectedMessHostel ? 'active' : ''}" onclick="selectMessHostel('${h}')">
                🏨 ${escapeHtml(h.split(' ')[0])}
            </div>
        `).join('');
    }

    // 2. Day Selector
    const dayScroll = document.getElementById('mess-day-scroll');
    if (dayScroll) {
        dayScroll.innerHTML = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map(d => `
            <div class="day-chip ${d === selectedMessDay ? 'active' : ''}" onclick="selectMessDay('${d}')">
                ${d.slice(0, 3)} ${d === todayName ? '• Today' : ''}
            </div>
        `).join('');
    }

    // 3. Live Meal Countdown Banner
    const currentHourMin = now.getHours() * 60 + now.getMinutes();
    let currentMealKey = 'lunch';
    let currentMealName = 'Lunch (12:00 PM - 02:15 PM)';
    let countdownStr = '';

    if (currentHourMin < 9 * 60 + 30) {
        currentMealKey = 'breakfast';
        currentMealName = 'Breakfast (07:30 AM - 09:30 AM)';
        const left = 9 * 60 + 30 - currentHourMin;
        countdownStr = currentHourMin >= 7 * 60 + 30 ? `🟢 Serving Now • ${left}m left` : `⏳ Breakfast starts in ${7 * 60 + 30 - currentHourMin}m`;
    } else if (currentHourMin < 14 * 60 + 15) {
        currentMealKey = 'lunch';
        currentMealName = 'Lunch (12:00 PM - 02:15 PM)';
        const left = 14 * 60 + 15 - currentHourMin;
        countdownStr = currentHourMin >= 12 * 60 ? `🟢 Serving Now • ${left}m left` : `⏳ Lunch starts in ${12 * 60 - currentHourMin}m`;
    } else if (currentHourMin < 17 * 60 + 45) {
        currentMealKey = 'snacks';
        currentMealName = 'Evening Tea & Snacks (04:30 PM - 05:45 PM)';
        const left = 17 * 60 + 45 - currentHourMin;
        countdownStr = currentHourMin >= 16 * 60 + 30 ? `🟢 Serving Now • ${left}m left` : `⏳ Snacks start in ${16 * 60 + 30 - currentHourMin}m`;
    } else if (currentHourMin < 21 * 60 + 30) {
        currentMealKey = 'dinner';
        currentMealName = 'Dinner (07:30 PM - 09:30 PM)';
        const left = 21 * 60 + 30 - currentHourMin;
        countdownStr = currentHourMin >= 19 * 60 + 30 ? `🟢 Serving Now • ${left}m left` : `⏳ Dinner starts in ${19 * 60 + 30 - currentHourMin}m`;
    } else {
        currentMealKey = 'breakfast';
        currentMealName = 'Tomorrow Breakfast (07:30 AM - 09:30 AM)';
        countdownStr = `🌙 Mess Closed for Today`;
    }

    const activeMealEl = document.getElementById('mess-active-meal-name');
    const countdownEl = document.getElementById('mess-countdown-text');
    if (activeMealEl) activeMealEl.textContent = currentMealName;
    if (countdownEl) countdownEl.textContent = countdownStr;

    // 4. Meal Cards Grid
    const menuObj = messData.weeklyMenu[selectedMessDay] || messData.weeklyMenu["Monday"];
    const container = document.getElementById('mess-meal-cards-container');
    if (!container) return;

    const meals = [
        { key: 'breakfast', label: 'Breakfast', icon: '🍳', time: '07:30 AM - 09:30 AM', items: menuObj.breakfast },
        { key: 'lunch', label: 'Lunch', icon: '🍛', time: '12:00 PM - 02:15 PM', items: menuObj.lunch },
        { key: 'snacks', label: 'Evening Tea & Snacks', icon: '☕', time: '04:30 PM - 05:45 PM', items: menuObj.snacks },
        { key: 'dinner', label: 'Dinner', icon: '🍲', time: '07:30 PM - 09:30 PM', items: menuObj.dinner }
    ];

    container.innerHTML = meals.map(m => `
        <div class="meal-card ${m.key === currentMealKey && selectedMessDay === todayName ? 'is-active-meal' : ''}">
            <div class="meal-card-header">
                <div class="meal-title-group">
                    <span class="meal-icon">${m.icon}</span>
                    <div>
                        <div class="meal-name">${m.label}</div>
                        <div class="meal-timing">${m.time}</div>
                    </div>
                </div>
                ${m.key === currentMealKey && selectedMessDay === todayName ? '<span class="mess-meal-badge">🟢 Active</span>' : ''}
            </div>
            <div class="meal-items-text">${escapeHtml(m.items)}</div>
        </div>
    `).join('');
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
                    <div class="club-avatar">${c.icon}</div>
                    <div>
                        <div class="club-name">${escapeHtml(c.name)}</div>
                        <span class="club-category-pill">${c.category}</span>
                    </div>
                </div>
                <a href="${c.instagram}" target="_blank" style="text-decoration:none;font-size:0.76rem;color:#f4f4f5;background:#1c1c24;padding:4px 8px;border-radius:6px;border:1px solid #2e2e3a;">📸 IG</a>
            </div>
            <div class="club-tagline">${escapeHtml(c.tagline)}</div>
            <div style="background:rgba(0,0,0,0.22);border-radius:8px;padding:8px 10px;margin-bottom:10px;font-size:0.72rem;color:#cbd5e1;line-height:1.4;">
                <div>👥 <b>Team:</b> ${escapeHtml(c.leads)}</div>
                <div>📍 <b>HQ:</b> ${escapeHtml(c.members)}</div>
                ${c.featuredEvent ? `<div style="color:#38bdf8;margin-top:4px;">🚀 <b>Active:</b> ${escapeHtml(c.featuredEvent)}</div>` : ''}
            </div>
            <div class="club-footer-bar">
                <span style="font-size:0.72rem;color:#4ade80;font-weight:700;">🟢 ${escapeHtml(c.recruitStatus)}</span>
                <a href="${c.recruitLink}" target="_blank" class="fa-action-btn" style="text-decoration:none;font-size:0.72rem;">
                    <span>📝 Apply Form</span>
                </a>
            </div>
        </div>
    `).join('');
}

function openSubmitClubModal() {
    const title = prompt("🎪 Enter Club / Hackathon Name & Form Link:\n\n(e.g. ACM DevHack 2026 - https://forms.gle/...)");
    if (!title || !title.trim()) return;
    showAttendanceToast("🎉 Event submitted! Added to your live campus stream.", "success");
}

// ─── Super-App: Academic Passport & CGPA Simulator Hub ────────────────────────
function renderPassportHub() {
    if (typeof SRM_DATA === 'undefined') return;

    const p = SRM_DATA.passport || {};
    const prof = SRM_DATA.profile || {};

    // 1. Header Details
    const nameEl = document.getElementById('pass-student-name');
    const subEl = document.getElementById('pass-reg-sub');
    if (nameEl) nameEl.textContent = prof.name || 'KARANAM SAI PRASANTH';
    if (subEl) subEl.textContent = `${prof.regNo || 'RA2611026010283'} • ${p.subBatch || 'Section P1 • Sub-Batch P13'}`;

    // 2. Degree Credit Progress
    const cred = p.curriculum || { totalCreditsReq: 160, earnedCredits: 22 };
    const pct = ((cred.earnedCredits / cred.totalCreditsReq) * 100).toFixed(1);
    const credRatioEl = document.getElementById('pass-credits-ratio');
    const credBarEl = document.getElementById('pass-credit-progress-bar');
    if (credRatioEl) credRatioEl.textContent = `${cred.earnedCredits} / ${cred.totalCreditsReq} Credits (${pct}%)`;
    if (credBarEl) credBarEl.style.width = pct + '%';

    // 3. Faculty Advisor Details
    const fa = p.facultyAdvisor || {};
    const faNameEl = document.getElementById('fa-name');
    const faDeptEl = document.getElementById('fa-dept');
    const faCabinEl = document.getElementById('fa-cabin');
    const faEmailBtn = document.getElementById('fa-email-btn');

    if (faNameEl) faNameEl.textContent = fa.name || 'DR. N. PARVATHI';
    if (faDeptEl) faDeptEl.textContent = fa.department || 'Computational Mathematics';
    if (faCabinEl) faCabinEl.innerHTML = `📍 <b>Cabin:</b> ${fa.cabin || 'UB 6th Floor, Cabin 604'}`;
    if (faEmailBtn && fa.email) faEmailBtn.href = 'mailto:' + fa.email;

    // 4. Credit Categories Breakdown
    const catContainer = document.getElementById('pass-credit-categories-container');
    if (catContainer && p.creditCategories) {
        catContainer.innerHTML = p.creditCategories.map(c => {
            const catPct = ((c.completed / c.total) * 100).toFixed(0);
            return `
                <div class="credit-cat-item">
                    <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.75rem;margin-bottom:4px;">
                        <span style="font-weight:700;color:#f4f4f5;">${c.category}</span>
                        <span style="font-family:'JetBrains Mono',monospace;color:${c.color};font-weight:700;">${c.completed} / ${c.total} cr (${catPct}%)</span>
                    </div>
                    <div style="width:100%;height:5px;background:#1e1e26;border-radius:9999px;overflow:hidden;">
                        <div style="width:${catPct}%;height:100%;background:${c.color};border-radius:9999px;"></div>
                    </div>
                </div>
            `;
        }).join('');
    }

    // 5. CGPA Simulator Engine
    renderSGPASimulator();
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
    const text = "Faculty Advisor: DR. N. PARVATHI (Emp ID: 100429)\nCabin: University Building (UB) 6th Floor, Cabin 604\nEmail: parvathi.n@srmist.edu.in\nExt: 100429";
    navigator.clipboard.writeText(text);
    showAttendanceToast("📋 Faculty Counselor details copied to clipboard!", "success");
}

function switchSuperTab(tabId) {
    document.querySelectorAll('.dock-item').forEach(b => {
        b.classList.toggle('active', b.getAttribute('data-tab') === tabId);
    });
    document.querySelectorAll('.tab-view').forEach(v => v.style.display = 'none');
    const target = document.getElementById(tabId);
    if (target) target.style.display = 'block';

    if (tabId === 'view-attendance') renderAttendanceHUD();
    else if (tabId === 'view-mess-clubs') renderMessHub();
    else if (tabId === 'view-passport') renderPassportHub();
    else if (tabId === 'view-announcements') renderAnnouncements();
    else if (tabId === 'view-calendar') renderCalendar();
}
'''

# Replace old renderAttendance and initDockNavigation
if "// ─── Super-App: Interactive Bunk Stepper" not in content:
    content = content + "\n" + super_app_js
    with open("app.js", "w", encoding="utf-8") as f:
        f.write(content)
    print("Successfully appended Super-App JavaScript logic to app.js!")
else:
    print("Already appended!")
