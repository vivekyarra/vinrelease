import { NextResponse } from "next/server";
import { getCase } from "@/db/repository";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const titleCase = getCase(id);
  return titleCase ? NextResponse.json({ case: titleCase }) : NextResponse.json({ error: "Case not found." }, { status: 404 });
}
