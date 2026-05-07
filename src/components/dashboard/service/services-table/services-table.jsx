"use client";

import servicesApi from "@/lib/api/services";
import { Wrench } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../table/data-table";
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
      await servicesApi.deleteService?.(id);
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
      emptyIcon={<Wrench size={40} />}
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
        />
      )}
    />
  );
}

function TableToolbar({ table, searchPlaceholder, selectedLabel, filters, actions }) {
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      table.getColumn("name")?.setFilterValue(search);
    }, 300);
    return () => clearTimeout(timeout);
  }, [search, table]);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 w-full">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2 text-muted-foreground mr-1">
          <span className="text-[10px] font-black uppercase tracking-widest">
            Filters:
          </span>
        </div>
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-8 w-48 rounded-md border border-input bg-background px-3 py-1 text-xs shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        />
        {filters?.map((filter, i) => (
          <select
            key={i}
            onChange={(e) => {
              const col = table.getColumn(filter.columnId);
              if (col) {
                col.setFilterValue(
                  e.target.value === filter.allLabel ? undefined : e.target.value,
                );
              }
            }}
            className="h-8 rounded-md border border-input bg-background px-2 py-1 text-xs shadow-sm"
          >
            <option value="">{filter.placeholder}</option>
            {filter.options?.map((opt) => (
              <option key={opt} value={opt}>
                {typeof opt === "string"
                  ? opt.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
                  : opt}
              </option>
            ))}
          </select>
        ))}
      </div>
      {actions}
    </div>
  );
}