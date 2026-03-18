/**
 * /p/[id] - Public shareable link-in-bio page.
 * Server component that:
 * 1. Fetches the page config from the database
 * 2. Generates SEO metadata
 * 3. Increments view count on load
 */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, incrementViewCount } from "@/lib/db";
import PublicPageClient from "./PublicPageClient";

type Props = { params: Promise<{ id: string }> };

// Generate SEO metadata for each public page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const page = getPage(id);

  if (!page) {
    return { title: "Page Not Found" };
  }

  return {
    title: page.title ? `${page.title} | LinkTree` : "LinkTree Page",
    description: page.bio || "Check out my links!",
    openGraph: {
      title: page.title || "LinkTree Page",
      description: page.bio || "Check out my links!",
      images: page.profilePicture ? [{ url: page.profilePicture }] : [],
      type: "profile",
    },
    twitter: {
      card: "summary",
      title: page.title || "LinkTree Page",
      description: page.bio || "Check out my links!",
      images: page.profilePicture ? [page.profilePicture] : [],
    },
  };
}

export default async function PublicPage({ params }: Props) {
  const { id } = await params;
  const page = getPage(id);

  if (!page) {
    notFound();
  }

  // Increment view count (fire-and-forget on the server)
  incrementViewCount(id);

  return <PublicPageClient page={page} />;
}
