import { NextResponse } from "next/server";
import { z } from "zod";
import { claimWebhook, findTaskByProviderId } from "@/db/repository";
import { getProviderCall } from "@/calle/provider";
import { ingestCanonicalResult } from "@/services/case-service";

const webhookSchema = z.object({
  id: z.string().min(1),
  data: z.object({ id: z.string().min(1) }).passthrough(),
}).passthrough();

export async function POST(request: Request) {
  try {
    const event = webhookSchema.parse(await request.json());
    const headerId = request.headers.get("call-e-event-id");
    if (headerId && headerId !== event.id) return NextResponse.json({ error: "Webhook event ID mismatch." }, { status: 400 });
    if (!claimWebhook(event.id)) return NextResponse.json({ received: true, duplicate: true });
    const match = findTaskByProviderId(event.data.id);
    if (!match) return NextResponse.json({ received: true, matched: false });
    const canonical = await getProviderCall(event.data.id);
    ingestCanonicalResult(match.titleCase.id, match.task.id, canonical);
    return NextResponse.json({ received: true, matched: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Invalid webhook." }, { status: 400 });
  }
}
