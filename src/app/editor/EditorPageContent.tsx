"use client";

/**
 * EditorPageContent - Inner client component that reads URL search params.
 * Must be wrapped in Suspense (done by the parent page.tsx).
 */
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { TEMPLATES, DEFAULT_PAGE_CONFIG } from "@/types";
import type { PageConfig, SavedPage } from "@/types";
import Editor from "@/components/Editor";

export default function EditorPageContent() {
  const searchParams = useSearchParams();
  const templateId = searchParams.get("template");
  const pageId = searchParams.get("id");

  const [initialConfig, setInitialConfig] = useState<Partial<PageConfig> | null>(null);
  const [existingId, setExistingId] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        if (pageId) {
          // Load existing page for re-editing
          const res = await fetch(`/api/pages/${pageId}`);
          if (!res.ok) throw new Error("Page not found");
          const data: { page: SavedPage } = await res.json();
          setInitialConfig(data.page);
          setExistingId(data.page.id);
        } else if (templateId) {
          // Apply selected template
          const template = TEMPLATES.find((t) => t.id === templateId);
          if (template) {
            setInitialConfig({
              ...DEFAULT_PAGE_CONFIG,
              ...template.config,
              template: templateId,
            });
          } else {
            setInitialConfig(DEFAULT_PAGE_CONFIG);
          }
        } else {
          // Blank canvas
          setInitialConfig(DEFAULT_PAGE_CONFIG);
        }
      } catch (e) {
        setError(e instanceof Error ? e.message : "Something went wrong");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [pageId, templateId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-white/50 animate-pulse text-lg">Loading editor…</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center text-white">
          <p className="text-4xl mb-4">⚠️</p>
          <p className="text-lg font-semibold mb-2">Could not load page</p>
          <p className="text-white/50">{error}</p>
          <a href="/editor" className="mt-4 inline-block text-violet-400 hover:underline">
            Start fresh →
          </a>
        </div>
      </div>
    );
  }

  return <Editor initialConfig={initialConfig ?? {}} pageId={existingId} />;
}
