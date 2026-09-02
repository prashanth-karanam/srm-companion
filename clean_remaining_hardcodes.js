const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion';
const DATA_JS_PATH = path.join(ROOT_DIR, 'data.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');

let dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

console.log('REPLACING ALL REMAINING PERSONAL LABELS & HARDCODED DEFAULTS...');

// 1. In data.js, replace "👑 Sai Prasanth Pins" with "👑 Featured Ring Pins"
const dataReplacedCount = (dataJs.match(/👑 Sai Prasanth Pins/g) || []).length;
dataJs = dataJs.replace(/👑 Sai Prasanth Pins/g, '👑 Featured Ring Pins');
console.log(`✅ Cleaned ${dataReplacedCount} category labels in data.js`);

// 2. In index.html, replace "👑 Sai Prasanth Pins" button label and click handler
indexHtml = indexHtml.replace(/👑 Sai Prasanth Pins/g, '👑 Featured Ring Pins');
console.log(`✅ Cleaned filter button label in index.html`);

// 3. In app.js, replace fallback Student ID '734184' with dynamic localStorage read
appJs = appJs.replace(/Student ID:\s*\$\{prof\.studentId\s*\|\|\s*'734184'\}/g, "Student ID: ${prof.studentId || prof.regNo || localStorage.getItem('srm_reg_no') || ''}");
console.log(`✅ Cleaned fallback student ID in app.js`);

fs.writeFileSync(DATA_JS_PATH, dataJs, 'utf8');
fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf8');
fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');

console.log('Saved data.js, index.html, and app.js.');
