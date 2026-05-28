"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const couponKeys = {
  all: ["admin-coupons"],
};

export function useCouponsQuery() {
  return useQuery({
    queryKey: couponKeys.all,
    queryFn: async () => {
      const res = await client().get("/admin/coupons");
      return res.data?.data?.coupons || res.data?.coupons || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useCreateCoupon(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) => client().post("/admin/coupons", data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon created");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateCoupon(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) => client().patch(`/admin/coupons/${id}`, data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon updated");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteCoupon(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/admin/coupons/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: couponKeys.all });
      toast.success("Coupon deleted");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export const publicCouponKeys = {
  all: ["public-coupons"],
  lookup: (code) => ["public-coupon", code],
};

export function usePublicCouponsQuery(limit = 4) {
  return useQuery({
    queryKey: [...publicCouponKeys.all, { limit }],
    queryFn: async () => {
      const res = await client().get(`/coupons?limit=${limit}`);
      return res.data?.data?.coupons || res.data?.coupons || [];
    },
    staleTime: 2 * 60 * 1000,
    placeholderData: (prev) => prev,
  });
}

export function useCouponLookupQuery(code) {
  return useQuery({
    queryKey: publicCouponKeys.lookup(code),
    queryFn: async () => {
      if (!code) return null;
      const res = await client().get(`/coupons/lookup/${code}`);
      return res.data?.data?.coupon || null;
    },
    staleTime: 30 * 1000,
    enabled: !!code,
    retry: false,
  });
}

export async function lookupCoupon(code) {
  const res = await client().get(`/coupons/lookup/${code}`);
  return res.data;
}

export function useAutoApplyCoupon(componentOptions = {}) {
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ subtotal, itemCount, items }) =>
      client().post("/coupons/auto-apply", { subtotal, itemCount, items }).then((r) => r.data),
    onSuccess: (data, variables, context) => {
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useApplyOrderCoupon(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ orderId, couponCode, removeCoupon }) =>
      client().patch(`/orders/${orderId}/coupon`, removeCoupon ? { removeCoupon: true } : { couponCode }).then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["order", variables.orderId] });
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
