import { NextResponse } from "next/server";
import { convertToJSONResume } from "@/lib/jsonResume";

export const dynamic = "force-static";

export async function GET() {
  const jsonResume = convertToJSONResume();

  return NextResponse.json(jsonResume, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
