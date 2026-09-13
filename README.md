# VINRelease

The auction says "pending." The lienholder says "sent." The dealership still has no title. VINRelease gives a title clerk something more useful than another call summary: an approved next contact, evidence behind each case move, and a clear stop when the answer is not good enough.

It is a narrow CALL-E-powered desk for overdue vehicle-title exceptions, not a general dealership CRM or a claim that AI can issue titles.

- **Watch the walkthrough:** https://youtu.be/8X7ERrB8qbo
- **Try the public app:** https://vinrelease.vercel.app
- **CALL-E gallery pull request:** https://github.com/CALLE-AI/awesome-phone-call-agents/pull/463
- **Narrated local MP4 (with real title-clerk listing):** [artifacts/vinrelease-demo-final.mp4](artifacts/vinrelease-demo-final.mp4)

## One case, three outcomes

The public demo begins with a synthetic, overdue 2019 BMW 330i and $18,700 of inventory blocked. An authorized auction result identifies a missing lien release and names ABC Bank as the next party. A separately authorized bank result supplies reference `LR-4721`, but only says the release was sent. VINRelease therefore moves to `WAITING_EXTERNAL`, not "closed." Reset and choose **Unsupported credential request** to see the other outcome: the agent refuses the request and routes the case to a title clerk.

Those results are deterministic **no-call replays**, so judges can test the entire flow without dialing a stranger or consuming CALL-E credits. The $18,700 is example inventory value, not measured savings.

### Separate real CALL-E proof

One CALL-E call to a user-controlled test number completed on September 11, 2026 (`call_rkZ1HkMxxjswZKSx1CjCkA`). It returned three evidence items and a schema-valid `needs_human` result. The person indicated the synthetic case could be located, then the conversation ended before the blocker or next owner was established. This proves the SDK executed a real phone task and that incomplete evidence did **not** advance the case. It does not prove that a real title was released; it is separate from the public replay and its video.

## Why the state machine matters

A title clerk needs to know what blocks issuance, who owns the next move, and what was actually confirmed. A fluent phone summary alone cannot answer those questions safely. VINRelease treats a structured CALL-E result as input to a deterministic resolution engine. "Sent" is not "physically received"; unknown, contradictory, or unsafe answers go to a person.

Each call preview shows the provisioned recipient, purpose, allowed facts, forbidden disclosures, and expected case movement. Approval is bound to that preview. The server creates at most one task per approved action and idempotency key; the provider result is validated before any transition is recorded. The case timeline links state changes back to phone evidence.

## Try the judge path

Open the [public app](https://vinrelease.vercel.app) and confirm the header reads **Safe demo**. Click **Resolve next blocker**, review the masked Metro Auto Auction recipient and disclosure packet, check authorization, and start the safe replay. The case should become **Next call ready** with **Lien release missing** and ABC Bank as next owner. Authorize the separate ABC Bank replay; the case should become **Waiting external** with `LR-4721` in its evidence, never closed. Reset, select **Unsupported credential request**, authorize, and confirm **Needs title clerk**.

No real call is placed by the public deployment. The [roughly 1:59 narrated walkthrough](https://youtu.be/8X7ERrB8qbo) opens with footage of a Trailside RV Center title-clerk posting, then shows actual browser pointer movement, clicks, and state changes in VINRelease. The posting establishes that dealerships hire staff for outstanding-title follow-up; it does not imply Trailside uses VINRelease or that VINRelease performs the full billing and titling role. The video does not represent the replay as a live phone conversation.

## Run locally

Requires Node.js 20 or newer.

```bash
npm install
npm run verify
npm run dev
```

Open `http://localhost:3000`. The default mode is the same safe replay. `npm run verify` runs lint, TypeScript, 23 Vitest tests, and a production build. The tests cover allowed contacts, disclosure limits, idempotency, provider-result validation, conservative transitions, webhook deduplication, both replay calls, the human stop, and serverless demo reconstruction. See [testing instructions](docs/TESTING.md) and [architecture notes](docs/ARCHITECTURE.md).

## Opt-in live CALL-E mode

Copy `.env.example` to `.env.local` and set server-side credentials and **controlled or explicitly consenting** E.164 destinations:

```dotenv
VINRELEASE_MODE=live
CALLE_API_KEY=your_server_side_key
CALLE_AUCTION_PHONE=+15551234567
CALLE_AUCTION_REGION=US
CALLE_AUCTION_LOCALE=en-US
CALLE_LIENHOLDER_PHONE=+15557654321
CALLE_LIENHOLDER_REGION=US
CALLE_LIENHOLDER_LOCALE=en-US
PUBLIC_BASE_URL=https://your-public-host.example
VINRELEASE_LIVE_RUN_ID=team-controlled-proof-01
```

For one guarded proof task, choose a fresh `VINRELEASE_LIVE_RUN_ID`, confirm the recipient is yours or has consented, then run:

```bash
npm run verify:live -- --confirm-one-real-call
```

The command refuses to dial without live mode, the API key, a valid provisioned destination, a fresh run label, and the explicit flag. It prints the CALL-E call ID, waits for the terminal result, and validates the same structured schema as the app. Reusing a run label reuses its idempotency key. The official CALL-E host is pinned; the key is never sent to a configurable alternate endpoint.

In the UI, live calls additionally require approval of the exact masked recipient and disclosure packet. The CALL-E task identifies itself as an automated assistant and cannot provide credentials, payment details, fees, legal representations, or invented facts. Terminal webhooks are deduplicated and reconciled against the canonical Calls API. Resetting the local case view does **not** cancel a queued or active provider call; cancellation belongs in the CALL-E dashboard.

## Boundaries

The public build is intentionally a replay. Live case storage is in-process and is not a durable multi-dealership backend. Before production use, this needs persistent case storage, authenticated operator roles, deployment-specific contact governance, and a trusted receipt signal before closing a title case. Medical, emergency, legal-decision, payment, debt-collection, and identity-verification calls are outside this workflow.

Built for **CALL-E: Your Code Is Calling**. [Demo script](JUDGE_READY_3_MINUTE_DEMO_VIDEO_SCRIPT.md) · [MIT License](LICENSE).
