# -*- coding: utf-8 -*-
import requests
import re

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

r = requests.get("https://campusweb.in/_next/static/chunks/app/page-0abae788f96ea687.js", headers=headers)
print("Page chunk length:", len(r.text))

# Find raw JSX text and strings
strings = re.findall(r'"([^"\\]{4,100})"', r.text)
interesting = [s for s in strings if not re.match(r'^[0-9a-fA-F\-]{8,}$', s) and not s.startswith("http") and not s.startswith("/")]
print("Unique strings found in CampusWeb page:")
for s in sorted(set(interesting))[:50]:
    print(" -", s)
