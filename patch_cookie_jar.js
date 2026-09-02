const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const MERGE_COOKIES_AND_AUTH_PATCH = `function mergeCookies(oldCookieStr, newCookieHeader) {
    const jar = {};
    if (oldCookieStr) {
        oldCookieStr.split(';').forEach(c => {
            const [k, ...v] = c.trim().split('=');
            if (k) jar[k.trim()] = v.join('=').trim();
        });
    }
    if (newCookieHeader) {
        const parts = Array.isArray(newCookieHeader) ? newCookieHeader : [newCookieHeader];
        for (const raw of parts) {
            for (const item of String(raw).split(/,\\s*(?=[A-Za-z0-9_-]+=)/)) {
                const m = item.match(/([A-Za-z0-9_-]+)=([^;]+)/);
                if (m && !['path', 'domain', 'expires', 'httponly', 'secure', 'samesite', 'max-age'].includes(m[1].toLowerCase())) {
                    jar[m[1].trim()] = m[2].trim();
                }
            }
        }
    }
    return Object.entries(jar).map(([k, v]) => \`\${k}=\${v}\`).join('; ');
}

function parseCleanCookies(setCookieHeader) {
    return mergeCookies('', setCookieHeader);
}

function formatCaptchaDataUrl(rawData) {
    if (!rawData || typeof rawData !== 'string') return null;
    const clean = rawData.trim().replace(/\\s+/g, '');
    if (clean.startsWith('data:image/')) return clean;
    if (clean.length > 20) {
        return 'data:image/png;base64,' + clean;
    }
    return null;
}
`;

const startMarker = 'function parseCleanCookies(setCookieHeader)';
const endMarker = 'async function fetchLiveCaptcha';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + MERGE_COOKIES_AND_AUTH_PATCH + '\n\n' + appJs.substring(eIdx);
    
    // Also update fetchLiveCaptcha and _scrapePortalDirectlyOnDevice to use mergeCookies
    appJs = appJs.replace(/_liveCookies = cleanCookie;/g, '_liveCookies = mergeCookies(_liveCookies, rawCookie);');
    appJs = appJs.replace(/const activeCookies = parseCleanCookies\(setCookies\) \|\| _liveCookies \|\| '';/g, 'const activeCookies = mergeCookies(_liveCookies, setCookies);');

    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Persistent Session Cookie Jar with JSESSIONID Retention!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
