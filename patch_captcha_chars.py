import sys, io
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

APP_JS_PATH = r'C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion\app.js'

with open(APP_JS_PATH, 'r', encoding='utf-8', errors='replace') as f:
    code = f.read()

GENERATE_CAPTCHA_FIXED = '''function generateClientSecurityCaptcha() {
    const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    _currentCaptchaCode = code;

    try {
        const canvas = document.createElement('canvas');
        canvas.width = 140;
        canvas.height = 42;
        const ctx = canvas.getContext('2d');

        // Dark background matching app theme
        ctx.fillStyle = '#0f141c';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Subtle grid lines
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 1;
        for (let i = 0; i < canvas.width; i += 14) {
            ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
        }
        for (let i = 0; i < canvas.height; i += 10) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
        }

        // Security wave
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(4, 20);
        ctx.bezierCurveTo(45, 36, 95, 6, 136, 22);
        ctx.stroke();

        // Distinct glyphs
        const colors = ['#38bdf8', '#818cf8', '#34d399', '#f472b6', '#fbbf24', '#a78bfa'];
        for (let i = 0; i < code.length; i++) {
            ctx.save();
            const x = 10 + (i * 20);
            const y = 28 + (Math.random() * 3 - 1.5);
            const angle = (Math.random() - 0.5) * 0.3;
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = 'bold 20px "JetBrains Mono", monospace';
            ctx.fillStyle = colors[i % colors.length];
            ctx.shadowColor = colors[i % colors.length];
            ctx.shadowBlur = 4;
            ctx.fillText(code[i], 0, 0);
            ctx.restore();
        }

        return canvas.toDataURL('image/png');
    } catch (_) {
        return null;
    }
}'''

start_marker = 'function generateClientSecurityCaptcha()'
end_marker = '// ─── Safe Captcha Image Helper'

s_idx = code.find(start_marker)
e_idx = code.find(end_marker, s_idx)

if s_idx != -1 and e_idx != -1:
    code = code[:s_idx] + GENERATE_CAPTCHA_FIXED + "\n\n" + code[e_idx:]
    with open(APP_JS_PATH, 'w', encoding='utf-8') as f:
        f.write(code)
    print("Successfully updated generateClientSecurityCaptcha to 6 characters!")
else:
    print("Could not find markers:", s_idx, e_idx)
