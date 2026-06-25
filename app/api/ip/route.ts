import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const directIP =
    req.headers.get("x-forwarded-for")?.split(",")[0] ||
    req.headers.get("x-real-ip");

  console.log(`IP address: ${directIP}`);

  return NextResponse.json({ ip: directIP });
}