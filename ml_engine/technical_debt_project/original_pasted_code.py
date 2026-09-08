import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

import warnings
warnings.filterwarnings("ignore")
file_name = input("Enter the CSV file name: ")
# Load dataset (remove sep=';')
df = pd.read_csv(file_name)

print("Dataset Shape:", df.shape)
print("\nColumns:")
print(df.columns.tolist())

df.head()
print(df.info())

print("\nMissing Values:")
print(df.isnull().sum())

print("\nDuplicate Rows:")
print(df.duplicated().sum())

print("\nStatistical Summary:")

df_ml = df.drop(
    columns=[
        "entity_id",
        "repo_name",
        "component_path"
    ]
)

print("New Dataset Shape:", df_ml.shape)

df_ml.head()
print(df_ml.isnull().sum())

numeric_columns = df_ml.select_dtypes(
    include=["int64", "float64"]
).columns

df_ml[numeric_columns] = df_ml[numeric_columns].fillna(
    df_ml[numeric_columns].median()
)
categorical_columns = df_ml.select_dtypes(
    include=["object"]
).columns

for col in categorical_columns:
    df_ml[col] = df_ml[col].fillna(df_ml[col].mode()[0])

print(df_ml.isnull().sum().sum())

#risk features
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

print(len(risk_features))

from sklearn.preprocessing import MinMaxScaler

scaler = MinMaxScaler()

df_ml[risk_features] = scaler.fit_transform(
    df_ml[risk_features]
)

df_ml[risk_features].head()

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
print("Total Weight:", sum(weights.values()))

#score
df_ml["technical_risk_score"] = 0

for feature, weight in weights.items():
    df_ml["technical_risk_score"] += (
        df_ml[feature] * weight
    )

print(
    df_ml["technical_risk_score"].describe()
)

def risk_level(score):

    if score < 0.25:
        return "Low"

    elif score < 0.50:
        return "Medium"

    elif score < 0.75:
        return "High"

    else:
        return "Critical"


df_ml["risk_level"] = df_ml[
    "technical_risk_score"
].apply(risk_level)

df_ml[
    ["technical_risk_score", "risk_level"]
].head(10)

print(
    df_ml["risk_level"].value_counts()
)
df_ml["risk_level"].value_counts().plot(
    kind="bar",
    figsize=(8,5)
)

plt.title("Technical Risk Distribution")
plt.xlabel("Risk Level")
plt.ylabel("Number of Components")
plt.show()

plt.figure(figsize=(15,10))

corr = df_ml.select_dtypes(
    include=np.number
).corr()

sns.heatmap(
    corr,
    cmap="coolwarm",
    center=0
)

plt.title("Feature Correlation Matrix")
plt.show()

X = df_ml.drop(
    columns=[
        "technical_risk_score",
        "risk_level"
    ]
)

y = df_ml["technical_risk_score"]

categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_features = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("Categorical:", categorical_features)
print("Numerical:", numerical_features)

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42
)

print("Training Data:", X_train.shape)
print("Testing Data:", X_test.shape)

#preprocessing
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.pipeline import Pipeline

# Identify categorical and numerical columns
categorical_features = X.select_dtypes(
    include=["object"]
).columns.tolist()

numerical_features = X.select_dtypes(
    exclude=["object"]
).columns.tolist()

print("Categorical Features:")
print(categorical_features)

print("\nNumerical Features:")
print(numerical_features)


# Preprocessing
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

print("\nPreprocessing pipeline created successfully!")

#ml model
from sklearn.ensemble import RandomForestRegressor

model = RandomForestRegressor(
    n_estimators=300,
    max_depth=12,
    random_state=42,
    n_jobs=-1
)

print("Random Forest model created successfully!")
pipeline = Pipeline(
    steps=[
        ("preprocessing", preprocessor),
        ("model", model)
    ]
)

print("Complete ML pipeline created!")

pipeline.fit(
    X_train,
    y_train
)

print("====================================")
print(" MODEL TRAINING COMPLETED ")
print("====================================")

y_pred = pipeline.predict(X_test)

print("Predictions generated successfully!")

print("\nFirst 10 Predictions:")
print(y_pred[:10])

#model evaluation
from sklearn.metrics import (
    mean_absolute_error,
    mean_squared_error,
    r2_score
)

mae = mean_absolute_error(
    y_test,
    y_pred
)

rmse = np.sqrt(
    mean_squared_error(
        y_test,
        y_pred
    )
)

r2 = r2_score(
    y_test,
    y_pred
)

print("====================================")
print(" MODEL EVALUATION ")
print("====================================")

print("MAE  :", round(mae, 4))
print("RMSE :", round(rmse, 4))
print("R²   :", round(r2, 4))

#risk precdiction
import matplotlib.pyplot as plt

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

plt.show()
#historical analysis
historical_analysis = df_ml[
    [
        "technical_risk_score",
        "risk_level"
    ]
].copy()

print("Historical Risk Statistics:")
(
    historical_analysis.describe()
)
risk_distribution = df_ml[
    "risk_level"
].value_counts()

print("Historical Risk Distribution:")
print(risk_distribution)


plt.figure(figsize=(8, 5))

risk_distribution.plot(
    kind="bar"
)

plt.title("Historical Technical Risk Distribution")
plt.xlabel("Risk Level")
plt.ylabel("Number of Components")

