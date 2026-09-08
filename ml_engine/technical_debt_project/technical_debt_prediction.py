import os
import warnings
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder, MinMaxScaler
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

warnings.filterwarnings("ignore")


# ============================================================
# STEP 1 — LOAD DATASET
# ============================================================

print("=" * 60)
print("       PREDICTIVE ENGINEERING INTELLIGENCE PLATFORM")
print("       TECHNICAL DEBT PRIORITIZATION")
print("=" * 60)

file_name = input("\nEnter the CSV file name: ").strip()

if not file_name:
    raise ValueError("No file name was entered.")

if not os.path.exists(file_name):
    raise FileNotFoundError(
        f"\nFile not found: {file_name}\n"
        "Make sure the CSV file is in the same folder as this Python file."
    )

df = pd.read_csv(file_name)

print("\nDataset loaded successfully!")
print("Dataset Shape:", df.shape)

print("\nColumns:")
print(df.columns.tolist())

print("\nFirst 5 rows:")
print(df.head().to_string(index=False))

print("\nDataset Information:")
df.info()

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:", df.duplicated().sum())

print("\nStatistical Summary:")
print(df.describe(include="all").to_string())


# ============================================================
# STEP 2 — VALIDATE REQUIRED COLUMNS
# ============================================================

required_columns = [
    "entity_id",
    "repo_name",
    "component_path",
    "service_tier",
    "programming_language",
    "domain",
    "archetype",
    "lines_of_code",
    "cyclomatic_complexity",
    "cognitive_complexity",
    "code_smells_count",
    "code_duplication_pct",
    "security_hotspots_count",
    "dependency_count",
    "outdated_dependencies_pct",
    "churn_lines_last_30d",
    "commits_last_90d",
    "distinct_authors_last_90d",
    "ownership_entropy",
    "avg_pr_review_time_hrs",
    "pr_rework_rate",
    "unit_test_coverage_pct",
    "ci_build_failure_rate",
    "defects_reported_last_90d",
    "production_incidents_last_180d",
    "mttr_incident_mins",
    "sprint_velocity_drag_pct",
    "monthly_maintenance_hours"
]

missing_required = [
    col for col in required_columns if col not in df.columns
]

if missing_required:
    raise ValueError(
        "\nThe following required columns are missing:\n"
        + "\n".join(missing_required)
    )


# ============================================================
# STEP 3 — REMOVE IDENTIFICATION COLUMNS FROM ML FEATURES
# ============================================================

id_columns = [
    "entity_id",
    "repo_name",
    "component_path"
]

# Keep original data separately for identifying components later.
df_ids = df[id_columns].copy()

df_ml = df.drop(columns=id_columns).copy()

print("\nAfter removing ID columns:")
print("Shape:", df_ml.shape)


# ============================================================
# STEP 4 — HANDLE MISSING VALUES
# ============================================================

numeric_columns = df_ml.select_dtypes(
    include=["number"]
).columns.tolist()

categorical_columns = df_ml.select_dtypes(
    include=["object"]
).columns.tolist()

for col in numeric_columns:
    df_ml[col] = df_ml[col].fillna(df_ml[col].median())

for col in categorical_columns:
    mode_values = df_ml[col].mode()

    if len(mode_values) > 0:
        df_ml[col] = df_ml[col].fillna(mode_values.iloc[0])
    else:
        df_ml[col] = df_ml[col].fillna("Unknown")

print(
    "\nRemaining missing values:",
    int(df_ml.isnull().sum().sum())
)


# ============================================================
# STEP 5 — TECHNICAL RISK CALCULATION
# ============================================================

risk_features = [
    "cyclomatic_complexity",
    "cognitive_complexity",
    "code_smells_count",
    "code_duplication_pct",
    "security_hotspots_count",
    "outdated_dependencies_pct",
    "churn_lines_last_30d",
    "avg_pr_review_time_hrs",
    "pr_rework_rate",
    "ci_build_failure_rate",
    "defects_reported_last_90d",
    "production_incidents_last_180d",
    "mttr_incident_mins",
    "sprint_velocity_drag_pct",
    "monthly_maintenance_hours"
]

print("\nNumber of risk features:", len(risk_features))


# Fit scaler ONLY on the complete historical dataset to create
# the engineering risk score. The fitted scaler is reused for
# new user input later.
risk_scaler = MinMaxScaler()

df_ml[risk_features] = risk_scaler.fit_transform(
    df_ml[risk_features]
)


