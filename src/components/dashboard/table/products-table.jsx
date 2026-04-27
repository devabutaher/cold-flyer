"use client";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { acParts, acUnits } from "@/data/products-data";
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
import {
  ChevronDownIcon,
  ChevronFirstIcon,
  ChevronLastIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
} from "lucide-react";
import { useId, useMemo, useState } from "react";
import { ExportMenu } from "./export-menu";
import { buildColumns } from "./table-columns";
import { TopFilters } from "./table-top-filters";

export default function ProductsTable() {
  const id = useId();
  const allProducts = useMemo(() => [...acUnits, ...acParts], []);
  const [data, setData] = useState(allProducts);
  const [globalFilter, setGlobalFilter] = useState("");
  const [columnFilters, setColumnFilters] = useState([]);
  const [sorting, setSorting] = useState([{ id: "name", desc: false }]);
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

  const handleDelete = (productId) => {
    setData((prev) => prev.filter((p) => p.id !== productId));
  };

  const columns = useMemo(() => buildColumns({ onDelete: handleDelete }), []);

  const table = useReactTable({
    data,
    columns,
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
    globalFilterFn: "includesString",
    enableSortingRemoval: false,
  });

  return (
    <div className="space-y-4 w-full">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <TopFilters table={table} />
        <div className="flex items-center gap-2 ml-auto">
          {table.getSelectedRowModel().rows.length > 0 && (
            <span className="text-xs text-muted-foreground">
              {table.getSelectedRowModel().rows.length} selected
            </span>
          )}
          <ExportMenu table={table} />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-xl border border-border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id} className="bg-muted/50 hover:bg-muted/50">
                {hg.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    style={{
                      width:
                        header.getSize() !== 150
                          ? `${header.getSize()}px`
                          : undefined,
                    }}
                    className="h-11 border-b"
                  >
                    {header.isPlaceholder ? null : header.column.getCanSort() ? (
                      <div
                        className="flex items-center gap-1.5 cursor-pointer select-none"
                        onClick={header.column.getToggleSortingHandler()}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {{
                          asc: (
                            <ChevronUpIcon size={14} className="opacity-60" />
                          ),
                          desc: (
                            <ChevronDownIcon size={14} className="opacity-60" />
                          ),
                        }[header.column.getIsSorted()] ?? null}
                      </div>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-muted/30"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center text-muted-foreground"
                >
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Label
            htmlFor={id}
            className="text-sm text-muted-foreground whitespace-nowrap"
          >
            Rows per page
          </Label>
          <Select
            value={table.getState().pagination.pageSize.toString()}
            onValueChange={(v) => table.setPageSize(Number(v))}
          >
            <SelectTrigger id={id} className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50].map((s) => (
                <SelectItem key={s} value={s.toString()}>
                  {s}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <p className="text-sm text-muted-foreground">
          <span className="text-foreground font-medium">
            {table.getState().pagination.pageIndex *
              table.getState().pagination.pageSize +
              1}
            –
            {Math.min(
              (table.getState().pagination.pageIndex + 1) *
                table.getState().pagination.pageSize,
              table.getRowCount(),
            )}
          </span>{" "}
          of{" "}
          <span className="text-foreground font-medium">
            {table.getRowCount()}
          </span>{" "}
          products
        </p>

        <Pagination>
          <PaginationContent>
            {[
              {
                icon: ChevronFirstIcon,
                action: () => table.firstPage(),
                disabled: !table.getCanPreviousPage(),
                label: "First",
              },
              {
                icon: ChevronLeftIcon,
                action: () => table.previousPage(),
                disabled: !table.getCanPreviousPage(),
                label: "Prev",
              },
              {
                icon: ChevronRightIcon,
                action: () => table.nextPage(),
                disabled: !table.getCanNextPage(),
                label: "Next",
              },
              {
                icon: ChevronLastIcon,
                action: () => table.lastPage(),
                disabled: !table.getCanNextPage(),
                label: "Last",
              },
            ].map(({ icon: Icon, action, disabled, label }) => (
              <PaginationItem key={label}>
                <Button
                  size="icon"
                  variant="outline"
                  onClick={action}
                  disabled={disabled}
                  aria-label={label}
                >
                  <Icon size={15} />
                </Button>
              </PaginationItem>
            ))}
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
}
