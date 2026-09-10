import { describe, expect, it } from "vitest";
import { resolveCallResult } from "@/domain/resolution-engine";
import { AUCTION_RESULT, HUMAN_STOP_RESULT, LIENHOLDER_RESULT, createDemoCase } from "@/fixtures/demo";

describe("resolution engine", () => {
  it("turns a missing lien release into an approved next call", () => {
    const decision = resolveCallResult(createDemoCase(), AUCTION_RESULT);
    expect(decision).toMatchObject({ nextState: "READY_FOR_NEXT_CALL", blocker: "lien_release_missing", owner: "ABC Bank" });
  });

  it("preserves sent-but-not-received as waiting external", () => {
    const decision = resolveCallResult(createDemoCase(), LIENHOLDER_RESULT);
    expect(decision.nextState).toBe("WAITING_EXTERNAL");
    expect(decision.label).toContain("receipt unconfirmed");
    expect(decision.evidence).toContain("LR-4721");
  });

  it("stops on unsupported credential requests", () => {
    const decision = resolveCallResult(createDemoCase(), HUMAN_STOP_RESULT);
    expect(decision.nextState).toBe("NEEDS_HUMAN");
    expect(decision.humanReason).toContain("credential");
  });

  it("does not treat a vague resolved claim as physical receipt", () => {
    const decision = resolveCallResult(createDemoCase(), { ...LIENHOLDER_RESULT, outcome: "resolved_claimed", blocker_type: "unknown" });
    expect(decision.nextState).toBe("NEEDS_HUMAN");
  });

  it("routes no answer to a reversible wait state", () => {
    const decision = resolveCallResult(createDemoCase(), { ...AUCTION_RESULT, party_reached: false, outcome: "unreachable", blocker_type: "unreachable" });
    expect(decision).toMatchObject({ nextState: "WAITING_EXTERNAL", blocker: "unreachable" });
  });
});
