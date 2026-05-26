"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient, extractList, extractItem } from "@/lib/http-client";
import { createProductAction, updateProductAction, deleteProductAction } from "@/lib/actions/products";
import { uploadImageAction } from "@/lib/actions/upload";

const client = () => getClient();

export const productKeys = {
  all: ["products"],
  lists: () => ["products", "list"],
  detail: (idOrSlug) => ["product", idOrSlug],
};

export function useProductsQuery(params) {
  return useQuery({
    queryKey: ["products", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.q) query.set("search", params.q);
      if (params?.category && params.category !== "All Categories") query.set("category", params.category);
      if (params?.brand && params.brand !== "All Brands") query.set("brand", params.brand);
      if (params?.productType) query.set("productType", params.productType);
      if (params?.sort) query.set("sortBy", params.sort);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      const endpoint = query.toString() ? `/products?${query}` : "/products";
      const res = await client().get(endpoint);
      return extractList(res, "products");
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useProductQuery(idOrSlug) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const endpoint =
        idOrSlug.includes("-") && !idOrSlug.match(/^[0-9a-f]{24}$/)
          ? `/products/slug/${idOrSlug}`
          : `/products/${idOrSlug}`;
      const res = await client().get(endpoint);
      return extractItem(res, "product");
    },
    enabled: !!idOrSlug,
    placeholderData: (previousData) => previousData ?? null,
  });
}

export function useCreateProduct(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createProductAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create product");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create product");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateProduct(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateProductAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update product");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success("Product updated successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update product");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteProduct(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      deleteProductAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete product");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to delete product");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUploadImage(componentOptions = {}) {
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ file, fieldName = "image" }) =>
      uploadImageAction(file, fieldName).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to upload image");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      toast.success("Image uploaded successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to upload image");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useProductSearch(params) {
  const { data, isLoading: loading, error } = useProductsQuery(params);
  let products = [];
  if (data) {
    if (Array.isArray(data)) products = data;
    else if (Array.isArray(data.data)) products = data.data;
    else if (Array.isArray(data.products)) products = data.products;
  }
  return { products, loading, error: error || null };
}

export function useProduct(slugOrId) {
  const { data, isLoading: loading, error } = useProductQuery(slugOrId);
  return { product: data, loading, error };
}

export function useProductMutation() {
  return useCreateProduct();
}

export function useUploadImageMutation() {
  return useUploadImage();
}
