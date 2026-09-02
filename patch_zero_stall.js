const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const CLEAN_API_AND_DIRECT_SCRAPER = `// ─── Zero-Stall Direct API Client (0ms Dead-Host Latency) ──────────────────────
function getApiBase() {
    try {
        const saved = (typeof localStorage !== 'undefined') ? localStorage.getItem('srm_api_base') : null;
        if (saved) return saved.replace(/\\/$/, '');
        if (typeof window !== 'undefined' && window.location) {
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                return 'http://localhost:8000';
            }
            if (window.location.hostname && window.location.hostname.includes('vercel.app')) {
                return window.location.origin;
            }
        }
    } catch (_) {}
    return null; // Zero placeholder stall — no dead URLs
}

const API_BASE = getApiBase();

async function apiFetch(path, opts = {}) {
    const base = opts.customBase || getApiBase();
    if (!base) return null; // Skip immediately if no backend configured (0ms delay)

    const headers = {
        'Content-Type': 'application/json',
        ...opts.headers,
        ...authHeader()
    };

    try {
        const r = await nativeHttp(base + path, { ...opts, headers });
        if (!r) return null;

        try {
            return await r.json();
        } catch (_) {
            if (r.ok) return { success: true };
            return { success: false, error: \`HTTP \${r.status} error\` };
        }
    } catch (_) {
        return null;
    }
}
`;

const startMarker = '// ─── Smart Multi-Cloud Failover Mesh API Client';
const endMarker = '// ─── Screen Transitions';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + CLEAN_API_AND_DIRECT_SCRAPER + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Removed all dead placeholder URLs and installed Zero-Stall API client!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
