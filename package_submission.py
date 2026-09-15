"""
Automated Final Group Project Submission Packager
=================================================
Packages the unified project and individual member archives ready for submission.
Excludes node_modules, .git, and temporary cache folders for lightweight, fast archives.
"""

import os
import shutil
import zipfile

project_root = os.path.dirname(os.path.abspath(__file__))
dist_dir = os.path.join(project_root, "dist_submission")

EXCLUDED_DIRS = {
    "node_modules",
    ".git",
    "dist_submission",
    "__pycache__",
    ".pytest_cache",
    ".venv",
    "venv",
    ".next",
}

EXCLUDED_EXTENSIONS = {".pyc", ".db-journal"}


def zip_directory(src_dir: str, output_zip: str):
    """Zips a directory excluding unnecessary temporary / bulky files."""
    with zipfile.ZipFile(output_zip, "w", zipfile.ZIP_DEFLATED) as zf:
        for root, dirs, files in os.walk(src_dir):
            dirs[:] = [d for d in dirs if d not in EXCLUDED_DIRS]
            for file in files:
                if any(file.endswith(ext) for ext in EXCLUDED_EXTENSIONS):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, src_dir)
                zf.write(file_path, arcname)


def package():
    print("=" * 70)
    print("   PREDICTIVE ENGINEERING PLATFORM - SUBMISSION PACKAGER   ")
    print("=" * 70)

    if os.path.exists(dist_dir):
        shutil.rmtree(dist_dir)
    os.makedirs(dist_dir, exist_ok=True)

    # 1. Package Member 1 Data Pipeline
    m1_zip = os.path.join(dist_dir, "Member1_Data_Pipeline.zip")
    print("\n[+] Creating Member 1 Archive (Data Engineering & PySpark)...")
    zip_directory(os.path.join(project_root, "data_pipeline"), m1_zip)

    # 2. Package Member 2 ML Engine
    m2_zip = os.path.join(dist_dir, "Member2_ML_Analytics.zip")
    print("[+] Creating Member 2 Archive (Machine Learning Engine)...")
    zip_directory(os.path.join(project_root, "ml_engine"), m2_zip)

    # 3. Package Member 3 Backend Core
    m3_zip = os.path.join(dist_dir, "Member3_Decision_Engine_Backend.zip")
    print("[+] Creating Member 3 Archive (Core Decision Intelligence & FastAPI)...")
    zip_directory(os.path.join(project_root, "backend"), m3_zip)

    # 4. Package Member 4 Frontend Dashboard
    m4_zip = os.path.join(dist_dir, "Member4_UI_Dashboard.zip")
    print("[+] Creating Member 4 Archive (React 19 Executive Dashboard)...")
    zip_directory(os.path.join(project_root, "frontend"), m4_zip)

    # 5. Package Complete Master Group Submission
    final_group_zip = os.path.join(dist_dir, "Predictive_Engineering_Platform_FINAL_GROUP_SUBMISSION.zip")
    print(f"\n[+] Creating Master Combined Group Submission '{final_group_zip}'...")
    zip_directory(project_root, final_group_zip)

    print("\n" + "=" * 70)
    print("   [OK] SUBMISSION PACKAGES GENERATED IN 'dist_submission/'!")
    print("   1. Member1_Data_Pipeline.zip")
    print("   2. Member2_ML_Analytics.zip")
    print("   3. Member3_Decision_Engine_Backend.zip")
    print("   4. Member4_UI_Dashboard.zip")
    print("   5. Predictive_Engineering_Platform_FINAL_GROUP_SUBMISSION.zip")
    print("=" * 70)


if __name__ == "__main__":
    package()
