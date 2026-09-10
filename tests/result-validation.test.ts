import { describe, expect, it } from "vitest";
import { callResultSchema } from "@/domain/model";
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
});
