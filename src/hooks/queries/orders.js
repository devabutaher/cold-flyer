"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient, extractList, extractItem } from "@/lib/http-client";
import { createOrderAction, cancelOrderAction, verifyPaymentAction } from "@/lib/actions/orders";

const client = () => getClient();

export const orderKeys = {
  all: ["orders"],
  detail: (id) => ["order", id],
};

export function useOrdersQuery() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: async () => {
      const res = await client().get("/orders");
      return extractList(res, "orders");
    },
    placeholderData: (previousData) => previousData,
  });
}

export function useOrderQuery(id) {
  return useQuery({
    queryKey: orderKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await client().get(`/orders/${id}`);
      return extractItem(res, "order");
    },
    enabled: !!id,
    refetchInterval: (query) => {
      const order = query.state.data;
      if (!order || order.paymentStatus === "paid" || order.paymentStatus === "failed") return false;
      return 3000;
    },
  });
}

export function useCreateOrder(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createOrderAction(data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to create order");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      toast.success("Order created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create order");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useCancelOrder(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ orderId, reason }) =>
      cancelOrderAction(orderId, reason).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to cancel order");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success("Order cancelled successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to cancel order");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useVerifyPayment(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ orderId, sessionId }) =>
      verifyPaymentAction(orderId, sessionId).then((res) => {
        if (!res.success) throw new Error(res.message || "Payment verification failed");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({ queryKey: orderKeys.detail(variables.orderId) });
      toast.success("Payment verified successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Payment verification failed");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
