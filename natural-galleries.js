(() => {
  const tracks = [...document.querySelectorAll('.gallery-grid, .home-preview__grid, .archive-carousel__track')];

  tracks.forEach(track => {
    track.classList.add('natural-gallery');
    track.classList.toggle('natural-gallery--scroll', track.classList.contains('archive-carousel__track'));
    let pendingFrame = 0;

    const updateHeight = () => {
      pendingFrame = 0;
      const style = getComputedStyle(track);
      if (style.flexWrap !== 'nowrap') {
        track.style.removeProperty('--gallery-active-height');
        return;
      }

      const photos = [...track.children].filter(child => child.classList.contains('natural-photo'));
      const active = photos.reduce((closest, photo) => {
        return !closest || Math.abs(photo.offsetLeft - track.scrollLeft) < Math.abs(closest.offsetLeft - track.scrollLeft)
          ? photo : closest;
      }, null);
      if (!active) return;

      const height = Math.ceil(active.getBoundingClientRect().height + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom));
      const value = `${height}px`;
      if (height > 0 && track.style.getPropertyValue('--gallery-active-height') !== value) {
        track.style.setProperty('--gallery-active-height', value);
      }
    };

    const schedule = () => {
      if (!pendingFrame) pendingFrame = requestAnimationFrame(updateHeight);
    };

    track.querySelectorAll('img').forEach(image => {
      const photo = image.closest('.gallery-item, figure');
      if (!photo || photo.parentElement !== track) return;
      photo.classList.add('natural-photo');
      const updateRatio = () => {
        const width = image.naturalWidth || Number(image.getAttribute('width'));
        const height = image.naturalHeight || Number(image.getAttribute('height'));
        if (width > 0 && height > 0) {
          photo.style.setProperty('--photo-ratio', String(width / height));
          photo.dataset.orientation = width < height ? 'portrait' : width > height ? 'landscape' : 'square';
        }
        schedule();
      };
      image.addEventListener('load', updateRatio);
      updateRatio();
    });

    track.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule, { passive: true });
    if ('ResizeObserver' in window) {
      const observer = new ResizeObserver(schedule);
      observer.observe(track);
    }
    schedule();
  });
})();
