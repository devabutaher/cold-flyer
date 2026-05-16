"use client";

import { Button } from "@/components/ui/button";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { motion } from "framer-motion";
import { AnimatedSection } from "@/components/ui/animated-section";
import { animations } from "@/lib/animation";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import { CatalogCard } from "../../catalog/catalog-card";

export default function ProductCarousel({ title, tag, items, catalogLabel, catalogLink, renderCard }) {
  const { emblaRef, emblaApi } = useEmblaSlider(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  return (
    <AnimatedSection className="w-full">
      <div>
        <div className="mb-5 flex items-end justify-between gap-3">
          <div>
            <motion.span
              className="text-[10px] font-bold uppercase tracking-widest text-primary"
              variants={animations.entrance.fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={animations.inView.once}
              transition={{ duration: 0.3 }}
            >
              {tag}
            </motion.span>

            <motion.h2
              className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl"
              variants={animations.entrance.fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={animations.inView.once}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              {title}
            </motion.h2>
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

            <Link href={catalogLink}>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Button className="ml-2 hidden sm:flex">
                  {catalogLabel}
                  <ArrowRight size={14} />
                </Button>
              </motion.div>
            </Link>
          </div>
        </div>

        <div className="embla" ref={emblaRef}>
          <div className="embla__container">
            {items.map((item, index) => (
              <div key={item._id ?? item.id} className="embla__slide basis-[85%] px-2 sm:basis-1/2 lg:basis-1/3">
                <motion.div
                  className="h-full"
                  variants={animations.entrance.fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={animations.inView.once}
                  transition={{ duration: 0.35, delay: index * 0.05 }}
                >
                  {renderCard ? (
                    renderCard(item, index)
                  ) : (
                    <CatalogCard item={item} type="product" animate={false} index={index} />
                  )}
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 flex justify-center sm:hidden">
          <Link href={catalogLink}>
            <Button>
              {catalogLabel}
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>
    </AnimatedSection>
  );
}
