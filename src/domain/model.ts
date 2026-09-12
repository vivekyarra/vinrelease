import { z } from "zod";

export const caseStateSchema = z.enum([
  "NEW",
  "READY_TO_CONTACT",
  "CALL_IN_PROGRESS",
  "ACTIONABLE_RESULT",
  "READY_FOR_NEXT_CALL",
  "WAITING_EXTERNAL",
  "NEEDS_HUMAN",
  "CLOSED",
]);

export const blockerSchema = z.enum([
  "unknown",
  "lien_release_missing",
  "release_sent_not_received",
  "title_shipped",
  "document_rejected",
  "case_not_located",
  "wrong_department",
  "unreachable",
]);

export const callOutcomeSchema = z.enum([
  "blocked_external",
  "waiting_external",
  "resolved_claimed",
  "unreachable",
  "wrong_department",
  "case_not_located",
  "needs_human",
]);

export const callResultSchema = z.object({
  party_reached: z.boolean(),
  case_located: z.boolean(),
  outcome: callOutcomeSchema,
  blocker_type: blockerSchema,
  responsible_party: z.enum(["auction", "lienholder", "dealer", "unknown"]),
  responsible_party_name: z.string().nullable(),
  reference_number: z.string().nullable(),
  promised_action: z.string().nullable(),
  promised_date: z.string().date().nullable(),
  title_sent: z.boolean(),
  tracking_number: z.string().nullable(),
  needs_human: z.boolean(),
  human_reason: z.string().nullable(),
  unknown_questions: z.array(z.string()),
  notes: z.string(),
}).strict();

const calleWireResultSchema = z.object({
  party_reached: z.boolean(),
  case_located: z.boolean(),
  outcome: callOutcomeSchema,
  blocker_type: blockerSchema,
  responsible_party: z.enum(["auction", "lienholder", "dealer", "unknown"]),
  responsible_party_name: z.string(),
  reference_number: z.string(),
  promised_action: z.string(),
  promised_date: z.union([z.literal(""), z.string().date()]),
  title_sent: z.boolean(),
  tracking_number: z.string(),
  needs_human: z.boolean(),
  human_reason: z.string(),
  unknown_questions: z.array(z.string()),
  notes: z.string(),
}).strict();

export function normalizeCalleResult(raw: unknown): CallResult {
  const wire = calleWireResultSchema.parse(raw);
  const nullable = (value: string) => value.trim() === "" ? null : value;
  return callResultSchema.parse({
    ...wire,
    responsible_party_name: nullable(wire.responsible_party_name),
    reference_number: nullable(wire.reference_number),
    promised_action: nullable(wire.promised_action),
    promised_date: nullable(wire.promised_date),
    tracking_number: nullable(wire.tracking_number),
    human_reason: nullable(wire.human_reason),
  });
}

export type CaseState = z.infer<typeof caseStateSchema>;
export type Blocker = z.infer<typeof blockerSchema>;
export type CallResult = z.infer<typeof callResultSchema>;

export type Contact = {
  id: string;
  organization: string;
  department: string;
  phoneE164: string;
  phoneDisplay: string;
  region: string;
  locale: string;
  provenance: string;
  authorized: boolean;
  active: boolean;
  allowedDisclosureFields: string[];
};

export type CallTask = {
  id: string;
  providerCallId: string;
  contactId: string;
  idempotencyKey: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  createdAt: string;
  completedAt: string | null;
  result: CallResult | null;
  evidence: string[];
  summary: string | null;
  transcriptReference: string | null;
};

export type Transition = {
  id: string;
  from: CaseState;
  to: CaseState;
  blocker: Blocker;
  label: string;
  evidence: string;
  callTaskId: string | null;
  at: string;
};

export type ReviewItem = {
  id: string;
  reason: string;
  requiredAction: string;
  createdAt: string;
  resolvedAt: string | null;
};

export type TitleCase = {
  id: string;
  stockNumber: string;
  dealership: string;
  vehicle: { year: number; make: string; model: string; vinLast6: string };
  sourceOrganization: string;
  purchaseDate: string;
  expectedTitleDate: string;
  inventoryValue: number;
  state: CaseState;
  blocker: Blocker;
  blockerOwner: string;
  currentNote: string;
  attemptGeneration: number;
  contacts: Contact[];
  calls: CallTask[];
  transitions: Transition[];
  reviewItems: ReviewItem[];
  updatedAt: string;
};

export const CALLE_RECIPIENT_RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "party_reached", "case_located", "outcome", "blocker_type",
    "responsible_party", "responsible_party_name", "reference_number",
    "promised_action", "promised_date", "title_sent", "tracking_number",
    "needs_human", "human_reason", "unknown_questions", "notes",
  ],
  properties: {
    party_reached: { type: "boolean" },
    case_located: { type: "boolean" },
    outcome: { type: "string", enum: callOutcomeSchema.options },
    blocker_type: { type: "string", enum: blockerSchema.options },
    responsible_party: { type: "string", enum: ["auction", "lienholder", "dealer", "unknown"] },
    responsible_party_name: { type: "string", description: "Name of the responsible party, or an empty string when unknown." },
    reference_number: { type: "string", description: "Reference number stated during the call, or an empty string when unavailable." },
    promised_action: { type: "string", description: "Action explicitly promised by the recipient, or an empty string when none was promised." },
    promised_date: { type: "string", description: "Promised date in YYYY-MM-DD format, or an empty string when no date was promised." },
    title_sent: { type: "boolean" },
    tracking_number: { type: "string", description: "Shipment tracking number stated during the call, or an empty string when unavailable." },
    needs_human: { type: "boolean" },
    human_reason: { type: "string", description: "Why human review is required, or an empty string when it is not required." },
    unknown_questions: { type: "array", items: { type: "string" } },
    notes: { type: "string" },
  },
} as const;
