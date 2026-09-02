const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

// Replace broken regex with proper regex literals
appJs = appJs.replace(/html\.match\(\/nonces\*:s\*\[\^'\"\]\+\['\"\]\/i\)/g, 'html.match(/nonce\\s*:\\s*[\'"]([^\'"]+)[\'"]/i)');
appJs = appJs.replace(/html\.match\(\/domainFieldNames\*=s\*\[\^'\"\]\+\['\"\]\/i\)/g, 'html.match(/domainFieldName\\s*=\\s*[\'"]([^\'"]+)[\'"]/i)');
appJs = appJs.replace(/html\.match\(\/captchaFieldNames\*=s\*\[\^'\"\]\+\['\"\]\/i\)/g, 'html.match(/captchaFieldName\\s*=\\s*[\'"]([^\'"]+)[\'"]/i)');
appJs = appJs.replace(/html\.match\(\/randomDelimiters\*=s\*\[\^'\"\]\+\['\"\]\/i\)/g, 'html.match(/randomDelimiter\\s*=\\s*[\'"]([^\'"]+)[\'"]/i)');

fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
console.log('✅ Fixed regex pattern matching for SRM Java Security Nonce and Tokens!');
