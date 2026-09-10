import { createDemoCase, AUCTION_RESULT, HUMAN_STOP_RESULT, LIENHOLDER_RESULT } from "@/fixtures/demo";
import type { CallResult, CallTask, TitleCase } from "@/domain/model";
import { resolveCallResult } from "@/domain/resolution-engine";
import { buildCallPreview } from "@/safety/call-policy";

export const DEMO_COOKIE = "vinrelease_demo_state";
export type DemoState = "start" | "auction-complete" | "lienholder-complete" | "human-stop";

export function normalizeDemoState(value: string | undefined): DemoState {
  return value === "auction-complete" || value === "lienholder-complete" || value === "human-stop" ? value : "start";
}

export function materializeDemoCase(state: DemoState): TitleCase {
  const titleCase = createDemoCase();
  if (state === "start") return titleCase;
  applyDemoResult(titleCase, "contact-auction", state === "human-stop" ? HUMAN_STOP_RESULT : AUCTION_RESULT, 1);
  if (state === "lienholder-complete") applyDemoResult(titleCase, "contact-lienholder", LIENHOLDER_RESULT, 2);
  return titleCase;
}

export function authorizeDemoCall(input: {
  state: DemoState;
  caseId: string;
  contactId: string;
  previewFingerprint: string;
  scenario?: "standard" | "human-stop";
}) {
  const titleCase = materializeDemoCase(input.state);
  if (titleCase.id !== input.caseId) throw new Error("Case not found.");
  const expectedContact = titleCase.state === "READY_TO_CONTACT" ? "contact-auction"
    : titleCase.state === "READY_FOR_NEXT_CALL" ? "contact-lienholder" : null;
  if (!expectedContact || input.contactId !== expectedContact) throw new Error("This contact is not the allowed next action for the current case state.");
  const preview = buildCallPreview(titleCase, input.contactId);
  if (preview.fingerprint !== input.previewFingerprint) throw new Error("The call preview changed. Review and authorize the current preview.");
  const result = input.scenario === "human-stop" ? HUMAN_STOP_RESULT
    : input.contactId === "contact-lienholder" ? LIENHOLDER_RESULT : AUCTION_RESULT;
  const task = applyDemoResult(titleCase, input.contactId, result, titleCase.attemptGeneration);
  const state: DemoState = result === HUMAN_STOP_RESULT ? "human-stop"
    : input.contactId === "contact-lienholder" ? "lienholder-complete" : "auction-complete";
  return { titleCase, task, duplicate: false, state };
}

function applyDemoResult(titleCase: TitleCase, contactId: string, result: CallResult, generation: number): CallTask {
  const now = new Date(Date.UTC(2026, 8, 10, 9, generation * 4)).toISOString();
  const task: CallTask = {
    id: `demo-task-${generation}`,
    providerCallId: `demo-${titleCase.stockNumber}-${generation}`,
    contactId,
    idempotencyKey: `${titleCase.id}:resolve-next-blocker:${contactId}:${generation}`,
    status: "completed",
    createdAt: now,
    completedAt: now,
    result,
    evidence: [result.notes],
    summary: result.notes,
    transcriptReference: `demo://transcript/${titleCase.id}/${generation}`,
  };
  titleCase.calls.push(task);
  const decision = resolveCallResult(titleCase, result);
  const from = titleCase.state;
  titleCase.state = decision.nextState;
  titleCase.blocker = decision.blocker;
  titleCase.blockerOwner = decision.owner;
  titleCase.currentNote = decision.label;
  titleCase.transitions.push({
    id: `demo-transition-${generation}`,
    from,
    to: decision.nextState,
    blocker: decision.blocker,
    label: decision.label,
    evidence: decision.evidence,
    callTaskId: task.id,
    at: now,
  });
  if (decision.humanReason) {
    titleCase.reviewItems.push({
      id: `demo-review-${generation}`,
      reason: decision.humanReason,
      requiredAction: "Verify the requested information and choose the next action manually.",
      createdAt: now,
      resolvedAt: null,
    });
  }
  titleCase.attemptGeneration += 1;
  titleCase.updatedAt = now;
  return task;
}
