# VINRelease

## One-line Summary

An evidence-first phone agent that chases overdue vehicle titles, identifies the next responsible party, and refuses to mistake a promised release for a received title.

## Problem

A used-car dealership can pay for and transport a vehicle while its title remains trapped between an auction, a lienholder, and a title clerk. The status portal often says only "pending." Staff spend hours calling for the one missing fact: what is blocking issuance, who owns the next action, and what evidence supports that answer?

## Solution

VINRelease turns that exception into a governed call workflow. The operator sees the exact approved recipient, purpose, and minimum disclosure packet before each call. CALL-E makes the call and extracts a typed result. A deterministic resolution engine records evidence, names the next owner, and advances the case only when the result supports the transition. If evidence is missing or a request falls outside the approved facts, the case stops for a title clerk.

## Why This Matters

The product targets a specific back-office bottleneck with a clear operational value: reducing unproductive status chasing without turning ambiguous phone conversation into a false completion claim. The example case has $18,700 of inventory blocked by a title exception. That figure is fixture context, not a measured savings claim.

## How We Used AI

The application uses CALL-E's official TypeScript SDK at runtime to create a real phone task for a provisioned recipient. The task bounds the agent's role, disclosure, questions, and prohibited actions. CALL-E's voice agent handles the conversation and produces a recipient-level structured result. VINRelease validates that result locally before its deterministic state machine acts on it. A real CALL-E call completed on September 11, 2026: `call_rkZ1HkMxxjswZKSx1CjCkA`. It reached a person who indicated the synthetic case could be located, but the conversation ended before the blocker or owner was established. CALL-E supplied three evidence items and correctly returned `needs_human`; VINRelease's schema validation passed. This real call is separate from the scripted public demo replay.

## How We Used Codex

Codex helped turn the product specification into a Next.js application, implement the authorization and evidence state machine, write and run tests, inspect the installed CALL-E SDK and current API reference, fix an actual provider-schema rejection before dialing, validate a real terminal call result, check the deployed product, and prepare the upstream gallery contribution. The development process kept unsupported outcomes as explicit human handoffs instead of treating a fluent AI summary as proof.

## Key Features

- One approved next call at a time, with a masked recipient, purpose, disclosure budget, and explicit operator authorization.
- Stable idempotency key plus webhook deduplication and canonical Calls API reconciliation.
- Strict provider-wire extraction normalized to a stricter local domain schema; malformed or unsupported evidence cannot silently advance a case.
- Evidence-linked transitions from unknown blocker to lienholder follow-up, then `WAITING_EXTERNAL` after a release reference. "Sent" is not "received."
- A human-stop path for credential requests or uncertain facts.
- A safe, resettable public replay that places no calls, plus an opt-in guarded command for real CALL-E proof.

## Architecture

Next.js 16 and TypeScript serve the case workspace and API. The server owns contact allowlists, disclosure decisions, preview-bound authorization, and CALL-E credentials. `@call-e/calle` creates and polls live calls. Zod validates the structured result; a pure resolution engine maps only supported evidence to a state transition. The public demo uses an HTTP-only scenario cookie and deterministic fixtures so judges can replay both branches without causing phone side effects. The live in-process repository is a prototype limitation, not multi-user production storage.

## Testing Instructions

Open https://vinrelease.vercel.app and verify the header says **Safe demo**. Select **Resolve next blocker**, inspect the masked Metro Auto Auction recipient and disclosure packet, check the authorization box, and start the safe replay. The case should become **Next call ready** with **Lien release missing**. Authorize the ABC Bank replay; the case should become **Waiting external** with reference `LR-4721`, not closed. Reset, select **Unsupported credential request** in the first preview, authorize, and verify **Needs title clerk**. No phone call is placed by this public deployment. To run locally: `npm install`, `npm run verify`, `npm run dev`. A separate live proof requires a server-side API key, a controlled/consenting recipient, and the explicit guarded `verify:live` command documented in the repository.

## Public Demo Link

https://vinrelease.vercel.app

## Public Repository Link

https://github.com/vivekyarra/vinrelease

## Demo Video

TODO: Upload the 1:43 real-browser VINRelease walkthrough in `artifacts/vinrelease-demo-final.mp4` to YouTube or Vimeo, set it public, and place the URL here. The local MP4 and GitHub file are not substitutes for the required public video link.

The sub-two-minute walkthrough shows the stalled title and value at risk; the governed auction preview and safe replay; the lienholder replay and conservative `WAITING_EXTERNAL`; and the credential-request stop. Its ElevenLabs narration accurately distinguishes the separate real CALL-E task and what it did *not* prove. All pictured app interactions, pointer movements, clicks, and hovers come from the deployed browser, not a slideshow.

## Screenshot Shot List

1. `artifacts/production-resolved.png` - deployed two-call result, reference, and conservative waiting state.
2. `artifacts/authorization.png` - masked destination, allowed fields, and explicit authorization.
3. `artifacts/production-human-stop.png` - credential request routed to the title clerk.
4. `artifacts/mobile.png` - responsive workspace.

## Submission Readiness Notes

Verified: public demo and source are reachable; [CALL-E gallery PR #463](https://github.com/CALLE-AI/awesome-phone-call-agents/pull/463) is open and mergeable; the real CALL-E call reached terminal `completed` with a schema-valid `needs_human` result; 23 application tests, lint, typecheck, and production build passed on September 11. The production demo's full two-call and human-stop paths were clicked and observed. The real phone result did **not** identify the title blocker or responsible organization. No release or title receipt is claimed from it.

Pending: final public video URL; final Devpost form write/readback; submitter eligibility declarations. Do not present the public replay as a recording of the live phone call.

## Known Limitations

The public build is intentionally no-call. The live mode's repository is in-process and is not durable across serverless instances; it is not a production multi-dealership system. The live proof call reached a person but ended before the blocker was identified. No real dealership data, realized savings, or completed title transfer has been demonstrated.

## TODO Official Form Fields

- Submitter Type (27798): pending user's declaration.
- Country of residence (27799): pending user's declaration.
- App status (27801): Newly created.
- If pre-existing, explanation (27802, marked required even for a new app): "Not applicable - VINRelease was newly created during this hackathon."
- Testing instructions (27803): use the **Testing Instructions** above.
- Optional functional demo URL (27804): https://vinrelease.vercel.app
- Project submission pull request URL (27833): https://github.com/CALLE-AI/awesome-phone-call-agents/pull/463
- CALL-E account email (27831): vivekyarra567@gmail.com
- Primary use case (27807): Order / exception follow-up.
- Real-world task (27808): "VINRelease calls approved auction and lienholder contacts to identify and track the blocker preventing an overdue vehicle title from being issued."
- Eligible Age (27809), Country eligibility (27810), Conflict of interest (27811): pending user's declarations; never assume.
