/**
 * TanStack Query hooks for client-side data fetching
 * Replaces useEffect-based fetching with proper caching, loading states, and mutations
 */

"use client";

import { useQuery, useMutation, useQueryClient, UseQueryOptions, UseMutationOptions } from "@tanstack/react-query";
import {
  getProductsServer,
  getProductBySlugServer,
  getProductByIdServer,
  createProductAction,
  updateProductAction,
  deleteProductAction,
  uploadImageAction,
} from "@/lib/actions/products";
import {
  getOrdersServer,
  getOrderByIdServer,
  createOrderAction,
  createQuickCheckoutAction,
  cancelOrderAction,
  verifyPaymentAction,
} from "@/lib/actions/orders";
import {
  getServicesServer,
  getServiceBySlugServer,
  getFeaturedServicesServer,
  createServiceAction,
  updateServiceAction,
  deleteServiceAction,
} from "@/lib/actions/services";
import { Product, Service, Order, OrderItem, ApiResponse } from "@/types";
import apiClient from "@/lib/api-client";
import { toast } from "sonner";

// ============================================================
// PRODUCTS QUERIES & MUTATIONS
// ============================================================

// Query key factories
export const productKeys = {
  all: ["products"] as const,
  lists: () => ["products", "list"] as const,
  detail: (idOrSlug: string) => ["product", idOrSlug] as const,
};

/**
 * Fetch products list with optional filters
 */
export function useProductsQuery(params?: Record<string, string | number>) {
  return useQuery<{ data: Product[]; total: number }>({
    queryKey: ["products", params ?? {}],
    queryFn: async () => {
      const result = await getProductsServer(params);
      // Handle both paginated and array responses
      if ("data" in result && Array.isArray((result as any).data)) {
        return result as { data: Product[]; total: number };
      }
      return { data: result as Product[], total: (result as Product[]).length };
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single product by slug or ID
 */
export function useProductQuery(idOrSlug?: string | null) {
  return useQuery<Product | null>({
    queryKey: ["product", idOrSlug],
    queryFn: async () => {
      if (!idOrSlug) return null;
      const result = await getProductBySlugServer(idOrSlug);
      if (result) return result;
      // Try by ID as fallback
      return getProductByIdServer(idOrSlug);
    },
    enabled: !!idOrSlug,
    placeholderData: (previousData) => previousData ?? null,
  });
}

/**
 * Create a new product (mutation)
 */
export function useCreateProduct(options?: Omit<UseMutationOptions<Product, Error, Partial<Product> & { name: string; sku: string; category: string; brand: string; price: number }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, Partial<Product> & { name: string; sku: string; category: string; brand: string; price: number }>({
    mutationFn: (data) => createProductAction(data).then((res) => {
      if (!res.success) throw new Error(res.message || "Failed to create product");
      return res.data!;
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create product");
    },
    ...options,
  });
}

/**
 * Update an existing product (mutation)
 */
export function useUpdateProduct(options?: Omit<UseMutationOptions<Product, Error, { id: string; data: Partial<Product> }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<Product, Error, { id: string; data: Partial<Product> }>({
    mutationFn: ({ id, data }) =>
      updateProductAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update product");
        return res.data!;
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      queryClient.invalidateQueries({ queryKey: productKeys.detail(variables.id) });
      toast.success("Product updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update product");
    },
    ...options,
  });
}

/**
 * Delete a product (mutation)
 */
export function useDeleteProduct(options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      deleteProductAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete product");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: productKeys.all });
      toast.success("Product deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete product");
    },
    ...options,
  });
}

/**
 * Upload an image (mutation)
 */
export function useUploadImage(options?: Omit<UseMutationOptions<{ url: string }, Error, { file: File; fieldName?: string }>, "mutationFn">) {
  return useMutation<{ url: string }, Error, { file: File; fieldName?: string }>({
    mutationFn: ({ file, fieldName = "image" }) =>
      uploadImageAction(file, fieldName).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to upload image");
        return { url: (res.data as any)?.url };
      }),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to upload image");
    },
    ...options,
  });
}

// ============================================================
// ORDERS QUERIES & MUTATIONS
// ============================================================

export const orderKeys = {
  all: ["orders"] as const,
  detail: (id: string) => ["order", id] as const,
};

/**
 * Fetch all orders (requires auth)
 */
