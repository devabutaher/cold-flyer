"use client";

import { useMemo, useCallback } from "react";
import { DataTable } from "@/components/dashboard/table/data-table";
import { ExportMenu } from "@/components/dashboard/table/export-menu";
import { TableToolbar } from "@/components/dashboard/table/table-toolbar";
import { Button } from "@/components/ui/button";
import { buildProductColumns } from "./product-columns";
import { useProductsQuery, useDeleteProduct } from "@/hooks/queries/products";
import { Package, Plus } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

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

export default function ProductsTable({ isAdmin = false }) {
  const { data: products = [], isLoading: loading, error } = useProductsQuery({ limit: 100 });
  const deleteProduct = useDeleteProduct();

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
        await deleteProduct.mutateAsync(id);
      } catch {}
    },
    [deleteProduct, checkAdminAccess],
  );

  const columns = useMemo(() => buildProductColumns({ onDelete: handleDelete }), [handleDelete]);

  const getUnique = (arr, key) => {
    const values = arr.map((item) => item[key]).filter((v) => v);
    return [...new Set(values)].sort();
  };
  const categoriesOptions = getUnique(products, "category");
  const brandsOptions = getUnique(products, "brand");

  return (
    <DataTable
      columns={columns}
      data={products}
        loading={loading}
        error={error}
        rowCount="products"
      defaultSort={[]}
      emptyMessage="No products found. Add your first product to get started."
      emptyIcon={<Package size={40} />}
      searchFields={["sku", "name", "category", "brand", "tag", "warranty"]}
      toolbar={(table) => (
        <TableToolbar
          table={table}
          searchPlaceholder="Search products."
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
            <>
              <Button asChild size="sm" className="gap-1.5">
                <Link href="/dashboard/items/add">
                  <Plus size={14} />
                  Add Product
                </Link>
              </Button>
              <ExportMenu
              table={table}
              filename="products"
              mapRow={mapProductRow}
              pdfTitle="ColdFlyer — Products Report"
              pdfColumns={PRODUCT_PDF_COLUMNS}
            />
            </>
          }
        />
      )}
    />
  );
}
