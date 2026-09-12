import type { CallResult, TitleCase } from "@/domain/model";

export const AUCTION_RESULT: CallResult = {
  party_reached: true,
  case_located: true,
  outcome: "blocked_external",
  blocker_type: "lien_release_missing",
  responsible_party: "lienholder",
  responsible_party_name: "ABC Bank",
  reference_number: null,
  promised_action: null,
  promised_date: null,
  title_sent: false,
  tracking_number: null,
  needs_human: false,
  human_reason: null,
  unknown_questions: [],
  notes: "Metro Auto Auction located stock 4821 and confirmed that title issuance is waiting on ABC Bank's lien release.",
};

export const LIENHOLDER_RESULT: CallResult = {
  party_reached: true,
  case_located: true,
  outcome: "waiting_external",
  blocker_type: "release_sent_not_received",
  responsible_party: "auction",
  responsible_party_name: "Metro Auto Auction",
  reference_number: "LR-4721",
  promised_action: "Lien release sent to auction",
  promised_date: "2026-09-08",
  title_sent: false,
  tracking_number: null,
  needs_human: false,
  human_reason: null,
  unknown_questions: [],
  notes: "ABC Bank confirmed the lien release was transmitted to Metro Auto Auction on September 8.",
};

export const HUMAN_STOP_RESULT: CallResult = {
  party_reached: true,
  case_located: true,
  outcome: "needs_human",
  blocker_type: "unknown",
  responsible_party: "dealer",
  responsible_party_name: "Title clerk",
  reference_number: null,
  promised_action: null,
  promised_date: null,
  title_sent: false,
  tracking_number: null,
  needs_human: true,
  human_reason: "Recipient requested an account credential outside the approved disclosure packet.",
  unknown_questions: ["Provide the dealer portal security code"],
  notes: "The agent declined to disclose credentials and ended the automated workflow safely.",
};

export function createDemoCase(): TitleCase {
  const now = new Date().toISOString();
  const auctionPhone = process.env.CALLE_AUCTION_PHONE ?? "+15550101001";
  const lienholderPhone = process.env.CALLE_LIENHOLDER_PHONE ?? "+15550101002";
  const auctionRegion = process.env.CALLE_AUCTION_REGION ?? "US";
  const auctionLocale = process.env.CALLE_AUCTION_LOCALE ?? "en-US";
  const lienholderRegion = process.env.CALLE_LIENHOLDER_REGION ?? "US";
  const lienholderLocale = process.env.CALLE_LIENHOLDER_LOCALE ?? "en-US";
  return {
    id: "case-4821",
    stockNumber: "4821",
    dealership: "Northstar Motor Group",
    vehicle: { year: 2019, make: "BMW", model: "330i", vinLast6: "xx7821" },
    sourceOrganization: "Metro Auto Auction",
    purchaseDate: "2026-08-14",
    expectedTitleDate: "2026-08-18",
    inventoryValue: 18700,
    state: "READY_TO_CONTACT",
    blocker: "unknown",
    blockerOwner: "Metro Auto Auction",
    currentNote: "Title is 23 days overdue. The auction portal shows no actionable status.",
    attemptGeneration: 1,
    contacts: [
      {
        id: "contact-auction",
        organization: "Metro Auto Auction",
        department: "Title Desk",
        phoneE164: auctionPhone,
        phoneDisplay: maskPhone(auctionPhone),
        region: auctionRegion,
        locale: auctionLocale,
        provenance: "Provisioned by Northstar title operations for the consenting demo recipient.",
        authorized: true,
        active: true,
        allowedDisclosureFields: ["stock_number", "vehicle_year", "vehicle_make", "vehicle_model", "vin_last_6", "purchase_date"],
      },
      {
        id: "contact-lienholder",
        organization: "ABC Bank",
        department: "Lien Release Desk",
        phoneE164: lienholderPhone,
        phoneDisplay: maskPhone(lienholderPhone),
        region: lienholderRegion,
        locale: lienholderLocale,
        provenance: "Provisioned by Northstar title operations for the consenting demo recipient.",
        authorized: true,
        active: true,
        allowedDisclosureFields: ["stock_number", "vehicle_year", "vehicle_make", "vehicle_model", "vin_last_6", "purchase_date"],
      },
    ],
    calls: [],
    transitions: [
      {
        id: "transition-created",
        from: "NEW",
        to: "READY_TO_CONTACT",
        blocker: "unknown",
        label: "Case opened for external investigation",
        evidence: "Title deadline passed with no usable digital status.",
        callTaskId: null,
        at: now,
      },
    ],
    reviewItems: [],
    updatedAt: now,
  };
}

function maskPhone(phone: string) {
  return `${phone.slice(0, Math.min(3, phone.length))} ••• ••• ${phone.slice(-4)}`;
}
