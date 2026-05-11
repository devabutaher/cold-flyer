"use client";

import { useAuth } from "@/components/providers";
import ProductsTable from "@/components/dashboard/product/products-table/products-table";

export default function ProductsPage() {
  const { backendUser } = useAuth();
  const isAdmin = backendUser?.role === "admin";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold tracking-tight">
          {isAdmin ? "All Products" : "Products"}
        </h1>
        <p className="text-sm text-muted-foreground mt-0.5">
          {isAdmin 
            ? "Manage your product inventory and catalog." 
            : "Browse available AC products and parts."}
        </p>
      </div>
      <ProductsTable isAdmin={isAdmin} />
    </div>
  );
}