"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const dashboardKeys = {
  stats: ["dashboard-stats"],
};

export function useDashboardStatsQuery(enabled = true) {
  return useQuery({
    queryKey: dashboardKeys.stats,
    queryFn: async () => {
      const res = await client().get("/admin/dashboard");
      return res.data?.data || {};
    },
    enabled,
    refetchInterval: enabled ? 60000 : undefined,
    placeholderData: (prev) => prev,
  });
}
