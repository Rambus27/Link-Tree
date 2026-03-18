const express = require('express');
const session = require('express-session');
const passport = require('passport');
const DiscordStrategy = require('passport-discord').Strategy;
const mongoose = require('mongoose');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const connectDB = require('../database/db');
const User = require('../database/User');

const app = express();

// Connect to Database
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Session Configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'your_session_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 
  }
}));

// Passport Configuration
app.use(passport.initialize());
app.use(passport.session());

// Discord Strategy
passport.use(new DiscordStrategy({
  clientID: process.env.DISCORD_CLIENT_ID,
  clientSecret: process.env.DISCORD_CLIENT_SECRET,
  callbackURL: process.env.DISCORD_CALLBACK_URL,
  scope: ['identify', 'email']
}, async (accessToken, refreshToken, profile, done) => {
  try {
    let user = await User.findOne({ discordId: profile.id });
    
    if (!user) {
      // Generate username from Discord username
      let username = profile.username.toLowerCase();
      let counter = 1;
      let originalUsername = username;
      
      while (await User.findOne({ username })) {
        username = `${originalUsername}${counter}`;
        counter++;
      }
      
      user = new User({
        discordId: profile.id,
        username: username,
        displayName: profile.username,
        avatar: profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : null,
        email: profile.email
      });
      
      await user.save();
    } else {
      // Update profile info
      user.displayName = profile.username;
      user.avatar = profile.avatar ? `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.png` : user.avatar;
      user.email = profile.email;
      await user.save();
    }
    
    return done(null, user);
  } catch (error) {
    return done(error);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB limit
});

// Middleware to check authentication
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Not authenticated' });
};

// ===== ROUTES =====

// Home page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/Home.html'));
});

// Discord Authentication Routes
app.get('/auth/discord', passport.authenticate('discord'));

app.get('/auth/discord/callback', 
  passport.authenticate('discord', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/dashboard');
  }
);

// Logout
app.get('/logout', (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: 'Logout failed' });
    }
    res.redirect('/');
  });
});

// Get current user info
app.get('/api/user', (req, res) => {
  if (req.user) {
    res.json(req.user);
  } else {
    res.status(401).json({ error: 'Not authenticated' });
  }
});

// Dashboard page
app.get('/dashboard', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/Dashboard.html'));
});

// Editor page
app.get('/editor', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.sendFile(path.join(__dirname, '../public/Editor.html'));
});

// Public profile page
app.get('/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user || !user.isPublic) {
      return res.status(404).sendFile(path.join(__dirname, '../public/404.html'));
    }
    
    // Increment view count
    user.viewCount += 1;
    await user.save();
    
    res.sendFile(path.join(__dirname, '../public/View.html'));
  } catch (error) {
    res.status(500).sendFile(path.join(__dirname, '../public/404.html'));
  }
});

// ===== API ROUTES =====

// Get user profile
app.get('/api/profile/:username', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user || !user.isPublic) {
      return res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
app.post('/api/profile', isAuthenticated, async (req, res) => {
  try {
    const { displayName, bio, profileImage, backgroundImage, backgroundColor, backgroundGradient, backgroundType, theme, customSettings, musicSettings, isPublic } = req.body;
    
    const user = req.user;
    if (displayName) user.displayName = displayName;
    if (bio !== undefined) user.bio = bio;
    if (profileImage) user.profileImage = profileImage;
    if (backgroundImage) user.backgroundImage = backgroundImage;
    if (backgroundColor) user.backgroundColor = backgroundColor;
    if (backgroundGradient) user.backgroundGradient = backgroundGradient;
    if (backgroundType) user.backgroundType = backgroundType;
    if (theme) user.theme = theme;
    if (customSettings) user.customSettings = { ...user.customSettings, ...customSettings };
    if (musicSettings) user.musicSettings = { ...user.musicSettings, ...musicSettings };
    if (isPublic !== undefined) user.isPublic = isPublic;
    
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add link
app.post('/api/links', isAuthenticated, async (req, res) => {
  try {
    const { title, url, icon, color } = req.body;
    const user = req.user;
    
    const newLink = {
      id: new mongoose.Types.ObjectId(),
      title,
      url,
      icon: icon || '🔗',
      color: color || user.customSettings.buttonColor,
      order: user.links.length,
      clicks: 0,
      createdAt: new Date()
    };
    
    user.links.push(newLink);
    await user.save();
    
    res.json(newLink);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update link
app.put('/api/links/:linkId', isAuthenticated, async (req, res) => {
  try {
    const { title, url, icon, color, order } = req.body;
    const user = req.user;
    
    const link = user.links.id(req.params.linkId);
    if (!link) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    if (title) link.title = title;
    if (url) link.url = url;
    if (icon) link.icon = icon;
    if (color) link.color = color;
    if (order !== undefined) link.order = order;
    
    await user.save();
    res.json(link);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete link
app.delete('/api/links/:linkId', isAuthenticated, async (req, res) => {
  try {
    const user = req.user;
    user.links.id(req.params.linkId).remove();
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reorder links
app.post('/api/links/reorder', isAuthenticated, async (req, res) => {
  try {
    const { linkIds } = req.body;
    const user = req.user;
    
    // Reorder links based on provided IDs
    const newLinks = [];
    linkIds.forEach((id, index) => {
      const link = user.links.id(id);
      if (link) {
        link.order = index;
        newLinks.push(link);
      }
    });
    
    user.links = newLinks;
    await user.save();
    res.json({ success: true, links: user.links });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Track link click
app.post('/api/links/:linkId/click', async (req, res) => {
  try {
    const user = await User.findOne({ 'links._id': req.params.linkId });
    if (!user) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    const link = user.links.id(req.params.linkId);
    if (link) {
      link.clicks += 1;
      await user.save();
    }
    
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload profile image
app.post('/api/upload/profile', isAuthenticated, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload background
app.post('/api/upload/background', isAuthenticated, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Upload music
app.post('/api/upload/music', isAuthenticated, upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Like user profile
app.post('/api/profile/:username/like', async (req, res) => {
  try {
    const user = await User.findOne({ username: req.params.username });
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.likes += 1;
    await user.save();
    res.json({ likes: user.likes });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`http://localhost:${PORT}`);
});
