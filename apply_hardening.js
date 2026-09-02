const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

console.log('SURGICALLY FIXING ALL DETECTED FLAWS IN app.js...');

// 1. Add safe JSON parse helper at top of app.js
const safeJsonHelper = `// ─── Ultra-Safe JSON & DOM Utilities (Zero-Crash Shield) ──────────────────────
function safeJsonParse(val, fallback = null) {
    if (!val || typeof val !== 'string') return fallback;
    try {
        const parsed = JSON.parse(val);
        return parsed !== null && parsed !== undefined ? parsed : fallback;
    } catch (_) {
        return fallback;
    }
}
`;

if (!appJs.includes('function safeJsonParse')) {
    appJs = safeJsonHelper + '\n' + appJs;
    console.log('✅ Injected safeJsonParse helper');
}

// 2. Fix all document.getElementById('...').remove() to ?.remove()
const beforeRemoveCount = (appJs.match(/document\.getElementById\([^)]+\)\.remove\(\)/g) || []).length;
appJs = appJs.replace(/document\.getElementById\(([^)]+)\)\.remove\(\)/g, 'document.getElementById($1)?.remove()');
console.log(`✅ Fixed ${beforeRemoveCount} unsafe modal .remove() calls to optional chaining (?.)`);

// 3. Fix unsafe JSON.parse(localStorage.getItem(...))
appJs = appJs.replace(/JSON\.parse\(localStorage\.getItem\(([^)]+)\)\s*\|\|\s*['"](\{\}|\[\])['"]\)/g, 'safeJsonParse(localStorage.getItem($1), $2)');
appJs = appJs.replace(/JSON\.parse\(localStorage\.getItem\(([^)]+)\)\)/g, 'safeJsonParse(localStorage.getItem($1), null)');

// 4. Fix any unchecked .value on inputs
const unsafeValueMatches = Array.from(appJs.matchAll(/document\.getElementById\(([^)]+)\)\.value/g));
console.log(`Auditing ${unsafeValueMatches.length} .value accesses...`);
appJs = appJs.replace(/document\.getElementById\(([^)]+)\)\.value(\.trim\(\))?/g, "(document.getElementById($1)?.value$2 || '')");

// 5. Ensure safe AudioContext / Audio playback
appJs = appJs.replace(/new\s+(window\.AudioContext\s*\|\|\s*window\.webkitAudioContext)\(\)/g, '((window.AudioContext || window.webkitAudioContext) ? new (window.AudioContext || window.webkitAudioContext)() : null)');

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('✅ All fixes applied to app.js');
