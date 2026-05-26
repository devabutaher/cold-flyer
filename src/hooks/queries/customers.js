"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const customerKeys = {
  all: ["customers"],
};

export function useCustomersQuery() {
  return useQuery({
    queryKey: customerKeys.all,
    queryFn: async () => {
      const res = await client().get("/api/customers");
      return res.data?.data?.customers || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateCustomer(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      client().post("/api/customers", { ...data, amount: Number(data.amount) || undefined }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer created");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateCustomer(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      client().patch(`/api/customers/${id}`, { ...data, amount: Number(data.amount) || undefined }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer updated");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteCustomer(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/api/customers/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer deleted");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useToggleCustomerStatus(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().patch(`/api/customers/${id}/toggle`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: customerKeys.all });
      toast.success("Customer status updated");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
