# VINRelease
## Product Requirements, Technical Specification, Hackathon Build Plan, and Success Definition

**Version:** 1.0  
**Date:** September 10, 2026  
**Target event:** CALL-E: Your Code Is Calling  
**Build posture:** Product-first, narrow scope, live phone workflow, evidence-backed automation  
**Status:** Scope locked for implementation

---

## Executive decision

VINRelease is an **AI title-exception desk for auto dealerships**. Its job is not to perform all vehicle titling. Its job is to investigate and advance the small but expensive set of title cases that are stuck after the normal digital process stops helping.

The core product promise is:

> **Give VINRelease a stuck vehicle-title case. It calls the authorized external parties, discovers the blocker, records evidence, determines the next allowed contact, and keeps the case moving until it is resolved or a human decision/document is required.**

The core insight is that modern title platforms are good at the happy path, but unresolved exceptions still create manual work: people wait on hold, ask for status, identify which organization owns the next action, write down reference numbers, set reminders, and call again. VINRelease is built specifically for that **exception tail**.

This is intentionally not a generic voice agent, chatbot, dealership CRM, customer-service bot, DMV copilot, or title-processing platform. The product is the **case-resolution state machine**. CALL-E is the real-world action layer that reaches organizations whose status is not available through a clean API.

### The one-sentence judge explanation

**“Software handles clean title transactions. VINRelease handles the ones that get stuck.”**

### The 10-second customer explanation

**“Drop in an overdue title case. VINRelease calls the auction or lienholder, finds the blocker, captures the reference, and tells your title clerk exactly what happens next.”**

### The product's north-star behavior

A successful VINRelease run does not merely produce a transcript. It produces a **verified state transition** such as:

`UNKNOWN BLOCKER -> LIEN RELEASE MISSING -> RELEASE SENT -> AUCTION REISSUE PENDING`

Every state change must be tied to phone evidence or an explicit human action.

---

# 1. Why this product exists

## 1.1 Customer pain

A dealership can own a vehicle, have money tied up in it, and still be unable to retail or cleanly transfer it because the title, lien release, duplicate title, payoff confirmation, or supporting document is delayed. The difficult cases are rarely solved by staring at the dealership management system. A title clerk or office manager starts chasing people.

The work commonly looks like this:

1. Open an aging-title spreadsheet or DMS report.
2. Find the vehicle and the last known note.
3. Determine who might be holding the process up.
4. Locate the right title desk or lien-release number.
5. Call.
6. Wait.
7. Repeat identifiers.
8. Ask for current status.
9. Discover that the first organization is waiting on somebody else.
10. Write down a reference number, promised date, or reason for rejection.
11. Update internal notes.
12. Set a follow-up reminder.
13. Call the next organization.
14. Repeat until the title is actually received or a human must intervene.

The administrative work has real economic weight because vehicles are inventory. Vendor Vitu markets accelerated payoff/title-release software on the basis that conventional title release can take 22+ days and that faster release reduces holding costs; it reports 4-6 day title release for its connected workflow and cites an average $36 per vehicle per day from its own savings-calculator data. These are vendor-reported numbers, not universal industry averages, but they validate the underlying mechanism: delay has a daily cost.

Greenlight Titles, an established title-service business, explicitly markets itself as handling the paperwork, phone calls, and follow-up for dealers, fleets, and finance companies. That is strong evidence that organizations already pay to outsource the exact class of manual work VINRelease targets.

## 1.2 Why existing digital title tools do not eliminate the wedge

The product must not pretend the automotive-title market is unsolved. It is not.

Dealertrack offers real-time payoff quotes from 300+ lenders and electronic payoff/title-release workflows. Vitu advertises a network of 170+ lenders and accelerated title services. These products are proof that the industry is digitizing the happy path.

VINRelease therefore **must not compete with them on the happy path**.

The wedge is:

> **Cases that remain unresolved after the known digital route has failed, become stale, return an exception, or involve an organization outside the integrated network.**

Examples:

- Auction says title was not received.
- Lien release is still outstanding.
- Lender says release was sent but auction says it never arrived.
- Seller-provided title paperwork is rejected.
- Duplicate title is required.
- Status is stale and nobody owns the next action.
- Title is supposedly mailed but no one recorded tracking or date.
- A payoff/title transaction has a short-pay/over-pay exception that requires human review.

VINRelease starts where normal workflow confidence ends.

## 1.3 Why a phone agent belongs here

CALL-E is not included for novelty. It is useful because title exceptions frequently cross organizational boundaries, and those external systems do not share a single normalized API.

CALL-E's public integration documentation supports goal-driven outbound calls, structured result schemas, live progress, evidence, transcripts, batch/scheduled calling, and real-world conditions including holds and transfers. VINRelease uses those capabilities as infrastructure, while keeping the business logic in VINRelease.

Without phone execution, VINRelease becomes another task tracker. Without the state machine, it becomes another phone demo. Both layers are required.

---

# 2. Product thesis and positioning

## 2.1 Product thesis

**The highest-value automation opportunity is not the title transaction itself; it is the exception-chasing labor that begins after structured systems stop producing a useful answer.**

## 2.2 Positioning statement

For dealership title teams that manage overdue or blocked vehicle titles, VINRelease is an exception-resolution workspace that autonomously performs authorized outbound status calls and converts each conversation into a verified next step. Unlike generic voice agents, title trackers, or digital-payoff platforms, VINRelease is purpose-built around a title-resolution graph and stops whenever legal judgment, money movement, identity verification, signatures, or unsupported facts are required.

## 2.3 What makes the product innovative

The innovation is **not** “AI can make phone calls.” Current CALL-E submissions already demonstrate structured phone calling in healthcare, vendor coordination, travel recovery, accessibility intake, recruiting, and verification.

VINRelease differentiates through three layers:

1. **Phone execution:** reach an authorized auction, lienholder, or title-service contact.
2. **Typed evidence:** turn the call into a schema-constrained case fact rather than a prose summary.
3. **Resolution graph:** use deterministic rules to decide whether the case is resolved, waiting on an external party, ready for the next authorized call, or needs a human.

The graph is the product intelligence.

---

# 3. Target users and buyers

## 3.1 Primary user: title clerk / title specialist

The title clerk owns operational correctness. VINRelease should feel like a junior exception-chasing teammate, not a replacement for the clerk.

### Their day

- Track title aging.
- Resolve missing or rejected documents.
- Contact auctions, lenders, vendors, and agencies.
- Keep dealership systems updated.
- Prevent funding or inventory delays.
- Escalate unusual legal/compliance cases.

### Their pain

- Repetitive status calls.
- Hold time.
- Repeating the same identifiers.
- Stale notes.
- Losing context across organizations.
- Having to remember which party promised what and when.
- Spending expert time on clerical chasing.

### Their desired outcome

Open the case and know:

- what is blocking it,
- who currently owns the next action,
- what was verified,
- when it was verified,
- the reference number/evidence,
- when the next follow-up is due,
- whether a human must step in.

## 3.2 Secondary user: dealership office manager / controller

They care about aging inventory, staffing, risk, auditability, and predictable operations.

### Desired outcome

A dashboard showing:

- number of open title exceptions,
- age buckets,
- blocked inventory value,
- cases advanced by VINRelease,
- cases awaiting external action,
- cases requiring human action,
- average days between verified updates.

## 3.3 Economic buyer

Initial buyer hypothesis:

- independent dealership with meaningful used inventory,
- multi-rooftop dealer group,
- title-service company,
- remarketing/auction operation,
- fleet operator with frequent title exceptions.

The first pilot should target **dealership title departments**, because the pain is close to inventory economics and the workflow is straightforward to observe.

## 3.4 Non-users for MVP

VINRelease is not built for:

- consumers resolving their personal title issue,
- repossession agents,
- debt collectors,
- lenders making credit decisions,
- DMV staff,
- salespeople negotiating trades,
- customers asking registration questions.

These may be future adjacent markets, but they are distractions during the hackathon.

---

# 4. Jobs to be done

## Core functional job

**When a title case has been stuck long enough that somebody on my team would start making calls, help me identify the current blocker and advance the case without consuming title-clerk phone time.**

## Supporting jobs

- Preserve a trustworthy history of who said what and when.
- Avoid duplicate calls when several staff members touch the same case.
- Convert verbal promises into follow-up dates.
- Escalate only the cases that actually require expertise.
- Let managers distinguish “we are waiting” from “nobody has checked.”

## Emotional job

