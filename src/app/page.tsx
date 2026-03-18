"use client";

/**
 * Homepage - Showcases templates and lets users choose one to start editing.
 */
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { TEMPLATES } from "@/types";
import ThemeToggle from "@/components/ThemeToggle";

export default function HomePage() {
  const router = useRouter();
  const [hoveredTemplate, setHoveredTemplate] = useState<string | null>(null);

  const handleSelectTemplate = (templateId: string) => {
    router.push(`/editor?template=${templateId}`);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-gray-950/80 backdrop-blur-xl border-b border-white/5">
        <span className="text-xl font-bold tracking-tight">
          ✦{" "}
          <span className="bg-gradient-to-r from-violet-400 to-pink-400 bg-clip-text text-transparent">
            LinkTree
          </span>
        </span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            onClick={() => router.push("/editor")}
            className="px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-semibold rounded-xl transition-all hover:scale-105"
          >
            Start Free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-300 text-sm mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            No sign-up required · Free forever
          </div>
          <h1 className="text-5xl md:text-7xl font-bold leading-tight tracking-tight mb-6">
            Your world,
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
              one link
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/60 max-w-2xl mx-auto mb-10 leading-relaxed">
            Create a stunning, personalized link-in-bio page in minutes. Add your
            links, music, profile — then share one URL everywhere.
          </p>
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => router.push("/editor")}
              className="px-8 py-3.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-2xl transition-all hover:scale-105 shadow-xl shadow-violet-900/40"
            >
              Create your page →
            </button>
            <button
              onClick={() =>
                document
                  .getElementById("templates")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
              className="px-8 py-3.5 bg-white/10 hover:bg-white/15 text-white font-semibold rounded-2xl transition-all border border-white/10"
            >
              Browse templates
            </button>
          </div>
        </div>
      </section>

      {/* Feature pills */}
      <section className="py-10 px-4">
        <div className="max-w-4xl mx-auto flex flex-wrap justify-center gap-3">
          {[
            "🎨 Custom backgrounds",
            "🔗 Unlimited links",
            "🎵 Music player",
            "🌙 Dark & light mode",
            "📱 Mobile-first",
            "✨ Live preview",
            "🔗 Permanent public URL",
            "📊 View analytics",
          ].map((f) => (
            <span
              key={f}
              className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/70 text-sm"
            >
              {f}
            </span>
          ))}
        </div>
      </section>

      {/* Templates section */}
      <section id="templates" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Start from a template
            </h2>
            <p className="text-white/60 max-w-xl mx-auto">
              Pick a design you love. You can customize every detail afterwards.
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            {TEMPLATES.map((template) => (
              <div
                key={template.id}
                className="group relative cursor-pointer"
                onMouseEnter={() => setHoveredTemplate(template.id)}
                onMouseLeave={() => setHoveredTemplate(null)}
                onClick={() => handleSelectTemplate(template.id)}
              >
                <div
                  className={`relative overflow-hidden rounded-2xl border transition-all duration-300 ${
                    hoveredTemplate === template.id
                      ? "border-violet-500/60 shadow-xl shadow-violet-900/30 scale-[1.02]"
                      : "border-white/10 hover:border-white/20"
                  }`}
                >
                  <div className={`h-44 ${template.preview} relative`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-4">
                      <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm" />
                      <div className="w-24 h-2.5 rounded-full bg-white/30" />
                      <div className="w-32 h-8 rounded-full bg-white/25 mt-1" />
                      <div className="w-32 h-8 rounded-full bg-white/20" />
                    </div>
                    <div
                      className={`absolute inset-0 bg-violet-600/30 backdrop-blur-sm flex items-center justify-center transition-all duration-200 ${
                        hoveredTemplate === template.id ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <span className="bg-white text-violet-700 font-bold px-4 py-2 rounded-full text-sm shadow-lg">
                        Use this template
                      </span>
                    </div>
                  </div>
                  <div className="p-4 bg-gray-900/80 backdrop-blur">
                    <p className="font-semibold text-white text-sm">{template.name}</p>
                    <p className="text-white/50 text-xs mt-0.5">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-4 border-t border-white/5">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Choose a template",
                desc: "Pick from beautiful pre-made designs or start blank.",
                icon: "🎨",
              },
              {
                title: "Customize everything",
                desc: "Add links, photo, colors, fonts, and a music player.",
                icon: "✏️",
              },
              {
                title: "Share your link",
                desc: "Save to get a permanent public URL. Share it anywhere, forever.",
                icon: "🚀",
              },
            ].map((item) => (
              <div key={item.title} className="text-center space-y-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-600 to-pink-600 flex items-center justify-center text-3xl mx-auto shadow-xl shadow-violet-900/30">
                  {item.icon}
                </div>
                <h3 className="font-bold text-xl">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="p-8 rounded-3xl bg-gradient-to-br from-violet-900/40 to-pink-900/20 border border-violet-500/20">
            <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-white/60 mb-8">
              Create your link-in-bio page in 60 seconds. No account needed.
            </p>
            <button
              onClick={() => router.push("/editor")}
              className="px-10 py-4 bg-gradient-to-r from-violet-600 to-pink-600 hover:from-violet-500 hover:to-pink-500 text-white font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-violet-900/40 text-lg"
            >
              Create your free page →
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-white/5 text-center text-white/30 text-sm">
        <p>✦ LinkTree — Made with ❤️</p>
      </footer>
    </div>
  );
}
