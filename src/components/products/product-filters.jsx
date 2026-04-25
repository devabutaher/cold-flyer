"use client";

import { Button } from "@/components/ui/button";
import { Check, ListFilter } from "lucide-react";
import { useState } from "react";
import FilterDropdown from "../ui/filter-dropdown";

const categories = [
  "All Categories",
  "Split AC",
  "Window AC",
  "Cassette AC",
  "Duct System",
  "Air Purifier",
];

const brands = [
  "All Brands",
  "Daikin",
  "LG",
  "Samsung",
  "Carrier",
  "Mitsubishi",
  "Hyundai",
];

const sortOptions = [
  "Price: Low to High",
  "Price: High to Low",
  "Newest First",
  "Best Rated",
  "Most Popular",
];

export default function ProductFilters({ onApply }) {
  const [category, setCategory] = useState("All Categories");
  const [brand, setBrand] = useState("All Brands");
  const [sort, setSort] = useState("Price: Low to High");

  const handleApply = () => {
    onApply?.({ category, brand, sort });
  };

  return (
    <div className="py-4 flex items-center gap-2 overflow-x-auto scrollbar-none min-w-0">
      {/* Label */}
      <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
        <ListFilter size={15} strokeWidth={2.5} />
        <span className="text-[10px] font-black uppercase tracking-widest">
          Filters:
        </span>
      </div>

      {/* Category */}
      <FilterDropdown
        value={category}
        options={categories}
        onChange={setCategory}
      />

      {/* Brand */}
      <FilterDropdown value={brand} options={brands} onChange={setBrand} />

      {/* Sort */}
      <FilterDropdown value={sort} options={sortOptions} onChange={setSort} />

      {/* Apply */}
      <div className="ml-auto shrink-0">
        <Button
          size="sm"
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