Replace the feeling of “I have fifteen title fires and no idea which one I should chase first” with a queue that clearly distinguishes:

- **VINRelease working**
- **External party working**
- **Human action needed**
- **Resolved**

---

# 5. Scope lock

This section is the most important protection against hackathon overbuilding.

## 5.1 P0: must exist in the submitted product

1. Create/import one title-exception case.
2. Display aging, vehicle information, blocker status, and authorized contacts.
3. Preview the outbound call purpose before dialing.
4. Require explicit user authorization for live calling.
5. Place a real CALL-E call at runtime.
6. Receive a strict structured result.
7. Store CALL-E call ID, status, result, evidence, and transcript reference when available.
8. Transform call result into a deterministic case-state transition.
9. Display the transition in a clear timeline/graph.
10. Determine the next allowed action.
11. Support a second-party call in the same case when the first call identifies that party as the blocker.
12. Stop at `NEEDS_HUMAN` for unsupported facts, financial/legal decisions, identity verification, document execution, or ambiguity.
13. Prevent accidental duplicate calls through idempotency.
14. Provide a safe demo mode that never places calls.
15. Show at least one real authorized CALL-E execution in the demo video.

## 5.2 P1: build only if P0 is flawless

- Scheduled follow-up calls based on promised dates.
- CSV import of multiple stale-title cases.
- Manager dashboard and aging buckets.
- Contact directory per external organization.
- Retry policy for no-answer/voicemail.
- Search/filter by dealership, status, age, blocker.
- Slack/email notification when a human is required.
- Simple analytics for clerk minutes avoided.

## 5.3 P2: post-hackathon

- DMS integration.
- Dealertrack/Vitu/title-provider connectors.
- Document ingestion and OCR.
- State-by-state policy knowledge.
- Shipping/tracking integration.
- Multi-rooftop role management.
- SLA routing and automatic follow-up schedules.
- Human title-service marketplace.
- Learned contact routing by organization.

## 5.4 Explicitly out of scope

VINRelease must not:

- move money,
- provide bank-account information,
- accept payoff changes,
- agree to fees,
- sign documents,
- impersonate a named human,
- make legal representations,
- determine legal title ownership,
- provide legal advice,
- call consumers in the MVP,
- call numbers that were not provisioned and authorized,
- dial emergency services,
- automatically call DMVs with unknown phone trees,
- invent missing facts,
- automatically retry an ambiguous call forever,
- mark a title physically received unless a trusted system or human confirms receipt.

---

# 6. Core product flow

## 6.1 User flow

### Step 1: open an exception

The title clerk sees:

```text
2019 BMW 330i
VIN ending 7821
Stock #4821
Purchased from Metro Auto Auction
Purchase date: Aug 14
Title expected: Aug 18

TITLE NOT RECEIVED - DAY 24
Blocked inventory value: $18,700
Last verified update: Aug 26
```

The key UI state is **stale**.

### Step 2: VINRelease proposes a resolution plan

```text
Recommended next action
Call Metro Auto Auction - Title Desk

Goal
Confirm whether title was issued and identify any external blocker.

Allowed disclosure
- Dealer name
- Stock number
- Last 6 VIN characters
- Purchase date

Will never disclose
- Customer personal information
- Bank credentials
- Payment credentials
- SSN / national ID
```

User clicks **Authorize Call**.

### Step 3: CALL-E executes

The system creates a CALL-E task with:

- exactly one authorized recipient,
- the business goal,
- a narrow disclosure budget,
- strict result schema,
- an idempotency key tied to case + action + attempt,
- metadata containing the internal case ID.

### Step 4: structured result arrives

Example:

```json
{
  "party_reached": true,
  "case_located": true,
  "outcome": "blocked_external",
  "blocker_type": "lien_release_missing",
  "responsible_party": "lienholder",
  "responsible_party_name": "ABC Bank",
  "reference_number": null,
  "promised_action": null,
  "promised_date": null,
  "title_sent": false,
  "needs_human": false,
  "unknown_questions": [],
  "notes": "Auction states title cannot be issued until lien release is received."
}
```

### Step 5: resolution engine updates case

```text
UNKNOWN BLOCKER
      ↓
LIEN RELEASE MISSING

Responsible party: ABC Bank
Source: Metro Auto Auction
Verified by phone: 11 sec ago
```

If ABC Bank is an approved contact, VINRelease can propose the next call.

### Step 6: second call

The lienholder says the release was already sent and provides a reference number/date.

VINRelease transitions:

```text
LIEN RELEASE MISSING
      ↓
RELEASE SENT

Reference: LR-4721
Sent: Sep 8
Next owner: Metro Auto Auction
```

The case is not falsely labeled “resolved.” The next action is to confirm auction receipt or wait for the promised processing window.

### Step 7: completion or escalation

Possible endings:

- `RESOLVED` - trusted confirmation that title was received/issued according to the product's definition.
- `WAITING_EXTERNAL` - external party promised an action/date.
- `READY_FOR_NEXT_CALL` - another approved party should be contacted.
- `NEEDS_HUMAN` - missing document, judgment, financial/legal decision, identity verification, or unsupported question.
- `UNREACHABLE` - no successful contact within configured attempt policy.

---

# 7. Title exception taxonomy

The MVP should support a small, explicit taxonomy. Do not use an unconstrained LLM label.

| Blocker type | Meaning | Typical next party | Auto-call allowed? | Human gate |
|---|---|---|---|---|
| `unknown` | No recent verified cause | Auction/title source | Yes | No |
| `auction_title_pending` | Auction has not issued/received title | Auction | Yes | No |
| `lien_release_missing` | Release is blocking title | Lienholder | Yes, if pre-authorized | No |
| `release_sent_not_received` | Sender says release sent; receiver lacks it | Sender/receiver | Yes | No |
| `seller_title_missing` | Seller-side document/title missing | Internal clerk first | No in MVP | Yes |
| `duplicate_title_required` | Duplicate title process required | Internal clerk/title service | No | Yes |
| `document_rejected` | Paperwork rejected or incomplete | Internal clerk/title service | No | Yes |
| `payoff_exception` | Short/overpay or payoff discrepancy | Internal finance/title clerk | No | Yes |
| `identity_verification_required` | External party requires identity/auth not in disclosure budget | Human | No | Yes |
| `dmv_processing` | Case is with a government office | Human / later connector | No in MVP | Yes |
| `title_shipped` | Title is in transit | Wait/tracking | No immediate call | No |
| `other` | Result does not map cleanly | Human | No | Yes |

This taxonomy is deliberately conservative. The product should abstain rather than pretend every real-world title issue fits an automatic path.

---

# 8. Case state machine

## 8.1 Top-level states

```text
NEW
  |
  v
READY_TO_CONTACT
  |
  v
CALL_IN_PROGRESS
  |
  +--------------------+
  |                    |
  v                    v
ACTIONABLE_RESULT   UNREACHABLE
  |
  +-------------------------------+
  |               |               |
  v               v               v
READY_FOR_      WAITING_        NEEDS_
NEXT_CALL       EXTERNAL        HUMAN
  |               |               |
  +-------+-------+               |
          |                       |
          v                       |
      CALL_IN_PROGRESS            |
          |                       |
          +-----------+-----------+
                      |
                      v
                   RESOLVED
```

## 8.2 Rules

### `NEW -> READY_TO_CONTACT`

Requirements:

- case passes validation,
- at least one approved contact exists,
- disclosure budget exists,
- no case-level hold is active.

### `READY_TO_CONTACT -> CALL_IN_PROGRESS`

Requirements:

- explicit user authorization,
- recipient is approved for this purpose,
- no matching active call exists,
- idempotency key is created.

### `CALL_IN_PROGRESS -> ACTIONABLE_RESULT`

Requirements:

- CALL-E reports terminal completion,
- backend fetches the call record,
- structured result passes schema validation,
- minimum evidence conditions are met.

### `ACTIONABLE_RESULT -> READY_FOR_NEXT_CALL`

Only when:

- result maps to a supported blocker,
- next responsible-party class is permitted,
- a provisioned contact exists,
- no human-only condition exists.

### `ACTIONABLE_RESULT -> WAITING_EXTERNAL`

When:

- the contacted party committed to an action,
- or the case is in transit/processing,
- and a reasonable follow-up date exists or can be set by policy.

### `ACTIONABLE_RESULT -> NEEDS_HUMAN`

When any of the following occurs:

- result is ambiguous,
- requested fact is outside authorized packet,
- money/payment changes are discussed,
- signature/document execution is required,
- identity verification is required,
- legal ownership dispute appears,
- unsupported blocker category,
- external party asks the agent to make a commitment.

