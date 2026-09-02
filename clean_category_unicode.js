const fs = require('fs');
const path = require('path');

const ROOT_DIR = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion';
const DATA_JS_PATH = path.join(ROOT_DIR, 'data.js');
const INDEX_HTML_PATH = path.join(ROOT_DIR, 'index.html');
const APP_JS_PATH = path.join(ROOT_DIR, 'app.js');

let dataJs = fs.readFileSync(DATA_JS_PATH, 'utf8');
let indexHtml = fs.readFileSync(INDEX_HTML_PATH, 'utf8');
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

console.log('REPLACING UNICODE & EMOJI CATEGORY LABELS...');

// Replace both unicode escaped and direct emoji versions
dataJs = dataJs.replace(/\\ud83d\\udc51\s*Sai\s*Prasanth\s*Pins/g, '\\ud83d\\udc51 Featured Ring Pins');
dataJs = dataJs.replace(/👑\s*Sai\s*Prasanth\s*Pins/g, '👑 Featured Ring Pins');
dataJs = dataJs.replace(/Sai\s*Prasanth\s*Pins/g, 'Featured Ring Pins');

indexHtml = indexHtml.replace(/\\ud83d\\udc51\s*Sai\s*Prasanth\s*Pins/g, '\\ud83d\\udc51 Featured Ring Pins');
indexHtml = indexHtml.replace(/👑\s*Sai\s*Prasanth\s*Pins/g, '👑 Featured Ring Pins');
indexHtml = indexHtml.replace(/Sai\s*Prasanth\s*Pins/g, 'Featured Ring Pins');

appJs = appJs.replace(/\\ud83d\\udc51\s*Sai\s*Prasanth\s*Pins/g, '\\ud83d\\udc51 Featured Ring Pins');
appJs = appJs.replace(/👑\s*Sai\s*Prasanth\s*Pins/g, '👑 Featured Ring Pins');
appJs = appJs.replace(/Sai\s*Prasanth\s*Pins/g, 'Featured Ring Pins');

fs.writeFileSync(DATA_JS_PATH, dataJs, 'utf8');
fs.writeFileSync(INDEX_HTML_PATH, indexHtml, 'utf8');
fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');

console.log('Successfully cleaned all category labels across all 3 files!');