plt.show()
# hotspot preciction
hotspot_results = X_test.copy()

hotspot_results["actual_risk_score"] = y_test.values

hotspot_results["predicted_risk_score"] = y_pred

hotspot_results = hotspot_results.sort_values(
    by="predicted_risk_score",
    ascending=False
)
(
    hotspot_results.head(10)
)

def risk_level(score):

    if score < 0.25:
        return "Low"

    elif score < 0.50:
        return "Medium"

    elif score < 0.75:
        return "High"

    else:
        return "Critical"

    hotspot_results["predicted_risk_level"] = (
    hotspot_results[
        "predicted_risk_score"
    ].apply(risk_level)
)

(
    hotspot_results.head(10)
)

#priority
def priority_level(level):

    if level == "Critical":
        return "P1 - Immediate Action"

    elif level == "High":
        return "P2 - High Priority"

    elif level == "Medium":
        return "P3 - Moderate Priority"

    else:
        return "P4 - Low Priority"


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

print("====================================")
print(" TOP RISK DRIVERS ")
print("====================================")

(
    feature_importance_df.head(15)
)

top_features = feature_importance_df.head(15)

plt.figure(figsize=(10, 7))

plt.barh(
    top_features["Feature"][::-1],
    top_features["Importance"][::-1]
)

plt.xlabel("Feature Importance")
plt.ylabel("Feature")
plt.title("Top Technical Debt Risk Drivers")

plt.show()

print("==========================================")
print(" NEW COMPONENT RISK PREDICTION ")
print("==========================================")

user_input = {}

user_input["service_tier"] = input(
    "Enter Service Tier: "
)

user_input["programming_language"] = input(
    "Enter Programming Language: "
)

user_input["domain"] = input(
    "Enter Domain: "
)

user_input["archetype"] = input(
    "Enter Archetype: "
)

user_input["lines_of_code"] = float(
    input("Enter Lines of Code: ")
)

user_input["cyclomatic_complexity"] = float(
    input("Enter Cyclomatic Complexity: ")
)

user_input["cognitive_complexity"] = float(
    input("Enter Cognitive Complexity: ")
)

user_input["code_smells_count"] = float(
    input("Enter Code Smells Count: ")
)

user_input["code_duplication_pct"] = float(
    input("Enter Code Duplication (%): ")
)

user_input["security_hotspots_count"] = float(
    input("Enter Security Hotspots Count: ")
)

user_input["dependency_count"] = float(
    input("Enter Dependency Count: ")
)

user_input["outdated_dependencies_pct"] = float(
    input("Enter Outdated Dependencies (%): ")
)

user_input["churn_lines_last_30d"] = float(
    input("Enter Churn Lines Last 30 Days: ")
)

user_input["commits_last_90d"] = float(
    input("Enter Commits Last 90 Days: ")
)

user_input["distinct_authors_last_90d"] = float(
    input("Enter Distinct Authors Last 90 Days: ")
)

user_input["ownership_entropy"] = float(
    input("Enter Ownership Entropy: ")
)

user_input["avg_pr_review_time_hrs"] = float(
    input("Enter Average PR Review Time (hours): ")
)

user_input["pr_rework_rate"] = float(
    input("Enter PR Rework Rate: ")
)

user_input["unit_test_coverage_pct"] = float(
    input("Enter Unit Test Coverage (%): ")
)

user_input["ci_build_failure_rate"] = float(
    input("Enter CI Build Failure Rate: ")
)

user_input["defects_reported_last_90d"] = float(
    input("Enter Defects Reported Last 90 Days: ")
)

user_input["production_incidents_last_180d"] = float(
    input("Enter Production Incidents Last 180 Days: ")
)

user_input["mttr_incident_mins"] = float(
    input("Enter MTTR Incident (minutes): ")
)

user_input["sprint_velocity_drag_pct"] = float(
    input("Enter Sprint Velocity Drag (%): ")
)

user_input["monthly_maintenance_hours"] = float(
    input("Enter Monthly Maintenance Hours: ")
)


user_df = pd.DataFrame(
    [user_input]
)

print("\n====================================")
print(" USER INPUT ")
print("====================================")

print(user_df)


#technical risk pred
user_prediction = pipeline.predict(
    user_df
)[0]

print(
    "Predicted Technical Risk Score:",
    round(user_prediction, 4)
)
user_risk_level = risk_level(
    user_prediction
)

print(
    "Predicted Risk Level:",
    user_risk_level
)
user_priority = priority_level(
    user_risk_level
)

print(
    "Recommended Priority:",
    user_priority
)
def recommendation(level):

    if level == "Critical":
        return (
            "Immediate technical debt remediation required. "
            "Prioritize refactoring, security fixes, and dependency updates."
        )

    elif level == "High":
        return (
            "High-priority remediation recommended. "
            "Schedule refactoring and address major quality issues."
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

print("\nRecommendation:")
print(user_recommendation)

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

print("==============================================")
print("       TECHNICAL DEBT PREDICTION RESULT")
print("==============================================")

print(final_prediction)

final_prediction.to_csv(
    "user_technical_debt_prediction.csv",
    index=False
)

print(
    "Prediction saved as "
    "'user_technical_debt_prediction.csv'"
)