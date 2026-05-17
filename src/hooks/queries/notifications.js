"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient, extractList } from "@/lib/http-client";

const client = () => getClient();

export function useNotificationsQuery() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const res = await client().get("/users/notifications?limit=10");
      return extractList(res, "notifications");
    },
    refetchInterval: 30000,
    placeholderData: (previousData) => previousData,
  });
}

export function useUnreadCountQuery() {
  return useQuery({
    queryKey: ["notifications", "unread-count"],
    queryFn: async () => {
      const res = await client().get("/users/notifications?limit=1");
      return res.data?.data?.meta?.totalUnread ?? 0;
    },
    refetchInterval: 30000,
  });
}

export function useMarkNotificationRead(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().patch(`/users/notifications/${id}/read`).then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useMarkAllNotificationsRead(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: () => client().patch("/users/notifications/read-all").then((r) => r.data),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
