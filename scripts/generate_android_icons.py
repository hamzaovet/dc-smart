import os
from PIL import Image, ImageDraw, ImageFont

res_dir = r"d:\Work\minipick\android\app\src\main\res"

sizes = {
    "mipmap-mdpi": (48, 48),
    "mipmap-hdpi": (72, 72),
    "mipmap-xhdpi": (96, 96),
    "mipmap-xxhdpi": (144, 144),
    "mipmap-xxxhdpi": (192, 192),
}

# Base high-res 512x512 icon
base_size = 512
img = Image.new("RGBA", (base_size, base_size), (0, 0, 0, 0))
draw = ImageDraw.Draw(img)

# Background gradient / rounded box
for y in range(base_size):
    # Pink gradient from #ff6b8b to #ffa8be
    r = int(255 - (y / base_size) * 10)
    g = int(107 + (y / base_size) * 60)
    b = int(139 + (y / base_size) * 55)
    draw.line([(0, y), (base_size, y)], fill=(r, g, b, 255))

# Mask rounded corners
mask = Image.new("L", (base_size, base_size), 0)
mask_draw = ImageDraw.Draw(mask)
mask_draw.rounded_rectangle([(10, 10), (base_size - 10, base_size - 10)], radius=110, fill=255)

# Inner border
icon_bg = Image.new("RGBA", (base_size, base_size), (0, 0, 0, 0))
icon_bg.paste(img, (0, 0), mask=mask)
draw_final = ImageDraw.Draw(icon_bg)

draw_final.rounded_rectangle([(14, 14), (base_size - 14, base_size - 14)], radius=105, outline=(255, 255, 255, 180), width=6)

# Cute decorative circles / pearl dots
for i in range(12):
    angle_rad = i * (3.14159 * 2 / 12)
    cx = int(256 + 180 * 0.9 * 0.9 * (1 if i % 2 == 0 else 0.85))

# Draw "MP" & Sparkles
try:
    font_large = ImageFont.truetype("arialbd.ttf", 180)
    font_sub = ImageFont.truetype("arialbd.ttf", 44)
except:
    font_large = ImageFont.load_default()
    font_sub = ImageFont.load_default()

# White text with subtle drop shadow
draw_final.text((258, 218), "MP", fill=(180, 50, 80, 120), font=font_large, anchor="mm")
draw_final.text((256, 216), "MP", fill=(255, 255, 255, 255), font=font_large, anchor="mm")

draw_final.text((257, 345), "MINI PICK", fill=(180, 50, 80, 100), font=font_sub, anchor="mm")
draw_final.text((256, 344), "MINI PICK", fill=(255, 245, 248, 255), font=font_sub, anchor="mm")

# Sparkles
draw_final.text((140, 140), "✨", fill=(255, 255, 255, 255), font=font_sub, anchor="mm")
draw_final.text((370, 130), "✨", fill=(255, 255, 255, 255), font=font_sub, anchor="mm")

# Save high-res icon in public
icon_bg.save(r"d:\Work\minipick\public\app-icon.png")

# Generate all mipmap densities
for folder, size in sizes.items():
    f_path = os.path.join(res_dir, folder)
    os.makedirs(f_path, exist_ok=True)
    
    # Square icon
    resized = icon_bg.resize(size, Image.Resampling.LANCZOS)
    resized.save(os.path.join(f_path, "ic_launcher.png"))
    resized.save(os.path.join(f_path, "ic_launcher_foreground.png"))
    
    # Round icon
    round_mask = Image.new("L", size, 0)
    round_draw = ImageDraw.Draw(round_mask)
    round_draw.ellipse([(0, 0), size], fill=255)
    
    round_img = Image.new("RGBA", size, (0, 0, 0, 0))
    round_img.paste(resized, (0, 0), mask=round_mask)
    round_img.save(os.path.join(f_path, "ic_launcher_round.png"))

print("Mini Pick Pink Android icons generated successfully!")
