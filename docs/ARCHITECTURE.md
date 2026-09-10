# Architecture

VINRelease separates the case decision from the phone provider. `src/calle/provider.ts` is the only module that creates or reads CALL-E calls. It translates provider responses into the domain result schema before the resolution engine can see them.

The path is:

1. The UI asks the server for a preview of the only contact allowed in the current state.
2. The server checks that the contact is active, approved, and E.164, then hashes the recipient, purpose, questions, and disclosure packet into a preview fingerprint.
3. The user authorizes that exact preview.
4. The server checks the fingerprint again and creates one CALL-E task with a stable idempotency key.
5. A strict Zod schema rejects malformed results. The deterministic resolution engine maps valid evidence into one allowed next state.
6. Each move appends a transition linked to the call task. Unsupported results create a review item.

The demo provider returns fixtures through the same result schema and state machine. Hosted demo state is represented by a compact HTTP-only cookie and materialized on each request. Live state currently uses an in-process repository suited to a controlled single-process evaluation; durable Postgres storage is the planned adapter for multi-user production use.

CALL-E webhooks are currently treated as unsigned hints. VINRelease deduplicates the event identifier and fetches the canonical call from CALL-E before applying a terminal result.
