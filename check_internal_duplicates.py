import re

with open("app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Find all top-level const/let/var declarations in app.js
lines = app_js.split("\n")
seen = {}
for i, line in enumerate(lines):
    match = re.match(r'^(?:const|let|var)\s+([a-zA-Z0-9_$]+)', line.strip())
    if match:
        name = match.group(1)
        if name in seen:
            print(f"DUPLICATE DECLARATION in app.js: '{name}' on line {i+1} (previously on line {seen[name]})")
        seen[name] = i + 1

# Check functions
func_seen = {}
for i, line in enumerate(lines):
    match = re.match(r'^function\s+([a-zA-Z0-9_$]+)', line.strip())
    if match:
        name = match.group(1)
        if name in func_seen:
            print(f"DUPLICATE FUNCTION in app.js: '{name}' on line {i+1} (previously on line {func_seen[name]})")
        func_seen[name] = i + 1
