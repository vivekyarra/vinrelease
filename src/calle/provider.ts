import { CalleClient, type Call } from "@call-e/calle";
import { callResultSchema, CALLE_RECIPIENT_RESULT_SCHEMA, type CallResult, type Contact, type TitleCase } from "@/domain/model";
import { AUCTION_RESULT, HUMAN_STOP_RESULT, LIENHOLDER_RESULT } from "@/fixtures/demo";
import type { CallPreview } from "@/safety/call-policy";
import { buildCallTask } from "./task-builder";

const CALLE_API_BASE_URL = "https://api.heycall-e.com";

export type ProviderResult = {
  providerCallId: string;
  status: "queued" | "in_progress" | "completed" | "failed";
  completedAt: string | null;
  result: CallResult | null;
  evidence: string[];
  summary: string | null;
  transcriptReference: string | null;
};

export type ProviderMode = "demo" | "live";

export function providerMode(): ProviderMode {
  return process.env.VINRELEASE_MODE === "live" ? "live" : "demo";
}

export async function createProviderCall(input: {
  titleCase: TitleCase;
  contact: Contact;
  preview: CallPreview;
  idempotencyKey: string;
  scenario?: "standard" | "human-stop";
}): Promise<ProviderResult> {
  if (providerMode() === "demo") {
    const result = input.scenario === "human-stop"
      ? HUMAN_STOP_RESULT
      : input.contact.department === "Lien Release Desk" ? LIENHOLDER_RESULT : AUCTION_RESULT;
    return {
      providerCallId: `demo-${input.titleCase.stockNumber}-${input.titleCase.attemptGeneration}`,
      status: "completed",
      completedAt: new Date().toISOString(),
      result: callResultSchema.parse(result),
      evidence: [result.notes],
      summary: result.notes,
      transcriptReference: `demo://transcript/${input.titleCase.id}/${input.titleCase.attemptGeneration}`,
    };
  }

  const apiKey = process.env.CALLE_API_KEY;
  if (!apiKey) throw new Error("Live mode requires CALLE_API_KEY on the server.");
  const client = new CalleClient({
    apiKey,
    baseUrl: CALLE_API_BASE_URL,
  });
  const call = await client.calls.create({
    task: buildCallTask(input.titleCase, input.contact, input.preview),
    recipients: [{ phones: [input.contact.phoneE164], region: input.contact.region, locale: input.contact.locale }],
    recipientResultSchema: CALLE_RECIPIENT_RESULT_SCHEMA,
    metadata: {
      app: "vinrelease",
      case_id: input.titleCase.id,
      contact_id: input.contact.id,
      action_type: "resolve_next_blocker",
    },
    webhookUrl: process.env.PUBLIC_BASE_URL ? `${process.env.PUBLIC_BASE_URL}/api/calle/webhook` : undefined,
  }, { idempotencyKey: input.idempotencyKey });
  return normalizeCall(call);
}

export async function getProviderCall(providerCallId: string): Promise<ProviderResult> {
  if (providerCallId.startsWith("demo-")) throw new Error("Demo calls are already materialized locally.");
  const apiKey = process.env.CALLE_API_KEY;
  if (!apiKey) throw new Error("Live mode requires CALLE_API_KEY on the server.");
  const client = new CalleClient({ apiKey, baseUrl: CALLE_API_BASE_URL });
  return normalizeCall(await client.calls.get(providerCallId));
}

function normalizeCall(call: Call): ProviderResult {
  const raw = call.recipients[0]?.structuredResult;
  const status = call.status === "completed" ? "completed"
    : call.status === "failed" || call.status === "canceled" ? "failed"
      : call.status === "in_progress" ? "in_progress" : "queued";
  return {
    providerCallId: call.id,
    status,
    completedAt: call.completedAt,
    result: raw ? callResultSchema.parse(raw) : null,
    evidence: call.evidence,
    summary: call.summary,
    transcriptReference: call.recipients[0]?.attempts[0]?.id
      ? `calle://calls/${call.id}/attempts/${call.recipients[0].attempts[0].id}`
      : `calle://calls/${call.id}`,
  };
}
