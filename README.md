# SRM Companion

> **Open-Source Campus Utility & Android App**  
> An open client engineered for students to manage campus schedules, access timetable utilities, and run a self-hosted offline/online companion.

[![Open Source](https://img.shields.io/badge/Open%20Source-Community-2ea44f?style=flat)](https://github.com/prashanth-karanam/srm-companion)
[![Android](https://img.shields.io/badge/Target-Android%20APK-3DDC84?style=flat&logo=android)](https://github.com/prashanth-karanam/srm-companion/releases)
[![Build Tool](https://img.shields.io/badge/Engine-Capacitor%208.5-53B9EA?style=flat&logo=capacitor)](https://capacitorjs.com)
[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg?style=flat)](LICENSE)

---

## Notice & Philosophy

This project is an **independent, open-source community tool**. It is:
- **Non-promoted**: Distributed purely as an open code repository and direct build target for peers and students who want local utility.
- **Self-contained**: All core timetables, iCalendar formats, and offline scheduling logic run on-device with zero telemetry or tracking.
- **Open for Inspection**: The complete source code—from the mobile web shell to the build scripts—is available for anyone to audit, compile, or fork.

---

## How to Install the APK

### Option A: Direct APK Install (Recommended for Users)
1. Head over to the [**Releases**](https://github.com/prashanth-karanam/srm-companion/releases) section.
2. Download the latest `SRM_Companion_Release.apk` (or debug build).
3. On your Android phone, open the downloaded APK file.
4. If prompted, toggle **"Allow installation from unknown sources"** for your browser/file manager.
5. Tap **Install** and launch the app.

---

### Option B: Build the APK from Source (For Developers)

If you want to build the APK yourself from the source tree:

#### Prerequisites
- **Git**
- **Node.js** (v18+)
- **Android SDK** (API 33 or 34)
- **JDK 17 or JDK 21**

#### Build Steps

1. **Clone the repository:**
   ```bash
   git clone https://github.com/prashanth-karanam/srm-companion.git
   cd srm-companion
   ```

2. **Install frontend and Capacitor dependencies:**
   ```bash
   npm install
   ```

3. **Synchronize web assets into Android project:**
   ```bash
   npx cap sync android
   ```

4. **Build APK via Gradle:**
   ```bash
   cd android
   ./gradlew assembleRelease
   ```
   *Your compiled APK will be generated at:*  
   `android/app/build/outputs/apk/release/app-release-unsigned.apk`

   *(Alternatively, run `python compile_apk.py` if running locally on Windows with configured environment paths).*

---

## Features

- **Academic Timetable Sync**: Automatically parse `.ics` university calendars directly into system calendars and native reminder alerts.
- **Zero-Ad / Clean Dashboard**: Instant access to course timetables, schedules, and daily class order with zero trackers or external ads.
- **Optional Background Bridge**: Includes an optional decoupled Node.js bridge (`wa_bridge.js`) for self-hosted schedule dispatching.

---

## Project Structure

```
srm-companion/
├── android/               # Native Android Gradle workspace (Capacitor)
├── www/                   # Packaged client-side assets
├── compile_apk.py         # Automated APK build & sync script
├── app.js                 # Core client application logic
├── index.html             # Application entrypoint
├── SRM_Semester_Timetable.ics  # Reference academic schedule
├── wa_bridge.js           # Decoupled backend utility microservice
├── Dockerfile             # Container configuration for backend services
└── package.json           # Dependencies and scripts
```

---

## Contributing & Auditing

Contributions, bug reports, and pull requests are welcome. Feel free to open an Issue if you encounter schedule parsing bugs or UI layout defects across specific Android screen densities.

## License

This repository is distributed under the [ISC License](LICENSE).
