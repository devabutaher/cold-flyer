"use client";

import { useTranslations } from "next-intl";
import { useCounter } from "@/hooks/use-counter";
import { useEffect, useRef, useState } from "react";
import { AnimatedSection } from "@/components/ui/animated-section";
import { useStatsQuery } from "@/hooks/queries/stats";

const STATS_META = [
  { key: "unitsInstalled", suffix: "+", format: (n) => (n >= 1000 ? Math.floor(n / 1000) + "k" : n) },
  { key: "uptimeGuarantee", suffix: "%", format: (n) => n },
  { key: "responseTime", suffix: "h", format: (n) => n },
  { key: "standardWarranty", suffix: "yr", format: (n) => n },
];

const FALLBACK_STATS = {
  unitsInstalled: 15000,
  uptimeGuarantee: 99,
  responseTime: 24,
  standardWarranty: 10,
};

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

function Skeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="text-center space-y-3">
          <div className="h-12 w-24 mx-auto rounded-md bg-muted/30 animate-pulse" />
          <div className="h-4 w-28 mx-auto rounded-md bg-muted/30 animate-pulse" />
        </div>
      ))}
    </div>
  );
}

export default function StatsStrip() {
  const t = useTranslations("home");
  const ref = useRef(null);
  const [started, setStarted] = useState(false);
  const { data: stats, isLoading } = useStatsQuery();

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

  const resolved = stats || FALLBACK_STATS;

  return (
    <AnimatedSection ref={ref} className="bg-inverted py-10 sm:py-14">
      <div className="container">
        {isLoading ? (
          <Skeleton />
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
            {STATS_META.map(({ key, ...s }) => (
              <Counter key={key} {...s} started={started} end={resolved[key]} label={t(key)} />
            ))}
          </div>
        )}
      </div>
    </AnimatedSection>
  );
}
