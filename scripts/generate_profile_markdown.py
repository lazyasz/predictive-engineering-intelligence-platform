import json

with open("external_dataset/td_dataset_profile.json", "r") as f:
    p = json.load(f)

print("# Profile Summary Report\n")
print(f"- **Total Database Size**: {p['database_size_mb']} MB")
print(f"- **Total Tables**: {len(p['tables'])}")
total_rows = sum(t["total_rows"] for t in p["tables"].values())
print(f"- **Total Rows Across Tables**: {total_rows:,}\n")

for tname, tinfo in p["tables"].items():
    print(f"### `{tname}` ({tinfo['total_rows']:,} rows)")
    cols = tinfo["columns"]
    print(f"**Total Columns**: {len(cols)}")
    print("| Column | Type | Null % | Range / Info |")
    print("| :--- | :--- | :--- | :--- |")
    for c in cols:
        cname = c["name"]
        cstat = tinfo["column_statistics"].get(cname, {})
        null_pct = cstat.get("null_pct", "0.0")
        min_v = cstat.get("min_value", "")
        max_v = cstat.get("max_value", "")
        rng = f"[{min_v} to {max_v}]" if (min_v or max_v) else "-"
        print(f"| `{cname}` | `{c['type']}` | {null_pct}% | {rng} |")
    print()
