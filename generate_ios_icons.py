import os
from PIL import Image, ImageDraw, ImageFont

def generate_icons():
    size = 1024
    img = Image.new("RGBA", (size, size), (9, 10, 16, 255))
    draw = ImageDraw.Draw(img)

    # Draw rounded rect / background glow
    # Subtle outer glow
    for offset in range(30, 0, -2):
        alpha = int(12 * (1 - offset / 30))
        draw.rounded_rectangle(
            [60 - offset, 60 - offset, size - 60 + offset, size - 60 + offset],
            radius=240,
            outline=(56, 189, 248, alpha),
            width=2
        )

    # Main card surface
    draw.rounded_rectangle(
        [64, 64, size - 64, size - 64],
        radius=220,
        fill=(15, 17, 26, 255),
        outline=(56, 189, 248, 120),
        width=4
    )

    # Inner decorative glow circle / rings
    center = (size // 2, size // 2 - 40)
    for r in range(280, 240, -1):
        opacity = int(40 * ((280 - r) / 40))
        draw.ellipse([center[0] - r, center[1] - r, center[0] + r, center[1] + r], outline=(56, 189, 248, opacity), width=2)

    # Core circle badge
    draw.ellipse([center[0] - 230, center[1] - 230, center[0] + 230, center[1] + 230], fill=(24, 28, 42, 255), outline=(56, 189, 248, 220), width=6)

    # Try finding a bold font or draw stylish vector-like glyphs
    font_large = None
    font_sub = None
    for font_name in ["arialbd.ttf", "seguisb.ttf", "calibrib.ttf", "arial.ttf"]:
        try:
            font_large = ImageFont.truetype(font_name, 190)
            font_sub = ImageFont.truetype(font_name, 72)
            break
        except Exception:
            continue

    if font_large:
        # Draw "SRM" text
        text = "SRM"
        bbox = draw.textbbox((0, 0), text, font=font_large)
        w = bbox[2] - bbox[0]
        h = bbox[3] - bbox[1]
        text_pos = (center[0] - w // 2, center[1] - h // 2 - 20)
        
        # Subtle text drop shadow
        draw.text((text_pos[0], text_pos[1] + 4), text, font=font_large, fill=(0, 0, 0, 180))
        # Text gradient-like fill
        draw.text(text_pos, text, font=font_large, fill=(248, 250, 252, 255))
        
        # Draw "ONE" or "COMPANION" subtitle pill
        sub_text = "ONE"
        sub_bbox = draw.textbbox((0, 0), sub_text, font=font_sub)
        sub_w = sub_bbox[2] - sub_bbox[0]
        sub_h = sub_bbox[3] - sub_bbox[1]
        
        pill_pad_x = 36
        pill_pad_y = 12
        pill_y = size - 220
        pill_rect = [
            center[0] - sub_w // 2 - pill_pad_x,
            pill_y - pill_pad_y,
            center[0] + sub_w // 2 + pill_pad_x,
            pill_y + sub_h + pill_pad_y
        ]
        
        draw.rounded_rectangle(pill_rect, radius=24, fill=(56, 189, 248, 255))
        draw.text((center[0] - sub_w // 2, pill_y - 4), sub_text, font=font_sub, fill=(9, 10, 16, 255))
    
    # Save target sizes
    targets = [
        ("ios/App/App/Assets.xcassets/AppIcon.appiconset/AppIcon-512@2x.png", 1024),
        ("www/apple-touch-icon.png", 180),
        ("apple-touch-icon.png", 180),
        ("www/icon-192.png", 192),
        ("icon-192.png", 192),
        ("www/icon-512.png", 512),
        ("icon-512.png", 512),
        ("ios/App/App/public/apple-touch-icon.png", 180),
        ("ios/App/App/public/icon-192.png", 192),
        ("ios/App/App/public/icon-512.png", 512),
    ]

    base_dir = r"C:\Users\Praashu\.gemini\antigravity\scratch\srm_companion"
    for rel_path, s in targets:
        full_path = os.path.join(base_dir, rel_path)
        os.makedirs(os.path.dirname(full_path), exist_ok=True)
        resized = img.resize((s, s), Image.Resampling.LANCZOS)
        # For iOS AppIcon, ensure RGB without alpha if required, though RGBA is supported
        if rel_path.endswith(".png") and "AppIcon" in rel_path:
            # Apple recommends RGB for app store icons
            rgb_img = Image.new("RGB", (s, s), (9, 10, 16))
            rgb_img.paste(resized, (0, 0), resized)
            rgb_img.save(full_path, "PNG")
        else:
            resized.save(full_path, "PNG")
        print(f"Generated: {rel_path} ({s}x{s})")

if __name__ == "__main__":
    generate_icons()
