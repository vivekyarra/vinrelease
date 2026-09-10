import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { previewCall } from "@/services/case-service";
import { buildCallPreview } from "@/safety/call-policy";
import { DEMO_COOKIE, materializeDemoCase, normalizeDemoState } from "@/demo/session";

const bodySchema = z.object({ contactId: z.string().min(1) }).strict();

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = bodySchema.parse(await request.json());
    if (process.env.VINRELEASE_MODE !== "live") {
      const titleCase = materializeDemoCase(normalizeDemoState((await cookies()).get(DEMO_COOKIE)?.value));
      if (titleCase.id !== id) throw new Error("Case not found.");
      return NextResponse.json({ preview: buildCallPreview(titleCase, body.contactId) });
    }
    return NextResponse.json({ preview: previewCall(id, body.contactId) });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to preview call." }, { status: 400 });
  }
}
