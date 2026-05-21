"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getData } from "@/data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

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
          hidden: { opacity: 0, y: 20 },
          visible: {
            opacity: 1,
            y: 0,
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
          hidden: { opacity: 0, y: 30 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
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

  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] min-h-112 w-full overflow-hidden bg-inverted"
    >
      <div className="embla h-full relative" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {heroSliderData.map((slide, i) => (
            <div key={i} className="embla__slide relative h-full min-w-0 flex-[0_0_100%]">
              <div className="absolute inset-0">
                <Image
                  src={slide.img}
                  alt={slide.headline}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1200px"
                  priority={i === 0}
                  loading={i === 0 ? "eager" : "lazy"}
                  quality={75}
                  className="absolute inset-0 object-cover object-center opacity-55"
                />
              </div>

              <div className="absolute inset-0 bg-linear-to-r from-inverted/70 via-inverted/30 to-transparent" />

              <SlideContent slide={slide} index={i} t={t} />
            </div>
          ))}
        </div>
      </div>

      {/* Progress dots */}
      <div className="absolute top-1/2 right-4 sm:right-6 z-20 flex -translate-y-1/2 flex-col items-center gap-2">
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
