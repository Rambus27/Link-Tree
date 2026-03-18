# LinkTree Clone

A full-stack Linktree clone built with Next.js 14, TypeScript, Tailwind CSS, and MongoDB.

## Features

- 🎨 **Full Customization** - Backgrounds (color/gradient/image), colors, fonts, button styles
- 🎵 **Music Player** - Add background music with autoplay support
- 📱 **Mobile First** - Responsive design that works on all devices
- �� **Permanent Links** - Generated links never expire
- ↕️ **Drag & Drop** - Reorder links with intuitive drag-and-drop
- 📊 **View Analytics** - Track page view counts
- 🌙 **Dark Mode** - Full dark mode support
- 👤 **Custom Usernames** - Optional vanity URLs (/u/yourname)

## Tech Stack

- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Drag & Drop**: @dnd-kit/core, @dnd-kit/sortable
- **Fonts**: System fonts (Inter, Poppins, Roboto, Playfair Display with system fallbacks)

## Getting Started

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your MongoDB URI.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Routes

- `POST /api/pages` - Create a new page
- `GET /api/pages/[id]` - Get page by public ID
- `PUT /api/pages/[id]` - Update page
- `POST /api/pages/[id]/view` - Increment view count
- `GET /api/username/[username]` - Get page by username
- `GET /api/check-username/[username]` - Check username availability
