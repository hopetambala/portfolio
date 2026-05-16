import { useEffect, useRef } from 'react';

export function useScrollReveal(threshold = 0.15) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('is-visible');
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('is-visible');
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}

export function useStaggerReveal(threshold = 0.1, staggerMs = 80) {
  const ref = useRef(null);

  useEffect(() => {
    const container = ref.current;
    if (!container) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const children = Array.from(container.children);
    children.forEach((child) => child.classList.add('stagger-item'));

    const timeouts = [];

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((child, i) => {
            timeouts.push(
              setTimeout(() => child.classList.add('stagger-visible'), i * staggerMs)
            );
          });
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(container);
    return () => {
      timeouts.forEach(clearTimeout);
      observer.disconnect();
    };
  }, [threshold, staggerMs]);

  return ref;
}

export function triggerPageTransition() {
  const layout = document.querySelector('.layout');
  if (!layout) return;
  layout.classList.remove('page-enter');
  void layout.offsetWidth;
  layout.classList.add('page-enter');
}

export function scrollToHash(location, prevLocation) {
  if (location.hash && prevLocation && prevLocation.pathname !== location.pathname) {
    setTimeout(() => {
      const el = document.querySelector(location.hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
}
