import urllib.request
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

url = 'https://api.github.com/repos/hamzaovet/minipick/actions/runs'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        runs = data.get('workflow_runs', [])
        print(f"Total workflow runs: {len(runs)}")
        for r in runs[:5]:
            print(f"- Run #{r['id']}: {r['name']} | Event: {r['event']} | Status: {r['status']} | Conclusion: {r['conclusion']}")
            print(f"  URL: {r['html_url']}")
except Exception as e:
    print(f"Error: {e}")
