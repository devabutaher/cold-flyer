"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient, extractList, extractItem } from "@/lib/http-client";
import { createBookingAction, cancelBookingAction, updateBookingAction } from "@/lib/actions/services";

const client = () => getClient();

export const bookingKeys = {
  all: ["bookings"],
  detail: (id) => ["booking", id],
};

export function useBookingsQuery() {
  return useQuery({
    queryKey: bookingKeys.all,
    queryFn: async () => {
      const res = await client().get("/services/bookings");
      return extractList(res, "bookings");
    },
    refetchOnMount: true,
  });
}

export function useBookingQuery(id) {
  return useQuery({
    queryKey: bookingKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await client().get(`/services/bookings/${id}`);
      return extractItem(res, "booking");
    },
    enabled: !!id,
  });
}

export function useCreateBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (data) =>
      createBookingAction(data).then((res) => {
        if (!res.success)
          throw new Error(res.details ? `${res.message}: ${res.details}` : res.message || "Failed to create booking");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      toast.success("Booking created successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to create booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useCancelBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ bookingId, reason }) =>
      cancelBookingAction(bookingId, reason).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to cancel booking");
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.bookingId), refetchType: "all" });
      toast.success("Booking cancelled successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to cancel booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useUpdateBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      updateBookingAction(id, data).then((res) => {
        if (!res.success) throw new Error(res.message || "Failed to update booking");
        return res.data;
      }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id), refetchType: "all" });
      toast.success("Booking updated successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.message || "Failed to update booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useScheduleBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      client()
        .patch(`/services/bookings/${id}/schedule`, data)
        .then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id), refetchType: "all" });
      toast.success("Booking scheduled successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || "Failed to schedule booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useCompleteBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, data }) =>
      client()
        .patch(`/services/bookings/${id}/complete`, data)
        .then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables.id), refetchType: "all" });
      toast.success("Booking completed successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || "Failed to complete booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useConfirmBooking(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      client()
        .patch(`/services/bookings/${id}/confirm`)
        .then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables), refetchType: "all" });
      toast.success("Booking confirmed successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useStartService(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) =>
      client()
        .patch(`/services/bookings/${id}/start`)
        .then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: bookingKeys.all, refetchType: "all" });
      queryClient.invalidateQueries({ queryKey: bookingKeys.detail(variables), refetchType: "all" });
      toast.success("Service started successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || "Failed to start service");
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
