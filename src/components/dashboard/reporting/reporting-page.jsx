"use client";

import { useMemo, useState, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Wrench,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  Download,
  Loader2,
} from "lucide-react";

/* ── KPI Card ──────────────────────────────────────────── */
function KpiCard({ title, value, icon: Icon, isCurrency = true, positive }) {
  const isPositive = positive ?? (value >= 0);
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isCurrency ? "৳" : ""}
          {typeof value === "number" ? value.toLocaleString() : value}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Simple inline table helper ────────────────────────── */
function SimpleTable({ columns, data }) {
  if (!data || data.length === 0) {
    return <p className="text-sm text-muted-foreground py-4 text-center">No data available.</p>;
  }
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/60">
            {columns.map((col) => (
              <TableHead key={col.accessorKey} className="text-xs font-semibold uppercase whitespace-nowrap">
                {col.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, i) => (
            <TableRow key={row._id || i} className="border-b border-border/60">
              {columns.map((col) => (
                <TableCell key={col.accessorKey} className="text-sm whitespace-nowrap">
                  {col.cell ? col.cell(row) : row[col.accessorKey] ?? "—"}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

/* ── Main Page ──────────────────────────────────────────── */
export default function ReportingPage() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear().toString());
  const [month, setMonth] = useState((now.getMonth() + 1).toString().padStart(2, "0"));

  /* ── Report Query ── */
  const {
    data: report,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["admin-report", year, month],
    queryFn: async () => {
      const res = await getClient().get("/admin/report", {
        params: { year, month },
      });
      return res.data?.data || {};
    },
  });

  /* ── Duplicates Query ── */
  const [dupField, setDupField] = useState(null); // "phone" | "address" | "both"
  const {
    data: duplicates,
    isLoading: dupLoading,
    refetch: refetchDups,
  } = useQuery({
    queryKey: ["admin-duplicates", dupField],
    queryFn: async () => {
      const res = await getClient().get(`/admin/report/duplicates`, {
        params: { field: dupField },
      });
      return res.data?.data?.duplicates || [];
    },
    enabled: !!dupField,
  });

  const kpis = useMemo(() => {
    const totalRevenue = report?.totalRevenue ?? 0;
    const totalExpenses = report?.totalExpenses ?? 0;
    const totalSalary = report?.totalSalary ?? 0;
    const netProfit = totalRevenue - totalExpenses - totalSalary;
    return { totalRevenue, totalExpenses, totalSalary, netProfit };
  }, [report]);

  const serviceBreakdown = report?.serviceBreakdown || [];
  const topCustomers = report?.topCustomers || [];
  const expenses = report?.expenses || [];
  const activeWorkers = report?.activeWorkers || [];

  /* ── Excel Export ── */
  const [exporting, setExporting] = useState(false);
  const handleExport = useCallback(async () => {
    setExporting(true);
    try {
      const res = await getClient().get("/admin/report", {
        params: { year, month, export: "excel" },
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const a = document.createElement("a");
      a.href = url;
      a.download = `report-${year}-${month}.xlsx`;
      a.click();
      window.URL.revokeObjectURL(url);
      toast.success("Report exported.");
    } catch (err) {
      toast.error("Export failed.");
    } finally {
      setExporting(false);
    }
  }, [year, month]);

  const handleCheckDuplicates = useCallback((field) => {
    setDupField(field);
  }, []);

  const months = Array.from({ length: 12 }, (_, i) => {
    const m = (i + 1).toString().padStart(2, "0");
    return { value: m, label: new Date(2000, i).toLocaleString("default", { month: "long" }) };
  });
  const years = Array.from({ length: 5 }, (_, i) => (now.getFullYear() - 2 + i).toString());

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">Reporting</h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          Monthly financial and operational report.
        </p>
      </div>

      {/* ── Filters ── */}
      <div className="flex flex-wrap items-end gap-4">
        <div>
          <Label htmlFor="report-year" className="mb-1.5 block">
            Year
          </Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger id="report-year" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="report-month" className="mb-1.5 block">
            Month
          </Label>
          <Select value={month} onValueChange={setMonth}>
            <SelectTrigger id="report-month" className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {months.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  {m.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button variant="outline" onClick={handleExport} disabled={exporting || isLoading}>
          {exporting ? (
            <Loader2 size={14} className="mr-1.5 animate-spin" />
          ) : (
            <Download size={14} className="mr-1.5" />
          )}
          Export Excel
        </Button>
      </div>

      {/* ── KPI Cards ── */}
      {isLoading ? (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-4 w-24 mb-3" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
          <KpiCard
            title="Total Revenue"
            value={kpis.totalRevenue}
            icon={TrendingUp}
            positive={true}
          />
          <KpiCard
            title="Total Expenses"
            value={kpis.totalExpenses}
            icon={TrendingDown}
            positive={false}
          />
          <KpiCard
            title="Total Salary"
            value={kpis.totalSalary}
            icon={Users}
            positive={false}
          />
          <KpiCard
            title="Net Profit"
            value={kpis.netProfit}
            icon={DollarSign}
            positive={kpis.netProfit >= 0}
          />
        </div>
      )}

      {/* ── Detail Panels ── */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Service Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Wrench size={15} className="text-muted-foreground" />
              Service Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <SimpleTable
                columns={[
                  { header: "Service", accessorKey: "type" },
                  { header: "Count", accessorKey: "count" },
                  {
                    header: "Revenue",
                    accessorKey: "revenue",
                    cell: (row) => `৳${(row.revenue ?? 0).toLocaleString()}`,
                  },
                ]}
                data={serviceBreakdown}
              />
            )}
          </CardContent>
        </Card>

        {/* Top Customers */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <Users size={15} className="text-muted-foreground" />
              Top Customers
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <Skeleton className="h-32 w-full" />
            ) : (
              <SimpleTable
                columns={[
                  { header: "Name", accessorKey: "name" },
                  { header: "Phone", accessorKey: "phone" },
                  { header: "Brand", accessorKey: "brand" },
                  { header: "Service", accessorKey: "service" },
                  {
                    header: "Amount",
                    accessorKey: "amount",
                    cell: (row) => `৳${(row.amount ?? 0).toLocaleString()}`,
                  },
                ]}
                data={topCustomers}
              />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Expenses Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold">Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <SimpleTable
              columns={[
                { header: "Item", accessorKey: "item" },
                {
                  header: "Category",
                  accessorKey: "category",
                  cell: (row) => (
                    <span className="capitalize">{(row.category || "").replace(/_/g, " ")}</span>
                  ),
                },
                {
                  header: "Amount",
                  accessorKey: "amount",
                  cell: (row) => `৳${(row.amount ?? 0).toLocaleString()}`,
                },
                {
                  header: "Date",
                  accessorKey: "date",
                  cell: (row) =>
                    row.date ? new Date(row.date).toLocaleDateString() : "—",
                },
              ]}
              data={expenses}
            />
          )}
        </CardContent>
      </Card>

      {/* Active Workers with Salary */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <Users size={15} className="text-muted-foreground" />
            Active Workers
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <Skeleton className="h-32 w-full" />
          ) : (
            <SimpleTable
              columns={[
                { header: "Name", accessorKey: "workerName" },
                { header: "Phone", accessorKey: "phone" },
                { header: "Role", accessorKey: "role" },
                {
                  header: "Salary",
                  accessorKey: "salary",
                  cell: (row) =>
                    row.salary ? `৳${row.salary.toLocaleString()}` : "—",
                },
              ]}
              data={activeWorkers}
            />
          )}
        </CardContent>
      </Card>

      {/* ── Duplicate Detection ── */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-semibold flex items-center gap-2">
            <AlertTriangle size={15} className="text-muted-foreground" />
            Duplicate Customer Detector
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Button
              variant={dupField === "phone" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCheckDuplicates("phone")}
            >
              By Phone
            </Button>
            <Button
              variant={dupField === "address" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCheckDuplicates("address")}
            >
              By Address
            </Button>
            <Button
              variant={dupField === "both" ? "default" : "outline"}
              size="sm"
              onClick={() => handleCheckDuplicates("both")}
            >
              By Both
            </Button>
          </div>

          {dupLoading && (
            <div className="flex items-center gap-2 py-4 text-sm text-muted-foreground">
              <Loader2 size={14} className="animate-spin" />
              Checking for duplicates…
            </div>
          )}

          {!dupLoading && duplicates && duplicates.length > 0 && (
            <SimpleTable
              columns={[
                { header: "Field", accessorKey: "field", cell: (row) => row.field || row._id || "—" },
                { header: "Count", accessorKey: "count" },
              ]}
              data={duplicates}
            />
          )}

          {!dupLoading && dupField && duplicates && duplicates.length === 0 && (
            <p className="text-sm text-green-600">No duplicates found.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
