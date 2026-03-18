# LinkTree Clone - Full Stack Application

A beautiful, modern Linktree-like web application where users can create their own profile pages with customizable links, themes, and background music.

## 🌟 Features

### Core Features
- **Discord OAuth Authentication** - Seamless login with Discord
- **User Profiles** - Each user gets a unique profile page (`site.com/username`)
- **Link Management** - Add, edit, delete, and organize links with drag-and-drop
- **Live Preview** - Real-time editor with desktop, tablet, and mobile preview
- **Customization** - Fully customizable themes, colors, and styles

### Preset Themes
- 🌈 Neon - Vibrant gradient colors
- ⚪ Minimal - Clean and simple
- 🎮 Gaming - Dark with cyan accents
- 💜 Anime - Vibrant pink and purple
- 🔷 Dark Glass - Glassmorphism effect
- 🌅 Gradient - Multi-color gradient
- 🎨 Retro - Pastel colors

### Advanced Features
- **Music Player** - Upload MP3 or paste YouTube links, with controls for autoplay and looping
- **Analytics** - Track profile views, link clicks, and likes
- **Responsive Design** - Works perfectly on mobile, tablet, and desktop
- **Smooth Animations** - Elegant transitions and hover effects
- **Glassmorphism Effects** - Modern blur and transparency effects
- **Glow Effects** - Optional neon glow on links
- **Custom Colors** - Full color picker for backgrounds, buttons, and text
- **Share & Copy** - Easy sharing and link copying

## 📋 Tech Stack

### Backend
- **Node.js + Express** - Web server
- **MongoDB** - Database
- **Passport.js** - Discord OAuth authentication
- **Multer** - File uploads

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with animations
- **Vanilla JavaScript** - No framework dependencies
- **Live Preview System** - Real-time editor

