import os
import base64
import subprocess
import shutil
import qrcode
from io import BytesIO
from PIL import Image

base_dir = r"D:\Work\dc-smart"
public_dir = os.path.join(base_dir, "public")
artifact_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"

os.makedirs(public_dir, exist_ok=True)
os.makedirs(artifact_dir, exist_ok=True)

web_url = "https://dc-smart.vercel.app"
apk_url = "https://dc-smart.vercel.app/api/download/apk"

# Web QR - high contrast crisp
qr_web = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=1,
)
qr_web.add_data(web_url)
qr_web.make(fit=True)
img_web = qr_web.make_image(fill_color="#060912", back_color="#ffffff")
buf_web = BytesIO()
img_web.save(buf_web, format="PNG")
web_qr_b64 = base64.b64encode(buf_web.getvalue()).decode("ascii")

# APK QR - high contrast crisp
qr_apk = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=12,
    border=1,
)
qr_apk.add_data(apk_url)
qr_apk.make(fit=True)
img_apk = qr_apk.make_image(fill_color="#060912", back_color="#ffffff")
buf_apk = BytesIO()
img_apk.save(buf_apk, format="PNG")
apk_qr_b64 = base64.b64encode(buf_apk.getvalue()).decode("ascii")

img_web.save(os.path.join(public_dir, "dcsmart-web-qr.png"))
img_apk.save(os.path.join(public_dir, "dcsmart-apk-qr.png"))

# Read DC Smart Logo
logo_path = os.path.join(public_dir, "logo.jpg")
logo_b64 = ""
if os.path.exists(logo_path):
    with open(logo_path, "rb") as f:
        logo_b64 = base64.b64encode(f.read()).decode("ascii")