export function useOrdersQuery() {
  return useQuery<Order[]>({
    queryKey: orderKeys.all,
    queryFn: async () => {
      const result = await getOrdersServer();
      return result;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single order by ID
 */
export function useOrderQuery(id?: string | null) {
  return useQuery<Order | null>({
    queryKey: orderKeys.detail(id ?? ""),
    queryFn: async () => {
      if (!id) return null;
      const result = await getOrderByIdServer(id);
      return result;
    },
    enabled: !!id,
  });
}

/**
 * Create a new order (mutation)
 */
export function useCreateOrder(options?: Omit<UseMutationOptions<Order, Error, { items: OrderItem[]; paymentMethod: string; isPickup: boolean }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<Order, Error, { items: OrderItem[]; paymentMethod: string; isPickup: boolean }>({
    mutationFn: (data) =>
      createOrderAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create order");
        return res.data!;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create order");
    },
    ...options,
  });
}

/**
 * Quick checkout (creates order then returns checkout URL)
 */
export function useQuickCheckout(options?: Omit<UseMutationOptions<{ checkoutUrl: string }, Error, { items: OrderItem[]; paymentMethod: string; isPickup: boolean }>, "mutationFn">) {
  return useMutation<{ checkoutUrl: string }, Error, { items: OrderItem[]; paymentMethod: string; isPickup: boolean }>({
    mutationFn: (data) =>
      createQuickCheckoutAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create checkout");
        return { checkoutUrl: (res.data as any)?.checkoutUrl || "" };
      }),
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create checkout");
    },
    ...options,
  });
}

/**
 * Cancel an order (mutation)
 */
export function useCancelOrder(options?: Omit<UseMutationOptions<void, Error, { orderId: string; reason: string }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: string; reason: string }>({
    mutationFn: ({ orderId, reason }) =>
      cancelOrderAction(orderId, reason).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to cancel order");
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success("Order cancelled successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to cancel order");
    },
    ...options,
  });
}

/**
 * Verify payment for an order (mutation)
 */
export function useVerifyPayment(options?: Omit<UseMutationOptions<void, Error, { orderId: string; sessionId: string }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, { orderId: string; sessionId: string }>({
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

// ============================================================
// SERVICES QUERIES & MUTATIONS
// ============================================================

export const serviceKeys = {
  all: ["services"] as const,
  detail: (slug: string) => ["service", slug] as const,
  featured: ["services", "featured"] as const,
};

/**
 * Fetch services list with optional filters
 */
export function useServicesQuery(params?: Record<string, string>) {
  return useQuery<Service[]>({
    queryKey: ["services", params ?? {}],
    queryFn: async () => {
      const result = await getServicesServer(params);
      return result;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Fetch a single service by slug
 */
export function useServiceQuery(slug?: string | null) {
  return useQuery<Service | null>({
    queryKey: serviceKeys.detail(slug ?? ""),
    queryFn: async () => {
      if (!slug) return null;
      const result = await getServiceBySlugServer(slug);
      return result;
    },
    enabled: !!slug,
  });
}

/**
 * Fetch featured services
 */
export function useFeaturedServicesQuery() {
  return useQuery<Service[]>({
    queryKey: serviceKeys.featured,
    queryFn: async () => {
      const result = await getFeaturedServicesServer();
      return result;
    },
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Create a new service (mutation - admin only)
 */
export function useCreateService(options?: Omit<UseMutationOptions<Service, Error, Partial<Service> & { name: string; category: string; serviceType: string; basePrice: number }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, Partial<Service> & { name: string; category: string; serviceType: string; basePrice: number }>({
    mutationFn: (data) =>
      createServiceAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create service");
        return res.data!;
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success("Service created successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to create service");
    },
    ...options,
  });
}

/**
 * Update a service (mutation - admin only)
 */
export function useUpdateService(options?: Omit<UseMutationOptions<Service, Error, { id: string; data: Partial<Service> }>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<Service, Error, { id: string; data: Partial<Service> }>({
    mutationFn: ({ id, data }) =>
      updateServiceAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update service");
        return res.data!;
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.detail(variables.id) });
      toast.success("Service updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to update service");
    },
    ...options,
  });
}

/**
 * Delete a service (mutation - admin only)
 */
export function useDeleteService(options?: Omit<UseMutationOptions<void, Error, string>, "mutationFn">) {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (id) =>
      deleteServiceAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete service");
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      toast.success("Service deleted successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to delete service");
    },
    ...options,
  });
}

// ============================================================
// AUTH QUERIES (current user data)
// ============================================================

export function useCurrentUser() {
  return useQuery<User | null>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      // For SSR: use server action
      return null;
    },
    enabled: false, // Disabled by default; use useServerCurrentUser in SSR contexts
  });
}

// ============================================================
// GENERIC DATA HOOKS
// ============================================================

/**
 * Hook for making client-side API calls via api-client
 * Useful for one-off fetches that don't need server actions
 */
export function useApiCall<T = unknown>(
  endpoint: string,
  options?: { enabled?: boolean },
) {
  return useQuery<T>({
    queryKey: ["api", endpoint],
    queryFn: () => apiClient(endpoint).then((res) => res as T),
    enabled: options?.enabled ?? true,
  });
}