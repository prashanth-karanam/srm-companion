import json
import re

with open("data.js", "r", encoding="utf-8") as f:
    text = f.read()

# Find SRM_DATA object keys
match = re.search(r'const SRM_DATA\s*=\s*(\{[\s\S]+\});?\s*$', text)
if match:
    print("SRM_DATA keys:")
    # Print lines that look like top level keys
    for line in text.split("\n"):
        if re.match(r'^\s*([a-zA-Z0-9_$]+)\s*:\s*[\[\{]', line):
            print(" -", line.strip()[:60])
