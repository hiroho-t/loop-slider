// Global variables
let uploadedImages = [];
let animationSpeed = 25;
let imageWidth = 300;
let animationId;
let startTime;
let currentPosition = 0;

// DOM elements
const imageUrlInput = document.getElementById("imageUrlInput");
const loadImageBtn = document.getElementById("loadImageBtn");
const errorMessage = document.getElementById("errorMessage");
const carouselTrack = document.getElementById("carouselTrack");
const carouselContainer = document.getElementById("carouselContainer");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const widthInput = document.getElementById("widthInput");

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
    if (uploadedImages.length > 0) {
      updateCarouselWidth();
      generateEmbedCode();
    }
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
    console.log("Speed changed to:", animationSpeed); // Debug
    updateSpeedLabel();
    if (uploadedImages.length > 0) {
      startAnimation();
      generateEmbedCode();
    }
  });

  // Initialize
  updateCarousel();
  updateSpeedLabel();
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
    updateCarousel();
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

// Update carousel
function updateCarousel() {
  if (uploadedImages.length === 0) {
    carouselContainer.style.display = "none";
    stopAnimation();
    document.getElementById("embedSection").style.display = "none";
    return;
  }

  // Show carousel area
  carouselContainer.style.display = "block";

  // Repeat images for smooth loop
  let carouselHTML = "";
  const repeatCount = 20;

  for (let i = 0; i < repeatCount; i++) {
    uploadedImages.forEach((image) => {
      carouselHTML += `
        <div class="carousel-item" style="background-image: url('${image.src}'); width: ${imageWidth}px;"></div>
      `;
    });
  }

  carouselTrack.innerHTML = carouselHTML;
  startAnimation();
  generateEmbedCode();
}

// Update carousel width
function updateCarouselWidth() {
  const items = carouselTrack.querySelectorAll(".carousel-item");
  items.forEach((item) => {
    item.style.width = imageWidth + "px";
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
  const duration = (51 - animationSpeed) * 2000;

  const embedHTML = `<!DOCTYPE html>
<html>
<head>
<style>
:root { --image-url: url('${image.src}'); }
* { margin: 0; padding: 0; box-sizing: border-box; }
body { background: transparent; height: 100vh; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.carousel { background: transparent; height: 300px; width: 100vw; display: flex; align-items: center; overflow: hidden; }
.track { display: flex; height: 220px; animation: slide ${duration}ms linear infinite; }
.item { flex-shrink: 0; height: 100%; margin: 0; width: ${imageWidth}px; background-image: var(--image-url); background-size: contain; background-repeat: no-repeat; background-position: center; }
@keyframes slide { 0% { transform: translateX(0); } 100% { transform: translateX(-${imageWidth}px); } }
</style>
</head>
<body>
<div class="carousel">
<div class="track">${Array(20).fill(`<div class="item"></div>`).join("")}</div>
</div>
</body>
</html>`;

  document.getElementById("embedCode").textContent = embedHTML;
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

// Start animation
function startAnimation() {
  stopAnimation();

  const items = carouselTrack.children;
  if (items.length === 0) return;

  const singleItemWidth = imageWidth;
  startTime = performance.now();

  function animate(currentTime) {
    if (!startTime) startTime = currentTime;

    const duration = (51 - animationSpeed) * 2000;
    const elapsed = currentTime - startTime;
    const progress = (elapsed % duration) / duration;

    currentPosition = -progress * singleItemWidth;
    carouselTrack.style.transform = `translateX(${currentPosition}px)`;

    animationId = requestAnimationFrame(animate);
  }

  animationId = requestAnimationFrame(animate);
}

// Stop animation
function stopAnimation() {
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }
}