/* ============================================
   GALLERY LOADER - DYNAMIC PHOTO LOADING
   Displays all photos from /photos folder
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const gallery = document.getElementById('gallery');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxClose = document.querySelector('.lightbox-close');
  const lightboxPrev = document.querySelector('.lightbox-prev');
  const lightboxNext = document.querySelector('.lightbox-next');
  const lightboxCounter = document.querySelector('.lightbox-counter');

  let galleryItems = [];
  let currentImageIndex = 0;
  let allLoadedImages = [];

  /* ============================================
     HARDCODED PHOTO LIST - Your Actual Photos
     ============================================ */

  function loadGalleryPhotos() {
    // Your actual photo files
    const photoFiles = [
      '20260505_103014.jpg',
      '20260505_103948.jpg',
      '20260505_105014.jpg',
      '20260505_145043.jpg',
      '20260507_170509.jpg',
      '20260509_101453.jpg',
      '20260509_101552.jpg',
      '20260518_194457.jpg',
      '22144.jpg',
      '22216.jpg',
      '22217.jpg',
      '22245.jpg',
      '22249.jpg',
      '22251.jpg',
      '22263.jpg',
      '22264.jpg',
      '22692.jpeg',
      '22709.jpeg',
      '24517.jpeg',
      'IMG-20250715-WA0018.jpg',
      'IMG-20260505-WA0001.jpg',
      'IMG-20260505-WA0002(1).jpg',
      'IMG-20260505-WA0003.jpg',
      'IMG-20260505-WA0004.jpg'
    ];

    displayPhotos(photoFiles);
  }

  function displayPhotos(photoFiles) {
    gallery.innerHTML = '';
    let totalLoaded = 0;
    let totalFailed = 0;

    photoFiles.forEach((photo, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      
      const img = document.createElement('img');
      img.src = `photos/${photo}`;
      img.alt = `Apartment photo - ${photo}`;
      img.loading = 'lazy';
      
      // Track successful loads
      img.addEventListener('load', function () {
        totalLoaded++;
        console.log(`✓ Photo loaded: ${photo}`);
      });

      img.addEventListener('error', function () {
        totalFailed++;
        console.log(`✗ Photo failed: ${photo}`);
        galleryItem.remove();
      });

      galleryItem.appendChild(img);
      gallery.appendChild(galleryItem);
    });

    // Initialize lightbox after photos have time to start loading
    setTimeout(initLightbox, 500);
  }

  function initLightbox() {
    const allImages = gallery.querySelectorAll('img');
    allLoadedImages = Array.from(allImages);
    galleryItems = allLoadedImages;

    console.log(`✓ Gallery initialized with ${galleryItems.length} photos`);

    if (galleryItems.length === 0) {
      gallery.innerHTML = '<p style="grid-column: 1 / -1; text-align: center; padding: 2rem; color: #8b8378;">No photos found. Please upload images to the /photos folder.</p>';
      return;
    }

    allImages.forEach((img, index) => {
      img.parentElement.addEventListener('click', function () {
        currentImageIndex = index;
        openLightbox();
      });
    });
  }

  /* ============================================
     LIGHTBOX FUNCTIONS
     ============================================ */

  function openLightbox() {
    if (galleryItems.length === 0) return;
    
    lightboxImg.src = galleryItems[currentImageIndex].src;
    lightboxImg.alt = galleryItems[currentImageIndex].alt;
    lightbox.classList.add('active');
    updateCounter();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
  }

  function showNextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryItems.length;
    openLightbox();
  }

  function showPrevImage() {
    currentImageIndex = (currentImageIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox();
  }

  function updateCounter() {
    const total = galleryItems.length;
    const current = currentImageIndex + 1;
    lightboxCounter.textContent = `${current} / ${total}`;
  }

  /* ============================================
     EVENT LISTENERS
     ============================================ */

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener('click', showPrevImage);
  if (lightboxNext) lightboxNext.addEventListener('click', showNextImage);

  lightbox.addEventListener('click', function (event) {
    if (event.target === lightbox) {
      closeLightbox();
    }
  });

  document.addEventListener('keydown', function (event) {
    if (!lightbox.classList.contains('active')) return;

    if (event.key === 'Escape') {
      closeLightbox();
    } else if (event.key === 'ArrowRight') {
      showNextImage();
    } else if (event.key === 'ArrowLeft') {
      showPrevImage();
    }
  });

  /* ============================================
     INITIALIZE
     ============================================ */

  loadGalleryPhotos();
});
