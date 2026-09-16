---
name: roo-orchestrator
description: >-
  Use this skill when tackling multi-disciplinary software engineering tasks that require
  switching between Architectural Design, Code Implementation, Root-Cause Debugging, and Test Engineering.
---

# Roo Code Multi-Model Orchestration Workflow

## Workflow Steps

### Step 1: Mode Selection
Assess the user's prompt and activate the appropriate mode:
- **Architecture / System Design**: Activate Architect Mode
- **Feature Writing / Refactoring**: Activate Code Mode
- **Error Resolution / Failing Tests**: Activate Debug Mode
- **Validation / Quality Assurance**: Activate Test Mode

### Step 2: Context Gathering & Lens Application
- Read relevant files through the lens of the active mode.
- In **Architect Mode**: Focus on directory structures, schemas, API routes, and data flows.
- In **Code Mode**: Focus on implementation logic, function signatures, state management, and edge cases.
- In **Debug Mode**: Focus on logs, stack traces, exceptions, and breaking inputs.

### Step 3: Action Execution
- Execute according to mode-specific standards.
- If switching modes (e.g., transitioning from Architect to Code to Test), explicitly state the transition to keep alignment clear.