### `WAITING_EXTERNAL -> READY_TO_CONTACT`

Only after:

- follow-up due time has arrived,
- or a human explicitly requests an earlier follow-up.

### Any state -> `CLOSED`

Human may close a duplicate, invalid, sold, or otherwise irrelevant case. Closed is not the same as resolved.

---

# 9. Functional requirements

## FR-1 Case creation

The user can create a case with:

- dealership,
- vehicle year/make/model,
- masked VIN display + securely stored necessary identifier,
- stock number,
- source organization,
- purchase date,
- expected title date,
- blocked inventory value (optional),
- current note,
- current known status,
- authorized contacts.

**Acceptance:** invalid cases cannot enter `READY_TO_CONTACT`.

## FR-2 Contact authorization

Every external phone number must have:

- organization name,
- department/purpose,
- phone number,
- source/provenance,
- authorization status,
- allowed disclosure fields,
- optional business hours,
- active/inactive flag.

**Acceptance:** system refuses to call an unapproved contact.

## FR-3 Call preview

Before a live call, show:

- who will be called,
- why,
- what VINRelease may disclose,
- what it may ask,
- what it may not agree to,
- what state transition is expected if successful.

**Acceptance:** live button is disabled until user confirms.

## FR-4 CALL-E execution

Backend creates a CALL-E outbound task using official SDK/API and a strict schema.

**Acceptance:** a real call ID is persisted before the UI represents the call as started.

## FR-5 Idempotency

A call action must have a stable key derived from:

`case_id + action_type + target_contact_id + attempt_generation`

**Acceptance:** duplicate button clicks/retries never create two concurrent calls for the same authorized action.

## FR-6 Structured result validation

The application rejects undeclared fields and impossible enum values.

**Acceptance:** an invalid result creates `NEEDS_HUMAN`/provider-error status rather than a case transition.

## FR-7 Evidence record

For every verified transition store:

- internal transition ID,
- prior state,
- new state,
- CALL-E call ID,
- contacted organization,
- completion timestamp,
- structured facts,
- evidence snippets/references if supplied,
- confidence/completion metadata,
- user who authorized the call.

## FR-8 Resolution graph

The product displays current state and preceding state transitions chronologically.

**Acceptance:** a reviewer can answer “why does VINRelease think the lien release is missing?” in one click.

## FR-9 Human review queue

A case enters human review when policy requires it.

Each review item must state:

- what happened,
- why automation stopped,
- what question/action the human must resolve,
- source call/evidence,
- buttons for supported next actions.

## FR-10 Safe demo mode

Public demo defaults to `SAFE_DEMO`.

In safe mode:

- no outbound call can be created,
- sample calls replay deterministic event sequences,
- UI is visually identical to live mode except for clear “Demo Data” badge,
- the code path for live mode remains present and testable.

---

# 10. Product screens

## 10.1 Screen A - Exception Dashboard

### Purpose

Make the pain visible before explaining the technology.

### Layout

Top metrics:

- Open exceptions
- 30+ day cases
- Waiting on external party
- Needs human
- Blocked inventory value (optional)

Main table:

| Vehicle | Age | Current blocker | Owner | Last verified | State |
|---|---:|---|---|---|---|
| BMW 330i / #4821 | 24d | Unknown | VINRelease | Aug 26 | Ready to contact |
| Toyota Camry / #1033 | 18d | Lien release | ABC Bank | Today | Waiting external |
| Ford F-150 / #9912 | 31d | Rejected docs | Internal | Today | Needs human |

### UX principle

Red should mean the case is aging or blocked, not that “AI is scary.” Green is reserved for genuinely advanced/resolved cases.

## 10.2 Screen B - Case Detail

Hero card:

```text
2019 BMW 330i                         DAY 24
Stock #4821
VIN ending 7821

TITLE NOT RECEIVED
$18,700 inventory blocked

Current owner: VINRelease
Last verified: Aug 26
```

Below it:

- resolution graph,
- latest evidence,
- next recommended action,
- authorized contacts,
- timeline.

Primary CTA: **Resolve next blocker**.

## 10.3 Screen C - Call Authorization

Show a compact “call contract”:

```text
CALL
Metro Auto Auction - Title Desk

PURPOSE
Confirm current title status and identify blocker.

VINRELEASE MAY SAY
Dealer name
Stock #4821
VIN ending 7821
Purchase date

VINRELEASE WILL NOT
Provide payment credentials
Accept a fee
Sign anything
State facts not in this case

[Cancel]                     [Authorize Call]
```

This screen is part of the product, not compliance decoration. It proves intentionality and control.

## 10.4 Screen D - Live Call Progress

Timeline-style progress:

```text
14:02:01  Call requested
14:02:03  CALL-E accepted task
14:02:09  Dialing
14:02:14  Connected
14:02:23  Case located
14:02:41  Blocker identified
14:02:48  Call completed
```

Do not fake provider events that CALL-E does not actually expose. If only coarse status is available, show coarse status.

## 10.5 Screen E - Result / State Transition

The most important visual moment.

```text
ROOT CAUSE FOUND

LIEN RELEASE MISSING

Responsible party      ABC Bank
Source                 Metro Auto Auction
Verified               14:02 today

Next step
Contact approved lien-release desk

[Review evidence]       [Authorize next call]
```

## 10.6 Screen F - Human Review

```text
VINRELEASE STOPPED SAFELY

ABC Bank requested information that is not in the authorized case packet:
"Account verification code"

No answer was invented and no credential was disclosed.

[Open call evidence]     [Assign to title clerk]
```

This is a judge-winning screen because it demonstrates bounded autonomy.

---

# 11. CALL-E agent contract

VINRelease should generate a narrow task prompt rather than a personality-heavy system prompt.

## 11.1 Call task template

```text
You are VINRelease, calling on behalf of {{dealership_name}} regarding an overdue vehicle-title case.

Recipient: {{organization_name}}, {{department}}
Purpose: {{specific_goal}}

You may disclose ONLY:
{{allowed_disclosures}}

You may ask:
- whether the case can be located,
- current title/lien-release status,
- the specific reason it is blocked,
- which organization owns the next action,
- whether a document/release was sent or received,
- relevant reference number,
- promised action and promised date,
- shipment/tracking information when offered.

Rules:
1. Introduce yourself as an AI/automated assistant if required by the configured disclosure policy. Do not impersonate a named employee.
2. Never provide payment-card data, bank credentials, passwords, PINs, SSNs/national identifiers, or unapproved account identifiers.
3. Never agree to a fee, payoff change, financial commitment, contract term, legal statement, or document execution.
4. Never invent a fact. If asked for information outside the allowed case packet, say you do not have it and record that human input is required.
5. Do not make claims about legal ownership or DMV law.
6. If the person says the number/department is wrong, ask only for a safe public routing suggestion; do not disclose additional case details.
7. Keep the call focused on obtaining a verifiable status and next action.
8. End politely once the needed status is established or a human-only blocker appears.

Success means returning the required structured result accurately. A completed call with no verified answer is NOT a successful resolution.
```

## 11.2 Call result schema

Recommended recipient-level JSON schema:

```json
{
  "type": "object",
  "additionalProperties": false,
  "required": [
    "party_reached",
    "case_located",
    "outcome",
    "blocker_type",
    "responsible_party",
    "needs_human",
    "unknown_questions"
  ],
  "properties": {
    "party_reached": {"type": "boolean"},
    "case_located": {"type": "boolean"},
    "outcome": {
      "type": "string",
      "enum": [
        "status_verified",
        "blocked_external",
        "waiting_external",
        "resolved_claimed",
        "wrong_department",
        "unreachable",
        "ambiguous"
      ]
    },
    "blocker_type": {
      "type": "string",
      "enum": [
        "unknown",
        "auction_title_pending",
        "lien_release_missing",
        "release_sent_not_received",
        "seller_title_missing",
        "duplicate_title_required",
        "document_rejected",
        "payoff_exception",
        "identity_verification_required",
        "dmv_processing",
        "title_shipped",
        "other"
      ]
    },
    "responsible_party": {
      "type": "string",
      "enum": [
        "auction",
        "lienholder",
        "dealer",
        "seller",
        "title_service",
        "dmv",
        "carrier",
        "unknown"
      ]
    },
    "responsible_party_name": {"type": ["string", "null"]},
    "reference_number": {"type": ["string", "null"]},
    "promised_action": {"type": ["string", "null"]},
    "promised_date": {"type": ["string", "null"], "format": "date"},
    "title_sent": {"type": "boolean"},
    "tracking_number": {"type": ["string", "null"]},
    "needs_human": {"type": "boolean"},
    "human_reason": {"type": ["string", "null"]},
    "unknown_questions": {
      "type": "array",
      "items": {"type": "string"},
      "maxItems": 10
    },
    "notes": {"type": ["string", "null"], "maxLength": 600}
  }
}
```

