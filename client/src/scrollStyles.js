export const scrollStyles = () => {
  const vh = Math.max(
    document.documentElement.clientHeight || 0,
    window.innerHeight || 0
  );
  const navbar = document.querySelector('nav');
  const ratio = window.scrollY / vh;
  const opacity = ratio * 4;
  navbar.style.setProperty('--nav-opacity', opacity);
  navbar.style.setProperty('--nav-blur', `${opacity * 3}px`);
};
