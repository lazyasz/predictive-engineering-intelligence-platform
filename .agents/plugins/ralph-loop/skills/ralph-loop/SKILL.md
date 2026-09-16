---
name: ralph-loop
description: >-
  Use this skill for long-running, multi-step autonomous tasks, automated refactorings,
  and extensive test/build debugging loops where the agent must iterate until 100% completion.
---

# Ralph Loop — Autonomous Execution Engine

## Iteration Cycle

```mermaid
flowchart TD
    Start([Initialize Task]) --> Plan[Define Scope & Exit Condition]
    Plan --> Execute[Execute Current Iteration Step]
    Execute --> Verify[Run Automated Verification]
    Verify --> Check{Exit Criteria Met?}
    Check -- Yes --> Finalize[Generate Summary & Complete]
    Check -- No --> Analyze[Analyze Failure / Gaps]
    Analyze --> PlateauCheck{Stuck / No Progress?}
    PlateauCheck -- Yes --> Alternative[Switch Strategy / Alternative Path]
    PlateauCheck -- No --> Execute
    Alternative --> Execute
```

## Steps

### Step 1: Define the Exit Target
Clearly establish the exit condition:
- Automated tests passing: `pytest ...`
- Frontend build passing: `npm run build`
- Specific functional endpoint behaving as expected

### Step 2: Execute Iteration Step
- Implement the next prioritized change.
- Avoid batching too many unrelated changes in a single iteration.

### Step 3: Verify & Evaluate
- Run the verification command.
- If verified, check if all tasks in scope are complete.
- If incomplete or failing, parse the exact error and formulate the next iteration fix.

### Step 4: Termination
- Once all criteria pass with zero errors, terminate the loop and report final status.
