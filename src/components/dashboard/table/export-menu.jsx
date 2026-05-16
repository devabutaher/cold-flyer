"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DownloadIcon, FileJsonIcon, FileSpreadsheetIcon, FileTextIcon, Loader2 } from "lucide-react";
import { useState } from "react";

function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

const identity = (r) => r;

const INTERNAL_KEYS = new Set(["_id", "__v", "id", "createdAt", "updatedAt", "passwordResetToken", "refreshTokens"]);

function deriveColumns(row) {
  return Object.keys(row)
    .filter((key) => !INTERNAL_KEYS.has(key) && !key.startsWith("_"))
    .map((key) => ({
      accessorKey: key,
      header: key.replace(/([A-Z])/g, " $1").replace(/^./, (c) => c.toUpperCase()),
    }));
}

export function ExportMenu({ table, filename = "export", mapRow = identity, pdfTitle = "Report", pdfColumns }) {
  const [pdfLoading, setPdfLoading] = useState(false);
  const [csvLoading, setCsvLoading] = useState(false);
  const [excelLoading, setExcelLoading] = useState(false);

  const getRows = () => {
    const selected = table.getSelectedRowModel().rows;
    const source = selected.length > 0 ? selected : table.getFilteredRowModel().rows;
    return source.map((r) => mapRow(r.original));
  };

  const exportCSV = async () => {
    setCsvLoading(true);
    try {
      const Papa = await import("papaparse");
      triggerDownload(new Blob([Papa.default.unparse(getRows())], { type: "text/csv" }), `${filename}.csv`);
    } finally {
      setCsvLoading(false);
    }
  };

  const exportExcel = async () => {
    setExcelLoading(true);
    try {
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(getRows());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
      XLSX.writeFile(wb, `${filename}.xlsx`);
    } finally {
      setExcelLoading(false);
    }
  };

  const exportJSON = () => {
    triggerDownload(
      new Blob([JSON.stringify(getRows(), null, 2)], {
        type: "application/json",
      }),
      `${filename}.json`,
    );
  };

  const exportPDF = async () => {
    const rows = getRows();
    if (!rows.length) return;

    const cols = pdfColumns ?? deriveColumns(rows[0]);

    setPdfLoading(true);
    try {
      const pdfModule = await import("@react-pdf/renderer");
      const { default: ReportPDF } = await import("./report-pdf");
      const blob = await pdfModule.pdf(<ReportPDF title={pdfTitle} columns={cols} data={rows} />).toBlob();
      triggerDownload(blob, `${filename}.pdf`);
    } finally {
      setPdfLoading(false);
    }
  };

  const selectedCount = table.getSelectedRowModel().rows.length;
  const isLoading = pdfLoading || csvLoading || excelLoading;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-9 gap-2" disabled={isLoading}>
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <DownloadIcon size={14} />}
          Export
          {selectedCount > 0 && <Badge className="ml-0.5 h-4 min-w-4 px-1 text-[10px]">{selectedCount}</Badge>}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuItem onClick={exportCSV} disabled={csvLoading}>
          <FileTextIcon size={13} className="mr-2" />
          {csvLoading ? "Loading..." : "Export CSV"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportExcel} disabled={excelLoading}>
          <FileSpreadsheetIcon size={13} className="mr-2" />
          {excelLoading ? "Loading..." : "Export Excel"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={exportJSON}>
          <FileJsonIcon size={13} className="mr-2" />
          Export JSON
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={exportPDF} disabled={pdfLoading}>
          <FileTextIcon size={13} className="mr-2" />
          {pdfLoading ? "Generating…" : "Export PDF"}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
