import os, json, re, shutil

BASE_DIR = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"
OUTPUT_DIR = os.path.join(BASE_DIR, "assets", "avatar_frames")
os.makedirs(OUTPUT_DIR, exist_ok=True)

CATEGORIES = [
    ("Royal", "24K Gold", "#fbbf24", "crown"),
    ("Dragon", "Mythic", "#a855f7", "dragon"),
    ("Cosmic", "Galactic", "#d946ef", "cosmic"),
    ("Cyber", "Matrix", "#10b981", "cyber"),
    ("Anime", "Sakura", "#f472b6", "anime"),
    ("Elemental", "Fire", "#f97316", "element"),
    ("RPG", "Challenger", "#38bdf8", "rpg"),
    ("Campus", "Milestone", "#10b981", "srm"),
    ("Nature", "Bioluminescent", "#38bdf8", "nature"),
    ("Gemstones", "Amethyst", "#a855f7", "gem")
]

print("Base setup ready")