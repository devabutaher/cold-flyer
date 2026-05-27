import { useEffect, useRef, useState } from "react";

export function useInView({ once = true, margin = "-60px" } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(el);
        } else if (!once) {
          setInView(false);
        }
      },
      { rootMargin: margin },
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [once, margin]);

  return { ref, inView };
}
