# Quick Start Guide - LinkTree Clone

## 📦 What's Included

This is a complete, production-ready Linktree clone with:

### ✅ Backend
- Express.js server with Discord OAuth
- MongoDB database with User schema
- File upload handling (profiles, backgrounds, music)
- Link management API
- Analytics tracking
- Session management

### ✅ Frontend
- Landing page (Home.html)
- Dashboard with statistics and link management
- Live preview editor with 7 theme presets
- Public profile page with custom styling
- Responsive design (mobile, tablet, desktop)
- Smooth animations and effects

### ✅ Features Implemented
- [x] Discord OAuth login
- [x] User profiles with custom domains (site.com/username)
- [x] Add/edit/delete links
- [x] Drag-and-drop link reordering
- [x] 7 preset themes (Neon, Minimal, Gaming, Anime, Dark Glass, Gradient, Retro)
- [x] Custom color picker for all elements
- [x] Profile picture upload
- [x] Background image upload
- [x] Music player with upload or YouTube support
- [x] Live preview editor
- [x] Analytics (views, likes, clicks)
- [x] Share button
- [x] Copy profile link
- [x] Responsive design
- [x] Glassmorphism UI
- [x] Smooth animations
- [x] Glow effects

## 🚀 Quick Setup

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Create .env file from example**
   ```bash
   cp .env.example .env
   ```

3. **Set up Discord OAuth** (Get IDs from Discord Developer Portal)
   - Add your Discord Client ID and Secret to .env

4. **Set up MongoDB**
   - Use local MongoDB or MongoDB Atlas cloud

5. **Run the app**
   ```bash
   npm run dev
   ```

6. **Open browser**
   ```
   http://localhost:3000
   ```

## 📁 File Map

```
Frontend Files:
- public/Home.html           → Landing page
- public/Dashboard.html      → User control panel  
- public/Editor.html         → Live preview editor
- public/View.html           → Public profile page
- public/css/                → All styling files
- public/js/main.js          → Shared utilities
- public/js/dashboard.js     → Dashboard logic
- public/js/editor.js        → Editor with live preview
- public/js/view.js          → Profile page logic

Backend Files:
- server/server.js           → Express app & routes
- database/User.js           → MongoDB schema
- database/db.js             → Database connection

Configuration:
- package.json               → Dependencies
- .env.example               → Environment template
- .gitignore                 → Git ignore rules
- README.md                  → Full documentation
```

## 🎨 Color Scheme (Customizable)

- Primary: #6366f1 (Indigo)
- Secondary: #8b5cf6 (Violet)
- Accent: #ec4899 (Pink)
- Dark: #0a0e27 (Very Dark Blue)
- Text: #e2e8f0 (Light)

## 🔐 Discord OAuth Flow

1. User clicks "Login with Discord"
2. Redirected to `/auth/discord`
3. Discord login page
4. Redirected back to `/auth/discord/callback`
5. Session created
6. Redirected to `/dashboard`

## 📊 Database Schema

**User Collection:**
- discordId (unique)
- username (unique, auto-generated)
- displayName
- avatar
- email
- bio
- profileImage
- backgroundImage
- theme (preset or custom)
- customSettings (colors, animations, etc.)
- musicSettings (enabled, URL, autoplay, loop, volume)
- links (array of link objects)
- viewCount
- likes
- isPublic
- timestamps

## 🎯 Main Components

### Editor (Editor.html)
- Tab system (Links, Design, Profile)
- Live preview with device selection
- Theme presets
- Color pickers
- Link list with drag-and-drop
- Music settings

### Dashboard (Dashboard.html)
- Statistics cards (views, links, likes, clicks)
- Quick actions
- Profile editor
- Theme selector
- Custom settings form
- Link management
- Music configuration
- Settings

### Public Profile (View.html)
- Profile header with avatar
- Customized background
- Styled links
- Music player (if enabled)
- Statistics
- Share & copy buttons

## 🔧 Customization Tips

### Add New Theme
Edit `public/js/editor.js`, add to `presets` object

### Change Colors
Edit `:root` variables in `public/css/styles.css`

### Add Animations
Add `@keyframes` rules in `styles.css`

### Modify API Routes
Edit `server/server.js`

## 🐛 Troubleshooting

**Port 3000 already in use?**
```bash
lsof -i :3000  # Find process
kill -9 <PID>  # Kill it
```

**MongoDB connection error?**
```bash
mongod  # Start MongoDB service
```

**Discord OAuth not working?**
- Verify Client ID/Secret in .env
- Check Redirect URL in Discord Developer Portal

## 📱 Responsive Breakpoints

- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎬 Next Steps

1. **Customize branding** - Update colors and logo
2. **Deploy** - Use Heroku, Vercel, or your own server
3. **Add features** - Implement suggested enhancements
4. **Collect feedback** - From users and improve

## 📞 Need Help?

- Check README.md for detailed documentation
- Review console errors in browser DevTools
- Check server logs for backend errors

---

**Your LinkTree clone is ready to use! Happy linking! 🔗**
