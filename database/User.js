const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  discordId: {
    type: String,
    required: true,
    unique: true
  },
  username: {
    type: String,
    required: true,
    unique: true
  },
  displayName: String,
  avatar: String,
  email: String,
  bio: String,
  profileImage: String,
  backgroundImage: String,
  backgroundColor: {
    type: String,
    default: '#0a0e27'
  },
  backgroundGradient: String,
  backgroundType: {
    type: String,
    enum: ['color', 'gradient', 'image'],
    default: 'color'
  },
  theme: {
    type: String,
    enum: ['neon', 'minimal', 'gaming', 'anime', 'darkglass', 'gradient', 'retro', 'custom'],
    default: 'custom'
  },
  customSettings: {
    fontFamily: {
      type: String,
      default: 'Inter'
    },
    buttonStyle: {
      type: String,
      enum: ['rounded', 'square', 'pill', 'gradient', 'glow'],
      default: 'rounded'
    },
    buttonAnimation: {
      type: String,
      enum: ['none', 'scale', 'glow', 'slide', 'bounce'],
      default: 'scale'
    },
    textColor: {
      type: String,
      default: '#ffffff'
    },
    buttonColor: {
      type: String,
      default: '#6366f1'
    },
    borderRadius: {
      type: Number,
      default: 12
    },
    shadowStyle: {
      type: String,
      enum: ['none', 'soft', 'medium', 'hard'],
      default: 'soft'
    },
    glowEffect: {
      type: Boolean,
      default: false
    },
    blurBg: {
      type: Boolean,
      default: false
    }
  },
  musicSettings: {
    enabled: {
      type: Boolean,
      default: false
    },
    musicUrl: String,
    musicSource: {
      type: String,
      enum: ['upload', 'youtube'],
      default: 'upload'
    },
    autoplay: {
      type: Boolean,
      default: false
    },
    loop: {
      type: Boolean,
      default: true
    },
    volume: {
      type: Number,
      default: 0.5
    },
    musicTitle: String
  },
  links: [{
    id: mongoose.Schema.Types.ObjectId,
    title: String,
    url: String,
    icon: String,
    color: String,
    order: Number,
    clicks: {
      type: Number,
      default: 0
    },
    createdAt: {
      type: Date,
      default: Date.now
    }
  }],
  viewCount: {
    type: Number,
    default: 0
  },
  likes: {
    type: Number,
    default: 0
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

userSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('User', userSchema);
