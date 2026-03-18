import { Suspense } from "react";
import EditorPageContent from "./EditorPageContent";

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-950 flex items-center justify-center">
          <div className="text-white/50 animate-pulse text-lg">Loading editor…</div>
        </div>
      }
    >
      <EditorPageContent />
    </Suspense>
  );
}
