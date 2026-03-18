/**
 * GET /api/check-username?username=<name>[&excludeId=<id>]
 * Returns { available: boolean }
 */
import { NextResponse } from "next/server";
import { isUsernameTaken } from "@/lib/db";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username");
  const excludeId = url.searchParams.get("excludeId") || undefined;

  if (!username || username.trim().length < 3) {
    return NextResponse.json(
      { error: "Username must be at least 3 characters" },
      { status: 400 }
    );
  }

  // Only allow alphanumeric + underscores + hyphens
  if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    return NextResponse.json(
      { error: "Username can only contain letters, numbers, underscores, and hyphens" },
      { status: 400 }
    );
  }

  const taken = isUsernameTaken(username, excludeId);
  return NextResponse.json({ available: !taken });
}
