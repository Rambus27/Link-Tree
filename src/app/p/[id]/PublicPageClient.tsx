"use client";

/**
 * Client component for the public page.
 * Renders the PagePreview and shows an edit button + view count.
 */
import { useState } from "react";
import type { SavedPage } from "@/types";
import PagePreview from "@/components/PagePreview";

interface Props {
  page: SavedPage;
}

export default function PublicPageClient({ page }: Props) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative min-h-screen">
      <PagePreview config={page} isPublic />

      {/* Floating action bar at the bottom */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl">
        {/* View count */}
        <span className="text-white/50 text-xs flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z" />
          </svg>
          {page.viewCount.toLocaleString()} view{page.viewCount !== 1 ? "s" : ""}
        </span>

        <div className="w-px h-4 bg-white/20" />

        {/* Copy link */}
        <button
          onClick={handleCopy}
          className="text-white/70 hover:text-white text-xs transition-colors flex items-center gap-1"
        >
          {copied ? (
            <span className="text-green-400">✓ Copied!</span>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z" />
              </svg>
              Copy link
            </>
          )}
        </button>

        <div className="w-px h-4 bg-white/20" />

        {/* Create your own */}
        <a
          href="/"
          className="text-violet-400 hover:text-violet-300 text-xs font-medium transition-colors"
        >
          ✦ Make your own
        </a>
      </div>
    </div>
  );
}
