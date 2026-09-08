"""
Cross-Module Integration & Seeding Engine
=========================================
Bridges all 4 members' workflows into a unified live dataset:
  1. Reads Member 1 Gold Feature Dataset (engineering_features.json).
  2. Runs Member 2 Random Forest ML Model for Defect Risk & Hotspot Predictions.
  3. Populates Member 3 SQLite Database & executes 5D Prioritization Decision Engine.
  4. Prepares live data for Member 4 React Dashboard.
"""

import os
import sys
import json

# Setup workspace paths
current_dir = os.path.dirname(os.path.abspath(__file__))
project_root = os.path.dirname(current_dir)
sys.path.insert(0, project_root)
sys.path.insert(0, os.path.join(project_root, "backend"))
sys.path.insert(0, os.path.join(project_root, "ml_engine"))

from backend.database.connection import init_db, SessionLocal
from backend.database.models import (
    Repository,
    SourceFile,
    EngineeringMetric,
    TechnicalDebtItem,
    MLPrediction,
    BusinessContext,
    PriorityScore,
    Recommendation,
)
from backend.services.priority_service import PriorityService
from backend.services.recommendation_service import RecommendationService
from ml_engine.src.predictor import MLDefectPredictor


def run_integrated_pipeline():
    print("=" * 70)
    print("   PREDICTIVE ENGINEERING INTELLIGENCE - FULL STACK DATA BRIDGE   ")
    print("=" * 70)

    # Step 1: Load Member 1 Gold Features
    features_json_path = os.path.join(
        project_root, "data_pipeline", "data", "features", "engineering_features.json"
    )
    if not os.path.exists(features_json_path):
        raise FileNotFoundError(f"Member 1 features dataset not found at {features_json_path}")

    with open(features_json_path, "r") as f:
        m1_features = json.load(f)
    print(f"\n[+] [Member 1] Loaded {len(m1_features)} feature records from Big Data Pipeline.")

    # Step 2: Load Member 2 ML Predictor
    model_path = os.path.join(project_root, "ml_engine", "models", "rf_defect_model.pkl")
    predictor = MLDefectPredictor(model_path=model_path)
    print(f"[+] [Member 2] Loaded Random Forest Regressor from {model_path}.")

    # Step 3: Initialize Member 3 Database
    init_db()
    db = SessionLocal()

    try:
        # Clear existing tables for fresh integration
        db.query(Recommendation).delete()
        db.query(PriorityScore).delete()
        db.query(BusinessContext).delete()
        db.query(MLPrediction).delete()
        db.query(TechnicalDebtItem).delete()
        db.query(EngineeringMetric).delete()
        db.query(SourceFile).delete()
        db.query(Repository).delete()
        db.commit()

        # Create Default Monitoring Repositories
        repo_names = list({item.get("repository", "core-banking-service") for item in m1_features})
        repos = {}
        for r_name in repo_names:
            repo = Repository(
                name=r_name,
                url=f"https://github.com/enterprise/{r_name}",
                default_branch="main",
            )
            db.add(repo)
            db.flush()
            repos[r_name] = repo

        print(f"[+] [Member 3] Initialized {len(repos)} repositories in relational database.")

        # Step 4: Iterate and Fuse Member 1 + Member 2 into Member 3 DB
        for item in m1_features:
            repo_name = item.get("repository", "core-banking-service")
            repo = repos[repo_name]
            file_name = item.get("file", "module.py")
            module_name = item.get("module", "core_module")
            loc = int(item.get("loc", 500))

            # Create SourceFile
            src_file = SourceFile(
                repository_id=repo.id,
                file_path=f"services/{module_name}/{file_name}",
                file_name=file_name,
                language="Python" if file_name.endswith(".py") else "TypeScript",
                lines_of_code=loc,
                is_active=True,
            )
            db.add(src_file)
            db.flush()

            # 4.1 Ingest Member 1 Static & Churn Metrics
            complexity = float(item.get("complexity", 15.0))
            maintainability = float(item.get("maintainability", 60.0))
            code_churn = int(item.get("code_churn", 100))
            code_smells = int(item.get("code_smells", 5))

            # Normalized static risk (0-100)
            static_risk = min(100.0, max(0.0, (complexity * 1.5) + (code_smells * 2.0) + (100.0 - maintainability) * 0.5))

            metric = EngineeringMetric(
                file_id=src_file.id,
                cyclomatic_complexity=complexity,
                cognitive_complexity=round(complexity * 0.85, 1),
                code_smells_count=code_smells,
                duplication_pct=float(round((code_smells * 1.5) % 30.0, 1)),
                test_coverage_pct=float(max(10.0, min(95.0, 100.0 - complexity * 1.2))),
                code_churn_commits=int(item.get("commit_count", 10)),
                bug_frequency=int(item.get("defect_count", 2)),
                technical_risk_score=round(static_risk, 2),
            )
            db.add(metric)

            # 4.2 Ingest Technical Debt Items
            if complexity > 25.0:
                db.add(TechnicalDebtItem(
                    file_id=src_file.id,
                    debt_category="COMPLEXITY",
                    severity="CRITICAL" if complexity > 40.0 else "HIGH",
                    debt_age_days=int(item.get("debt_age", 45)),
                    description=f"High branching cyclomatic complexity (McCabe {complexity:.1f}) in {file_name}",
                    line_number=42,
                    remediation_guidance="Decompose monolithic routine into modular single-responsibility helper methods.",
                ))
            if code_smells > 8:
                db.add(TechnicalDebtItem(
                    file_id=src_file.id,
                    debt_category="SMELL",
                    severity="HIGH",
                    debt_age_days=int(item.get("debt_age", 30)),
                    description=f"{code_smells} architectural code smells detected in {module_name}",
                    line_number=18,
                    remediation_guidance="Eliminate duplicate logic and apply extract-interface pattern.",
                ))

            # 4.3 Run Member 2 ML Prediction
            ml_input = {
                "lines_of_code": loc,
                "cyclomatic_complexity": complexity,
                "cognitive_complexity": round(complexity * 0.85, 1),
                "code_smells_count": code_smells,
                "code_duplication_pct": float(round((code_smells * 1.5) % 30.0, 1)),
                "security_hotspots_count": 2 if complexity > 30 else 0,
                "dependency_count": 15,
                "outdated_dependencies_pct": float(item.get("dependency_risk", 20.0)),
                "churn_lines_last_30d": code_churn,
                "commits_last_90d": int(item.get("commit_count", 10)),
                "distinct_authors_last_90d": 3,
                "ownership_entropy": float(item.get("developer_concentration", 0.5)),
                "avg_pr_review_time_hrs": 36.0,
                "pr_rework_rate": 0.25,
                "unit_test_coverage_pct": float(max(10.0, min(95.0, 100.0 - complexity * 1.2))),
                "ci_build_failure_rate": 0.15,
                "defects_reported_last_90d": int(item.get("defect_count", 2)),
                "production_incidents_last_180d": 1 if complexity > 35 else 0,
                "mttr_incident_mins": 90,
                "sprint_velocity_drag_pct": float(round(complexity * 0.6, 1)),
                "monthly_maintenance_hours": float(item.get("estimated_remediation_effort", 20.0)),
                "service_tier": "Tier-1" if item.get("module_criticality", 50.0) > 75 else "Tier-2",
                "programming_language": "Python",
                "domain": "Core Banking",
                "archetype": "Microservice",
            }
            ml_out = predictor.predict_single(ml_input)

            ml_record = MLPrediction(
                file_id=src_file.id,
                predicted_future_risk=ml_out["predicted_risk_score"],
                defect_probability=ml_out["predicted_defect_probability"],
                churn_risk_score=min(100.0, float(code_churn / 50.0)),
                confidence_score=0.92,
                model_version="RandomForestRegressor-v2.0",
            )
            db.add(ml_record)

            # 4.4 Ingest Business Context
            crit = float(item.get("module_criticality", 60.0))
            cust_impact = float(item.get("business_impact", 50.0))
            rem_effort = float(item.get("estimated_remediation_effort", 40.0))

            b_context = BusinessContext(
                file_id=src_file.id,
                business_criticality=crit,
                customer_impact=cust_impact,
                module_criticality=crit,
                release_proximity=75.0 if crit > 70 else 30.0,
                sprint_urgency=65.0,
                maintenance_cost=min(100.0, rem_effort * 1.5),
                estimated_remediation_effort=rem_effort,
                domain_tag=module_name,
            )
            db.add(b_context)

        db.commit()
        print(f"[+] [Member 3] Ingested static metrics, ML predictions, and business contexts for {len(m1_features)} files.")

        # Step 5: Execute 5-Dimensional Decision Engine
        print("\n[+] [Decision Engine] Running 5D Multi-Dimensional Prioritization Engine...")
        analyzed_scores = PriorityService.analyze_all_files(db)
        RecommendationService.generate_all_recommendations(db)

        # Step 6: Print Final Ranking Matrix
        ranked_files = PriorityService.get_ranked_priorities(db, limit=10)
        print(f"\n{'='*75}")
        print(f"{'RANK':<5} | {'FILE PATH':<32} | {'PRIORITY':<8} | {'SCORE':<6} | {'ROI QUADRANT':<15}")
        print(f"{'-'*75}")
        for r in ranked_files:
            print(f"{r.rank:<5} | {r.file_path:<32} | {r.priority_level:<8} | {r.priority_score:<6.1f} | {r.quadrant:<15}")
        print(f"{'='*75}")

        print(f"\n[OK] Database successfully seeded! Total Analyzed Files: {len(analyzed_scores)}")
        print("     Frontend (Member 4) can now fetch live data from FastAPI endpoints.")

    finally:
        db.close()


if __name__ == "__main__":
    run_integrated_pipeline()
