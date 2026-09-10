import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { listCases } from "@/db/repository";
import { DEMO_COOKIE, materializeDemoCase, normalizeDemoState } from "@/demo/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const mode = process.env.VINRELEASE_MODE === "live" ? "live" : "demo";
  const cases = mode === "demo"
    ? [materializeDemoCase(normalizeDemoState((await cookies()).get(DEMO_COOKIE)?.value))]
    : listCases();
  return NextResponse.json({ cases, mode });
}
