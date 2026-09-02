const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

// Ensure top-level global variables are declared at the very top of the file
const TOP_DECLARATIONS = `var _liveCookies = '';
var _secConfig = {};
var _hiddenFields = {};
var _isFetchingCaptcha = false;
var _captchaLoadTime = 0;
var _currentCaptchaCode = '';

`;

// Remove duplicate declarations lower down if any
appJs = appJs.replace(/let _liveCookies = '';/g, '');
appJs = appJs.replace(/let _hiddenFields = \{\};/g, '');
appJs = appJs.replace(/let _secConfig = \{\};/g, '');
appJs = appJs.replace(/let _isFetchingCaptcha = false;/g, '');
appJs = appJs.replace(/let _captchaLoadTime = 0;/g, '');
appJs = appJs.replace(/let _currentCaptchaCode = '';/g, '');

appJs = TOP_DECLARATIONS + appJs;

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('✅ Declared global session variables at top of app.js!');
