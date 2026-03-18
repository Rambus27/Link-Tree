"use client";

/**
 * PagePreview - Renders the full link-in-bio page based on a PageConfig.
 * Used both in the editor (live preview) and on the public /p/[id] page.
 */
import React, { useEffect, useRef, useState } from "react";
import type { PageConfig, LinkItem } from "@/types";

interface Props {
  config: PageConfig;
  /** If true, this is the live public view (enables view tracking, music autoplay) */
  isPublic?: boolean;
  /** Scale factor for the preview pane (0.5 = half size) */
  scale?: number;
}

// Map font family names to Tailwind/inline style values
const FONT_FAMILIES: Record<string, string> = {
  Inter: "'Inter', sans-serif",
  Poppins: "'Poppins', sans-serif",
  "Playfair Display": "'Playfair Display', serif",
  Roboto: "'Roboto', sans-serif",
  Montserrat: "'Montserrat', sans-serif",
  "Space Grotesk": "'Space Grotesk', sans-serif",
};

// Build background style from config
function getBackgroundStyle(config: PageConfig): React.CSSProperties {
  if (config.backgroundType === "gradient" && config.backgroundGradient) {
    return { background: config.backgroundGradient };
  }
  if (config.backgroundType === "image" && config.backgroundImage) {
    return {
      backgroundImage: `url(${config.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  return { backgroundColor: config.backgroundColor || "#1a1a2e" };
}

// Get button class based on button style
function getButtonClasses(style: PageConfig["buttonStyle"]): string {
  const base =
    "w-full py-3.5 px-6 font-medium transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-transparent";
  switch (style) {
    case "pill":
      return `${base} rounded-full`;
    case "rounded":
      return `${base} rounded-xl`;
    case "square":
      return `${base} rounded-none`;
    case "outline":
      return `${base} rounded-full border-2 bg-transparent`;
    case "glass":
      return `${base} rounded-xl backdrop-blur-sm border border-white/20`;
    default:
      return `${base} rounded-full`;
  }
}

export default function PagePreview({ config, isPublic = false, scale }: Props) {
  const bgStyle = getBackgroundStyle(config);
  const fontFamily = FONT_FAMILIES[config.fontFamily] || FONT_FAMILIES["Inter"];

  const containerStyle: React.CSSProperties = {
    ...bgStyle,
    fontFamily,
    color: config.textColor || "#ffffff",
    minHeight: "100vh",
    width: "100%",
  };

  if (scale) {
    containerStyle.transform = `scale(${scale})`;
    containerStyle.transformOrigin = "top center";
    containerStyle.height = `${100 / scale}vh`;
    containerStyle.overflow = "hidden";
  }

  return (
    <div style={containerStyle}>
      {/* Optional background overlay for image backgrounds */}
      {config.backgroundType === "image" && (
        <div className="absolute inset-0 bg-black/40" />
      )}

      <div className="relative z-10 max-w-md mx-auto px-4 py-12 flex flex-col items-center">
        {/* Profile picture */}
        <ProfilePicture src={config.profilePicture} name={config.title} />

        {/* Title */}
        <h1
          className="mt-4 text-2xl font-bold text-center leading-tight"
          style={{ color: config.textColor }}
        >
          {config.title || "Your Name"}
        </h1>

        {/* Bio */}
        {config.bio && (
          <p
            className="mt-2 text-sm text-center opacity-80 max-w-xs leading-relaxed"
            style={{ color: config.textColor }}
          >
            {config.bio}
          </p>
        )}

        {/* Links */}
        <div className="mt-8 w-full flex flex-col gap-3">
          {config.links.map((link, index) => (
            <LinkButton
              key={link.id}
              link={link}
              buttonStyle={config.buttonStyle}
              buttonColor={config.buttonColor}
              buttonTextColor={config.buttonTextColor}
              accentColor={config.accentColor}
              isPublic={isPublic}
              animationDelay={index * 0.08}
            />
          ))}
        </div>

        {/* Music player */}
        {config.music?.url && (
          <MusicPlayer music={config.music} isPublic={isPublic} textColor={config.textColor} />
        )}

        {/* Footer branding */}
        <p className="mt-12 text-xs opacity-40" style={{ color: config.textColor }}>
          Made with LinkTree
        </p>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

function ProfilePicture({ src, name }: { src: string; name: string }) {
  const [error, setError] = useState(false);
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  if (!src || error) {
    return (
      <div className="w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold bg-white/20 border-4 border-white/30 shadow-xl">
        {initials || "?"}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={name || "Profile"}
      className="w-24 h-24 rounded-full object-cover border-4 border-white/30 shadow-xl"
      onError={() => setError(true)}
    />
  );
}

interface LinkButtonProps {
  link: LinkItem;
  buttonStyle: PageConfig["buttonStyle"];
  buttonColor: string;
  buttonTextColor: string;
  accentColor: string;
  isPublic: boolean;
  animationDelay: number;
}

function LinkButton({
  link,
  buttonStyle,
  buttonColor,
  buttonTextColor,
  isPublic,
  animationDelay,
}: LinkButtonProps) {
  const classes = getButtonClasses(buttonStyle);

  const style: React.CSSProperties = {
    backgroundColor: buttonColor,
    color: buttonTextColor,
    borderColor: buttonStyle === "outline" ? buttonTextColor : undefined,
    animationDelay: `${animationDelay}s`,
  };

  const handleClick = (e: React.MouseEvent) => {
    if (!isPublic) {
      e.preventDefault(); // Don't navigate in editor preview
    }
  };

  return (
    <a
      href={isPublic ? link.url : "#"}
      target={isPublic ? "_blank" : undefined}
      rel="noopener noreferrer"
      onClick={handleClick}
      className={`${classes} text-center block animate-fade-in-up`}
      style={style}
    >
      {link.title}
    </a>
  );
}

interface MusicPlayerProps {
  music: NonNullable<PageConfig["music"]>;
  isPublic: boolean;
  textColor: string;
}

function MusicPlayer({ music, isPublic, textColor }: MusicPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [playing, setPlaying] = useState(false);
  const [error, setError] = useState(false);

  // Attempt autoplay when this is the public page
  useEffect(() => {
    if (!isPublic || !audioRef.current) return;
    const audio = audioRef.current;

    if (music.autoplay) {
      audio
        .play()
        .then(() => setPlaying(true))
        .catch(() => {
          // Browser blocked autoplay – user must interact first
          setPlaying(false);
        });
    }
  }, [isPublic, music.autoplay]);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      audio.play().catch(() => setError(true));
      setPlaying(true);
    }
  };

  return (
    <div
      className="mt-8 w-full max-w-xs flex items-center gap-3 px-4 py-3 rounded-2xl backdrop-blur-sm bg-black/20 border border-white/10"
      style={{ color: textColor }}
    >
      <audio
        ref={audioRef}
        src={music.url}
        loop
        onError={() => setError(true)}
        preload="metadata"
      />

      <button
        onClick={toggle}
        className="shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
        aria-label={playing ? "Pause" : "Play"}
      >
        {playing ? (
          // Pause icon
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
          </svg>
        ) : (
          // Play icon
          <svg className="w-4 h-4 ml-0.5" fill="currentColor" viewBox="0 0 24 24">
            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      <div className="flex-1 min-w-0">
        {error ? (
          <p className="text-xs opacity-60">Unable to load audio</p>
        ) : (
          <>
            <p className="text-sm font-medium truncate opacity-90">
              {music.title || "Now Playing"}
            </p>
            <div className="mt-1 flex gap-0.5">
              {playing
                ? Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 rounded-full bg-current opacity-70 animate-music-bar"
                      style={{
                        height: "12px",
                        animationDelay: `${i * 0.15}s`,
                      }}
                    />
                  ))
                : Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="w-1 h-1 rounded-full bg-current opacity-40"
                    />
                  ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
