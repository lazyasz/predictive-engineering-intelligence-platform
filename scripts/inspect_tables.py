import sqlite3
import json

conn = sqlite3.connect("external_dataset/td_V2.db")
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
tables = [r[0] for r in cursor.fetchall() if not r[0].startswith("sqlite_")]

table_details = {}
for t in tables:
    cursor.execute(f"PRAGMA table_info(`{t}`);")
    cols = cursor.fetchall()
    col_names = [c[1] for c in cols]
    
    cursor.execute(f"SELECT COUNT(*) FROM `{t}`;")
    count = cursor.fetchone()[0]
    
    cursor.execute(f"SELECT * FROM `{t}` LIMIT 2;")
    sample_rows = cursor.fetchall()
    
    table_details[t] = {
        "row_count": count,
        "columns": [c[1] for c in cols],
        "column_types": {c[1]: c[2] for c in cols},
        "sample": [dict(zip(col_names, r)) for r in sample_rows]
    }

print("=== TABLE COLUMNS & ROW COUNTS ===")
for t, details in table_details.items():
    print(f"\nTable: {t} ({details['row_count']:,} rows)")
    print("Columns:", ", ".join(details["columns"]))

# Let's check join keys
print("\n=== FOREIGN KEY / JOIN COMPATIBILITY CHECKS ===")

# PROJECTS
cursor.execute("SELECT * FROM PROJECTS LIMIT 3;")
print("\nPROJECTS samples:")
for r in cursor.fetchall():
    print(" ", r)

# GIT_COMMITS
cursor.execute("SELECT COUNT(DISTINCT COMMIT_HASH) FROM GIT_COMMITS;")
print(f"Distinct COMMIT_HASH in GIT_COMMITS: {cursor.fetchone()[0]:,}")

# GIT_COMMITS_CHANGES
cursor.execute("SELECT COUNT(DISTINCT COMMIT_HASH) FROM GIT_COMMITS_CHANGES;")
print(f"Distinct COMMIT_HASH in GIT_COMMITS_CHANGES: {cursor.fetchone()[0]:,}")

# SZZ_FAULT_INDUCING_COMMITS
cursor.execute("SELECT COUNT(DISTINCT FAULT_FIXING_COMMIT_HASH), COUNT(DISTINCT FAULT_INDUCING_COMMIT_HASH) FROM SZZ_FAULT_INDUCING_COMMITS;")
szz_counts = cursor.fetchone()
print(f"Distinct FAULT_FIXING_COMMIT_HASH: {szz_counts[0]:,}, Distinct FAULT_INDUCING_COMMIT_HASH: {szz_counts[1]:,}")

# Check how many inducing commits exist in GIT_COMMITS
cursor.execute("""
SELECT COUNT(DISTINCT s.FAULT_INDUCING_COMMIT_HASH)
FROM SZZ_FAULT_INDUCING_COMMITS s
JOIN GIT_COMMITS c ON s.FAULT_INDUCING_COMMIT_HASH = c.COMMIT_HASH;
""")
print(f"Fault-inducing commits found in GIT_COMMITS: {cursor.fetchone()[0]:,}")

# JIRA_ISSUES
cursor.execute("SELECT COUNT(DISTINCT KEY), COUNT(DISTINCT PROJECT_ID) FROM JIRA_ISSUES;")
jira_stats = cursor.fetchone()
print(f"Distinct Jira keys: {jira_stats[0]:,}, Across projects: {jira_stats[1]}")

cursor.execute("SELECT TYPE, COUNT(*) FROM JIRA_ISSUES GROUP BY TYPE ORDER BY COUNT(*) DESC LIMIT 5;")
print("Jira issue types:", cursor.fetchall())

# SONAR_MEASURES
cursor.execute("SELECT COUNT(DISTINCT COMMIT_HASH), COUNT(DISTINCT PROJECT_ID) FROM SONAR_MEASURES;")
sonar_stats = cursor.fetchone()
print(f"Sonar Measures distinct commits: {sonar_stats[0]:,}, Across projects: {sonar_stats[1]}")

# SONAR_ISSUES
cursor.execute("SELECT TYPE, SEVERITY, COUNT(*) FROM SONAR_ISSUES GROUP BY TYPE, SEVERITY ORDER BY COUNT(*) DESC LIMIT 10;")
print("\nSonar Issues by Type & Severity:")
for r in cursor.fetchall():
    print(" ", r)

conn.close()
