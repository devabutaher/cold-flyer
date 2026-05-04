"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon, X } from "lucide-react";

function FilterSelect({ table, columnId, placeholder, allLabel = "All" }) {
  const col = table.getColumn(columnId);
  const options = col
    ? Array.from(col.getFacetedUniqueValues().keys()).sort()
    : [];
  const value = col?.getFilterValue() ?? "all";

  return (
    <Select
      value={value?.toString() ?? "all"}
      onValueChange={(v) => col?.setFilterValue(v === "all" ? undefined : v)}
    >
      <SelectTrigger className="h-9 w-40 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {options.map((v) => (
          <SelectItem key={v} value={v}>
            {v}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TableToolbar({
  table,
  searchPlaceholder = "Search…",
  filters = [],
  actions,
  selectedLabel = "rows",
}) {
  const selectedCount = table.getSelectedRowModel().rows.length;
  const isFiltered =
    table.getState().globalFilter || table.getState().columnFilters.length > 0;

  const clearAll = () => {
    table.setGlobalFilter("");
    table.resetColumnFilters();
  };

  return (
    <>
      {/* Left: search + column filters */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Global search */}
        <div className="relative">
          <SearchIcon
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
          />
          <Input
            placeholder={searchPlaceholder}
            value={table.getState().globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(e.target.value)}
            className="pl-8 h-9 w-52 text-sm"
          />
        </div>

        {/* Column filters */}
        {filters.map((f) => (
          <FilterSelect
            key={f.columnId}
            table={table}
            columnId={f.columnId}
            placeholder={f.placeholder}
            allLabel={f.allLabel}
          />
        ))}

        {/* Clear filters */}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-9 gap-1.5 text-muted-foreground hover:text-foreground"
          >
            <X size={13} />
            Clear
          </Button>
        )}
      </div>

      {/* Right: selection count + custom actions */}
      <div className="flex items-center gap-2 ml-auto">
        {selectedCount > 0 && (
          <Badge variant="secondary" className="font-normal text-xs">
            {selectedCount} {selectedLabel} selected
          </Badge>
        )}
        {actions}
      </div>
    </>
  );
}
