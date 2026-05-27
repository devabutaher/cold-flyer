"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const userKeys = {
  all: ["admin-users"],
  detail: (id) => ["user", id],
};

export function useUsersQuery() {
  return useQuery({
    queryKey: userKeys.all,
    queryFn: async () => {
      const res = await client().get("/admin/users");
      return res.data?.data?.users || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useUserQuery(id) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await client().get(`/admin/users/${id}`);
      return res.data?.data?.user || null;
    },
    enabled: !!id,
    placeholderData: (prev) => prev,
  });
}

export function useUpdateUserRole(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, role }) => client().patch(`/admin/users/${id}`, { role }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(variables.id) });
      toast.success("User role updated");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useCreateUser(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) => client().post("/admin/users", data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteUser(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/admin/users/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
      toast.success("User deleted");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
