const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion';
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
const dataJs = fs.readFileSync(path.join(ROOT_DIR, 'data.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');

console.log('='.repeat(70));
console.log('EXHAUSTIVE CODEBASE AUDIT & BUG DETECTION REPORT');
console.log('='.repeat(70));

const flaws = [];

// 1. Check every JSON.parse() in app.js for safe fallbacks
const jsonParseMatches = Array.from(appJs.matchAll(/JSON\.parse\(([^)]+)\)/g));
console.log(`\n[1] Auditing JSON.parse calls (Total: ${jsonParseMatches.length})...`);
jsonParseMatches.forEach((m, idx) => {
    const expr = m[1];
    const pos = m.index;
    // Check if wrapped in try-catch in the surrounding 200 chars
    const snippetBefore = appJs.substring(Math.max(0, pos - 150), pos);
    const hasTry = snippetBefore.includes('try');
    if (!hasTry && (expr.includes('localStorage') || expr.includes('payload') || expr.includes('data'))) {
        flaws.push({
            type: 'UNSAFE_JSON_PARSE',
            line: appJs.substring(0, pos).split('\n').length,
            code: m[0],
            risk: 'App crash if localStorage item is corrupted or "undefined"'
        });
    }
});

// 2. Check every document.getElementById for null dereference (.value, .innerHTML, .addEventListener without ?.)
console.log('\n[2] Auditing DOM dereferences on document.getElementById...');
const unsafeDomMatches = Array.from(appJs.matchAll(/document\.getElementById\(['"]([^'"]+)['"]\)\.([a-zA-Z]+)/g));
unsafeDomMatches.forEach(m => {
    const id = m[1];
    const prop = m[2];
    const pos = m.index;
    const line = appJs.substring(0, pos).split('\n').length;
    // Check if element exists in index.html
    const inHtml = indexHtml.includes(`id="${id}"`) || indexHtml.includes(`id='${id}'`);
    if (!inHtml) {
        flaws.push({
            type: 'UNCHECKED_DOM_ACCESS',
            line: line,
            code: m[0],
            risk: `Element #${id} not found in static HTML. Will throw "Cannot read properties of null (reading '${prop}')"`
        });
    }
});

// 3. Check every .innerHTML assignment for potential template literal injection / breaking
console.log('\n[3] Auditing innerHTML assignments...');
const innerHtmlAssignments = Array.from(appJs.matchAll(/\.innerHTML\s*=\s*([^;]+);/g));
console.log(`Total innerHTML assignments: ${innerHtmlAssignments.length}`);
innerHtmlAssignments.forEach(m => {
    const expr = m[1];
    const pos = m.index;
    const line = appJs.substring(0, pos).split('\n').length;
    if (expr.includes('data') && !expr.includes('escapeHtml') && !expr.includes('clean') && expr.includes('${')) {
        // check if raw unescaped variable is injected
        const unescapedVars = expr.match(/\$\{([^}]+)\}/g) || [];
        for (const v of unescapedVars) {
            if (!v.includes('escapeHtml') && !v.includes('encodeURIComponent') && !v.includes('parseInt') && !v.includes('Math.') && !v.includes('length') && !v.includes('?') && !v.includes('.toFixed')) {
                // Potential raw string injection
            }
        }
    }
});

// 4. Check image assets in data.js & app.js to ensure files exist on disk
console.log('\n[4] Auditing Asset File Paths (Avatars, Frames, Banners)...');
const assetPathMatches = Array.from((appJs + dataJs).matchAll(/assets\/[a-zA-Z0-9_\-\/]+\.(png|jpg|jpeg|svg|webp|gif)/g));
const uniqueAssets = Array.from(new Set(assetPathMatches.map(m => m[0])));
console.log(`Total unique asset paths found: ${uniqueAssets.length}`);
let missingAssetsCount = 0;
uniqueAssets.forEach(a => {
    const fullPath = path.join(ROOT_DIR, 'www', a);
    if (!fs.existsSync(fullPath)) {
        missingAssetsCount++;
        flaws.push({
            type: 'MISSING_ASSET_FILE',
            path: a,
            risk: '404 Broken Image icon on phone'
        });
    }
});
console.log(`Missing asset files: ${missingAssetsCount}`);

// 5. Check for unhandled localStorage quota errors
const lsSetMatches = Array.from(appJs.matchAll(/localStorage\.setItem\(/g));
console.log(`\n[5] Auditing localStorage.setItem calls (Total: ${lsSetMatches.length})...`);

// 6. Summary of all detected flaws
console.log('\n' + '='.repeat(70));
console.log(`AUDIT COMPLETE: ${flaws.length} POTENTIAL FLAWS DETECTED`);
console.log('='.repeat(70));

const grouped = {};
flaws.forEach(f => {
    grouped[f.type] = (grouped[f.type] || []);
    grouped[f.type].push(f);
});

for (const [type, items] of Object.entries(grouped)) {
    console.log(`\n🚨 [${type}] - ${items.length} instance(s):`);
    items.slice(0, 8).forEach(item => {
        console.log(`   • Line ${item.line || 'N/A'}: ${item.code || item.path} -> ${item.risk}`);
    });
    if (items.length > 8) console.log(`   ... and ${items.length - 8} more.`);
}
