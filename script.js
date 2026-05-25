/* ============================================
   AMSTERDAM HOME EXCHANGE - LIGHTBOX SCRIPT
   Vanilla JavaScript photo viewer
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCounter = document.querySelector('.lightbox-counter');

  let currentImageIndex = 0;
  const allImages = Array.from(galleryItems);

  /* ============================================
     OPEN LIGHTBOX
     ============================================ */

  galleryItems.forEach((item, index) => {
    item.addEventListener('click', function () {
      currentImageIndex = index;
      openLightbox();
    });
  });

  function openLightbox() {
    const img = allImages[currentImageIndex].querySelector('img');
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.classList.add('active');
    updateCounter();
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  /* ============================================
     CLOSE LIGHTBOX
     ============================================ */

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto'; // Re-enable scrolling
  }

  lightboxClose.addEventListener('click', closeLightbox);

  // Close on background click
  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape') {
      closeLightbox();
    }
  });

  /* ============================================
     NAVIGATION
     ============================================ */

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % allImages.length;
    openLightbox();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + allImages.length) % allImages.length;
    openLightbox();
  }

  lightboxNext.addEventListener('click', showNextImage);
  lightboxPrev.addEventListener('click', showPrevImage);

  // Arrow key navigation
  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'ArrowRight') {
      showNextImage();
    } else if (event.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  /* ============================================
     COUNTER
     ============================================ */

  function updateCounter() {
    const total = allImages.length;
    const current = currentImageIndex + 1;
    lightboxCounter.textContent = `${current} / ${total}`;
  }

  /* ============================================
     SMOOTH SCROLL (Optional Enhancement)
     ============================================ */

  // Already handled by CSS: scroll-behavior: smooth

  console.log('Home Exchange Lightbox initialized ✓');
});