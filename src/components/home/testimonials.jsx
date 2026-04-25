"use client";

import { reviews } from "@/data/reviews-data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "../ui/button";

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={
            i < count
              ? "fill-primary text-primary"
              : "text-muted-foreground fill-muted-foreground"
          }
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const { emblaRef, emblaApi, selectedIndex, canScrollPrev, canScrollNext } =
    useEmblaSlider({ align: "start" }, [
      Autoplay({ delay: 4500, stopOnInteraction: true }),
    ]);

  return (
    <section className="py-16 bg-background">
      <div className="container">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
              Client Stories
            </span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Words of <span className="text-primary">Satisfaction.</span>
            </h2>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={() => emblaApi?.scrollPrev()}>
              <ChevronLeft size={16} />
            </Button>

            <Button variant="secondary" onClick={() => emblaApi?.scrollNext()}>
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-4 px-4">
            {reviews.map((r) => (
              <div
                key={r.name}
                className="embla__slide flex-[0_0_90%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] shrink-0"
              >
                <div className="bg-secondary rounded-xl p-6 h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 relative">
                  <Quote
                    size={28}
                    className="text-primary/20 absolute top-5 right-5"
                  />
                  <Stars count={r.stars} />
                  <p className="text-muted-foreground text-sm leading-relaxed flex-1 mb-5">
                    "{r.body}"
                  </p>
                  <div className="flex items-center gap-3 border-t border-border pt-4">
                    <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-sm shrink-0">
                      {r.avatar}
                    </div>
                    <div>
                      <p className="font-sans font-bold text-foreground text-sm">
                        {r.name}
                      </p>
                      <p className="text-muted-foreground text-xs">{r.role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-center gap-2 mt-6">
          {reviews.map((_, i) => (
            <button
              key={i}
              onClick={() => emblaApi?.scrollTo(i)}
              className={`rounded-full transition-all duration-300 ${
                i === selectedIndex
                  ? "w-6 h-2 bg-primary"
                  : "w-2 h-2 bg-border hover:bg-muted-foreground"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
