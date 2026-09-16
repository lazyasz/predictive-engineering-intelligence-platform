---
name: coderabbit-review
description: >-
  Use this skill when conducting automated code reviews, PR reviews, git diff audits,
  security scans, or quality assessments of changed or existing code.
---

# CodeRabbit — Automated Code Review Workflow

## Workflow

### 1. Diff & Change Extraction
- Inspect git status, recent commits, or targeted files:
  - `git diff` / `git log -p -n 1`
  - Or target specific directories (e.g., `backend/`, `frontend/`, `ml_engine/`).

### 2. Multi-Vector Analysis
Analyze code across the five core dimensions:
1. **Security & Secrets**
2. **Correctness & Edge Cases**
3. **Performance & Memory**
4. **Maintainability & Clean Architecture**
5. **Test Coverage & Validation**

### 3. Review Report Generation
Format findings in a structured, actionable markdown format:

```markdown
# 🐰 CodeRabbit Code Review Summary

## 📊 Overview & Impact Assessment
- **Files Modified**: X
- **Risk Level**: Low / Medium / High / Critical
- **Overall Verdict**: Approved / Changes Requested

## 🔍 Detailed Findings

### 🔴 Critical / Security Issues
- **[file.py:L25](file:///...)**: Description of vulnerability + actionable fix diff.

### 🟡 Improvements & Optimization
- **[component.jsx:L40](file:///...)**: Description + recommendation.

### 🟢 Positive Observations
- Highlight clean patterns, effective test coverage, or good abstractions.

## 🛠️ Recommended Action Items
1. [ ] Action item 1
2. [ ] Action item 2
```
