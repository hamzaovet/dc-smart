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

# Web QR
qr_web = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=1,
)
qr_web.add_data(web_url)
qr_web.make(fit=True)
img_web = qr_web.make_image(fill_color="#080c14", back_color="white")
buf_web = BytesIO()
img_web.save(buf_web, format="PNG")
web_qr_b64 = base64.b64encode(buf_web.getvalue()).decode("ascii")

# APK QR
qr_apk = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=10,
    border=1,
)
qr_apk.add_data(apk_url)
qr_apk.make(fit=True)
img_apk = qr_apk.make_image(fill_color="#080c14", back_color="white")
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
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      width: 1200px;
      margin: 0;
      padding: 24px;
      background: #030508;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      -webkit-font-smoothing: antialiased;
    }}

    .card-container {{
      width: 1150px;
      background: linear-gradient(135deg, #090e1a 0%, #060912 50%, #0c1424 100%);
      border-radius: 32px;
      border: 2px solid rgba(6, 182, 212, 0.45);
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.95), 0 0 35px rgba(6, 182, 212, 0.2);
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      gap: 20px;
      position: relative;
      overflow: hidden;
    }}

    .card-container::before {{
      content: "";
      position: absolute;
      inset: 0;
      background-image: 
        radial-gradient(circle at 10% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 40%),
        radial-gradient(circle at 90% 80%, rgba(37, 99, 235, 0.15) 0%, transparent 45%);
      pointer-events: none;
    }}

    /* Top Bar */
    .top-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      z-index: 10;
    }}

    .badge-vip {{
      background: rgba(6, 182, 212, 0.12);
      border: 1.5px solid rgba(6, 182, 212, 0.5);
      color: #38bdf8;
      font-size: 12px;
      font-weight: 800;
      padding: 6px 16px;
      border-radius: 50px;
      letter-spacing: 1.5px;
      font-family: 'Orbitron', 'Cairo', sans-serif;
      display: flex;
      align-items: center;
      gap: 8px;
    }}

    .badge-dot {{
      width: 8px;
      height: 8px;
      background: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 8px #10b981;
    }}

    .brand-section {{
      display: flex;
      align-items: center;
      gap: 16px;
    }}

    .brand-logo {{
      width: 58px;
      height: 58px;
      border-radius: 16px;
      overflow: hidden;
      border: 2px solid rgba(6, 182, 212, 0.6);
      box-shadow: 0 6px 20px rgba(6, 182, 212, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      background: #050811;
    }}

    .brand-logo img {{
      width: 100%;
      height: 100%;
      object-fit: cover;
    }}

    .brand-text {{
      display: flex;
      flex-direction: column;
      text-align: right;
    }}

    .brand-name {{
      font-size: 26px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.1;
    }}

    .brand-tagline {{
      font-size: 11.5px;
      color: #38bdf8;
      font-weight: 700;
      margin-top: 2px;
    }}

    /* Subtitle Banner */
    .banner-specs {{
      background: rgba(15, 23, 42, 0.7);
      border: 1px solid rgba(6, 182, 212, 0.25);
      border-radius: 14px;
      padding: 9px 18px;
      display: flex;
      align-items: center;
      justify-content: space-around;
      position: relative;
      z-index: 10;
    }}

    .spec-item {{
      display: flex;
      align-items: center;
      gap: 8px;
      color: #e2e8f0;
      font-size: 11.5px;
      font-weight: 700;
    }}

    .spec-item span.icon {{
      color: #06b6d4;
      font-size: 14px;
    }}

    /* QR Grid */
    .qr-grid {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 24px;
      position: relative;
      z-index: 10;
    }}

    .qr-box {{
      background: rgba(11, 18, 33, 0.85);
      border: 1.5px solid rgba(6, 182, 212, 0.3);
      border-radius: 20px;
      padding: 16px;
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      box-shadow: inset 0 0 25px rgba(6, 182, 212, 0.05);
    }}

    .qr-frame {{
      background: #ffffff;
      padding: 10px;
      border-radius: 16px;
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.6);
      margin-bottom: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
    }}

    .qr-frame img {{
      width: 145px;
      height: 145px;
      display: block;
    }}

    .qr-title {{
      font-size: 14px;
      font-weight: 900;
      color: #ffffff;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }}

    .qr-link {{
      font-size: 11px;
      color: #38bdf8;
      font-family: 'Orbitron', monospace;
      font-weight: 700;
      direction: ltr;
    }}

    /* Bottom Information Bar */
    .bottom-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(6, 182, 212, 0.25);
      padding-top: 14px;
      position: relative;
      z-index: 10;
    }}

    .contact-group {{
      display: flex;
      align-items: center;
      gap: 18px;
      color: #f1f5f9;
      font-size: 13px;
      font-weight: 800;
      font-family: monospace;
    }}

    .contact-item {{
      display: flex;
      align-items: center;
      gap: 5px;
    }}

    .contact-item span.lbl {{
      color: #94a3b8;
      font-size: 11px;
      font-weight: 600;
    }}

    .location-info {{
      color: #e2e8f0;
      font-size: 12px;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 5px;
    }}

    /* Developer Watermark with user phone number */
    .developer-watermark {{
      text-align: center;
      font-size: 12px;
      color: #38bdf8;
      font-weight: 800;
      letter-spacing: 0.5px;
      padding-top: 10px;
      border-top: 1px dashed rgba(6, 182, 212, 0.3);
      position: relative;
      z-index: 10;
    }}
  </style>
