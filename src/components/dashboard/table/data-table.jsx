"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Pagination, PaginationContent, PaginationItem } from "@/components/ui/pagination";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import {
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { getNestedValue } from "@/lib/get-nested-value";
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useCallback, useId, useRef, useState } from "react";
import { TableSkeleton } from "./table-skeleton";

const NAV_BUTTONS = [
  {
    key: "first",
    Icon: ChevronFirstIcon,
    action: (t) => t.firstPage(),
    canDo: (t) => t.getCanPreviousPage(),
    label: "First page",
  },
  {
    key: "prev",
    Icon: ChevronLeftIcon,
    action: (t) => t.previousPage(),
    canDo: (t) => t.getCanPreviousPage(),
    label: "Previous page",
  },
  {
    key: "next",
    Icon: ChevronRightIcon,
    action: (t) => t.nextPage(),
    canDo: (t) => t.getCanNextPage(),
    label: "Next page",
  },
  {
    key: "last",
    Icon: ChevronLastIcon,
    action: (t) => t.lastPage(),
    canDo: (t) => t.getCanNextPage(),
    label: "Last page",
  },
];

export function DataTable({
  columns,
  data = [],
  loading = false,
  emptyMessage = "No results found.",
  emptyIcon,
  emptyAction,
  toolbar,
  rowCount = "rows",
  pageSizes = [5, 10, 20, 50],
  defaultSort = [],
  getRowId,
  onRowClick,
  stickyHeader = false,
  className,
  searchFields,
}) {
  const id = useId();
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState(defaultSort);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: pageSizes[1] ?? 10,
  });
  const searchFieldsRef = useRef(searchFields);
  searchFieldsRef.current = searchFields;

  const customGlobalFilter = useCallback((row, _columnId, filterValue) => {
    const fields = searchFieldsRef.current;
    if (!fields || fields.length === 0) {
      const value = row.getValue(_columnId);
      if (value == null) return false;
      return String(value).toLowerCase().includes(String(filterValue).toLowerCase());
    }
    if (!filterValue) return true;
    const search = String(filterValue).toLowerCase();
    return fields.some((field) => {
      const value = getNestedValue(row.original, field);
      if (value == null) return false;
      if (Array.isArray(value)) {
        return value.some((v) => String(v ?? "").toLowerCase().includes(search));
      }
      return String(value).toLowerCase().includes(search);
    });
  }, []);

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    getRowId: getRowId ?? ((row) => row._id ?? row.id ?? Math.random().toString()),
    state: { sorting, columnFilters, rowSelection, pagination, globalFilter },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    globalFilterFn: customGlobalFilter,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    enableSortingRemoval: false,
  });

  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getRowCount();
  const from = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const to = Math.min((pageIndex + 1) * pageSize, totalRows);

  return (
    <div className={cn("flex flex-col gap-4 w-full", className)}>
      {/* ── Toolbar slot ─────────────────────────────── */}
      {toolbar && <div className="flex flex-wrap items-center justify-between gap-3">{toolbar(table)}</div>}

      {/* ── Mobile table with horizontal scroll ──────── */}
      <div className="md:hidden">
        <div className="relative rounded-xl border border-border bg-card overflow-hidden shadow-sm">
          <div
            className="overflow-x-auto overscroll-x-contain snap-x snap-mandatory"
            style={{ WebkitOverflowScrolling: "touch", scrollbarWidth: "none" }}
          >
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id} className="bg-muted/60 hover:bg-muted/60 border-b border-border">
                    {hg.headers.map((header) => (
                      <TableHead
                        key={header.id}
                        style={{
                          minWidth: header.column.columnDef.minSize ?? 120,
                          width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                        }}
                        className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground px-3 whitespace-nowrap"
                      >
                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                          <button
                            className="flex items-center gap-1.5 cursor-pointer select-none hover:text-foreground transition-colors"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(header.column.columnDef.header, header.getContext())}
                            {header.column.getIsSorted() === "asc" && (
                              <ChevronUpIcon size={13} className="opacity-70" />
                            )}
                            {header.column.getIsSorted() === "desc" && (
                              <ChevronDownIcon size={13} className="opacity-70" />
                            )}
                            {!header.column.getIsSorted() && header.column.getCanSort() && (
                              <ChevronUpIcon size={13} className="opacity-20" />
                            )}
                          </button>
                        ) : (
                          flexRender(header.column.columnDef.header, header.getContext())
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="p-0">
                      <div className="space-y-3 p-4">
                        {[...Array(Math.min(pageSize, 5))].map((_, i) => (
                          <div key={i} className="flex gap-3">
                            <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                            <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                            <div className="h-4 bg-muted rounded animate-pulse w-16" />
                          </div>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : table.getRowModel().rows.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                      onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                      className={cn(
                        "border-b border-border/60 transition-colors snap-start",
                        "hover:bg-muted/30 data-[state=selected]:bg-primary/5",
                        onRowClick && "cursor-pointer",
                      )}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id} className="px-3 py-3 whitespace-nowrap text-sm">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center">
                      <div className="flex flex-col items-center gap-3 text-muted-foreground">
                        {emptyIcon && <div className="opacity-40">{emptyIcon}</div>}
                        <p className="text-sm">{emptyMessage}</p>
                        {emptyAction}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Scroll indicator fade */}
          <div className="pointer-events-none absolute top-[3.25rem] right-0 bottom-0 w-8 bg-gradient-to-l from-card/80 to-transparent md:hidden" />
        </div>

        {/* Scroll hint */}
        <div className="flex items-center justify-center gap-1.5 mt-2 text-xs text-muted-foreground md:hidden">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="opacity-50">
            <path
              d="M6 3L2 8l4 5M10 3l4 5-4 5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Swipe to see more</span>
        </div>
      </div>

      {/* ── Desktop table (hidden on mobile) ─────────── */}
      <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className={cn(stickyHeader && "sticky top-0 z-10")}>
              {table.getHeaderGroups().map((hg) => (
                <TableRow key={hg.id} className="bg-muted/60 hover:bg-muted/60 border-b border-border">
                  {hg.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      style={{
                        width: header.getSize() !== 150 ? `${header.getSize()}px` : undefined,
                      }}
                      className="h-11 text-xs font-semibold uppercase tracking-wide text-muted-foreground px-4"
                    >
                      {header.isPlaceholder ? null : header.column.getCanSort() ? (
                        <button
                          className="flex items-center gap-1.5 cursor-pointer select-none hover:text-foreground transition-colors"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getIsSorted() === "asc" && <ChevronUpIcon size={13} className="opacity-70" />}
                          {header.column.getIsSorted() === "desc" && (
                            <ChevronDownIcon size={13} className="opacity-70" />
                          )}
                          {!header.column.getIsSorted() && header.column.getCanSort() && (
                            <ChevronUpIcon size={13} className="opacity-20" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableSkeleton columns={columns.length} rows={pageSize} />
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={onRowClick ? () => onRowClick(row.original) : undefined}
                    className={cn(
                      "border-b border-border/60 transition-colors",
                      "hover:bg-muted/30 data-[state=selected]:bg-primary/5",
                      onRowClick && "cursor-pointer",
                    )}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-4 py-3">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-48 text-center">
                    <div className="flex flex-col items-center gap-3 text-muted-foreground">
                      {emptyIcon && <div className="opacity-40">{emptyIcon}</div>}
                      <p className="text-sm">{emptyMessage}</p>
                      {emptyAction}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ── Pagination footer ────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <Label htmlFor={id} className="text-xs text-muted-foreground whitespace-nowrap">
            Rows per page
          </Label>
          <Select value={pageSize.toString()} onValueChange={(v) => table.setPageSize(Number(v))}>
            <SelectTrigger id={id} className="h-8 w-16 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {pageSizes.map((s) => (
                <SelectItem key={s} value={s.toString()} className="text-xs">
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Row range */}
        <p className="text-xs text-muted-foreground order-last sm:order-0">
          <span className="text-foreground font-medium">
            {from}–{to}
          </span>{" "}
          of <span className="text-foreground font-medium">{totalRows}</span> {rowCount}
        </p>

        {/* Page nav */}
        <Pagination className="w-auto">
          <PaginationContent className="gap-1">
            {NAV_BUTTONS.map(({ key, Icon, action, canDo, label }) => (
              <PaginationItem key={key}>
                <Button
                  size="icon"
                  variant="outline"
                  className="h-10 w-10"
                  onClick={() => action(table)}
                  disabled={!canDo(table)}
                  aria-label={label}
                >
                  <Icon size={14} />
                </Button>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
