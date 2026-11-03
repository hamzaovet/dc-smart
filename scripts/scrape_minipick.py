import urllib.request
import re
import json

url = "https://minipick.co/"
headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Fetched {len(html)} bytes")
        
        # Check if Shopify
        is_shopify = "shopify" in html.lower()
        print(f"Is Shopify: {is_shopify}")
        
        # Check products.json if shopify
        # Find all image links
        img_urls = set(re.findall(r'https?://[^\s"\'<>]+\.(?:jpg|jpeg|png|webp)', html))
        print(f"Found {len(img_urls)} images:")
        for img in sorted(list(img_urls))[:25]:
            print(img)
except Exception as e:
    print(f"Error: {e}")
