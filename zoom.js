// Global variables
let uploadedImages = [];

// DOM elements
const imageUrlInput = document.getElementById('imageUrlInput');
const addImageBtn = document.getElementById('addImageBtn');
const errorMessage = document.getElementById('errorMessage');
const carouselContainer = document.getElementById('carouselContainer');
const rotationPreview = document.getElementById('rotationPreview');

// Drawer elements
const menuToggle = document.getElementById('menuToggle');
const drawer = document.getElementById('drawer');
const drawerOverlay = document.getElementById('drawerOverlay');
const drawerClose = document.getElementById('drawerClose');

// Swiper instance
let swiper = null;

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
  setupInputs();
  setupDrawer();
});

function setupInputs() {
  // Image URL input events
  addImageBtn.addEventListener('click', loadImageFromUrl);

  imageUrlInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      loadImageFromUrl();
    }
  });

  imageUrlInput.addEventListener('input', () => {
    errorMessage.style.display = 'none';
  });

  // Focus events for input styling
  imageUrlInput.addEventListener('focus', () => {
    imageUrlInput.closest('.text-field').classList.add('focused');
  });

  imageUrlInput.addEventListener('blur', () => {
    imageUrlInput.closest('.text-field').classList.remove('focused');
  });
}

// Load image from URL
function loadImageFromUrl() {
  const url = imageUrlInput.value.trim();

  if (!url) {
    showError('URLを入力してください');
    return;
  }

  if (!isValidUrl(url)) {
    showError('有効なURLを入力してください');
    return;
  }

  if (uploadedImages.length >= 6) {
    showError('最大6枚まで追加できます');
    return;
  }

  setLoadingState(true);
  errorMessage.style.display = 'none';

  // Test image loading
  const img = new Image();
  img.crossOrigin = 'anonymous';

  img.onload = () => {
    const imageData = {
      id: Date.now() + Math.random(),
      src: url,
      name: 'URL画像',
    };
    uploadedImages.push(imageData);
    updateImageList();
    buildPreview();
    generateEmbedCode();
    setLoadingState(false);
    imageUrlInput.value = '';
  };

  img.onerror = () => {
    showError('画像の読み込みに失敗しました。URLを確認してください。');
    setLoadingState(false);
  };

  img.src = url;
}

// Set loading state
function setLoadingState(loading) {
  addImageBtn.disabled = loading;
  addImageBtn.textContent = loading ? '読み込み中...' : '画像を追加';

  if (loading) {
    addImageBtn.classList.add('loading');
  } else {
    addImageBtn.classList.remove('loading');
  }
}

// Show error message
function showError(message) {
  errorMessage.textContent = message;
  errorMessage.style.display = 'block';
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

// Update image list
function updateImageList() {
  const imageList = document.getElementById('imageList');
  if (uploadedImages.length === 0) {
    imageList.innerHTML = '';
    return;
  }

  imageList.innerHTML = uploadedImages
    .map(
      (img, index) => `
        <div class="image-item" data-id="${img.id}">
        <img class="image-preview" src="${img.src}" alt="image-${index + 1}">
          <button class="delete-btn" type="button" aria-label="削除" data-id="${img.id}">×</button>
        </div>
      `
    )
    .join('');

  // Wire delete buttons
  imageList.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      uploadedImages = uploadedImages.filter((img) => String(img.id) !== String(id));
      updateImageList();
      buildPreview();
      generateEmbedCode();
    });
  });
}

