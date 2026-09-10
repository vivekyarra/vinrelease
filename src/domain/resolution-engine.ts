import type { CallResult, CaseState, TitleCase } from "./model";

export type ResolutionDecision = {
  nextState: CaseState;
  blocker: TitleCase["blocker"];
  owner: string;
  label: string;
  evidence: string;
  humanReason?: string;
};

export function resolveCallResult(current: TitleCase, result: CallResult): ResolutionDecision {
  if (result.needs_human || result.unknown_questions.length > 0) {
    return humanStop(result.human_reason ?? "The recipient requested information outside the approved case packet.");
  }

  if (!result.party_reached || result.outcome === "unreachable") {
    return {
      nextState: "WAITING_EXTERNAL",
      blocker: "unreachable",
      owner: current.blockerOwner,
      label: "Contact attempt did not reach the title desk",
      evidence: result.notes,
    };
  }

  if (!result.case_located || result.outcome === "case_not_located") {
    return humanStop("The external party could not locate this case. A title clerk must verify identifiers.");
  }

  if (result.outcome === "wrong_department" || result.blocker_type === "wrong_department") {
    return humanStop("The approved number reached the wrong department. A new number must be approved before calling.");
  }

  if (result.blocker_type === "document_rejected") {
    return humanStop("The document was rejected and requires title-clerk judgment.");
  }

  if (result.blocker_type === "lien_release_missing") {
    const approvedLienholder = current.contacts.find(
      (contact) => contact.authorized && contact.active && contact.department === "Lien Release Desk",
    );
    if (!approvedLienholder) {
      return humanStop("A lienholder was identified, but no approved lien-release contact exists.");
    }
    return {
      nextState: "READY_FOR_NEXT_CALL",
      blocker: "lien_release_missing",
      owner: result.responsible_party_name ?? approvedLienholder.organization,
      label: "Lien release is blocking title issuance",
      evidence: result.notes,
    };
  }

  if (result.blocker_type === "release_sent_not_received" || result.outcome === "waiting_external") {
    const reference = result.reference_number ? ` Reference ${result.reference_number}.` : "";
    return {
      nextState: "WAITING_EXTERNAL",
      blocker: "release_sent_not_received",
      owner: result.responsible_party_name ?? "Metro Auto Auction",
      label: "Release sent — receipt unconfirmed",
      evidence: `${result.notes}${reference}`,
    };
  }

  if (result.blocker_type === "title_shipped" && result.tracking_number) {
    return {
      nextState: "WAITING_EXTERNAL",
      blocker: "title_shipped",
      owner: current.dealership,
      label: "Title shipped — physical receipt unconfirmed",
      evidence: `${result.notes} Tracking ${result.tracking_number}.`,
    };
  }

  return humanStop("The result did not match a safe automatic transition.");
}

function humanStop(reason: string): ResolutionDecision {
  return {
    nextState: "NEEDS_HUMAN",
    blocker: "unknown",
    owner: "Title clerk",
    label: "VINRelease needs a title clerk",
    evidence: reason,
    humanReason: reason,
  };
}
