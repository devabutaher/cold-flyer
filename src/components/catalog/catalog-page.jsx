"use client";

import { Suspense } from "react";
import { CatalogFilters } from "./catalog-filters";
import { CatalogGrid } from "./catalog-grid";

export function CatalogPage({
  type = "product",
  searchComponent: SearchComponent,
  apiFetchFn,
  getFilterOptions = () => ({}),
  extraFilterOptions = [],
  defaultSort = "All Products",
  filterFn,
  sortFn,
  itemLabel,
}) {
  return (
    <>
      <Suspense
        fallback={
          <div className="py-4 flex items-center gap-3 overflow-x-auto min-w-0">
            <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
              <span className="text-[10px] font-black uppercase tracking-widest">Filters:</span>
            </div>
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="h-8 w-28 bg-muted animate-pulse rounded" />
            <div className="ml-auto w-48 h-8 bg-muted animate-pulse rounded" />
          </div>
        }
      >
        <CatalogFilters
          type={type}
          searchComponent={SearchComponent}
          apiFetchFn={apiFetchFn}
          getFilterOptions={getFilterOptions}
          extraFilterOptions={extraFilterOptions}
          defaultSort={defaultSort}
        />
      </Suspense>
      <CatalogGrid type={type} apiFetchFn={apiFetchFn} filterFn={filterFn} sortFn={sortFn} itemLabel={itemLabel} />
    </>
  );
}

export default CatalogPage;
