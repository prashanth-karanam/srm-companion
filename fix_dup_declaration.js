const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

// Replace duplicate declaration
appJs = appJs.replace("let _currentCaptchaCode = '';\nlet _liveCookies = '';", "let _currentCaptchaCode = '';");

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('Fixed duplicate declaration.');
