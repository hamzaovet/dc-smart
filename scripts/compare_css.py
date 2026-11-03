import urllib.request
import re

def check_site(site_url):
    print("=== Checking:", site_url)
    req = urllib.request.Request(site_url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req) as resp:
        html = resp.read().decode('utf-8')
        css_files = re.findall(r'href="(/_next/static/css/[^"]+)"', html)
        print("CSS Files:", css_files)
        for cf in css_files:
            c_url = site_url.rstrip('/') + cf
            with urllib.request.urlopen(urllib.request.Request(c_url, headers={'User-Agent': 'Mozilla/5.0'})) as cresp:
                content = cresp.read().decode('utf-8')
                print(f"File {cf}: Size = {len(content)} bytes")
                # Look for common utility classes: flex, grid, max-w-7xl, text-amber-400
                classes = ['flex', 'grid', 'hidden', 'text-amber-400', 'bg-zinc-900', 'p-4', 'rounded-2xl']
                for cl in classes:
                    print(f"  Has '.{cl}': {('.' + cl) in content or ('\\:' + cl) in content}")

check_site("https://elfra3na.vercel.app")
check_site("https://rovy-store.vercel.app")
