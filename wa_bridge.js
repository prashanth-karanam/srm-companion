/**
 * SRM Companion - Multi-User Baileys WhatsApp Virtual Bridge
 * Lightweight Node.js microservice running on port 8001
 * 
 * Features:
 * - Multi-user isolation (each user has their own QR code, session, and group subscriptions)
 * - Zero reconnect loops & graceful standby
 * - Direct local network streaming using the user's internet
 */

const { default: makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const pino = require('pino');
const QRCode = require('qrcode');
const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8001;
const BASE_AUTH_DIR = path.join(__dirname, 'wa_auth');

if (!fs.existsSync(BASE_AUTH_DIR)) {
    fs.mkdirSync(BASE_AUTH_DIR, { recursive: true });
}

// User session storage: Map<userId, SessionObject>
const userSessions = new Map();
const MAX_QR_RETRIES = 3;
const MAX_MESSAGES = 150;

function getUserAuthDir(userId) {
    const safeId = String(userId || 'default_user').replace(/[^a-zA-Z0-9_\-]/g, '_');
    return path.join(BASE_AUTH_DIR, `user_${safeId}`);
}

function getUserSettingsFile(userId) {
    const safeId = String(userId || 'default_user').replace(/[^a-zA-Z0-9_\-]/g, '_');
    return path.join(BASE_AUTH_DIR, `settings_${safeId}.json`);
}

function getOrCreateUserSession(userId) {
    const safeId = String(userId || 'default_user').replace(/[^a-zA-Z0-9_\-]/g, '_');
    if (!userSessions.has(safeId)) {
        const session = {
            userId: safeId,
            sock: null,
            currentQR: null,
            currentQRDataURL: null,
            connectionStatus: 'DISCONNECTED', // 'DISCONNECTED' | 'CONNECTING' | 'SCAN_QR' | 'CONNECTED'
            connectedUser: null,
            monitoredGroupIds: new Set(),
            scrapedMessages: [],
            groupNameCache: {},
            reconnectAttempts: 0
        };

        // Load saved settings
        try {
            const sf = getUserSettingsFile(safeId);
            if (fs.existsSync(sf)) {
                const saved = JSON.parse(fs.readFileSync(sf, 'utf8'));
                if (Array.isArray(saved.monitoredGroups)) {
                    session.monitoredGroupIds = new Set(saved.monitoredGroups);
                }
            }
        } catch (_) {}

        userSessions.set(safeId, session);
    }
    return userSessions.get(safeId);
}

function saveUserSettings(session) {
    try {
        const sf = getUserSettingsFile(session.userId);
        fs.writeFileSync(sf, JSON.stringify({
            monitoredGroups: Array.from(session.monitoredGroupIds)
        }, null, 2));
    } catch (_) {}
}

function cleanupSocket(session) {
    if (session.sock) {
        try {
            session.sock.ev.removeAllListeners();
            session.sock.end(new Error('Re-initializing user socket'));
        } catch (_) {}
        session.sock = null;
    }
}

async function startWhatsAppBridge(userId, manualTrigger = false, freshSession = false) {
    const session = getOrCreateUserSession(userId);
    const authDir = getUserAuthDir(session.userId);

    if (manualTrigger) {
        session.reconnectAttempts = 0;
    }

    if (freshSession) {
        cleanupSocket(session);
        try {
            if (fs.existsSync(authDir)) {
                fs.rmSync(authDir, { recursive: true, force: true });
            }
        } catch (_) {}
        session.connectedUser = null;
        session.connectionStatus = 'DISCONNECTED';
    }

    if (!freshSession && session.connectionStatus === 'CONNECTED' && session.sock) {
        return;
    }

    cleanupSocket(session);
    session.connectionStatus = 'CONNECTING';
    session.currentQR = null;
    session.currentQRDataURL = null;

    if (!fs.existsSync(authDir)) {
        fs.mkdirSync(authDir, { recursive: true });
    }

    try {
        const { state, saveCreds } = await useMultiFileAuthState(authDir);
        const { version, isLatest } = await fetchLatestBaileysVersion();
        console.log(`[WA Bridge:${session.userId}] Starting Baileys v${version.join('.')}, isLatest: ${isLatest}`);

        session.sock = makeWASocket({
            version,
            auth: state,
            printQRInTerminal: false,
            logger: pino({ level: 'silent' }),
            browser: ['SRM Companion', 'Chrome', '1.0.0'],
            connectTimeoutMs: 30000,
            qrTimeout: 45000
        });

        session.sock.ev.on('creds.update', saveCreds);

        async function fetchAndCacheGroups() {
            if (!session.sock) return;
            try {
                const groups = await session.sock.groupFetchAllParticipating();
                Object.values(groups).forEach(g => {
                    session.groupNameCache[g.id] = g.subject || 'Class WhatsApp Group';
                });
            } catch (_) {}
        }

        session.sock.ev.on('connection.update', async (update) => {
            const { connection, lastDisconnect, qr } = update;

            if (qr) {
                session.currentQR = qr;
                session.connectionStatus = 'SCAN_QR';
                try {
                    session.currentQRDataURL = await QRCode.toDataURL(qr);
                    console.log(`[WA Bridge:${session.userId}] 📷 Fresh QR Code generated for user scan.`);
                } catch (err) {
                    console.error(`[WA Bridge:${session.userId}] Failed to render QR:`, err);
                }
            }

            if (connection === 'open') {
                session.connectionStatus = 'CONNECTED';
                session.reconnectAttempts = 0;
                session.currentQR = null;
                session.currentQRDataURL = null;
                session.connectedUser = session.sock.user;
                console.log(`[WA Bridge:${session.userId}] 🟢 WhatsApp Connected as: ${session.connectedUser?.name || session.connectedUser?.id}`);
                fetchAndCacheGroups();
            }

            if (connection === 'close') {
                const statusCode = lastDisconnect?.error?.output?.statusCode;
                const isLoggedOut = statusCode === DisconnectReason.loggedOut;
                console.log(`[WA Bridge:${session.userId}] Connection closed (code ${statusCode}). Logged out: ${isLoggedOut}`);

                session.connectionStatus = 'DISCONNECTED';
                session.connectedUser = null;
                cleanupSocket(session);

                if (isLoggedOut) {
                    console.log(`[WA Bridge:${session.userId}] Session logged out. Cleaning credentials...`);
                    try { fs.rmSync(authDir, { recursive: true, force: true }); } catch (_) {}
                    session.reconnectAttempts = 0;
                    return;
                }

                // If waiting for QR and timed out
                if (statusCode === DisconnectReason.timedOut || statusCode === 408 || statusCode === 428) {
                    session.reconnectAttempts++;
                    if (session.reconnectAttempts <= MAX_QR_RETRIES) {
                        console.log(`[WA Bridge:${session.userId}] QR Timeout. Re-generating QR (Attempt ${session.reconnectAttempts}/${MAX_QR_RETRIES})...`);
                        setTimeout(() => startWhatsAppBridge(session.userId, false), 3000);
                    } else {
                        console.log(`[WA Bridge:${session.userId}] ⏸️ Reached max QR retries. Standing by for user action.`);
                        session.connectionStatus = 'DISCONNECTED';
                        session.currentQRDataURL = null;
                    }
                    return;
                }

                // Reconnect if unexpectedly disconnected
                setTimeout(() => startWhatsAppBridge(session.userId, false), 5000);
            }
        });

        session.sock.ev.on('messages.upsert', async (m) => {
            if (!m.messages || m.messages.length === 0) return;
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;

            const remoteJid = msg.key.remoteJid;
            const isGroup = remoteJid && remoteJid.endsWith('@g.us');
            if (!isGroup) return;

            // Only monitor selected groups if specified
            if (session.monitoredGroupIds.size > 0 && !session.monitoredGroupIds.has(remoteJid)) {
                return;
            }

            // Extract message text
            const text = msg.message.conversation ||
                         msg.message.extendedTextMessage?.text ||
                         msg.message.imageMessage?.caption ||
                         '';

            if (!text || text.trim().length === 0) return;

            const sender = msg.pushName || msg.key.participant || 'Classmate';
            const timestamp = new Date(Number(msg.messageTimestamp) * 1000).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
            const groupName = session.groupNameCache[remoteJid] || 'Class WhatsApp Group';

            const item = {
                id: msg.key.id,
                groupId: remoteJid,
                groupName: groupName,
                sender: sender,
                text: text.trim(),
                timestamp: timestamp,
                rawTimestamp: msg.messageTimestamp
            };

            session.scrapedMessages.unshift(item);
            if (session.scrapedMessages.length > MAX_MESSAGES) {
                session.scrapedMessages.pop();
            }

            console.log(`[WA Bridge:${session.userId}] 📩 [${groupName}] ${sender}: ${text.substring(0, 60)}...`);
        });
    } catch (err) {
        console.error(`[WA Bridge:${session.userId}] Startup error:`, err);
        session.connectionStatus = 'DISCONNECTED';
        cleanupSocket(session);
    }
}

// ─── Multi-User HTTP API Server ───────────────────────────────────────────────
const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const pathname = url.pathname;

    // Extract User ID from query param or header
    const userId = url.searchParams.get('userId') || req.headers['x-user-id'] || 'default_user';
    const session = getOrCreateUserSession(userId);

    function sendJson(data, status = 200) {
        res.writeHead(status, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(data));
    }

    if (pathname === '/api/wa/status') {
        return sendJson({
            userId: session.userId,
            status: session.connectionStatus,
            qrCodeDataURL: session.currentQRDataURL,
            user: session.connectedUser,
            monitoredCount: session.monitoredGroupIds.size
        });
    }

    if (pathname === '/api/wa/connect') {
        const isFresh = url.searchParams.get('fresh') === 'true';
        startWhatsAppBridge(session.userId, true, isFresh);
        return sendJson({ success: true, userId: session.userId, status: session.connectionStatus });
    }

    if (pathname === '/api/wa/reset-session') {
        startWhatsAppBridge(session.userId, true, true);
        return sendJson({ success: true, userId: session.userId, status: session.connectionStatus, message: 'Fresh QR generated.' });
    }

    if (pathname === '/api/wa/groups') {
        if (session.connectionStatus !== 'CONNECTED' || !session.sock) {
            return sendJson({ error: 'WhatsApp not connected for this user' }, 400);
        }
        try {
            const allGroups = await session.sock.groupFetchAllParticipating();
            const groupsList = Object.values(allGroups).map(g => ({
                id: g.id,
                name: g.subject,
                description: g.desc || '',
                participantsCount: (g.participants || []).length,
                isMonitored: session.monitoredGroupIds.has(g.id)
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
                const targetUserId = parsed.userId || userId;
                const targetSession = getOrCreateUserSession(targetUserId);

                if (Array.isArray(parsed.groupIds)) {
                    targetSession.monitoredGroupIds = new Set(parsed.groupIds);
                    saveUserSettings(targetSession);
                    return sendJson({ success: true, count: targetSession.monitoredGroupIds.size });
                }
                return sendJson({ error: 'groupIds array required' }, 400);
            } catch (err) {
                return sendJson({ error: err.message }, 400);
            }
        });
        return;
    }

    if (pathname === '/api/wa/messages') {
        return sendJson({ messages: session.scrapedMessages });
    }

    if (pathname === '/api/wa/disconnect' && req.method === 'POST') {
        try {
            if (session.sock) {
                await session.sock.logout();
            }
            const authDir = getUserAuthDir(session.userId);
            try {
                fs.rmSync(authDir, { recursive: true, force: true });
            } catch (_) {}
            session.connectionStatus = 'DISCONNECTED';
            session.connectedUser = null;
            session.currentQR = null;
            session.currentQRDataURL = null;
            cleanupSocket(session);
            return sendJson({ success: true, message: 'Disconnected' });
        } catch (err) {
            return sendJson({ error: err.message }, 500);
        }
    }

    sendJson({ error: 'Not Found' }, 404);
});

server.listen(PORT, '0.0.0.0', () => {
    console.log(`========================================================`);
    console.log(`🚀 MULTI-USER WHATSAPP VIRTUAL BRIDGE ACTIVE (PORT ${PORT})`);
    console.log(`   - Isolated QR codes & sessions per student ID`);
    console.log(`   - Local network streaming with group permissions`);
    console.log(`========================================================`);
});

// Auto-restore any existing user sessions
if (fs.existsSync(BASE_AUTH_DIR)) {
    const dirs = fs.readdirSync(BASE_AUTH_DIR);
    dirs.forEach(d => {
        if (d.startsWith('user_')) {
            const uId = d.replace('user_', '');
            console.log(`[WA Bridge] Restoring existing session for: ${uId}`);
            startWhatsAppBridge(uId, false);
        }
    });
}
