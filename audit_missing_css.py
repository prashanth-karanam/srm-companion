from bs4 import BeautifulSoup
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

with open("app.js", "r", encoding="utf-8") as f:
    js = f.read()

soup = BeautifulSoup(html, "html.parser")
html_classes = set()
for tag in soup.find_all(class_=True):
    for c in tag["class"]:
        html_classes.add(c)

js_classes = set(re.findall(r'class(?:Name)?\s*=\s*["\']([^"\']+)["\']', js))
flat_js_classes = set()
for c in js_classes:
    for sub in c.split():
        if not ("$" in sub or "{" in sub or "<" in sub):
            flat_js_classes.add(sub)

all_used_classes = html_classes.union(flat_js_classes)

css_classes = set(re.findall(r'\.([a-zA-Z0-9_\-]+)', css))

missing_in_css = [c for c in all_used_classes if c not in css_classes and not c.startswith("tag-")]
print("Classes used in HTML/JS but not found in style.css:")
for m in sorted(missing_in_css):
    print(" -", m)
