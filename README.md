# SRM Companion

A cross-platform campus workflow and utility application engineered with Capacitor, featuring a containerized Node.js bridge service for session-isolated WhatsApp notifications and academic schedule sync.

[![Platform](https://img.shields.io/badge/Platform-Android%20%7C%20iOS%20%7C%20Web-3DDC84?style=flat)](https://capacitorjs.com)
[![Capacitor](https://img.shields.io/badge/Capacitor-8.5-53B9EA?style=flat&logo=capacitor)](https://capacitorjs.com)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=flat&logo=nodedotjs)](https://nodejs.org)
[![Docker](https://img.shields.io/badge/Container-Docker-2496ED?style=flat&logo=docker)](https://www.docker.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat)](LICENSE)

---

## Overview

**SRM Companion** is a mobile and web application built to streamline everyday campus routines for university students. It bridges academic schedules, course resources, and an optional real-time communication notification microservice via a containerized Node.js daemon.

## Key Features

- **Cross-Platform Client**: Built using web standards and packaged for native Android and iOS via Capacitor.
- **Timetable & Schedule Sync**: Native `.ics` iCalendar parser for synchronizing academic timetables directly into student devices.
- **Session-Isolated Communication Bridge**: Standalone Node.js microservice (`wa_bridge.js`) utilizing WebSocket connections with isolated user sessions and QR-authenticated pairings.
- **Containerized Deployment**: Includes ready-to-run `Dockerfile` and `docker-compose.yml` for zero-friction cloud deployment (Railway, Render, or self-hosted VPS).

## System Architecture

```
+-------------------------------------------------------------+
|                     Client Application                      |
|                                                             |
|   +-----------------------+     +-----------------------+   |
|   |   Web UI / Dashboard  | <-> |  Capacitor Native API |   |
|   |   (Timetable, Tools)  |     |  (Android / iOS Shell)|   |
|   +-----------------------+     +-----------------------+   |
+-------------------------------------------------------------+
                              | (HTTP / WebSocket)
                              v
+-------------------------------------------------------------+
|             Backend Microservice (Docker / Node.js)         |
|                                                             |
|   +-----------------------+     +-----------------------+   |
|   |   Multi-User Session  | <-> | Baileys Socket Engine |   |
|   |   Storage (wa_auth/)  |     | (QR Stream & Handshake|   |
|   +-----------------------+     +-----------------------+   |
+-------------------------------------------------------------+
```

## Tech Stack

- **Client Runtime**: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Mobile Engine**: Capacitor (`@capacitor/android`, `@capacitor/ios` v8.5)
- **Backend Service**: Node.js, `@whiskeysockets/baileys`, `pino` logger, `qrcode`
- **Deployment**: Docker, Docker Compose, Railway / Render manifests

## Getting Started

### 1. Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Android Studio / Xcode (optional, only for native mobile builds)

### 2. Client Setup
```bash
git clone https://github.com/prashanth-karanam/srm-companion.git
cd srm-companion

# Install dependencies
npm install

# Run web version locally
npx serve .
```

### 3. Running the WhatsApp Bridge Microservice
```bash
# Start backend bridge locally
node index.js
```
The server will start on port `8001` (or your defined `$PORT`).

### 4. Running with Docker
```bash
docker-compose up --build -d
```

## Security & Privacy Notice
All authentication tokens and session payloads are stored in the local `wa_auth/` directory. Never commit session tokens or personal keys to version control.

## License

This project is licensed under the [ISC License](LICENSE).
