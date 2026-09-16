import json
import sqlite3

with open("external_dataset/td_dataset_profile.json", "r") as f:
    p = json.load(f)

print("=" * 80)
print(f"THE TECHNICAL DEBT DATASET (PROMISE '19) - PROFILE SUMMARY")
print(f"Database Size: {p['database_size_mb']} MB ({p['database_size_bytes']:,} bytes)")
print("=" * 80)

total_records = sum(t["total_rows"] for t in p["tables"].values())
print(f"Total Records across all 10 tables: {total_records:,}\n")

for tname, tinfo in p["tables"].items():
    print(f"\n### Table: `{tname}` ({tinfo['total_rows']:,} rows)")
    print(f"| Column | Type | Null % | Primary Key | Min / Max / Format |")
    print(f"| :--- | :--- | :--- | :--- | :--- |")
    for cname, cstat in tinfo["column_statistics"].items():
        min_v = cstat.get("min_value", "")
        max_v = cstat.get("max_value", "")
        rng = f"[{min_v} to {max_v}]" if min_v or max_v else "-"
        pk = "YES" if cstat.get("is_pk") else "NO"
        print(f"| `{cname}` | {cstat['type']} | {cstat['null_pct']}% | {pk} | {rng} |")

# Check joinable keys across tables
conn = sqlite3.connect("external_dataset/td_V2.db")
cursor = conn.cursor()

print("\n" + "=" * 80)
print("JOINABLE KEYS & RELATIONSHIP VERIFICATION")
print("=" * 80)

# Projects
cursor.execute("SELECT projectID, name, jiraKey, githubRepo FROM PROJECTS LIMIT 5;")
print("\nSample Projects:")
for r in cursor.fetchall():
    print(" ", r)

# Check commit hash overlaps
cursor.execute("SELECT COUNT(DISTINCT commitHash) FROM GIT_COMMITS;")
total_commits = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT commitHash) FROM GIT_COMMITS_CHANGES;")
commits_in_changes = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT commitHash) FROM SONAR_MEASURES;")
commits_in_sonar = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT faultFixingCommitHash) FROM SZZ_FAULT_INDUCING_COMMITS WHERE faultFixingCommitHash IS NOT NULL AND faultFixingCommitHash != '';")
fixing_commits = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT faultInducingCommitHash) FROM SZZ_FAULT_INDUCING_COMMITS WHERE faultInducingCommitHash IS NOT NULL AND faultInducingCommitHash != '';")
inducing_commits = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT `key`) FROM JIRA_ISSUES;")
jira_issue_keys = cursor.fetchone()[0]

cursor.execute("SELECT COUNT(DISTINCT `key`) FROM SZZ_FAULT_INDUCING_COMMITS;")
szz_jira_keys = cursor.fetchone()[0]

cursor.execute("SELECT type, COUNT(*) FROM JIRA_ISSUES GROUP BY type ORDER BY COUNT(*) DESC LIMIT 10;")
jira_types = cursor.fetchall()

print(f"\nDistinct Git Commits: {total_commits:,}")
print(f"Distinct Commits with File Changes: {commits_in_changes:,}")
print(f"Distinct Commits with SonarQube Measures: {commits_in_sonar:,}")
print(f"Distinct Fault-Fixing Commits (SZZ): {fixing_commits:,}")
print(f"Distinct Fault-Inducing Commits (SZZ): {inducing_commits:,}")
print(f"Distinct Jira Issue Keys: {jira_issue_keys:,}")
print(f"Distinct Jira Keys in SZZ Fault Inducing: {szz_jira_keys:,}")
print(f"\nTop Jira Issue Types:")
for t, cnt in jira_types:
    print(f"  • {t}: {cnt:,}")

conn.close()
