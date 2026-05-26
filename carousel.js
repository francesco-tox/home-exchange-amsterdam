/* ============================================
   CAROUSEL - Landscape photos only
   Keyboard + arrow controls, touch-friendly
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const carousel = document.getElementById('carousel');
  const track = document.getElementById('carouselTrack');
  const indicators = document.getElementById('carouselIndicators');
  const prevBtn = carousel.querySelector('.carousel-prev');
  const nextBtn = carousel.querySelector('.carousel-next');

  if (!carousel) return;

  const slides = track.querySelectorAll('.carousel-slide');
  let currentIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;

  // Create indicator dots
  slides.forEach((_, idx) => {
    const dot = document.createElement('button');
    dot.className = 'carousel-dot';
    if (idx === 0) dot.classList.add('active');
    dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
    dot.addEventListener('click', () => goToSlide(idx));
    indicators.appendChild(dot);
  });

  function goToSlide(index) {
    currentIndex = index;
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    updateIndicators();
  }

  function updateIndicators() {
    document.querySelectorAll('.carousel-dot').forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    goToSlide(currentIndex);
  }

  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    goToSlide(currentIndex);
  }

  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (carousel.querySelector('.carousel-slide')) {
      if (e.key === 'ArrowLeft') prevSlide();
      if (e.key === 'ArrowRight') nextSlide();
    }
  });

  // Touch/swipe support
  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  });

  function handleSwipe() {
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
  }
});