html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Orbitron:wght@700;900&family=JetBrains+Mono:wght@700&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    html, body {{
      width: 1080px;
      height: 620px;
      margin: 0;
      padding: 0;
      background: #050811;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      overflow: hidden;
      -webkit-font-smoothing: antialiased;
    }}

    .card-container {{
      width: 1080px;
      height: 620px;
      background: radial-gradient(circle at 85% 15%, rgba(6, 182, 212, 0.18) 0%, transparent 45%),
                  radial-gradient(circle at 15% 85%, rgba(37, 99, 235, 0.16) 0%, transparent 45%),
                  linear-gradient(135deg, #090e1a 0%, #060912 55%, #0a1122 100%);
      border: 2px solid rgba(6, 182, 212, 0.55);
      border-radius: 28px;
      padding: 26px 36px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      position: relative;
      overflow: hidden;
      box-shadow: inset 0 0 40px rgba(6, 182, 212, 0.12);
    }}

    /* Futuristic Circuit Grid Background Effect */
    .card-container::before {{
      content: "";
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 1px 1px, rgba(6, 182, 212, 0.12) 1px, transparent 0);
      background-size: 28px 28px;
      pointer-events: none;
      opacity: 0.6;
    }}

    /* Glow Corner Accents */
    .corner-accent {{
      position: absolute;
      width: 14px;
      height: 14px;
      border: 3px solid #06b6d4;
      pointer-events: none;
    }}
    .corner-tl {{ top: 12px; right: 12px; border-left: none; border-bottom: none; border-top-right-radius: 12px; }}
    .corner-tr {{ top: 12px; left: 12px; border-right: none; border-bottom: none; border-top-left-radius: 12px; }}
    .corner-bl {{ bottom: 12px; right: 12px; border-left: none; border-top: none; border-bottom-right-radius: 12px; }}
    .corner-br {{ bottom: 12px; left: 12px; border-right: none; border-top: none; border-bottom-left-radius: 12px; }}

    /* Header Bar */
    .header {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: relative;
      z-index: 2;
    }}
    .brand-wrap {{
      display: flex;
      align-items: center;
      gap: 16px;
    }}
    .brand-logo {{
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: linear-gradient(135deg, #06b6d4, #2563eb);
      padding: 2px;
      box-shadow: 0 0 20px rgba(6, 182, 212, 0.4);
    }}
    .brand-logo img {{
      width: 100%;
      height: 100%;
      border-radius: 14px;
      object-fit: cover;
      display: block;
    }}
    .brand-text h1 {{
      font-size: 27px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: -0.5px;
      line-height: 1.2;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.7);
    }}
    .brand-text p {{
      font-size: 13.5px;
      font-weight: 700;
      color: #38bdf8;
      font-family: 'Cairo', sans-serif;
      margin-top: 2px;
    }}
    .badge-vip {{
      background: rgba(6, 182, 212, 0.12);
      border: 1.5px solid rgba(6, 182, 212, 0.65);
      border-radius: 50px;
      padding: 7px 18px;
      display: flex;
      align-items: center;
      gap: 8px;
      box-shadow: 0 0 16px rgba(6, 182, 212, 0.25);
    }}
    .badge-dot {{
      width: 9px;
      height: 9px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 10px #10b981;
    }}
    .badge-vip span {{
      font-family: 'Orbitron', sans-serif;
      font-size: 11.5px;
      font-weight: 900;
      color: #a5f3fc;
      letter-spacing: 1.5px;
    }}

    /* Features Strip */
    .features-strip {{
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 10px;
      background: rgba(11, 19, 36, 0.85);
      border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: 16px;
      padding: 8px 14px;
      position: relative;
      z-index: 2;
    }}
    .feature-item {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 7px;
      font-size: 11.5px;
      font-weight: 700;
      color: #e2e8f0;
      white-space: nowrap;
    }}

    /* QR Cards Grid - Symmetric & Full Width */
    .qr-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 22px;
      position: relative;
      z-index: 2;
    }}
    .qr-card {{
      background: linear-gradient(135deg, rgba(15, 23, 42, 0.85), rgba(8, 14, 26, 0.95));
      border: 1.5px solid rgba(6, 182, 212, 0.4);
      border-radius: 20px;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 20px;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(6, 182, 212, 0.08);
    }}
    .qr-img-box {{
      width: 140px;
      height: 140px;
      background: #ffffff;
      border-radius: 14px;
      padding: 6px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5);
      flex-shrink: 0;
    }}
    .qr-img-box img {{
      width: 100%;
      height: 100%;
      object-fit: contain;
      display: block;
    }}
    .qr-info {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}
    .qr-info .pill {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      background: rgba(6, 182, 212, 0.18);
      border: 1px solid rgba(6, 182, 212, 0.45);
      color: #38bdf8;
      font-size: 10.5px;
      font-weight: 800;
      padding: 3px 10px;
      border-radius: 20px;
      width: fit-content;
    }}
    .qr-info h3 {{
      font-size: 16px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.3;
    }}
    .qr-info p {{
      font-size: 11px;
      color: #94a3b8;
      font-family: 'JetBrains Mono', monospace;
      direction: ltr;
      text-align: right;
    }}

    /* Footer Info & Contacts */
    .footer {{
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: rgba(11, 19, 36, 0.9);
      border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: 14px;
      padding: 10px 18px;
      font-size: 12px;
      position: relative;
      z-index: 2;
    }}
    .contacts-row {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}
    .contact-item {{
      display: flex;
      align-items: center;
      gap: 6px;
      color: #ffffff;
      font-family: 'JetBrains Mono', sans-serif;
      font-weight: 700;
      font-size: 12px;
    }}
    .contact-item .lbl {{
      color: #38bdf8;
      font-family: 'Cairo', sans-serif;
      font-weight: 700;
    }}
    .location-box {{
      color: #cbd5e1;
      font-weight: 600;
      font-size: 11.5px;
    }}

    /* Developer Watermark */
    .watermark {{
      text-align: center;
      font-size: 11px;
      font-weight: 700;
      color: #38bdf8;
      font-family: 'Cairo', sans-serif;
      letter-spacing: 0.3px;
      position: relative;
      z-index: 2;
    }}
  </style>
