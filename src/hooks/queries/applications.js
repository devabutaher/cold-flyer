"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getClient } from "@/lib/http-client";

const client = () => getClient();

export const applicationKeys = {
  all: ["admin-applications"],
};

export function useApplicationsQuery() {
  return useQuery({
    queryKey: applicationKeys.all,
    queryFn: async () => {
      const res = await client().get("/admin/applications");
      return res.data?.data?.applications || [];
    },
    placeholderData: (prev) => prev,
  });
}

export function useApproveApplication(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().patch(`/admin/applications/${id}/approve`, {}),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      queryClient.invalidateQueries({ queryKey: ["admin-technicians"] });
      toast.success("Application approved. Technician profile created.");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useRejectApplication(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: ({ id, notes }) => client().patch(`/admin/applications/${id}/reject`, { notes }),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      toast.success("Application rejected");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}

export function useDeleteApplication(componentOptions = {}) {
  const queryClient = useQueryClient();
  const { onSuccess: userOnSuccess, onError: userOnError, ...rest } = componentOptions;

  return useMutation({
    mutationFn: (id) => client().delete(`/admin/applications/${id}`),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: applicationKeys.all });
      toast.success("Application deleted");
      userOnSuccess?.(data, variables, context);
    },
    onError: (error, variables, context) => {
      toast.error(error.response?.data?.message || error.message);
      userOnError?.(error, variables, context);
    },
    ...rest,
  });
}
