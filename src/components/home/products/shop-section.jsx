"use client";

import { AnimatedSection } from "@/components/ui/animated-section";
import { Skeleton } from "@/components/ui/skeleton";
import { apiGet } from "@/lib/api-client";
import { useEffect, useState } from "react";
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
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="basis-[85%] px-2 sm:basis-1/2 lg:basis-1/3">
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ShopSection() {
  const [acUnits, setAcUnits] = useState([]);
  const [acParts, setAcParts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const [unitsRes, partsRes] = await Promise.all([
          apiGet("/products?productType=unit&limit=10"),
          apiGet("/products?productType=part&limit=10"),
        ]);

        let units = [];
        let parts = [];

        if (Array.isArray(unitsRes)) units = unitsRes;
        else if (Array.isArray(unitsRes?.data)) units = unitsRes.data;
        else if (Array.isArray(unitsRes?.data?.products)) units = unitsRes.data.products;
        else if (Array.isArray(unitsRes?.products)) units = unitsRes.products;

        if (Array.isArray(partsRes)) parts = partsRes;
        else if (Array.isArray(partsRes?.data)) parts = partsRes.data;
        else if (Array.isArray(partsRes?.data?.products)) parts = partsRes.data.products;
        else if (Array.isArray(partsRes?.products)) parts = partsRes.products;

        setAcUnits(units);
        setAcParts(parts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  return (
    <AnimatedSection className="container py-10">
      <div className="space-y-10">
        {loading ? (
          <CarouselSkeleton />
        ) : acUnits.length > 0 ? (
          <ProductCarousel
            title="Premium AC Units"
            tag="Our Store"
            items={acUnits}
            catalogLabel="View Full Catalog"
            catalogLink="/items?productType=unit"
          />
        ) : null}

        {loading ? (
          <CarouselSkeleton />
        ) : acParts.length > 0 ? (
          <ProductCarousel
            title="Precision AC Parts"
            tag="Replacements"
            items={acParts}
            catalogLabel="Explore Parts"
            catalogLink="/items?productType=part"
          />
        ) : null}
      </div>
    </AnimatedSection>
  );
}
