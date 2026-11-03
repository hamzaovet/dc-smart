import urllib.request
import os

os.makedirs("d:/Work/minipick/public/images/products", exist_ok=True)

images_to_download = {
    "bedazzle-crystal-pen.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/1000969989.png?v=1793487598",
    "rhinestone-sticker-sheets.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/RhinestoneStickerSheetsSetAdvertisement_1.png?v=1792075196",
    "desk-makeup-organizer.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/csdcsdcsd.png?v=1792672384",
    "brush-holder-rotating.jpg": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/sdvsvdsvdsdv.jpg?v=1792677214",
    "pocket-coloring-book-markers.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/Colourful_Marker_Set_with_Cozy_Gift_Book.png?v=1793574963",
    "3d-stickers-collection.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/KuromiHolographicStickerNotebook.png?v=1793493177",
    "blind-box-mystery.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/HelloKittyGemOrganizerandAdhesiveSet.png?v=1790997590",
    "pink-thermal-printer.jpg": "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?auto=format&fit=crop&w=800&q=80",
    "luxury-gift-box.png": "https://cdn.shopify.com/s/files/1/0666/0974/1927/files/Rhinestone_Craft_Supplies_Bundle_with_450_EGP_Badge.png?v=1791002320"
}

headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"}

for filename, url in images_to_download.items():
    filepath = os.path.join("d:/Work/minipick/public/images/products", filename)
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req) as resp, open(filepath, "wb") as f:
            f.write(resp.read())
        print(f"Downloaded: {filename} ({os.path.getsize(filepath)} bytes)")
    except Exception as e:
        print(f"Failed {filename}: {e}")
