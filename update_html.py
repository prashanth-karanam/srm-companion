# -*- coding: utf-8 -*-
with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

# 1. Update Attendance View with Radial Gauge
old_att = '''        <!-- Section 2: Attendance Hub -->
        <div id="view-attendance" class="tab-view" style="display:none;">
            <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                <h3 style="font-size:1rem;font-weight:700;">Live Attendance & Margin HUD</h3>
                <button id="scrape-btn" class="pill-btn" onclick="triggerManualScrape()" style="background:#2563eb;color:#fff;border:none;padding:5px 12px;border-radius:8px;font-size:0.75rem;font-weight:600;cursor:pointer;">Sync Portal</button>
            </div>
            <p id="att-stamp" class="section-stamp" style="font-size:0.72rem;color:var(--text-muted);margin-bottom:12px;">Synced recently</p>
            <div id="att-wrap" class="att-list" style="display:flex;flex-direction:column;gap:10px;">
                <p class="att-empty" style="text-align:center;color:var(--text-muted);padding:30px 0;">Tap "Sync Portal" to fetch attendance records.</p>
            </div>
        </div>'''

new_att = '''        <!-- Section 2: Attendance Hub with Radial Gauge & Interactive Bunk Steppers -->
        <div id="view-attendance" class="tab-view" style="display:none;">
            <div class="section-header" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                <h3 style="font-size:0.98rem;font-weight:800;letter-spacing:0.02em;">📊 Live Attendance & Bunk Matrix</h3>
                <button id="scrape-btn" class="pill-btn" onclick="triggerManualScrape()" style="background:#2563eb;color:#fff;border:none;padding:5px 12px;border-radius:8px;font-size:0.75rem;font-weight:700;cursor:pointer;">Sync Portal</button>
            </div>

            <!-- Hero Attendance Radial Arc Gauge -->
            <div class="att-hero-radial-card" id="att-hero-gauge-card">
                <div class="radial-content-flex">
                    <div class="radial-svg-wrap">
                        <svg class="radial-svg" viewBox="0 0 120 120">
                            <defs>
                                <linearGradient id="radial-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                    <stop offset="0%" stop-color="#38bdf8" />
                                    <stop offset="50%" stop-color="#818cf8" />
                                    <stop offset="100%" stop-color="#22c55e" />
                                </linearGradient>
                            </defs>
                            <circle class="radial-circle-bg" cx="60" cy="60" r="48" />
                            <circle id="radial-gauge-bar" class="radial-circle-fill" cx="60" cy="60" r="48" stroke-dasharray="301.59" stroke-dashoffset="60" />
                        </svg>
                        <div class="radial-center-val">
                            <div id="radial-overall-pct" class="radial-pct">--%</div>
                            <div class="radial-lbl">Overall</div>
                        </div>
                    </div>
                    <div class="radial-stats-col">
                        <div class="radial-stat-box">
                            <span class="radial-stat-lbl">Attended / Conducted</span>
                            <span id="radial-hrs-count" class="radial-stat-val">-- / -- hrs</span>
                        </div>
                        <div class="radial-stat-box">
                            <span class="radial-stat-lbl">Safe Bunk Margin</span>
                            <span id="radial-margin-val" class="radial-stat-val" style="color:#4ade80;">--</span>
                        </div>
                        <div style="display:flex;gap:6px;margin-top:2px;">
                            <button class="pill-btn" onclick="resetBunkSimulations()" style="background:#1e1e28;color:#a1a1aa;border:1px solid #2d2d3c;padding:5px 8px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;flex:1;">🔄 Reset Bunk Sim</button>
                            <button class="pill-btn" onclick="switchSuperTab('view-passport')" style="background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:5px 8px;border-radius:6px;font-size:0.68rem;font-weight:600;cursor:pointer;flex:1;">🎯 CGPA Goal</button>
                        </div>
                    </div>
                </div>
            </div>

            <p id="att-stamp" class="section-stamp" style="font-size:0.72rem;color:var(--text-muted);margin-bottom:12px;">Synced recently</p>
            <div id="att-wrap" class="att-list" style="display:flex;flex-direction:column;gap:10px;">
                <p class="att-empty" style="text-align:center;color:var(--text-muted);padding:30px 0;">Tap "Sync Portal" to fetch attendance records.</p>
            </div>
        </div>'''

