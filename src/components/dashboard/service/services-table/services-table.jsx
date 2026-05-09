"use client";

import servicesApi from "@/lib/api/services";
import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../table/data-table";
import { ExportMenu } from "../../table/export-menu";
import { TableToolbar } from "../../table/table-toolbar";
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

export default function ServicesTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await servicesApi.getServices({ limit: 100 });
        setData(res.data?.services ?? res.services ?? []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      setData((prev) => prev.filter((s) => (s._id ?? s.id) !== id));
      toast.success("Service deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete service");
    }
  };

  const columns = useMemo(
    () => buildServiceColumns({ onDelete: handleDelete }),
    [],
  );

  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(data, "category");
  const serviceTypesOptions = getUnique(data, "serviceType");

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowCount="services"
      defaultSort={[{ id: "name", desc: false }]}
      emptyMessage="No services found. Add your first service to get started."
      emptyIcon={<Package size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search services…"
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
            <ExportMenu
              table={table}
              filename="services"
              mapRow={mapServiceRow}
              pdfTitle="ColdFlyer — Services Report"
              pdfColumns={SERVICE_PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
