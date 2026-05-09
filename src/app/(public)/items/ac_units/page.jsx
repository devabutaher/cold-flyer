"use client";

import ItemsPageContent from "@/components/products/items-page";

export default function ACUnitsPage() {
  return (
    <div className="space-y-4">
      <div>
        <span className="text-[10px] font-bold uppercase tracking-widest text-primary">
          Our Store
        </span>
        <h2 className="mt-1 text-xl font-extrabold text-foreground sm:text-2xl md:text-3xl">
          Premium AC Units
        </h2>
      </div>
      <ItemsPageContent />
    </div>
  );
}