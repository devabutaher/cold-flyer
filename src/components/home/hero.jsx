"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getData } from "@/data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useTranslations, useLocale } from "next-intl";

function SlideContent({ slide, index, t }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      className="container relative z-10 flex h-full flex-col items-start justify-center"
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: 0.12, delayChildren: 0.2 },
        },
      }}
    >
      <motion.div
        variants={{
          hidden: { opacity: 0, y: 20, filter: "blur(4px)" },
          visible: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
          },
        }}
      >
        <Badge className="mb-3 sm:mb-4 md:mb-5 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm text-[10px] sm:text-xs">
          {slide.badge}
        </Badge>
      </motion.div>

      <motion.h1
        className="mb-3 sm:mb-4 max-w-2xl text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white"
        variants={{
          hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
        }}
      >
        {slide.headline}
        <br />
        <span className="text-primary">{slide.highlight}</span>
      </motion.h1>

      <motion.p
        className="mb-5 sm:mb-7 max-w-lg text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-white/70"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1 } },
        }}
      >
        {slide.sub}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-2 sm:gap-3"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
        }}
      >
        <Link href="/items">
          <Button size="lg" className="group relative overflow-hidden sm:size-xl">
            <span className="relative z-10 inline-flex items-center gap-2">
              {t("common.shopCollection")}{" "}
              <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
            </span>
          </Button>
        </Link>

        <Link href="/services">
          <Button size="lg" variant="secondary" className="sm:size-xl">
            {t("common.ourServices")}
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  const t = useTranslations();
  const locale = useLocale();
  const heroSliderData = getData("heroSliderData", locale);
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const parallaxY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section ref={sectionRef} className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] min-h-[28rem] w-full overflow-hidden bg-inverted">
      <motion.div className="embla h-full relative" ref={emblaRef} style={{ opacity, scale }}>
        <div className="embla__container flex h-full">
          {heroSliderData.map((slide, i) => (
            <div key={i} className="embla__slide relative h-full min-w-0 flex-[0_0_100%]">
              <motion.div style={{ y: parallaxY }} className="absolute inset-0">
                <Image
                  src={slide.img}
                  alt={slide.headline}
                  fill
                  sizes="100vw"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  className="absolute inset-0 object-cover object-center opacity-55"
                />
              </motion.div>

              <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />

              <SlideContent slide={slide} index={i} t={t} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress dots */}
      <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 sm:bottom-8 sm:left-auto sm:right-5 sm:translate-y-1/2 sm:flex-col sm:translate-x-0">
        {heroSliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-500 ${
              i === selectedIndex
                ? "h-6 w-2 bg-primary md:h-8 md:w-2.5"
                : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60 md:h-2 md:w-2"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
