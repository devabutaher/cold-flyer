"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { getPageContent } from "@/lib/content";
import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";

const styles = `
  @keyframes hero-badge {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes hero-title {
    from { opacity: 0; transform: translateY(30px); }
    to { opacity: 1; transform: translateY(0); }
  }
  @keyframes hero-fade-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .hero-animate {
    will-change: transform, opacity;
  }
  .hero-animate:nth-child(1) {
    animation: hero-badge 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s both;
  }
  .hero-animate:nth-child(2) {
    animation: hero-title 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.32s both;
  }
  .hero-animate:nth-child(3) {
    animation: hero-fade-up 0.45s ease-out 0.54s both;
  }
  .hero-animate:nth-child(4) {
    animation: hero-fade-up 0.4s ease-out 0.76s both;
  }
  @media (prefers-reduced-motion: reduce) {
    .hero-animate {
      animation: none !important;
    }
  }
`;

function SlideContent({ slide, t }) {
  return (
    <div className="container relative z-10 flex h-full flex-col items-start justify-center">
      <div className="hero-animate">
        <Badge className="mb-3 sm:mb-4 md:mb-5 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm text-xxs sm:text-xs">
          {slide.badge}
        </Badge>
      </div>

      <h1 className="hero-animate mb-3 sm:mb-4 max-w-2xl text-2xl sm:text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] text-white">
        {slide.headline}
        <br />
        <span className="text-primary">{slide.highlight}</span>
      </h1>

      <p className="hero-animate mb-5 sm:mb-7 max-w-lg text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed text-white/70">
        {slide.sub}
      </p>

      <div className="hero-animate flex flex-wrap gap-2 sm:gap-3">
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
      </div>
    </div>
  );
}

export default function Hero() {
  const t = useTranslations();
  const locale = useLocale();
  const { slides: heroSliderData } = getPageContent("home-hero", locale);
  const sectionRef = useRef(null);

  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] sm:h-[75vh] md:h-[85vh] min-h-112 w-full overflow-hidden bg-inverted"
    >
      <style>{styles}</style>
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

              <SlideContent slide={slide} t={t} />
            </div>
          ))}
        </div>
      </div>

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
