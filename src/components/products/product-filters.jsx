"use client";

import { Button } from "@/components/ui/button";
import { brands, categories, sortOptions } from "@/data/filtering-options";
import { Check, ListFilter } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { NavSearch } from "../layout/navbar/shared";
import FilterDropdown from "../ui/filter-dropdown";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [category, setCategory] = useState(
    searchParams.get("category") ?? "All Categories",
  );
  const [brand, setBrand] = useState(searchParams.get("brand") ?? "All Brands");
  const [sort, setSort] = useState(searchParams.get("sort") ?? "All Products");

  useEffect(() => {
    setCategory(searchParams.get("category") ?? "All Categories");
    setBrand(searchParams.get("brand") ?? "All Brands");
    setSort(searchParams.get("sort") ?? "All Products");
  }, [searchParams]);

  const handleApply = () => {
    const params = new URLSearchParams(searchParams.toString());

    if (category !== "All Categories") {
      params.set("category", category);
    } else {
      params.delete("category");
    }

    if (brand !== "All Brands") {
      params.set("brand", brand);
    } else {
      params.delete("brand");
    }

    if (sort !== "All Products") {
      params.set("sort", sort);
    } else {
      params.delete("sort");
    }

    params.set("sort", sort);
    router.push(`/items?${params.toString()}`);
  };

  return (
    <div className="py-4 flex items-center gap-3 overflow-x-auto scrollbar-none min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
        <ListFilter size={15} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Filters:
        </span>
      </div>

      <FilterDropdown
        value={category}
        options={categories}
        onChange={setCategory}
      />
      <FilterDropdown value={brand} options={brands} onChange={setBrand} />
      <FilterDropdown value={sort} options={sortOptions} onChange={setSort} />
      <div className="hidden md:block">
        <NavSearch />
      </div>

      <div className="ml-auto shrink-0">
        <Button
          onClick={handleApply}
          className="gap-1.5 px-5 whitespace-nowrap"
        >
          <Check size={14} strokeWidth={3} />
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
