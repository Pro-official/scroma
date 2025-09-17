import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      status: "healthy",
      application: "Scroma - Screenshot Mockup Tool",
      timestamp: new Date().toISOString(),
    },
    { status: 200 }
  );
}