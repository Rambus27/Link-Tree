// View JavaScript - Public profile page

let profileUser = null;

// Initialize profile view
async function initProfileView() {
  const username = window.location.pathname.substring(1);
  
  if (!username || username === 'Home.html') {
    window.location.href = '/';
    return;
  }

  try {
    const response = await fetch(`${API_BASE}/api/profile/${username}`);
    
    if (!response.ok) {
      showProfileError('Profile not found');
      return;
    }

    profileUser = await response.json();
    renderProfile();
    setupEventListeners();
  } catch (error) {
    console.error('Error loading profile:', error);
    showProfileError('Error loading profile');
  }
}

// Render profile
function renderProfile() {
  // Set page title
  document.title = `${profileUser.displayName} - LinkTree`;

  // Apply background
  const bgContainer = document.getElementById('profileBackground');
  if (profileUser.backgroundType === 'color') {
    bgContainer.style.backgroundColor = profileUser.backgroundColor || '#0a0e27';
  } else if (profileUser.backgroundType === 'gradient') {
    bgContainer.style.background = profileUser.backgroundGradient || 'linear-gradient(135deg, #0a0e27 0%, #050813 100%)';
  } else if (profileUser.backgroundType === 'image' && profileUser.backgroundImage) {
    bgContainer.style.backgroundImage = `url('${profileUser.backgroundImage}')`;
    bgContainer.style.backgroundSize = 'cover';
    bgContainer.style.backgroundPosition = 'center';
  }

  // Apply profile body background
  const profileBody = document.getElementById('profileBody');
  profileBody.style.backgroundColor = profileUser.backgroundColor || '#0a0e27';

  // Set profile image
  const profileImage = document.getElementById('profileImage');
  profileImage.src = profileUser.profileImage || 'https://via.placeholder.com/120';

  // Set profile name and bio
  document.getElementById('profileName').textContent = profileUser.displayName || profileUser.username;
  document.getElementById('profileBio').textContent = profileUser.bio || 'Welcome to my profile!';

  // Update colors
  const settings = profileUser.customSettings || {};
  const textColor = settings.textColor || '#ffffff';
  document.getElementById('profileName').style.color = textColor;
  document.getElementById('profileBio').style.color = settings.textColor === '#ffffff' ? 'var(--text-muted)' : textColor;

  // Update stats
  document.getElementById('viewCount').textContent = profileUser.viewCount || 0;
  document.getElementById('likeCount').textContent = profileUser.likes || 0;

  // Calculate total clicks
  const totalClicks = profileUser.links.reduce((sum, link) => sum + (link.clicks || 0), 0);
  document.getElementById('linkClickCount').textContent = totalClicks;

  // Render links
  renderProfileLinks();

  // Render music player if enabled
  if (profileUser.musicSettings?.enabled) {
    renderMusicPlayer();
  }

  // Apply theme CSS
  applyThemeCSS();

  // Check if user is logged in to show nav user info
  checkLoggedIn();
}

// Render profile links
function renderProfileLinks() {
  const container = document.getElementById('linksContainer');
  container.innerHTML = '';

  const settings = profileUser.customSettings || {};
  const textColor = settings.textColor || '#ffffff';
  const btnStyle = settings.buttonStyle || 'rounded';
  const btnAnimation = settings.buttonAnimation || 'scale';
  const glowEffect = settings.glowEffect || false;

  profileUser.links.forEach(link => {
    const a = document.createElement('a');
    a.href = link.url;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.className = 'profile-link';
    if (btnStyle !== 'rounded') a.classList.add(btnStyle);
    if (btnAnimation !== 'none') a.classList.add(btnAnimation);
    if (glowEffect) a.classList.add('glow-effect');

    // Apply custom color
    a.style.backgroundColor = link.color || settings.buttonColor || '#6366f1';
    a.style.color = textColor;

    a.innerHTML = `
      <span class="profile-link-icon">${link.icon || '🔗'}</span>
      <span class="profile-link-text">${link.title}</span>
    `;

    // Track click
    a.addEventListener('click', () => trackLinkClick(link.id));

    container.appendChild(a);
  });
}

// Render music player
function renderMusicPlayer() {
  const musicSettings = profileUser.musicSettings;
  const musicContainer = document.getElementById('musicContainer');

  musicContainer.classList.remove('hidden');
  
  document.getElementById('musicTitle').textContent = musicSettings.musicTitle || 'Now Playing';
  
  const audio = document.getElementById('bgMusic');
  if (musicSettings.musicUrl) {
    audio.src = musicSettings.musicUrl;
    audio.autoplay = musicSettings.autoplay || false;
    audio.loop = musicSettings.loop || true;
    audio.volume = musicSettings.volume || 0.5;
  }
}

