"use client";

import { sortOptions } from "@/data/filtering-options";
import { useProductSearch } from "@/hooks/use-product-search";
import { ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { NavSearch } from "../layout/navbar/nav-search";
import FilterDropdown from "../ui/filter-dropdown";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const q = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "";
  const brandParam = searchParams.get("brand") || "";
  const sortParam = searchParams.get("sort") || "All Products";

  const { products } = useProductSearch({
    q,
    category: categoryParam,
    brand: brandParam,
    sort: sortParam,
  });

  const categories = [
    ...new Set(products?.map((p) => p.category).filter(Boolean)),
  ].sort();
  const brands = [
    ...new Set(products?.map((p) => p.brand).filter(Boolean)),
  ].sort();

  const handleFilterChange = (key, value) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value === `All ${key}s` || value === "All Products") {
      params.delete(key.toLowerCase());
    } else {
      params.set(key.toLowerCase(), value);
    }

    params.set("page", "1");
    router.push(`/items?${params.toString()}`);
  };

  return (
    <div className="py-3 flex flex-col lg:flex-row items-start lg:items-center gap-3">
      <div className="flex items-center gap-2 text-muted-foreground">
        <ListFilter size={15} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Filters:
        </span>
      </div>
      <div className="w-full lg:w-max lg:order-2 lg:ml-auto shrink-0">
        <Suspense
          fallback={
            <div className="w-full h-8 bg-muted animate-pulse rounded" />
          }
        >
          <NavSearch />
        </Suspense>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 w-full lg:order-1">
        <FilterDropdown
          value={categoryParam || "All Categories"}
          options={["All Categories", ...categories]}
          onChange={(val) => handleFilterChange("Category", val)}
        />
        <FilterDropdown
          value={brandParam || "All Brands"}
          options={["All Brands", ...brands]}
          onChange={(val) => handleFilterChange("Brand", val)}
        />
        <FilterDropdown
          value={sortParam}
          options={sortOptions}
          onChange={(val) => handleFilterChange("Sort", val)}
        />
      </div>
    </div>
  );
}
