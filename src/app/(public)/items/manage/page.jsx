import ProtectedRoute from "@/components/auth/protected-routes";
import ProductsTable from "@/components/dashboard/table/products-table";

export default function Products() {
  return (
    <ProtectedRoute>
      <div className="py-8">
        <ProductsTable />
      </div>
    </ProtectedRoute>
  );
}