html = html.replace(old_att, new_att)

# 2. Add view-mess-clubs and view-passport tabs before view-calendar
new_sections = '''
        <!-- Section 2.5: Hostel Mess & SRM Clubs Discovery Hub -->
        <div id="view-mess-clubs" class="tab-view" style="display:none;">
            <!-- Top Mode Switcher -->
            <div class="day-scroll" style="margin-bottom:14px;">
                <div id="btn-sub-mess" class="day-chip active" onclick="switchMessClubsSubTab('mess')">🍽️ Hostel Mess Menu</div>
                <div id="btn-sub-clubs" class="day-chip" onclick="switchMessClubsSubTab('clubs')">🎪 SRM Clubs & Recruitments</div>
            </div>

            <!-- Subview A: Hostel Mess Menu -->
            <div id="subview-mess">
                <!-- Live Meal Timing Banner -->
                <div class="mess-hero-banner">
                    <div>
                        <div id="mess-meal-active-title" style="font-size:0.95rem;font-weight:800;color:#ffffff;display:flex;align-items:center;gap:6px;">
                            <span>🍛</span> <span id="mess-active-meal-name">Lunch (12:00 PM - 02:15 PM)</span>
                        </div>
                        <div id="mess-countdown-text" style="font-size:0.74rem;color:#94a3b8;margin-top:3px;font-family:'JetBrains Mono',monospace;">⏳ Next: Evening Tea & Snacks in 2h 15m</div>
                    </div>
                    <span class="mess-meal-badge" id="mess-badge-status">🟢 Serving Now</span>
                </div>

                <!-- Hostel Block Selector -->
                <div style="font-size:0.75rem;font-weight:700;color:var(--text-muted);margin-bottom:6px;text-transform:uppercase;letter-spacing:0.04em;">Select Hostel Block</div>
                <div class="day-scroll" id="mess-hostel-scroll" style="margin-bottom:12px;"></div>

                <!-- 7-Day Day Selector -->
                <div class="day-scroll" id="mess-day-scroll" style="margin-bottom:14px;"></div>

                <!-- 4 Meal Cards Grid -->
                <div class="meal-cards-grid" id="mess-meal-cards-container">
                    <!-- Populated dynamically by JS -->
                </div>
            </div>

            <!-- Subview B: Campus Clubs & Hackathons Hub -->
            <div id="subview-clubs" style="display:none;">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
                    <div>
                        <h3 style="font-size:0.95rem;font-weight:800;color:#f4f4f5;">SRM KTR Clubs & Hackathons</h3>
                        <p style="font-size:0.72rem;color:var(--text-muted);margin-top:2px;">Recruitments, flagship fests, and hackathons</p>
                    </div>
                    <button class="pill-btn" onclick="openSubmitClubModal()" style="background:rgba(56,189,248,0.12);color:#38bdf8;border:1px solid rgba(56,189,248,0.3);padding:5px 10px;border-radius:8px;font-size:0.72rem;font-weight:700;cursor:pointer;">➕ Submit Event</button>
                </div>

                <!-- Category Filters -->
                <div class="day-scroll" id="club-category-scroll" style="margin-bottom:14px;">
                    <div class="day-chip active" onclick="filterClubs('All')">All Clubs</div>
                    <div class="day-chip" onclick="filterClubs('Technical')">💻 Technical & AI</div>
                    <div class="day-chip" onclick="filterClubs('Motorsports')">🏎️ Motorsports</div>
                    <div class="day-chip" onclick="filterClubs('Cultural')">🎭 Cultural & Fests</div>
                </div>

                <!-- Clubs Grid -->
                <div id="clubs-grid-container">
                    <!-- Populated by JS -->
                </div>
            </div>
        </div>

        <!-- Section 2.6: Academic Passport & Faculty Counselor Hub -->
        <div id="view-passport" class="tab-view" style="display:none;">
            <!-- Student Academic Passport Header -->
            <div class="passport-hero-card">
                <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:12px;">
                    <div style="display:flex;align-items:center;gap:12px;">
                        <div style="width:44px;height:44px;border-radius:12px;background:linear-gradient(135deg, #38bdf8 0%, #a855f7 100%);display:flex;align-items:center;justify-content:center;font-size:1.4rem;box-shadow:0 4px 15px rgba(56,189,248,0.3);">🎓</div>
                        <div>
                            <div id="pass-student-name" style="font-size:1rem;font-weight:800;color:#f4f4f5;">KARANAM SAI PRASANTH</div>
                            <div id="pass-reg-sub" style="font-size:0.72rem;color:#a1a1aa;font-family:'JetBrains Mono',monospace;margin-top:2px;">RA2611026010283 &bull; Section P1 &bull; Sub-Batch P13</div>
                        </div>
                    </div>
                    <span style="font-size:0.68rem;font-weight:700;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.3);color:#4ade80;padding:4px 8px;border-radius:6px;">Regular Active</span>
                </div>

                <!-- Degree Credits Completion Gauge -->
                <div style="margin-top:14px;background:rgba(0,0,0,0.25);border-radius:12px;padding:12px;border:1px solid rgba(255,255,255,0.06);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                        <span style="font-size:0.75rem;font-weight:700;color:#f4f4f5;">B.Tech Degree Completion (NEP 2021)</span>
                        <span id="pass-credits-ratio" style="font-size:0.75rem;font-weight:800;color:#38bdf8;font-family:'JetBrains Mono',monospace;">22 / 160 Credits (13.7%)</span>
                    </div>
                    <div style="width:100%;height:8px;background:#1e1e28;border-radius:9999px;overflow:hidden;">
                        <div id="pass-credit-progress-bar" style="width:13.7%;height:100%;background:linear-gradient(90deg, #38bdf8, #a855f7);border-radius:9999px;"></div>
                    </div>
                </div>
            </div>

            <!-- Faculty Advisor & Academic Counselor Card -->
            <div class="fa-advisor-card">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px;">
                    <span style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;">Official Faculty Advisor (FA)</span>
                    <span style="font-size:0.68rem;background:#181822;color:#38bdf8;padding:2px 8px;border-radius:4px;border:1px solid #28283a;">Emp ID: 100429</span>
                </div>
                <div style="font-size:0.92rem;font-weight:800;color:#f4f4f5;margin-bottom:2px;" id="fa-name">DR. N. PARVATHI</div>
                <div style="font-size:0.74rem;color:#a1a1aa;margin-bottom:6px;" id="fa-dept">Computational Mathematics & Data Analytics</div>
                <div style="font-size:0.74rem;color:#38bdf8;background:rgba(56,189,248,0.06);border:1px solid rgba(56,189,248,0.15);padding:6px 10px;border-radius:8px;margin-bottom:10px;" id="fa-cabin">
                    📍 <b>Cabin:</b> University Building (UB) 6th Floor, Cabin 604
                </div>
                <div style="display:flex;gap:8px;">
                    <a id="fa-email-btn" href="mailto:parvathi.n@srmist.edu.in" class="fa-action-btn" style="flex:1;text-decoration:none;justify-content:center;">
                        <span>✉️ Email Counselor</span>
                    </a>
                    <button class="fa-action-btn" style="background:#181822;border-color:#2a2a38;color:#f4f4f5;" onclick="copyFAToClipboard()">
                        <span>📋 Copy Details</span>
                    </button>
                </div>
            </div>

            <!-- Degree Credit Categories Breakdown -->
            <div style="font-size:0.82rem;font-weight:800;color:#f4f4f5;margin-bottom:8px;">Curriculum Credit Breakdown</div>
            <div id="pass-credit-categories-container" style="margin-bottom:14px;">
                <!-- Populated dynamically by JS -->
            </div>

            <!-- Hostel & Campus Emergency Hotline -->
            <div class="fa-advisor-card">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:8px;">Hostel Allocation & Emergency Hotline</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="font-size:0.82rem;font-weight:700;color:#f4f4f5;" id="pass-hostel-room">Paari Block &bull; Room 408 (Bed B)</span>
                    <span style="font-size:0.68rem;background:#181822;color:#a1a1aa;padding:2px 6px;border-radius:4px;">Non-AC 3-Sharing</span>
                </div>
                <div style="font-size:0.74rem;color:#a1a1aa;margin-bottom:4px;" id="pass-hostel-warden">Warden: Dr. K. Senthil Kumar</div>
                <div style="font-size:0.72rem;color:#f87171;background:rgba(239,68,68,0.08);border:1px solid rgba(239,68,68,0.2);padding:6px 10px;border-radius:8px;margin-top:6px;">
                    🚨 <b>Ambulance / Casualty Desk:</b> 044-27453140 / 108 (24/7 SRM Hospital)
                </div>
            </div>

            <!-- Official Portal Clearances & No-Dues -->
            <div style="font-size:0.82rem;font-weight:800;color:#f4f4f5;margin-bottom:8px;">Portal "No Dues" & Fee Status</div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:16px;">
                <div class="clearance-badge"><span>🟢</span> <span>Tuition: Paid</span></div>
                <div class="clearance-badge"><span>🟢</span> <span>Hostel: Paid</span></div>
                <div class="clearance-badge"><span>🟢</span> <span>Library: 0 Dues</span></div>
                <div class="clearance-badge"><span>🟢</span> <span>Lab: Clear</span></div>
            </div>

            <!-- Regulation-Aware CGPA / SGPA Simulator -->
            <div class="gpa-dial-card">
                <div style="font-size:0.72rem;font-weight:700;color:var(--text-muted);text-transform:uppercase;letter-spacing:0.04em;margin-bottom:4px;">Regulation 2021 Grade & SGPA Simulator</div>
                <div id="sim-sgpa-value" style="font-size:2.2rem;font-weight:900;font-family:'JetBrains Mono',monospace;color:#22c55e;line-height:1;margin:8px 0 4px;">9.42</div>
                <div style="font-size:0.74rem;font-weight:600;color:#a1a1aa;margin-bottom:14px;">Projected Semester SGPA &bull; 14 Credits</div>
                
                <div id="gpa-courses-simulator-list" style="text-align:left;display:flex;flex-direction:column;gap:8px;">
                    <!-- Populated dynamically by JS -->
                </div>
            </div>
        </div>
'''

