// Global variables
let animationSpeed = 25; // 1(slowest) - 50(fastest)
let pauseMs = 100; // default pause between cycles
let lineThickness = 2; // px
let lineLength = 100; // px
let lineColor = "#000000"; // hex
// CSS animation replaced by inline SVG <animate>

// DOM elements
const carouselContainer = document.getElementById("carouselContainer");
const rotationPreview = document.getElementById("rotationPreview");
const lineMask = document.getElementById("lineMask");
const pauseInput = document.getElementById("pauseInput");
const speedSlider = document.getElementById("speedSlider");
const speedValue = document.getElementById("speedValue");
const thicknessInput = document.getElementById("thicknessInput");
const lengthInput = document.getElementById("lengthInput");
const colorInput = document.getElementById("colorInput");
// Drawer elements
const menuToggle = document.getElementById("menuToggle");
const drawer = document.getElementById("drawer");
const drawerOverlay = document.getElementById("drawerOverlay");
const drawerClose = document.getElementById("drawerClose");

// Event listeners
document.addEventListener("DOMContentLoaded", function() {
  // Speed slider events
  speedSlider.addEventListener("input", (e) => {
    animationSpeed = parseInt(e.target.value);
    updateSpeedLabel();
    updatePreviewSpeed();
    generateEmbedCode();
  });

  // Pause input events
  if (pauseInput) {
    pauseInput.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      if (!Number.isNaN(val)) {
        pauseMs = Math.max(0, Math.min(5000, val));
        // Normalize input box value if clamped
        if (pauseMs !== val) pauseInput.value = String(pauseMs);
        // Update preview SVG to reflect new hold duration
        renderPreviewSvg();
        generateEmbedCode();
      }
    });
    pauseInput.addEventListener("focus", () => {
      pauseInput.closest(".text-field")?.classList.add("focused");
    });
    pauseInput.addEventListener("blur", () => {
      pauseInput.closest(".text-field")?.classList.remove("focused");
    });
  }

  // Thickness input
  if (thicknessInput) {
    thicknessInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (!Number.isNaN(val)) {
        lineThickness = Math.max(0.5, Math.min(1000, val));
        if (lineThickness !== val) thicknessInput.value = String(lineThickness);
        updatePreviewSize();
        renderPreviewSvg();
        generateEmbedCode();
      }
    });
  }

  // Length input
  if (lengthInput) {
    lengthInput.addEventListener("input", (e) => {
      const val = parseFloat(e.target.value);
      if (!Number.isNaN(val)) {
        lineLength = Math.max(1, Math.min(1000, Math.round(val)));
        if (lineLength !== val) lengthInput.value = String(lineLength);
        updatePreviewSize();
        renderPreviewSvg();
        generateEmbedCode();
      }
    });
  }

  // Color input
  if (colorInput) {
    colorInput.addEventListener("input", (e) => {
      const val = String(e.target.value).trim();
      if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(val)) {
        lineColor = val;
        renderPreviewSvg();
        generateEmbedCode();
      }
    });
  }

  // Initialize
  updatePreview();
  updateSpeedLabel();
  setupDrawer();
});

// Update preview
function updatePreview() {
  updatePreviewSize();
  renderPreviewSvg();
  carouselContainer.style.display = "block";
  generateEmbedCode();
}

function updatePreviewSize() {
  if (!rotationPreview) return;
  rotationPreview.style.width = `${lineThickness}px`;
  rotationPreview.style.height = `${lineLength}px`;
}

function updatePreviewSpeed() {
  renderPreviewSvg();
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
  // Shift categories so that previous "やや遅い"(≈25) becomes new "極めて遅い"
  if (animationSpeed <= 25) speedLabel = "極めて遅い";
  else if (animationSpeed <= 30) speedLabel = "非常に遅い";
  else if (animationSpeed <= 35) speedLabel = "とても遅い";
  else if (animationSpeed <= 40) speedLabel = "遅い";
  else if (animationSpeed <= 45) speedLabel = "やや遅い";
  else if (animationSpeed <= 47) speedLabel = "普通";
  else if (animationSpeed <= 48) speedLabel = "やや速い";
  else if (animationSpeed <= 49) speedLabel = "速い";
  else speedLabel = "非常に速い"; // 50

  speedValue.textContent = speedLabel;
}

// Generate embed code
function generateEmbedCode() {
  const duration = Math.round(((51 - animationSpeed) * 2000) / 6); // 6x faster total
  const displayWidth = lineThickness; // px
  const displayHeight = lineLength; // px
  // HTML attributes must be integers; style can carry the precise px
  const attrW = Math.max(1, Math.round(displayWidth));
  const attrH = Math.max(1, Math.round(displayHeight));

  // Build an SVG-based animation similar to the working sample
  const base = duration; // ms for shrink phase
  const pause = Math.max(0, pauseMs|0);
  const total = base + pause; // ms total cycle
  const holdFrac = Math.max(0, Math.min(1, base / total));
  const durSec = (total / 1000).toFixed(3);
  const keyTimes = `0;${holdFrac.toFixed(3)};1`;
  const iframeCode = `<iframe width="${attrW}" height="${attrH}" style="border:0; overflow:hidden; display:block; width:${displayWidth}px; height:${displayHeight}px;" loading="lazy" referrerpolicy="no-referrer" srcdoc="<!DOCTYPE html><html><head><meta charset='utf-8'></head><body style='margin:0;background:transparent'><svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 ${lineThickness} ${lineLength}' preserveAspectRatio='xMidYMax meet'><rect x='0' y='0' width='${lineThickness}' height='${lineLength}' fill='${lineColor}'><animate attributeName='height' values='${lineLength};0;0' keyTimes='${keyTimes}' dur='${durSec}s' repeatCount='indefinite' /><animate attributeName='y' values='0;${lineLength};${lineLength}' keyTimes='${keyTimes}' dur='${durSec}s' repeatCount='indefinite' /></rect></svg></body></html>"></iframe>`;

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

// Mask animation control: run one cycle, then wait pauseMs, then restart
function renderPreviewSvg() {
  if (!lineMask) return;
  const duration = Math.round(((51 - animationSpeed) * 2000) / 6); // ms
  const base = duration;
  const pause = Math.max(0, pauseMs|0);
  const total = base + pause;
  const holdFrac = Math.max(0, Math.min(1, base / total));
  const durSec = (total / 1000).toFixed(3);
  const keyTimes = `0;${holdFrac.toFixed(3)};1`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 ${lineThickness} ${lineLength}" preserveAspectRatio="xMidYMax meet"><rect x="0" y="0" width="${lineThickness}" height="${lineLength}" fill="${lineColor}"><animate attributeName="height" values="${lineLength};0;0" keyTimes="${keyTimes}" dur="${durSec}s" repeatCount="indefinite" /><animate attributeName="y" values="0;${lineLength};${lineLength}" keyTimes="${keyTimes}" dur="${durSec}s" repeatCount="indefinite" /></rect></svg>`;
  lineMask.innerHTML = svg;
}

// (SVG SMIL drives the animation; CSS removed. Preview auto-regenerates on changes.)
