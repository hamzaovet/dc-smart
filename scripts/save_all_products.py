import json

with open("d:/Work/minipick/scripts/all_minipick_products.json", "w", encoding="utf-8") as out:
    import urllib.request
    url = "https://minipick.co/products.json?limit=250"
    headers = {"User-Agent": "Mozilla/5.0"}
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        json.dump(data, out, ensure_ascii=False, indent=2)

print("Saved all products to all_minipick_products.json")
