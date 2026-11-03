import os
import base64
import subprocess
import qrcode
from io import BytesIO
from PIL import Image

base_dir = r"D:\Work\minipick"
public_dir = os.path.join(base_dir, "public")
artifact_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"

# 1. Generate QR codes
web_url = "https://minipick-mmax.vercel.app"
apk_url = "https://minipick-mmax.vercel.app/api/download/apk"

qr_web = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=1,
)
qr_web.add_data(web_url)
qr_web.make(fit=True)
img_web = qr_web.make_image(fill_color="#180e1c", back_color="white")
buf_web = BytesIO()
img_web.save(buf_web, format="PNG")
web_qr_b64 = base64.b64encode(buf_web.getvalue()).decode("ascii")

qr_apk = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=1,
)
qr_apk.add_data(apk_url)
qr_apk.make(fit=True)
img_apk = qr_apk.make_image(fill_color="#180e1c", back_color="white")
buf_apk = BytesIO()
img_apk.save(buf_apk, format="PNG")
apk_qr_b64 = base64.b64encode(buf_apk.getvalue()).decode("ascii")

img_web.save(os.path.join(public_dir, "minipick-web-qr.png"))
img_apk.save(os.path.join(public_dir, "minipick-apk-qr.png"))
print("Generated QR codes successfully.")

