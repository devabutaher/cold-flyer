"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { heroSliderData } from "@/data/hero-slider-data";
import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function Hero() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [
    Autoplay({ delay: 5000, stopOnInteraction: false }),
  ]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => emblaApi.off("select", onSelect);
  }, [emblaApi]);

  return (
    <section className="relative h-[90vh] min-h-175 w-full overflow-hidden bg-foreground">
      <div className="embla h-full" ref={emblaRef}>
        <div className="embla__container h-full">
          {heroSliderData.map((slide, i) => (
            <div
              key={i}
              className="embla__slide flex-[0_0_100%] relative h-full"
            >
              <Image
                src={slide.img}
                alt={slide.headline}
                fill
                priority
                className="absolute inset-0 w-full h-full object-cover object-center opacity-55"
              />
              <div className="absolute inset-0 bg-linear-to-r from-foreground/50 via-foreground/20 to-transparent" />

              <div className="relative z-10 h-full container flex flex-col justify-center items-start">
                <Badge className="mb-4 sm:mb-5 backdrop-blur-sm bg-primary/20 text-primary border-0 uppercase">
                  {slide.badge}
                </Badge>
                <h1 className="font-sans font-extrabold text-white text-3xl sm:text-5xl md:text-7xl leading-[1.05] mb-4 max-w-2xl">
                  {slide.headline}
                  <br />
                  <span className="text-primary">{slide.highlight}</span>
                </h1>
                <p className="text-white/70 text-sm sm:text-base md:text-lg max-w-lg mb-7 leading-relaxed">
                  {slide.sub}
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="xl">
                    Shop Collection <ArrowRight size={16} />
                  </Button>
                  <Button size="xl" variant="secondary">
                    Our Services
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* dot indicators */}
      <div className="absolute bottom-1/2 right-5 sm:right-10 z-20 flex flex-col items-center gap-2">
        {heroSliderData.map((_, i) => (
          <button
            key={i}
            onClick={() => emblaApi?.scrollTo(i)}
            className={`rounded-full transition-all duration-300 ${
              i === selectedIndex
                ? "h-5 w-1.5 md:h-8 md:w-2.5 bg-primary"
                : "h-1.5 w-1.5 md:h-2.5 md:w-2.5 bg-white/30 hover:bg-white/60"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
