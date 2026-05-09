"use client";

import ItemsPageContent from "@/components/products/items-page";

export default function ACPartsPage() {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Replacements
        </span>
        <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
          Precision AC Parts
        </h2>
      </div>
      <ItemsPageContent />
    </div>
  );
}