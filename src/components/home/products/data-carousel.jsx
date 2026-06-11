"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import ProductCarousel from "./product-carousel";

function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-card">
      <Skeleton className="h-52 w-full" />
      <div className="flex flex-1 flex-col justify-between gap-2 p-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-full" />
        </div>
        <div className="flex items-center justify-between gap-3">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function CarouselSkeleton() {
  return (
    <div>
      <div className="mb-5 flex items-end justify-between gap-3">
        <div>
          <Skeleton className="h-3 w-12 mb-1" />
          <Skeleton className="h-7 w-40" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-9 rounded-md" />
          <Skeleton className="h-9 w-9 rounded-md" />
        </div>
      </div>
      <div className="flex gap-4 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div key={i} className="basis-[85%] px-2 sm:basis-1/2 lg:basis-1/3">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DataCarousel({
  items: externalItems,
  loading: externalLoading,
  title,
  tag,
  catalogLabel,
  catalogLink,
  renderCard,
  renderSkeleton,
  enabled = true,
  className = "container py-10",
}) {
  if (!enabled) return null;

  const loading = externalLoading ?? false;
  const items = externalItems ?? [];

  return (
    <AnimatedSection className={className}>
      {loading ? (
        renderSkeleton ? (
          <div>
            <div className="mb-5 flex items-end justify-between gap-3">
              <div>
                <Skeleton className="h-3 w-12 mb-1" />
                <Skeleton className="h-7 w-40" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-md" />
                <Skeleton className="h-9 w-9 rounded-md" />
              </div>
            </div>
            <div className="flex gap-4 overflow-hidden">
              {[1, 2, 3].map((i) => (
                <div key={i} className="basis-[85%] px-2 sm:basis-1/2 lg:basis-1/3">
                  {renderSkeleton(i)}
                </div>
              ))}
            </div>
          </div>
        ) : (
          <CarouselSkeleton />
        )
      ) : items.length > 0 ? (
        <ProductCarousel
          title={title}
          tag={tag}
          items={items}
          catalogLabel={catalogLabel}
          catalogLink={catalogLink}
          renderCard={renderCard}
        />
      ) : null}
    </AnimatedSection>
  );
}

export default DataCarousel;
