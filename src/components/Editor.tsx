"use client";

/**
 * Editor - Full page editor with live preview.
 * All customization panels are on the left; a live preview is on the right.
 */
import React, { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { nanoid } from "nanoid";
import type { PageConfig, LinkItem, FontFamily } from "@/types";
import { DEFAULT_PAGE_CONFIG } from "@/types";
import PagePreview from "./PagePreview";

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────
const FONTS: FontFamily[] = [
  "Inter",
  "Poppins",
  "Playfair Display",
  "Roboto",
  "Montserrat",
  "Space Grotesk",
];

const BUTTON_STYLES: Array<{ value: PageConfig["buttonStyle"]; label: string }> = [
  { value: "pill", label: "Pill" },
  { value: "rounded", label: "Rounded" },
  { value: "square", label: "Square" },
  { value: "outline", label: "Outline" },
  { value: "glass", label: "Glass" },
];

const PANEL_TABS = ["Profile", "Background", "Style", "Links", "Music"] as const;
type PanelTab = (typeof PANEL_TABS)[number];

// ──────────────────────────────────────────────
// Editor main component
// ──────────────────────────────────────────────
interface EditorProps {
  initialConfig?: Partial<PageConfig>;
  pageId?: string;
}

export default function Editor({ initialConfig, pageId }: EditorProps) {
  const router = useRouter();
  const [config, setConfig] = useState<PageConfig>({
    ...DEFAULT_PAGE_CONFIG,
    ...initialConfig,
  });
  const [activeTab, setActiveTab] = useState<PanelTab>("Profile");
  const [saving, setSaving] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(pageId || null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<"idle" | "checking" | "available" | "taken">("idle");
  const usernameCheckTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Update a single config field
  const update = useCallback(<K extends keyof PageConfig>(key: K, value: PageConfig[K]) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  }, []);

  // Username availability check (debounced)
  const checkUsername = useCallback((username: string) => {
    if (usernameCheckTimer.current) clearTimeout(usernameCheckTimer.current);
    if (!username || username.length < 3) {
      setUsernameStatus("idle");
      return;
    }
    setUsernameStatus("checking");
    usernameCheckTimer.current = setTimeout(async () => {
      try {
        const res = await fetch(
          `/api/check-username?username=${encodeURIComponent(username)}${savedId ? `&excludeId=${savedId}` : ""}`
        );
        const data = await res.json();
        setUsernameStatus(data.available ? "available" : "taken");
      } catch {
        setUsernameStatus("idle");
      }
    }, 500);
  }, [savedId]);

  // Save page
  const handleSave = async () => {
    setSaving(true);
    try {
      const url = savedId ? `/api/pages/${savedId}` : "/api/pages";
      const method = savedId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ config }),
      });
      const data = await res.json();
      if (data.page?.id) {
        setSavedId(data.page.id);
        router.push(`/editor?id=${data.page.id}`);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setSaving(false);
    }
  };

  // Copy public link to clipboard
  const handleCopy = async () => {
    if (!savedId) return;
    const link = `${window.location.origin}/p/${savedId}`;
    await navigator.clipboard.writeText(link);
    setCopySuccess(true);
    setTimeout(() => setCopySuccess(false), 2000);
  };

  // Open public page in new tab
  const handleViewPublic = () => {
    if (savedId) window.open(`/p/${savedId}`, "_blank");
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gray-950">
      {/* ── Left panel ── */}
      <aside className="w-80 shrink-0 flex flex-col border-r border-white/10 bg-gray-900/80 backdrop-blur overflow-y-auto">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between">
          <span className="font-bold text-white text-lg">✦ LinkTree</span>
          <button
            onClick={() => router.push("/")}
            className="text-xs text-white/50 hover:text-white/80 transition-colors"
          >
            ← Home
          </button>
        </div>

        {/* Tab navigation */}
        <div className="flex overflow-x-auto gap-1 p-2 border-b border-white/10 shrink-0">
          {PANEL_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`shrink-0 px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                activeTab === tab
                  ? "bg-violet-600 text-white"
                  : "text-white/60 hover:text-white hover:bg-white/10"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Panel content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {activeTab === "Profile" && (
            <ProfilePanel config={config} update={update} usernameStatus={usernameStatus} checkUsername={checkUsername} />
          )}
          {activeTab === "Background" && (
            <BackgroundPanel config={config} update={update} />
          )}
          {activeTab === "Style" && (
            <StylePanel config={config} update={update} />
          )}
          {activeTab === "Links" && (
            <LinksPanel config={config} update={update} />
          )}
          {activeTab === "Music" && (
            <MusicPanel config={config} update={update} />
          )}
        </div>

        {/* Save / Export section */}
        <div className="p-4 border-t border-white/10 space-y-2 shrink-0">
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full py-2.5 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white font-semibold rounded-xl transition-all"
          >
            {saving ? "Saving…" : savedId ? "Save Changes" : "Save & Publish ✦"}
          </button>

          {savedId && (
            <div className="flex gap-2">
              <button
                onClick={handleCopy}
                className="flex-1 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                {copySuccess ? "✓ Copied!" : "Copy Link"}
              </button>
              <button
                onClick={handleViewPublic}
                className="flex-1 py-2 text-sm bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
              >
                View Page ↗
              </button>
            </div>
          )}

          {savedId && (
            <p className="text-xs text-white/40 text-center">
              Public link: /p/{savedId}
            </p>
          )}
        </div>
      </aside>

      {/* ── Right: Live Preview ── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <div className="shrink-0 p-3 border-b border-white/10 bg-gray-900/60 flex items-center justify-between">
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">
            Live Preview
          </span>
          <span className="text-xs text-white/30">
            Changes appear instantly
          </span>
        </div>

        {/* Simulated phone preview */}
        <div className="flex-1 flex items-center justify-center p-8 bg-[radial-gradient(ellipse_at_center,#1e1e3f_0%,#0f0f1a_100%)] overflow-auto">
          <div className="relative w-[375px] h-[720px] rounded-[40px] overflow-hidden shadow-2xl border-4 border-white/10 shrink-0">
            <div className="w-full h-full overflow-y-auto">
              <PagePreview config={config} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// Panel sub-components
// ──────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold text-white/50 uppercase tracking-wider mb-1.5">
      {children}
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <SectionLabel>{label}</SectionLabel>
      {children}
    </div>
  );
}

function TextInput({
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500"
    />
  );
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <textarea
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      rows={3}
      className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-violet-500 resize-none"
    />
  );
}

function ColorPicker({
  value,
  onChange,
  label,
}: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-9 h-9 rounded-lg cursor-pointer border border-white/10 bg-transparent"
        aria-label={label}
      />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 px-3 py-1.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
      />
    </div>
  );
}

// Profile panel
interface PanelProps {
  config: PageConfig;
  update: <K extends keyof PageConfig>(key: K, value: PageConfig[K]) => void;
}

interface ProfilePanelProps extends PanelProps {
  usernameStatus: "idle" | "checking" | "available" | "taken";
  checkUsername: (u: string) => void;
}

function ProfilePanel({ config, update, usernameStatus, checkUsername }: ProfilePanelProps) {
  const statusColor =
    usernameStatus === "available"
      ? "text-green-400"
      : usernameStatus === "taken"
      ? "text-red-400"
      : "text-white/40";
  const statusText =
    usernameStatus === "checking"
      ? "Checking…"
      : usernameStatus === "available"
      ? "✓ Available"
      : usernameStatus === "taken"
      ? "✗ Taken"
      : "";

  return (
    <div className="space-y-4">
      <Field label="Profile Picture URL">
        <TextInput
          value={config.profilePicture}
          onChange={(v) => update("profilePicture", v)}
          placeholder="https://example.com/photo.jpg"
        />
      </Field>
      <Field label="Display Name">
        <TextInput
          value={config.title}
          onChange={(v) => update("title", v)}
          placeholder="Your Name"
        />
      </Field>
      <Field label="Bio">
        <Textarea
          value={config.bio}
          onChange={(v) => update("bio", v)}
          placeholder="Tell the world about yourself…"
        />
      </Field>
      <Field label="Username (for custom URL)">
        <div className="relative">
          <TextInput
            value={config.username || ""}
            onChange={(v) => {
              update("username", v);
              checkUsername(v);
            }}
            placeholder="yourname"
          />
        </div>
        {statusText && (
          <p className={`text-xs mt-1 ${statusColor}`}>{statusText}</p>
        )}
      </Field>
    </div>
  );
}

function BackgroundPanel({ config, update }: PanelProps) {
  return (
    <div className="space-y-4">
      <Field label="Background Type">
        <div className="grid grid-cols-3 gap-2">
          {(["color", "gradient", "image"] as const).map((t) => (
            <button
              key={t}
              onClick={() => update("backgroundType", t)}
              className={`py-1.5 text-xs rounded-lg capitalize transition-all ${
                config.backgroundType === t
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      {config.backgroundType === "color" && (
        <Field label="Background Color">
          <ColorPicker
            value={config.backgroundColor}
            onChange={(v) => update("backgroundColor", v)}
            label="Background Color"
          />
        </Field>
      )}

      {config.backgroundType === "gradient" && (
        <Field label="Gradient CSS">
          <Textarea
            value={config.backgroundGradient}
            onChange={(v) => update("backgroundGradient", v)}
            placeholder="linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)"
          />
          <p className="text-xs text-white/30 mt-1">
            Any valid CSS gradient value
          </p>
        </Field>
      )}

      {config.backgroundType === "image" && (
        <Field label="Image URL">
          <TextInput
            value={config.backgroundImage}
            onChange={(v) => update("backgroundImage", v)}
            placeholder="https://example.com/bg.jpg"
          />
        </Field>
      )}
    </div>
  );
}

function StylePanel({ config, update }: PanelProps) {
  return (
    <div className="space-y-4">
      <Field label="Font Family">
        <select
          value={config.fontFamily}
          onChange={(e) => update("fontFamily", e.target.value as FontFamily)}
          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-violet-500"
        >
          {FONTS.map((f) => (
            <option key={f} value={f} className="bg-gray-900">
              {f}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Button Style">
        <div className="grid grid-cols-3 gap-2">
          {BUTTON_STYLES.map((s) => (
            <button
              key={s.value}
              onClick={() => update("buttonStyle", s.value)}
              className={`py-1.5 text-xs rounded-lg transition-all ${
                config.buttonStyle === s.value
                  ? "bg-violet-600 text-white"
                  : "bg-white/5 text-white/60 hover:bg-white/10"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </Field>

      <Field label="Button Color">
        <ColorPicker
          value={config.buttonColor}
          onChange={(v) => update("buttonColor", v)}
          label="Button Color"
        />
      </Field>

      <Field label="Button Text Color">
        <ColorPicker
          value={config.buttonTextColor}
          onChange={(v) => update("buttonTextColor", v)}
          label="Button Text Color"
        />
      </Field>

      <Field label="Text Color">
        <ColorPicker
          value={config.textColor}
          onChange={(v) => update("textColor", v)}
          label="Text Color"
        />
      </Field>

      <Field label="Accent Color">
        <ColorPicker
          value={config.accentColor}
          onChange={(v) => update("accentColor", v)}
          label="Accent Color"
        />
      </Field>
    </div>
  );
}

function LinksPanel({ config, update }: PanelProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const addLink = () => {
    const newLink: LinkItem = { id: nanoid(), title: "New Link", url: "" };
    update("links", [...config.links, newLink]);
  };

  const updateLink = (id: string, field: keyof LinkItem, value: string) => {
    update(
      "links",
      config.links.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    );
  };

  const deleteLink = (id: string) => {
    update("links", config.links.filter((l) => l.id !== id));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = config.links.findIndex((l) => l.id === active.id);
      const newIndex = config.links.findIndex((l) => l.id === over.id);
      update("links", arrayMove(config.links, oldIndex, newIndex));
    }
  };

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={config.links.map((l) => l.id)}
          strategy={verticalListSortingStrategy}
        >
          {config.links.map((link) => (
            <SortableLinkRow
              key={link.id}
              link={link}
              onChange={(field, val) => updateLink(link.id, field, val)}
              onDelete={() => deleteLink(link.id)}
            />
          ))}
        </SortableContext>
      </DndContext>

      <button
        onClick={addLink}
        className="w-full py-2 border border-dashed border-white/20 hover:border-violet-500 rounded-xl text-white/50 hover:text-white text-sm transition-all"
      >
        + Add Link
      </button>
    </div>
  );
}

interface SortableLinkRowProps {
  link: LinkItem;
  onChange: (field: keyof LinkItem, value: string) => void;
  onDelete: () => void;
}

function SortableLinkRow({ link, onChange, onDelete }: SortableLinkRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: link.id });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-2"
    >
      <div className="flex items-center gap-2">
        {/* Drag handle */}
        <button
          className="cursor-grab text-white/30 hover:text-white/60 touch-none"
          {...attributes}
          {...listeners}
          aria-label="Drag to reorder"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path d="M7 2a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM7 8a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4zM7 14a2 2 0 110 4 2 2 0 010-4zm6 0a2 2 0 110 4 2 2 0 010-4z" />
          </svg>
        </button>

        <input
          type="text"
          value={link.title}
          onChange={(e) => onChange("title", e.target.value)}
          placeholder="Link title"
          className="flex-1 px-2 py-1 bg-transparent text-white text-sm focus:outline-none border-b border-white/10 focus:border-violet-500"
        />

        <button
          onClick={onDelete}
          className="text-white/30 hover:text-red-400 transition-colors"
          aria-label="Delete link"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <input
        type="url"
        value={link.url}
        onChange={(e) => onChange("url", e.target.value)}
        placeholder="https://example.com"
        className="w-full px-2 py-1 bg-transparent text-white/70 text-xs focus:outline-none border-b border-white/5 focus:border-violet-500"
      />
    </div>
  );
}

function MusicPanel({ config, update }: PanelProps) {
  const music = config.music || { url: "", autoplay: false };

  const updateMusic = (field: string, value: unknown) => {
    update("music", { ...music, [field]: value });
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-white/40">
        Add a song to your page. Music will play automatically if the browser allows it.
      </p>

      <Field label="Audio URL">
        <TextInput
          value={music.url}
          onChange={(v) => updateMusic("url", v)}
          placeholder="https://example.com/song.mp3"
        />
        <p className="text-xs text-white/30 mt-1">MP3, WAV, OGG, or streaming URL</p>
      </Field>

      <Field label="Song Title (optional)">
        <TextInput
          value={music.title || ""}
          onChange={(v) => updateMusic("title", v)}
          placeholder="Track Name – Artist"
        />
      </Field>

      <div className="flex items-center justify-between">
        <span className="text-sm text-white/70">Enable Autoplay</span>
        <button
          onClick={() => updateMusic("autoplay", !music.autoplay)}
          className={`w-11 h-6 rounded-full transition-all ${
            music.autoplay ? "bg-violet-600" : "bg-white/20"
          }`}
          role="switch"
          aria-checked={music.autoplay}
        >
          <div
            className={`w-4 h-4 bg-white rounded-full mx-1 transition-transform ${
              music.autoplay ? "translate-x-5" : "translate-x-0"
            }`}
          />
        </button>
      </div>

      {music.autoplay && (
        <p className="text-xs text-amber-400/80 bg-amber-400/10 p-2 rounded-lg">
          ⚠️ Browsers may block autoplay until the user interacts with the page. A play button will always be shown.
        </p>
      )}
    </div>
  );
}
