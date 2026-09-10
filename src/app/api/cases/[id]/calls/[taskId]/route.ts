import { NextResponse } from "next/server";
import { refreshCall } from "@/services/case-service";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string; taskId: string }> }) {
  try {
    const { id, taskId } = await context.params;
    return NextResponse.json(await refreshCall(id, taskId));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to refresh call." }, { status: 400 });
  }
}