# ============================================================
# STEP 6 — WEIGHTED TECHNICAL RISK SCORE
# ============================================================

weights = {
    "cyclomatic_complexity": 0.08,
    "cognitive_complexity": 0.07,
    "code_smells_count": 0.08,
    "code_duplication_pct": 0.06,
    "security_hotspots_count": 0.10,
    "outdated_dependencies_pct": 0.07,
    "churn_lines_last_30d": 0.05,
    "avg_pr_review_time_hrs": 0.04,
    "pr_rework_rate": 0.06,
    "ci_build_failure_rate": 0.07,
    "defects_reported_last_90d": 0.08,
    "production_incidents_last_180d": 0.10,
    "mttr_incident_mins": 0.05,
    "sprint_velocity_drag_pct": 0.04,
    "monthly_maintenance_hours": 0.05
}

if not np.isclose(sum(weights.values()), 1.0):
    raise ValueError("Risk weights must sum to 1.0.")

df_ml["technical_risk_score"] = 0.0

for feature, weight in weights.items():
    df_ml["technical_risk_score"] += (
        df_ml[feature] * weight
    )

print("\nTechnical Risk Score Statistics:")
print(df_ml["technical_risk_score"].describe())


# ============================================================
# STEP 7 — RISK CLASSIFICATION
# ============================================================

def risk_level(score):
    if score < 0.25:
        return "Low"
    elif score < 0.50:
        return "Medium"
    elif score < 0.75:
        return "High"
    else:
        return "Critical"


df_ml["risk_level"] = (
    df_ml["technical_risk_score"].apply(risk_level)
)

print("\nHistorical Risk Distribution:")
print(df_ml["risk_level"].value_counts())


# ============================================================
# STEP 8 — HISTORICAL ANALYSIS
# ============================================================

plt.figure(figsize=(8, 5))

risk_distribution = df_ml["risk_level"].value_counts()

risk_distribution.plot(kind="bar")

plt.title("Historical Technical Risk Distribution")
plt.xlabel("Risk Level")
plt.ylabel("Number of Components")
plt.tight_layout()
plt.show()


# Correlation analysis
plt.figure(figsize=(15, 10))

corr = df_ml.select_dtypes(include=np.number).corr()

sns.heatmap(
    corr,
    cmap="coolwarm",
    center=0
)

plt.title("Technical Feature Correlation Matrix")
plt.tight_layout()
plt.show()


# ============================================================
# STEP 9 — PREPARE FEATURES AND TARGET
# ============================================================

# The target is the engineering risk score calculated above.
# ID columns are excluded because they identify components rather
# than describe their technical condition.

X = df_ml.drop(
    columns=[
        "technical_risk_score",
        "risk_level"
    ]
)

y = df_ml["technical_risk_score"]


# ============================================================
# STEP 10 — TRAIN / TEST SPLIT
# ============================================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("\nTraining Data:", X_train.shape)
print("Testing Data:", X_test.shape)


# ============================================================
# STEP 11 — PREPROCESSING PIPELINE
# ============================================================

categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_features = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("\nCategorical Features:")
print(categorical_features)

print("\nNumerical Features:")
print(numerical_features)


preprocessor = ColumnTransformer(
    transformers=[
        (
            "num",
            StandardScaler(),
            numerical_features
        ),
        (
            "cat",
            OneHotEncoder(handle_unknown="ignore"),
            categorical_features
        )
    ]
)


# ============================================================
# STEP 12 — ML MODEL
# ============================================================

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    random_state=42,
    n_jobs=-1
)

pipeline = Pipeline(
    steps=[
        ("preprocessing", preprocessor),
        ("model", model)
    ]
)


# ============================================================
# STEP 13 — MODEL TRAINING
# ============================================================

print("\n====================================")
print("       TRAINING ML MODEL")
print("====================================")

pipeline.fit(X_train, y_train)

print("Model training completed successfully!")


# ============================================================
# STEP 14 — MODEL PREDICTION
# ============================================================

y_pred = pipeline.predict(X_test)

print("\nFirst 10 predictions:")
print(np.round(y_pred[:10], 4))


# ============================================================
# STEP 15 — MODEL EVALUATION
# ============================================================

mae = mean_absolute_error(y_test, y_pred)

rmse = np.sqrt(
    mean_squared_error(y_test, y_pred)
)

r2 = r2_score(y_test, y_pred)

