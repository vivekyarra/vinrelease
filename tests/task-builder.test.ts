import { describe, expect, it } from "vitest";
import { buildCallTask } from "@/calle/task-builder";
import { createDemoCase } from "@/fixtures/demo";
import { buildCallPreview } from "@/safety/call-policy";

describe("outbound CALL-E task boundary", () => {
  it("discloses automation and includes only approved operational facts", () => {
    const titleCase = createDemoCase();
    const contact = titleCase.contacts[0];
    const task = buildCallTask(titleCase, contact, buildCallPreview(titleCase, contact.id));

    expect(task).toContain("automated assistant");
    expect(task).toContain(`vin_last_6: ${titleCase.vehicle.vinLast6}`);
    expect(task).not.toContain(titleCase.vehicle.vinLast6.padStart(17, "0"));
    expect(task).toContain("Never provide credentials, payment or bank information");
  });

  it("does not invent a claim about how recipient consent was recorded", () => {
    const titleCase = createDemoCase();
    const contact = titleCase.contacts[0];
    const task = buildCallTask(titleCase, contact, buildCallPreview(titleCase, contact.id));

    expect(task).not.toContain("consenting test participant");
    expect(task).toContain("server-approved recipient");
  });
});
