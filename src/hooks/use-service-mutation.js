"use client";

import servicesApi from "@/lib/api/services";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useCreateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: servicesApi.createService,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    },
  });
}

export function useUpdateService() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }) => servicesApi.updateService(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
      queryClient.invalidateQueries({ queryKey: ["service", variables.id] });
    },
  });
}