with open("style.css", "r", encoding="utf-8") as f:
    css = f.read()

print("Contains .timeline:", ".timeline" in css)
print("Contains .timetable-list:", ".timetable-list" in css)
