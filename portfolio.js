const header = document.querySelector('.site-header');
const menuButton = document.querySelector('.menu-button');
const mobileMenu = document.querySelector('.mobile-menu');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

const updateHeader = () => {
  header.classList.toggle('scrolled', window.scrollY > 20);
};

updateHeader();
window.addEventListener('scroll', updateHeader, { passive: true });

menuButton.addEventListener('click', () => {
  const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!isOpen));
  menuButton.setAttribute('aria-label', isOpen ? 'Open menu' : 'Close menu');
  mobileMenu.classList.toggle('open', !isOpen);
  document.body.classList.toggle('menu-open', !isOpen);
});

mobileMenu.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    menuButton.setAttribute('aria-label', 'Open menu');
    mobileMenu.classList.remove('open');
    document.body.classList.remove('menu-open');
  });
});

const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projectsSection = document.querySelector('.projects');
const projectTiles = document.querySelectorAll('.case-card');
let tileResetTimer;

const focusProjectTile = (tile, event) => {
  const isLink = tile.matches('a[href]');
  const isModifiedClick = event?.metaKey || event?.ctrlKey || event?.shiftKey || event?.altKey;

  if (isLink && (reducedMotion || isModifiedClick)) return;
  if (isLink) event.preventDefault();

  window.clearTimeout(tileResetTimer);
  projectTiles.forEach((projectTile) => projectTile.classList.remove('tile-active'));
  projectsSection.classList.add('tile-interacting');
  tile.classList.add('tile-active');

  tileResetTimer = window.setTimeout(() => {
    if (isLink) {
      window.location.href = tile.href;
      return;
    }

    tile.classList.remove('tile-active');
    projectsSection.classList.remove('tile-interacting');
  }, isLink ? 760 : 1250);
};

projectTiles.forEach((tile) => {
  tile.addEventListener('click', (event) => focusProjectTile(tile, event));

  if (!tile.matches('a[href]')) {
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        focusProjectTile(tile, event);
      }
    });
  }
});

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

document.querySelectorAll('a[href="#"]').forEach((link) => {
  link.addEventListener('click', (event) => event.preventDefault());
});
