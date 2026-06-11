"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export function ExportButton({ data, filename = "export", columns }) {
  if (!data?.length) return null;

  const handleExport = () => {
    const cols = columns || Object.keys(data[0]).map((k) => ({ label: k, key: k }));
    const csvRows = [
      cols.map((c) => `"${c.label}"`).join(","),
      ...data.map((row) =>
        cols.map((c) => `"${(row[c.key] ?? "").toString().replace(/"/g, '""')}"`).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvRows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" onClick={handleExport}>
      <Download className="h-3 w-3" />
      CSV
    </Button>
  );
}
