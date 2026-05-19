"use client";

import { useEffect, useRef, useState } from "react";

export function useScroll(downThreshold, upThreshold) {
  const [scrolled, setScrolled] = useState(false);
  const scrollUpThreshold = upThreshold ?? downThreshold / 2;
  const ticking = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled((prev) => {
          if (prev) {
            return y > scrollUpThreshold;
          }
          return y > downThreshold;
        });
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [downThreshold, scrollUpThreshold]);

  return scrolled;
}
