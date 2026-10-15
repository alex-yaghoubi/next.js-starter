import { NextResponse } from "next/server";

// Intentional sample endpoint: configure your own backend before using it.
export async function GET() {
  return NextResponse.json(
    { error: "The clients example endpoint is not configured." },
    { status: 501 }
  );
}
