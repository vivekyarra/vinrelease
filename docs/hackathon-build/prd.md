# VINRelease Product Requirements

## User outcome

A title clerk can open an overdue case, understand its cost and current blocker, authorize only approved phone work, and receive a verified next step instead of another unstructured transcript.

## Primary flow

1. View seeded case 4821 and its approved Metro Auto Auction contact.
2. Inspect the exact purpose, permitted disclosures, forbidden actions, and expected transition.
3. Authorize the call. Demo mode replays a clearly labeled fixture; live mode invokes CALL-E server-side.
4. Validate the structured result and show the evidence-backed transition to `READY_FOR_NEXT_CALL`.
5. Authorize the newly available ABC Bank call.
6. Record reference `LR-4721` and transition to `WAITING_EXTERNAL` with receipt explicitly unconfirmed.

## Acceptance requirements

- The interface explains the product from its first viewport.
- Unapproved contacts and unconfirmed previews cannot dial.
- Duplicate authorization returns the existing task.
- Invalid or ambiguous results create human review and never silently advance a case.
- Demo mode has no code path that calls the provider.
- Live credentials remain server-side.
- The public demo provides a resettable, deterministic path without arbitrary dialing.
- Unit and integration tests cover transitions, schemas, disclosure controls, idempotency, and the complete demo flow.

## Submission proof points

- Runtime CALL-E client import and call creation are visible in code.
- README documents setup, safety, side effects, demo mode, and live verification.
- The repository contribution is shaped for `apps/typescript/vinrelease/`.
- A sub-three-minute script demonstrates the two-call resolution chain.
