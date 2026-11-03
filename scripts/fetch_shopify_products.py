import urllib.request
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

url = "https://minipick.co/products.json?limit=250"
headers = {"User-Agent": "Mozilla/5.0"}

try:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        products = data.get("products", [])
        print(f"Total products on minipick.co: {len(products)}")
        for p in products:
            title = p.get("title")
            handle = p.get("handle")
            images = [img.get("src") for img in p.get("images", [])]
            print(f"- {title} ({handle}) : {len(images)} images")
            if images:
                print(f"  Primary: {images[0]}")
except Exception as e:
    print(f"Error fetching products.json: {e}")
