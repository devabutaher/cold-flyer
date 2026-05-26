"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const expenseKeys = {
  all: ["admin-expenses"],
};

export function useExpensesQuery() {
  return useQuery({
    queryKey: expenseKeys.all,
    queryFn: async () => {
      const res = await client().get("/expenses");
      return res.data?.data?.expenses || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateExpense(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) => client().post("/expenses", { ...data, amount: Number(data.amount) }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense created");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateExpense(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) => client().patch(`/expenses/${id}`, { ...data, amount: Number(data.amount) }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense updated");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteExpense(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/expenses/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: expenseKeys.all });
      toast.success("Expense deleted");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
