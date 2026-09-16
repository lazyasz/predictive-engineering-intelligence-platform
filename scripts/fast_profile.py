"""
Fast Multi-Column Profiler for The Technical Debt Dataset
=========================================================
Uses single-pass SQL aggregations per table instead of column-by-column full table scans.
Runs in seconds even on 1.8M-row tables.
"""

import sqlite3
import json
import os
import sys
import time

def fast_profile(db_path: str, output_path: str):
    start_time = time.time()
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    cursor.execute("SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;")
    tables = [row[0] for row in cursor.fetchall() if not row[0].startswith("sqlite_")]
    print(f"Discovered {len(tables)} tables: {tables}")

    report = {
        "database_path": db_path,
        "database_size_bytes": os.path.getsize(db_path),
        "database_size_mb": round(os.path.getsize(db_path) / (1024 * 1024), 2),
        "tables": {}
    }

    for table in tables:
        t0 = time.time()
        print(f"[*] Profiling {table}...")
        cursor.execute(f"SELECT COUNT(*) FROM `{table}`;")
        total_rows = cursor.fetchone()[0]

        cursor.execute(f"PRAGMA table_info(`{table}`);")
        cols = cursor.fetchall()
        columns_meta = [{"cid": c[0], "name": c[1], "type": c[2], "notnull": bool(c[3]), "dflt_value": c[4], "pk": bool(c[5])} for c in cols]

        col_stats = {}
        if total_rows > 0:
            # Single-pass aggregation for nulls and min/max
            select_clauses = []
            for col in columns_meta:
                cname = col["name"]
                ctype = col["type"].upper() if col["type"] else ""
                # Count non-null, non-empty
                select_clauses.append(f"COUNT(CASE WHEN `{cname}` IS NOT NULL AND `{cname}` != '' THEN 1 END) AS `{cname}__non_null`")
                # Min / Max
                if any(t in ctype for t in ["INT", "REAL", "FLOAT", "NUM", "DATE", "TIME"]) or "date" in cname.lower() or "time" in cname.lower():
                    select_clauses.append(f"MIN(`{cname}`) AS `{cname}__min`")
                    select_clauses.append(f"MAX(`{cname}`) AS `{cname}__max`")

            agg_sql = f"SELECT {', '.join(select_clauses)} FROM `{table}`"
            cursor.execute(agg_sql)
            agg_row = cursor.fetchone()
            col_names_desc = [d[0] for d in cursor.description]
            agg_results = dict(zip(col_names_desc, agg_row))

            for col in columns_meta:
                cname = col["name"]
                non_null_count = agg_results.get(f"{cname}__non_null", 0)
                null_count = total_rows - non_null_count
                null_pct = round((null_count / total_rows) * 100, 2)
                min_val = agg_results.get(f"{cname}__min")
                max_val = agg_results.get(f"{cname}__max")

                stat = {
                    "type": col["type"],
                    "null_count": null_count,
                    "null_pct": null_pct,
                    "is_pk": col["pk"]
                }
                if min_val is not None:
                    stat["min_value"] = str(min_val)
                if max_val is not None:
                    stat["max_value"] = str(max_val)

                col_stats[cname] = stat

        # Get 3 sample rows
        cursor.execute(f"SELECT * FROM `{table}` LIMIT 3;")
        samples = cursor.fetchall()
        col_names = [c["name"] for c in columns_meta]
        sample_records = [dict(zip(col_names, row)) for row in samples]

        table_info = {
            "total_rows": total_rows,
            "columns": columns_meta,
            "column_statistics": col_stats,
            "sample_records": sample_records,
            "profiling_time_sec": round(time.time() - t0, 2)
        }
        report["tables"][table] = table_info
        print(f"[+] {table}: {total_rows:,} rows profiled in {table_info['profiling_time_sec']}s")

    conn.close()
    report["total_profiling_time_sec"] = round(time.time() - start_time, 2)

    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, default=str)

    print(f"\n[SUCCESS] Completed fast profiling in {report['total_profiling_time_sec']}s. Saved to {output_path}")
    return report

if __name__ == "__main__":
    db = sys.argv[1] if len(sys.argv) > 1 else "external_dataset/td_V2.db"
    out = sys.argv[2] if len(sys.argv) > 2 else "external_dataset/td_dataset_profile.json"
    fast_profile(db, out)
