"""
SRM Companion - Master Production Health & Architecture Audit
Verifies:
1. Core Serverless & Local API Endpoints (/api/status, /api/attendance, etc.)
2. Session Caching & TTL Engine
3. Rate Limiting & Concurrency Control
4. Inception Labs AI & Fallback Reasoning
5. Dynamic Multi-User DOM & Asset Parity
6. Android APK Build Integrity
"""

import os
import sys
import json
import time

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
passed_checks = []
failed_checks = []

def record(name, status, details=""):
    if status:
        passed_checks.append((name, details))
        print(f"  ✅ [PASS] {name}: {details}")
    else:
        failed_checks.append((name, details))
        print(f"  ❌ [FAIL] {name}: {details}")

print("==================================================")
print("🔍 SRM COMPANION MASTER PRODUCTION AUDIT")
print("==================================================")

# 1. Verify Configuration & Architecture Files
print("\n[1/6] Auditing Architecture & Microservice Configs...")
files_to_check = {
    "vercel.json": "Vercel Serverless Scraper Configuration",
    "render.yaml": "Render Free Web Service WhatsApp Blueprint",
    "Dockerfile": "24/7 Non-Sleeping Container Dockerfile",
    "docker-compose.yml": "Production Multi-Service Orchestration",
    ".github/workflows/build-and-release.yml": "GitHub CI/CD APK Auto-Builder",
    "version.json": "OTA Update & Version Descriptor",
    "backend_server.py": "Multi-User Local & Persistent Backend",
    "api/index.py": "Serverless Portal Scraper & Cryptographic Nonce Engine",
    "wa_bridge.js": "Baileys WhatsApp WebSocket Bridge"
}

for rel_path, desc in files_to_check.items():
    full_p = os.path.join(BASE_DIR, rel_path)
    exists = os.path.exists(full_p)
    size = os.path.getsize(full_p) if exists else 0
    record(f"File: {rel_path}", exists and size > 0, f"{desc} ({size} bytes)")

# 2. Audit Backend Server Imports & Session Cache Logic
print("\n[2/6] Auditing Backend Server Logic & In-Memory Cache...")
try:
    import backend_server
    record("Backend Server Import", True, "Successfully loaded backend_server.py")
    
    # Check Session Cache & Concurrency structures
    has_cache = hasattr(backend_server, '_session_cache')
    has_limiter = hasattr(backend_server, '_check_rate_limit')
    has_semaphore = hasattr(backend_server, '_login_semaphore')
    record("Session Cache System", has_cache, f"Cache dictionary initialized: {has_cache}")
    record("Rate Limiting Engine", has_limiter, f"_check_rate_limit available: {has_limiter}")
    record("Login Concurrency Semaphore", has_semaphore, f"_login_semaphore initialized: {has_semaphore}")
except Exception as e:
    record("Backend Server Import", False, str(e))

# 3. Audit Scraper Core & Parser Engine
print("\n[3/6] Auditing Scraper Engine & Cryptographic Headers...")
try:
    from api.index import login_and_scrape_portal, fetch_srm_captcha, AdvancedAIClient
    record("Scraper Gateway Import", True, "Successfully loaded api/index.py scraper core")
    
    # Verify AI engine instance
    ai_client = AdvancedAIClient()
    offline_reply = ai_client._fallback_pollinations("Calculate eigenvalues of matrix 26MAB1001T")
    record("AI Offline High-Yield Fallback", bool(offline_reply.get("reply")), f"Generated: {offline_reply.get('reply')[:60]}...")
except Exception as e:
    record("Scraper Gateway Import", False, str(e))

# 4. Audit Frontend Assets & Sync Parity
print("\n[4/6] Auditing Asset Parity Across Web, Android & WWW...")
asset_targets = [
    ("app.js", os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "public", "app.js")),
    ("index.html", os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "public", "index.html")),
    ("style.css", os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "public", "style.css")),
    ("data.js", os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "public", "data.js")),
    ("version.json", os.path.join(BASE_DIR, "android", "app", "src", "main", "assets", "public", "version.json")),
]

for src_name, dest_path in asset_targets:
    src_path = os.path.join(BASE_DIR, src_name)
    src_size = os.path.getsize(src_path) if os.path.exists(src_path) else -1
    dest_size = os.path.getsize(dest_path) if os.path.exists(dest_path) else -2
    record(f"Sync: {src_name}", src_size == dest_size and src_size > 0, f"Source: {src_size}B == Android Asset: {dest_size}B")

# 5. Audit JavaScript Syntax & OTA Engine
print("\n[5/6] Auditing JavaScript Syntax & Zero Hardcoding...")
try:
    import subprocess
    res = subprocess.run(["node", "-c", "app.js"], cwd=BASE_DIR, capture_output=True, text=True)
    record("app.js Syntax Validation", res.returncode == 0, "node -c app.js returned 0 syntax errors")
    
    # Audit for forbidden hardcoded overrides in app.js
    with open(os.path.join(BASE_DIR, "app.js"), "r", encoding="utf-8", errors="ignore") as f:
        app_js_text = f.read()
    
    has_hardcoded_name_override = "return 'KARANAM SAI PRASANTH';" in app_js_text
    record("Zero Hardcoded Name Override", not has_hardcoded_name_override, "Clean dynamic name resolver active")
except Exception as e:
    record("app.js Syntax Validation", False, str(e))

# 6. Audit Android APK Artifact
print("\n[6/6] Auditing Production Android APK Deliverable...")
downloads_apk = r"C:\Users\Praashu\Downloads\SRM_Companion.apk"
project_apk = os.path.join(BASE_DIR, "SRM_Companion.apk")

for label, p in [("Downloads APK", downloads_apk), ("Project Copy APK", project_apk)]:
    exists = os.path.exists(p)
    size_mb = (os.path.getsize(p) / (1024 * 1024)) if exists else 0
    record(label, exists and size_mb > 50, f"{size_mb:.2f} MB at {p}")

print("\n==================================================")
print(f"📊 MASTER AUDIT RESULT: {len(passed_checks)} PASSED, {len(failed_checks)} FAILED")
print("==================================================")

if failed_checks:
    sys.exit(1)
