import { NextResponse } from "next/server";
import { resetCase } from "@/db/repository";
import { createDemoCase } from "@/fixtures/demo";
import { DEMO_COOKIE } from "@/demo/session";

export async function POST(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  if (process.env.VINRELEASE_MODE !== "live") {
    const titleCase = createDemoCase();
    if (titleCase.id !== id) return NextResponse.json({ error: "Case not found." }, { status: 404 });
    const response = NextResponse.json({ case: titleCase });
    response.cookies.set(DEMO_COOKIE, "start", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 8 });
    return response;
  }
  const titleCase = resetCase(id);
  return titleCase ? NextResponse.json({ case: titleCase }) : NextResponse.json({ error: "Case not found." }, { status: 404 });
}