## 11.3 Result trust policy

A schema-valid result is necessary but not always sufficient to change the business state.

Rules:

- `party_reached=false` can never resolve a case.
- `case_located=false` can never establish title status.
- `resolved_claimed` means “external party claims resolution,” not “title physically received.”
- Any `needs_human=true` blocks autonomous continuation.
- Missing responsible party when blocker requires one -> human review.
- Unknown/other blocker -> human review.
- If provider completion confidence/evidence is weak, show “unverified” and do not transition to a high-confidence state.
- Never infer a promised date that was not stated.

---

# 12. Resolution engine specification

The resolution engine should be deterministic TypeScript, not another generative model.

## 12.1 Input

```ts
interface ResolutionInput {
  caseState: CaseState;
  currentBlocker: BlockerType;
  targetParty: PartyType;
  callResult: VinReleaseCallResult;
  approvedContacts: ApprovedContact[];
}
```

## 12.2 Output

```ts
interface ResolutionDecision {
  nextState: CaseState;
  blocker: BlockerType;
  owner: PartyType | "vinrelease" | "human";
  nextAction: NextAction;
  reason: string;
  followUpAt?: string;
  requiresHuman: boolean;
}
```

## 12.3 Example rules

```text
IF party_reached = false
  -> UNREACHABLE

IF case_located = false
  -> NEEDS_HUMAN (case identifiers need review)

IF needs_human = true
  -> NEEDS_HUMAN

IF blocker = lien_release_missing
AND responsible_party = lienholder
AND approved lienholder contact exists
  -> READY_FOR_NEXT_CALL

IF blocker = lien_release_missing
AND no approved lienholder contact exists
  -> NEEDS_HUMAN (provision contact)

IF promised_date exists
AND promised_action exists
  -> WAITING_EXTERNAL until promised_date/policy follow-up

IF blocker = document_rejected
  -> NEEDS_HUMAN

IF blocker = title_shipped
  -> WAITING_EXTERNAL

IF outcome = ambiguous OR blocker = other
  -> NEEDS_HUMAN
```

## 12.4 Important principle

**The engine decides workflow state, not real-world truth.**

Truth remains tied to evidence. A transition record should contain the call source that justified it.

---

# 13. Technical architecture

## 13.1 Recommended hackathon stack

Use a simple TypeScript stack to maximize shipping speed and use CALL-E's supported server SDK/API directly.

- **Frontend / web:** Next.js + React + TypeScript
- **UI:** Tailwind CSS + shadcn/ui or equivalent small component library
- **Backend:** Next.js route handlers/server actions OR a small Node API in the same repo
- **Database:** PostgreSQL (Neon/Supabase) or SQLite for local + PostgreSQL for deployed demo
- **Validation:** Zod + JSON Schema
- **CALL-E:** `@call-e/calle` SDK or Developer API
- **Hosting:** Vercel/Render/Fly/etc. with a publicly reachable webhook endpoint
- **Tests:** Vitest/Jest + Playwright optional

Do not add an additional LLM provider unless it solves a demonstrated requirement. CALL-E already handles the conversation and structured extraction. The title workflow should remain deterministic.

## 13.2 Architecture diagram

```text
+--------------------+
|  Title Clerk UI    |
+---------+----------+
          |
          v
+--------------------+
| VINRelease Backend |
| - auth gate        |
| - case service     |
| - call planner     |
| - state engine     |
+----+-----------+---+
     |           |
     |           +----------------------+
     v                                  v
+-------------+                   +-----------+
| PostgreSQL  |                   | CALL-E    |
| cases       |                   | API/SDK   |
| contacts    |                   +-----+-----+
| calls       |                         |
| transitions|                         v
+-------------+                 Authorized external
                                auction/lienholder
                                       |
                                       v
                                 phone conversation
                                       |
                                       v
                                CALL-E structured
                                result + evidence
                                       |
                          webhook/status completion
                                       |
                                       v
                              VINRelease Backend
                                       |
                         validate -> state transition
                                       |
                                       v
                                UI updates timeline
```

## 13.3 Webhook trust model

Recommended pattern:

1. CALL-E webhook tells VINRelease that a call changed/finished.
2. VINRelease uses the stored `call_id` to fetch the canonical call result from CALL-E.
3. VINRelease validates the result against its own schema.
4. VINRelease checks that metadata/case ID and recipient match the authorized action.
5. Only then does the resolution engine run.

This prevents the application from treating an unauthenticated arbitrary webhook payload as business truth.

## 13.4 Live vs demo environments

Environment variable:

```text
VINRELEASE_MODE=demo | live
```

`demo`:

- blocks provider call creation,
- uses deterministic fixtures,
- clearly labels all data as demo.

`live`:

- requires server-side CALL-E credentials,
- only calls approved test/production contacts,
- records call IDs and authorization audit events.

Never expose CALL-E keys to the browser.

---

# 14. Data model

## 14.1 `dealerships`

- `id`
- `name`
- `timezone`
- `created_at`

## 14.2 `users`

- `id`
- `dealership_id`
- `name`
- `email`
- `role` (`title_clerk`, `manager`, `admin`)

## 14.3 `cases`

- `id`
- `dealership_id`
- `stock_number`
- `vehicle_year`
- `vehicle_make`
- `vehicle_model`
- `vin_encrypted` or securely stored minimum identifier
- `vin_last6`
- `source_org_name`
- `purchase_date`
- `expected_title_date`
- `inventory_value`
- `state`
- `blocker_type`
- `owner_type`
- `last_verified_at`
- `next_action_at`
- `created_at`
- `updated_at`
- `closed_at`

## 14.4 `approved_contacts`

- `id`
- `dealership_id`
- `organization_name`
- `department`
- `party_type`
- `phone_e164`
- `region`
- `locale`
- `authorized_purposes[]`
- `allowed_disclosure_keys[]`
- `source`
- `business_hours_json`
- `is_active`
- `approved_at`
- `approved_by`

## 14.5 `call_tasks`

- `id`
- `case_id`
- `contact_id`
- `action_type`
- `idempotency_key`
- `provider_call_id`
- `provider_status`
- `authorized_by`
- `authorized_at`
- `task_text_hash`
- `result_json`
- `task_completed`
- `completion_confidence`
- `created_at`
- `completed_at`

## 14.6 `state_transitions`

- `id`
- `case_id`
- `from_state`
- `to_state`
- `from_blocker`
- `to_blocker`
- `owner_after`
- `reason`
- `call_task_id` nullable
- `created_by` (`system` or user ID)
- `created_at`

## 14.7 `review_items`

- `id`
- `case_id`
- `call_task_id`
- `reason_code`
- `question`
- `status`
- `assigned_to`
- `resolution_note`
- `created_at`
- `resolved_at`

## 14.8 `audit_events`

Store security-sensitive workflow events such as:

- contact provisioned,
- call preview generated,
- live call authorized,
- call created,
- result fetched,
- state transition applied,
- human override,
- case closed.

Do not duplicate full transcripts into every table.

---

# 15. API surface

A minimal internal API is enough.

## Cases

`POST /api/cases` - create case  
`GET /api/cases` - list/filter cases  
`GET /api/cases/:id` - full case detail  
`POST /api/cases/:id/close` - human close

## Resolution

`POST /api/cases/:id/plan-next-action` - deterministic recommended action  
`POST /api/cases/:id/calls/preview` - produce call contract, no side effect  
`POST /api/cases/:id/calls/authorize` - authorize and create provider task  
`GET /api/cases/:id/calls/:callTaskId` - status/result  
`POST /api/cases/:id/review/:reviewId/resolve` - human action

## Provider

`POST /api/calle/webhook` - receive provider event signal

### Authorization endpoint contract

Request:

```json
{
  "contactId": "contact_abc",
  "expectedAction": "verify_auction_title_status",
  "previewFingerprint": "sha256:..."
}
```

Backend must regenerate and compare the preview contract so the user cannot authorize one script while the server sends another.

---

# 16. Safety, privacy, and trust specification

This section is a feature, not legal boilerplate.

## 16.1 Principle: minimum disclosure

