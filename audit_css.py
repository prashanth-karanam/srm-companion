import os
import re

ROOT_DIR = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"

with open(os.path.join(ROOT_DIR, "style.css"), "r", encoding="utf-8", errors="replace") as f:
    css = f.read()

print("=" * 80)
print("CSS & MOBILE RESPONSIVENESS AUDIT")
print("=" * 80)

# 1. Check for fixed bottom navigation height vs main content padding-bottom
bot_nav_matches = re.findall(r'\.bottom-nav[^{]*\{[^}]*\}', css)
print(f"Bottom nav rules: {len(bot_nav_matches)}")
for r in bot_nav_matches:
    print("  ", r.replace('\n', ' '))

# 2. Check tab-content / main-screen container padding
main_pads = re.findall(r'(?:\.tab-content|\.main-container|\.screen|\.content-wrap)[^{]*\{[^}]*padding[^}]*\}', css)
print(f"\nMain container padding rules: {len(main_pads)}")
for r in main_pads[:5]:
    print("  ", r.replace('\n', ' '))

# 3. Check for horizontal overflow risks (fixed widths > 320px without max-width: 100%)
fixed_widths = re.findall(r'width:\s*([4-9][0-9]{2}|[1-9][0-9]{3,})px', css)
print(f"\nFixed width declarations >= 400px: {len(fixed_widths)}")
for w in set(fixed_widths):
    print(f"   Fixed width: {w}px")

# 4. Check modal overflow behavior
modal_overflows = re.findall(r'\.modal[^{]*\{[^}]*\}', css)
print(f"\nModal rules: {len(modal_overflows)}")
for m in modal_overflows:
    print("  ", m.replace('\n', ' '))
