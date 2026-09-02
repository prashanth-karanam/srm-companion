const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

appJs = appJs.replace(
    "const activeCookies = setCookies || _liveCookies || '';",
    "const activeCookies = parseCleanCookies(setCookies) || _liveCookies || '';"
);

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('✅ Updated activeCookies parser in _scrapePortalDirectlyOnDevice');
