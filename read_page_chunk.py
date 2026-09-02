import requests
import re
from bs4 import BeautifulSoup

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

r = requests.get("https://campusweb.in/_next/static/chunks/app/page-0abae788f96ea687.js", headers=headers)
print("Page chunk length:", len(r.text))

# Extract all readable UI strings
ui_texts = re.findall(r'>([^<]{3,80})<|placeholder:\s*"([^"]+)"|title:\s*"([^"]+)"|label:\s*"([^"]+)"|text:\s*"([^"]+)"', r.text)
cleaned = []
for t in ui_texts:
    for sub in t:
        if sub and len(sub.strip()) > 3 and not sub.startswith("{"):
            cleaned.append(sub.strip())

print("Unique UI labels in CampusWeb landing page:")
for item in sorted(set(cleaned))[:40]:
    print(" •", item)
