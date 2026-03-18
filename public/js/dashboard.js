// Dashboard JavaScript

let currentUser = null;
let userSettings = {};

// Initialize dashboard
async function initDashboard() {
  currentUser = await getCurrentUser();
  if (!currentUser) {
    window.location.href = '/';
    return;
  }

  loadUserData();
  setupEventListeners();
}

// Load user data
async function loadUserData() {
  try {
    // Update stats
    document.getElementById('viewCount').textContent = currentUser.viewCount || 0;
    document.getElementById('linkCount').textContent = currentUser.links.length;
    document.getElementById('likeCount').textContent = currentUser.likes || 0;

    const totalClicks = currentUser.links.reduce((sum, link) => sum + (link.clicks || 0), 0);
    document.getElementById('clickCount').textContent = totalClicks;

    // Load profile info
    document.getElementById('displayName').value = currentUser.displayName || '';
    document.getElementById('username').value = currentUser.username || '';
    document.getElementById('bio').value = currentUser.bio || '';

    // Load images
    if (currentUser.profileImage) {
      document.getElementById('profileImagePreview').src = currentUser.profileImage;
    }
    if (currentUser.backgroundImage) {
      document.getElementById('backgroundImagePreview').src = currentUser.backgroundImage;
    }

    // Load theme
    if (currentUser.theme) {
      const presetOptions = document.querySelectorAll('[data-theme]');
      presetOptions.forEach(option => {
        option.classList.remove('active');
        if (option.dataset.theme === currentUser.theme) {
          option.classList.add('active');
        }
      });
    }

    // Load custom settings
    const settings = currentUser.customSettings || {};
    document.getElementById('buttonColor').value = settings.buttonColor || '#6366f1';
    document.getElementById('textColor').value = settings.textColor || '#ffffff';
    document.getElementById('backgroundColor').value = settings.backgroundColor || '#0a0e27';
    document.getElementById('buttonStyle').value = settings.buttonStyle || 'rounded';
    document.getElementById('buttonAnimation').value = settings.buttonAnimation || 'scale';
    document.getElementById('glowEffect').checked = settings.glowEffect || false;
    document.getElementById('blurBg').checked = settings.blurBg || false;

    // Load music settings
    const musicSettings = currentUser.musicSettings || {};
    document.getElementById('enableMusic').checked = musicSettings.enabled || false;
    document.getElementById('musicTitle').value = musicSettings.musicTitle || '';
    document.getElementById('autoplay').checked = musicSettings.autoplay || false;
    document.getElementById('loop').checked = musicSettings.loop || true;
    document.getElementById('volume').value = musicSettings.volume * 100 || 50;
    document.getElementById('volumeValue').textContent = Math.round(musicSettings.volume * 100) + '%';

    // Load settings
    document.getElementById('isPublic').checked = currentUser.isPublic !== false;

    // Load links
    renderLinks();
  } catch (error) {
    console.error('Error loading user data:', error);
    showToast('Error loading user data', 'error');
  }
}

