"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const messageKeys = {
  all: ["messages"],
};

export function useMessagesQuery() {
  return useQuery({
    queryKey: messageKeys.all,
    queryFn: async () => {
      const res = await client().get("/api/messages");
      return res.data?.data?.messages || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useLogMessage(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ time, name, number, channel, message }) =>
      client().post("/api/messages", { time, name, number, channel, message }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: messageKeys.all });
      toast.success("Message sent");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
