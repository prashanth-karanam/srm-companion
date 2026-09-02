import os
import re
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

ROOT_DIR = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"

print("=" * 80)
print("COMPREHENSIVE ZERO-DEFECT DEEP AUDIT FOR SRM COMPANION")
print("=" * 80)

# 1. Inspect index.html for all element IDs
index_path = os.path.join(ROOT_DIR, "index.html")
with open(index_path, "r", encoding="utf-8", errors="replace") as f:
    html_content = f.read()

declared_ids = set(re.findall(r'id=[\'"]([A-Za-z0-9_\-]+)[\'"]', html_content))
print(f"\n[HTML Audit] Found {len(declared_ids)} declared element IDs in index.html.")

# 2. Inspect app.js for all getElementById calls
app_path = os.path.join(ROOT_DIR, "app.js")
with open(app_path, "r", encoding="utf-8", errors="replace") as f:
    app_content = f.read()

referenced_ids = set(re.findall(r'getElementById\([\'"]([A-Za-z0-9_\-]+)[\'"]\)', app_content))
print(f"[JS Audit] Found {len(referenced_ids)} referenced element IDs in app.js.")

missing_ids = referenced_ids - declared_ids
print(f"[JS/HTML Audit] Missing IDs in HTML that JS looks for: {len(missing_ids)}")
for mid in sorted(missing_ids):
    print(f"   [MISSING ID] '{mid}'")

# 3. Check for any dangerous direct innerHTML unescaped injections or unhandled null accesses
unsafe_accesses = []
lines = app_content.split("\n")
for idx, line in enumerate(lines, 1):
    matches = re.finditer(r'document\.getElementById\([\'"]([^\'"]+)[\'"]\)\.([a-zA-Z]+)', line)
    for m in matches:
        el_id = m.group(1)
        prop = m.group(2)
        if el_id not in declared_ids:
            unsafe_accesses.append((idx, el_id, prop, line.strip()))

print(f"\n[Unsafe DOM Accesses] Found {len(unsafe_accesses)} dangerous direct property accesses on missing elements:")
for lnum, el_id, prop, ltext in unsafe_accesses:
    print(f"   Line {lnum:4d}: id '{el_id}'.{prop} -> {ltext[:90]}")

print("\nAudit Phase 1 complete.")
