# Predictive Engineering Intelligence Platform for Technical Debt Prioritization

[![Python](https://img.shields.io/badge/Python-3.10%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![PySpark](https://img.shields.io/badge/PySpark-Distributed-orange.svg)](https://spark.apache.org/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Random%20Forest%20(R%C2%B2%200.988)-yellow.svg)](https://scikit-learn.org/)
[![Architecture](https://img.shields.io/badge/Architecture-4--Tier%20Microservices-informational.svg)](docs/ARCHITECTURE_MASTER.md)

An end-to-end, enterprise-grade Decision Intelligence Platform designed to predict, evaluate, and prioritize technical debt refactoring based on business economics, software big data, machine learning defect forecasts, and return-on-investment (ROI).

---

## 👥 4-Member Team Architecture & Deliverables

```
+---------------------------------------------------------------------------------------------------+
|                                  MEMBER 1: BIG DATA PIPELINE                                      |
|  - Ingests 11 Relational Entities & Live GitHub Repositories                                      |
|  - PySpark Distributed ETL & Medallion Lakehouse (Bronze -> Silver -> Gold)                       |
|  - Computes Windowed Developer Concentration, Code Churn, and SEI Maintainability                 |
|  - Output Contract: data_pipeline/data/features/engineering_features.json                         |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                 MEMBER 2: MACHINE LEARNING ENGINE                                 |
|  - Supervised Random Forest Regressor (300 Decision Trees, Max Depth 12)                          |
|  - Predicts Defect Probability (0-1.0), Future Technical Risk (0-100), and Hotspot Severity       |
|  - Model Benchmarks: R² = 0.9885, 5-Fold Cross-Validation R² = 0.9849, MAE = 1.0855               |
|  - Explainability Driver Analysis & Feature Importance Rankings                                   |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                          MEMBER 3 (LEAD): DECISION INTELLIGENCE BACKEND                           |
|  - 5-Dimensional Business-Aware Prioritization Decision Engine:                                   |
|       PS_base = 0.35 * TR + 0.30 * BI + 0.15 * U + 0.10 * MC + 0.10 * DA                          |
|       PS_final = clamp(0.85 * PS_base + 0.15 * (100 - Effort), 0, 100)                            |
|  - High-performance FastAPI REST API Platform with SQLite Relational Database                     |
|  - Automated ROI Quadrants: Quick Wins, Strategic Refactoring, Deprioritized                      |
+-------------------------------------------------+-------------------------------------------------+
                                                  |
                                                  v
+---------------------------------------------------------------------------------------------------+
|                                  MEMBER 4: REACT WEB DASHBOARD                                    |
|  - Executive SPA built with React 19 + Vite + TailwindCSS 4 + Recharts                            |
|  - Interactive Priority Matrix Quadrant Chart & Risk Trends                                       |
|  - Deep-Dive File Intelligence View & AI Refactoring Copilot Shell                                |
+---------------------------------------------------------------------------------------------------+
```

---

## 📁 Repository Structure

```
Predictive-Engineering-Intelligence-Platform/
├── data_pipeline/              # Member 1: Apache PySpark Big Data & Lakehouse ETL
├── ml_engine/                  # Member 2: Scikit-learn Random Forest ML Models & Analytics
├── backend/                    # Member 3: FastAPI Decision Engine, Database, & API Contracts
├── frontend/                   # Member 4: React 19 + Vite Executive Dashboard
├── docs/                       # Comprehensive Master Team Documentation
│   ├── ARCHITECTURE_MASTER.md
│   ├── GROUP_CONTRIBUTION_MATRIX.md
│   ├── TECHNICAL_VIVA_QA_MASTER.md
│   ├── MATHEMATICAL_FORMULA.md
│   ├── ML_MODEL_SPECIFICATION.md
│   ├── API_CONTRACT.md
│   └── DATA_SCHEMA.md
├── scripts/
│   ├── seed_integrated_pipeline.py  # Cross-module data bridge and database seeder
│   └── run_full_stack.py            # Unified FastAPI + React orchestrator
├── run_project.bat             # 1-Click launcher for Windows Command Prompt
├── run_project.ps1             # 1-Click launcher for Windows PowerShell
├── package_submission.py       # Automated submission ZIP packaging utility
├── requirements.txt            # Consolidated Python dependencies
└── README.md
```

---

## 🚀 Quickstart & Execution

### 1. Install Prerequisites
- Python 3.10+
- Node.js 18+ (for frontend development server)

```bash
# Install Python dependencies
pip install -r requirements.txt

# Install Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. 1-Click Launch (Recommended)
Run either of the following scripts from the project root:
- **Windows Batch**: Double-click `run_project.bat`
- **PowerShell**: Run `./run_project.ps1`

### 3. Individual Subsystem Execution

#### Member 1 — Big Data Pipeline
```bash
cd data_pipeline
python run_pipeline.py
```

#### Member 2 — Machine Learning Model Training & Evaluation
```bash
cd ml_engine
python run_ml_engine.py
```

#### Member 3 — FastAPI Backend Engine & Swagger Docs
```bash
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
# Access Swagger UI at http://localhost:8000/docs
```

#### Member 4 — React Executive Dashboard
```bash
cd frontend
npm run dev
# Access Dashboard at http://localhost:5173
```

---

## 📦 Submission Packaging

To generate individual zip files for each member and the unified master submission archive, run:
```bash
python package_submission.py
```
This generates all 5 submission archives under `dist_submission/`.