// Render links
function renderLinks() {
  const linksList = document.getElementById('linksList');
  const emptyState = document.getElementById('emptyState');

  linksList.innerHTML = '';

  if (currentUser.links.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  currentUser.links.forEach(link => {
    const linkElement = createLinkElement(link);
    linksList.appendChild(linkElement);
  });
}

// Create link element
function createLinkElement(link) {
  const div = document.createElement('div');
  div.className = 'link-item card';
  div.innerHTML = `
    <div class="link-item-content">
      <div class="link-item-title">${link.title}</div>
      <div class="link-item-url">${link.url}</div>
      <div class="link-item-stats">Clicks: ${link.clicks || 0}</div>
    </div>
    <div class="link-item-actions">
      <button class="btn btn-ghost btn-small btn-icon" data-link-id="${link.id}" onclick="editLink('${link.id}')">
        ✏️
      </button>
      <button class="btn btn-ghost btn-small btn-icon" data-link-id="${link.id}" onclick="deleteLink('${link.id}')">
        🗑️
      </button>
    </div>
  `;
  return div;
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  const tabBtns = document.querySelectorAll('.menu-item');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const section = btn.dataset.section;
      switchToSection(section);
    });
  });

  // Profile form
  document.getElementById('profileForm')?.addEventListener('submit', updateProfile);

  // Custom settings form
  document.getElementById('customSettingsForm')?.addEventListener('submit', saveCustomSettings);

  // Theme preset selection
  document.querySelectorAll('.preset-option').forEach(btn => {
    btn.addEventListener('click', () => {
      selectTheme(btn.dataset.theme);
    });
  });

  // Color inputs
  document.getElementById('buttonColor')?.addEventListener('change', debounce(saveCustomSettings, 500));
  document.getElementById('textColor')?.addEventListener('change', debounce(saveCustomSettings, 500));
  document.getElementById('backgroundColor')?.addEventListener('change', debounce(saveCustomSettings, 500));

  // Music controls
  document.getElementById('enableMusic')?.addEventListener('change', toggleMusicSettings);
  document.getElementById('musicSource')?.addEventListener('change', changeMusicSource);
  document.getElementById('volume')?.addEventListener('input', updateVolumeDisplay);
  document.getElementById('musicForm')?.addEventListener('submit', saveMusicSettings);

  // Settings form
  document.getElementById('settingsForm')?.addEventListener('submit', saveSettings);

  // Upload buttons
  document.getElementById('uploadProfileBtn')?.addEventListener('click', () => {
    document.getElementById('profileImageInput').click();
  });
  document.getElementById('uploadBackgroundBtn')?.addEventListener('click', () => {
    document.getElementById('backgroundImageInput').click();
  });
  document.getElementById('uploadMusicBtn')?.addEventListener('click', () => {
    document.getElementById('musicInput').click();
  });

  // File uploads
  document.getElementById('profileImageInput')?.addEventListener('change', uploadProfileImage);
  document.getElementById('backgroundImageInput')?.addEventListener('change', uploadBackgroundImage);
  document.getElementById('musicInput')?.addEventListener('change', uploadMusic);

  // Add link
  document.getElementById('addLinkBtn')?.addEventListener('click', () => openModal('linkModal'));
  document.getElementById('closeLinkModal')?.addEventListener('click', () => closeModal('linkModal'));
  document.getElementById('cancelLinkBtn')?.addEventListener('click', () => closeModal('linkModal'));
  document.getElementById('linkForm')?.addEventListener('submit', addLink);

  // Copy link
  document.getElementById('copyLinkBtn')?.addEventListener('click', copyProfileLink);

  // Share
  document.getElementById('shareLinkBtn')?.addEventListener('click', shareProfile);

  // Close modals on backdrop click
  document.getElementById('linkModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'linkModal') {
      closeModal('linkModal');
    }
  });
}

// Switch section
function switchToSection(section) {
  // Hide all sections
  document.querySelectorAll('.dashboard-section').forEach(s => {
    s.classList.remove('active');
  });

  // Remove active from menu items
  document.querySelectorAll('.menu-item').forEach(item => {
    item.classList.remove('active');
  });

  // Show selected section
  document.getElementById(section)?.classList.add('active');

  // Add active to menu item
  document.querySelector(`[data-section="${section}"]`)?.classList.add('active');
}

// Update profile
async function updateProfile(e) {
  e.preventDefault();

  const profileData = {
    displayName: document.getElementById('displayName').value,
    bio: document.getElementById('bio').value,
    isPublic: document.getElementById('isPublic').checked
  };

  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(profileData)
    });

    if (response.ok) {
      currentUser = await response.json();
      showToast('Profile updated successfully!');
    } else {
      showToast('Error updating profile', 'error');
    }
  } catch (error) {
    console.error('Error updating profile:', error);
    showToast('Error updating profile', 'error');
  }
}

// Save custom settings
async function saveCustomSettings(e) {
  if (e) e.preventDefault();

  const customSettings = {
    buttonColor: document.getElementById('buttonColor').value,
    textColor: document.getElementById('textColor').value,
    backgroundColor: document.getElementById('backgroundColor').value,
    buttonStyle: document.getElementById('buttonStyle').value,
    buttonAnimation: document.getElementById('buttonAnimation').value,
    glowEffect: document.getElementById('glowEffect').checked,
    blurBg: document.getElementById('blurBg').checked
  };

  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ customSettings })
    });

    if (response.ok) {
      currentUser = await response.json();
      showToast('Settings updated!');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
  }
}

// Toggle music settings
function toggleMusicSettings() {
  const enabled = document.getElementById('enableMusic').checked;
  document.getElementById('musicSettings').classList.toggle('hidden', !enabled);
}

// Change music source
function changeMusicSource() {
  const source = document.getElementById('musicSource').value;
  document.getElementById('uploadMusicContainer').classList.toggle('hidden', source === 'youtube');
  document.getElementById('youtubeContainer').classList.toggle('hidden', source !== 'youtube');
}

