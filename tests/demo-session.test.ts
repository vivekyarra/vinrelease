import { describe, expect, it } from "vitest";
import { authorizeDemoCall, materializeDemoCase } from "@/demo/session";
import { buildCallPreview } from "@/safety/call-policy";

describe("serverless-safe demo session", () => {
  it("reconstructs the two-call evidence chain from a compact state", () => {
    const afterAuction = materializeDemoCase("auction-complete");
    expect(afterAuction.state).toBe("READY_FOR_NEXT_CALL");
    expect(afterAuction.calls).toHaveLength(1);

    const preview = buildCallPreview(afterAuction, "contact-lienholder");
    const result = authorizeDemoCall({
      state: "auction-complete",
      caseId: afterAuction.id,
      contactId: "contact-lienholder",
      previewFingerprint: preview.fingerprint,
    });
    expect(result.state).toBe("lienholder-complete");
    expect(result.titleCase.state).toBe("WAITING_EXTERNAL");
    expect(result.titleCase.calls).toHaveLength(2);
    expect(result.titleCase.calls[1].result?.reference_number).toBe("LR-4721");
  });

  it("materializes a fail-closed human review state", () => {
    const stopped = materializeDemoCase("human-stop");
    expect(stopped.state).toBe("NEEDS_HUMAN");
    expect(stopped.reviewItems[0].reason).toContain("credential");
  });
});
