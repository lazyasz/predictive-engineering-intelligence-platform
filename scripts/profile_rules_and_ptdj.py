import sqlite3

conn = sqlite3.connect("external_dataset/td_V2.db")
c = conn.cursor()

print("=== PTIDEJ & SONARQUBE ISSUE PROFILE ===")
c.execute("""
SELECT 
    CASE 
        WHEN RULE LIKE 'code_smells:%' THEN 'Ptidej Code Smells'
        WHEN RULE LIKE 'squid:%' THEN 'SonarQube Java (squid)'
        WHEN RULE LIKE 'common-java:%' THEN 'SonarQube Common-Java'
        ELSE 'Other Rules'
    END as rule_type,
    COUNT(*) as issue_count,
    COUNT(DISTINCT COMPONENT) as affected_components
FROM SONAR_ISSUES
GROUP BY rule_type;
""")
for r in c.fetchall():
    print(f"  • {r[0]}: {r[1]:,} issues across {r[2]:,} components")

print("\n=== TOP PTIDEJ CODE SMELLS ===")
c.execute("""
SELECT RULE, COUNT(*) 
FROM SONAR_ISSUES 
WHERE RULE LIKE 'code_smells:%' 
GROUP BY RULE 
ORDER BY COUNT(*) DESC 
LIMIT 10;
""")
for r in c.fetchall():
    print(f"  • {r[0]}: {r[1]:,}")

print("\n=== TOP SONARQUBE VIOLATIONS ===")
c.execute("""
SELECT RULE, TYPE, SEVERITY, COUNT(*) 
FROM SONAR_ISSUES 
WHERE RULE NOT LIKE 'code_smells:%' 
GROUP BY RULE, TYPE, SEVERITY 
ORDER BY COUNT(*) DESC 
LIMIT 10;
""")
for r in c.fetchall():
    print(f"  • {r[0]} ({r[1]}, {r[2]}): {r[3]:,}")

conn.close()
