import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_JS_PATH = r'C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion\app.js'

with open(APP_JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    code = f.read()

OVERRIDE_HELPERS = """
function applyScheduleOverride(override) {
    if (!override) return;
    const targetDay = override.dayOrder || override.day || '';
    if (targetDay) {
        let cleanDay = targetDay;
        if (!cleanDay.toLowerCase().includes('day') && !cleanDay.toLowerCase().includes('holiday')) {
            cleanDay = 'Day ' + cleanDay.replace(/\\D/g, '');
        }
        localStorage.setItem('srm_manual_day_order', cleanDay);
        if (typeof playSoundEffect === 'function') playSoundEffect('action');
        if (navigator.vibrate) navigator.vibrate([40, 60, 40]);
        showAttendanceToast(`⚡ Timetable updated to ${cleanDay}!`, 'success');
        if (typeof initDaySelector === 'function') initDaySelector();
        if (typeof loadTimetable === 'function') loadTimetable();
    }
}

function processIncomingWANoticeText(text, groupName = 'Section P1 Official') {
    if (!text || typeof text !== 'string') return null;
    
    let detectedDayOrder = null;
    const dayMatch = text.match(/Day\\s*Order\\s*([1-5])|Day\\s*([1-5])\\s*Order|Follow\\s*Day\\s*([1-5])/i);
    if (dayMatch) {
        detectedDayOrder = 'Day ' + (dayMatch[1] || dayMatch[2] || dayMatch[3]);
    }
    
    const isCancelled = /(cancelled|postponed|no\\s+class|suspended)/i.test(text);
    const isHoliday = /(declared\\s+holiday|rain\\s+holiday|holiday\\s+tomorrow|college\\s+closed)/i.test(text);
    
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
"""

marker = 'function openPasteChatModal()'
if marker in code:
    code = code.replace(marker, OVERRIDE_HELPERS + "\n" + marker)
    with open(APP_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Added applyScheduleOverride and processIncomingWANoticeText!")
else:
    print("Marker not found!")