### Database
- **MongoDB** - User profiles, links, settings
- **Mongoose** - Object modeling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Discord Developer Application

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/linktree-clone.git
   cd Link-Tree
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Discord OAuth**
   - Go to [Discord Developer Portal](https://discord.com/developers/applications)
   - Create a new application
   - Go to OAuth2 settings
   - Add Redirect URL: `http://localhost:3000/auth/discord/callback`
   - Copy Client ID and Client Secret

4. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your credentials:
   ```
   MONGODB_URI=mongodb://localhost:27017/linktree
   DISCORD_CLIENT_ID=your_client_id
   DISCORD_CLIENT_SECRET=your_client_secret
   DISCORD_CALLBACK_URL=http://localhost:3000/auth/discord/callback
   SESSION_SECRET=your_random_secret
   PORT=3000
   JWT_SECRET=your_jwt_secret
   ```

5. **Start MongoDB** (if running locally)
   ```bash
   mongod
   ```

6. **Run the server**
   ```bash
   # Development with auto-reload
   npm run dev

   # Production
   npm start
   ```

7. **Open in browser**
   ```
   http://localhost:3000
   ```

## 📁 Project Structure

```
Link-Tree/
├── public/
│   ├── css/
│   │   ├── styles.css          # Global styles
│   │   ├── home.css            # Landing page styles
│   │   ├── dashboard.css       # Dashboard styles
│   │   ├── editor.css          # Editor page styles
│   │   └── view.css            # Profile view styles
│   ├── js/
│   │   ├── main.js             # Shared utilities
│   │   ├── dashboard.js        # Dashboard functionality
│   │   ├── editor.js           # Editor with live preview
│   │   └── view.js             # Profile view page
│   ├── Home.html               # Landing page
│   ├── Dashboard.html          # User control panel
│   ├── Editor.html             # Profile editor with live preview
│   ├── View.html               # Public profile page
│   └── 404.html                # Error page
├── server/
│   └── server.js               # Express server & routes
├── database/
│   ├── User.js                 # User schema
│   └── db.js                   # MongoDB connection
├── uploads/                    # User uploaded files
├── package.json                # Dependencies
└── .env                        # Environment variables
```

## 📖 Usage

### For Users

1. **Create Profile**
   - Click "Login with Discord"
   - Authenticate with your Discord account
   - Go to Dashboard to set up your profile

2. **Add Links**
   - Go to Dashboard → Links
   - Click "Add Link"
   - Enter title, URL, icon, and color
   - Links appear on your public profile

3. **Customize Profile**
   - Use Editor for live preview
   - Choose a preset theme or customize colors
   - Upload profile picture and background
   - Add background music (optional)
   - Save changes

4. **Share Profile**
   - Copy your profile link from Dashboard
   - Share on social media
   - Track views and link clicks

### For Developers

#### Adding a New Theme Preset

Edit `public/js/editor.js` and add to the `presets` object:

```javascript
customTheme: {
  bgColor: '#ff0000',
  btnColor: '#00ff00',
  textColor: '#0000ff'
}
```

#### Creating Custom Link Styles

Update `public/css/view.css`:

```css
.profile-link.custom-style {
  /* Your custom styles */
}
```

#### Adding New Analytics

Update the MongoDB schema in `database/User.js` to add new fields, then update tracking in `server/server.js`.

## 🎨 Customization Guide

### Colors
- Edit `:root` variables in `public/css/styles.css` to change theme colors
- Each preset has its own color configuration in `editor.js`

### Animations
- Add new animations in the `@keyframes` rules in `styles.css`
- Apply animation classes to elements as needed

### Background Types
- **Color**: Single solid color
- **Gradient**: Linear gradient between colors
- **Image**: User-uploaded background image

### Button Styles
- **rounded**: Default with rounded corners
- **square**: Sharp square corners
- **pill**: Fully rounded (border-radius: 9999px)
- **gradient**: Gradient button
- **glow**: Glowing effect button

## 🔒 Security Features

- Discord OAuth for secure authentication
- Session-based user management
- Secure file uploads with multer
- Database validation
- Environment variables for sensitive data
- CORS protection

## 🐛 Common Issues

### MongoDB Connection Failed
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify database credentials

### Discord OAuth Not Working
- Verify Client ID and Secret are correct
- Check Redirect URL matches in Discord Developer Portal
- Ensure callback URL is in list of authorized URLs

### Files Not Uploading
- Check `uploads/` folder permissions
- Verify file size limits in multer config
- Check available disk space

### Live Preview Not Updating
- Clear browser cache
- Check console for JavaScript errors
- Verify all input values are being read correctly

## 🚀 Deployment

### Deploying to Heroku

1. **Set up Heroku app**
   ```bash
   heroku create your-app-name
   ```

2. **Set environment variables**
   ```bash
   heroku config:set MONGODB_URI=your_mongodb_url
   heroku config:set DISCORD_CLIENT_ID=your_id
   # ... set other variables
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```

### Deploying to DigitalOcean/AWS

1. Create a droplet/instance
2. Install Node.js and MongoDB
3. Clone repository
4. Install dependencies: `npm install`
5. Set environment variables
6. Run with PM2: `pm2 start server/server.js`
7. Configure reverse proxy (Nginx)

## 📊 API Reference

### Authentication
- `GET /auth/discord` - Initiates Discord OAuth flow
- `GET /auth/discord/callback` - Discord OAuth callback
- `GET /logout` - Logout current user

### User Profile
- `GET /api/user` - Get current user
- `GET /api/profile/:username` - Get user profile
- `POST /api/profile` - Update user profile

### Links
- `POST /api/links` - Add new link
- `PUT /api/links/:linkId` - Update link
- `DELETE /api/links/:linkId` - Delete link
- `POST /api/links/reorder` - Reorder links
- `POST /api/links/:linkId/click` - Track link click

### Uploads
- `POST /api/upload/profile` - Upload profile picture
- `POST /api/upload/background` - Upload background image
- `POST /api/upload/music` - Upload music file

### Interactions
- `POST /api/profile/:username/like` - Like user profile

## 🤝 Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 💡 Future Enhancements

- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Custom domain support   
- [ ] Email notifications
- [ ] QR code generation
- [ ] API for integrations
- [ ] Dark mode toggle
- [ ] PWA support
- [ ] Multi-language support
- [ ] Link expiration/scheduling

## 🙋 Support

For questions or issues:
- Open an issue on GitHub
- Check existing issues for solutions
- Review documentation

## 🎉 Credits

Built with ❤️ using modern web technologies.

---

**Happy Linking! 🔗**
