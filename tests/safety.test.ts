import { describe, expect, it } from "vitest";
import { buildCallPreview, idempotencyKey, validateDisclosureBudget } from "@/safety/call-policy";
import { createDemoCase } from "@/fixtures/demo";

describe("call governance", () => {
  it("exposes only the approved disclosure budget", () => {
    const titleCase = createDemoCase();
    const preview = buildCallPreview(titleCase, "contact-auction");
    expect(preview.mayDisclose).toEqual(titleCase.contacts[0].allowedDisclosureFields);
    expect(preview.prohibited).toContain("Bank or payment information");
  });

  it("rejects forbidden fields", () => {
    expect(() => validateDisclosureBudget(["stock_number", "security_code"])).toThrow("Forbidden disclosure field");
  });

  it("rejects an unapproved contact", () => {
    const titleCase = createDemoCase();
    titleCase.contacts[0].authorized = false;
    expect(() => buildCallPreview(titleCase, "contact-auction")).toThrow("not provisioned and authorized");
  });

  it("uses a stable business key", () => {
    const titleCase = createDemoCase();
    expect(idempotencyKey(titleCase, "contact-auction")).toBe("case-4821:resolve-next-blocker:contact-auction:1");
  });
});
