"""
Full-Stack Unified Launcher
===========================
Launches the FastAPI backend and React frontend concurrently.
"""

import os
import sys
import subprocess
import time
import webbrowser

project_root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def main():
    print("=" * 70)
    print("   PREDICTIVE ENGINEERING INTELLIGENCE PLATFORM - FULL STACK RUNNER   ")
    print("=" * 70)

    # 1. Run integrated data seeder first
    print("\n[Step 1/3] Ensuring Database is seeded with Member 1 & 2 data...")
    seeder_script = os.path.join(project_root, "scripts", "seed_integrated_pipeline.py")
    subprocess.run([sys.executable, seeder_script], check=True)

    # 2. Launch FastAPI Backend
    print("\n[Step 2/3] Starting FastAPI Backend on http://127.0.0.1:8000...")
    backend_main = os.path.join(project_root, "backend", "main.py")
    backend_cmd = [
        sys.executable,
        "-m",
        "uvicorn",
        "backend.main:app",
        "--host",
        "0.0.0.0",
        "--port",
        "8000",
        "--reload",
    ]
    backend_proc = subprocess.Popen(backend_cmd, cwd=project_root)

    time.sleep(2)
    print("    -> FastAPI running: Swagger at http://127.0.0.1:8000/docs")

    # 3. Launch Frontend Dashboard
    frontend_dir = os.path.join(project_root, "frontend")
    print(f"\n[Step 3/3] Starting React 19 Frontend Dashboard from {frontend_dir}...")
    
    # Check if npm run dev can be launched
    frontend_cmd = "npm run dev"
    try:
        frontend_proc = subprocess.Popen(
            frontend_cmd,
            shell=True,
            cwd=frontend_dir
        )
        print("    -> React Dashboard running at http://localhost:5173")
    except Exception as e:
        print(f"    [!] Note: To launch frontend manually, run 'npm run dev' inside 'frontend/' folder. ({e})")

    print("\n" + "=" * 70)
    print("   [OK] SYSTEM OPERATIONAL!")
    print("   - Frontend Dashboard: http://localhost:5173")
    print("   - Backend API Docs:   http://localhost:8000/docs")
    print("   Press Ctrl+C to terminate both servers.")
    print("=" * 70)

    try:
        backend_proc.wait()
    except KeyboardInterrupt:
        print("\nShutting down servers...")
        backend_proc.terminate()
        try:
            frontend_proc.terminate()
        except Exception:
            pass


if __name__ == "__main__":
    main()