VINRelease should not send the entire dealership case file to the phone agent.

Each call has a **disclosure budget**.

Example auction-title call:

Allowed:

- dealership name,
- stock number,
- last 6 VIN characters,
- auction purchase date,
- auction reference number.

Not allowed by default:

- customer name/address,
- SSN,
- driver's-license number,
- payment-card details,
- bank account/routing details,
- authentication codes,
- unrelated vehicle/customer information.

## 16.2 Explicit authorization

For hackathon and early pilot:

- only provision numbers the user is authorized to contact,
- no hidden autodialing,
- show a preview before live execution,
- require an explicit click for each live chain in P0.

Post-hackathon recurring authorization can be designed later.

## 16.3 Identity and disclosure

The agent must not pretend to be a named title clerk. It should use a truthful identity such as:

> “I'm VINRelease, an automated assistant calling on behalf of Northside Motors' title team.”

Specific disclosure requirements vary by jurisdiction and context; production deployment needs legal review. For the hackathon, use explicit disclosure to consenting test recipients.

## 16.4 No financial autonomy

If any call introduces:

- fee,
- payoff amount change,
- refund,
- wire/ACH instruction,
- bank details,
- settlement,
- authorization to charge,

VINRelease stops and creates a human review item.

## 16.5 No legal autonomy

VINRelease does not:

- adjudicate ownership,
- determine whether a lien is legally valid,
- give DMV-law advice,
- sign affidavits,
- certify facts,
- represent itself as counsel.

## 16.6 Unknown means unknown

If a counterparty asks a question not in the trusted packet:

> “I don't have that information in the authorized case details. I'll flag it for the title team.”

The application then shows the exact missing question.

## 16.7 Auditability

Every consequential state change should answer:

- Who authorized the call?
- Which number was called?
- What was the stated purpose?
- What data was allowed to be spoken?
- What provider call produced the result?
- What evidence supported the transition?
- Which deterministic rule selected the next state?

---

# 17. Failure handling

## 17.1 No answer

- mark attempt `unreachable`,
- do not infer status,
- allow one policy-defined retry or human scheduling,
- never create an infinite retry loop.

## 17.2 Voicemail

For MVP, do not leave detailed case information in voicemail. Either:

- leave a minimal callback message only if pre-approved, or
- end without voicemail and mark `unreachable`.

Safer hackathon default: no detailed voicemail.

## 17.3 Wrong department

Record:

- wrong department,
- any safe routing suggestion,
- no additional sensitive disclosure.

A new number must be manually approved before live dialing in P0.

## 17.4 Call completed but result is empty

Treat as `UNKNOWN`, not success.

## 17.5 Provider timeout

Do not immediately create a second call. First check the existing provider call ID/status. Idempotency must protect against a “client timed out but provider accepted call” failure mode.

## 17.6 Contradictory external statements

Example:

- Auction: “lienholder never sent release.”
- Lienholder: “release sent Sep 8, reference LR-4721.”

VINRelease should display a **contradiction**, not silently choose one source.

State:

`RELEASE SENT - RECEIPT UNCONFIRMED`

Next action: confirm with auction.

## 17.7 DTMF / IVR limitation

Do not make the MVP dependent on complex IVR navigation. Use approved direct title-desk/lien-release contacts for the demonstration and initial pilot.

If a production contact requires an unsupported phone-tree interaction, VINRelease should flag `NEEDS_HUMAN_ROUTING` rather than pretending the call is possible.

---

# 18. Hackathon demo specification

## 18.1 Demo goal

In under three minutes, a judge must observe a case move through a real-world chain:

**stuck title -> call -> blocker discovered -> second organization identified -> second call -> verified progress -> case state updated**

## 18.2 Demo fixture

Use a fictional dealership and synthetic vehicle data.

**Dealership:** Northside Motors  
**Vehicle:** 2019 BMW 330i  
**Stock:** #4821  
**VIN display:** ending 7821  
**Source:** Metro Auto Auction (fictional)  
**Age:** 24 days  
**Blocked value:** $18,700  
**Initial status:** Title not received  

Two team-controlled/consenting phone recipients:

1. **Metro Auto Auction - Title Desk** persona.
2. **ABC Bank - Lien Release Desk** persona.

Do not call real unrelated businesses for the demo.

## 18.3 Scripted truth behind the live calls

### Recipient A knows

- case can be located,
- auction cannot issue title,
- it is waiting for lien release from ABC Bank.

### Recipient B knows

- release was sent Sep 8,
- reference is `LR-4721`,
- no further action is required by the dealer.

The recipient should answer naturally rather than read a rigid script, so CALL-E must actually converse and extract.

## 18.4 Three-minute storyboard

### 0:00-0:20 - Pain

Show dashboard.

Narration:

> “This dealership owns this car, but it cannot cleanly retail it because the title is still missing. Today a title clerk figures out why by calling everyone involved.”

### 0:20-0:40 - Product

Open case.

> “VINRelease is an exception-resolution desk. It doesn't replace title software. It starts when the normal workflow is stuck.”

Show call preview and disclosure budget.

### 0:40-1:20 - Real CALL-E call #1

Authorize call to fictional auction title desk.

Show provider accepted call and live/terminal status.

Result:

`LIEN RELEASE MISSING -> ABC Bank`

### 1:20-1:40 - State transition

Show graph animate/update.

> “The call doesn't end in a transcript. It changes the business state and identifies the next owner.”

### 1:40-2:20 - Real CALL-E call #2

Authorize lienholder call.

Result:

`RELEASE SENT Sep 8 / LR-4721`

### 2:20-2:40 - Evidence and safe autonomy

Show reference number, evidence, and next state:

`RELEASE SENT - AUCTION CONFIRMATION PENDING`

Emphasize that VINRelease does **not** mark the physical title received.

### 2:40-3:00 - Market / close

Zoom out to exception queue.

Narration:

> “Dealertrack and Vitu digitize the happy path. Human title teams still chase the exceptions. VINRelease turns those phone calls into a verifiable resolution workflow. Software handles clean title transactions. VINRelease handles the ones that get stuck.”

End.

## 18.5 What not to show

Do not burn demo time on:

- login,
- profile settings,
- generic AI chat,
- architecture slides,
- five unrelated use cases,
- fake analytics,
- broad dealership CRM screens,
- long transcripts.

The judge should watch the title unblock.

---

# 19. Hackathon judging strategy

The challenge evaluates real-world impact, idea quality, technical implementation, and product experience/demo. VINRelease should deliberately generate evidence for all four.

## 19.1 Real World Impact

Proof points:

- established title-service businesses sell relief from title/DMV phone work,
- Vitu markets reduced holding cost/time-to-title,
- digital integrations exist but do not eliminate exception handling,
- the buyer and operational user are identifiable.

Submission language:

> “We target the expensive exception queue after normal digital title workflows stop producing an answer.”

## 19.2 Quality of the Idea

Do not pitch “AI calls lenders.”

Pitch:

> “Every conversation is an evidence-backed edge in a title-resolution graph. The system advances the case only when the result satisfies a deterministic transition rule.”

That makes it reusable and non-generic.

## 19.3 Technical Implementation

Judges should be able to inspect:

- real CALL-E SDK/API invocation,
- strict result JSON schema,
- idempotency key,
- webhook/status ingestion,
- canonical result fetch,
- state-transition engine,
- safety gates,
- tests,
- real call IDs/screenshots or evidence from authorized demo calls.

## 19.4 Product Experience & Demo

The emotional arc is:

`RED: nobody knows why car is stuck`  
`YELLOW: external blocker found`  
`GREEN/BLUE: next action verified and case advanced`

The product should feel like an operations tool a title team could use the next morning.

---

# 20. Four-day build plan

The deadline in the supplied hackathon page is September 14, 2026. The plan below optimizes for a complete P0 rather than breadth.

## Day 0 / first technical spike - do before polishing UI

Goal: prove the critical CALL-E path.

Build a tiny script that:

1. calls one consenting team-controlled number,
2. supplies a strict schema,
3. returns a structured result,
4. stores provider call ID,
5. proves terminal status can be fetched,
6. verifies how evidence/transcripts are surfaced in your account.

Do not build the main interface until this path works.

Exit criteria: one real call produces a schema-valid result you can programmatically consume.

## Day 1 - domain + case workflow

- repo skeleton,
- database schema,
- fixture case,
- dashboard,
- case detail,
- state enums,
- blocker taxonomy,
- deterministic state engine,
- unit tests for transitions,
- demo-mode event fixtures.

