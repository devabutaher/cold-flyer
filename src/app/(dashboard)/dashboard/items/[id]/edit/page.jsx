import EditProductForm from "@/components/dashboard/product/edit-product/EditProductForm";
import productsApi from "@/lib/api/products";

export async function generateMetadata({ params }) {
  const { id } = await params;
  try {
    const response = await productsApi.getProductById(id);
    const product = response.data?.product || response.product;
    return {
      title: product
        ? `Edit ${product.name} | ColdFlyer`
        : "Edit Product | ColdFlyer",
    };
  } catch {
    return { title: "Edit Product | ColdFlyer" };
  }
}

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = null;
  try {
    const response = await productsApi.getProductById(id);
    product = response.data?.product || response.product;
  } catch (error) {
    console.error("Failed to fetch product:", error);
  }

  if (!product) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <p className="text-muted-foreground">Product not found</p>
      </div>
    );
  }

  return <EditProductForm product={product} />;
}
