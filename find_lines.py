with open("app.js", "r", encoding="utf-8") as f:
    lines = f.readlines()

for i, line in enumerate(lines):
    if any(k in line for k in ["Optional Hours", "Pink Building", "Sheet Metal Manual", "Unit 1 Matrix", "ann-1"]):
        print(f"Line {i+1}: {line.strip()[:80]}")
