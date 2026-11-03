import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

with open('d:/Work/minipick/scripts/all_minipick_products.json', 'r', encoding='utf-8') as f:
    products = json.load(f)['products']

for p in products:
    t = p['title'].lower()
    if any(w in t for w in ['box', 'gift', 'printer', 'blind', 'bag', 'set', 'pink', 'organizer', 'holder', 'brush', 'case', 'mirror']):
        img = p['images'][0]['src'] if p['images'] else 'NO IMG'
        print(f"{p['title']} => {img}")
