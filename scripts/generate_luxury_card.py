import os
from PIL import Image, ImageDraw, ImageFont
import arabic_reshaper
from bidi.algorithm import get_display

def ar(text):
    """Reshape and reorder Arabic text for proper RTL display in PIL."""
    if not text:
        return ""
    reshaped = arabic_reshaper.reshape(text)
    return get_display(reshaped)

def create_card():
    width = 1200
    height = 680
    
    # 1. Base canvas: deep obsidian velvet
    im = Image.new('RGB', (width, height), (8, 6, 12)) # #08060c
    draw = ImageDraw.Draw(im)
    
    # Gold Palette
    gold_bright = (245, 222, 179) # #f5deb3
    gold_primary = (212, 175, 55) # #d4af37
    gold_dark = (140, 105, 30)
    zinc_text = (215, 210, 225)
    zinc_dim = (150, 145, 160)
    
    # Outer Decorative Frames
    m1 = 28
    draw.rounded_rectangle([m1, m1, width - m1, height - m1], radius=32, outline=gold_primary, width=3)
    m2 = 40
    draw.rounded_rectangle([m2, m2, width - m2, height - m2], radius=24, outline=gold_dark, width=1)
    
    # Corner diamonds
    for cx, cy in [(m2 + 10, m2 + 10), (width - m2 - 10, m2 + 10), (m2 + 10, height - m2 - 10), (width - m2 - 10, height - m2 - 10)]:
        draw.polygon([(cx, cy - 6), (cx + 6, cy), (cx, cy + 6), (cx - 6, cy)], fill=gold_bright)

    # Fonts
    font_candidates = [
        "C:\\Windows\\Fonts\\arialbd.ttf",
        "C:\\Windows\\Fonts\\arial.ttf",
        "C:\\Windows\\Fonts\\segoeui.ttf",
        "C:\\Windows\\Fonts\\timesbd.ttf"
    ]
    
    try:
        font_logo = ImageFont.truetype("timesbd.ttf", 46)
        font_sub = ImageFont.truetype("arialbd.ttf", 16)
        font_tag = ImageFont.truetype("arial.ttf", 15)
        font_qr_title = ImageFont.truetype("arialbd.ttf", 20)
        font_qr_sub = ImageFont.truetype("arial.ttf", 14)
        font_contacts = ImageFont.truetype("arialbd.ttf", 15)
        font_badge = ImageFont.truetype("arialbd.ttf", 12)
    except:
        font_logo = font_sub = font_tag = font_qr_title = font_qr_sub = font_contacts = font_badge = ImageFont.load_default()

    # Load Logo & Paste on Left
    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    logo_path = os.path.join(base_dir, 'public', 'logo.png')
    if os.path.exists(logo_path):
        logo_im = Image.open(logo_path).convert('RGBA').resize((130, 130), Image.Resampling.LANCZOS)
        im.paste(logo_im, (70, 70), logo_im)

    # Left Header Texts
    text_x = 220
    draw.text((text_x, 75), "ROVY STORE", fill=gold_bright, font=font_logo)
    draw.text((text_x, 135), "HAUTE PARFUMERIE BOUTIQUE", fill=gold_primary, font=font_sub)
    draw.text((text_x, 162), "Exclusive Designer, Authentic Testers & Inspired Niche Fragrances", fill=zinc_text, font=font_tag)

    # VIP Badge
    badge_x = width - 260
    draw.rounded_rectangle([badge_x, 75, width - 70, 115], radius=12, fill=(28, 22, 34), outline=gold_primary, width=2)
    draw.text((badge_x + 22, 87), "VIP LUXURY CARD", fill=gold_bright, font=font_badge)

    # Divider Line
    draw.line([70, 225, width - 70, 225], fill=gold_dark, width=1)
    draw.polygon([(width//2, 221), (width//2 + 5, 225), (width//2, 229), (width//2 - 5, 225)], fill=gold_primary)

    # QR Codes Section (Two Cards Side by Side)
    web_qr_path = os.path.join(base_dir, 'public', 'rovy-store-web-qr.png')
    apk_qr_path = os.path.join(base_dir, 'public', 'rovy-store-apk-qr.png')
    
    # Box 1: Website QR (Left Center)
    box1_x1 = 70
    box1_y1 = 250
    box1_w = 500
    box1_h = 280
    draw.rounded_rectangle([box1_x1, box1_y1, box1_x1 + box1_w, box1_y1 + box1_h], radius=20, fill=(16, 12, 22), outline=gold_dark, width=1)
    
    if os.path.exists(web_qr_path):
        qr1_img = Image.open(web_qr_path).convert('RGB').resize((190, 190), Image.Resampling.LANCZOS)
        draw.rounded_rectangle([box1_x1 + 25, box1_y1 + 35, box1_x1 + 25 + 190, box1_y1 + 35 + 190], radius=10, fill=(255, 255, 255))
        im.paste(qr1_img, (box1_x1 + 25, box1_y1 + 35))
    
    # Text inside Box 1 (Correct Shaped Arabic)
    t1_x = box1_x1 + 235
    draw.text((t1_x, box1_y1 + 45), "ONLINE STORE", fill=gold_primary, font=font_sub)
    draw.text((t1_x, box1_y1 + 75), ar("زيارة المتجر الإلكتروني"), fill=gold_bright, font=font_qr_title)
    draw.text((t1_x, box1_y1 + 115), ar("تصفح أفخم العطور العالمية"), fill=zinc_text, font=font_qr_sub)
    draw.text((t1_x, box1_y1 + 140), ar("طلب فوري والدفع عند الاستلام"), fill=zinc_text, font=font_qr_sub)
    draw.text((t1_x, box1_y1 + 165), ar("فحص وتجربة الرائحة قبل الدفع"), fill=zinc_text, font=font_qr_sub)
    draw.text((t1_x, box1_y1 + 205), "rovy-store.vercel.app", fill=gold_primary, font=font_qr_sub)

    # Box 2: APK Download QR (Right Center)
    box2_x1 = 630
    draw.rounded_rectangle([box2_x1, box1_y1, box2_x1 + box1_w, box1_y1 + box1_h], radius=20, fill=(16, 12, 22), outline=gold_dark, width=1)

    if os.path.exists(apk_qr_path):
        qr2_img = Image.open(apk_qr_path).convert('RGB').resize((190, 190), Image.Resampling.LANCZOS)
        draw.rounded_rectangle([box2_x1 + 25, box1_y1 + 35, box2_x1 + 25 + 190, box1_y1 + 35 + 190], radius=10, fill=(255, 255, 255))
        im.paste(qr2_img, (box2_x1 + 25, box1_y1 + 35))

    # Text inside Box 2 (Correct Shaped Arabic)
    t2_x = box2_x1 + 235
    draw.text((t2_x, box1_y1 + 45), "ANDROID APP (APK)", fill=(80, 220, 140), font=font_sub)
    draw.text((t2_x, box1_y1 + 75), ar("تحميل تطبيق الأندرويد"), fill=gold_bright, font=font_qr_title)
    draw.text((t2_x, box1_y1 + 115), ar("تطبيق أصلي سريع وفوري"), fill=zinc_text, font=font_qr_sub)
    draw.text((t2_x, box1_y1 + 140), ar("إشعارات بأحدث العروض والخصومات"), fill=zinc_text, font=font_qr_sub)
    draw.text((t2_x, box1_y1 + 165), ar("متابعة حالة شحنتك لحظياً"), fill=zinc_text, font=font_qr_sub)
    draw.text((t2_x, box1_y1 + 205), "rovy-store.apk (v1.0.0)", fill=(80, 220, 140), font=font_qr_sub)

    # Bottom Contact Bar
    draw.line([70, 555, width - 70, 555], fill=gold_dark, width=1)
    
    # Contacts items
    cy = 575
    draw.text((75, cy), "Phone & WhatsApp: 01503012856 / 01556718249", fill=gold_bright, font=font_contacts)
    draw.text((615, cy), "Instagram: @rovystore2", fill=gold_bright, font=font_contacts)
    draw.text((855, cy), "Heliopolis — Sheraton / Cairo", fill=zinc_text, font=font_contacts)

    # Secondary Tagline & Correct Heliopolis Address
    addr_line = ar("مصر الجديدة — طريق العروبة ومساكن شيراتون (بالقرب من مطار القاهرة)")
    draw.text((width // 2 - 250, 615), addr_line, fill=gold_primary, font=font_qr_sub)
    draw.text((width // 2 - 220, 640), "Google Maps Verified Location • Delivery Across All Egypt", fill=zinc_dim, font=font_badge)

    # Save to public and to artifact dir
    out_public = os.path.join(base_dir, 'public', 'rovy-store-official-card.png')
    im.save(out_public, 'PNG')
    print(f"Saved: {out_public}")

    # Copy to artifacts directory
    artifact_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"
    out_artifact = os.path.join(artifact_dir, 'rovy-store-official-card.png')
    im.save(out_artifact, 'PNG')
    print(f"Saved to artifact dir: {out_artifact}")

if __name__ == '__main__':
    create_card()
