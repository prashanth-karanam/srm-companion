from bs4 import BeautifulSoup
import re

with open("index.html", "r", encoding="utf-8") as f:
    html = f.read()

soup = BeautifulSoup(html, "html.parser")

# Check for duplicate IDs
ids = [tag["id"] for tag in soup.find_all(attrs={"id": True})]
duplicates = set([x for x in ids if ids.count(x) > 1])
print("Duplicate IDs:", duplicates)

# Check all tab views and containers
tab_views = soup.find_all(class_="tab-view")
print(f"Total Tab Views: {len(tab_views)}")
for tv in tab_views:
    print(f" - Tab View: id={tv.get('id')} display={tv.get('style')}")

# Check for unclosed tags or structural anomalies
print("All element counts:")
print("divs:", len(soup.find_all("div")))
print("buttons:", len(soup.find_all("button")))
print("inputs:", len(soup.find_all("input")))
print("scripts:", len(soup.find_all("script")))
