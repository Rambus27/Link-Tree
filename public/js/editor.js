// Editor JavaScript - Live preview functionality

let currentUser = null;
let previewMode = 'mobile';

// Initialize editor
async function initEditor() {
  currentUser = await getCurrentUser();
  if (!currentUser) {
    window.location.href = '/';
    return;
  }

  loadUserData();
  setupEventListeners();
  renderLivePreview();
}

// Load user data
function loadUserData() {
  // Load profile info
  document.getElementById('editorDisplayName').value = currentUser.displayName || '';
  document.getElementById('editorBio').value = currentUser.bio || '';

  // Load images
  if (currentUser.profileImage) {
    document.getElementById('editorProfileImagePreview').src = currentUser.profileImage;
  }
  if (currentUser.backgroundImage) {
    document.getElementById('editorBackgroundImagePreview').src = currentUser.backgroundImage;
  }

  // Load music settings
  const musicSettings = currentUser.musicSettings || {};
  document.getElementById('editorEnableMusic').checked = musicSettings.enabled || false;
  document.getElementById('editorMusicTitle').value = musicSettings.musicTitle || '';
  document.getElementById('editorAutoplay').checked = musicSettings.autoplay || false;
  document.getElementById('editorMusicLoop').checked = musicSettings.loop || true;
  document.getElementById('editorMusicVolume').value = musicSettings.volume * 100 || 50;

  // Load design settings
  const settings = currentUser.customSettings || {};
  document.getElementById('bgColor').value = currentUser.backgroundColor || '#0a0e27';
  document.getElementById('btnColor').value = settings.buttonColor || '#6366f1';
  document.getElementById('textColor').value = settings.textColor || '#ffffff';
  document.getElementById('btnStyle').value = settings.buttonStyle || 'rounded';
  document.getElementById('btnAnimation').value = settings.buttonAnimation || 'scale';
  document.getElementById('glowEffect').checked = settings.glowEffect || false;
  document.getElementById('blurBgToggle').checked = settings.blurBg || false;

  // Load links
  renderLinksList();
}

// Setup event listeners
function setupEventListeners() {
  // Tab switching
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', switchTab);
  });

  // Preview device switching
  document.querySelectorAll('.preview-device-btn').forEach(btn => {
    btn.addEventListener('click', switchPreviewDevice);
  });

  // Profile inputs - update preview on change
  document.getElementById('editorDisplayName')?.addEventListener('input', () => {
    renderLivePreview();
  });
  document.getElementById('editorBio')?.addEventListener('input', () => {
    renderLivePreview();
  });

  // Design inputs
  document.getElementById('bgType')?.addEventListener('change', handleBackgroundChange);
  document.getElementById('bgColor')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('btnColor')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('textColor')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('btnStyle')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('btnAnimation')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('glowEffect')?.addEventListener('change', () => {
    renderLivePreview();
  });
  document.getElementById('blurBgToggle')?.addEventListener('change', () => {
    renderLivePreview();
  });

  // Theme selection
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.addEventListener('click', selectThemePreset);
  });

  // Music
  document.getElementById('editorEnableMusic')?.addEventListener('change', toggleEditorMusicSettings);
  document.getElementById('uploadMusicBtn')?.addEventListener('click', () => {
    document.getElementById('musicInputEditor').click();
  });
  document.getElementById('musicInputEditor')?.addEventListener('change', uploadEditorMusic);

  // Upload images
  document.getElementById('uploadProfileImageBtn')?.addEventListener('click', () => {
    document.getElementById('profileImageInputEditor').click();
  });
  document.getElementById('uploadBackgroundImageBtn')?.addEventListener('click', () => {
    document.getElementById('backgroundImageInputEditor').click();
  });

  document.getElementById('profileImageInputEditor')?.addEventListener('change', uploadEditorProfileImage);
  document.getElementById('backgroundImageInputEditor')?.addEventListener('change', uploadEditorBackgroundImage);

  // Add link button
  document.getElementById('addNewLinkBtn')?.addEventListener('click', () => {
    openModal('addLinkModal');
  });

  // Link modal
  document.getElementById('closeAddLinkModal')?.addEventListener('click', () => {
    closeModal('addLinkModal');
  });
  document.getElementById('cancelAddLinkBtn')?.addEventListener('click', () => {
    closeModal('addLinkModal');
  });
  document.getElementById('addLinkFormModal')?.addEventListener('submit', addLinkEditor);

  // Save button
  document.getElementById('saveBtn')?.addEventListener('click', saveAllChanges);

  // Gradient presets
  document.querySelectorAll('.gradient-btn').forEach(btn => {
    btn.addEventListener('click', selectGradient);
  });

  // Close modal on backdrop
  document.getElementById('addLinkModal')?.addEventListener('click', (e) => {
    if (e.target.id === 'addLinkModal') {
      closeModal('addLinkModal');
    }
  });
}

