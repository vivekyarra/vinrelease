# Build Checklist

## Build Preferences

- **Build mode:** Autonomous
- **Comprehension checks:** N/A
- **Git:** Commit at the verified MVP boundary
- **Verification:** Automated throughout; one final rendered-browser checkpoint
- **Check-in cadence:** Speed-run

## Checklist

- [x] **1. Establish the runnable product foundation**
  Spec ref: `spec.md > Technical Specification`
  What to build: Create the Next.js TypeScript app, visual system, environment contract, repository boundary, and seeded case.
  Acceptance: The app starts without secrets and exposes case 4821 in demo mode.
  Verify: Install dependencies, typecheck, and run the initial page.

- [x] **2. Implement the title-resolution domain**
  Spec ref: `VINRelease_Product_Specification.md > Case state machine and Resolution engine specification`
  What to build: Define strict case, contact, call, result, evidence, transition, and review schemas plus deterministic transition rules.
  Acceptance: Every declared result maps to a safe next state and unsupported results stop for a human.
  Verify: Run focused state-engine and result-validation tests.

- [x] **3. Enforce call governance**
  Spec ref: `VINRelease_Product_Specification.md > Safety, privacy, and trust specification`
  What to build: Add approved-contact checks, disclosure budgets, regenerated previews, explicit confirmation, and stable idempotency keys.
  Acceptance: Unapproved contacts, forbidden disclosure, and duplicate calls cannot escape the server boundary.
  Verify: Run safety and idempotency tests.

- [x] **4. Integrate CALL-E and deterministic demo execution**
  Spec ref: `VINRelease_Product_Specification.md > CALL-E agent contract`
  What to build: Add the official TypeScript SDK adapter, strict schema, live status polling, canonical result normalization, and a provider-free fixture adapter.
  Acceptance: Live mode calls CALL-E at runtime; demo mode cannot dial and produces equivalent validated domain results.
  Verify: Run provider-contract tests and inspect the installed SDK types.

- [x] **5. Build the case workflow API**
  Spec ref: `VINRelease_Product_Specification.md > API surface`
  What to build: Implement case list/detail, reset, preview, authorization, task status, and webhook endpoints.
  Acceptance: The complete two-call demo updates one canonical case and persists evidence without duplicate tasks.
  Verify: Run route/integration tests against the demo repository.

- [x] **6. Build the judge-facing dashboard and case workspace**
  Spec ref: `VINRelease_Product_Specification.md > Product screens`
  What to build: Create a polished exception dashboard, case detail, operational timeline, blocker ownership, aging/value context, and evidence drawer.
  Acceptance: The first viewport explains the pain and lets a judge enter the demo case immediately.
  Verify: Run the app and inspect desktop and mobile layouts.

- [x] **7. Build authorization, call progress, and human-stop experiences**
  Spec ref: `VINRelease_Product_Specification.md > Call Authorization and Live Call Progress`
  What to build: Add disclosure preview, confirmation control, progress feedback, validated result cards, chained next action, reset, and review states.
  Acceptance: Two authorized demo calls reach `WAITING_EXTERNAL`; ambiguity reaches `NEEDS_HUMAN`.
  Verify: Exercise both paths in a browser and assert no console or network errors.

- [x] **8. Complete engineering and safety verification**
  Spec ref: `prd.md > Acceptance requirements`
  What to build: Finish meaningful unit/integration coverage, linting, type checks, production build, and secret scan.
  Acceptance: All checks pass and no credential reaches client bundles or tracked files.
  Verify: Run the project verification command and inspect the production build.

- [x] **9. Produce product and contribution documentation**
  Spec ref: `VINRelease_Product_Specification.md > Repository specification`
  What to build: Write README, architecture, safety, demo scenario, contribution metadata, and exact local/live setup.
  Acceptance: A new reviewer can run demo mode and understand how live CALL-E is exercised.
  Verify: Follow the README from a clean install and check every referenced file/command.

- [x] **10. Prepare Devpost handoff**
  Spec ref: `prd.md > Submission proof points`
  What to build: Produce submission copy, a timed demo script, testing instructions, screenshot plan, and a readiness report that clearly separates verified proof from pending external actions.
  Acceptance: The project has enough truthful material for a Devpost draft and required upstream PR.
  Verify: Cross-check every claim against runtime evidence and official requirements.
