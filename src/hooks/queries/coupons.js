"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const couponKeys = {
  all: ["coupons"],
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
