import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getClient } from "@/lib/http-client";

export const workerKeys = {
  all: ["admin-workers"],
  detail: (id) => ["worker", id],
};

export function useWorkersQuery() {
  return useQuery({
    queryKey: workerKeys.all,
    queryFn: async () => {
      const res = await getClient().get("/admin/workers");
      return res.data?.data?.workers || [];
    },
  });
}

export function useWorkerQuery(id) {
  return useQuery({
    queryKey: workerKeys.detail(id),
    queryFn: async () => {
      if (!id) return null;
      const res = await getClient().get(`/admin/workers/${id}`);
      return res.data?.data?.worker || null;
    },
    enabled: !!id,
  });
}

export function useDeleteWorker(componentOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) => getClient().delete(`/admin/workers/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.all });
    },
    ...componentOptions,
  });
}

export function useCreateWorker(componentOptions = {}) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => getClient().post("/admin/workers", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workerKeys.all });
    },
    ...componentOptions,
  });
}
