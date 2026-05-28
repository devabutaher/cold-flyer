"use client";

import { createBlogAction, deleteBlogAction, updateBlogAction } from "@/lib/actions/blogs";
import { extractItem, extractList, getClient } from "@/lib/http-client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const client = () => getClient();

export const blogKeys = {
  all: ["blogs"],
  lists: () => ["blogs", "list"],
  detail: (slug) => ["blog", slug],
};

export function useBlogsQuery(params) {
  return useQuery({
    queryKey: ["blogs", params || {}],
    queryFn: async () => {
      const query = new URLSearchParams();
      if (params?.q) query.set("search", params.q);
      if (params?.category) query.set("category", params.category);
      if (params?.featured) query.set("featured", String(params.featured));
      if (params?.sort) query.set("sortBy", params.sort);
      if (params?.page) query.set("page", String(params.page));
      if (params?.limit) query.set("limit", String(params.limit));
      const endpoint = query.toString() ? `/blogs?${query}` : "/blogs";
      const res = await client().get(endpoint);
      return extractList(res, "blogs");
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}

export function useBlogQuery(slug) {
  return useQuery({
    queryKey: ["blog", slug],
    queryFn: async () => {
      if (!slug) return null;
      const endpoint = `/blogs/slug/${slug}`;
      const res = await client().get(endpoint);
      return extractItem(res, "blog");
    },
    staleTime: 5 * 60 * 1000,
    enabled: !!slug,
    placeholderData: (previousData) => previousData ?? null,
  });
}

export function useCreateBlog(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createBlogAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create blog");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      toast.success("Blog created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create blog");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateBlog(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateBlogAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update blog");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Blog updated successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update blog");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteBlog(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      deleteBlogAction(id).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to delete blog");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: blogKeys.all });
      queryClient.invalidateQueries({ queryKey: ["blog"] });
      toast.success("Blog deleted successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to delete blog");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useBlogSearch(params) {
  const { data, isLoading: loading, error } = useBlogsQuery(params);
  let blogs = [];
  if (data) {
    if (Array.isArray(data)) blogs = data;
    else if (Array.isArray(data.data)) blogs = data.data;
    else if (Array.isArray(data.blogs)) blogs = data.blogs;
  }
  return { blogs, loading, error: error || null };
}
