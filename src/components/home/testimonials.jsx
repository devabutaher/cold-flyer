"use client";

import { getData } from "@/data";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
import { Button } from "../ui/button";
import { animations, staggerItem } from "@/lib/animation";
import { useTranslations, useLocale } from "next-intl";

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
  const t = useTranslations("home");
  const locale = useLocale();
  const reviews = getData("reviews", locale);
  const { emblaRef, emblaApi, selectedIndex } = useEmblaSlider({ align: "start" }, [
    Autoplay({ delay: 4500, stopOnInteraction: true }),
  ]);

  const progress = ((selectedIndex + 1) / reviews.length) * 100;

  return (
    <AnimatedSection className="py-16 bg-background">
      <div className="container">
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">{t("whatCustomersSay")}</span>
            <h2 className="font-sans font-extrabold text-2xl md:text-3xl text-foreground mt-1">
              {t("testimonialsTitle")}
            </h2>
          </div>
        </div>

        <div className="overflow-hidden relative" ref={emblaRef}>
          <div className="flex gap-5">
            {reviews.map((review, i) => (
              <div key={i} className="min-w-0 flex-[0_0_100%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%]">
                <TestimonialCard review={review} index={i} />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous review"
          >
            <ChevronLeft size={18} />
          </Button>
          <div className="h-1.5 w-40 bg-secondary rounded-full overflow-hidden">
            <div className="h-full bg-primary rounded-full transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next review"
          >
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
    </AnimatedSection>
  );
}
