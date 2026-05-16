"use client";

import { useTranslations } from "next-intl";
import { useCounter } from "@/hooks/use-counter";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { animations } from "@/lib/animation";

function Counter({ end, suffix, label, format, started, index }) {
  const val = useCounter({ end, started });

  return (
    <motion.div
      className="text-center"
      variants={animations.entrance.fadeUp}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
    >
      <motion.div
        className="font-sans font-bold text-4xl sm:text-5xl text-primary mb-1 tabular-nums"
        key={val}
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 15 }}
      >
        {format(val)}
        {suffix}
      </motion.div>
      <div className="text-muted-foreground text-xs sm:text-sm uppercase tracking-widest font-semibold">{label}</div>
    </motion.div>
  );
}

export default function StatsStrip() {
  const t = useTranslations("home");
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  const stats = [
    { end: 15000, suffix: "+", label: t("unitsInstalled"), format: (n) => (n >= 1000 ? Math.floor(n / 1000) + "k" : n) },
    { end: 99, suffix: "%", label: t("uptimeGuarantee"), format: (n) => n },
    { end: 24, suffix: "h", label: t("responseTime"), format: (n) => n },
    { end: 10, suffix: "yr", label: t("standardWarranty"), format: (n) => n },
  ];

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
    <AnimatedSection ref={ref} className="bg-neutral-900 py-14 sm:py-16">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12">
          {stats.map((s, i) => (
            <Counter key={s.label} {...s} started={started} index={i} />
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
