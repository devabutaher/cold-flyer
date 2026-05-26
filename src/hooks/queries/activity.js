"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const activityKeys = {
  all: ["activity"],
};

export function useActivityLogQuery() {
  return useQuery({
    queryKey: activityKeys.all,
    queryFn: async () => {
      const res = await client().get("/activity");
      return res.data?.data?.logs || [];
    },
    placeholderData: (prev) => prev,
  });
}
