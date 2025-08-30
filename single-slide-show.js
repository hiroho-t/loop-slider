// Global variables
let images = [];
let maxImages = 6;
let currentInterval = 2000; // Default interval in ms
let currentTransition = 600; // Default transition duration in ms

// DOM elements
const imageUrlInput = document.getElementById('imageUrlInput');
const addImageBtn = document.getElementById('addImageBtn');
const imageList = document.getElementById('imageList');
const carouselContainer = document.getElementById('carouselContainer');
const embedSection = document.getElementById('embedSection');
const errorMessage = document.getElementById('errorMessage');
const rotationPreview = document.getElementById('rotationPreview');
const settingsPanel = document.getElementById('settingsPanel');
const intervalInput = document.getElementById('intervalInput');
const transitionInput = document.getElementById('transitionInput');

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  setupEventListeners();
  updateImageList();
});

// Event listeners
function setupEventListeners() {
  addImageBtn.addEventListener('click', handleAddImage);
  imageUrlInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddImage();
    }
  });
  intervalInput.addEventListener('input', handleIntervalChange);
  transitionInput.addEventListener('input', handleTransitionChange);
}

// Handle adding image by URL
function handleAddImage() {
  const url = imageUrlInput.value.trim();

  if (!url) {
    showError('画像URLを入力してください。');
    return;
  }

  if (images.length >= maxImages) {
    showError(`最大${maxImages}枚まで追加できます。`);
    return;
  }

  // Basic URL validation
  if (!isValidImageUrl(url)) {
    showError('有効な画像URLを入力してください。');
    return;
  }

  // Check if URL already exists
  if (images.some((img) => img.url === url)) {
    showError('この画像は既に追加されています。');
    return;
  }

  const imageData = {
    id: Date.now() + Math.random(),
    name: extractFilenameFromUrl(url) || `image-${images.length + 1}`,
    url: url,
  };

  // Test if image loads successfully
  const testImg = new Image();
  testImg.onload = function () {
    images.push(imageData);
    updateImageList();
    updatePreview();
    clearError();
    imageUrlInput.value = '';
  };

  testImg.onerror = function () {
    showError('画像の読み込みに失敗しました。URLを確認してください。');
  };

  testImg.src = url;
}

// Validate image URL
function isValidImageUrl(url) {
  try {
    new URL(url);
    return /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(url) || url.includes('image');
  } catch {
    return false;
  }
}

// Extract filename from URL
function extractFilenameFromUrl(url) {
  try {
    const pathname = new URL(url).pathname;
    let filename = pathname.split('/').pop();

    // If no filename found or it's too generic, create a descriptive name
    if (!filename || filename.length < 3 || !filename.includes('.')) {
      // Try to get domain name for better description
      const hostname = new URL(url).hostname;
      const domain = hostname.replace('www.', '').split('.')[0];
      filename = `${domain}-image`;
    }

    // Remove file extension for display and limit length
    const nameWithoutExt = filename.replace(/\.[^/.]+$/, '');
    return nameWithoutExt.length > 30 ? nameWithoutExt.substring(0, 30) + '...' : nameWithoutExt;
  } catch {
    return 'image';
  }
}

// Update image list display
function updateImageList() {
  if (images.length === 0) {
    imageList.innerHTML = '';
    return;
  }

  imageList.innerHTML = images
    .map(
      (image) => `
    <div class="image-item" data-id="${image.id}">
      <img src="${image.url}" alt="${image.name}" class="image-preview" loading="lazy">
      <button class="delete-btn" data-image-id="${image.id}">×</button>
    </div>
  `
    )
    .join('');

  // Add delete button event listeners
  setupDeleteButtons();
}

// Setup delete button event listeners
function setupDeleteButtons() {
  const deleteButtons = document.querySelectorAll('.delete-btn');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', function (e) {
      e.stopPropagation();
      e.preventDefault();
      const imageId = this.getAttribute('data-image-id');
      deleteImage(imageId);
    });
  });
}

// Delete image
function deleteImage(imageId) {
  // Convert imageId to string for comparison since data attributes are always strings
  images = images.filter((img) => String(img.id) !== String(imageId));

  updateImageList();
  updatePreview();

  if (images.length === 0) {
    hidePreview();
  }
}

// Update preview
function updatePreview() {
  if (images.length === 0) {
    hidePreview();
    hideSettings();
    return;
  }

  // Show preview only when there are 2 or more images
  if (images.length >= 2) {
    showPreview();
    showSettings();
    createSlideshowPreview();
    generateEmbedCode();
  } else {
    hidePreview();
    hideSettings();
  }
}

