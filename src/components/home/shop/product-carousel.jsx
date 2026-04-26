"use client";

import { Button } from "@/components/ui/button";
import { useEmblaSlider } from "@/hooks/use-embla-slider";
import Autoplay from "embla-carousel-autoplay";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import Link from "next/link";
import ProductCard from "./product-card";

export default function ProductCarousel({
  title,
  tag,
  items,
  catalogLabel,
  catalogLink,
}) {
  const { emblaRef, emblaApi } = useEmblaSlider(
    {
      loop: true,
      align: "start",
    },
    [Autoplay({ delay: 4000, stopOnInteraction: true })],
  );

  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
            {tag}
          </span>

          <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
            {title}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="secondary" onClick={() => emblaApi?.scrollPrev()}>
            <ChevronLeft size={16} />
          </Button>

          <Button variant="secondary" onClick={() => emblaApi?.scrollNext()}>
            <ChevronRight size={16} />
          </Button>

          <Link href={catalogLink}>
            <Button className="ml-2 hidden sm:flex">
              {catalogLabel}
              <ArrowRight size={14} />
            </Button>
          </Link>
        </div>
      </div>

      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {items.map((item) => (
            <div
              key={item.id}
              className="embla__slide basis-[85%] px-2 sm:basis-1/2 lg:basis-1/3"
            >
              <div className="h-full">
                <ProductCard product={item} />
              </div>
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
  );
}
