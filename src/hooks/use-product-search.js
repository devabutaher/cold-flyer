import { acParts, acUnits } from "@/data/products-data";
import { useMemo } from "react";

export function useProductSearch({
  q = "",
  category = "",
  brand = "",
  sort = "Price: Low to High",
}) {
  return useMemo(() => {
    let results = [...acUnits, ...acParts];

    if (q?.trim()) {
      const lower = q.toLowerCase();
      results = results.filter(
        (p) =>
          p.name?.toLowerCase().includes(lower) ||
          p.sub?.toLowerCase().includes(lower) ||
          p.category?.toLowerCase().includes(lower) ||
          p.brand?.toLowerCase().includes(lower),
      );
    }

    if (category && category !== "All Categories") {
      results = results.filter((p) => p.category === category);
    }

    if (brand && brand !== "All Brands") {
      results = results.filter((p) => p.brand === brand);
    }

    switch (sort) {
      case "Price: Low to High":
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case "Price: High to Low":
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case "Best Rated":
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      case "Most Popular":
        results = [...results].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
    }

    return results;
  }, [q, category, brand, sort]);
}
