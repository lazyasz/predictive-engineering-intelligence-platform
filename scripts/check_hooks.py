import os
import re

src_dir = "frontend/src"
issues = []

for root, _, files in os.walk(src_dir):
    for f in files:
        if f.endswith(".jsx") or f.endswith(".js"):
            path = os.path.join(root, f)
            with open(path, "r", encoding="utf-8") as fp:
                content = fp.read()
            
            # Extract header imports before component functions
            lines = content.splitlines()
            import_lines = [l for l in lines if l.startswith("import ")]
            import_block = "\n".join(import_lines)
            
            for hook in ["useState", "useEffect", "useRef", "useCallback", "useMemo", "useContext"]:
                if re.search(r"\b" + hook + r"\s*\(", content):
                    # Check if imported from 'react'
                    if hook not in import_block and f"React.{hook}" not in content:
                        issues.append((path, hook))

if issues:
    print("ISSUES FOUND:")
    for path, hook in issues:
        print(f"  - {path}: missing import for {hook}")
else:
    print("NO HOOK IMPORT ISSUES FOUND.")
