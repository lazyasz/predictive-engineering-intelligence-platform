# Ralph Loop — Autonomous Loop Rules & Guardrails

The Ralph Loop enables continuous, long-running agent execution until an objective is 100% completed and validated.

## Core Rules

1. **Explicit Completion Criteria (Definition of Done)**:
   - Every loop iteration must test against explicit completion criteria (e.g., all tests pass, build succeeds, zero unresolved linter errors).

2. **Loop Convergence Guard**:
   - Track progress after each action.
   - If consecutive iterations make zero progress on the same error (plateau detection), break the loop and try an alternative strategy.

3. **Incremental State Checkpointing**:
   - Keep changes modular.
   - Run verification commands frequently so errors are caught immediately after introduction.

4. **Self-Correction Discipline**:
   - Analyze failure logs comprehensively. Do not guess fixes blindly.
   - Read the relevant documentation or source lines before applying a patch.
