# Build Notes

## 2026-09-10

- The user supplied a complete product specification and requested an autonomous end-to-end build.
- Rules were acknowledged explicitly after live Devpost review; the account is already registered.
- Planning was handed off with no look-at-it pauses. The specification already fixes the wow moment: two governed calls transform an unknown blocker into a verified next step without overstating resolution.
- The implementation is locked to P0. Scheduled calls, CSV import, analytics, notifications, and external dealership integrations remain outside this build.
- Checklist deepening rounds: 0. The source specification already contains detailed scope, failure modes, acceptance tests, and a four-day plan.

## 2026-09-11

- Recovered the interrupted Codex CLI build at the exact publication boundary; no implementation work was restarted.
- Re-ran `npm run verify`: lint and type checking passed, 19 tests passed, and Next.js 16.3.4 produced the complete optimized route set.
- Verified `https://vinrelease.vercel.app` returns HTTP 200, identifies VINRelease, and exposes case 4821 in `demo` mode at `READY_TO_CONTACT`.
- Confirmed `vivekyarra/vinrelease` is public on `main` and contains no tracked `.env.local` or real CALL-E credential.
- Opened CALL-E gallery PR #463, rebased it onto current upstream `main`, resolved additive README conflicts, reran its two tests, type check, replay, and repository validator, then verified GitHub reports it mergeable.
- Captured deployed resolved and human-stop screenshots and updated the Devpost draft with public links, asset choices, and a strict proof boundary.
- The autonomous implementation checklist is complete. Real-phone proof remains a separate external verification gate because no consenting recipient number is configured; video upload and Devpost submission also remain pending.
- Added an explicit live-proof runner that can create at most one idempotent CALL-E task only with live mode, a configured consenting recipient, a fresh run label, and a per-run confirmation flag. It prints a redacted provider/result receipt for the demo recording.
- Pinned the SDK client to CALL-E's official API host and removed an unverified consent assertion from the outbound task text. Two new prompt-boundary tests bring the application suite to 21 passing tests.
- Preserved the user's standing 10% Codex usage reserve rule in `AGENTS.md` and a cross-chat memory note.
- CALL-E rejected the first live-proof request before dialing because nullable JSON Schema union types were unsupported; no call ID existed for that request. Replaced those provider-wire fields with documented plain string types, normalized empty strings to domain nulls locally, and added tests for malformed dates.
- `npm run verify` then passed lint, typecheck, 23 tests, and production build. A single fresh live request to the user-controlled number created CALL-E call `call_rkZ1HkMxxjswZKSx1CjCkA` and reached terminal `completed` with a schema-valid `needs_human` result and three evidence items. The respondent indicated the synthetic case could be located but did not provide the blocker/owner before the call ended; no business resolution was claimed.
