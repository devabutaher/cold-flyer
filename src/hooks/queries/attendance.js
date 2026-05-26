"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const attendanceKeys = {
  all: ["attendance"],
  today: () => ["attendance", "today"],
  history: () => ["attendance", "history"],
};

export function useTodayAttendanceQuery() {
  return useQuery({
    queryKey: attendanceKeys.today(),
    queryFn: async () => {
      const res = await client().get("/api/attendance/today");
      return res.data?.data?.workers || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useAttendanceHistoryQuery() {
  return useQuery({
    queryKey: attendanceKeys.history(),
    queryFn: async () => {
      const res = await client().get("/api/attendance/history");
      return res.data?.data?.records || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useCheckinMutation(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ workerId, location, task, lat, lng }) =>
      client().post("/api/attendance/checkin", { workerId, location, task, lat, lng }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today() });
      toast.success("Checked in successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useCheckoutMutation(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ workerId, note }) =>
      client().post("/api/attendance/checkout", { workerId, note }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.today() });
      queryClient.invalidateQueries({ queryKey: attendanceKeys.history() });
      toast.success("Checked out successfully");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
