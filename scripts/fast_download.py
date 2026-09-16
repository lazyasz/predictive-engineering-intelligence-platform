"""
Direct S3 Parallel Range Downloader (Robust & High-Speed)
========================================================
"""

import os
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
import httpx

def download_part(s3_url: str, start: int, end: int, part_path: str, part_num: int):
    headers = {"Range": f"bytes={start}-{end}"}
    with httpx.Client(timeout=180.0) as client:
        with client.stream("GET", s3_url, headers=headers) as r:
            r.raise_for_status()
            with open(part_path, "wb") as f:
                for chunk in r.iter_bytes(chunk_size=1024 * 512):
                    f.write(chunk)
    return part_num

def fast_download(url: str, dest: str, num_threads: int = 16):
    os.makedirs(os.path.dirname(dest) or ".", exist_ok=True)
    temp_dir = dest + ".parts"
    os.makedirs(temp_dir, exist_ok=True)

    print(f"[*] Resolving final storage redirect for {url} ...", flush=True)
    r1 = httpx.get(url, follow_redirects=False, timeout=60.0)
    s3_url = r1.headers.get("location")
    if not s3_url:
        s3_url = url

    r2 = httpx.get(s3_url, headers={"Range": "bytes=0-0"}, timeout=60.0)
    cr = r2.headers.get("content-range")
    if not cr:
        raise RuntimeError("Server did not return content-range header for byte request.")
    
    total_size = int(cr.split("/")[-1])
    print(f"[+] Direct storage endpoint resolved: {total_size / (1024*1024):.2f} MB ({total_size:,} bytes)", flush=True)

    chunk_size = total_size // num_threads
    tasks = []
    part_files = []

    for i in range(num_threads):
        start = i * chunk_size
        end = total_size - 1 if i == num_threads - 1 else (start + chunk_size - 1)
        part_path = os.path.join(temp_dir, f"part_{i:03d}.tmp")
        tasks.append((s3_url, start, end, part_path, i))
        part_files.append(part_path)

    start_time = time.time()
    completed = 0

    print(f"[*] Launching {num_threads} concurrent stream workers...", flush=True)
    with ThreadPoolExecutor(max_workers=num_threads) as executor:
        futures = {executor.submit(download_part, t[0], t[1], t[2], t[3], t[4]): t[4] for t in tasks}
        for future in as_completed(futures):
            part_num = future.result()
            completed += 1
            elapsed = time.time() - start_time
            pct = (completed / num_threads) * 100
            print(f"[+] Downloaded part {completed}/{num_threads} (Part #{part_num}) [{pct:.1f}%] in {elapsed:.1f}s", flush=True)

    print("[*] Assembling all parts into final SQLite database file...", flush=True)
    with open(dest, "wb") as outfile:
        for p in part_files:
            with open(p, "rb") as infile:
                while True:
                    buf = infile.read(1024 * 1024 * 16)
                    if not buf:
                        break
                    outfile.write(buf)
            try:
                os.remove(p)
            except Exception:
                pass
    
    try:
        os.rmdir(temp_dir)
    except Exception:
        pass

    total_time = time.time() - start_time
    speed = (total_size / (1024*1024)) / max(total_time, 0.1)
    print(f"\n[SUCCESS] Downloaded & assembled: {dest} in {total_time:.1f}s ({speed:.2f} MB/s)", flush=True)

if __name__ == "__main__":
    url = sys.argv[1] if len(sys.argv) > 1 else "https://github.com/clowee/The-Technical-Debt-Dataset/releases/download/2.0.1/td_V2.db"
    dest = sys.argv[2] if len(sys.argv) > 2 else "external_dataset/td_V2.db"
    fast_download(url, dest, num_threads=16)
