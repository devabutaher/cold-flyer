"use client";

import { useQuery } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const reportKeys = {
  report: (year, month) => ["report", year, month],
  duplicates: (field) => ["duplicates", field],
};

export function useReportQuery(year, month) {
  return useQuery({
    queryKey: reportKeys.report(year, month),
    queryFn: async () => {
      const params = new URLSearchParams();
      if (year) params.set("year", year);
      if (month) params.set("month", month);
      const res = await client().get(`/admin/report?${params}`);
      return res.data?.data || {};
    },
    placeholderData: (prev) => prev,
  });
}

export function useDuplicatesQuery(field) {
  return useQuery({
    queryKey: reportKeys.duplicates(field),
    queryFn: async () => {
      const res = await client().get(`/admin/report/duplicates?field=${field}`);
      return res.data?.data?.duplicates || [];
    },
    enabled: !!field,
    placeholderData: (prev) => prev,
  });
}
