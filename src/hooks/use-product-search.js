"use client";

import productsApi from "@/lib/api/products";
import { useQuery } from "@tanstack/react-query";

export function useProductSearch({
  q = "",
  category = "",
  brand = "",
  sort = "Price: Low to High",
}) {
  const { data: products = [], isLoading: loading, error } = useQuery({
    queryKey: ["products", { q, category, brand, sort }],
    queryFn: async () => {
      try {
        const response = await productsApi.getProducts({ q, category, brand, sort });
        console.log("Products API response:", response);
        const productsData = response.data?.products || response.products || response.data || [];
        return Array.isArray(productsData) ? productsData : [];
      } catch (err) {
        console.error("Products API error:", err);
        throw err;
      }
    },
  });

  return { products, loading, error };
}

export function useProduct(id) {
  const { data: product, isLoading: loading, error } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const response = await productsApi.getProductById(id);
      const productData = response.data?.data || response.data || response;
      return productData || null;
    },
    enabled: !!id,
  });

  return { product, loading, error };
}