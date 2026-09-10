import { beforeEach, describe, expect, it } from "vitest";
import { getCase, resetStoreForTests } from "@/db/repository";
import { authorizeCall, previewCall } from "@/services/case-service";

describe("demo workflow", () => {
  beforeEach(() => {
    process.env.VINRELEASE_MODE = "demo";
    resetStoreForTests();
  });

  it("advances the two-party title exception without claiming physical receipt", async () => {
    const auctionPreview = previewCall("case-4821", "contact-auction");
    const first = await authorizeCall({
      caseId: "case-4821",
      contactId: "contact-auction",
      confirmed: true,
      previewFingerprint: auctionPreview.fingerprint,
    });
    expect(first.titleCase.state).toBe("READY_FOR_NEXT_CALL");
    expect(first.titleCase.calls[0].providerCallId).toMatch(/^demo-/);

    const lienholderPreview = previewCall("case-4821", "contact-lienholder");
    const second = await authorizeCall({
      caseId: "case-4821",
      contactId: "contact-lienholder",
      confirmed: true,
      previewFingerprint: lienholderPreview.fingerprint,
    });
    expect(second.titleCase).toMatchObject({
      state: "WAITING_EXTERNAL",
      blocker: "release_sent_not_received",
      blockerOwner: "Metro Auto Auction",
    });
    expect(second.task.result?.reference_number).toBe("LR-4721");
    expect(second.titleCase.currentNote).toContain("receipt unconfirmed");
  });

  it("deduplicates a repeated authorization request", async () => {
    const preview = previewCall("case-4821", "contact-auction");
    const input = { caseId: "case-4821", contactId: "contact-auction", confirmed: true as const, previewFingerprint: preview.fingerprint };
    const first = await authorizeCall(input);
    const retry = await authorizeCall(input);
    expect(retry.duplicate).toBe(true);
    expect(retry.task.id).toBe(first.task.id);
    expect(getCase("case-4821")?.calls).toHaveLength(1);
  });

  it("turns an unsupported request into a human review item", async () => {
    const preview = previewCall("case-4821", "contact-auction");
    const result = await authorizeCall({
      caseId: "case-4821",
      contactId: "contact-auction",
      confirmed: true,
      previewFingerprint: preview.fingerprint,
      scenario: "human-stop",
    });
    expect(result.titleCase.state).toBe("NEEDS_HUMAN");
    expect(result.titleCase.reviewItems[0].reason).toContain("credential");
  });

  it("refuses authorization with a stale preview", async () => {
    await expect(authorizeCall({
      caseId: "case-4821",
      contactId: "contact-auction",
      confirmed: true,
      previewFingerprint: "0000000000000000",
    })).rejects.toThrow("preview changed");
  });
});