// Build preview using vanilla JavaScript (same logic as iframe)
function buildPreview() {
  if (uploadedImages.length < 3) {
    carouselContainer.style.display = 'none';
    document.getElementById('embedSection').style.display = 'none';
    return;
  }

  // Show carousel area
  carouselContainer.style.display = 'block';
  document.getElementById('embedSection').style.display = 'block';

  const originalCount = uploadedImages.length;

  // Create duplicates exactly like iframe
  const duplicatesHtml = uploadedImages
    .map(
      (image, index) =>
        `      <div class="swiper-slide-like swiper-slide-duplicate" data-original-index="${index}">
        <img src="${image.src}" alt="スライド${index + 1}" />
        </div>`
    )
    .join('\n');

  const originalSlidesHtml = uploadedImages
    .map(
      (image, index) =>
        `      <div class="swiper-slide-like" data-original-index="${index}">
        <img src="${image.src}" alt="スライド${index + 1}" />
      </div>`
    )
    .join('\n');

  rotationPreview.innerHTML = `
    <div class="swiper-like">
      <div class="swiper-wrapper-like">
${duplicatesHtml}
${originalSlidesHtml}
${duplicatesHtml}
      </div>
    </div>
    <style>
      .swiper-like { width: 100%; overflow: hidden; position: relative; }
      .swiper-wrapper-like { display: flex; align-items: center; height: 100%; will-change: transform; transition: none; gap: 0; }
      .swiper-slide-like { flex-shrink: 0; width: 71.43vw; display: flex; align-items: center; justify-content: center; position: relative; margin: 0 1.5vw; }
      .swiper-slide-like img { 
        width: 100%; 
        height: auto; 
        transform: scale(0.85); 
        transition: none; /* 初期状態ではtransitionを無効化 */
      }
      .swiper-slide-active img { 
        transform: scale(1); 
        transition: none; /* 初期状態ではtransitionを無効化 */
      }
      .swiper-slide-prev img, .swiper-slide-next img, 
      .swiper-slide-duplicate-prev img, .swiper-slide-duplicate-next img { 
        transform: scale(0.85); 
        transition: none; /* 初期状態ではtransitionを無効化 */
      }
    </style>
  `;

  // Initialize vanilla JavaScript carousel (same logic as iframe)
  const wrapper = rotationPreview.querySelector('.swiper-wrapper-like');
  let slides = Array.from(rotationPreview.querySelectorAll('.swiper-slide-like'));
  const slideWidth = wrapper.parentElement.clientWidth / 1.4 + (3 * wrapper.parentElement.clientWidth) / 100; // スライド幅 + margin(1.5vw * 2)
  let currentIndex = originalCount;
  let isAnimating = false;

  if (originalCount === 0) return;

  function updateSlides(animate = true) {
    slides.forEach((slide) => {
      slide.classList.remove(
        'swiper-slide-active',
        'swiper-slide-prev',
        'swiper-slide-next',
        'swiper-slide-duplicate-prev',
        'swiper-slide-duplicate-next'
      );
    });

    const activeSlide = slides[currentIndex];
    const prevSlide = slides[currentIndex - 1];
    const nextSlide = slides[currentIndex + 1];

    if (activeSlide) activeSlide.classList.add('swiper-slide-active');
    if (prevSlide) prevSlide.classList.add('swiper-slide-prev');
    if (nextSlide) nextSlide.classList.add('swiper-slide-next');

    const containerWidth = wrapper.parentElement.clientWidth;
    
    // コンテナ幅が0の場合は処理を停止
    if (containerWidth === 0) {
      return;
    }
    
    const slideOffset = (containerWidth - slideWidth) / 2;
    const translateX = slideOffset - currentIndex * slideWidth;

    // アニメーション制御
    if (!animate) {
      // 初期表示時：transitionを無効化して瞬間的に位置設定
      wrapper.style.transition = 'none';
      wrapper.style.transform = 'translateX(' + translateX + 'px)';
      
      // 次フレームでtransitionを復活（ブラウザの再描画を待つ）
      requestAnimationFrame(() => {
        wrapper.style.transition = 'transform 3000ms ease';
      });
    } else {
      // 通常のアニメーション
      wrapper.style.transform = 'translateX(' + translateX + 'px)';
    }

  }

  function nextSlide() {
    if (isAnimating) return;
    
    // コンテナ幅チェック - 0の場合はスキップ
    const containerWidth = wrapper.parentElement.clientWidth;
    if (containerWidth === 0) {
      return;
    }
    
    isAnimating = true;
    currentIndex++;

    if (currentIndex >= originalCount * 2) {
      updateSlides(true);
      setTimeout(function () {
        // ループ拡張前にも幅をチェック
        const extendContainerWidth = wrapper.parentElement.clientWidth;
        if (extendContainerWidth === 0) {
          isAnimating = false;
          return;
        }
        
        // 新しいアプローチ：リセットせずにDOMを動的に拡張
        // 最後に到達したら、新しい複製スライドを後ろに追加
        const newSlides = uploadedImages
          .map((image, index) => {
            const slideDiv = document.createElement('div');
            slideDiv.className = 'swiper-slide-like';
            slideDiv.setAttribute('data-original-index', index.toString());
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = 'スライド' + (index + 1);
            slideDiv.appendChild(img);
            
            return slideDiv;
          });
        
        // 新しいスライドをwrapperの最後に追加
        newSlides.forEach((slide, index) => {
          wrapper.appendChild(slide);
        });
        
        // slides配列を更新
        slides = Array.from(wrapper.querySelectorAll('.swiper-slide-like'));
        
        // 現在のインデックスはそのまま、アニメーション続行
        isAnimating = false;
      }, 3000);
    } else {
      updateSlides(true);
      setTimeout(function () {
        isAnimating = false;
      }, 3000);
    }
  }

  // 初期位置を瞬間設定（アニメーションなし）
  updateSlides(false);
  
  // 1秒後にCSSトランジションを有効化
  setTimeout(() => {
    console.log('🎨 [Preview] Enabling transitions for', rotationPreview.querySelectorAll('.swiper-slide-like img').length, 'images');
    const allImages = rotationPreview.querySelectorAll('.swiper-slide-like img');
    allImages.forEach(img => {
      img.style.transition = 'transform 3000ms ease';
    });
  }, 1000);
  
  setInterval(nextSlide, 3000);

  // Handle visibility change (tab switching)
  document.addEventListener('visibilitychange', () => {
    if (!document.hidden) {
      // タブが再表示された時に、トランジションを再設定
      console.log('🔄 [Preview] Tab visible again - checking transitions');
      setTimeout(() => {
        const allImages = rotationPreview.querySelectorAll('.swiper-slide-like img');
        let needsReactivation = false;
        
        allImages.forEach(img => {
          const currentTransition = window.getComputedStyle(img).transition;
          if (!currentTransition.includes('transform') || currentTransition === 'all 0s ease 0s') {
            console.log('⚠️ [Preview] Found image without transition, reactivating');
            needsReactivation = true;
          }
        });
        
        if (needsReactivation) {
          console.log('🔧 [Preview] Reactivating transitions for', allImages.length, 'images');
          allImages.forEach(img => {
            img.style.transition = 'transform 3000ms ease';
          });
        }
      }, 100);
    }
  });

  // Handle resize
  window.addEventListener('resize', function () {
    const newSlideWidth = wrapper.parentElement.clientWidth / 1.4;
    if (Math.abs(newSlideWidth - slideWidth) > 1) {
      buildPreview(); // Rebuild on significant resize
    }
  });
}

