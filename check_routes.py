import requests
import re
import json

headers = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
}

# Fetch webpack chunk to get all dynamic route chunks
r = requests.get("https://campusweb.in/_next/static/chunks/webpack-e4ae0b351b25d8b6.js", headers=headers)
routes = re.findall(r'static/chunks/([^"]+)\.js', r.text)
print("Webpack chunks:")
for rt in set(routes):
    print(" -", rt)

# Let's check common routes
common_routes = ["/dashboard", "/attendance", "/timetable", "/marks", "/cgpa", "/profile", "/settings", "/calculator", "/bunk", "/about", "/pricing"]
for cr in common_routes:
    res = requests.get("https://campusweb.in" + cr, headers=headers)
    print(f"Route {cr} -> Status {res.status_code}")