// Apply theme CSS
function applyThemeCSS() {
  const settings = profileUser.customSettings || {};
  const themeCss = document.getElementById('themeCss');
  
  let css = `
    :root {
      --text: ${settings.textColor || '#ffffff'};
      --button-color: ${settings.buttonColor || '#6366f1'};
    }

    #profileName {
      color: ${settings.textColor || '#ffffff'} !important;
    }

    .profile-bio {
      color: ${settings.textColor === '#ffffff' ? 'var(--text-muted)' : settings.textColor} !important;
    }

    .profile-link {
      background-color: ${settings.buttonColor || '#6366f1'} !important;
      color: ${settings.textColor || '#ffffff'} !important;
    }

    .profile-link.rounded {
      border-radius: 0.75rem;
    }

    .profile-link.square {
      border-radius: 0;
    }

    .profile-link.pill {
      border-radius: 9999px;
    }
  `;

  themeCss.textContent = css;
}

// Setup event listeners
function setupEventListeners() {
  // Copy link
  document.getElementById('copyLinkBtn')?.addEventListener('click', copyLink);

  // Share
  document.getElementById('shareBtn')?.addEventListener('click', shareProfile);

  // Like
  document.getElementById('likeBtn')?.addEventListener('click', likeProfile);

  // Music controls
  const audio = document.getElementById('bgMusic');
  if (audio) {
    document.getElementById('playPauseBtn')?.addEventListener('click', () => {
      if (audio.paused) {
        audio.play();
        document.getElementById('playPauseBtn').textContent = '⏸️';
      } else {
        audio.pause();
        document.getElementById('playPauseBtn').textContent = '▶️';
      }
    });

    document.getElementById('musicLoopBtn')?.addEventListener('click', () => {
      audio.loop = !audio.loop;
      const btn = document.getElementById('musicLoopBtn');
      btn.classList.toggle('active', audio.loop);
    });

    document.getElementById('volumeSlider')?.addEventListener('input', (e) => {
      audio.volume = e.target.value / 100;
    });

    audio.addEventListener('play', () => {
      document.getElementById('playPauseBtn').textContent = '⏸️';
    });

    audio.addEventListener('pause', () => {
      document.getElementById('playPauseBtn').textContent = '▶️';
    });

    audio.addEventListener('timeupdate', () => {
      const currentTime = formatTime(audio.currentTime);
      const duration = formatTime(audio.duration);
      document.getElementById('currentTime').textContent = currentTime;
      document.getElementById('duration').textContent = duration;
    });
  }
}

// Copy link
function copyLink() {
  const profileUrl = `${window.location.origin}/${profileUser.username}`;
  copyToClipboard(profileUrl);
}

// Share profile
function shareProfile() {
  const profileUrl = `${window.location.origin}/${profileUser.username}`;
  const text = `Check out my profile on LinkTree!`;

  if (navigator.share) {
    navigator.share({
      title: `${profileUser.displayName}'s LinkTree`,
      text: text,
      url: profileUrl
    });
  } else {
    copyToClipboard(profileUrl);
  }
}

// Like profile
async function likeProfile() {
  try {
    const response = await fetch(`${API_BASE}/api/profile/${profileUser.username}/like`, {
      method: 'POST'
    });

    if (response.ok) {
      const data = await response.json();
      profileUser.likes = data.likes;
      document.getElementById('likeCount').textContent = profileUser.likes;
      showToast('Profile liked!');
    }
  } catch (error) {
    console.error('Error liking profile:', error);
  }
}

// Track link click
async function trackLinkClick(linkId) {
  try {
    await fetch(`${API_BASE}/api/links/${linkId}/click`, {
      method: 'POST'
    });

    // Update click count
    const link = profileUser.links.find(l => l.id === linkId);
    if (link) {
      link.clicks = (link.clicks || 0) + 1;
      const totalClicks = profileUser.links.reduce((sum, l) => sum + (l.clicks || 0), 0);
      document.getElementById('linkClickCount').textContent = totalClicks;
    }
  } catch (error) {
    console.error('Error tracking click:', error);
  }
}

// Format time
function formatTime(seconds) {
  if (isNaN(seconds)) return '0:00';
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' + secs : secs}`;
}

// Show profile error
function showProfileError(message) {
  const container = document.querySelector('.profile-content');
  container.innerHTML = `
    <div class="profile-error">
      <h2>Profile Not Found</h2>
      <p>${message}</p>
      <a href="/" class="btn btn-primary">Go Home</a>
    </div>
  `;
}

// Check if logged in
async function checkLoggedIn() {
  const user = await getCurrentUser();
  if (user) {
    const navUser = document.getElementById('navUser');
    if (navUser) {
      const isDowner = user.username === profileUser.username;
      navUser.innerHTML = `
        ${isDowner ? '<a href="/editor" class="btn btn-primary btn-small">Edit</a>' : ''}
        <a href="/dashboard" class="btn btn-ghost btn-small">Dashboard</a>
      `;
    }
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initProfileView);
