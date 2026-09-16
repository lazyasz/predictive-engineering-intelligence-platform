import urllib.request
import os

os.makedirs("external_dataset", exist_ok=True)

urls = {
    "jm1.csv": "https://datahub.io/core/openml-datasets/_r/-/data/jm1/jm1.csv",
    "pc1.csv": "https://datahub.io/core/openml-datasets/_r/-/data/pc1/pc1.csv"
}

for fname, url in urls.items():
    dest = os.path.join("external_dataset", fname)
    if not os.path.exists(dest) or os.path.getsize(dest) == 0:
        print(f"[*] Downloading {fname} from {url}...")
        try:
            urllib.request.urlretrieve(url, dest)
            print(f"[+] Downloaded {fname}: {os.path.getsize(dest):,} bytes")
        except Exception as e:
            print(f"[-] Failed to download {fname}: {e}")
    else:
        print(f"[+] {fname} already exists ({os.path.getsize(dest):,} bytes)")
