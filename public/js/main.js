// Main JavaScript - Shared utilities

// API Base URL
const API_BASE = window.location.origin;

// Get current user
async function getCurrentUser() {
  try {
    const response = await fetch(`${API_BASE}/api/user`);
    if (response.ok) {
      return await response.json();
    }
    return null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
}

// Logout
function logout() {
  window.location.href = '/logout';
}

// Load user avatar in navbar
async function loadUserAvatar() {
  const user = await getCurrentUser();
  if (user) {
    const userAvatarContainer = document.getElementById('userAvatar');
    if (userAvatarContainer) {
      const img = document.createElement('img');
      img.src = user.avatar || 'https://via.placeholder.com/40';
      img.alt = user.username;
      userAvatarContainer.innerHTML = '';
      userAvatarContainer.appendChild(img);
    }

    // Set profile link
    const profileLink = document.getElementById('profileLink');
    if (profileLink) {
      profileLink.href = `/${user.username}`;
    }
  }
}

// Logout button handler
document.addEventListener('DOMContentLoaded', () => {
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', logout);
  }

  loadUserAvatar();
});

// Show toast notification
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.classList.add('show');
  }, 10);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 3000);
}

// Add toast styles
const style = document.createElement('style');
style.textContent = `
  .toast {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: var(--success);
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 0.5rem;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    opacity: 0;
    transition: all 0.3s ease;
    z-index: 9999;
  }

  .toast.show {
    opacity: 1;
  }

  .toast-error {
    background: var(--error);
  }

  .toast-warning {
    background: var(--warning);
  }

  .toast-info {
    background: var(--primary);
  }
`;
document.head.appendChild(style);

// Copy to clipboard
function copyToClipboard(text) {
  navigator.clipboard.writeText(text).then(() => {
    showToast('Copied to clipboard!');
  }).catch(err => {
    console.error('Failed to copy:', err);
    showToast('Failed to copy', 'error');
  });
}

// Format URL
function formatUrl(url) {
  return url.startsWith('http') ? url : `https://${url}`;
}

// Generate random color
function getRandomColor() {
  const colors = ['#6366f1', '#8b5cf6', '#ec4899', '#f97316', '#eab308', '#10b981', '#06b6d4', '#0ea5e9'];
  return colors[Math.floor(Math.random() * colors.length)];
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Modal functions
function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.add('visible');
  }
}

function closeModal(modalId) {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('visible');
  }
}

// Export functions
window.copyToClipboard = copyToClipboard;
window.formatUrl = formatUrl;
window.getRandomColor = getRandomColor;
window.showToast = showToast;
window.openModal = openModal;
window.closeModal = closeModal;
window.debounce = debounce;
window.getCurrentUser = getCurrentUser;
window.logout = logout;
