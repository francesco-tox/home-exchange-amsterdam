/* ============================================
   NAVIGATION TOGGLE
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');

  if (navToggle) {
    navToggle.addEventListener('click', function () {
      navMenu.classList.toggle('active');
    });
  }

  // Close menu when a link is clicked
  const navLinks = document.querySelectorAll('.nav-menu a');
  navLinks.forEach(link => {
    link.addEventListener('click', function () {
      navMenu.classList.remove('active');
    });
  });
});

/* ============================================
   ACTIVE NAVIGATION LINK
   ============================================ */

document.addEventListener('DOMContentLoaded', function () {
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  const navLinks = document.querySelectorAll('.nav-menu a');

  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
});