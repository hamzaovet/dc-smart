import urllib.request
import re
import sys
sys.stdout.reconfigure(encoding='utf-8')

url = 'https://www.facebook.com/profile.php?id=61590561604312'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'})

try:
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8', errors='ignore')
        print(f"Fetched {len(html)} bytes")
        title = re.search(r'<title>(.*?)</title>', html)
        print("Title:", title.group(1) if title else "No title")
        og_title = re.findall(r'property="og:title" content="(.*?)"', html)
        print("og:title:", og_title)
        og_desc = re.findall(r'property="og:description" content="(.*?)"', html)
        print("og:desc:", og_desc)
        og_image = re.findall(r'property="og:image" content="(.*?)"', html)
        print("og:image:", og_image)
except Exception as e:
    print(f"Error: {e}")
