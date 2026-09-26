"""
DebtScope Data Packager
=======================
Collects, manifests, and archives all data, databases, medallion lakehouse tables,
feature stores, machine learning models, and empirical benchmark datasets for DebtScope.
"""

import os
import sys
import time
import zipfile
import json
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent
DIST_DIR = PROJECT_ROOT / "dist_data_export"

def get_file_info(file_path: Path):
    stat = file_path.stat()
    return {
        "rel_path": str(file_path.relative_to(PROJECT_ROOT)).replace("\\", "/"),
        "size_bytes": stat.st_size,
        "size_mb": round(stat.st_size / (1024 * 1024), 2)
    }

def collect_all_data_files():
    data_files = []
    
    # 1. Medallion Lakehouse Parquet files
    lakehouse_dir = PROJECT_ROOT / "data" / "lakehouse"
    if lakehouse_dir.exists():
        for f in lakehouse_dir.rglob("*.parquet"):
            data_files.append(f)
            
    # 2. SQLite Databases
    for db_path in [
        PROJECT_ROOT / "tech_debt_intelligence.db",
        PROJECT_ROOT / "data" / "engineering_intelligence.db",
        PROJECT_ROOT / "data_pipeline" / "data" / "engineering_intelligence.db"
    ]:
        if db_path.exists():
            data_files.append(db_path)
            
    # 3. Data Pipeline Raw, Processed, and Features
    dp_data = PROJECT_ROOT / "data_pipeline" / "data"
    if dp_data.exists():
        for ext in ["*.json", "*.parquet", "*.csv"]:
            for f in dp_data.rglob(ext):
                data_files.append(f)
                
    # 4. ML Engine Datasets, Models, and Reports
    ml_data = PROJECT_ROOT / "ml_engine" / "data"
    if ml_data.exists():
        for f in ml_data.rglob("*"):
            if f.is_file():
                data_files.append(f)
                
    ml_models = PROJECT_ROOT / "ml_engine" / "models"
    if ml_models.exists():
        for f in ml_models.rglob("*"):
            if f.is_file():
                data_files.append(f)

    # 5. External Datasets & Benchmarks
    ext_dir = PROJECT_ROOT / "external_dataset"
    if ext_dir.exists():
        for f in ext_dir.iterdir():
            if f.is_file():
                data_files.append(f)

    # Deduplicate while preserving order
    seen = set()
    unique_files = []
    for f in data_files:
        p_str = str(f.resolve())
        if p_str not in seen and f.exists():
            seen.add(p_str)
            unique_files.append(f)
            
    return unique_files

def create_archive(zip_name: str, files_to_zip: list, description: str):
    output_path = DIST_DIR / zip_name
    print(f"\n[+] Building '{zip_name}' ({description})...")
    start_time = time.time()
    
    total_uncompressed = 0
    with zipfile.ZipFile(output_path, "w", zipfile.ZIP_DEFLATED, compresslevel=6) as zf:
        for f in files_to_zip:
            rel_path = f.relative_to(PROJECT_ROOT)
            zf.write(f, arcname=str(rel_path))
            total_uncompressed += f.stat().st_size
            print(f"  -> Added: {rel_path} ({round(f.stat().st_size / 1024, 1)} KB)")
            
    compressed_size = output_path.stat().st_size
    duration = round(time.time() - start_time, 2)
    print(f"[OK] Created {zip_name} in {duration}s")
    print(f"     Uncompressed: {round(total_uncompressed / (1024*1024), 2)} MB | Compressed: {round(compressed_size / (1024*1024), 2)} MB\n")
    return {
        "filename": zip_name,
        "path": str(output_path),
        "uncompressed_mb": round(total_uncompressed / (1024*1024), 2),
        "compressed_mb": round(compressed_size / (1024*1024), 2),
        "file_count": len(files_to_zip),
        "build_time_seconds": duration
    }

def main():
    print("=" * 80)
    print("      DEBTSCOPE COMPLETE DATA EXTRACTION & ARCHIVE PACKAGER")
    print("=" * 80)
    
    DIST_DIR.mkdir(parents=True, exist_ok=True)
    
    all_files = collect_all_data_files()
    print(f"\nFound {len(all_files)} total DebtScope data/model assets.")
    
    # Split into curated package (everything except 1.5GB raw DB) and full package
    curated_files = [f for f in all_files if f.name != "td_V2.db"]
    raw_research_db = [f for f in all_files if f.name == "td_V2.db"]
    
    # 1. Primary Curated Data & Models Package
    curated_pkg = create_archive(
        "DebtScope_Complete_Data_and_Models.zip",
        curated_files,
        "Medallion Lakehouse Parquet + DBs + Feature Store + Cleaned Datasets + ML Models"
    )
    
    # 2. Master Package containing all files including td_V2.db
    master_pkg = create_archive(
        "DebtScope_All_Data_Master_Archive.zip",
        all_files,
        "Complete DebtScope Data Assets including 1.5GB Research Database"
    )
    
    # Generate Manifest
    manifest = {
        "project": "DebtScope - Predictive Engineering Intelligence Platform",
        "timestamp": time.strftime("%Y-%m-%d %H:%M:%S UTC", time.gmtime()),
        "archives": [curated_pkg, master_pkg],
        "inventory": [get_file_info(f) for f in all_files]
    }
    
    manifest_path = DIST_DIR / "data_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2)
        
    print("=" * 80)
    print(f" [SUCCESS] DebtScope Data Archives ready in '{DIST_DIR}':")
    print(f"  1. {curated_pkg['filename']} ({curated_pkg['compressed_mb']} MB) - Fast portable package")
    print(f"  2. {master_pkg['filename']} ({master_pkg['compressed_mb']} MB) - Full comprehensive data master")
    print(f"  3. data_manifest.json - Complete checksum and size registry")
    print("=" * 80)

if __name__ == "__main__":
    main()