Exit criteria: the entire product can be clicked through with deterministic fake provider events.

## Day 2 - CALL-E integration

- call preview,
- authorization audit event,
- SDK/API integration,
- idempotency,
- provider call persistence,
- completion ingestion,
- result validation,
- state transition from live result,
- evidence drawer.

Exit criteria: case #4821 advances after a real authorized call.

## Day 3 - chained resolution + safety

- second-party next-call logic,
- human review state,
- unknown-question handling,
- wrong-department/unreachable handling,
- duplicate-call test,
- safe demo mode,
- UI refinement,
- responsive layout,
- strong empty/loading/error states.

Exit criteria: full auction -> lienholder flow works end-to-end.

## Day 4 - proof, submission, demo

- test on deployed environment,
- run all tests,
- verify no secrets in repo,
- write README,
- create required contribution in CALL-E repo format,
- record demo video,
- record a backup demo take,
- capture screenshots,
- submit Devpost entry,
- verify PR URL and public video.

Do not add major features on Day 4.

---

# 21. Repository specification

Suggested contribution shape:

```text
apps/typescript/vinrelease/
├── README.md
├── package.json
├── .env.example
├── docs/
│   ├── architecture.md
│   ├── safety.md
│   └── demo-scenario.md
├── fixtures/
│   ├── demo-case.json
│   ├── auction-result.json
│   └── lienholder-result.json
├── src/
│   ├── app/
│   ├── components/
│   ├── domain/
│   │   ├── case.ts
│   │   ├── states.ts
│   │   ├── blockers.ts
│   │   └── resolution-engine.ts
│   ├── calle/
│   │   ├── client.ts
│   │   ├── schemas.ts
│   │   ├── task-builder.ts
│   │   └── webhook.ts
│   ├── safety/
│   │   ├── disclosure-budget.ts
│   │   ├── contact-authorization.ts
│   │   └── live-mode-gate.ts
│   └── db/
└── tests/
    ├── resolution-engine.test.ts
    ├── disclosure-budget.test.ts
    ├── idempotency.test.ts
    └── result-validation.test.ts
```

README opening sentence:

> **VINRelease is a CALL-E-powered title-exception desk that calls authorized auctions and lienholders, converts each conversation into a typed case transition, and stops when human judgment is required.**

---

# 22. Testing specification

## 22.1 Unit tests

### Resolution engine

At minimum test:

- no answer -> unreachable,
- case not located -> human review,
- lien release missing + approved contact -> ready next call,
- lien release missing + no contact -> human review,
- promised external action/date -> waiting external,
- document rejected -> human review,
- title shipped -> waiting external,
- unknown blocker -> human review,
- provider says resolved but no trusted receipt -> not physically resolved.

### Disclosure budget

- forbidden keys rejected,
- unknown field cannot enter spoken packet,
- only call-purpose-specific fields emitted.

### Idempotency

- double authorization click -> one provider call,
- retry after client timeout -> reuses/checks prior call,
- different next action -> new idempotency generation.

### Result validation

- extra fields rejected,
- invalid enums rejected,
- missing required fields rejected,
- malformed date rejected.

## 22.2 Integration tests

- demo-mode end-to-end transition,
- webhook signal -> provider fetch -> validated result -> transition,
- needs-human path,
- database transaction around call result + transition.

## 22.3 Manual live tests

Use only consenting team-controlled recipients.

Test:

- normal status call,
- recipient interrupts,
- recipient asks unsupported question,
- recipient says wrong department,
- recipient gives ambiguous answer,
- recipient provides reference number with letters/numbers,
- no answer/voicemail behavior.

## 22.4 Demo reliability target

Before recording:

- run the exact live demo flow at least 5 times,
- confirm no duplicate calls,
- confirm UI never says resolved when only a partial state is verified,
- have deterministic demo mode available if the public deployment is reviewed outside the live-call window.

---

# 23. Success definition

Success must be defined at three levels: hackathon, pilot, and product.

## 23.1 Hackathon success

### Minimum successful submission

- functional deployed app or locally reproducible app,
- real CALL-E runtime integration,
- real authorized call shown in video,
- strict structured output,
- at least one evidence-backed state transition,
- human-stop path demonstrated,
- public repository contribution/PR in required CALL-E repository,
- public ~3 minute video,
- clear setup and safety documentation.

### Strong submission

- two-party chain is shown live,
- state graph updates automatically,
- idempotency and ambiguity handling are visible in code/tests,
- public demo is polished and safe,
- judge understands the problem before hearing the word “AI.”

### Winning-quality subjective test

A judge should be able to repeat this after the demo:

> “VINRelease handles the title cases dealership software can't finish. It calls the parties, finds who is blocking the title, and advances the case with evidence.”

If a judge instead says “it is an AI that calls people,” the positioning failed.

## 23.2 Pilot success (first 30-60 days)

These are target hypotheses to validate, not current claims.

### Operational targets

- 2-5 pilot dealerships.
- 50+ title-exception cases observed.
- 25+ authorized real exception calls.
- >=70% of completed calls return an actionable status or explicit human blocker.
- >=50% of eligible cases are advanced at least one state without a title clerk making the call personally.
- zero unauthorized recipients called.
- zero prohibited credentials/payment data spoken.
- <5% material correction rate on structured factual extraction.
- median time from “call authorized” to “actionable update” less than 20 minutes for reachable contacts.

### Customer-value targets

- title clerks report measurable reduction in repetitive calling,
- manager can identify aging cases and ownership from VINRelease without asking the clerk,
- at least one pilot asks to keep using it after the trial,
- at least one buyer accepts a paid pilot or gives a concrete willingness-to-pay range.

## 23.3 Product success (6-12 months)

### North-star metric

**Title exceptions advanced without a human outbound call.**

An “advanced” case means a verified state transition that changes ownership, blocker, or next action—not merely a call attempt.

### Supporting metrics

- median age of open exception queue,
- time between verified updates,
- autonomous advance rate,
- human escalation rate,
- successful contact rate,
- contradiction rate,
- duplicate-call prevention count,
- title-clerk minutes avoided,
- cases per active dealership per week,
- retention by dealership rooftop,
- paid conversion from pilot.

### Outcome metric

Ultimately the business should improve **time to clear title exceptions**. Do not claim causation until baseline and post-deployment data exist.

---

# 24. Business model hypotheses

Do not invent a giant TAM for the hackathon. Demonstrate a believable buyer and test pricing later.

Possible pricing models:

### Model A - per dealership rooftop

Monthly platform fee with an included call/case allowance.

Good for predictable budgeting.

### Model B - per resolved/advanced exception

Charge when VINRelease obtains an actionable verified state transition.

Good alignment with value, but “resolved” must be defined carefully.

### Model C - title-service enablement

Sell VINRelease to existing title-service firms as an automation layer for their staff.

This may be strategically attractive because services such as Greenlight already own the customer relationship and phone-heavy workflow.

### Pricing validation question

Do not ask, “Would you pay for AI?”

Ask:

> “How many hours per week does your team spend chasing title status, and what would you pay to remove half of those calls while keeping humans in control of exceptions?”

---

# 25. Go-to-market and customer discovery

## 25.1 First customer segment

Target dealerships with:

- meaningful used-car inventory,
- one or more dedicated title/admin staff,
- recurring auction purchases or trade-ins,
- visible aged-title reporting,
- no complete digital coverage across all counterparties.

## 25.2 First ten interviews

Interview:

- 5 title clerks/title specialists,
- 2 office managers/controllers,
- 2 dealer-group operations leaders,
- 1 external title-service operator.

Questions:

1. Show me the last title case that took more than two weeks.
2. Which organizations did you contact?
3. How did you know whom to call next?
4. Where did you record the status?
5. What information did they ask you for?
6. What questions could a junior employee safely answer?
7. What questions require you personally?
8. How often do you repeat the call because the other party promised something?
9. Which counterparties are reachable by direct desk numbers versus IVR?
10. What would make you refuse to let an automated assistant perform this call?
11. What evidence would you need before trusting the result?
12. What existing systems already eliminate some of these calls?

The goal is to refine the exception taxonomy, not to collect compliments.

## 25.3 Pilot deployment

Start with one narrow counterparty type, likely auction title desks with known direct numbers.

Pilot sequence:

1. VINRelease drafts call preview.
2. Human approves each call.
3. Human reviews every structured result for first 20 calls.
4. Compare extraction to transcript/evidence.
5. Enable automatic state transition only after acceptable accuracy.
6. Do not enable automatic follow-up until contact/consent rules are validated.