</head>
<body>
  <div class="card-container">
    <!-- Top Bar -->
    <div class="top-bar">
      <div class="badge-vip">
        <div class="badge-dot"></div>
        <span>SECURITY VERIFIED • VIP 2026</span>
      </div>

      <div class="brand-section">
        <div class="brand-text">
          <div class="brand-name">دي سي سمارت</div>
          <div class="brand-tagline">أنظمة المراقبة والتحكم الذكي — DC SMART CCTV</div>
        </div>
        <div class="brand-logo">
          {f'<img src="data:image/jpeg;base64,{logo_b64}" alt="DC Smart">' if logo_b64 else '<span style="color:#06b6d4;font-size:22px;font-weight:900;">DC</span>'}
        </div>
      </div>
    </div>

    <!-- Specs Banner -->
    <div class="banner-specs">
      <div class="spec-item">
        <span class="icon">📹</span>
        <span>كاميرات HD & IP فائقة الدقة 4K</span>
      </div>
      <div class="spec-item">
        <span class="icon">🌙</span>
        <span>رؤية ليلية ملونة Full Color</span>
      </div>
      <div class="spec-item">
        <span class="icon">🛡️</span>
        <span>ضمان عامين شامل واستبدال فوري</span>
      </div>
      <div class="spec-item">
        <span class="icon">📱</span>
        <span>متابعة حية وإشعارات على الهاتف</span>
      </div>
    </div>

    <!-- Dual QR Codes -->
    <div class="qr-grid">
      <!-- Web QR -->
      <div class="qr-box">
        <div class="qr-frame">
          <img src="data:image/png;base64,{web_qr_b64}" alt="DC Smart Website">
        </div>
        <div class="qr-title">
          <span>🌐</span>
          <span>زيارة الموقع والكتالوج الإلكتروني</span>
        </div>
        <div class="qr-link">dc-smart.vercel.app</div>
      </div>

      <!-- App QR -->
      <div class="qr-box">
        <div class="qr-frame">
          <img src="data:image/png;base64,{apk_qr_b64}" alt="Download Android App">
        </div>
        <div class="qr-title">
          <span>📲</span>
          <span>تحميل تطبيق الأندرويد الرسمي</span>
        </div>
        <div class="qr-link">dcsmart.apk (v1.0.0)</div>
      </div>
    </div>

    <!-- Bottom Bar -->
    <div class="bottom-bar">
      <div class="contact-group">
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

      <div class="location-info">
        <span>📍 طنطا — محافظة الغربية — جمهورية مصر العربية</span>
      </div>
    </div>

    <!-- Developer Credit with User Phone -->
    <div class="developer-watermark">
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
        "--window-size=1200,780",
        f"--screenshot={out_png}",
        f"file:///{html_path.replace(os.sep, '/')}",
    ]
    res = subprocess.run(cmd, capture_output=True, text=True)
    if os.path.exists(out_png):
        shutil.copy(out_png, artifact_png)
        print("Successfully generated VIP card at:", out_png)
        print("Copied to artifact dir:", artifact_png)
