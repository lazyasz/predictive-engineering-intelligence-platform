"""
The Technical Debt Dataset Profiler
==================================
Profiles every table in the SQLite database (td_V2.db):
- Table list & schemas
- Row counts
- Column-by-column null percentages
- Min/Max ranges for dates and numerical metrics
- Primary & joinable keys
"""

import sqlite3
import json
import os
import sys

def profile_database(db_path: str, output_report_path: str):
    if not os.path.exists(db_path):
        print(f"Error: Database file not found at {db_path}")
        return

    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Get all table names
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite_")]

    print(f"Discovered {len(tables)} tables in database: {tables}\n")
    report = {"database_path": db_path, "tables": {}}

    for table in tables:
        print(f"[*] Profiling table: {table} ...")
        table_info = {}
        
        # 1. Total row count
        cursor.execute(f"SELECT COUNT(*) FROM `{table}`;")
        total_rows = cursor.fetchone()[0]
        table_info["total_rows"] = total_rows

        # 2. Table PRAGMA table_info
        cursor.execute(f"PRAGMA table_info(`{table}`);")
        cols = cursor.fetchall()
        # cid, name, type, notnull, dflt_value, pk
        columns = [{"name": c[1], "type": c[2], "pk": c[5]} for c in cols]
        table_info["columns"] = columns

        # 3. Column stats (Nulls, distincts, min, max)
        col_stats = {}
        if total_rows > 0:
            for col in columns:
                col_name = col["name"]
                try:
                    cursor.execute(f"SELECT COUNT(*) FROM `{table}` WHERE `{col_name}` IS NULL OR `{col_name}` = '';")
                    null_count = cursor.fetchone()[0]
                    null_pct = round((null_count / total_rows) * 100, 2)

                    cursor.execute(f"SELECT COUNT(DISTINCT `{col_name}`) FROM `{table}`;")
                    distinct_count = cursor.fetchone()[0]

                    stat = {
                        "type": col["type"],
                        "null_count": null_count,
                        "null_pct": null_pct,
                        "distinct_count": distinct_count,
                        "is_pk": bool(col["pk"])
                    }

                    # If date or numeric, get min/max
                    col_type_upper = col["type"].upper() if col["type"] else ""
                    if any(t in col_type_upper for t in ["INT", "REAL", "FLOAT", "NUM", "DATE", "TIME"]) or "date" in col_name.lower() or "time" in col_name.lower():
                        try:
                            cursor.execute(f"SELECT MIN(`{col_name}`), MAX(`{col_name}`) FROM `{table}` WHERE `{col_name}` IS NOT NULL AND `{col_name}` != '';")
                            min_val, max_val = cursor.fetchone()
                            stat["min_value"] = str(min_val)
                            stat["max_value"] = str(max_val)
                        except Exception:
                            pass

                    col_stats[col_name] = stat
                except Exception as e:
                    col_stats[col_name] = {"error": str(e)}

        table_info["column_statistics"] = col_stats
        
        # 4. Sample 3 rows
        try:
            cursor.execute(f"SELECT * FROM `{table}` LIMIT 3;")
            sample_rows = cursor.fetchall()
            col_names = [c["name"] for c in columns]
            table_info["sample_records"] = [dict(zip(col_names, row)) for row in sample_rows]
        except Exception as e:
            table_info["sample_records"] = []

        report["tables"][table] = table_info

    conn.close()

    # Save report
    with open(output_report_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, default=str)
    
    print(f"\n[+] Profiling complete! Output written to {output_report_path}")
    return report

if __name__ == "__main__":
    db_file = sys.argv[1] if len(sys.argv) > 1 else "external_dataset/td_V2.db"
    out_file = sys.argv[2] if len(sys.argv) > 2 else "external_dataset/td_dataset_profile.json"
    profile_database(db_file, out_file)
