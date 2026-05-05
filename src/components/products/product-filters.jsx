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
    <div className="py-4 flex flex-col md:flex-row items-start md:items-center gap-3">
      <div className="w-full md:w-max md:order-2 md:ml-auto shrink-0">
        <Suspense
          fallback={
            <div className="w-full h-8 bg-muted animate-pulse rounded" />
          }
        >
          <NavSearch />
        </Suspense>
      </div>

      <div className="flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-none w-full md:order-1">
        <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
          <ListFilter size={15} strokeWidth={2.5} />
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filters:
          </span>
        </div>

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
