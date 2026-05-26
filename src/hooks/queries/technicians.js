"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const technicianKeys = {
  all: ["technicians"],
  detail: (id) => ["technician", id],
};

export function useTechniciansQuery() {
  return useQuery({
    queryKey: technicianKeys.all,
    queryFn: async () => {
      const res = await client().get("/admin/technicians");
      return res.data?.data?.technicians || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useTechnicianQuery(id) {
  return useQuery({
    queryKey: technicianKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await client().get(`/admin/technicians/${id}`);
      return res.data?.data?.technician || null;
    },
    enabled: !!id,
    placeholderData: (prev) => prev,
  });
}

export function useDeleteTechnician(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/admin/technicians/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: technicianKeys.all });
      toast.success("Technician removed");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
