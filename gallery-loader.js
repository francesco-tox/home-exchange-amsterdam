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

  /* ============================================
     LOAD PHOTOS FROM /photos FOLDER
     ============================================ */

  async function loadGalleryPhotos() {
    try {
      // Try to fetch the photos directory listing
      const response = await fetch('photos/');
      
      if (!response.ok) {
        // If directory listing fails, manually load common photo names
        loadCommonPhotoNames();
        return;
      }

      const text = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'text/html');
      const links = doc.querySelectorAll('a');

      const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
      const photoFiles = [];

      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && imageExtensions.some(ext => href.toLowerCase().endsWith(ext))) {
          photoFiles.push(href);
        }
      });

      displayPhotos(photoFiles);
    } catch (error) {
      // Fallback: load common photo names
      loadCommonPhotoNames();
    }
  }

  function loadCommonPhotoNames() {
    // List of common photo filenames to try
    const commonNames = [
      'hero', 'living-01', 'living-02', 'living-03', 'kitchen-01', 'kitchen-02', 'kitchen-03',
      'dining-01', 'dining-02', 'bedroom-01', 'bedroom-02', 'bathroom-01', 'bathroom-02',
      'toilet-01', 'terrace-01', 'terrace-02', 'terrace-03', 'entrance-01', 'entrance-02',
      'berging-01', 'panorama-01', 'panorama-02', 'panorama-03'
    ];

    const extensions = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    const photoFiles = [];

    // Try each common name with each extension
    commonNames.forEach(name => {
      extensions.forEach(ext => {
        photoFiles.push(`${name}.${ext}`);
      });
    });

    displayPhotos(photoFiles);
  }

  function displayPhotos(photoFiles) {
    gallery.innerHTML = '';
    let validPhotos = 0;

    photoFiles.forEach((photo, index) => {
      const galleryItem = document.createElement('div');
      galleryItem.className = 'gallery-item';
      
      const img = document.createElement('img');
      img.src = `photos/${photo}`;
      img.alt = `Apartment photo ${index + 1}`;
      img.loading = 'lazy';
      
      // Only add item if image loads successfully
      img.addEventListener('load', function () {
        validPhotos++;
      });

      img.addEventListener('error', function () {
        galleryItem.remove();
      });

      galleryItem.appendChild(img);
      gallery.appendChild(galleryItem);
      galleryItems.push(img);
    });

    // Initialize lightbox after a short delay
    setTimeout(initLightbox, 500);
  }

  function initLightbox() {
    const allImages = gallery.querySelectorAll('img');
    galleryItems = Array.from(allImages);

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