import { describe, expect, it } from "vitest";
import { callResultSchema, normalizeCalleResult } from "@/domain/model";
import { AUCTION_RESULT } from "@/fixtures/demo";

describe("CALL-E result validation", () => {
  it("accepts the declared recipient result", () => {
    expect(callResultSchema.parse(AUCTION_RESULT)).toEqual(AUCTION_RESULT);
  });

  it("rejects undeclared fields", () => {
    expect(() => callResultSchema.parse({ ...AUCTION_RESULT, guessed_owner_email: "unknown@example.com" })).toThrow();
  });

  it("rejects impossible enums", () => {
    expect(() => callResultSchema.parse({ ...AUCTION_RESULT, outcome: "probably_done" })).toThrow();
  });

  it("rejects malformed dates", () => {
    expect(() => callResultSchema.parse({ ...AUCTION_RESULT, promised_date: "next Tuesday" })).toThrow();
  });

  it("normalizes CALL-E empty-string sentinels to domain nulls", () => {
    const wireResult = Object.fromEntries(
      Object.entries(AUCTION_RESULT).map(([key, value]) => [key, value === null ? "" : value]),
    );
    expect(normalizeCalleResult(wireResult)).toEqual(AUCTION_RESULT);
  });

  it("rejects malformed CALL-E wire dates before state transitions", () => {
    const wireResult = {
      ...AUCTION_RESULT,
      promised_date: "next Tuesday",
      tracking_number: "",
      human_reason: "",
    };
    expect(() => normalizeCalleResult(wireResult)).toThrow();
  });
});
