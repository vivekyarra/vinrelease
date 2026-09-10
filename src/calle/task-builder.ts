import type { CallPreview, } from "@/safety/call-policy";
import type { Contact, TitleCase } from "@/domain/model";

export function buildCallTask(titleCase: TitleCase, contact: Contact, preview: CallPreview) {
  const permittedFacts = preview.mayDisclose.map((field) => `${field}: ${valueFor(titleCase, field)}`).join("\n");
  return [
    "You are VINRelease, an automated assistant calling for a dealership title operations team.",
    "State clearly that you are an automated assistant. The recipient is a consenting test participant.",
    `Goal: ${preview.purpose}`,
    `Organization and department: ${contact.organization}, ${contact.department}.`,
    "You may disclose only these approved facts:",
    permittedFacts,
    `Ask only: ${preview.mayAsk.join(" ")}`,
    "Never provide credentials, payment or bank information, accept fees, make legal representations, or invent facts.",
    "If the recipient requests anything outside the approved facts, politely decline and set needs_human=true.",
    "Do not claim the dealership physically received a title unless that exact fact is confirmed by a trusted dealership system or human.",
  ].join("\n");
}

function valueFor(titleCase: TitleCase, field: string) {
  const values: Record<string, string | number> = {
    stock_number: titleCase.stockNumber,
    vehicle_year: titleCase.vehicle.year,
    vehicle_make: titleCase.vehicle.make,
    vehicle_model: titleCase.vehicle.model,
    vin_last_6: titleCase.vehicle.vinLast6,
    purchase_date: titleCase.purchaseDate,
  };
  if (!(field in values)) throw new Error(`Disclosure field has no safe serializer: ${field}`);
  return String(values[field]);
}
