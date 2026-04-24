"use client";

import useEmblaCarousel from "embla-carousel-react";
import { useEffect, useState } from "react";

export function useEmblaSlider(options = {}, plugins = []) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      ...options,
    },
    plugins,
  );

  useEffect(() => {
    if (!emblaApi) return;

    const update = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
    };

    emblaApi.on("select", update);
    emblaApi.on("reInit", update);

    update();

    return () => {
      emblaApi.off("select", update);
      emblaApi.off("reInit", update);
    };
  }, [emblaApi]);

  return {
    emblaRef,
    emblaApi,
    selectedIndex,
    canScrollPrev,
    canScrollNext,
  };
}
