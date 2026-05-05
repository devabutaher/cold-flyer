"use client";

import productsApi from "@/lib/api/products";
import { Package } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { DataTable } from "../../table/data-table";
import { ExportMenu } from "../../table/export-menu";
import { TableToolbar } from "../../table/table-toolbar";
import { buildProductColumns } from "./product-columns";

const mapProductRow = (p) => ({
  sku: p.sku,
  name: p.name,
  category: p.category,
  brand: p.brand,
  price: p.price,
  originalPrice: p.originalPrice,
  stock: p.stock,
  warranty: p.warranty ?? "—",
  rating: p.rating,
});

const PRODUCT_PDF_COLUMNS = [
  { header: "SKU", accessorKey: "sku", width: 1.4 },
  { header: "Name", accessorKey: "name", width: 2 },
  { header: "Category", accessorKey: "category", width: 1.2 },
  { header: "Brand", accessorKey: "brand", width: 1 },
  { header: "Price (৳)", accessorKey: "price", width: 0.8 },
  { header: "Original (৳)", accessorKey: "originalPrice", width: 0.8 },
  { header: "Stock", accessorKey: "stock", width: 0.6 },
  { header: "Warranty", accessorKey: "warranty", width: 0.8 },
  { header: "Rating", accessorKey: "rating", width: 0.6 },
];

export default function ProductsTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const res = await productsApi.getProducts({ limit: 100 });
        setData(res.data?.products ?? res.products ?? []);
      } catch {
        setData([]);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleDelete = async (id) => {
    try {
      await productsApi.deleteProduct(id);
      setData((prev) => prev.filter((p) => (p._id ?? p.id) !== id));
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(error.message || "Failed to delete product");
    }
  };

  const columns = useMemo(
    () => buildProductColumns({ onDelete: handleDelete }),
    [],
  );

  // Extract unique categories and brands from data
  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(data, "category");
  const brandsOptions = getUnique(data, "brand");

  return (
    <DataTable
      columns={columns}
      data={data}
      loading={loading}
      rowCount="products"
      defaultSort={[{ id: "name", desc: false }]}
      emptyMessage="No products found. Add your first product to get started."
      emptyIcon={<Package size={40} />}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search products…"
          selectedLabel="products"
          filters={[
            {
              columnId: "category",
              placeholder: "All Categories",
              allLabel: "All Categories",
              options: categoriesOptions,
            },
            {
              columnId: "brand",
              placeholder: "All Brands",
              allLabel: "All Brands",
              options: brandsOptions,
            },
          ]}
          actions={
            <ExportMenu
              table={table}
              filename="products"
              mapRow={mapProductRow}
              pdfTitle="ColdFlyer — Products Report"
              pdfColumns={PRODUCT_PDF_COLUMNS}
            />
          }
        />
      )}
    />
  );
}
