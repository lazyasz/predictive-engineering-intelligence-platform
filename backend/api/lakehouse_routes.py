"""
Lakehouse & Data Quality API Routes
===================================
Provides endpoints for Data Quality Audits, Medallion Layer lineage statistics,
and Empirical Machine Learning benchmark metrics.
"""

import os
import json
import sqlite3
import pandas as pd
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException

router = APIRouter(prefix="/lakehouse", tags=["Medallion Lakehouse & Data Quality"])

DB_PATH = "data/engineering_intelligence.db"
LAKEHOUSE_ROOT = "data/lakehouse"
METRICS_REPORT_PATH = "ml_engine/models/metrics_report.json"

@router.get("/quality-audit", summary="Get Data Quality Audit Logs")
def get_data_quality_audit():
    """Returns the latest Data Quality validation gate execution logs and pass rates."""
    records = []
    if os.path.exists(DB_PATH):
        with sqlite3.connect(DB_PATH) as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT audit_id, run_id, timestamp, layer, dataset_name, row_count, check_name, status, passed, details
            FROM data_quality_audit
            ORDER BY timestamp DESC, audit_id ASC
            LIMIT 50;
            """)
            rows = cursor.fetchall()
            for r in rows:
                records.append({
                    "audit_id": r[0],
                    "run_id": r[1],
                    "timestamp": r[2],
                    "layer": r[3],
                    "dataset_name": r[4],
                    "row_count": r[5],
                    "check_name": r[6],
                    "status": r[7],
                    "passed": bool(r[8]),
                    "details": r[9]
                })

    passed_count = sum(1 for r in records if r["passed"])
    total_count = len(records)
    pass_rate = round((passed_count / max(1, total_count)) * 100, 1)

    return {
        "total_checks": total_count,
        "passed_checks": passed_count,
        "failed_checks": total_count - passed_count,
        "pass_rate_pct": pass_rate,
        "audit_logs": records
    }

@router.get("/lineage-overview", summary="Get Medallion Lakehouse Layer Lineage Statistics")
def get_lakehouse_lineage():
    """Returns row counts, file sizes, and storage metrics across Bronze, Silver, and Gold layers."""
    layers = {
        "bronze": {"name": "Bronze Layer (Raw Parquet)", "description": "Raw un-mutated Parquet partitions from 31 Apache repos", "tables": []},
        "silver": {"name": "Silver Layer (Cleaned & Typed)", "description": "Deduplicated, typed, and normalized relational entities", "tables": []},
        "gold": {"name": "Gold Layer (Feature Store & Analytics)", "description": "Aggregated 5D ML feature store with real SZZ fault outcomes", "tables": []}
    }

    for layer_key in ["bronze", "silver", "gold"]:
        layer_dir = os.path.join(LAKEHOUSE_ROOT, layer_key)
        if os.path.exists(layer_dir):
            for fname in os.listdir(layer_dir):
                if fname.endswith(".parquet"):
                    fpath = os.path.join(layer_dir, fname)
                    try:
                        df = pd.read_parquet(fpath)
                        layers[layer_key]["tables"].append({
                            "table_name": fname.replace(".parquet", ""),
                            "file_name": fname,
                            "row_count": len(df),
                            "columns_count": len(df.columns),
                            "size_mb": round(os.path.getsize(fpath) / (1024 * 1024), 2)
                        })
                    except Exception:
                        pass

    return {
        "lakehouse_root": LAKEHOUSE_ROOT,
        "dataset_name": "The Technical Debt Dataset (PROMISE '19) + SZZ Ground Truth",
        "layers": layers
    }

@router.get("/ml-metrics", summary="Get Real Empirical ML Model Performance")
def get_ml_metrics():
    """Returns training metrics comparing Random Forest on real outcomes vs Baseline Dummy."""
    if os.path.exists(METRICS_REPORT_PATH):
        with open(METRICS_REPORT_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
            
    return {
        "status": "NOT_TRAINED",
        "message": "Run train_on_real_data.py to generate empirical metrics report."
    }
