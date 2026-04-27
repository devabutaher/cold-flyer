import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { pdf } from "@react-pdf/renderer";
import { DownloadIcon, FileSpreadsheetIcon, FileTextIcon } from "lucide-react";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import { ProductsPDF } from "./products-pdf";

export function ExportMenu({ table }) {
  const getRows = () => {
    const selected = table.getSelectedRowModel().rows;
    return selected.length > 0
      ? selected.map((r) => r.original)
      : table.getFilteredRowModel().rows.map((r) => r.original);
  };

  const exportCSV = () => {
    const rows = getRows().map(
      ({
        id,
        name,
        sku,
        category,
        brand,
        price,
        originalPrice,
        stock,
        warranty,
        rating,
      }) => ({
        id,
        name,
        sku,
        category,
        brand,
        price,
        originalPrice,
        stock,
        warranty,
        rating,
      }),
    );
    const csv = Papa.unparse(rows);
    triggerDownload(new Blob([csv], { type: "text/csv" }), "products.csv");
  };

  const exportExcel = () => {
    const rows = getRows().map(
      ({
        id,
        name,
        sku,
        category,
        brand,
        price,
        originalPrice,
        stock,
        warranty,
        rating,
      }) => ({
        id,
        name,
        sku,
        category,
        brand,
        price,
        originalPrice,
        stock,
        warranty,
        rating,
      }),
    );
    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Products");
    XLSX.writeFile(wb, "products.xlsx");
  };

  const exportJSON = () => {
    const rows = getRows();
    triggerDownload(
      new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" }),
      "products.json",
    );
  };

  const exportPDF = async () => {
    const rows = getRows();
    const blob = await pdf(<ProductsPDF data={rows} />).toBlob();
    triggerDownload(blob, "products.pdf");
  };

  const triggerDownload = (blob, filename) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const selectedCount = table.getSelectedRowModel().rows.length;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <DownloadIcon size={14} />
          Export
          {selectedCount > 0 && (
            <Badge className="ml-1 h-4 px-1 text-[10px]">{selectedCount}</Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={exportCSV}>
          <FileTextIcon size={14} className="mr-2" /> Export CSV
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportExcel}>
          <FileSpreadsheetIcon size={14} className="mr-2" /> Export Excel
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportJSON}>
          <FileTextIcon size={14} className="mr-2" /> Export JSON
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportPDF}>
          <FileTextIcon size={14} className="mr-2" /> Export PDF
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
