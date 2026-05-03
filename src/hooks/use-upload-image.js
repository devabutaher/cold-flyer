"use client";

import api from "@/lib/api";
import { useMutation } from "@tanstack/react-query";

export function useUploadImage() {
  return useMutation({
    mutationFn: async ({ file, fieldName = "image" }) => {
      const response = await api.upload("/api/upload", file, fieldName);
      return response.data;
    },
  });
}