# 2. HTML Template with Pink & White & Rose Gold Aesthetics
html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Quicksand:wght@600;700&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      width: 1200px;
      margin: 0;
      padding: 30px;
      background: #09050d;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }}
    .card {{
      position: relative;
      width: 1140px;
      height: 700px;
      border-radius: 36px;
      background: radial-gradient(circle at 12% 15%, rgba(236, 72, 153, 0.22) 0%, transparent 45%),
                  radial-gradient(circle at 88% 85%, rgba(244, 63, 94, 0.16) 0%, transparent 50%),
                  linear-gradient(145deg, #1d1024 0%, #110916 50%, #070409 100%);
      border: 2.5px solid rgba(244, 114, 182, 0.45);
      box-shadow: 0 0 70px rgba(236, 72, 153, 0.25),
                  0 30px 60px -15px rgba(0, 0, 0, 0.98),
                  inset 0 1px 2px rgba(254, 226, 226, 0.35);
      padding: 38px 46px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }}
    
    .card::before {{
      content: "";
      position: absolute;
      inset: 12px;
      border-radius: 26px;
      border: 1px solid rgba(244, 114, 182, 0.22);
      pointer-events: none;
    }}

    .glow-top {{
      position: absolute;
      top: -100px;
      right: -100px;
      width: 320px;
      height: 320px;
      background: rgba(236, 72, 153, 0.18);
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }}
    .glow-bottom {{
      position: absolute;
      bottom: -100px;
      left: -100px;
      width: 320px;
      height: 320px;
      background: rgba(244, 63, 94, 0.15);
      border-radius: 50%;
      filter: blur(80px);
      pointer-events: none;
    }}

    /* Top Bar */
    .top-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(244, 114, 182, 0.25);
      padding-bottom: 22px;
      position: relative;
      z-index: 2;
    }}
    .brand-section {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}
    .logo-badge {{
      width: 68px;
      height: 68px;
      border-radius: 20px;
      background: linear-gradient(135deg, #fce7f3 0%, #ec4899 50%, #be185d 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px -5px rgba(236, 72, 153, 0.45), inset 0 2px 4px rgba(255, 255, 255, 0.8);
      border: 2px solid rgba(255, 255, 255, 0.5);
      flex-shrink: 0;
    }}
    .logo-letter {{
      font-family: 'Cairo', sans-serif;
      font-size: 30px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -1px;
    }}
    .brand-text h1 {{
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #fce7f3 40%, #f472b6 80%, #db2777 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 3px;
      line-height: 1.2;
    }}
    .brand-text p {{
      font-size: 13.5px;
      font-weight: 700;
      color: #f472b6;
      letter-spacing: 0.5px;
    }}
    .vip-pill {{
      padding: 8px 22px;
      border-radius: 9999px;
      background: rgba(236, 72, 153, 0.12);
      border: 1.5px solid rgba(244, 114, 182, 0.45);
      color: #fce7f3;
      font-family: 'Quicksand', sans-serif;
      font-size: 13px;
      font-weight: 800;
      letter-spacing: 2px;
      box-shadow: 0 0 20px rgba(236, 72, 153, 0.22);
    }}

    /* Dual QR Section */
    .qr-container {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin: 18px 0;
      position: relative;
      z-index: 2;
    }}
    .qr-box {{
      background: rgba(18, 11, 23, 0.75);
      border: 1.5px solid rgba(244, 114, 182, 0.28);
      border-radius: 24px;
      padding: 24px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.08);
      backdrop-filter: blur(10px);
    }}
    .qr-white-card {{
      background: #ffffff;
      padding: 10px;
      border-radius: 18px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
      display: inline-block;
      margin-bottom: 14px;
      border: 3px solid #fbcfe8;
    }}
    .qr-white-card img {{
      width: 155px;
      height: 155px;
      display: block;
      image-rendering: pixelated;
    }}
    .qr-badge-pink {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: #f472b6;
      font-size: 15.5px;
      font-weight: 800;
      margin-bottom: 4px;
    }}
    .qr-badge-emerald {{
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      color: #34d399;
      font-size: 15.5px;
      font-weight: 800;
      margin-bottom: 4px;
    }}
    .qr-link {{
      font-family: 'Courier New', Courier, monospace;
      font-size: 13px;
      color: #d4d4d8;
      direction: ltr;
      display: block;
      font-weight: 600;
    }}

    /* Bottom Contacts Bar */
    .bottom-bar {{
      display: grid;
      grid-template-columns: 1.15fr 0.9fr 1.35fr;
      align-items: center;
      border-top: 1px solid rgba(244, 114, 182, 0.25);
      padding-top: 20px;
      position: relative;
      z-index: 2;
    }}
    .contact-item {{
      display: flex;
      align-items: center;
      gap: 12px;
    }}
    .icon-circle {{
      width: 40px;
      height: 40px;
      border-radius: 14px;
      background: rgba(236, 72, 153, 0.15);
      border: 1px solid rgba(244, 114, 182, 0.4);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f472b6;
      flex-shrink: 0;
    }}
    .phone-text strong {{
      font-size: 16px;
      color: #ffffff;
      font-family: 'Courier New', Courier, monospace;
      font-weight: 900;
      letter-spacing: 0.5px;
      display: block;
      line-height: 1.2;
    }}
    .phone-text span {{
      font-size: 12px;
      color: #fbcfe8;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
    }}
    .social-text {{
      font-size: 14px;
      color: #ffffff;
      font-weight: 800;
      direction: ltr;
      text-align: right;
    }}
    .loc-text strong {{
      font-size: 13.5px;
      color: #ffffff;
      font-weight: 800;
      display: block;
      line-height: 1.3;
    }}
    .loc-text span {{
      font-size: 11px;
      color: #34d399;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
      margin-top: 2px;
    }}
  </style>
