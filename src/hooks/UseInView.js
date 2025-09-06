import { useState, useEffect, useRef } from 'react';

export const useInView = (options = {}) => {
  const [inView, setInView] = useState(false);
  const [entry, setEntry] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        setEntry(entry);
      },
      {
        threshold: 0,
        rootMargin: '200px',
        ...options,
      }
    );

    observer.observe(node);

    return () => {
      observer.unobserve(node);
    };
  }, [options.threshold, options.rootMargin]);

  return { ref, inView, entry };
};