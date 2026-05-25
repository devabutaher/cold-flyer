"use client";

import { createRecentWorkAction, deleteRecentWorkAction, updateRecentWorkAction } from "@/lib/actions/recentWorks";
import { extractItem, extractList, getClient } from "@/lib/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const client = () => getClient();

export const recentWorkKeys = {
  all: ["recentWorks"],
  lists: () => ["recentWorks", "list"],
  detail: (slug) => ["recentWork", slug],
};

export function useRecentWorksQuery(params) {
  return useQuery({
    queryKey: ["recentWorks", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.q) query.set("search", params.q);
      if (params?.category) query.set("category", params.category);
      if (params?.featured) query.set("featured", String(params.featured));
      if (params?.sort) query.set("sortBy", params.sort);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      const endpoint = query.toString() ? `/recent-works?${query}` : "/recent-works";
      const res = await client().get(endpoint);
      return extractList(res, "recentWorks");
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useRecentWorkQuery(slug) {
  return useQuery({
    queryKey: ["recentWork", slug],
    queryFn: async () => {
      if (!slug) return null;
      const endpoint = `/recent-works/slug/${slug}`;
      const res = await client().get(endpoint);
      return extractItem(res, "recentWork");
    },
    enabled: !!slug,
    placeholderData: (previousData) => previousData ?? null,
  });
}

export function useCreateRecentWork(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createRecentWorkAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create recent work");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: recentWorkKeys.all });
      toast.success("Recent work created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create recent work");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateRecentWork(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateRecentWorkAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update recent work");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: recentWorkKeys.all });
      toast.success("Recent work updated successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update recent work");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteRecentWork(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      deleteRecentWorkAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete recent work");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: recentWorkKeys.all });
      toast.success("Recent work deleted successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to delete recent work");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useRecentWorkSearch(params) {
  const { data, isLoading: loading, error } = useRecentWorksQuery(params);
  let recentWorks = [];
  if (data) {
    if (Array.isArray(data)) recentWorks = data;
    else if (Array.isArray(data.data)) recentWorks = data.data;
    else if (Array.isArray(data.recentWorks)) recentWorks = data.recentWorks;
  }
  return { recentWorks, loading, error: error || null };
}