</head>
<body>
  <div class="card">
    <div class="glow-top"></div>
    <div class="glow-bottom"></div>

    <!-- Top Header -->
    <div class="top-bar">
      <div class="brand-section">
        <div class="logo-badge">
          <span class="logo-letter">MP</span>
        </div>
        <div class="brand-text">
          <h1>ميني بيك</h1>
          <p>بوتيك الهدايا ومكعبات النانو والترندات اللطيفة</p>
        </div>
      </div>
      <div class="vip-pill">
        VIP PRIVILEGE
      </div>
    </div>

    <!-- Dual QR Codes -->
    <div class="qr-container">
      <!-- Web QR (Right in RTL) -->
      <div class="qr-box">
        <div class="qr-white-card">
          <img src="data:image/png;base64,{web_qr_b64}" alt="Website QR" />
        </div>
        <div>
          <span class="qr-badge-pink">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            كود زيارة المتجر الإلكتروني
          </span>
          <span class="qr-link">minipick.vercel.app</span>
        </div>
      </div>

      <!-- APK QR (Left in RTL) -->
      <div class="qr-box">
        <div class="qr-white-card">
          <img src="data:image/png;base64,{apk_qr_b64}" alt="APK QR" />
        </div>
        <div>
          <span class="qr-badge-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            كود تحميل تطبيق الأندرويد
          </span>
          <span class="qr-link">minipick.apk (v1.0.0)</span>
        </div>
      </div>
    </div>

    <!-- Bottom Contacts Bar -->
    <div class="bottom-bar">
      <!-- Phone & WhatsApp -->
      <div class="contact-item">
        <div class="icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="phone-text">
          <strong>01050757837</strong>
          <span>واتس وأوردرات: 01069819381</span>
        </div>
      </div>

      <!-- Socials -->
      <div class="contact-item" style="justify-content: center;">
        <div class="icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <div class="social-text">
          @minipick.eg
        </div>
      </div>

      <!-- Location Tanta (Full & Unclipped) -->
      <div class="contact-item">
        <div class="icon-circle">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div class="loc-text">
          <strong>طنطا — محافظة الغربية</strong>
          <span>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            شحن سريع لكافة محافظات مصر 📍 Google Maps
          </span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>
"""

template_path = os.path.join(base_dir, "scripts", "card_template.html")
with open(template_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print(f"Written template: {template_path}")

# Render into generous canvas so viewport NEVER truncates
raw_png = os.path.join(base_dir, "scripts", "raw_render.png")
file_url = "file:///" + template_path.replace("\\", "/")

chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1400,1050",
    "--force-device-scale-factor=2",
    f"--screenshot={raw_png}",
    file_url,
]

print("Rendering with Google Chrome in generous canvas...")
res = subprocess.run(chrome_cmd, capture_output=True, text=True)
print("Chrome exit code:", res.returncode)

# Detect exact card bounding box and crop with 40px symmetrical margin
im = Image.open(raw_png)
w, h = im.size
pixels = im.load()

# Search borders from center lines
top_b = None
for y in range(h):
    r, g, b = pixels[w // 2, y][:3]
    if r > 100 and g > 40 and b > 70: # Pink border detection
        top_b = y
        break

bottom_b = None
for y in range(h - 1, 0, -1):
    r, g, b = pixels[w // 2, y][:3]
    if r > 100 and g > 40 and b > 70:
        bottom_b = y
        break

left_b = None
for x in range(w):
    r, g, b = pixels[x, h // 2][:3]
    if r > 100 and g > 40 and b > 70:
        left_b = x
        break

right_b = None
for x in range(w - 1, 0, -1):
    r, g, b = pixels[x, h // 2][:3]
    if r > 100 and g > 40 and b > 70:
        right_b = x
        break

print(f"Detected exact borders: top={top_b}, bottom={bottom_b}, left={left_b}, right={right_b}")

# Fallback safety if detection threshold differs
if top_b is None or bottom_b is None or left_b is None or right_b is None:
    print("Fallback to standard dimensions")
    top_b = 60
    bottom_b = 1459
    left_b = 438
    right_b = 2717

pad = 40
crop_box = (
    max(0, left_b - pad),
    max(0, top_b - pad),
    min(w, right_b + pad),
    min(h, bottom_b + pad),
)

final_card = im.crop(crop_box)
out_png = os.path.join(public_dir, "minipick-official-card.png")
final_card.save(out_png)
print(f"Saved final cropped card: {out_png}, Size: {final_card.size}")

# Copy to artifacts directory
artifact_card = os.path.join(artifact_dir, "minipick-official-card.png")
final_card.save(artifact_card)
print(f"Copied to artifacts: {artifact_card}")
