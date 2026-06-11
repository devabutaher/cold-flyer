import { useQuery } from "@tanstack/react-query";
import { getClient, extractItem } from "@/lib/http-client";

const client = () => getClient();

export function useStatsQuery() {
  return useQuery({
    queryKey: ["public", "stats"],
    queryFn: async () => {
      const res = await client().get("/public/stats");
      return extractItem(res, "data") || {};
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
    placeholderData: (previousData) => previousData,
  });
}
