import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SearchIcon } from "lucide-react";
import { useMemo } from "react";

export function TopFilters({ table }) {
  const categoryOptions = useMemo(() => {
    const col = table.getColumn("category");
    if (!col) return [];
    return Array.from(col.getFacetedUniqueValues().keys()).sort();
  }, [table.getColumn("category")?.getFacetedUniqueValues()]);

  const brandOptions = useMemo(() => {
    const col = table.getColumn("brand");
    if (!col) return [];
    return Array.from(col.getFacetedUniqueValues().keys()).sort();
  }, [table.getColumn("brand")?.getFacetedUniqueValues()]);

  const categoryFilter = table.getColumn("category")?.getFilterValue() ?? "all";
  const brandFilter = table.getColumn("brand")?.getFilterValue() ?? "all";

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Global search */}
      <div className="relative">
        <SearchIcon
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          placeholder="Search products..."
          value={table.getState().globalFilter ?? ""}
          onChange={(e) => table.setGlobalFilter(e.target.value)}
          className="pl-8 w-52"
        />
      </div>

      {/* Category */}
      <Select
        value={categoryFilter?.toString() ?? "all"}
        onValueChange={(v) =>
          table
            .getColumn("category")
            ?.setFilterValue(v === "all" ? undefined : v)
        }
      >
        <SelectTrigger className="w-44">
          <SelectValue placeholder="All Categories" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categoryOptions.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Brand */}
      <Select
        value={brandFilter?.toString() ?? "all"}
        onValueChange={(v) =>
          table.getColumn("brand")?.setFilterValue(v === "all" ? undefined : v)
        }
      >
        <SelectTrigger className="w-36">
          <SelectValue placeholder="All Brands" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Brands</SelectItem>
          {brandOptions.map((v) => (
            <SelectItem key={v} value={v}>
              {v}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
