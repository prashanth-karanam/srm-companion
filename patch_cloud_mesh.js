const fs = require('fs');
const path = require('path');

const APP_JS_PATH = 'C:/Users/Praashu/.gemini/antigravity/scratch/srm_companion/app.js';
let appJs = fs.readFileSync(APP_JS_PATH, 'utf8');

const SMART_FAILOVER_API_CLIENT = `// ─── Smart Multi-Cloud Failover Mesh API Client ──────────────────────────────
const CLOUD_ENDPOINTS = [
    'https://srm-companion-api.vercel.app',
    'https://srm-companion-backend.up.railway.app',
    'https://srm-companion.onrender.com'
];

let _activeCloudEndpoint = '';

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
    return _activeCloudEndpoint || CLOUD_ENDPOINTS[0];
}

const API_BASE = getApiBase();

async function apiFetch(path, opts = {}) {
    const customBase = opts.customBase;
    delete opts.customBase;

    const baseList = customBase ? [customBase] : (_activeCloudEndpoint ? [_activeCloudEndpoint, ...CLOUD_ENDPOINTS.filter(e => e !== _activeCloudEndpoint)] : CLOUD_ENDPOINTS);

    const headers = {
        'Content-Type': 'application/json',
        ...opts.headers,
        ...authHeader()
    };

    for (const base of baseList) {
        try {
            const cleanBase = base.replace(/\\/$/, '');
            const r = await nativeHttp(cleanBase + path, { ...opts, headers });
            if (!r) continue;

            try {
                const data = await r.json();
                _activeCloudEndpoint = cleanBase;
                return data;
            } catch (_) {
                if (r.ok) {
                    _activeCloudEndpoint = cleanBase;
                    return { success: true };
                }
            }
        } catch (err) {
            console.warn('[CloudMesh] Endpoint failed (' + base + '), falling back...', err);
        }
    }

    return null;
}
`;

const startMarker = 'function getApiBase()';
const endMarker = '// ─── Screen Transitions';

const sIdx = appJs.indexOf(startMarker);
const eIdx = appJs.indexOf(endMarker);

if (sIdx !== -1 && eIdx !== -1) {
    appJs = appJs.substring(0, sIdx) + SMART_FAILOVER_API_CLIENT + '\n\n' + appJs.substring(eIdx);
    fs.writeFileSync(APP_JS_PATH, appJs, 'utf8');
    console.log('✅ Installed Smart Multi-Cloud Failover Mesh in app.js!');
} else {
    console.error('Markers not found:', sIdx, eIdx);
}
