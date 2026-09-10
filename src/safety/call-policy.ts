import { createHash } from "node:crypto";
import type { Contact, TitleCase } from "@/domain/model";

export const FORBIDDEN_DISCLOSURE_FIELDS = new Set([
  "bank_account",
  "routing_number",
  "payment_card",
  "password",
  "security_code",
  "ssn",
  "legal_attestation",
]);

export type CallPreview = {
  caseId: string;
  contactId: string;
  target: string;
  phoneDisplay: string;
  purpose: string;
  mayDisclose: string[];
  mayAsk: string[];
  prohibited: string[];
  expectedTransition: string;
  fingerprint: string;
};

export function assertApprovedContact(contact: Contact | undefined): asserts contact is Contact {
  if (!contact?.authorized || !contact.active) {
    throw new Error("This contact is not provisioned and authorized for calling.");
  }
  if (!/^\+[1-9]\d{7,14}$/.test(contact.phoneE164)) {
    throw new Error("The approved contact does not have a valid E.164 phone number.");
  }
}

export function validateDisclosureBudget(fields: string[]) {
  for (const field of fields) {
    if (FORBIDDEN_DISCLOSURE_FIELDS.has(field)) {
      throw new Error(`Forbidden disclosure field: ${field}`);
    }
  }
  return fields;
}

export function buildCallPreview(titleCase: TitleCase, contactId: string): CallPreview {
  const contact = titleCase.contacts.find((item) => item.id === contactId);
  assertApprovedContact(contact);
  const mayDisclose = validateDisclosureBudget(contact.allowedDisclosureFields);
  const isLienholder = contact.department === "Lien Release Desk";
  const previewBase = {
    caseId: titleCase.id,
    contactId,
    target: `${contact.organization} — ${contact.department}`,
    phoneDisplay: contact.phoneDisplay,
    purpose: isLienholder
      ? "Confirm whether the lien release was sent, when, and under which reference."
      : "Locate the purchased vehicle and identify the specific blocker preventing title issuance.",
    mayDisclose,
    mayAsk: isLienholder
      ? ["Was the release sent?", "What date was it sent?", "What is the reference number?"]
      : ["Can you locate the case?", "What blocks title issuance?", "Which organization owns the next action?"],
    prohibited: ["Credentials", "Bank or payment information", "Fees or commitments", "Legal representations", "Unverified facts"],
    expectedTransition: isLienholder ? "READY_FOR_NEXT_CALL → WAITING_EXTERNAL" : "READY_TO_CONTACT → READY_FOR_NEXT_CALL",
  };
  const fingerprint = createHash("sha256").update(JSON.stringify(previewBase)).digest("hex").slice(0, 16);
  return { ...previewBase, fingerprint };
}

export function idempotencyKey(titleCase: TitleCase, contactId: string) {
  return `${titleCase.id}:resolve-next-blocker:${contactId}:${titleCase.attemptGeneration}`;
}