// Switch tab
function switchTab(e) {
  const tab = e.target.dataset.tab;
  
  // Update active tab button
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tab);
  });

  // Show active pane
  document.querySelectorAll('.tab-pane').forEach(pane => {
    pane.classList.remove('active');
  });
  document.getElementById(`${tab}Tab`).classList.add('active');
}

// Switch preview device
function switchPreviewDevice(e) {
  const device = e.target.dataset.device;
  previewMode = device;

  document.querySelectorAll('.preview-device-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.device === device);
  });

  const container = document.getElementById('previewContainer');
  container.className = `preview-container ${device}`;
}

// Handle background change
function handleBackgroundChange() {
  const bgType = document.getElementById('bgType').value;
  document.getElementById('colorContainer')?.classList.toggle('hidden', bgType !== 'color');
  document.getElementById('gradientContainer')?.classList.toggle('hidden', bgType !== 'gradient');
  document.getElementById('imageContainer')?.classList.toggle('hidden', bgType !== 'image');
  renderLivePreview();
}

// Render links list
function renderLinksList() {
  const linksList = document.getElementById('linksList');
  const emptyState = document.getElementById('emptyState');

  linksList.innerHTML = '';

  if (currentUser.links.length === 0) {
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  currentUser.links.forEach((link, index) => {
    const div = document.createElement('div');
    div.className = 'editor-link-item';
    div.draggable = true;
    div.innerHTML = `
      <span class="editor-link-drag">⋮</span>
      <div class="editor-link-content">
        <div class="editor-link-title">${link.title}</div>
        <div class="editor-link-url">${link.url}</div>
      </div>
      <div class="editor-link-actions">
        <button type="button" class="editor-link-btn" onclick="editLinkEditor('${link.id}')">✏️</button>
        <button type="button" class="editor-link-btn" onclick="deleteLinkEditor('${link.id}')">🗑️</button>
      </div>
    `;

    div.addEventListener('dragstart', handleDragStart);
    div.addEventListener('dragend', handleDragEnd);
    div.addEventListener('dragover', handleDragOver);
    div.addEventListener('drop', handleDrop);

    linksList.appendChild(div);
  });
}

// Render live preview
function renderLivePreview() {
  const preview = document.getElementById('livePreview');
  const displayName = document.getElementById('editorDisplayName').value || currentUser.displayName || 'Profile';
  const bio = document.getElementById('editorBio').value || currentUser.bio || 'Your bio here';
  const profileImage = document.getElementById('editorProfileImagePreview').src ||  currentUser.profileImage || 'https://via.placeholder.com/100';

  const bgType = document.getElementById('bgType').value;
  let backgroundColor = document.getElementById('bgColor').value;

  const textColor = document.getElementById('textColor').value;
  const btnColor = document.getElementById('btnColor').value;
  const btnStyle = document.getElementById('btnStyle').value;
  const btnAnimation = document.getElementById('btnAnimation').value;
  const glowEffect = document.getElementById('glowEffect').checked;
  const blurBg = document.getElementById('blurBgToggle').checked;

  // Build background style
  let bgStyle = '';
  if (bgType === 'color') {
    bgStyle = `background-color: ${backgroundColor}`;
  } else if (bgType === 'gradient') {
    bgStyle = `background: linear-gradient(135deg, ${backgroundColor} 0%, #6366f1 100%)`;
  }

  preview.style.cssText = bgStyle + `; color: ${textColor};`;
  if (blurBg) {
    preview.style.backdropFilter = 'blur(10px)';
  }

  // Build links HTML
  let linksHtml = '';
  currentUser.links.forEach(link => {
    const linkColor = link.color || btnColor;
    const animationClass = btnAnimation !== 'none' ? `${btnAnimation}` : '';
    const glowClass = glowEffect ? 'glow-effect' : '';

    linksHtml += `
      <a href="${link.url}" class="preview-link ${btnStyle} ${animationClass} ${glowClass}" 
         style="background-color: ${linkColor}; color: ${textColor};"
         target="_blank" rel="noopener">
        <span>${link.icon || '🔗'} ${link.title}</span>
      </a>
    `;
  });

  preview.innerHTML = `
    <img src="${profileImage}" class="preview-profile-avatar" alt="Profile">
    <h3 class="preview-profile-name" style="color: ${textColor};">${displayName}</h3>
    <p class="preview-profile-bio" style="color: ${textColor};">${bio}</p>
    <div class="preview-links">
      ${linksHtml || '<p style="color: var(--text-muted);">No links yet</p>'}
    </div>
  `;

  // Add music player if enabled
  if (document.getElementById('editorEnableMusic').checked) {
    preview.innerHTML += `
      <div class="preview-music-player">
        <small style="color: var(--text-muted);">🎵 Music Player</small>
      </div>
    `;
  }
}

// Select theme preset  
function selectThemePreset(e) {
  const theme = e.target.dataset.theme;
  
  document.querySelectorAll('.theme-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');

  // Apply theme presets
  const presets = {
    neon: {
      bgColor: '#0a0e27',
      btnColor: '#ff0080',
      textColor: '#ffffff'
    },
    minimal: {
      bgColor: '#ffffff',
      btnColor: '#000000',
      textColor: '#000000'
    },
    gaming: {
      bgColor: '#0f3460',
      btnColor: '#00d4ff',
      textColor: '#ffffff'
    },
    anime: {
      bgColor: '#1a0033',
      btnColor: '#ff6b9d',
      textColor: '#ffffff'
    },
    darkglass: {
      bgColor: '#0a0e27',
      btnColor: '#6366f1',
      textColor: '#ffffff'
    },
    gradient: {
      bgColor: '#ff5f00',
      btnColor: '#ffd700',
      textColor: '#000000'
    },
    retro: {
      bgColor: '#ffb6c1',
      btnColor: '#a29bfe',
      textColor: '#000000'
    }
  };

  if (presets[theme]) {
    document.getElementById('bgColor').value = presets[theme].bgColor;
    document.getElementById('btnColor').value = presets[theme].btnColor;
    document.getElementById('textColor').value = presets[theme].textColor;
  }

  renderLivePreview();
}

// Select gradient
function selectGradient(e) {
  const gradient = e.target.dataset.gradient;
  document.querySelectorAll('.gradient-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  e.target.classList.add('active');
  renderLivePreview();
}

// Toggle editor music settings
function toggleEditorMusicSettings() {
  const enabled = document.getElementById('editorEnableMusic').checked;
  document.getElementById('editorMusicSettings').classList.toggle('hidden', !enabled);
  renderLivePreview();
}

// Upload editor profile image
async function uploadEditorProfileImage(e) {
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
      document.getElementById('editorProfileImagePreview').src = data.url;
      renderLivePreview();
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Error uploading image', 'error');
  }
}

// Upload editor background image
async function uploadEditorBackgroundImage(e) {
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
      document.getElementById('editorBackgroundImagePreview').src = data.url;
      currentUser.backgroundImage = data.url;
      renderLivePreview();
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    showToast('Error uploading image', 'error');
  }
}

