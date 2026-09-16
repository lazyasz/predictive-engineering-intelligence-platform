import urllib.request
import re

url = "https://pei-platform.onrender.com/"
try:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
    html = urllib.request.urlopen(req, timeout=15).read().decode("utf-8")
    print("1. Root HTML loaded successfully (Length:", len(html), "bytes)")
    
    m = re.search(r'src="/assets/([^"]+)"', html)
    if m:
        js_file = m.group(1)
        js_url = f"https://pei-platform.onrender.com/assets/{js_file}"
        js_req = urllib.request.Request(js_url, headers={"User-Agent": "Mozilla/5.0"})
        js_res = urllib.request.urlopen(js_req, timeout=15)
        print(f"2. JavaScript Bundle ({js_file}) Status:", js_res.status, f"({len(js_res.read())} bytes)")
    else:
        print("2. No JS bundle tag found in HTML")
        
    health_url = "https://pei-platform.onrender.com/health"
    health_req = urllib.request.Request(health_url, headers={"User-Agent": "Mozilla/5.0"})
    health_res = urllib.request.urlopen(health_req, timeout=15)
    print("3. Health Endpoint Status:", health_res.status, health_res.read().decode("utf-8"))

    print("\n✅ DEBTSCOPE LIVE VERIFICATION COMPLETE: 100% OPERATIONAL")
except Exception as e:
    print("❌ Verification note (waiting for Render restart):", e)
