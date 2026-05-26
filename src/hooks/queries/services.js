"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient, extractList, extractItem } from "@/lib/http-client";
import { createServiceAction, updateServiceAction, deleteServiceAction } from "@/lib/actions/services";

const client = () => getClient();

export const serviceKeys = {
  all: ["services"],
  detail: (slug) => ["service", slug],
  featured: ["services", "featured"],
};

export function useServicesQuery(params) {
  return useQuery({
    queryKey: ["services", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.category) query.set("category", params.category);
      if (params?.serviceType) query.set("serviceType", params.serviceType);
      if (params?.sort) {
        const sortMap = {
          Newest: "newest",
          "Price: Low to High": "price_asc",
          "Price: High to Low": "price_desc",
          "Best Rated": "rating",
          "Most Popular": "popular",
        };
        query.set("sortBy", sortMap[params.sort] || "newest");
      }
      if (params?.featured) query.set("featured", "true");
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      const endpoint = query.toString() ? `/services?${query}` : "/services";
      const res = await client().get(endpoint);
      return extractList(res, "services");
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useServiceQuery(slug) {
  return useQuery({
    queryKey: serviceKeys.detail(slug || ""),
    queryFn: async () => {
      if (!slug) return null;
      const res = await client().get(`/services/slug/${slug}`);
      return extractItem(res, "service");
    },
    enabled: !!slug,
  });
}

export function useFeaturedServicesQuery() {
  return useQuery({
    queryKey: serviceKeys.featured,
    queryFn: async () => {
      const res = await client().get("/services/featured");
      return extractList(res, "services");
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useCreateService(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createServiceAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create service");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.featured });
      toast.success("Service created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create service");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateService(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateServiceAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update service");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: ["service"] });
      queryClient.invalidateQueries({ queryKey: serviceKeys.featured });
      toast.success("Service updated successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update service");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteService(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      deleteServiceAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete service");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: serviceKeys.all });
      queryClient.invalidateQueries({ queryKey: serviceKeys.featured });
      toast.success("Service deleted successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to delete service");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useService(slug) {
  const { data, isLoading: loading, error } = useServiceQuery(slug);
  return { service: data, loading, error };
}

export function useServiceMutation() {
  return useCreateService();
}