// Upload editor music
async function uploadEditorMusic(e) {
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
      // Store for later
      document.getElementById('editorMusicUrl').value = data.url;
      showToast('Music uploaded!');
    }
  } catch (error) {
    console.error('Error uploading music:', error);
    showToast('Error uploading music', 'error');
  }
}

// Add link in editor
async function addLinkEditor(e) {
  e.preventDefault();

  const linkData = {
    title: document.getElementById('modalLinkTitle').value,
    url: document.getElementById('modalLinkUrl').value,
    icon: document.getElementById('modalLinkIcon').value || '🔗',
    color: document.getElementById('modalLinkColor').value || '#6366f1'
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
      renderLinksList();
      renderLivePreview();
      closeModal('addLinkModal');
      document.getElementById('addLinkFormModal').reset();
      showToast('Link added!');
    }
  } catch (error) {
    console.error('Error adding link:', error);
    showToast('Error adding link', 'error');
  }
}

// Delete link in editor
async function deleteLinkEditor(linkId) {
  try {
    const response = await fetch(`${API_BASE}/api/links/${linkId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      currentUser.links = currentUser.links.filter(l => l.id !== linkId);
      renderLinksList();
      renderLivePreview();
      showToast('Link deleted!');
    }
  } catch (error) {
    console.error('Error deleting link:', error);
    showToast('Error deleting link', 'error');
  }
}

// Edit link in editor
function editLinkEditor(linkId) {
  const link = currentUser.links.find(l => l.id === linkId);
  if (!link) return;

  document.getElementById('modalLinkTitle').value = link.title;
  document.getElementById('modalLinkUrl').value = link.url;
  document.getElementById('modalLinkIcon').value = link.icon;
  document.getElementById('modalLinkColor').value = link.color;
  document.getElementById('addLinkFormModal').dataset.linkId = linkId;

  openModal('addLinkModal');
}

// Drag and drop
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = this;
  this.style.opacity = '0.5';
}

function handleDragEnd(e) {
  this.style.opacity = '1';
  draggedElement = null;
}

function handleDragOver(e) {
  e.preventDefault();
  return false;
}

function handleDrop(e) {
  e.preventDefault();
  if (draggedElement !== this) {
    const container = document.getElementById('linksList');
    const allItems = Array.from(container.children);
    const draggedIndex = allItems.indexOf(draggedElement);
    const targetIndex = allItems.indexOf(this);

    if (draggedIndex < targetIndex) {
      this.parentNode.insertBefore(draggedElement, this.nextSibling);
    } else {
      this.parentNode.insertBefore(draggedElement, this);
    }

    // Reorder in currentUser.links
    const draggedLink = currentUser.links[draggedIndex];
    currentUser.links.splice(draggedIndex, 1);
    currentUser.links.splice(targetIndex, 0, draggedLink);

    renderLivePreview();
  }
  return false;
}

// Save all changes
async function saveAllChanges() {
  const customSettings = {
    buttonColor: document.getElementById('btnColor').value,
    textColor: document.getElementById('textColor').value,
    backgroundColor: document.getElementById('bgColor').value,
    buttonStyle: document.getElementById('btnStyle').value,
    buttonAnimation: document.getElementById('btnAnimation').value,
    glowEffect: document.getElementById('glowEffect').checked,
    blurBg: document.getElementById('blurBgToggle').checked
  };

  const profileImage = document.getElementById('editorProfileImagePreview').src;
  const backgroundImage = document.getElementById('editorBackgroundImagePreview').src;

  const musicSettings = {
    enabled: document.getElementById('editorEnableMusic').checked,
    musicTitle: document.getElementById('editorMusicTitle').value,
    autoplay: document.getElementById('editorAutoplay').checked,
    loop: document.getElementById('editorMusicLoop').checked,
    volume: document.getElementById('editorMusicVolume').value / 100
  };

  try {
    const response = await fetch(`${API_BASE}/api/profile`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        customSettings,
        profileImage,
        backgroundImage,
        musicSettings,
        displayName: document.getElementById('editorDisplayName').value,
        bio: document.getElementById('editorBio').value
      })
    });

    if (response.ok) {
      currentUser = await response.json();
      showToast('All changes saved!');
    }
  } catch (error) {
    console.error('Error saving changes:', error);
    showToast('Error saving changes', 'error');
  }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initEditor);
