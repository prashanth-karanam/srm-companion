const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion';
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');

let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');
let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');

console.log('REMOVING ALL REMAINING HARDCODED STRINGS...');

// 1. Fix hardcoded RA numbers in app.js
appJs = appJs.replace(/'RA2611026010283'/g, "(localStorage.getItem('srm_reg_no') || 'Student ID')");
console.log('✅ Removed all hardcoded RA numbers from app.js');

// 2. Fix hardcoded RA number in index.html
indexHtml = indexHtml.replace('RA2611026010283', 'Student ID');
console.log('✅ Removed hardcoded RA number from index.html');

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf8');
console.log('Saved app.js and index.html.');
