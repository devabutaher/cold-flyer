/**
 * TanStack Query hooks for client-side data fetching
 * Uses internal API routes to proxy to backend
 */

"use client";

import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createProductAction,
  updateProductAction,
  deleteProductAction,
  uploadImageAction,
} from "@/lib/actions/products";
import {
  createOrderAction,
  createQuickCheckoutAction,
  cancelOrderAction,
  verifyPaymentAction,
} from "@/lib/actions/orders";
import {
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/lib/actions/services";

const API_BASE_URL = "/api";

function getBaseUrl() {
  return API_BASE_URL;
}

async function fetcher(endpoint, options = {}) {
  const response = await fetch(`${getBaseUrl()}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    credentials: "include",
  });

  const data = await response.json();
  if (!response.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = response.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const productKeys = {
  all: ["products"],
  lists: () => ["products", "list"],
  detail: (idOrSlug) => ["product", idOrSlug],
};

export const orderKeys = {
  all: ["orders"],
  detail: (id) => ["order", id],
};

export const serviceKeys = {
  all: ["services"],
  detail: (slug) => ["service", slug],
  featured: ["services", "featured"],
};

export function useProductsQuery(params) {
  return useQuery({
    queryKey: ["products", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.q) query.set("search", params.q);
      if (params?.category && params.category !== "All Categories")
        query.set("category", params.category);
      if (params?.brand && params.brand !== "All Brands")
        query.set("brand", params.brand);
      if (params?.productType) query.set("productType", params.productType);
      if (params?.sort) query.set("sortBy", params.sort);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));

      const endpoint = query.toString()
        ? `/products?${query}`
        : "/products";
      const data = await fetcher(endpoint);
      return data?.data?.products || data?.products || [];
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useProductQuery(idOrSlug) {
  return useQuery({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const endpoint = idOrSlug.includes("-") && !idOrSlug.match(/^[0-9a-f]{24}$/)
        ? `/products/slug/${idOrSlug}`
        : `/products/${idOrSlug}`;
      const data = await fetcher(endpoint);
      return data?.data?.product || data?.product || null;
    },
    enabled: !!idOrSlug,
    placeholderData: (previousData) => previousData ?? null,
  });
}

export function useCreateProduct(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createProductAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create product");
        return res.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useUpdateProduct(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateProductAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update product");
        return res.data;
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useDeleteProduct(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      deleteProductAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete product");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useUploadImage(options) {
  return useMutation({
    mutationFn: ({ file, fieldName = "image" }) =>
      uploadImageAction(file, fieldName).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to upload image");
        return res.data;
      }),
    onError: () => {
    },
    ...options,
  });
}

export function useOrdersQuery() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: async () => {
      const data = await fetcher("/orders");
      return data?.data?.orders || data?.orders || [];
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useOrderQuery(id) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const data = await fetcher(`/orders/${id}`);
      return data?.data?.order || data?.order || null;
    },
    enabled: !!id,
  });
}

export function useCreateOrder(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createOrderAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create order");
        return res.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useCancelOrder(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, reason }) =>
      cancelOrderAction(orderId, reason).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to cancel order");
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useVerifyPayment(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ orderId, sessionId }) =>
      verifyPaymentAction(orderId, sessionId).then((res) => {
        if (!res.success) throw new Error(res.message || "Payment verification failed");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
    ...options,
  });
}

export function useServicesQuery(params) {
  return useQuery({
    queryKey: ["services", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.serviceType) query.set("serviceType", params.serviceType);
      if (params?.sort) {
        const sortMap = {
          "Price: Low to High": "price_asc",
          "Price: High to Low": "price_desc",
          Rating: "rating",
          Popular: "popular",
        };
        query.set("sortBy", sortMap[params.sort] || "rating");
      }
      if (params?.featured) query.set("featured", "true");
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));

      const endpoint = query.toString()
        ? `/services?${query}`
        : "/services";
      const data = await fetcher(endpoint);
      return data?.data?.services || data?.services || [];
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useServiceQuery(slug) {
  return useQuery({
    queryKey: serviceKeys.detail(slug || ""),
    queryFn: async () => {
      if (!slug) return null;
      const data = await fetcher(`/services/slug/${slug}`);
      return data?.data?.service || data?.service || null;
    },
    enabled: !!slug,
  });
}

export function useFeaturedServicesQuery() {
  return useQuery({
    queryKey: serviceKeys.featured,
    queryFn: async () => {
      const data = await fetcher("/services/featured");
      return data?.data?.services || data?.services || [];
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateService(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      createServiceAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create service");
        return res.data;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useUpdateService(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateServiceAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update service");
        return res.data;
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useDeleteService(options) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      deleteServiceAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete service");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
    },
    onError: () => {
    },
    ...options,
  });
}

export function useProductSearch(params) {
  const { data, isLoading: loading, error } = useProductsQuery(params);
  let products = [];
  if (data) {
    if (Array.isArray(data)) {
      products = data;
    } else if (Array.isArray(data.data)) {
      products = data.data;
    } else if (Array.isArray(data.products)) {
      products = data.products;
    }
  }
  return {
    products,
    loading,
    error: error || null,
  };
}

export function useProduct(slugOrId) {
  const { data, isLoading: loading, error } = useProductQuery(slugOrId);
  return { product: data, loading, error };
}

export function useService(slug) {
  const { data, isLoading: loading, error } = useServiceQuery(slug);
  return { service: data, loading, error };
}

export function useProductMutation() {
  return useCreateProduct();
}

export function useServiceMutation() {
  return useCreateService();
}

export function useUploadImageMutation() {
  return useUploadImage();
}