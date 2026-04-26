"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heroSliderData } from "@/data/hero-slider-data";
import { useEmblaSlider } from "@/hooks/use-embla-slider"; // Adjust path as needed
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  return (
    <section className="relative h-[90vh] min-h-175 w-full overflow-hidden bg-foreground">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container flex h-full">
          {heroSliderData.map((slide, i) => (
            <div
              key={i}
              className="embla__slide relative h-full min-w-0 flex-[0_0_100%]"
            >
              <Image
                src={slide.img}
                alt={slide.headline}
                fill
                sizes="100vw"
                priority={i === 0}
                className="absolute inset-0 object-cover object-center opacity-55"
              />

              <div className="absolute inset-0 bg-linear-to-r from-foreground/50 via-foreground/20 to-transparent" />

              <div className="container relative z-10 flex h-full flex-col items-start justify-center">
                <Badge className="mb-4 border-0 bg-primary/20 uppercase text-primary backdrop-blur-sm sm:mb-5">
                  {slide.badge}
                </Badge>

                <h1 className="mb-4 max-w-2xl text-3xl font-extrabold leading-[1.05] text-white sm:text-5xl md:text-7xl">
                  {slide.headline}
                  <br />
                  <span className="text-primary">{slide.highlight}</span>
                </h1>

                <p className="mb-7 max-w-lg text-sm leading-relaxed text-white/70 sm:text-base md:text-lg">
                  {slide.sub}
                </p>

                <div className="flex flex-wrap gap-2">
                  <Link href={"/items"}>
                    <Button size="xl">
                      Shop Collection <ArrowRight className="ml-2" size={16} />
                    </Button>
                  </Link>

                  <Link href={"/services"}>
                    <Button size="xl" variant="secondary">
                      Our Services
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute right-5 bottom-1/2 z-20 flex translate-y-1/2 flex-col items-center gap-2 sm:right-10">
        {heroSliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "h-5 w-1.5 bg-primary md:h-8 md:w-2.5"
                : "h-1.5 w-1.5 bg-white/30 hover:bg-white/60 md:h-2.5 md:w-2.5"
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
