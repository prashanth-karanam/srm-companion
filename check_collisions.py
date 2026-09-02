import re

with open("data.js", "r", encoding="utf-8") as f:
    data_js = f.read()

with open("app.js", "r", encoding="utf-8") as f:
    app_js = f.read()

# Find top-level const, let, var, function declarations in data.js
data_decls = set(re.findall(r'^(?:const|let|var|function)\s+([a-zA-Z0-9_$]+)', data_js, re.MULTILINE))
print("data.js declarations:", data_decls)

# Find top-level const, let, var, function declarations in app.js
app_decls = set(re.findall(r'^(?:const|let|var|function)\s+([a-zA-Z0-9_$]+)', app_js, re.MULTILINE))

collisions = data_decls.intersection(app_decls)
print("COLLISIONS BETWEEN data.js AND app.js:", collisions)
