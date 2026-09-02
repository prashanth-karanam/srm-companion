import requests
from bs4 import BeautifulSoup
import re
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

r = requests.get("https://campusweb.in", headers=headers, timeout=10)
print("CampusWeb Status:", r.status_code)
html = r.text

soup = BeautifulSoup(html, "html.parser")
scripts = [s.get("src") for s in soup.find_all("script") if s.get("src")]

print("Scripts found:")
for s in scripts:
    print(" -", s)

# Let's inspect page chunk
page_chunk = [s for s in scripts if "app/page" in s or "main" in s or "4639" in s]
for pc in scripts:
    if pc.startswith("/"):
        chunk_url = "https://campusweb.in" + pc
        try:
            cr = requests.get(chunk_url, headers=headers, timeout=10)
            text = cr.text
            # Search for text strings, routes, features, components
            strings = re.findall(r'"([^"]{4,80})"', text)
            features = [s for s in strings if any(k in s.lower() for k in ["attendance", "cgpa", "sgpa", "bunk", "margin", "timetable", "schedule", "marks", "grade", "fee", "hostel", "order", "day", "calendar", "notification", "login", "academia", "srm", "pricing", "premium", "pro", "plan", "calc", "chat", "faculty"])]
            if features:
                print(f"\n--- Found {len(features)} interesting strings in {pc} ---")
                print(list(set(features))[:25])
        except Exception as e:
            print("Error fetching chunk:", e)
