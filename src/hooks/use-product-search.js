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
      const response = await productsApi.getProducts({ q, category, brand, sort });
      const productsData = response.data?.data || response.data || response;
      return Array.isArray(productsData) ? productsData : [];
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