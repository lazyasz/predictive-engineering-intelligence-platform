import sqlite3

conn = sqlite3.connect("external_dataset/td_V2.db")
cursor = conn.cursor()

print("=== JOIN VERIFICATIONS ===")

# 1. Check SONAR_ANALYSIS bridge
cursor.execute("""
SELECT 
    COUNT(m.ANALYSIS_KEY) as total_measures,
    COUNT(a.REVISION) as measures_with_git_commit,
    COUNT(c.COMMIT_HASH) as measures_matched_in_git_commits
FROM SONAR_MEASURES m
LEFT JOIN SONAR_ANALYSIS a ON m.ANALYSIS_KEY = a.ANALYSIS_KEY
LEFT JOIN GIT_COMMITS c ON a.REVISION = c.COMMIT_HASH;
""")
r = cursor.fetchone()
print(f"SONAR_MEASURES join via SONAR_ANALYSIS -> GIT_COMMITS:")
print(f"  Total Measures: {r[0]:,}")
print(f"  Joined to Analysis Revision: {r[1]:,}")
print(f"  Joined to Git Commits: {r[2]:,}")

# 2. Check SONAR_ISSUES bridge
cursor.execute("""
SELECT 
    COUNT(i.ISSUE_KEY) as total_issues,
    COUNT(a.REVISION) as issues_with_git_commit,
    COUNT(c.COMMIT_HASH) as issues_matched_in_git_commits
FROM SONAR_ISSUES i
LEFT JOIN SONAR_ANALYSIS a ON i.CREATION_ANALYSIS_KEY = a.ANALYSIS_KEY
LEFT JOIN GIT_COMMITS c ON a.REVISION = c.COMMIT_HASH;
""")
r = cursor.fetchone()
print(f"\nSONAR_ISSUES join via SONAR_ANALYSIS -> GIT_COMMITS:")
print(f"  Total Issues: {r[0]:,}")
print(f"  Joined to Analysis Revision: {r[1]:,}")
print(f"  Joined to Git Commits: {r[2]:,}")

# 3. Check SZZ Fault Inducing Commits vs Git Commits
cursor.execute("""
SELECT 
    COUNT(*) as total_szz_records,
    COUNT(DISTINCT s.FAULT_INDUCING_COMMIT_HASH) as unique_inducing_hashes,
    COUNT(DISTINCT c.COMMIT_HASH) as inducing_hashes_in_git
FROM SZZ_FAULT_INDUCING_COMMITS s
LEFT JOIN GIT_COMMITS c ON s.FAULT_INDUCING_COMMIT_HASH = c.COMMIT_HASH;
""")
r = cursor.fetchone()
print(f"\nSZZ_FAULT_INDUCING_COMMITS vs GIT_COMMITS:")
print(f"  Total SZZ Records: {r[0]:,}")
print(f"  Unique Inducing Hashes: {r[1]:,}")
print(f"  Inducing Hashes Matched in GIT_COMMITS: {r[2]:,}")

# 4. Check File Changes join to Git Commits
cursor.execute("""
SELECT 
    COUNT(*) as total_file_changes,
    COUNT(DISTINCT c.COMMIT_HASH) as commits_with_changes
FROM GIT_COMMITS_CHANGES ch
JOIN GIT_COMMITS c ON ch.COMMIT_HASH = c.COMMIT_HASH;
""")
r = cursor.fetchone()
print(f"\nGIT_COMMITS_CHANGES vs GIT_COMMITS:")
print(f"  Total File Changes: {r[0]:,}")
print(f"  Commits with Changes matched: {r[1]:,}")

# 5. Check Refactoring Miner join to Git Commits
cursor.execute("""
SELECT 
    COUNT(*) as total_refactorings,
    COUNT(DISTINCT r.COMMIT_HASH) as commits_with_refactorings,
    COUNT(DISTINCT c.COMMIT_HASH) as matched_in_git_commits
FROM REFACTORING_MINER r
JOIN GIT_COMMITS c ON r.COMMIT_HASH = c.COMMIT_HASH;
""")
r = cursor.fetchone()
print(f"\nREFACTORING_MINER vs GIT_COMMITS:")
print(f"  Total Refactorings: {r[0]:,}")
print(f"  Commits with Refactorings: {r[1]:,}")
print(f"  Matched in GIT_COMMITS: {r[2]:,}")

# 6. Check Jira Issues key format
cursor.execute("""
SELECT PROJECT_ID, KEY, TYPE, PRIORITY, STATUS, RESOLUTION, CREATION_DATE, RESOLUTION_DATE
FROM JIRA_ISSUES LIMIT 5;
""")
print("\nSample JIRA_ISSUES:")
for row in cursor.fetchall():
    print(" ", row)

# 7. Check Projects
cursor.execute("SELECT * FROM PROJECTS;")
print(f"\nProjects List ({cursor.rowcount if cursor.rowcount > 0 else 31} projects):")
for row in cursor.fetchall():
    print(f"  • {row[0]}: {row[1]}")

conn.close()
