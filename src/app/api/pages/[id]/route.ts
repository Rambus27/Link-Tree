/**
 * GET  /api/pages/[id]  - Fetch a page by ID
 * POST /api/pages/[id]  - Update a page by ID (increments view count is handled separately)
 */
import { NextResponse } from "next/server";
import { getPage, savePage, incrementViewCount } from "@/lib/db";
import type { PageConfig } from "@/types";

type Params = { params: Promise<{ id: string }> };

export async function GET(request: Request, { params }: Params) {
  const { id } = await params;

  // If ?view=1 is in the query string, increment the view counter
  const url = new URL(request.url);
  if (url.searchParams.get("view") === "1") {
    incrementViewCount(id);
  }

  const page = getPage(id);
  if (!page) {
    return NextResponse.json({ error: "Page not found" }, { status: 404 });
  }

  return NextResponse.json({ page });
}

export async function PUT(request: Request, { params }: Params) {
  const { id } = await params;
  try {
    const { config }: { config: PageConfig } = await request.json();
    if (!config) {
      return NextResponse.json({ error: "config is required" }, { status: 400 });
    }
    const saved = savePage(id, config);
    return NextResponse.json({ success: true, page: saved });
  } catch (err) {
    console.error("Error updating page:", err);
    return NextResponse.json({ error: "Failed to update page" }, { status: 500 });
  }
}
