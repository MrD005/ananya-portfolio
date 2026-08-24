const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const year = document.querySelector('#year');

if (year) year.textContent = new Date().getFullYear();

const closeMenu = () => {
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');
  mobileMenu.classList.remove('open');
  document.body.classList.remove('menu-open');
};

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  if (isOpen) {
    closeMenu();
  } else {
    menuButton.setAttribute('aria-expanded', 'true');
    menuButton.setAttribute('aria-label', 'Close menu');
    mobileMenu.classList.add('open');
    document.body.classList.add('menu-open');
  }
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', closeMenu);
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
    closeMenu();
    menuButton.focus();
  }
});

window.addEventListener('resize', () => {
  if (window.innerWidth > 900) closeMenu();
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const packagePreview = document.querySelector('.package-laptop');
const deferredPackageShots = document.querySelectorAll('.package-shot[data-src]');

const loadPackageShots = () => {
  deferredPackageShots.forEach((image) => {
    if (image.dataset.srcset) image.srcset = image.dataset.srcset;
    if (image.dataset.sizes) image.sizes = image.dataset.sizes;
    image.src = image.dataset.src;
    image.removeAttribute('data-src');
    image.removeAttribute('data-srcset');
    image.removeAttribute('data-sizes');
  });
};

if (!reducedMotion && deferredPackageShots.length) {
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        loadPackageShots();
        imageObserver.disconnect();
      }
    }, { rootMargin: '300px 0px' });

    imageObserver.observe(packagePreview);
  } else {
    loadPackageShots();
  }
}

if (reducedMotion || !('IntersectionObserver' in window)) {
  document.querySelectorAll('.reveal').forEach((element) => element.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));
}

const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

if (precisePointer && !reducedMotion) {
  document.querySelectorAll('[data-tilt]').forEach((element) => {
    let animationFrame;
    const isSoft = element.dataset.tilt === 'soft';
    const horizontalStrength = isSoft ? 3 : 7;
    const verticalStrength = isSoft ? 2 : 5;
    const depthSurface = element.closest('.depth-cover');

    element.addEventListener('pointermove', (event) => {
      const bounds = element.getBoundingClientRect();
      const horizontal = (event.clientX - bounds.left) / bounds.width - 0.5;
      const vertical = (event.clientY - bounds.top) / bounds.height - 0.5;

      window.cancelAnimationFrame(animationFrame);
      animationFrame = window.requestAnimationFrame(() => {
        element.style.setProperty('--tilt-x', `${(-vertical * verticalStrength).toFixed(2)}deg`);
        element.style.setProperty('--tilt-y', `${(horizontal * horizontalStrength).toFixed(2)}deg`);
        element.classList.add('is-tilting');

        if (depthSurface) {
          depthSurface.style.setProperty('--shine-x', `${((horizontal + 0.5) * 100).toFixed(1)}%`);
          depthSurface.style.setProperty('--shine-y', `${((vertical + 0.5) * 100).toFixed(1)}%`);
          depthSurface.classList.add('depth-active');
        }
      });
    }, { passive: true });

    element.addEventListener('pointerleave', () => {
      window.cancelAnimationFrame(animationFrame);
      element.classList.remove('is-tilting');
      element.style.removeProperty('--tilt-x');
      element.style.removeProperty('--tilt-y');

      if (depthSurface) {
        depthSurface.classList.remove('depth-active');
        depthSurface.style.removeProperty('--shine-x');
        depthSurface.style.removeProperty('--shine-y');
      }
    });
  });
}
