"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const locationKeys = {
  all: ["location"],
};

export function useLocationQuery() {
  return useQuery({
    queryKey: locationKeys.all,
    queryFn: async () => {
      const res = await client().get("/api/location");
      return res.data?.data || { workers: [], todayLog: [] };
    },
    placeholderData: (prev) => prev,
  });
}
