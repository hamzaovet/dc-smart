import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open("d:/Work/minipick/scripts/all_minipick_products.json", "r", encoding="utf-8") as f:
    data = json.load(f)

products = data.get("products", [])

def search(keywords):
    matches = []
    for p in products:
        title = (p.get("title") or "").lower()
        handle = (p.get("handle") or "").lower()
        if any(k.lower() in title or k.lower() in handle for k in keywords):
            images = [img["src"] for img in p.get("images", [])]
            matches.append({
                "title": p.get("title"),
                "handle": p.get("handle"),
                "images": images
            })
    return matches

print("=== BEDAZZLE / PEN / CRYSTAL ===")
for m in search(["bedazzl", "rhinestone", "diamond", "crystal"])[:10]:
    print(f"- {m['title']}: {m['images'][:2]}")

print("\n=== ORGANIZER / BOX / HOLDER ===")
for m in search(["organizer", "holder", "box", "drawer", "brush"])[:10]:
    print(f"- {m['title']}: {m['images'][:2]}")

print("\n=== STICKER / 3D ===")
for m in search(["sticker", "3d", "kuromi", "melody"])[:10]:
    print(f"- {m['title']}: {m['images'][:2]}")

print("\n=== COLORING / BOOK / MARKER ===")
for m in search(["coloring", "colouring", "marker", "book", "art"])[:10]:
    print(f"- {m['title']}: {m['images'][:2]}")

print("\n=== BLIND / PRINTER / GIFT ===")
for m in search(["blind", "printer", "gift", "box", "surprise"])[:10]:
    print(f"- {m['title']}: {m['images'][:2]}")
