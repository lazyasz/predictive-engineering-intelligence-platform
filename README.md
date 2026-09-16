# DebtScope — Predictive Engineering Intelligence Platform

[![Python](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-v0.115-009688.svg)](https://fastapi.tiangolo.com/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB.svg)](https://react.dev/)
[![Dataset](https://img.shields.io/badge/Dataset-The%20Technical%20Debt%20Dataset%20(PROMISE%20'19)-green.svg)](https://github.com/clowee/The-Technical-Debt-Dataset)
[![ML](https://img.shields.io/badge/ML%20Benchmark-SZZ%20Real%20Defect%20Lift%20%2B35.2%25-yellow.svg)](ml_engine/)
[![Quality Gates](https://img.shields.io/badge/Data%20Quality-12%2F12%20Gates%20Passed%20(100%25)-brightgreen.svg)](data_pipeline/)

An enterprise-grade, Big Data and Machine Learning Decision Intelligence Platform that predicts, evaluates, and prioritizes technical debt refactoring using real empirical software repository histories (**The Technical Debt Dataset** — *Lenarduzzi et al., PROMISE '19*), multi-stage Medallion Lakehouse transformations (Bronze ➔ Silver ➔ Gold), automated data quality validation gates, and interactive enterprise integrations (Live GitHub Scanner, Atlassian Jira Cloud, and Notion Workspaces).

---

## 🏛️ System Architecture

```
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                         BRONZE LAYER (Raw Parquet)                          │
 │  10 Tables · 2,933,680 Total Raw Records · 132.8 MB Parquet Partitions      │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                    SILVER LAYER (Cleaned, Typed, Unified)                   │
 │  • repositories (31 rows)            • commits (153,994 rows)               │
 │  • commit_file_changes (1,037,222)   • szz_defects (52,428 rows)            │
 │  • jira_issues (61,402 rows)         • sonar_analysis_bridge (66,712 rows)  │
 │  • sonar_measures (66,711 rows)      • technical_debt_issues (1,024,614)    │
 │  • refactorings (362,253 rows)                                              │
 └──────────────────────────────────────┬──────────────────────────────────────┘
                                        │
                                        ▼
 ┌─────────────────────────────────────────────────────────────────────────────┐
 │                    GOLD LAYER (ML Features & Analytics)                     │
 │  • engineering_features: 1,037,222 file-commit rows (Real SZZ fault target) │
 │  • project_health_summary: 31 Apache project time-series health metrics     │
 │  • developer_analytics: 1,854 developers (churn, faults, refactorings)      │
 └─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🛡️ Automated Data Quality Gates (100% Pass Rate)

Validation gates run automatically between each Medallion lakehouse transition:
- `no_null_file_paths`: 0 null/empty paths across 1,037,222 records
- `churn_non_negative`: 0 negative code churn values
- `no_duplicate_commit_files`: 0 duplicate modifications
- `valid_szz_fault_inducing_hashes`: 52,428 verified SZZ fault links
- `unique_jira_issue_keys`: 61,402 distinct closed tickets
- `real_target_fault_count_valid`: 191,333 defect inductions recorded; 0 invalid counts
- `zero_synthetic_target_leakage`: 0 artificial target formula leakage columns

Audit logs are recorded to SQLite and Parquet (`data/lakehouse/audit/data_quality_audit.parquet`) and surfaced in the frontend [`/data-quality`](frontend/src/pages/DataQuality.jsx) dashboard.

---

## 🤖 Real Empirical ML Defect Benchmarks

All models are trained against **real historical fault outcomes from SZZ fault-inducing commits**:

```
                        EMPIRICAL PERFORMANCE COMPARISON
┌─────────────────────────────────────────────────────────────────────────────┐
│ 1. SZZ Fault Count Regression (1.03M rows)                                  │
│    • Dummy Baseline (Predict Mean):   MAE = 7.3100 | RMSE = 20.4765 | R² = 0.0000 │
│    • Random Forest Regressor:         MAE = 4.7385 | RMSE = 15.6845 | R² = 0.4133 │
│    • 5-Fold Cross Validation R²:      0.3979 ± 0.0106                       │
│    • Lift over Dummy Baseline:        +35.18% Error Reduction               │
│    • Top Predictors: author_experience (42.2%), refactoring_count (20.1%)   │
├─────────────────────────────────────────────────────────────────────────────┤
│ 2. NASA PROMISE Binary Defect Benchmarks                                    │
│    • NASA JM1 (10,885 modules):       ROC-AUC = 0.7332 | Accuracy = 81.17%  │
│    • NASA PC1 (1,109 modules):        ROC-AUC = 0.8754 | Accuracy = 93.69%  │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📁 Repository Structure

```
Predictive-Engineering-Intelligence-Platform/
├── data_pipeline/              # Medallion Lakehouse ETL (Bronze -> Silver -> Gold)
│   └── src/data_pipeline/
│       ├── medallion_pipeline.py  # Parquet / Delta lakehouse transformer
│       └── quality_gates.py       # Automated Data Quality validation framework
├── ml_engine/                  # Real empirical defect prediction & training
│   ├── models/                 # Model artifacts & metrics reports
│   └── src/ml_engine/
│       └── train_on_real_data.py  # Model trainer with Dummy baseline comparisons
├── backend/                    # FastAPI Decision Engine & REST API
│   ├── api/                    # Modular API routers (repositories, lakehouse, priorities, integrations)
│   ├── database/               # SQLAlchemy models & connection pools
│   └── services/               # Repo scanner, Jira, Notion, Priority engine
├── frontend/                   # React 19 + Vite Executive UI (Lustrous Moss Bento)
│   └── src/
│       ├── pages/              # Dashboard, Priorities, Hotspots, Predictions, DataQuality, Copilot
│       └── components/         # Modals (ScanRepoModal, JiraExportModal, NotionSyncModal, AuthModal)
├── .github/workflows/          # GitHub Actions CI/CD with nightly cron
│   └── ci-cd.yml
├── Dockerfile                  # Production container definition
├── render.yaml                 # Render.com backend blueprint
└── requirements.txt            # Consolidated Python dependencies
```

---

## 🚀 Quickstart

### 1. Install Dependencies
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install
cd ..
```

### 2. Run Full Stack Locally
```bash
# Terminal 1: FastAPI Backend
uvicorn backend.main:app --reload --port 8000

# Terminal 2: React Frontend
cd frontend
npm run dev
```

Visit **http://localhost:5173** to view the live dashboard.

---

## ☁️ Live Cloud Deployment

### Backend on Render
1. Connect this repository to **Render.com**.
2. Deploy using the included `render.yaml` Blueprint or Dockerfile.
3. Set environment variables in Render Dashboard (`FRONTEND_URL`, `JWT_SECRET`, and optional `JIRA_API_TOKEN` / `NOTION_API_KEY` / `R2_ACCESS_KEY_ID`).

### Frontend on Vercel
1. Import `frontend/` to **Vercel**.
2. Framework Preset: **Vite**.
3. Build Command: `npm run build`, Output Directory: `dist`.
4. Set Environment Variable: `VITE_API_BASE_URL=https://<your-render-backend-url>`.
