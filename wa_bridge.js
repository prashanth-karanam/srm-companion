/**
 * SRM Companion - Baileys Multi-Device WhatsApp Virtual Bridge
 * Lightweight Node.js microservice running on port 8001
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8001;
const AUTH_DIR = path.join(__dirname, 'wa_auth');

let sock = null;
let currentQR = null;
let currentQRDataURL = null;
let connectionStatus = 'DISCONNECTED'; // 'DISCONNECTED' | 'CONNECTING' | 'SCAN_QR' | 'CONNECTED'
let connectedUser = null;
let monitoredGroupIds = new Set();
let scrapedMessages = [];
const MAX_MESSAGES = 100;

// Load monitored groups from disk if saved
const SETTINGS_FILE = path.join(__dirname, 'wa_settings.json');
try {
    if (fs.existsSync(SETTINGS_FILE)) {
        const saved = JSON.parse(fs.readFileSync(SETTINGS_FILE, 'utf8'));
        if (Array.isArray(saved.monitoredGroups)) {
            monitoredGroupIds = new Set(saved.monitoredGroups);
        }
    }
} catch (_) {}

function saveSettings() {
    try {
        fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
            monitoredGroups: Array.from(monitoredGroupIds)
        }, null, 2));
    } catch (_) {}
}

async function startWhatsAppBridge() {
    connectionStatus = 'CONNECTING';
    currentQR = null;
    currentQRDataURL = null;

    if (!fs.existsSync(AUTH_DIR)) {
        fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    try {
        const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`[WA Bridge] Using Baileys v${version.join('.')}, isLatest: ${isLatest}`);

        sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['SRM Companion', 'Chrome', '1.0.0']
        });

        sock.ev.on('creds.update', saveCreds);

        sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                currentQR = qr;
                connectionStatus = 'SCAN_QR';
                try {
                    currentQRDataURL = await QRCode.toDataURL(qr);
                    console.log('[WA Bridge] 📷 New QR Code generated for pairing.');
                } catch (err) {
                    console.error('[WA Bridge] Failed to render QR:', err);
                }
            }

            if (connection === 'open') {
                connectionStatus = 'CONNECTED';
                currentQR = null;
                currentQRDataURL = null;
                connectedUser = sock.user;
                console.log('[WA Bridge] 🟢 WhatsApp Virtual Companion Connected! Logged in as:', connectedUser?.name || connectedUser?.id);
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                console.log(`[WA Bridge] Connection closed (code ${statusCode}). Reconnecting: ${shouldReconnect}`);
                connectionStatus = 'DISCONNECTED';
                connectedUser = null;

                if (shouldReconnect) {
                    setTimeout(startWhatsAppBridge, 3000);
                } else {
                    console.log('[WA Bridge] Logged out. Cleaning auth directory...');
                    try {
                        fs.rmSync(AUTH_DIR, { recursive: true, force: true });
                    } catch (_) {}
                }
            }
        });

        sock.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.messages.length === 0) return;
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const remoteJid = msg.key.remoteJid;
            const isGroup = remoteJid && remoteJid.endsWith('@g.us');
            if (!isGroup) return;

            // Extract text
            const text = msg.message.conversation ||
                         msg.message.extendedTextMessage?.text ||
                         msg.message.imageMessage?.caption ||
                         '';

            if (!text || text.trim().length === 0) return;

            const sender = msg.pushName || msg.key.participant || 'Classmate';
            const timestamp = new Date(Number(msg.messageTimestamp) * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });

            const item = {
                id: msg.key.id,
                groupId: remoteJid,
                sender: sender,
                text: text.trim(),
                timestamp: timestamp,
                rawTimestamp: msg.messageTimestamp
            };

            scrapedMessages.unshift(item);
            if (scrapedMessages.length > MAX_MESSAGES) {
                scrapedMessages.pop();
            }

            console.log(`[WA Bridge] 📩 Message in ${remoteJid} from ${sender}: ${text.substring(0, 60)}...`);
        });
    } catch (err) {
        console.error('[WA Bridge] Error during startWhatsAppBridge:', err);
        connectionStatus = 'DISCONNECTED';
    }
}

// ─── Microservice HTTP API Server ─────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    function sendJson(data, status = 200) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    if (pathname === '/api/wa/status') {
        return sendJson({
            status: connectionStatus,
            qrCodeDataURL: currentQRDataURL,
            user: connectedUser,
            monitoredCount: monitoredGroupIds.size
        });
    }

    if (pathname === '/api/wa/connect') {
        if (connectionStatus !== 'CONNECTED' && connectionStatus !== 'CONNECTING' && connectionStatus !== 'SCAN_QR') {
            startWhatsAppBridge();
        }
        return sendJson({ success: true, status: connectionStatus });
    }

    if (pathname === '/api/wa/groups') {
        if (connectionStatus !== 'CONNECTED' || !sock) {
            return sendJson({ error: 'WhatsApp not connected' }, 400);
        }
        try {
            const allGroups = await sock.groupFetchAllParticipating();
            const groupsList = Object.values(allGroups).map(g => ({
                id: g.id,
                name: g.subject,
                description: g.desc || '',
                participantsCount: (g.participants || []).length,
                isMonitored: monitoredGroupIds.has(g.id)
            }));
            return sendJson({ groups: groupsList });
        } catch (err) {
            return sendJson({ error: err.message }, 500);
        }
    }

    if (pathname === '/api/wa/select-groups' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                const parsed = JSON.parse(body || '{}');
                if (Array.isArray(parsed.groupIds)) {
                    monitoredGroupIds = new Set(parsed.groupIds);
                    saveSettings();
                    return sendJson({ success: true, count: monitoredGroupIds.size });
                }
                return sendJson({ error: 'groupIds array required' }, 400);
            } catch (err) {
                return sendJson({ error: err.message }, 400);
            }
        });
        return;
    }

    if (pathname === '/api/wa/messages') {
        const filtered = scrapedMessages.filter(m => monitoredGroupIds.size === 0 || monitoredGroupIds.has(m.groupId));
        return sendJson({ messages: filtered });
    }

    if (pathname === '/api/wa/disconnect' && req.method === 'POST') {
        try {
            if (sock) {
                await sock.logout();
            }
            try {
                fs.rmSync(AUTH_DIR, { recursive: true, force: true });
            } catch (_) {}
            connectionStatus = 'DISCONNECTED';
            connectedUser = null;
            currentQR = null;
            currentQRDataURL = null;
            return sendJson({ success: true, message: 'Disconnected' });
        } catch (err) {
            return sendJson({ error: err.message }, 500);
        }
    }

    sendJson({ error: 'Not Found' }, 404);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`==================================================`);
    console.log(`🚀 WA MULTI-DEVICE BRIDGE SERVER RUNNING (PORT ${PORT})`);
    console.log(`==================================================`);
});

// Auto-start on load if auth exists
if (fs.existsSync(AUTH_DIR) && fs.readdirSync(AUTH_DIR).length > 0) {
    console.log('[WA Bridge] Found existing auth credentials. Auto-connecting...');
    startWhatsAppBridge();
}