print("\n====================================")
print("       MODEL EVALUATION")
print("====================================")

print("MAE :", round(mae, 4))
print("RMSE:", round(rmse, 4))
print("R²  :", round(r2, 4))


# ============================================================
# STEP 16 — ACTUAL VS PREDICTED
# ============================================================

plt.figure(figsize=(8, 6))

plt.scatter(
    y_test,
    y_pred,
    alpha=0.6
)

plt.xlabel("Actual Technical Risk Score")
plt.ylabel("Predicted Technical Risk Score")
plt.title("Actual vs Predicted Technical Risk")

plt.plot(
    [y_test.min(), y_test.max()],
    [y_test.min(), y_test.max()],
    linestyle="--"
)

plt.tight_layout()
plt.show()


# ============================================================
# STEP 17 — FEATURE SELECTION / IMPORTANCE
# ============================================================

feature_names = pipeline.named_steps[
    "preprocessing"
].get_feature_names_out()

feature_importances = pipeline.named_steps[
    "model"
].feature_importances_

feature_importance_df = pd.DataFrame({
    "Feature": feature_names,
    "Importance": feature_importances
})

feature_importance_df = (
    feature_importance_df
    .sort_values(
        by="Importance",
        ascending=False
    )
)

print("\n====================================")
print("       TOP RISK DRIVERS")
print("====================================")

print(
    feature_importance_df.head(15).to_string(index=False)
)


# ============================================================
# STEP 18 — EXPLAINABILITY GRAPH
# ============================================================

top_features = feature_importance_df.head(15)

plt.figure(figsize=(10, 7))

plt.barh(
    top_features["Feature"][::-1],
    top_features["Importance"][::-1]
)

plt.xlabel("Feature Importance")
plt.ylabel("Feature")
plt.title("Top Technical Debt Risk Drivers")
plt.tight_layout()
plt.show()


# ============================================================
# STEP 19 — FUTURE HOTSPOT PREDICTION ON TEST COMPONENTS
# ============================================================

# Restore the original component identifiers for the test set.
test_ids = df_ids.loc[X_test.index].copy()

hotspot_results = test_ids.copy()

hotspot_results["actual_risk_score"] = (
    y_test.values
)

hotspot_results["predicted_risk_score"] = (
    y_pred
)

hotspot_results["predicted_risk_level"] = (
    hotspot_results["predicted_risk_score"]
    .apply(risk_level)
)


def priority_level(level):
    if level == "Critical":
        return "P1 - Immediate Action"
    elif level == "High":
        return "P2 - High Priority"
    elif level == "Medium":
        return "P3 - Moderate Priority"
    else:
        return "P4 - Low Priority"


hotspot_results["priority"] = (
    hotspot_results["predicted_risk_level"]
    .apply(priority_level)
)

hotspot_results = hotspot_results.sort_values(
    by="predicted_risk_score",
    ascending=False
)

print("\n====================================")
print("       TOP 10 PREDICTED HOTSPOTS")
print("====================================")

print(
    hotspot_results.head(10).to_string(index=False)
)


# ============================================================
# STEP 20 — USER INPUT
# ============================================================

print("\n==========================================")
print("       NEW COMPONENT RISK PREDICTION")
print("==========================================")

print("\nEnter the technical metrics for a NEW component.")
print("Use numeric values for all metrics.\n")


def get_float(prompt):
    while True:
        try:
            return float(input(prompt).strip())
        except ValueError:
            print("Please enter a valid number.")


user_input = {}

user_input["service_tier"] = input(
    "Enter Service Tier: "
).strip()

user_input["programming_language"] = input(
    "Enter Programming Language: "
).strip()

user_input["domain"] = input(
    "Enter Domain: "
).strip()

user_input["archetype"] = input(
    "Enter Archetype: "
).strip()

user_input["lines_of_code"] = get_float(
    "Enter Lines of Code: "
)

user_input["cyclomatic_complexity"] = get_float(
    "Enter Cyclomatic Complexity: "
)

user_input["cognitive_complexity"] = get_float(
    "Enter Cognitive Complexity: "
)

user_input["code_smells_count"] = get_float(
    "Enter Code Smells Count: "
)

user_input["code_duplication_pct"] = get_float(
    "Enter Code Duplication (%): "
)

user_input["security_hotspots_count"] = get_float(
    "Enter Security Hotspots Count: "
)

user_input["dependency_count"] = get_float(
    "Enter Dependency Count: "
)

