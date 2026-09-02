const fs = require('fs');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const sMarker = 'const nonceMatch = html.match(';
const eMarker = 'const tokenMatch = html.match(';

const sIdx = appJs.indexOf(sMarker);
const eIdx = appJs.indexOf(eMarker);

if (sIdx !== -1 && eIdx !== -1) {
    const replacement = `const nonceMatch = html.match(/nonce\\s*:\\s*['"]([^'"]+)['"]/i);
            const dfMatch = html.match(/domainFieldName\\s*=\\s*['"]([^'"]+)['"]/i);
            const cfMatch = html.match(/captchaFieldName\\s*=\\s*['"]([^'"]+)['"]/i);
            const rdMatch = html.match(/randomDelimiter\\s*=\\s*['"]([^'"]+)['"]/i);

            nonceVal = nonceMatch ? nonceMatch[1] : '';

            _secConfig = {
                nonce: nonceVal,
                domainFieldName: dfMatch ? dfMatch[1] : '',
                captchaFieldName: cfMatch ? cfMatch[1] : '',
                randomDelimiter: rdMatch ? rdMatch[1] : ''
            };
            console.log('[Captcha] Extracted SRM Security Tokens:', _secConfig);

            `;

    appJs = appJs.substring(0, sIdx) + replacement + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Replaced regex successfully!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