// Update volume display
function updateVolumeDisplay() {
  const volume = document.getElementById('volume').value;
  document.getElementById('volumeValue').textContent = volume + '%';
}

// Save music settings
async function saveMusicSettings(e) {
  e.preventDefault();

  const musicSettings = {
    enabled: document.getElementById('enableMusic').checked,
    musicTitle: document.getElementById('musicTitle').value,
    autoplay: document.getElementById('autoplay').checked,
    loop: document.getElementById('loop').checked,
    volume: document.getElementById('volume').value / 100
  };

  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ musicSettings })
    });

    if (response.ok) {
      currentUser = await response.json();
      showToast('Music settings saved!');
    }
  } catch (error) {
    console.error('Error saving music settings:', error);
    showToast('Error saving music settings', 'error');
  }
}

// Save settings
async function saveSettings(e) {
  e.preventDefault();

  const settingsData = {
    isPublic: document.getElementById('isPublic').checked
  };

  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(settingsData)
    });

    if (response.ok) {
      currentUser = await response.json();
      showToast('Settings updated!');
    }
  } catch (error) {
    console.error('Error saving settings:', error);
    showToast('Error saving settings', 'error');
  }
}

// Upload profile image
async function uploadProfileImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/api/upload/profile`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('profileImagePreview').src = data.url;
      
      // Update profile
      await fetch(`${API_BASE}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profileImage: data.url })
      });
      
      showToast('Profile image updated!');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Error uploading image', 'error');
  }
}

// Upload background image
async function uploadBackgroundImage(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/api/upload/background`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('backgroundImagePreview').src = data.url;

      await fetch(`${API_BASE}/api/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundImage: data.url })
      });

      showToast('Background image updated!');
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Error uploading image', 'error');
  }
}

// Upload music
async function uploadMusic(e) {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await fetch(`${API_BASE}/api/upload/music`, {
      method: 'POST',
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      document.getElementById('musicFileName').textContent = file.name;
      document.getElementById('musicFileName').dataset.url = data.url;
      showToast('Music uploaded!');
    }
  } catch (error) {
    console.error('Error uploading music:', error);
    showToast('Error uploading music', 'error');
  }
}

// Add link
async function addLink(e) {
  e.preventDefault();

  const linkData = {
    title: document.getElementById('linkTitle').value,
    url: document.getElementById('linkUrl').value,
    icon: document.getElementById('linkIcon').value || '🔗',
    color: document.getElementById('linkColor').value || '#6366f1'
  };

  try {
    const response = await fetch(`${API_BASE}/api/links`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(linkData)
    });

    if (response.ok) {
      const newLink = await response.json();
      currentUser.links.push(newLink);
      renderLinks();
      closeModal('linkModal');
      document.getElementById('linkForm').reset();
      document.getElementById('linkCount').textContent = currentUser.links.length;
      showToast('Link added successfully!');
    }
  } catch (error) {
    console.error('Error adding link:', error);
    showToast('Error adding link', 'error');
  }
}

// Delete link
async function deleteLink(linkId) {
  if (!confirm('Are you sure you want to delete this link?')) return;

  try {
    const response = await fetch(`${API_BASE}/api/links/${linkId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      currentUser.links = currentUser.links.filter(l => l.id !== linkId);
      renderLinks();
      document.getElementById('linkCount').textContent = currentUser.links.length;
      showToast('Link deleted!');
    }
  } catch (error) {
    console.error('Error deleting link:', error);
    showToast('Error deleting link', 'error');
  }
}

// Select theme
function selectTheme(theme) {
  currentUser.theme = theme;
  
  document.querySelectorAll('.preset-option').forEach(btn => {
    btn.classList.remove('active');
    if (btn.dataset.theme === theme) {
      btn.classList.add('active');
    }
  });

  saveTheme(theme);
}

// Save theme
async function saveTheme(theme) {
  try {
    await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ theme })
    });
  } catch (error) {
    console.error('Error saving theme:', error);
  }
}

// Copy profile link
function copyProfileLink() {
  const profileUrl = `${window.location.origin}/${currentUser.username}`;
  copyToClipboard(profileUrl);
}

// Share profile
function shareProfile() {
  const profileUrl = `${window.location.origin}/${currentUser.username}`;
  
  if (navigator.share) {
    navigator.share({
      title: `${currentUser.displayName}'s LinkTree`,
      url: profileUrl
    });
  } else {
    copyToClipboard(profileUrl);
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initDashboard);