// Create slideshow preview
function createSlideshowPreview() {
  rotationPreview.innerHTML = `
    <div class="slideshow-container" style="width: 100vw; height: 100dvh; position: relative; overflow: hidden;">
      ${images
        .map(
          (image, index) => `
        <img src="${image.url}" 
             class="slide" 
             style="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: ${
               index === 0 ? 1 : 0
             }; transition: opacity ${currentTransition}ms ease-in-out;" 
             data-index="${index}">
      `
        )
        .join('')}
    </div>
  `;

  // Start slideshow animation
  startSlideshow();
}

// Start slideshow animation
function startSlideshow() {
  if (images.length <= 1) return;

  const slides = rotationPreview.querySelectorAll('.slide');
  let currentSlide = 0;

  // Clear any existing interval
  if (window.slideshowInterval) {
    clearInterval(window.slideshowInterval);
  }

  // Start new slideshow with custom interval + transition time
  window.slideshowInterval = setInterval(() => {
    slides[currentSlide].style.opacity = '0';
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].style.opacity = '1';
  }, currentInterval + currentTransition);
}

// Show preview
function showPreview() {
  carouselContainer.style.display = 'block';
  embedSection.style.display = 'block';
}

// Hide preview
function hidePreview() {
  carouselContainer.style.display = 'none';
  embedSection.style.display = 'none';
}

// Show settings
function showSettings() {
  settingsPanel.style.display = 'flex';
}

// Hide settings
function hideSettings() {
  settingsPanel.style.display = 'none';
}

// Handle interval change
function handleIntervalChange(e) {
  currentInterval = parseInt(e.target.value);
  updatePreview();
}

// Handle transition change
function handleTransitionChange(e) {
  currentTransition = parseInt(e.target.value);
  // Update existing slides transition duration
  const slides = rotationPreview.querySelectorAll('.slide');
  slides.forEach((slide) => {
    slide.style.transition = `opacity ${currentTransition}ms ease-in-out`;
  });
  updatePreview();
}

// Generate embed code
function generateEmbedCode() {
  if (images.length === 0) return;

  const embedCode = createIframeCode();
  document.getElementById('embedCode').textContent = embedCode;
}

// Create iframe code
function createIframeCode() {
  const imagesHtml = images
    .map(
      (img, index) =>
        `<img src="${
          img.url
        }" style="position: absolute; width: 100%; height: 100%; object-fit: cover; opacity: ${
          index === 0 ? 1 : 0
        }; transition: opacity ${currentTransition}ms ease-in-out;" alt="スライド${index + 1}">`
    )
    .join('');

  return `<div style="width: 100vw; height: 100dvh; position: relative; overflow: hidden;">
  ${imagesHtml}
  <script>
    (function() {
      const slides = document.currentScript.parentElement.querySelectorAll('img');
      let currentSlide = 0;
      if (slides.length > 1) {
        setInterval(() => {
          slides[currentSlide].style.opacity = '0';
          currentSlide = (currentSlide + 1) % slides.length;
          slides[currentSlide].style.opacity = '1';
        }, ${currentInterval + currentTransition});
      }
    })();
  </script>
</div>`;
}

// Copy embed code
function copyEmbedCode() {
  const embedCodeElement = document.getElementById('embedCode');
  const textArea = document.createElement('textarea');
  textArea.value = embedCodeElement.textContent;
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand('copy');
  document.body.removeChild(textArea);

  const copyBtn = document.getElementById('copyBtn');
  const originalText = copyBtn.textContent;
  copyBtn.textContent = 'コピーしました！';
  copyBtn.classList.add('copied');

  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.classList.remove('copied');
  }, 2000);
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
}

// Clear error message
function clearError() {
  errorMessage.style.display = 'none';
  errorMessage.textContent = '';
}

// Drawer functionality (keeping from original)
document.addEventListener('DOMContentLoaded', function () {
  const menuToggle = document.getElementById('menuToggle');
  const drawer = document.getElementById('drawer');
  const drawerOverlay = document.getElementById('drawerOverlay');
  const drawerClose = document.getElementById('drawerClose');

  function openDrawer() {
    drawer.classList.add('open');
    drawerOverlay.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.hidden = false;
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('open');
    drawerOverlay.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.hidden = true;
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  menuToggle.addEventListener('click', openDrawer);
  drawerClose.addEventListener('click', closeDrawer);
  drawerOverlay.addEventListener('click', closeDrawer);

  // Close drawer on Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
});
