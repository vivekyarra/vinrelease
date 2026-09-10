# Devpost submission draft

## Project name

VINRelease

## Tagline

The evidence-first phone agent that unblocks dealership titles.

## Track

Most Practical

## Inspiration

Used-car dealerships can buy and transport a vehicle in days, then lose weeks because its title is trapped between an auction, a lienholder, and a small operations team. The digital system often says only “pending.” The missing facts live behind phone trees. We built VINRelease to make those calls useful without letting an agent overstate what happened or disclose information it should not share.

## What it does

VINRelease turns one overdue title into a controlled evidence workflow. It identifies the one approved party to call, shows a human the exact recipient and disclosure packet, asks CALL-E for a strict structured result, and advances a deterministic case state only when that result supports the move. The demo follows an auction call that identifies a missing lien release, then a lienholder call that provides a transmission reference. VINRelease deliberately keeps the case waiting because “sent” is not proof of receipt. Unsafe or unknown requests stop with a title clerk.

## How we built it

The product is a Next.js and TypeScript application using the official `@call-e/calle` SDK. CALL-E receives a purpose-built call task, a pre-provisioned E.164 recipient, metadata, a stable idempotency key, and a strict recipient result schema. Zod validates the returned structure. A pure resolution engine converts evidence into a small set of case states and appends an evidence-linked transition. The public deployment uses a deterministic no-call provider and an HTTP-only scenario cookie so the complete replay remains reliable on serverless infrastructure.

## Challenges

The hardest design problem was deciding what a phone result is allowed to prove. A natural-language summary that says a release was sent sounds successful, but a dealership still cannot sell the vehicle until the title is received. We encoded that distinction directly in the state machine. We also made authorization specific to a hashed preview so a changed destination or disclosure packet requires fresh approval.

## Accomplishments

- A complete two-party exception-resolution workflow with visible phone evidence.
- An explicit per-call authorization screen with masked destinations and minimum disclosure.
- Strict structured result validation and conservative state transitions.
- Stable idempotency and webhook deduplication with canonical Calls API reconciliation.
- A deterministic public demo plus a separate opt-in live CALL-E path.
- Automated coverage for success, malformed evidence, duplicate delivery, and human-stop behavior.

## What we learned

The valuable output of a phone agent is not a transcript by itself. It is a bounded claim with provenance that downstream software can safely act on. We also learned that believable automation needs visible limits: showing why the system did not close a case builds more trust than a polished but unsupported “success.”

## What's next

The next adapter is durable Postgres storage for multi-dealership use, followed by dealer-management-system intake, configurable call windows, and a receipt-confirmation job. We would also add role-based approval and an audit export for title compliance teams.

## Testing instructions

Open the public demo, verify **Safe demo** in the header, and run the two authorized calls. Expand each evidence record and confirm the final state is **Waiting external** with reference `LR-4721`. Reset, choose **Unsupported credential request**, and confirm the workflow stops at **Needs title clerk**. The public demo places no calls.

## CALL-E account email

vivekyarra567@gmail.com

## Links to add before submission

- Public demo: pending deployment
- Source code: pending publication
- Required awesome-phone-call-agents pull request: pending publication
- Video: pending recording/upload
