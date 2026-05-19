"use client";

import { useTranslations } from "next-intl";
import { useCounter } from "@/hooks/use-counter";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";

const STATS = [
  { key: "unitsInstalled", end: 15000, suffix: "+", format: (n) => (n >= 1000 ? Math.floor(n / 1000) + "k" : n) },
  { key: "uptimeGuarantee", end: 99, suffix: "%", format: (n) => n },
  { key: "responseTime", end: 24, suffix: "h", format: (n) => n },
  { key: "standardWarranty", end: 10, suffix: "yr", format: (n) => n },
];

function Counter({ end, suffix, label, format, started }) {
  const val = useCounter({ end, started });

  return (
    <div className="text-center">
      <div className="font-sans font-bold text-4xl sm:text-5xl text-primary mb-1 tabular-nums">
        {format(val)}
        {suffix}
      </div>
      <div className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-semibold">{label}</div>
    </div>
  );
}

export default function StatsStrip() {
  const t = useTranslations("home");
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <AnimatedSection ref={ref} className="bg-inverted py-10 sm:py-14">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {STATS.map((s) => (
            <Counter key={s.key} {...s} started={started} label={t(s.key)} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
