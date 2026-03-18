// Core types for the LinkTree application

export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface MusicConfig {
  url: string;
  title?: string;
  autoplay: boolean;
}

export type FontFamily =
  | "Inter"
  | "Poppins"
  | "Playfair Display"
  | "Roboto"
  | "Montserrat"
  | "Space Grotesk";

export type BackgroundType = "color" | "gradient" | "image";

export interface PageConfig {
  // Identity
  username?: string;

  // Background
  backgroundType: BackgroundType;
  backgroundColor: string;
  backgroundGradient: string;
  backgroundImage: string;

  // Profile
  profilePicture: string;
  title: string;
  bio: string;

  // Styling
  fontFamily: FontFamily;
  buttonStyle: "rounded" | "pill" | "square" | "outline" | "glass";
  buttonColor: string;
  buttonTextColor: string;
  textColor: string;
  accentColor: string;

  // Links
  links: LinkItem[];

  // Music
  music?: MusicConfig;

  // Template
  template: string;
}

export interface SavedPage extends PageConfig {
  id: string;
  createdAt: string;
  updatedAt: string;
  viewCount: number;
}

// Default page configuration
export const DEFAULT_PAGE_CONFIG: PageConfig = {
  backgroundType: "gradient",
  backgroundColor: "#1a1a2e",
  backgroundGradient: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
  backgroundImage: "",
  profilePicture: "",
  title: "Your Name",
  bio: "Add a short bio here ✨",
  fontFamily: "Inter",
  buttonStyle: "pill",
  buttonColor: "#ffffff",
  buttonTextColor: "#1a1a2e",
  textColor: "#ffffff",
  accentColor: "#e94560",
  links: [
    { id: "1", title: "My Website", url: "https://example.com" },
    { id: "2", title: "Follow on Instagram", url: "https://instagram.com" },
  ],
  template: "blank",
};

// Built-in templates
export const TEMPLATES: Array<{
  id: string;
  name: string;
  description: string;
  preview: string;
  config: Partial<PageConfig>;
}> = [
  {
    id: "midnight",
    name: "Midnight",
    description: "Dark, elegant and mysterious",
    preview: "bg-gradient-to-br from-gray-900 via-blue-950 to-gray-900",
    config: {
      backgroundType: "gradient",
      backgroundColor: "#0f0f1a",
      backgroundGradient: "linear-gradient(135deg, #0f0f1a 0%, #1a1a3e 50%, #0f1a2e 100%)",
      buttonStyle: "pill",
      buttonColor: "rgba(255,255,255,0.15)",
      buttonTextColor: "#ffffff",
      textColor: "#ffffff",
      accentColor: "#7c3aed",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "sunrise",
    name: "Sunrise",
    description: "Warm, vibrant gradient vibes",
    preview: "bg-gradient-to-br from-orange-400 via-pink-500 to-purple-600",
    config: {
      backgroundType: "gradient",
      backgroundColor: "#ff6b35",
      backgroundGradient: "linear-gradient(135deg, #ff6b35 0%, #f7c59f 30%, #efefd0 60%, #004e89 100%)",
      buttonStyle: "rounded",
      buttonColor: "rgba(255,255,255,0.9)",
      buttonTextColor: "#1a1a1a",
      textColor: "#1a1a1a",
      accentColor: "#ff6b35",
      fontFamily: "Poppins",
    },
  },
  {
    id: "forest",
    name: "Forest",
    description: "Natural, calm, earthy tones",
    preview: "bg-gradient-to-br from-green-900 via-green-700 to-emerald-800",
    config: {
      backgroundType: "gradient",
      backgroundColor: "#1a2e1a",
      backgroundGradient: "linear-gradient(135deg, #1a2e1a 0%, #2d5a27 50%, #1a3a2a 100%)",
      buttonStyle: "glass",
      buttonColor: "rgba(255,255,255,0.2)",
      buttonTextColor: "#ffffff",
      textColor: "#e8f5e9",
      accentColor: "#66bb6a",
      fontFamily: "Montserrat",
    },
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Clean white, pure and simple",
    preview: "bg-white border border-gray-200",
    config: {
      backgroundType: "color",
      backgroundColor: "#ffffff",
      backgroundGradient: "",
      buttonStyle: "outline",
      buttonColor: "transparent",
      buttonTextColor: "#1a1a1a",
      textColor: "#1a1a1a",
      accentColor: "#1a1a1a",
      fontFamily: "Inter",
    },
  },
  {
    id: "neon",
    name: "Neon",
    description: "Cyberpunk neon glow aesthetic",
    preview: "bg-gray-950 border border-purple-500",
    config: {
      backgroundType: "color",
      backgroundColor: "#050510",
      backgroundGradient: "",
      buttonStyle: "glass",
      buttonColor: "rgba(139,92,246,0.2)",
      buttonTextColor: "#c4b5fd",
      textColor: "#e9d5ff",
      accentColor: "#a855f7",
      fontFamily: "Space Grotesk",
    },
  },
  {
    id: "blank",
    name: "Blank Canvas",
    description: "Start completely from scratch",
    preview: "bg-gradient-to-br from-gray-800 to-gray-900",
    config: {},
  },
];
