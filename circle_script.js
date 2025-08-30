// Global variables
let uploadedImages = [];
let animationSpeed = 25;
let imageWidth = 300;
// (No RAF animation needed; CSS handles rotation)

// DOM elements
const imageUrlInput = document.getElementById("imageUrlInput");
const loadImageBtn = document.getElementById("loadImageBtn");
const errorMessage = document.getElementById("errorMessage");
const carouselContainer = document.getElementById("carouselContainer");
const rotationPreview = document.getElementById("rotationPreview");
const rotationImage = document.getElementById("rotationImage");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const widthInput = document.getElementById("widthInput");
// Drawer elements
const menuToggle = document.getElementById("menuToggle");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerClose = document.getElementById("drawerClose");

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Image URL input events
  loadImageBtn.addEventListener("click", loadImageFromUrl);
  
  imageUrlInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      loadImageFromUrl();
    }
  });

  imageUrlInput.addEventListener("input", () => {
    errorMessage.style.display = "none";
  });

  // Focus events for input styling
  imageUrlInput.addEventListener("focus", () => {
    imageUrlInput.closest(".text-field").classList.add("focused");
  });

  imageUrlInput.addEventListener("blur", () => {
    imageUrlInput.closest(".text-field").classList.remove("focused");
  });

  // Width input events
  widthInput.addEventListener("input", (e) => {
    imageWidth = parseInt(e.target.value) || 300;
    // Keep square preview and update embed
    updatePreviewSize();
    if (uploadedImages.length > 0) generateEmbedCode();
  });

  widthInput.addEventListener("focus", () => {
    widthInput.closest(".text-field").classList.add("focused");
  });

  widthInput.addEventListener("blur", () => {
    widthInput.closest(".text-field").classList.remove("focused");
  });

  // Speed slider events
  speedSlider.addEventListener("input", (e) => {
    animationSpeed = parseInt(e.target.value);
    updateSpeedLabel();
    updatePreviewSpeed();
    if (uploadedImages.length > 0) generateEmbedCode();
  });

  // Initialize
  updatePreview();
  updateSpeedLabel();
  setupDrawer();
});

// Load image from URL
function loadImageFromUrl() {
  const url = imageUrlInput.value.trim();

  if (!url) {
    showError("URLを入力してください");
    return;
  }

  if (!isValidUrl(url)) {
    showError("有効なURLを入力してください");
    return;
  }

  setLoadingState(true);
  errorMessage.style.display = "none";

  // Test image loading
  const img = new Image();
  img.crossOrigin = "anonymous";

  img.onload = () => {
    // Clear existing images
    uploadedImages = [];

    const imageData = {
      id: Date.now() + Math.random(),
      src: url,
      name: "URL画像",
    };
    uploadedImages.push(imageData);
    updatePreview();
    setLoadingState(false);
  };

  img.onerror = () => {
    showError("画像の読み込みに失敗しました。URLを確認してください。");
    setLoadingState(false);
  };

  img.src = url;
}

// Set loading state
function setLoadingState(loading) {
  loadImageBtn.disabled = loading;
  loadImageBtn.textContent = loading ? "読み込み中..." : "画像を読み込み";
  
  if (loading) {
    loadImageBtn.classList.add("loading");
  } else {
    loadImageBtn.classList.remove("loading");
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = "block";
}

// Validate URL
function isValidUrl(string) {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

// Update rotation preview
function updatePreview() {
  if (uploadedImages.length === 0) {
    carouselContainer.style.display = "none";
    document.getElementById("embedSection").style.display = "none";
    return;
  }

  const image = uploadedImages[0];
  rotationImage.src = image.src;
  updatePreviewSize();
  updatePreviewSpeed();
  carouselContainer.style.display = "block";
  generateEmbedCode();
}

function updatePreviewSize() {
  if (rotationPreview) {
    rotationPreview.style.width = imageWidth + "px";
    rotationPreview.style.height = imageWidth + "px";
  }
}

function updatePreviewSpeed() {
  const duration = (51 - animationSpeed) * 2000; // ms
  if (rotationPreview) {
    rotationPreview.style.setProperty("--duration", `${duration}ms`);
  }
}

// Drawer logic
function setupDrawer() {
  if (!menuToggle || !drawer || !drawerOverlay) return;

  const open = () => {
    drawer.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    drawerOverlay.hidden = false;
    // allow fade-in
    requestAnimationFrame(() => drawerOverlay.classList.add("open"));
    menuToggle.setAttribute("aria-expanded", "true");
  };

  const close = () => {
    drawer.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    drawerOverlay.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    // wait for transition end before hiding overlay
    setTimeout(() => { drawerOverlay.hidden = true; }, 200);
  };

  menuToggle.addEventListener("click", open);
  drawerOverlay.addEventListener("click", close);
  if (drawerClose) drawerClose.addEventListener("click", close);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") close();
  });

  // Close when a link inside drawer is clicked
  drawer.addEventListener("click", (e) => {
    const target = e.target;
    if (target && target.tagName === 'A') close();
  });
}

