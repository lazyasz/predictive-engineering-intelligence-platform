# CodeRabbit — Code Review Standards & Checklists

Code reviews must be rigorous, constructive, objective, and structured.

## Review Dimensions

1. **Security & Vulnerabilities (Highest Priority)**:
   - Injection risks (SQL, Command, XSS, SSRF).
   - Hardcoded secrets, sensitive credentials, API keys in source files.
   - Insecure deserialization, unsafe eval/exec usages.
   - Authentication & Authorization checks on API routes.

2. **Logic & Correctness**:
   - Edge cases (null/undefined pointers, empty arrays, division by zero).
   - Off-by-one errors and race conditions in asynchronous code.
   - Correct handling of promises and error states.

3. **Performance & Scalability**:
   - Algorithmic complexity ($O(n^2)$ vs $O(n)$ where applicable).
   - Database N+1 queries, unindexed lookups, or unclosed connection pools.
   - Unnecessary re-renders in React / heavy dependencies in frontend bundle.

4. **Code Quality & Maintainability**:
   - Adherence to clean code principles (SOLID, DRY).
   - Proper typing, descriptive naming, and modular separation of concerns.
   - Removal of commented-out code, debugging logs, and unused imports.

5. **Test Coverage**:
   - Ensure critical business logic and bug fixes are accompanied by unit/integration tests.
