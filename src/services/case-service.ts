import { randomUUID } from "node:crypto";
import { callResultSchema, type CallTask, type TitleCase } from "@/domain/model";
import { resolveCallResult } from "@/domain/resolution-engine";
import { getCase, saveCase } from "@/db/repository";
import { createProviderCall, getProviderCall, type ProviderResult } from "@/calle/provider";
import { buildCallPreview, idempotencyKey } from "@/safety/call-policy";

export function previewCall(caseId: string, contactId: string) {
  const titleCase = requireCase(caseId);
  assertContactAllowedForState(titleCase, contactId);
  return buildCallPreview(titleCase, contactId);
}

export async function authorizeCall(input: {
  caseId: string;
  contactId: string;
  confirmed: boolean;
  previewFingerprint: string;
  scenario?: "standard" | "human-stop";
}) {
  if (!input.confirmed) throw new Error("Explicit call authorization is required.");
  const titleCase = requireCase(input.caseId);
  const key = idempotencyKey(titleCase, input.contactId);
  const priorGenerationKey = `${titleCase.id}:resolve-next-blocker:${input.contactId}:${titleCase.attemptGeneration - 1}`;
  const existing = titleCase.calls.find((call) => call.idempotencyKey === key || call.idempotencyKey === priorGenerationKey);
  if (existing) return { titleCase, task: existing, duplicate: true };
  assertContactAllowedForState(titleCase, input.contactId);
  const preview = buildCallPreview(titleCase, input.contactId);
  if (preview.fingerprint !== input.previewFingerprint) {
    throw new Error("The call preview changed. Review and authorize the current preview.");
  }
  const contact = titleCase.contacts.find((item) => item.id === input.contactId)!;
  const provider = await createProviderCall({ titleCase, contact, preview, idempotencyKey: key, scenario: input.scenario });
  const task: CallTask = {
    id: `task-${randomUUID()}`,
    providerCallId: provider.providerCallId,
    contactId: input.contactId,
    idempotencyKey: key,
    status: provider.status,
    createdAt: new Date().toISOString(),
    completedAt: provider.completedAt,
    result: null,
    evidence: provider.evidence,
    summary: provider.summary,
    transcriptReference: provider.transcriptReference,
  };
  titleCase.calls.push(task);
  titleCase.state = provider.status === "completed" ? "ACTIONABLE_RESULT" : "CALL_IN_PROGRESS";
  saveCase(titleCase);
  const updated = provider.status === "completed" ? applyProviderResult(input.caseId, task.id, provider) : requireCase(input.caseId);
  return { titleCase: updated, task: updated.calls.find((item) => item.id === task.id)!, duplicate: false };
}

export async function refreshCall(caseId: string, taskId: string) {
  const titleCase = requireCase(caseId);
  const task = titleCase.calls.find((item) => item.id === taskId);
  if (!task) throw new Error("Call task not found.");
  if (task.status === "completed" || task.status === "failed") return { titleCase, task };
  const provider = await getProviderCall(task.providerCallId);
  const updated = provider.status === "completed" || provider.status === "failed"
    ? applyProviderResult(caseId, taskId, provider)
    : updateProgress(titleCase, taskId, provider);
  return { titleCase: updated, task: updated.calls.find((item) => item.id === taskId)! };
}

export function ingestCanonicalResult(caseId: string, taskId: string, provider: ProviderResult) {
  return applyProviderResult(caseId, taskId, provider);
}

function updateProgress(titleCase: TitleCase, taskId: string, provider: ProviderResult) {
  const task = titleCase.calls.find((item) => item.id === taskId)!;
  Object.assign(task, provider, { id: task.id, providerCallId: task.providerCallId, idempotencyKey: task.idempotencyKey, contactId: task.contactId, createdAt: task.createdAt });
  return saveCase(titleCase);
}

function applyProviderResult(caseId: string, taskId: string, provider: ProviderResult) {
  const titleCase = requireCase(caseId);
  const task = titleCase.calls.find((item) => item.id === taskId);
  if (!task) throw new Error("Call task not found.");
  if (task.result) return titleCase;

  if (provider.status === "failed" || !provider.result) {
    task.status = "failed";
    task.completedAt = provider.completedAt ?? new Date().toISOString();
    titleCase.state = "NEEDS_HUMAN";
    titleCase.reviewItems.push({
      id: `review-${randomUUID()}`,
      reason: provider.summary ?? "CALL-E completed without a usable structured result.",
      requiredAction: "Review the provider record before deciding whether to call again.",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    });
    return saveCase(titleCase);
  }

  const validated = callResultSchema.parse(provider.result);
  Object.assign(task, {
    status: "completed",
    completedAt: provider.completedAt ?? new Date().toISOString(),
    result: validated,
    evidence: provider.evidence,
    summary: provider.summary,
    transcriptReference: provider.transcriptReference,
  });
  const decision = resolveCallResult(titleCase, validated);
  const from = titleCase.state;
  titleCase.state = decision.nextState;
  titleCase.blocker = decision.blocker;
  titleCase.blockerOwner = decision.owner;
  titleCase.currentNote = decision.label;
  titleCase.transitions.push({
    id: `transition-${randomUUID()}`,
    from,
    to: decision.nextState,
    blocker: decision.blocker,
    label: decision.label,
    evidence: decision.evidence,
    callTaskId: task.id,
    at: new Date().toISOString(),
  });
  if (decision.humanReason) {
    titleCase.reviewItems.push({
      id: `review-${randomUUID()}`,
      reason: decision.humanReason,
      requiredAction: "Verify the requested information and choose the next action manually.",
      createdAt: new Date().toISOString(),
      resolvedAt: null,
    });
  }
  titleCase.attemptGeneration += 1;
  return saveCase(titleCase);
}

function requireCase(id: string) {
  const titleCase = getCase(id);
  if (!titleCase) throw new Error("Case not found.");
  return titleCase;
}

function assertContactAllowedForState(titleCase: TitleCase, contactId: string) {
  const expected = titleCase.state === "READY_TO_CONTACT" ? "contact-auction"
    : titleCase.state === "READY_FOR_NEXT_CALL" ? "contact-lienholder" : null;
  if (!expected || contactId !== expected) throw new Error("This contact is not the allowed next action for the current case state.");
}
