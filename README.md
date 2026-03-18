# ✦ LinkTree — Link-in-Bio Builder

A full-stack, modern Linktree-style web application built with **Next.js 16**, **Tailwind CSS 4**, and **SQLite** (via `better-sqlite3`).

## Features

- 🎨 **Template gallery** – 5 pre-built templates + blank canvas
- ✏️ **Live editor** – Real-time preview as you customize
  - Background: color, gradient, or image
  - Profile picture (URL), title, bio
  - Fonts (Inter, Poppins, Playfair Display, Roboto, Montserrat, Space Grotesk)
  - Button styles (pill, rounded, square, outline, glass) and colors
- 🔗 **Link management** – Add, edit, delete, and **drag-and-drop** reorder links
- 🎵 **Music player** – Add any audio URL with optional autoplay
- 🌍 **Permanent public URLs** – `/p/<id>` links never expire
- 📊 **View analytics** – Track how many times your page has been viewed
- 📋 **Copy-to-clipboard** – One-click copy for your public URL
- 🌙 **Dark/light mode** – Smooth toggle, preference stored in `localStorage`
- 📱 **Mobile-first responsive** design
- 🔍 **SEO metadata** – OpenGraph + Twitter Card for each public page

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19 + Next.js 16 (App Router) |
| Styling | Tailwind CSS 4 |
| Backend | Next.js API Routes (Node.js) |
| Database | SQLite via `better-sqlite3` |
| Drag & Drop | `@dnd-kit` |
| IDs | `nanoid` |

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Installation

```bash
# Clone the repository
git clone https://github.com/Rambus27/Link-Tree.git
cd Link-Tree

# Install dependencies
npm install

# Create environment file (optional – see below)
cp .env.example .env.local

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Environment Variables

Create a `.env.local` file (all optional):

```env
# The base URL of your deployment (used for absolute links in emails, etc.)
NEXT_PUBLIC_BASE_URL=http://localhost:3000

# Optional: custom SQLite database path (defaults to ./data/linktree.db)
# DB_PATH=/path/to/your/database.db
```

### Production Build

```bash
npm run build
npm run start
```

### Database

The SQLite database is automatically created at `./data/linktree.db` on first run. No setup needed.

For **production** deployments (e.g., Vercel), swap `better-sqlite3` for a hosted database:
- **MongoDB**: Replace `src/lib/db.ts` with a Mongoose-based implementation
- **Supabase** (Postgres): Use the Supabase client library
- **PlanetScale** (MySQL): Use the PlanetScale serverless driver

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── pages/              # POST to create, GET/PUT by ID
│   │   │   └── [id]/
│   │   └── check-username/     # GET username availability
│   ├── editor/                 # /editor page
│   ├── p/[id]/                 # Public shareable page
│   ├── globals.css
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── page.tsx                # Homepage
├── components/
│   ├── Editor.tsx              # Full editor with panels
│   ├── PagePreview.tsx         # Shared page renderer
│   ├── ThemeProvider.tsx       # Dark/light mode context
│   └── ThemeToggle.tsx         # Toggle button
├── lib/
│   └── db.ts                   # SQLite database helpers
└── types/
    └── index.ts                # Shared TypeScript types + templates
```

## Usage

1. **Visit the homepage** at `/` to browse templates
2. **Click a template** (or "Start Free") to open the editor
3. **Customize** your page using the left-side panels
4. **Click "Save & Publish"** to generate your permanent public URL
5. **Share** the link `/p/<your-id>` anywhere

## Contributing

PRs are welcome! Please follow the existing code style and include comments for key logic.

## License

MIT
