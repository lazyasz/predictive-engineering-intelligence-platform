---
name: gsd-planner
description: >-
  Use this skill when planning complex engineering tasks, multi-step refactorings,
  or feature additions requiring tight milestone tracking and verifiable execution steps.
---

# GSD (Get Shit Done) Planning & Execution Workflow

This workflow provides a rapid, high-impact structure for executing multi-phase engineering tasks with zero drift.

## Phase 1: Rapid Discovery & Boundary Definition
1. Identify the exact scope of changes required.
2. Locate all relevant files, imports, schemas, and test harnesses.
3. List explicit constraints (e.g., Python 3.10+ compatibility, React 19 compatibility, backward compatibility of database models).

## Phase 2: Milestone Blueprint
Break down the task into numbered, linear milestones:
- **Milestone 1**: Core Data / Schema / API contracts
- **Milestone 2**: Business Logic / Processing / Calculations
- **Milestone 3**: UI / Client-Side Integration & Reactive State
- **Milestone 4**: Automated Verification & End-to-End Testing

## Phase 3: Fast Execution & Verification Cycle
For each milestone:
1. Implement the minimal, clean code required.
2. Run targeted tests immediately (e.g., `pytest backend/tests/test_specific.py` or `npm run build`).
3. Confirm status before proceeding to the next milestone.
4. If a regression occurs, fix immediately within the milestone context.

## Phase 4: Final Wrap-up & Validation
1. Run complete project validation suite.
2. Ensure clean formatting, zero dead code, and updated docs where necessary.