// Update speed label
function updateSpeedLabel() {
  let speedLabel;
  if (animationSpeed <= 5) speedLabel = "極めて遅い";
  else if (animationSpeed <= 10) speedLabel = "非常に遅い";
  else if (animationSpeed <= 15) speedLabel = "とても遅い";
  else if (animationSpeed <= 20) speedLabel = "遅い";
  else if (animationSpeed <= 25) speedLabel = "やや遅い";
  else if (animationSpeed <= 30) speedLabel = "普通";
  else if (animationSpeed <= 35) speedLabel = "やや速い";
  else if (animationSpeed <= 40) speedLabel = "速い";
  else if (animationSpeed <= 45) speedLabel = "非常に速い";
  else speedLabel = "極めて速い";

  speedValue.textContent = speedLabel;
}

// Generate embed code
function generateEmbedCode() {
  if (uploadedImages.length === 0) return;

  const image = uploadedImages[0];
  const duration = (51 - animationSpeed) * 2000; // ms

  const iframeCode = `<iframe width="${imageWidth}" height="${imageWidth}" style="border:0; overflow:hidden;" loading="lazy" referrerpolicy="no-referrer" srcdoc='<!DOCTYPE html><html><head><meta charset=\'utf-8\'><style>html,body{height:100%;margin:0;background:transparent} .wrap{width:100%;height:100%;display:flex;align-items:center;justify-content:center;overflow:hidden;background:transparent} img{width:100%;height:100%;object-fit:contain;transform-origin:center center;animation:spin ${duration}ms linear infinite}@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}</style></head><body><div class=\'wrap\'><img src=\'${image.src}\' alt=\'\'></div></body></html>'></iframe>`;

  document.getElementById("embedCode").textContent = iframeCode;
  document.getElementById("embedSection").style.display = "block";
}

// Copy embed code
function copyEmbedCode() {
  const embedCode = document.getElementById("embedCode").textContent;
  const copyBtn = document.getElementById("copyBtn");
  const originalText = copyBtn.textContent;
  
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(embedCode).then(() => {
      copyBtn.textContent = "コピー完了！";
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.textContent = originalText;
        copyBtn.classList.remove("copied");
      }, 2000);
    }).catch(() => {
      // Show error message
      copyBtn.textContent = "コピーに失敗しました";
      setTimeout(() => {
        copyBtn.textContent = originalText;
      }, 2000);
    });
  } else {
    // Fallback: Create a temporary text area for selection
    const textArea = document.createElement("textarea");
    textArea.value = embedCode;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    textArea.style.top = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      const successful = document.execCommand('copy');
      if (successful) {
        copyBtn.textContent = "コピー完了！";
        copyBtn.classList.add("copied");
      } else {
        copyBtn.textContent = "手動でコピーしてください";
      }
    } catch (err) {
      copyBtn.textContent = "手動でコピーしてください";
    }
    
    document.body.removeChild(textArea);
    
    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove("copied");
    }, 2000);
  }
}

// (Removed slider-based RAF animation; replaced with CSS rotation)