---

# 26. Competitive landscape

## 26.1 Dealertrack / Vitu

Strength:

- connected digital payoff/title workflows,
- lender networks,
- mature automotive integrations.

VINRelease response:

> “We do not rebuild the connected happy path. We resolve the exceptions that fall outside it.”

## 26.2 Title-service companies such as Greenlight Titles

Strength:

- expertise,
- human judgment,
- complete service,
- knowledge of complex state-by-state processes.

VINRelease response:

> “We are an automation layer for repetitive exception chasing, not a replacement for expert title services.”

Potentially these companies become customers/partners rather than competitors.

## 26.3 Generic voice AI

Strength:

- flexible calls,
- broad use cases.

VINRelease response:

> “A call is only useful if it changes a governed title-case state. VINRelease owns the domain graph, evidence, contact authorization, and human escalation.”

## 26.4 Adjacent auto-title voice AI

Brilo markets inbound AI for auto title-loan companies, including payoff and lien-release questions. This validates voice automation in the domain but targets lender-side inbound servicing rather than dealer-side outbound exception chasing.

The distinction must remain crisp in the submission.

---

# 27. Defensibility and product moat

The initial CALL-E integration is reproducible. The moat cannot be “we used an AI phone API.”

Potential defensibility grows from:

## 27.1 Resolution graph data

Which blocker patterns follow which paths across auctions, lenders, title services, and states.

## 27.2 Contact routing knowledge

Which authorized department/contact reliably resolves which exception type.

## 27.3 Evidence and workflow history

Structured, timestamped outcome data can make title operations measurable rather than anecdotal.

## 27.4 Integrations

Over time VINRelease can ingest exceptions from DMS/title systems and write back verified updates.

## 27.5 Trust controls

A mature disclosure-budget, authorization, audit, and human-review layer creates operational confidence that generic voice tools may not provide out of the box.

Do not claim these as current moat. They are the direction of accumulated product advantage.

---

# 28. Risks and kill criteria

A winning team should know what could make the product bad.

## Risk 1 - Most exceptions are already digitally solvable

If customer interviews reveal that 90%+ of target dealerships' “title chasing” is already solved by Dealertrack/Vitu/DMS integrations and the remaining cases are rare legal one-offs, the market wedge may be too small.

**Kill/redirect threshold:** fewer than 3 repetitive external title-status calls per target dealership per week.

## Risk 2 - Direct contacts are rare; IVRs dominate

CALL-E can handle real-world calls and holds, but MVP should not assume advanced phone-tree control that has not been proven.

**Kill/redirect threshold for first segment:** fewer than ~50% of eligible target calls can reach a human/title desk through a provisioned, permitted number without unsupported routing.

## Risk 3 - External parties refuse automated assistants

Some organizations may require a named authorized human.

**Mitigation:** begin with consenting counterparties, title-service partners, or internal pilot destinations; disclose automation clearly.

## Risk 4 - Case questions require sensitive credentials

If counterparties routinely demand account credentials, customer PII, security codes, or legal attestation before giving useful status, autonomous calls become less viable.

**Product response:** stop; do not weaken safety boundaries.

## Risk 5 - Extraction errors create wrong workflow states

**Mitigation:** strict schema, evidence, confidence gates, human review, and conservative states such as `UNVERIFIED`/`NEEDS_HUMAN`.

## Risk 6 - Calling is useful but not frequent enough to pay for

**Mitigation:** test with multi-rooftop groups and title-service providers where case volume aggregates.

## Risk 7 - Existing title vendor adds this feature

Likely eventually.

**Mitigation:** focus on cross-system exceptions and the orchestration/evidence layer; integrations can make VINRelease complementary rather than competitive.

---

# 29. Metrics instrumentation

Every case should emit events suitable for a simple analytics table.

Events:

- `case_created`
- `case_ready_to_contact`
- `call_previewed`
- `call_authorized`
- `call_created`
- `call_completed`
- `call_unreachable`
- `result_validated`
- `result_rejected`
- `state_advanced`
- `human_review_created`
- `human_review_resolved`
- `waiting_external`
- `case_resolved`
- `case_closed`

Derived metrics:

```text
actionable_call_rate = actionable completed calls / completed calls
advance_rate = state-advancing calls / completed calls
human_escalation_rate = cases entering human review / active cases
median_update_latency = median(call_authorized -> verified state update)
exception_age = today - exception_start_date
```

Do not create vanity metrics like “AI confidence average” unless it demonstrably correlates with correctness.

---

# 30. Definition of done for the hackathon build

VINRelease is **done** when all of these are true:

## Product

- [ ] A new user can understand the problem from the first screen without explanation.
- [ ] Demo case clearly shows a stuck title and why it matters.
- [ ] User can preview exactly what the agent will say/disclose.
- [ ] User explicitly authorizes a live call.
- [ ] A real CALL-E call is created at runtime.
- [ ] Provider call ID is saved.
- [ ] Terminal result is fetched/ingested.
- [ ] Result passes strict validation.
- [ ] Case transitions automatically based on deterministic rule.
- [ ] Evidence source is visible.
- [ ] A second party can become the next authorized call.
- [ ] Human-stop path works.
- [ ] Demo mode cannot make a real call.

## Engineering

- [ ] API key is server-side only.
- [ ] No secrets committed.
- [ ] Idempotency test passes.
- [ ] Result-schema tests pass.
- [ ] State-engine tests pass.
- [ ] Unsupported result cannot silently advance a case.
- [ ] Deployed webhook/status path works.
- [ ] Error states are understandable.

## Safety

- [ ] Only provisioned authorized recipients can be dialed.
- [ ] Call preview lists disclosure budget.
- [ ] Payment/bank/credential fields are blocked.
- [ ] Unknown questions create human review.
- [ ] Live demo recipients have consented.
- [ ] Product never marks physical title received based only on vague external claim.

## Submission

- [ ] Required PR to CALL-E public repository is open.
- [ ] README explains setup, side effects, safety, and demo mode.
- [ ] Public demo video is approximately three minutes.
- [ ] Devpost links to PR.
- [ ] Video shows real CALL-E usage.
- [ ] Public app does not accidentally dial judges/users.

---

# 31. Demo copy and microcopy

Good product copy is operational and specific.

## Dashboard

**Title exceptions**  
“Cases that need a verified next step.”

## CTA

Prefer: **Resolve next blocker**  
Avoid: “Ask AI”

## Live status

Prefer: **Calling Metro Auto Auction title desk**  
Avoid: “Agent reasoning...”

## Result

Prefer: **Lien release is blocking title issuance**  
Avoid: “AI analysis complete”

## Human stop

Prefer: **VINRelease needs a title clerk**  
Subtext: “ABC Bank requested information outside the approved case packet.”

## Evidence

Prefer: **Verified by phone at 2:48 PM**  
Avoid: “AI confidence: 0.91” as the primary explanation.

---

# 32. Sample end-to-end case

## Case creation

```json
{
  "stockNumber": "4821",
  "vehicle": {
    "year": 2019,
    "make": "BMW",
    "model": "330i",
    "vinLast6": "xx7821"
  },
  "sourceOrganization": "Metro Auto Auction",
  "purchaseDate": "2026-08-14",
  "expectedTitleDate": "2026-08-18",
  "inventoryValue": 18700,
  "state": "ready_to_contact",
  "blocker": "unknown"
}
```

## Call #1 result

```json
{
  "party_reached": true,
  "case_located": true,
  "outcome": "blocked_external",
  "blocker_type": "lien_release_missing",
  "responsible_party": "lienholder",
  "responsible_party_name": "ABC Bank",
  "reference_number": null,
  "promised_action": null,
  "promised_date": null,
  "title_sent": false,
  "tracking_number": null,
  "needs_human": false,
  "human_reason": null,
  "unknown_questions": [],
  "notes": "Auction is waiting for the lien release."
}
```

System transition:

`READY_TO_CONTACT -> READY_FOR_NEXT_CALL`

Blocker:

`UNKNOWN -> LIEN_RELEASE_MISSING`

Owner:

`VINRELEASE -> ABC BANK`

## Call #2 result

```json
{
  "party_reached": true,
  "case_located": true,
  "outcome": "waiting_external",
  "blocker_type": "release_sent_not_received",
  "responsible_party": "auction",
  "responsible_party_name": "Metro Auto Auction",
  "reference_number": "LR-4721",
  "promised_action": "Lien release sent to auction",
  "promised_date": "2026-09-08",
  "title_sent": false,
  "tracking_number": null,
  "needs_human": false,
  "human_reason": null,
  "unknown_questions": [],
  "notes": "Lienholder states release was transmitted Sep 8."
}
```

