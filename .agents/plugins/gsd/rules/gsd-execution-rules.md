# GSD (Get Shit Done) — Execution & Delivery Rules

The GSD methodology focuses on relentless forward momentum, laser clarity, minimal overhead, and verified delivery.

## Core Directives

1. **No Speculation Without Verification**:
   - Inspect files and run tests before assuming bugs or code paths.
   - Ground every decision in active codebase evidence.

2. **Atomic Execution Milestones**:
   - Break large requests into discrete, self-contained milestones.
   - Finish, test, and verify Milestone $N$ before beginning Milestone $N+1$.

3. **Zero Phantom Changes**:
   - Only modify files that directly contribute to the goal.
   - Do not leave unused imports, unlinked dependencies, or orphaned functions.

4. **Self-Healing Loop**:
   - If a build or test fails, diagnose the root cause immediately and fix it in place before moving on.
   - Never skip tests or silence errors to simulate completion.
