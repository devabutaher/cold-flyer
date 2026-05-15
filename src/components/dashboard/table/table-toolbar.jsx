"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SearchIcon, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

function FilterSelect({ table, columnId, placeholder, allLabel = "All", options = [] }) {
  const col = table.getColumn(columnId);
  const filterValue = col?.getFilterValue();

  // Track selected value locally for display
  const [selected, setSelected] = useState(filterValue || "all");

  // Update when column filter changes externally
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelected(filterValue || "all");
  }, [filterValue]);

  // Handle string options - keep original value
  const displayOptions = options.map((opt) => {
    const str = String(opt);
    const label = str.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      value: str,
      label,
    };
  });

  return (
    <Select
      value={selected}
      onValueChange={(v) => {
        setSelected(v);
        col?.setFilterValue(v === "all" ? undefined : v);
      }}
    >
      <SelectTrigger className="h-9 w-40 text-sm">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">{allLabel}</SelectItem>
        {displayOptions.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export function TableToolbar({ table, searchPlaceholder = "Search…", filters = [], actions, selectedLabel = "rows" }) {
  const [searchValue, setSearchValue] = useState(table.getState().globalFilter || "");

  // Sync search value with table state
  useEffect(() => {
    const handler = setTimeout(() => {
      table.setGlobalFilter(searchValue);
    }, 300);
    return () => clearTimeout(handler);
  }, [searchValue, table]);

  const selectedCount = table.getSelectedRowModel().rows.length;
  const isFiltered = searchValue || table.getState().columnFilters.length > 0;

  const clearAll = () => {
    setSearchValue("");
    table.setGlobalFilter("");
    table.resetColumnFilters();
  };

  // Build filter options - prefer provided options, fallback to table values
  const filterOptionsMap = useMemo(() => {
    const map = {};
    filters.forEach((f) => {
      // Use provided options if available
      if (f.options && f.options.length > 0) {
        map[f.columnId] = f.options;
        return;
      }
      // Otherwise get from table column
      const col = table.getColumn(f.columnId);
      if (col) {
        const values = Array.from(col.getFacetedUniqueValues().keys()).sort();
        map[f.columnId] = values;
      }
    });
    return map;
  }, [table, filters]);

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
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
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
            options={filterOptionsMap[f.columnId] || f.options || []}
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
