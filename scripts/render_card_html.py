import os
import base64
import subprocess

base_dir = r"D:\Work\rovy-store"

# Read QR codes as base64
with open(os.path.join(base_dir, "public", "rovy-store-web-qr.png"), "rb") as f:
    web_qr_b64 = base64.b64encode(f.read()).decode("ascii")

with open(os.path.join(base_dir, "public", "rovy-store-apk-qr.png"), "rb") as f:
    apk_qr_b64 = base64.b64encode(f.read()).decode("ascii")

html_content = f"""<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Cinzel:wght@600;700;900&display=swap" rel="stylesheet">
  <style>
    * {{
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }}
    body {{
      width: 1300px;
      height: 760px;
      margin: 0;
      padding: 40px;
      background: #040307;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
    }}
    .card {{
      position: relative;
      width: 1220px;
      height: 680px;
      border-radius: 36px;
      background: radial-gradient(circle at 10% 20%, rgba(217, 119, 6, 0.12) 0%, transparent 40%),
                  radial-gradient(circle at 90% 80%, rgba(245, 158, 11, 0.08) 0%, transparent 45%),
                  linear-gradient(135deg, #130f1e 0%, #0a0711 50%, #050408 100%);
      border: 2px solid rgba(245, 158, 11, 0.35);
      box-shadow: 0 0 60px rgba(245, 158, 11, 0.15),
                  0 25px 50px -12px rgba(0, 0, 0, 0.95),
                  inset 0 1px 2px rgba(254, 243, 199, 0.25);
      padding: 42px 48px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      overflow: hidden;
    }}
    
    /* Decorative inner frame */
    .card::before {{
      content: "";
      position: absolute;
      inset: 12px;
      border-radius: 26px;
      border: 1px solid rgba(245, 158, 11, 0.15);
      pointer-events: none;
    }}

    /* Top Bar */
    .top-bar {{
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(245, 158, 11, 0.2);
      padding-bottom: 24px;
      position: relative;
      z-index: 2;
    }}
    .brand-section {{
      display: flex;
      align-items: center;
      gap: 20px;
    }}
    .logo-badge {{
      width: 72px;
      height: 72px;
      border-radius: 22px;
      background: linear-gradient(135deg, #fef3c7 0%, #f59e0b 50%, #b45309 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.4), inset 0 2px 4px rgba(255, 255, 255, 0.6);
      border: 2px solid rgba(255, 255, 255, 0.4);
    }}
    .logo-letter {{
      font-family: 'Cinzel', serif;
      font-size: 40px;
      font-weight: 900;
      color: #0c0814;
    }}
    .brand-text h1 {{
      font-size: 34px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(135deg, #ffffff 0%, #fef3c7 40%, #f59e0b 80%, #d97706 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }}
    .brand-text p {{
      font-size: 14px;
      font-weight: 700;
      color: #fbbf24;
      letter-spacing: 0.5px;
    }}
    .vip-pill {{
      padding: 8px 20px;
      border-radius: 9999px;
      background: rgba(245, 158, 11, 0.12);
      border: 1.5px solid rgba(245, 158, 11, 0.4);
      color: #fde68a;
      font-family: 'Cinzel', sans-serif;
      font-size: 13px;
      font-weight: 900;
      letter-spacing: 2px;
      box-shadow: 0 0 15px rgba(245, 158, 11, 0.15);
    }}

    /* Dual QR Section */
    .qr-container {{
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 32px;
      margin: 24px 0;
      position: relative;
      z-index: 2;
    }}
    .qr-box {{
      background: rgba(9, 6, 15, 0.75);
      border: 1.5px solid rgba(245, 158, 11, 0.22);
      border-radius: 24px;
      padding: 24px 28px;
      display: flex;
      align-items: center;
      gap: 24px;
      box-shadow: 0 15px 35px -5px rgba(0, 0, 0, 0.6), inset 0 1px 1px rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(8px);
    }}
    .qr-white-card {{
      background: #ffffff;
      padding: 10px;
      border-radius: 18px;
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.5);
      flex-shrink: 0;
      display: flex;
    }}
    .qr-white-card img {{
      width: 142px;
      height: 142px;
      display: block;
      image-rendering: pixelated;
    }}
    .qr-info {{
      display: flex;
      flex-direction: column;
      gap: 6px;
    }}
    .qr-badge-amber {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #fbbf24;
      font-size: 15px;
      font-weight: 800;
    }}
    .qr-badge-emerald {{
      display: inline-flex;
      align-items: center;
      gap: 6px;
      color: #34d399;
      font-size: 15px;
      font-weight: 800;
    }}
    .qr-desc {{
      font-size: 12px;
      color: #a1a1aa;
      line-height: 1.4;
    }}
    .qr-link {{
      font-family: monospace;
      font-size: 12px;
      color: #71717a;
      direction: ltr;
      text-align: right;
      margin-top: 4px;
    }}

    /* Bottom Contacts Bar */
    .bottom-bar {{
      display: grid;
      grid-template-columns: 1.1fr 0.8fr 1.3fr;
      align-items: center;
      border-top: 1px solid rgba(245, 158, 11, 0.2);
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
      width: 36px;
      height: 36px;
      border-radius: 12px;
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #f59e0b;
      flex-shrink: 0;
    }}
    .phone-text strong {{
      font-size: 15px;
      color: #f4f4f5;
      font-family: monospace;
      font-weight: 900;
      letter-spacing: 0.5px;
      display: block;
    }}
    .phone-text span {{
      font-size: 11px;
      color: #a1a1aa;
      font-family: monospace;
    }}
    .insta-text {{
      font-size: 14px;
      color: #f4f4f5;
      font-weight: 700;
      direction: ltr;
      text-align: right;
    }}
    .loc-text strong {{
      font-size: 12.5px;
      color: #f4f4f5;
      font-weight: 800;
      display: block;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 320px;
    }}
    .loc-text span {{
      font-size: 10.5px;
      color: #34d399;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 4px;
    }}
  </style>
</head>
<body>
  <div class="card">
    <!-- Top Header -->
    <div class="top-bar">
      <div class="brand-section">
        <div class="logo-badge">
          <span class="logo-letter">R</span>
        </div>
        <div class="brand-text">
          <h1>روفي ستور</h1>
          <p>بوتيك العطور الفاخرة والبدائل الملكية</p>
        </div>
      </div>
      <div class="vip-pill">
        VIP PRIVILEGE
      </div>
    </div>

    <!-- Dual QR Codes -->
    <div class="qr-container">
      <!-- Web QR -->
      <div class="qr-box">
        <div class="qr-white-card">
          <img src="data:image/png;base64,{web_qr_b64}" alt="Website QR" />
        </div>
        <div class="qr-info">
          <span class="qr-badge-amber">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
            كود زيارة الموقع الإلكتروني
          </span>
          <p class="qr-desc">تصفح الكتالوج الكامل والشراء الفوري أونلاين بضغطة زر مع ضمان التجربة قبل الدفع.</p>
          <span class="qr-link">rovy-store.vercel.app</span>
        </div>
      </div>

      <!-- APK QR -->
      <div class="qr-box">
        <div class="qr-white-card">
          <img src="data:image/png;base64,{apk_qr_b64}" alt="APK QR" />
        </div>
        <div class="qr-info">
          <span class="qr-badge-emerald">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
            كود تحميل تطبيق الأندرويد
          </span>
          <p class="qr-desc">تحميل تطبيق الأندرويد الرسمي المباشر للحصول على إشعارات فورية وتتبع شحنتك لحظياً.</p>
          <span class="qr-link">rovy-store.apk (v1.0.0)</span>
        </div>
      </div>
    </div>

    <!-- Bottom Contacts Bar -->
    <div class="bottom-bar">
      <!-- Phone & WhatsApp -->
      <div class="contact-item">
        <div class="icon-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        </div>
        <div class="phone-text">
          <strong>01503012856</strong>
          <span>واتس وأوردرات: 01556718249</span>
        </div>
      </div>

      <!-- Instagram -->
      <div class="contact-item">
        <div class="icon-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
        </div>
        <div class="insta-text">
          @rovystore2
        </div>
      </div>

      <!-- Location Heliopolis -->
      <div class="contact-item">
        <div class="icon-circle">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        </div>
        <div class="loc-text">
          <strong>مصر الجديدة — طريق العروبة ومساكن شيراتون</strong>
          <span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polygon points="3 11 22 2 13 21 11 13 3 11"></polygon></svg>
            موقع معتمد على Google Maps
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

# Run Chrome to render screenshot at 2x resolution
out_img = os.path.join(base_dir, "public", "rovy-store-official-card.png")
chrome_cmd = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--window-size=1300,760",
    "--force-device-scale-factor=2",
    f"--screenshot={out_img}",
    f"file:///{template_path.replace(os.sep, '/')}"
]

print("Rendering with Google Chrome...")
res = subprocess.run(chrome_cmd, capture_output=True, text=True)
print("Chrome returncode:", res.returncode)
print("Rendered:", out_img)

# Copy to artifacts directory
artifact_dir = r"C:\Users\Dr Princa\.gemini\antigravity\brain\2d9d53fe-6b03-4ac8-8878-725378cea44d"
out_artifact = os.path.join(artifact_dir, "rovy-store-official-card.png")

with open(out_img, "rb") as fin:
    with open(out_artifact, "wb") as fout:
        fout.write(fin.read())

print("Copied to artifact dir:", out_artifact)
