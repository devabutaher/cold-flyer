import ProtectedRoute from "@/components/auth/protected-routes";
import dynamic from "next/dynamic";

const ProductsTable = dynamic(() => import("@/components/dashboard/product/products-table/products-table"));

export default function ProductsPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">All Products</h1>
          <p className="text-sm text-muted-foreground mt-0.5">Manage your product inventory and catalog.</p>
        </div>
        <ProductsTable isAdmin={true} />
      </div>
    </ProtectedRoute>
  );
}