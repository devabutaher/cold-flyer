"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heroSliderData } from "@/data/hero-slider-data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function SlideContent({ slide, index }) {
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
          visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] } },
        }}
      >
        <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
          {slide.badge}
        </Badge>
      </motion.div>

      <motion.h1
        className="mb-4 max-w-2xl text-3xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-7xl"
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
        className="mb-7 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base md:text-lg"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.45, delay: 0.1 } },
        }}
      >
        {slide.sub}
      </motion.p>

      <motion.div
        className="flex flex-wrap gap-2"
        variants={{
          hidden: { opacity: 0, y: 20 },
          visible: { opacity: 1, y: 0, transition: { duration: 0.4, delay: 0.2 } },
        }}
      >
        <Link href="/items">
          <Button size="xl" className="group relative overflow-hidden">
            <span className="relative z-10 inline-flex items-center gap-2">
              Shop Collection <ArrowRight className="transition-transform duration-300 group-hover:translate-x-1" size={16} />
            </span>
          </Button>
        </Link>

        <Link href="/services">
          <Button size="xl" variant="secondary">
            Our Services
          </Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
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
    <section
      ref={sectionRef}
      className="relative h-[90vh] min-h-175 w-full overflow-hidden bg-neutral-900"
    >
      <motion.div className="embla h-full" ref={emblaRef} style={{ opacity, scale }}>
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

              <div className="absolute inset-0 bg-linear-to-r from-neutral-900/60 via-neutral-900/30 to-transparent" />

              <SlideContent slide={slide} index={i} />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Progress dots */}
      <div className="absolute right-5 bottom-1/2 z-20 flex translate-y-1/2 flex-col items-center gap-2 sm:right-10">
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
