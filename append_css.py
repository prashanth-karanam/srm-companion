new_css = '''
/* ─── Ultra-Futuristic Cyber-Glassmorphic Super-App Styles ──────────────── */

/* Hero Attendance Radial Arc Gauge */
.att-hero-radial-card {
    background: linear-gradient(145deg, #111116 0%, #0d0d12 100%);
    border: 1px solid rgba(56, 189, 248, 0.2);
    border-radius: 20px;
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);
    position: relative;
    overflow: hidden;
}

.att-hero-radial-card::before {
    content: '';
    position: absolute;
    top: -40px;
    right: -40px;
    width: 120px;
    height: 120px;
    background: radial-gradient(circle, rgba(56, 189, 248, 0.15) 0%, transparent 70%);
    pointer-events: none;
}

.radial-content-flex {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
}

.radial-svg-wrap {
    position: relative;
    width: 110px;
    height: 110px;
    flex-shrink: 0;
}

.radial-svg {
    transform: rotate(-90deg);
    width: 110px;
    height: 110px;
}

.radial-circle-bg {
    fill: none;
    stroke: #1c1c24;
    stroke-width: 8;
}

.radial-circle-fill {
    fill: none;
    stroke: url(#radial-gradient);
    stroke-width: 8;
    stroke-linecap: round;
    transition: stroke-dashoffset 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}

.radial-center-val {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.radial-pct {
    font-size: 1.35rem;
    font-weight: 800;
    font-family: 'JetBrains Mono', monospace;
    color: #f4f4f5;
    line-height: 1;
}

.radial-lbl {
    font-size: 0.62rem;
    font-weight: 600;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 3px;
}

.radial-stats-col {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.radial-stat-box {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 10px;
    padding: 8px 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.radial-stat-lbl {
    font-size: 0.72rem;
    color: var(--text-muted);
    font-weight: 500;
}

.radial-stat-val {
    font-size: 0.82rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #f4f4f5;
}

/* Interactive Bunk Stepper */
.bunk-stepper-wrap {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #14141a;
    border: 1px solid #22222a;
    border-radius: 10px;
    padding: 6px 10px;
    margin-top: 10px;
}

.bunk-stepper-controls {
    display: flex;
    align-items: center;
    gap: 8px;
}

.bunk-btn {
    background: #1e1e26;
    border: 1px solid #2e2e3a;
    color: #f4f4f5;
    width: 28px;
    height: 28px;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.85rem;
    font-weight: 800;
    cursor: pointer;
    transition: all 0.15s ease;
    user-select: none;
}

.bunk-btn:active {
    transform: scale(0.92);
    background: #2a2a38;
}

.bunk-sim-display {
    font-size: 0.76rem;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
    color: #38bdf8;
    min-width: 60px;
    text-align: center;
}

/* Hostel Mess Hub */
.mess-hero-banner {
    background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%);
    border: 1px solid rgba(129, 140, 248, 0.25);
    border-radius: 18px;
    padding: 16px;
    margin-bottom: 14px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.mess-meal-badge {
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #4ade80;
    padding: 4px 10px;
    border-radius: 9999px;
    font-size: 0.72rem;
    font-weight: 700;
    display: inline-flex;
    align-items: center;
    gap: 4px;
}

.meal-cards-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 10px;
    margin-bottom: 16px;
}

.meal-card {
    background: #111116;
    border: 1px solid var(--card-border);
    border-radius: 14px;
    padding: 14px;
    transition: all 0.2s ease;
}

.meal-card.is-active-meal {
    border-color: #38bdf8;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.15);
    background: linear-gradient(145deg, #14161f 0%, #111116 100%);
}

.meal-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.meal-title-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.meal-icon {
    font-size: 1.25rem;
}

.meal-name {
    font-size: 0.88rem;
    font-weight: 700;
    color: #f4f4f5;
}

.meal-timing {
    font-size: 0.7rem;
    font-weight: 600;
    color: var(--text-muted);
    font-family: 'JetBrains Mono', monospace;
}

.meal-items-text {
    font-size: 0.78rem;
    line-height: 1.45;
    color: #d4d4d8;
    background: rgba(0, 0, 0, 0.2);
    border-radius: 8px;
    padding: 8px 10px;
}

/* Campus Clubs Hub */
.club-card {
    background: #111116;
    border: 1px solid var(--card-border);
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 12px;
    transition: all 0.2s ease;
}

.club-card:hover {
    border-color: rgba(56, 189, 248, 0.35);
    transform: translateY(-2px);
}

.club-header-flex {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 8px;
}

.club-icon-title {
    display: flex;
    align-items: center;
    gap: 10px;
}

.club-avatar {
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: #181820;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.2rem;
    border: 1px solid #272732;
}

.club-name {
    font-size: 0.9rem;
    font-weight: 800;
    color: #f4f4f5;
}

.club-category-pill {
    font-size: 0.65rem;
    font-weight: 700;
    padding: 3px 8px;
    border-radius: 6px;
    background: #1e293b;
    color: #38bdf8;
    border: 1px solid rgba(56, 189, 248, 0.2);
}

.club-tagline {
    font-size: 0.76rem;
    color: #a1a1aa;
    line-height: 1.4;
    margin-bottom: 10px;
}

.club-footer-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-top: 10px;
    border-top: 1px solid rgba(255, 255, 255, 0.05);
}

/* Academic Passport & Profile Hub */
.passport-hero-card {
    background: linear-gradient(135deg, #13141c 0%, #0d0e14 100%);
    border: 1px solid rgba(168, 85, 247, 0.25);
    border-radius: 20px;
    padding: 18px;
    margin-bottom: 14px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
}

.fa-advisor-card {
    background: #13131a;
    border: 1px solid #252532;
    border-radius: 16px;
    padding: 16px;
    margin-bottom: 14px;
}

.fa-action-btn {
    background: rgba(56, 189, 248, 0.12);
    border: 1px solid rgba(56, 189, 248, 0.25);
    color: #38bdf8;
    padding: 6px 12px;
    border-radius: 8px;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    display: inline-flex;
    align-items: center;
    gap: 4px;
    transition: all 0.15s ease;
}

.fa-action-btn:hover {
    background: #38bdf8;
    color: #000;
}

.credit-cat-item {
    background: #121218;
    border: 1px solid #20202a;
    border-radius: 10px;
    padding: 10px 12px;
    margin-bottom: 8px;
}

.clearance-badge {
    background: rgba(34, 197, 94, 0.12);
    border: 1px solid rgba(34, 197, 94, 0.25);
    color: #4ade80;
    padding: 6px 10px;
    border-radius: 8px;
    font-size: 0.72rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
}

/* CGPA Target Calculator */
.gpa-dial-card {
    background: linear-gradient(145deg, #12141c 0%, #0d0f17 100%);
    border: 1px solid rgba(34, 197, 94, 0.25);
    border-radius: 18px;
    padding: 18px;
    margin-bottom: 14px;
    text-align: center;
}

.grade-picker-chip {
    background: #14141c;
    border: 1px solid #252532;
    color: #a1a1aa;
    padding: 5px 10px;
    border-radius: 8px;
    font-size: 0.74rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s ease;
}

.grade-picker-chip.selected {
    background: #22c55e;
    color: #000;
    border-color: #22c55e;
}
'''

with open("style.css", "a", encoding="utf-8") as f:
    f.write("\n" + new_css)

print("Successfully appended futuristic super-app CSS styles to style.css!")
