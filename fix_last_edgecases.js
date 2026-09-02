const fs = require('fs');
const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

appJs = appJs.replace("document.getElementById('wa-chat-standalone-input').click()", "document.getElementById('wa-chat-standalone-input')?.click()");
appJs = appJs.replace("JSON.parse(res.data)", "safeJsonParse(res.data, res.data)");

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('Fixed last 2 edge-cases successfully.');
