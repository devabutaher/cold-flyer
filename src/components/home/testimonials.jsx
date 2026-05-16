"use client";

import { reviews } from "@/data/reviews-data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "../ui/button";
import { animations, staggerItem } from "@/lib/animation";

function Stars({ count }) {
  return (
    <div className="flex gap-0.5 mb-3">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < count ? "fill-primary text-primary" : "text-muted-foreground fill-muted-foreground"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({ review, index }) {
  return (
    <motion.div
      variants={staggerItem}
      initial="hidden"
      whileInView="visible"
      viewport={animations.inView.once}
      whileHover={{ y: -3 }}
    >
      <div className="bg-secondary rounded-xl p-5 h-full flex flex-col shadow-sm hover:shadow-lg transition-shadow duration-300 relative min-h-[220px] sm:min-h-[200px]">
        <Quote size={28} className="text-primary/20 absolute top-4 right-4" />
        <Stars count={review.stars} />
        <p className="text-muted-foreground text-sm leading-relaxed flex-1 line-clamp-4 mb-4">
          &#34;{review.body}&#34;
        </p>
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <div className="w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-sans font-bold text-sm shrink-0">
            {review.avatar}
          </div>
          <div>
            <p className="font-sans font-bold text-foreground text-sm">{review.name}</p>
            <p className="text-muted-foreground text-xs">{review.role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function Testimonials() {
  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ align: "start" }, [
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  ]);

  const progress = ((selectedIndex + 1) / reviews.length) * 100;

  return (
    <AnimatedSection className="py-16 bg-background">
      <div className="container">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Client Stories</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              Words of <span className="text-primary">Satisfaction.</span>
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" onClick={() => emblaApi?.scrollPrev()}>
                <ChevronLeft size={16} />
              </Button>
            </motion.div>

            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button variant="secondary" onClick={() => emblaApi?.scrollNext()}>
                <ChevronRight size={16} />
              </Button>
            </motion.div>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container gap-4 px-4" style={{ minHeight: "240px" }}>
            {reviews.map((r, i) => (
              <div key={r.name} className="embla__slide flex-[0_0_90%] sm:flex-[0_0_48%] lg:flex-[0_0_31%] shrink-0">
                <TestimonialCard review={r} index={i} />
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar indicator */}
        <div className="mt-6 flex flex-col items-center gap-3">
          <div className="flex items-center gap-3 w-full max-w-md">
            <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
              {String(selectedIndex + 1).padStart(2, "0")}
            </span>
            <div className="relative flex-1 h-1 rounded-full bg-border overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 bg-primary rounded-full"
                initial={{ width: `${progress}%` }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <span className="text-[10px] font-bold text-muted-foreground tabular-nums">
              {String(reviews.length).padStart(2, "0")}
            </span>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === selectedIndex ? "w-6 h-2 bg-primary" : "w-2 h-2 bg-border hover:bg-muted-foreground"
                }`}
                aria-label={`Go to review ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </AnimatedSection>
  );
}
