// THE GENTLEMEN — report interactions
// Vanilla JS only, no build step, GitHub Pages safe.

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = Array.from(document.querySelectorAll('.navlink'));
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  // Highlight active section in the top nav while scrolling
  if ('IntersectionObserver' in window && sections.length) {
    const byId = {};
    navLinks.forEach(l => { byId[l.getAttribute('href').slice(1)] = l; });

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    sections.forEach(s => observer.observe(s));
  }
});
