import os
import math
from PIL import Image, ImageDraw, ImageFont

def generate_logo():
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    public_dir = os.path.join(base_dir, 'public')
    os.makedirs(public_dir, exist_ok=True)
    
    size = 512
    # Rich deep obsidian background with gold borders and perfume bottle silhouette
    im = Image.new('RGBA', (size, size), (10, 8, 14, 255)) # #0a080e
    draw = ImageDraw.Draw(im)
    
    # Outer luxury gold octagonal / rounded border
    margin = 24
    gold_border = (212, 175, 55, 230) # #d4af37
    gold_accent = (245, 222, 179, 255) # wheat / light gold
    gold_dark = (160, 120, 40, 200)

    # Concentric borders
    draw.rounded_rectangle([margin, margin, size - margin, size - margin], radius=56, outline=gold_border, width=4)
    draw.rounded_rectangle([margin + 12, margin + 12, size - margin - 12, size - margin - 12], radius=44, outline=gold_dark, width=1)
    
    # Corner ornaments
    corner_size = 18
    for cx, cy in [
        (margin + 20, margin + 20),
        (size - margin - 20, margin + 20),
        (margin + 20, size - margin - 20),
        (size - margin - 20, size - margin - 20)
    ]:
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=gold_accent)

    # Perfume Bottle Silhouette in Center
    cx = size // 2
    # Bottle Cap
    cap_w, cap_h = 44, 32
    cap_top = 100
    draw.rectangle([cx - cap_w//2, cap_top, cx + cap_w//2, cap_top + cap_h], outline=gold_accent, width=3, fill=(28, 22, 34, 255))
    draw.line([cx - cap_w//2, cap_top + 10, cx + cap_w//2, cap_top + 10], fill=gold_border, width=2)
    
    # Bottle Neck
    neck_w, neck_h = 24, 16
    draw.rectangle([cx - neck_w//2, cap_top + cap_h, cx + neck_w//2, cap_top + cap_h + neck_h], fill=gold_border)
    
    # Bottle Body (Faceted crystal flacon)
    bw, bh = 130, 150
    btop = cap_top + cap_h + neck_h
    bottle_pts = [
        (cx - bw//2, btop + 20),
        (cx - bw//2 + 15, btop),
        (cx + bw//2 - 15, btop),
        (cx + bw//2, btop + 20),
        (cx + bw//2 - 10, btop + bh),
        (cx - bw//2 + 10, btop + bh)
    ]
    draw.polygon(bottle_pts, outline=gold_accent, fill=(24, 18, 30, 255))
    
    # Facets inside bottle
    draw.line([(cx, btop), (cx, btop + bh)], fill=gold_dark, width=1)
    draw.line([(cx - 30, btop + 15), (cx - 20, btop + bh - 10)], fill=gold_dark, width=1)
    draw.line([(cx + 30, btop + 15), (cx + 20, btop + bh - 10)], fill=gold_dark, width=1)
    
    # Center Emblem on Bottle: "R"
    try:
        font_r = ImageFont.truetype("arialbd.ttf", 52)
        font_brand = ImageFont.truetype("timesbd.ttf", 38)
        font_sub = ImageFont.truetype("arial.ttf", 16)
        font_ar = ImageFont.truetype("arialbd.ttf", 24)
    except:
        font_r = ImageFont.load_default()
        font_brand = ImageFont.load_default()
        font_sub = ImageFont.load_default()
        font_ar = ImageFont.load_default()

    # Monogram "R"
    bbox_r = draw.textbbox((0, 0), "R", font=font_r)
    rw = bbox_r[2] - bbox_r[0]
    rh = bbox_r[3] - bbox_r[1]
    draw.text((cx - rw // 2, btop + bh // 2 - rh // 2 - 4), "R", fill=gold_accent, font=font_r)
    
    # Small Crown / Star above R
    draw.polygon([(cx, btop + 24), (cx - 10, btop + 36), (cx + 10, btop + 36)], fill=gold_accent)

    # Brand Text below bottle
    text_y = btop + bh + 36
    bbox_brand = draw.textbbox((0, 0), "ROVY STORE", font=font_brand)
    bw_text = bbox_brand[2] - bbox_brand[0]
    draw.text((cx - bw_text // 2, text_y), "ROVY STORE", fill=gold_accent, font=font_brand)
    
    # Decorative rule with diamond
    rule_y = text_y + 44
    draw.line([cx - 120, rule_y, cx - 18, rule_y], fill=gold_dark, width=2)
    draw.polygon([(cx, rule_y - 4), (cx - 5, rule_y), (cx, rule_y + 4), (cx + 5, rule_y)], fill=gold_accent)
    draw.line([cx + 18, rule_y, cx + 120, rule_y], fill=gold_dark, width=2)

    # Subtitle: LUXURY FRAGRANCES
    bbox_sub = draw.textbbox((0, 0), "HAUTE PARFUMERIE", font=font_sub)
    sw_text = bbox_sub[2] - bbox_sub[0]
    draw.text((cx - sw_text // 2, rule_y + 12), "HAUTE PARFUMERIE", fill=(190, 160, 100, 255), font=font_sub)

    # Save PNG files
    logo_path = os.path.join(public_dir, 'logo.png')
    app_icon_path = os.path.join(public_dir, 'app-icon.png')
    im.save(logo_path, 'PNG')
    im.save(app_icon_path, 'PNG')
    print("Created logo.png and app-icon.png successfully!")

    # Also create an SVG version
    svg_content = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <rect width="512" height="512" rx="56" fill="#0a080e"/>
  <rect x="24" y="24" width="464" height="464" rx="44" fill="none" stroke="#d4af37" stroke-width="4"/>
  <rect x="36" y="36" width="440" height="440" rx="36" fill="none" stroke="#8a6d28" stroke-width="1"/>
  <!-- Bottle Cap -->
  <rect x="234" y="100" width="44" height="32" rx="4" fill="#1c1622" stroke="#f5deb3" stroke-width="3"/>
  <line x1="234" y1="112" x2="278" y2="112" stroke="#d4af37" stroke-width="2"/>
  <rect x="244" y="132" width="24" height="16" fill="#d4af37"/>
  <!-- Bottle -->
  <polygon points="191,168 206,148 306,148 321,168 311,298 201,298" fill="#18121e" stroke="#f5deb3" stroke-width="3"/>
  <!-- Monogram R -->
  <text x="256" y="246" font-family="'Cinzel', 'Playfair Display', serif" font-size="52" font-weight="bold" fill="#f5deb3" text-anchor="middle">R</text>
  <polygon points="256,172 246,184 266,184" fill="#d4af37"/>
  <!-- Brand Text -->
  <text x="256" y="380" font-family="'Cinzel', 'Playfair Display', serif" font-size="34" font-weight="900" fill="#f5deb3" text-anchor="middle" letter-spacing="4">ROVY STORE</text>
  <line x1="136" y1="400" x2="238" y2="400" stroke="#8a6d28" stroke-width="2"/>
  <polygon points="256,396 251,400 256,404 261,400" fill="#f5deb3"/>
  <line x1="274" y1="400" x2="376" y2="400" stroke="#8a6d28" stroke-width="2"/>
  <text x="256" y="426" font-family="sans-serif" font-size="14" font-weight="600" fill="#c5a059" text-anchor="middle" letter-spacing="6">HAUTE PARFUMERIE</text>
</svg>'''
    with open(os.path.join(public_dir, 'logo.svg'), 'w', encoding='utf-8') as f:
        f.write(svg_content)
    print("Created logo.svg successfully!")

if __name__ == '__main__':
    generate_logo()