</head>
<body>
  <div class="card-container">
    <div class="corner-accent corner-tl"></div>
    <div class="corner-accent corner-tr"></div>
    <div class="corner-accent corner-bl"></div>
    <div class="corner-accent corner-br"></div>

    <!-- Header -->
    <div class="header">
      <div class="brand-wrap">
        <div class="brand-logo">
          <img src="data:image/jpeg;base64,{logo_b64}" alt="DC Smart Logo">
        </div>
        <div class="brand-text">
          <h1>دي سي سمارت</h1>
          <p>أنظمة المراقبة والتحكم الذكي — DC SMART CCTV</p>
        </div>
      </div>
      <div class="badge-vip">
        <div class="badge-dot"></div>
        <span>SECURITY VERIFIED • VIP 2026</span>
      </div>
    </div>

    <!-- Features Strip -->
    <div class="features-strip">
      <div class="feature-item">
        <span>📹</span>
        <span>كاميرات HD & IP فائقة الدقة 4K</span>
      </div>
      <div class="feature-item">
        <span>🌙</span>
        <span>رؤية ليلية ملونة Full Color</span>
      </div>
      <div class="feature-item">
        <span>🛡️</span>
        <span>ضمان عامين شامل واستبدال فوري</span>
      </div>
      <div class="feature-item">
        <span>📱</span>
        <span>متابعة حية وإشعارات على الهاتف</span>
      </div>
    </div>

    <!-- Dual QR Codes -->
    <div class="qr-grid">
      <!-- Website QR -->
      <div class="qr-card">
        <div class="qr-img-box">
          <img src="data:image/png;base64,{web_qr_b64}" alt="Website QR">
        </div>
        <div class="qr-info">
          <span class="pill">🌐 الكتالوج الإلكتروني</span>
          <h3>المتجر والعروض الحية</h3>
          <p>dc-smart.vercel.app</p>
        </div>
      </div>

      <!-- App QR -->
      <div class="qr-card">
        <div class="qr-img-box">
          <img src="data:image/png;base64,{apk_qr_b64}" alt="APK Download QR">
        </div>
        <div class="qr-info">
          <span class="pill">📲 التطبيق الذكي</span>
          <h3>تحميل تطبيق الأندرويد</h3>
          <p>dcsmart.apk (v1.0.0)</p>
        </div>
      </div>
    </div>

    <!-- Contacts & Location -->
    <div class="footer">
      <div class="contacts-row">
        <div class="contact-item">
          <span class="lbl">مبيعات:</span>
          <span>01008657085</span>
        </div>
        <div class="contact-item">
          <span class="lbl">دعم وواتس:</span>
          <span>01281248731</span>
        </div>
        <div class="contact-item">
          <span class="lbl">إدارة:</span>
          <span>01007302685</span>
        </div>
      </div>
      <div class="location-box">
        <span>📍 طنطا — محافظة الغربية — جمهورية مصر العربية</span>
      </div>
    </div>

    <!-- Developer Watermark -->
    <div class="watermark">
      تم التطوير بواسطة شركة أوركا لتقنية المعلومات — 01018671000
    </div>
  </div>
</body>
</html>
"""

html_path = os.path.join(base_dir, "scripts", "dcsmart_card.html")
with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

chrome_paths = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe",
    r"C:\Users\Dr Princa\AppData\Local\Google\Chrome\Application\chrome.exe",
]
chrome_bin = next((p for p in chrome_paths if os.path.exists(p)), None)

out_png = os.path.join(public_dir, "dcsmart-official-card.png")
artifact_png = os.path.join(artifact_dir, "dcsmart-official-card.png")

if chrome_bin:
    cmd = [
        chrome_bin,
        "--headless=new",
        "--disable-gpu",
        "--hide-scrollbars",
        "--window-size=1080,620",
        "--device-scale-factor=2",
        f"--screenshot={out_png}",
        f"file:///{html_path.replace(os.sep, '/')}",
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_png):
        shutil.copy(out_png, artifact_png)
        print("Successfully generated VIP card at:", out_png)
        print("Copied to artifact dir:", artifact_png)
else:
    print("Chrome not found!")
