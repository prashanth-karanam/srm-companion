import os

for root, dirs, files in os.walk("."):
    if "node_modules" in root or ".git" in root:
        continue
    for file in files:
        if file.endswith((".js", ".html", ".json")):
            filepath = os.path.join(root, file)
            try:
                with open(filepath, "r", encoding="utf-8") as f:
                    content = f.read()
                    if "Optional Hours" in content or "Pink Building" in content or "Sheet Metal Manual" in content:
                        print(f"FOUND in {filepath}")
            except Exception as e:
                pass
