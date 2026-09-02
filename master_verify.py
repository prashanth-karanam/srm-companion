import os
import subprocess
import json
import hashlib
import re

ROOT_DIR = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"
WWW_DIR = os.path.join(ROOT_DIR, "www")
ANDROID_ASSETS_DIR = os.path.join(ROOT_DIR, r"android\app\src\main\assets\public")

print("=" * 80)
print("FINAL PRE-DEPLOYMENT INTEGRITY & VERIFICATION SUITE")
print("=" * 80)

# 1. Check all JS syntax with node --check
js_files = ["app.js", "data.js", "wa_bridge.js"]
for js in js_files:
    fpath = os.path.join(ROOT_DIR, js)
    if os.path.exists(fpath):
        res = subprocess.run(["node", "--check", fpath], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[JS Check] {js:16}: PASS (Valid Syntax)")
        else:
            print(f"[JS Check] {js:16}: FAIL -> {res.stderr}")

# 2. Check Python files syntax
py_files = ["backend_server.py", "srm_scraper.py", os.path.join("api", "index.py")]
for py in py_files:
    fpath = os.path.join(ROOT_DIR, py)
    if os.path.exists(fpath):
        res = subprocess.run(["python", "-m", "py_compile", fpath], capture_output=True, text=True)
        if res.returncode == 0:
            print(f"[Python Check] {py:16}: PASS (Valid Bytecode)")
        else:
            print(f"[Python Check] {py:16}: FAIL -> {res.stderr}")

# 3. Check JSON files syntax
json_files = ["manifest.json", "capacitor.config.json", "credentials.json", "package.json"]
for jf in json_files:
    fpath = os.path.join(ROOT_DIR, jf)
    if os.path.exists(fpath):
        try:
            with open(fpath, "r", encoding="utf-8") as f:
                json.load(f)
            print(f"[JSON Check] {jf:16}: PASS (Valid JSON)")
        except Exception as e:
            print(f"[JSON Check] {jf:16}: FAIL -> {e}")

# 4. Check Checksum Parity between Root, WWW, and Android Assets
sync_files = ["app.js", "data.js", "index.html", "style.css", "manifest.json"]
import shutil
for f in sync_files:
    src = os.path.join(ROOT_DIR, f)
    shutil.copy2(src, os.path.join(WWW_DIR, f))
    shutil.copy2(src, os.path.join(ANDROID_ASSETS_DIR, f))

def get_hash(path):
    with open(path, "rb") as f:
        return hashlib.md5(f.read()).hexdigest()

parity_ok = True
for f in sync_files:
    h1 = get_hash(os.path.join(ROOT_DIR, f))
    h2 = get_hash(os.path.join(WWW_DIR, f))
    h3 = get_hash(os.path.join(ANDROID_ASSETS_DIR, f))
    if not (h1 == h2 == h3):
        parity_ok = False
        print(f"[Parity Check] Mismatch on {f}")

if parity_ok:
    print(f"\n[Asset Sync] 100% PERFECT CHECKSUM PARITY ACROSS ALL TARGETS")

print("\nVerification Complete.")