// Generate embed code (vanilla JavaScript)
function generateEmbedCode() {
  if (uploadedImages.length === 0) return;

  const originalCount = uploadedImages.length;

  // Create duplicates exactly like the reference
  const duplicatesHtml = uploadedImages
    .map(
      (image, index) =>
        `      <div class="swiper-slide-like swiper-slide-duplicate" data-original-index="${index}">
        <img src="${image.src}" alt="スライド${index + 1}" />
      </div>`
    )
    .join('\n');

  const originalSlidesHtml = uploadedImages
    .map(
      (image, index) =>
        `      <div class="swiper-slide-like" data-original-index="${index}">
        <img src="${image.src}" alt="スライド${index + 1}" />
      </div>`
    )
    .join('\n');

  const embedHTML = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>横並びのスライドショー</title>
<style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { overflow: hidden; }
    /* Swiperライクなスタイル */
    .swiper-like { width: 100vw; overflow: hidden; position: relative; }
    .swiper-wrapper-like { display: flex; align-items: center; height: 100%; will-change: transform; transition: none; gap: 0; }
    .swiper-slide-like { flex-shrink: 0; width: 71.43vw; /* 100vw / 1.4 ≈ 71.43vw */ display: flex; align-items: center; justify-content: center; position: relative; margin: 0 1.5vw; }
    .swiper-slide-like img { 
      width: 100%; 
      height: auto; 
      transform: scale(0.85); /* 全て縮小状態で固定 */ 
      transition: none; /* 初期状態ではtransitionを無効化 */
    }
    
    /* アクティブスライドのみサイズ調整（スムーズに変更） */
    .swiper-slide-active img { 
      transform: scale(1); 
      transition: none; /* 初期状態ではtransitionを無効化 */
    }
    
    /* 隣接スライドは縮小状態を維持（スムーズに変更） */
    .swiper-slide-prev img, .swiper-slide-next img, 
    .swiper-slide-duplicate-prev img, .swiper-slide-duplicate-next img { 
      transform: scale(0.85); 
      transition: none; /* 初期状態ではtransitionを無効化 */
    }
</style>
</head>
<body>
  <div class="swiper-like">
    <div class="swiper-wrapper-like">
${duplicatesHtml}
${originalSlidesHtml}
${duplicatesHtml}
    </div>
  </div>
<script>
    (function() {
      // DOM読み込み完了まで待機
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSlider);
      } else {
        initSlider();
      }
      
      function initSlider() {
        const wrapper = document.querySelector('.swiper-wrapper-like');
        let slides = Array.from(document.querySelectorAll('.swiper-slide-like'));
        const originalCount = ` + originalCount + `;
        let slideWidth = wrapper.parentElement.clientWidth / 1.4 + (3 * wrapper.parentElement.clientWidth) / 100; // スライド幅 + margin(1.5vw * 2)
        let currentIndex = originalCount; // 真ん中のグループから開始
        let isAnimating = false;
        let fixedContainerWidth = 0; // 固定コンテナ幅を保存する変数
      
      if (originalCount === 0) return;
      
      function updateSlides(animate = true) {
        // 全てのクラスをクリア
        slides.forEach(slide => {
          slide.classList.remove('swiper-slide-active', 'swiper-slide-prev', 'swiper-slide-next', 
                                 'swiper-slide-duplicate-prev', 'swiper-slide-duplicate-next');
        });
        
        // 現在のスライドとその前後にクラスを追加
        const activeSlide = slides[currentIndex];
        const prevSlide = slides[currentIndex - 1];
        const nextSlide = slides[currentIndex + 1];
        
        if (activeSlide) activeSlide.classList.add('swiper-slide-active');
        if (prevSlide) prevSlide.classList.add('swiper-slide-prev');
        if (nextSlide) nextSlide.classList.add('swiper-slide-next');
        
        // Swiperのような位置計算（中央配置） - 固定幅使用
        const containerWidth = fixedContainerWidth;
        
        // コンテナ幅チェック
        if (containerWidth === 0) {
          return;
        }
        
        const slideOffset = (containerWidth - slideWidth) / 2; // 中央配置のオフセット
        const translateX = slideOffset - (currentIndex * slideWidth);
        
        // アニメーション制御
        if (!animate) {
          // 初期表示時：transitionを無効化して瞬間的に位置設定
          wrapper.style.transition = 'none';
          wrapper.style.transform = 'translateX(' + translateX + 'px)';
          
          // 次フレームでtransitionを復活
          requestAnimationFrame(function() {
            wrapper.style.transition = 'transform 3000ms ease';
          });
        } else {
          // 通常のアニメーション
          wrapper.style.transform = 'translateX(' + translateX + 'px)';
        }
      }
      
      function nextSlide() {
        if (isAnimating) return;
        
        // コンテナ幅チェック
        const containerWidth = wrapper.parentElement.clientWidth;
        if (containerWidth === 0) {
          return;
        }
        
        isAnimating = true;
        currentIndex++;
        
        // シームレスループ：動的拡張システム（プレビューと同じ方式）
        if (currentIndex >= originalCount * 2) {
          updateSlides(true);
          setTimeout(function() {
            // ループ拡張前にも幅をチェック
            const extendContainerWidth = wrapper.parentElement.clientWidth;
            if (extendContainerWidth === 0) {
              isAnimating = false;
              return;
            }
            
            // 新しいアプローチ：リセットせずにDOMを動的に拡張
            // 最後に到達したら、新しい複製スライドを後ろに追加
            const uploadedImages = JSON.parse('` + JSON.stringify(uploadedImages) + `');
            const newSlides = [];
            
            uploadedImages.forEach(function(image, index) {
              const slideDiv = document.createElement('div');
              slideDiv.className = 'swiper-slide-like';
              slideDiv.setAttribute('data-original-index', index.toString());
              
              const img = document.createElement('img');
              img.src = image.src;
              img.alt = 'スライド' + (index + 1);
              slideDiv.appendChild(img);
              
              newSlides.push(slideDiv);
            });
            
            // 新しいスライドをwrapperの最後に追加
            newSlides.forEach(function(slide, index) {
              wrapper.appendChild(slide);
            });
            
            // slides配列を更新
            slides = Array.from(wrapper.querySelectorAll('.swiper-slide-like'));
            
            // 現在のインデックスはそのまま、アニメーション続行
            isAnimating = false;
          }, 3000);
        } else {
          updateSlides(true);
          setTimeout(function() {
            isAnimating = false;
          }, 3000);
        }
      }
      
      // 初期化フラグを追加
      let isInitialized = false;
      
      // 初期化とリサイズ対応を改善
      function initializeSlider() {
        if (isInitialized) {
          return;
        }
        
        // コンテナサイズが正しく取得できるまで待機
        const containerWidth = wrapper.parentElement.clientWidth;
        if (containerWidth === 0) {
          // サイズが0の場合は少し待ってから再試行
          setTimeout(initializeSlider, 100);
          return;
        }
        
        // スライド幅を設定（初回のみ）
        slideWidth = containerWidth / 1.4 + (3 * containerWidth) / 100;
        
        // 初期コンテナ幅を固定値として保存
        fixedContainerWidth = containerWidth;
        
        // Wrapperを完全にリセットしてから初期配置
        wrapper.style.transition = 'none';
        wrapper.style.transform = 'translateX(0px)';
        
        // 1フレーム待ってから正しい初期位置を設定
        requestAnimationFrame(function() {
          // 初期表示（アニメーションなし） - 瞬間的に中央配置
          updateSlides(false);
        });
        
        // 初期化完了マーク
        isInitialized = true;
        
        // 1秒後にCSSトランジションを有効化して滑らかなアニメーション開始
        setTimeout(function() {
          const allImages = document.querySelectorAll('.swiper-slide-like img');
          console.log('🎨 [iframe] Enabling transitions for', allImages.length, 'images');
          
          allImages.forEach(function(img, index) {
            img.style.transition = 'transform 3000ms ease';
          });
          
          // wrapperのtransitionも有効化
          wrapper.style.transition = 'transform 3000ms ease';
        }, 1000);
        
        // 自動再生開始
        if (!window.sliderInterval) {
          window.sliderInterval = setInterval(nextSlide, 3000);
        }
      }
      
      // Handle visibility change (tab switching) for iframe
      document.addEventListener('visibilitychange', function() {
        if (!document.hidden && isInitialized) {
          // タブが再表示された時に、トランジションを再設定
          console.log('🔄 [iframe] Tab visible again - checking transitions');
          setTimeout(function() {
            const allImages = document.querySelectorAll('.swiper-slide-like img');
            let needsReactivation = false;
            
            allImages.forEach(function(img) {
              const currentTransition = window.getComputedStyle(img).transition;
              if (!currentTransition.includes('transform') || currentTransition === 'all 0s ease 0s') {
                console.log('⚠️ [iframe] Found image without transition, reactivating');
                needsReactivation = true;
              }
            });
            
            if (needsReactivation) {
              console.log('🔧 [iframe] Reactivating transitions for', allImages.length, 'images');
              allImages.forEach(function(img) {
                img.style.transition = 'transform 3000ms ease';
              });
              
              // wrapperのtransitionも再設定
              wrapper.style.transition = 'transform 3000ms ease';
            }
          }, 100);
        }
      });
      
      // 初期化
      initializeSlider();
      
      } // initSlider function end
    })();