if "<!-- Section 2.5: Hostel Mess" not in html:
    html = html.replace('<!-- Section 5: Calendar & Holidays -->', new_sections + '\n        <!-- Section 5: Calendar & Holidays -->')

# 3. Update Bottom Navigation Dock with the 6 super-app tabs
old_dock = '''    <div class="dock" style="display:none;">
        <button class="dock-item active" data-tab="view-schedule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Schedule</span>
        </button>
        <button class="dock-item" data-tab="view-attendance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Attendance</span>
        </button>
        <button class="dock-item" data-tab="view-ai">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>AI Copilot</span>
        </button>
        <button class="dock-item" data-tab="view-p2p">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
            <span>P2P Chat</span>
        </button>
        <button class="dock-item" data-tab="view-announcements">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notices</span>
        </button>
        <button class="dock-item" data-tab="view-calendar">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
            <span>Holidays</span>
        </button>
    </div>'''

new_dock = '''    <div class="dock" style="display:none;">
        <button class="dock-item active" data-tab="view-schedule">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            <span>Schedule</span>
        </button>
        <button class="dock-item" data-tab="view-attendance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
            <span>Attendance</span>
        </button>
        <button class="dock-item" data-tab="view-mess-clubs">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1"></path><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path><line x1="6" y1="1" x2="6" y2="4"></line><line x1="10" y1="1" x2="10" y2="4"></line><line x1="14" y1="1" x2="14" y2="4"></line></svg>
            <span>Mess & Clubs</span>
        </button>
        <button class="dock-item" data-tab="view-ai">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            <span>AI Copilot</span>
        </button>
        <button class="dock-item" data-tab="view-passport">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
            <span>Passport</span>
        </button>
        <button class="dock-item" data-tab="view-announcements">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 0 1-3.46 0"></path></svg>
            <span>Notices</span>
        </button>
    </div>'''

html = html.replace(old_dock, new_dock)

with open("index.html", "w", encoding="utf-8") as f:
    f.write(html)

print("Successfully updated index.html with futuristic super-app views!")