System transition:

`READY_FOR_NEXT_CALL -> WAITING_EXTERNAL` or `READY_FOR_NEXT_CALL` depending on configured policy.

Current status:

```text
RELEASE SENT - RECEIPT UNCONFIRMED
Reference LR-4721
Next owner: Metro Auto Auction
```

This is a better outcome than falsely showing `RESOLVED`.

---

# 33. Technical implementation notes for CALL-E

CALL-E currently supports server SDKs and a Developer API. Public examples show `POST /v1/calls`, strict `result_schema` / `recipient_result_schema`, idempotency keys, call status retrieval, evidence, structured results, and webhook support.

Recommended creation pattern conceptually:

```ts
const call = await client.calls.create({
  task: buildVinReleaseTask(casePacket, contact),
  recipients: [{
    phones: [contact.phoneE164],
    region: contact.region,
    locale: contact.locale
  }],
  recipientResultSchema: vinReleaseResultSchema,
  metadata: {
    app: "vinrelease",
    case_id: caseRecord.id,
    contact_id: contact.id,
    action_type: action.type
  },
  webhookUrl: `${PUBLIC_BASE_URL}/api/calle/webhook`,
  idempotencyKey
});
```

Use the exact installed SDK/API field names from the current CALL-E documentation during implementation; the pseudocode above specifies the product contract, not a promise of a particular SDK method signature.

On completion:

1. fetch provider record by `call_id`,
2. validate target recipient,
3. validate structured result,
4. persist raw provider metadata safely,
5. run resolution engine,
6. write state transition in a database transaction,
7. update UI.

---

# 34. Submission narrative draft

## Inspiration

Dealership title software is increasingly digital, yet the hardest cases still fall into an exception queue. When a title is missing, a lien release has not arrived, or two organizations disagree about status, a title clerk starts calling people. Those calls are repetitive, hard to audit, and tied to vehicles whose inventory value remains blocked.

## What it does

VINRelease gives a dealership title team an exception-resolution workspace. A clerk opens a stuck title case and authorizes VINRelease to contact a provisioned auction or lienholder. CALL-E handles the live conversation and returns a strict structured result. VINRelease then validates the result, records evidence, changes the case state, and determines the next allowed action. If the next blocker belongs to another approved external party, the workflow can continue. If the call requires a credential, financial decision, document, legal judgment, or unknown fact, VINRelease stops and asks a human.

## How we built it

VINRelease uses CALL-E as its real-world phone execution layer and keeps the dealership workflow deterministic. Each call is purpose-bounded by an approved contact and disclosure budget. Results are constrained by JSON Schema, keyed with an idempotency token, and converted by a rule-based title-resolution engine into states such as `LIEN_RELEASE_MISSING`, `WAITING_EXTERNAL`, `READY_FOR_NEXT_CALL`, and `NEEDS_HUMAN`. The UI presents evidence and a chronological resolution graph rather than hiding outcomes in transcripts.

## What makes it different

The phone call is not the final output. It is an edge in a business process. VINRelease is designed for the “exception tail” left after normal digital title systems have done everything they can.

## What we learned

Reliable automation needs a strong abstention boundary. A successful phone connection is not the same as a verified title status, and an external party saying “it was sent” is not the same as the dealership physically receiving a title. VINRelease therefore preserves intermediate states instead of forcing every conversation into success/failure.

## What's next

Pilot with dealership title teams, measure the frequency and shape of repetitive exception calls, add scheduled follow-ups, then integrate exception intake/writeback with dealership title systems. The long-term vision is an operations layer that handles cross-organization title exceptions while human experts keep control of compliance-heavy decisions.

---

# 35. Product principles

1. **Product before AI.** The customer buys a resolved queue, not a model.
2. **Evidence before confidence.** Show why a state changed.
3. **Unknown is a valid outcome.** Never manufacture progress.
4. **Human expertise is scarce.** Automate chasing; escalate judgment.
5. **The happy path is not our market.** Integrate with it later.
6. **Every call needs a purpose.** No generic outreach.
7. **Every phone number is governed.** No arbitrary dialing.
8. **Every autonomous action must be reversible or low-risk.** Consequential decisions stop.
9. **One exceptional workflow executed completely beats ten shallow features.**
10. **A judge should feel the product even with the AI labels removed.**

---

# 36. Final build commandment

During implementation, whenever somebody suggests a feature, ask:

> **Does this help an overdue title case move from an unknown blocker to a verified next step?**

If the answer is no, cut it.

The winning version of VINRelease is not the version with the most screens. It is the version where a judge watches one stuck vehicle move through a credible real-world resolution chain and immediately thinks:

> **“A title department would use this.”**

That is what success should look like.

---

# Appendix A - Source and evidence notes

The product specification uses the following external material as market/technical evidence. Vendor statistics are labeled as vendor-reported and should not be presented as independent industry averages.

**S1. CALL-E Devpost challenge page / supplied hackathon brief.**  
Key facts: build a functional CALL-E application/skill/plugin, demonstrate real runtime use, submit a PR to the public repository, include an approximately three-minute public video; judging emphasizes real-world impact, idea quality, technical implementation, and product experience/demo.  
https://call-e.devpost.com/

**S2. CALL-E Integrations repository.**  
Key facts: supported SDK/API paths, strict structured results, call IDs/status, evidence, idempotency examples, webhooks, hold/transfer support, safety/governance features.  
https://github.com/CALLE-AI/call-e-integrations

**S3. Vitu Accelerated Title for Dealers.**  
Vendor-reported evidence: accelerated payoff/title workflow, 4-6 day target, 170+ lender network, 22+ day conventional comparison, holding-cost framing and $36/day calculator-derived figure.  
https://vitu.com/products/atdealer.html

**S4. Dealertrack Payoff Quotes & Titling.**  
Evidence that the happy path is already digitized: real-time payoff quotes from 300+ lenders, electronic payoff/title-release workflow.  
https://us.dealertrack.com/content/dealertrack/en/f-and-i/payoff-quotes-and-titling.html

**S5. Greenlight Titles - About.**  
Evidence of paid human service handling title paperwork, phone calls, and follow-up for dealers/fleets/finance companies.  
https://greenlighttitles.com/about/

**S6. Greenlight Titles - Auto Dealer Title Services.**  
Evidence of dealership title/registration administrative burden, waiting on hold, persistent follow-up, duplicate-title and out-of-state complexity.  
https://greenlighttitles.com/auto-dealer-title-services/

**S7. Brilo AI - Auto Title Loan Voice Agent.**  
Adjacent competitor evidence: lender-side inbound voice automation around applications, payoff balances, lien-release questions, and disputes.  
https://www.brilo.ai/industry/auto-title-loan-companies

**S8. CALL-E Awesome Phone Call Agents repository.**  
Evidence of repository contribution structure and safety patterns such as contact authorization, disclosure budgets, dry-run/preview behavior, and controlled side effects.  
https://github.com/CALLE-AI/awesome-phone-call-agents

**S9. FieldRelay - current CALL-E submission.**  
Competitive benchmark: authorized vendor calls, schema-constrained results, idempotency, human approval for cost/risk. VINRelease must go beyond “call + structured extraction” with its domain resolution graph.  
https://devpost.com/software/fieldrelay

---

# Appendix B - Glossary

**Title exception:** A vehicle-title case that cannot proceed through the normal expected workflow without investigation, correction, external action, or human review.

**Blocker:** The currently verified reason the case cannot advance.

**Responsible party / owner:** The organization or human currently expected to take the next real-world action.

**State transition:** A change in VINRelease's workflow representation supported by evidence or explicit human action.

**Disclosure budget:** The exact set of information the phone agent is permitted to reveal for one call purpose.

**Approved contact:** A phone destination provisioned for a defined organization/purpose and authorized for outbound calling.

**Actionable result:** A call result that either advances the case, establishes a waiting state, or clearly identifies human action required.

**Resolution graph:** The sequence of evidence-backed states and parties through which a title exception moves.

**Human gate:** A point where VINRelease stops autonomous progression because the next step involves judgment, unsupported facts, credentials, money, legal/compliance action, or unapproved contact information.

**Happy path:** A title/payoff process successfully handled by normal digital systems and integrations without manual exception chasing.

**Exception tail:** The remaining irregular cases that require cross-organization investigation and follow-up.
