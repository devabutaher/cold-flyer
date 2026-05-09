"use client";

import servicesApi from "@/lib/api/services";
import { useQuery } from "@tanstack/react-query";

export function useService(slugOrId) {
  const {
    data: service,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: ["service", slugOrId],
    queryFn: async () => {
      const response = await servicesApi.getServiceBySlug(slugOrId);
      const serviceData = response.data?.service || response.data || response;
      return serviceData || null;
    },
    enabled: !!slugOrId,
  });

  return { service, loading, error };
}
