/**
 * POST /api/pages
 * Create a new page or save with a specific ID.
 * Body: { id?: string, config: PageConfig }
 */
import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { savePage } from "@/lib/db";
import type { PageConfig } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { id, config }: { id?: string; config: PageConfig } = body;

    if (!config) {
      return NextResponse.json({ error: "config is required" }, { status: 400 });
    }

    // Generate a short unique ID if not provided
    const pageId = id || nanoid(10);
    const saved = savePage(pageId, config);

    return NextResponse.json({ success: true, page: saved });
  } catch (err) {
    console.error("Error saving page:", err);
    return NextResponse.json({ error: "Failed to save page" }, { status: 500 });
  }
}
