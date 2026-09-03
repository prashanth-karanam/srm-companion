import os
import sys
import subprocess
import shutil

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

PROJECT_DIR = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"
ANDROID_DIR = os.path.join(PROJECT_DIR, "android")
SDK_ROOT = r"C:\Users\Praashu\AppData\Local\Android\Sdk"
JDK_DIR = r"C:\Users\Praashu\.jdk-21"
DOWNLOADS_DIR = r"C:\Users\Praashu\Downloads"

print("=" * 60)
print("BUILDING STANDALONE PRODUCTION APK")
print("=" * 60)

# 1. Verify JDK 21
javac_path = os.path.join(JDK_DIR, "bin", "javac.exe")
if not os.path.exists(javac_path):
    print(f"[ERROR] JDK 21 not found at {JDK_DIR}")
    sys.exit(1)

# 2. Write local.properties
local_props_path = os.path.join(ANDROID_DIR, "local.properties")
escaped_sdk = SDK_ROOT.replace("\\", "\\\\").replace(":", "\\:")
with open(local_props_path, "w", encoding="utf-8") as f:
    f.write(f"sdk.dir={escaped_sdk}\n")

# 3. Synchronize Web Assets to www and Android public directory
print("[1/3] Syncing latest web assets to Android build directories...")
web_files = ["app.js", "index.html", "style.css", "data.js", "version.json", "manifest.json", "capacitor.js"]
www_dir = os.path.join(PROJECT_DIR, "www")
android_public_dir = os.path.join(ANDROID_DIR, "app", "src", "main", "assets", "public")
os.makedirs(www_dir, exist_ok=True)
os.makedirs(android_public_dir, exist_ok=True)

for f in web_files:
    src_f = os.path.join(PROJECT_DIR, f)
    if os.path.exists(src_f):
        shutil.copyfile(src_f, os.path.join(www_dir, f))
        shutil.copyfile(src_f, os.path.join(android_public_dir, f))
print(f"      Synced {len(web_files)} files to www/ and assets/public/")

# 4. Environment
env = os.environ.copy()
env["JAVA_HOME"] = JDK_DIR
env["PATH"] = os.path.join(JDK_DIR, "bin") + os.pathsep + env.get("PATH", "")
env["ANDROID_HOME"] = SDK_ROOT
env["ANDROID_SDK_ROOT"] = SDK_ROOT

# 5. Run gradlew assembleDebug
print("[2/3] Compiling Android APK with Gradle & JDK 21...")
proc = subprocess.run(
    ["cmd.exe", "/c", "gradlew.bat", "assembleDebug", "--no-daemon"],
    cwd=ANDROID_DIR,
    env=env,
    capture_output=True,
    text=True
)

if proc.returncode != 0:
    print("\n--- BUILD FAILED ---")
    print(proc.stdout[-2000:] if len(proc.stdout) > 2000 else proc.stdout)
    print("\n--- STDERR ---")
    print(proc.stderr[-2000:] if len(proc.stderr) > 2000 else proc.stderr)
    sys.exit(proc.returncode)

print(proc.stdout[-800:] if len(proc.stdout) > 800 else proc.stdout)

# 5. Copy generated APK
apk_build_path = os.path.join(ANDROID_DIR, "app", "build", "outputs", "apk", "debug", "app-debug.apk")
if os.path.exists(apk_build_path):
    dest1 = os.path.join(PROJECT_DIR, "OneSRM.apk")
    dest2 = os.path.join(DOWNLOADS_DIR, "OneSRM.apk")
    legacy1 = os.path.join(PROJECT_DIR, "SRM_Companion.apk")
    legacy2 = os.path.join(DOWNLOADS_DIR, "SRM_Companion.apk")
    
    shutil.copyfile(apk_build_path, dest1)
    shutil.copyfile(apk_build_path, dest2)
    shutil.copyfile(apk_build_path, legacy1)
    shutil.copyfile(apk_build_path, legacy2)
    
    size_mb = os.path.getsize(dest2) / (1024 * 1024)
    print("\n" + "=" * 60)
    print("🎉 APK COMPILED & DELIVERED SUCCESSFULLY!")
    print(f"   Project Copy:   {dest1}")
    print(f"   Downloads Copy: {dest2}")
    print(f"   Size:           {size_mb:.2f} MB")
    print("=" * 60)
else:
    print(f"[ERROR] Generated APK not found at: {apk_build_path}")
    sys.exit(1)
