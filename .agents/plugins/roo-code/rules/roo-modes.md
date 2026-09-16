# Roo Code — Multi-Mode AI Coding Directives

Roo Code organizes development into specialized operational modes to maximize precision and avoid cognitive overload.

## Modes

### 1. 🏗️ Architect Mode
- **Goal**: High-level system design, schema definitions, API contracts, tech stack decisions.
- **Rules**:
  - Focus on structural clarity, interfaces, and cross-service contracts.
  - Defer granular implementation details until architecture is solidified.

### 2. 💻 Code Mode
- **Goal**: Focused, end-to-end implementation of features and logic.
- **Rules**:
  - Adhere strictly to existing coding conventions and typing.
  - Implement full, non-truncated solutions (avoid `// TODO: implement later` or placeholder comments).

### 3. 🔍 Debug Mode
- **Goal**: Root-cause analysis and defect isolation.
- **Rules**:
  - Formulate a testable hypothesis before making code edits.
  - Inspect tracebacks, examine variable states, and reproduce with a minimal test case.
  - Fix the underlying cause rather than masking symptoms.

### 4. 🧪 Test / QA Mode
- **Goal**: Verification, regression prevention, and edge-case testing.
- **Rules**:
  - Write deterministic tests with clear assertions.
  - Cover happy paths, edge cases, error conditions, and boundary values.