</script>
</body>
</html>`;

  document.getElementById('embedCode').textContent = embedHTML;
}

// Copy embed code
function copyEmbedCode() {
  const embedCode = document.getElementById('embedCode').textContent;
  const copyBtn = document.getElementById('copyBtn');
  const originalText = copyBtn.textContent;

  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard
      .writeText(embedCode)
      .then(() => {
        copyBtn.textContent = 'コピー完了！';
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.textContent = originalText;
          copyBtn.classList.remove('copied');
        }, 2000);
      })
      .catch(() => {
        copyBtn.textContent = 'コピーに失敗しました';
        setTimeout(() => {
          copyBtn.textContent = originalText;
        }, 2000);
      });
  } else {
    // Fallback
    const textArea = document.createElement('textarea');
    textArea.value = embedCode;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      const successful = document.execCommand('copy');
      if (successful) {
        copyBtn.textContent = 'コピー完了！';
        copyBtn.classList.add('copied');
      } else {
        copyBtn.textContent = '手動でコピーしてください';
      }
    } catch (err) {
      copyBtn.textContent = '手動でコピーしてください';
    }

    document.body.removeChild(textArea);

    setTimeout(() => {
      copyBtn.textContent = originalText;
      copyBtn.classList.remove('copied');
    }, 2000);
  }
}

// Drawer logic
function setupDrawer() {
  if (!menuToggle || !drawer || !drawerOverlay) return;

  const open = () => {
    drawer.classList.add('open');
    drawer.setAttribute('aria-hidden', 'false');
    drawerOverlay.hidden = false;
    requestAnimationFrame(() => drawerOverlay.classList.add('open'));
    menuToggle.setAttribute('aria-expanded', 'true');
  };

  const close = () => {
    drawer.classList.remove('open');
    drawer.setAttribute('aria-hidden', 'true');
    drawerOverlay.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    setTimeout(() => {
      drawerOverlay.hidden = true;
    }, 200);
  };

  menuToggle.addEventListener('click', open);
  drawerOverlay.addEventListener('click', close);
  if (drawerClose) drawerClose.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') close();
  });

  drawer.addEventListener('click', (e) => {
    const target = e.target;
    if (target && target.tagName === 'A') close();
  });
}
