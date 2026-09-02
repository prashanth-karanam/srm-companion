import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_JS_PATH = r'C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion\app.js'

with open(APP_JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    code = f.read()

# Replace loadAttendanceData and loadTimetable with renderAttendance & renderDaySchedule
code = code.replace("if (typeof loadAttendanceData === 'function') loadAttendanceData();", "if (typeof renderAttendance === 'function') renderAttendance(); if (typeof renderAttendanceHUD === 'function') renderAttendanceHUD();")
code = code.replace("if (typeof loadTimetable === 'function') loadTimetable();", "if (typeof renderDaySchedule === 'function') renderDaySchedule();")

# Add aliases at the bottom
ALIASES = """
// ─── Function Aliases for Backwards Compatibility ────────────────────────────
function loadAttendanceData() { if (typeof renderAttendance === 'function') renderAttendance(); }
function loadTimetable() { if (typeof renderDaySchedule === 'function') renderDaySchedule(); }
"""

if 'loadAttendanceData()' not in code:
    code += ALIASES

with open(APP_JS_PATH, 'w', encoding='utf-8') as f:
    f.write(code)

print("Updated render function triggers and aliases in app.js!")
