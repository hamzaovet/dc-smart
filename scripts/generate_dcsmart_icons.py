import os
from PIL import Image

base_dir = r"d:\Work\dc-smart"
logo_path = os.path.join(base_dir, "public", "logo.jpg")
res_dir = os.path.join(base_dir, "android", "app", "src", "main", "res")

sizes = {
    "mipmap-mdpi": (48, 48),
    "mipmap-hdpi": (72, 72),
    "mipmap-xhdpi": (96, 96),
    "mipmap-xxhdpi": (144, 144),
    "mipmap-xxxhdpi": (192, 192),
}

if os.path.exists(logo_path):
    src_img = Image.open(logo_path).convert("RGBA")
    print("Loaded logo from:", logo_path, src_img.size)

    for folder, size in sizes.items():
        target_dir = os.path.join(res_dir, folder)
        os.makedirs(target_dir, exist_ok=True)
        
        # Square resize with high quality
        resized = src_img.resize(size, Image.Resampling.LANCZOS)
        
        # Save ic_launcher.png and ic_launcher_round.png and ic_launcher_foreground.png
        for filename in ["ic_launcher.png", "ic_launcher_round.png", "ic_launcher_foreground.png"]:
            dest = os.path.join(target_dir, filename)
            resized.save(dest, format="PNG")
            print(f"Saved {dest}")

    print("Successfully generated all DC Smart Android icons!")
else:
    print("Logo not found at:", logo_path)
