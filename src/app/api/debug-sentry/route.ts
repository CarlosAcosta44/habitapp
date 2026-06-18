import { NextResponse } from "next/server";

export async function GET() {
  throw new Error("Sentry Frontend Integration Test Error");
  return NextResponse.json({ message: "Should not be reached" });
}