user_input["outdated_dependencies_pct"] = get_float(
    "Enter Outdated Dependencies (%): "
)

user_input["churn_lines_last_30d"] = get_float(
    "Enter Churn Lines Last 30 Days: "
)

user_input["commits_last_90d"] = get_float(
    "Enter Commits Last 90 Days: "
)

user_input["distinct_authors_last_90d"] = get_float(
    "Enter Distinct Authors Last 90 Days: "
)

user_input["ownership_entropy"] = get_float(
    "Enter Ownership Entropy: "
)

user_input["avg_pr_review_time_hrs"] = get_float(
    "Enter Average PR Review Time (hours): "
)

user_input["pr_rework_rate"] = get_float(
    "Enter PR Rework Rate: "
)

user_input["unit_test_coverage_pct"] = get_float(
    "Enter Unit Test Coverage (%): "
)

user_input["ci_build_failure_rate"] = get_float(
    "Enter CI Build Failure Rate: "
)

user_input["defects_reported_last_90d"] = get_float(
    "Enter Defects Reported Last 90 Days: "
)

user_input["production_incidents_last_180d"] = get_float(
    "Enter Production Incidents Last 180 Days: "
)

user_input["mttr_incident_mins"] = get_float(
    "Enter MTTR Incident (minutes): "
)

user_input["sprint_velocity_drag_pct"] = get_float(
    "Enter Sprint Velocity Drag (%): "
)

user_input["monthly_maintenance_hours"] = get_float(
    "Enter Monthly Maintenance Hours: "
)


# ============================================================
# STEP 21 — PREPROCESS USER INPUT
# ============================================================

user_df = pd.DataFrame([user_input])

# IMPORTANT:
# The risk-score scaler was fitted on historical data.
# Apply exactly the same transformation to the user's values.
user_df[risk_features] = risk_scaler.transform(
    user_df[risk_features]
)

print("\nUser input received successfully!")


# ============================================================
# STEP 22 — USER TECHNICAL RISK PREDICTION
# ============================================================

user_prediction = pipeline.predict(
    user_df
)[0]

user_prediction = float(
    np.clip(user_prediction, 0, 1)
)

user_risk_level = risk_level(
    user_prediction
)

user_priority = priority_level(
    user_risk_level
)


# ============================================================
# STEP 23 — RECOMMENDATION
# ============================================================

def recommendation(level):
    if level == "Critical":
        return (
            "Immediate technical debt remediation required. "
            "Prioritize refactoring, security fixes, dependency "
            "updates, testing, and incident reduction."
        )

    elif level == "High":
        return (
            "High-priority remediation recommended. "
            "Schedule refactoring and address major quality "
            "and reliability issues."
        )

    elif level == "Medium":
        return (
            "Monitor the component and include technical debt "
            "remediation in upcoming development cycles."
        )

    else:
        return (
            "Technical debt risk is currently low. "
            "Continue regular monitoring and maintenance."
        )


user_recommendation = recommendation(
    user_risk_level
)


# ============================================================
# STEP 24 — USER RESULT
# ============================================================

print("\n==============================================")
print("       TECHNICAL DEBT PREDICTION RESULT")
print("==============================================")

print(
    f"Technical Risk Score : {user_prediction:.4f}"
)

print(
    f"Risk Level           : {user_risk_level}"
)

print(
    f"Priority             : {user_priority}"
)

print(
    f"Recommendation       : {user_recommendation}"
)


# ============================================================
# STEP 25 — STRUCTURED OUTPUT
# ============================================================

final_prediction = pd.DataFrame({
    "Technical Risk Score": [
        round(user_prediction, 4)
    ],
    "Risk Level": [
        user_risk_level
    ],
    "Priority": [
        user_priority
    ],
    "Recommendation": [
        user_recommendation
    ]
})

print("\nStructured Prediction Output:")
print(
    final_prediction.to_string(index=False)
)


# ============================================================
# STEP 26 — SAVE OUTPUT
# ============================================================

output_file = "user_technical_debt_prediction.csv"

final_prediction.to_csv(
    output_file,
    index=False
)

hotspot_results.to_csv(
    "predicted_technical_debt_hotspots.csv",
    index=False
)

print("\n==============================================")
print("             OUTPUT FILES SAVED")
print("==============================================")

print(f"1. {output_file}")
print("2. predicted_technical_debt_hotspots.csv")

print("\nProject execution completed successfully!")
