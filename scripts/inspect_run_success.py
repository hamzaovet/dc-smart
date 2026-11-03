import urllib.request
import json
import sys
sys.stdout.reconfigure(encoding='utf-8')

url = 'https://api.github.com/repos/hamzaovet/minipick/actions/runs/41531047805/jobs'
headers = {'User-Agent': 'Mozilla/5.0'}
req = urllib.request.Request(url, headers=headers)

try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode('utf-8'))
        jobs = data.get('jobs', [])
        for j in jobs:
            print(f"Job: {j['name']} - {j['conclusion']}")
            for s in j.get('steps', []):
                print(f"  Step: {s['name']} -> {s['status']} ({s['conclusion']})")
except Exception as e:
    print(f"Error: {e}")
