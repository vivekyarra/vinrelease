import { CalleClient } from "@call-e/calle";
import { CALLE_RECIPIENT_RESULT_SCHEMA, normalizeCalleResult } from "../src/domain/model";
import { createDemoCase } from "../src/fixtures/demo";
import { buildCallPreview } from "../src/safety/call-policy";
import { buildCallTask } from "../src/calle/task-builder";

const CONFIRM_FLAG = "--confirm-one-real-call";
const API_BASE_URL = "https://api.heycall-e.com";

function required(name: string) {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`Missing ${name}. Configure it in .env.local before live verification.`);
  return value;
}

if (!process.argv.includes(CONFIRM_FLAG)) {
  throw new Error(`No call was placed. Re-run with ${CONFIRM_FLAG} only when the displayed destination is controlled by you or the recipient has explicitly consented.`);
}
if (process.env.VINRELEASE_MODE !== "live") {
  throw new Error("No call was placed. VINRELEASE_MODE must be live for this explicit proof command.");
}

const apiKey = required("CALLE_API_KEY");
const runId = required("VINRELEASE_LIVE_RUN_ID");
if (!/^[a-zA-Z0-9][a-zA-Z0-9_-]{5,63}$/.test(runId)) {
  throw new Error("VINRELEASE_LIVE_RUN_ID must be a fresh 6-64 character label using only letters, numbers, underscores, or hyphens.");
}

const titleCase = createDemoCase();
const contact = titleCase.contacts.find((item) => item.id === "contact-auction");
if (!contact) throw new Error("Auction contact fixture is unavailable.");
const preview = buildCallPreview(titleCase, contact.id);

console.log(`Authorized proof target: ${contact.phoneDisplay}`);
console.log("Maximum side effect: one CALL-E call. Re-running this run ID reuses the same idempotency key.");

const client = new CalleClient({ apiKey, baseUrl: API_BASE_URL });
const idempotencyKey = `vinrelease:live-proof:${runId}:auction`;
const created = await client.calls.create({
  task: buildCallTask(titleCase, contact, preview),
  recipients: [{ phones: [contact.phoneE164], region: contact.region, locale: contact.locale }],
  recipientResultSchema: CALLE_RECIPIENT_RESULT_SCHEMA,
  metadata: {
    app: "vinrelease",
    proof_run_id: runId,
    case_id: titleCase.id,
    contact_id: contact.id,
    action_type: "resolve_next_blocker",
  },
}, { idempotencyKey });

console.log(`CALL-E call created: ${created.id}`);
const completed = await client.calls.waitForResult(created.id, { intervalMs: 5_000, timeoutMs: 12 * 60_000 });
const rawResult = completed.recipients[0]?.structuredResult;
const result = normalizeCalleResult(rawResult);

console.log(JSON.stringify({
  provider: "CALL-E",
  providerCallId: completed.id,
  status: completed.status,
  completedAt: completed.completedAt,
  resultValidated: true,
  outcome: result.outcome,
  blockerType: result.blocker_type,
  needsHuman: result.needs_human,
  evidenceCount: completed.evidence.length,
  transcriptAttemptId: completed.recipients[0]?.attempts[0]?.id ?? null,
  idempotencyKey,
}, null, 2));
