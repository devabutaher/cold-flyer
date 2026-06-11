"use client";

import { DataTable } from "@/components/dashboard/table/data-table";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { Button } from "@/components/ui/button";
import { useDeleteService, useServicesQuery } from "@/hooks/queries/services";
import { Package, Plus } from "lucide-react";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { buildServiceColumns } from "./service-columns";

const mapServiceRow = (s) => ({
  name: s.name,
  category: s.category,
  serviceType: s.serviceType,
  basePrice: s.basePrice,
  priceType: s.priceType,
  rating: s.rating,
  bookingCount: s.bookingCount,
  isFeatured: s.isFeatured,
  isActive: s.isActive,
});

const SERVICE_PDF_COLUMNS = [
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Category", accessorKey: "category", width: 1.2 },
  { header: "Type", accessorKey: "serviceType", width: 1.2 },
  { header: "Price (৳)", accessorKey: "basePrice", width: 0.8 },
  { header: "Price Type", accessorKey: "priceType", width: 0.8 },
  { header: "Rating", accessorKey: "rating", width: 0.6 },
  { header: "Bookings", accessorKey: "bookingCount", width: 0.6 },
  { header: "Featured", accessorKey: "isFeatured", width: 0.6 },
  { header: "Active", accessorKey: "isActive", width: 0.6 },
];

export default function ServicesTable({ isAdmin = false }) {
  const { data: services = [], isLoading: loading, error } = useServicesQuery({ limit: 100 });
  const deleteService = useDeleteService();

  const checkAdminAccess = useCallback(() => {
    if (!isAdmin) {
      toast.error("Access Denied: This action requires Administrator privileges.");
      return false;
    }
    return true;
  }, [isAdmin]);

  const handleDelete = useCallback(
    async (id) => {
      if (!checkAdminAccess()) return;
      try {
        await deleteService.mutateAsync(id);
      } catch {}
    },
    [deleteService, checkAdminAccess],
  );

  const columns = useMemo(() => buildServiceColumns({ onDelete: handleDelete }), [handleDelete]);

  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(services, "category");
  const serviceTypesOptions = getUnique(services, "serviceType");

  return (
    <DataTable
      columns={columns}
      data={services}
        loading={loading}
        error={error}
        rowCount="services"
      defaultSort={[]}
      emptyMessage="No services found. Add your first service to get started."
      emptyIcon={<Package size={40} />}
      searchFields={["name", "category", "serviceType", "basePrice", "description"]}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search services."
          selectedLabel="services"
          filters={[
            {
              columnId: "category",
              placeholder: "All Categories",
              allLabel: "All Categories",
              options: categoriesOptions,
            },
            {
              columnId: "serviceType",
              placeholder: "All Types",
              allLabel: "All Types",
              options: serviceTypesOptions,
            },
          ]}
          actions={
            <>
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/dashboard/services/add">
                  <Plus size={14} />
                  Add Service
                </Link>
              </Button>
              <ExportMenu
              table={table}
              filename="services"
              mapRow={mapServiceRow}
              pdfTitle="ColdFlyer — Services Report"
              pdfColumns={SERVICE_PDF_COLUMNS}
            />
            </>
          }
        />
      )}
    />
  );
}
