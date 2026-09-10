import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { z } from "zod";
import { authorizeCall } from "@/services/case-service";
import { authorizeDemoCall, DEMO_COOKIE, normalizeDemoState } from "@/demo/session";

const bodySchema = z.object({
  contactId: z.string().min(1),
  confirmed: z.literal(true),
  previewFingerprint: z.string().length(16),
  scenario: z.enum(["standard", "human-stop"]).optional(),
}).strict();

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = bodySchema.parse(await request.json());
    if (process.env.VINRELEASE_MODE !== "live") {
      const result = authorizeDemoCall({
        state: normalizeDemoState((await cookies()).get(DEMO_COOKIE)?.value),
        caseId: id,
        ...body,
      });
      const response = NextResponse.json({ titleCase: result.titleCase, task: result.task, duplicate: result.duplicate });
      response.cookies.set(DEMO_COOKIE, result.state, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
      return response;
    }
    return NextResponse.json(await authorizeCall({ caseId: id, ...body }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to authorize call." }, { status: 400 });
  }
}
