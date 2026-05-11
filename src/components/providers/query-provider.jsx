/**
 * Query Provider - Configures TanStack Query for the application
 * Uses React 19+ QueryClient pattern with proper SSR support
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

let clientQueryClientInstance;

export let queryClient;

function getQueryClient() {
  if (typeof window === "undefined") {
    return new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }

  if (!clientQueryClientInstance) {
    clientQueryClientInstance = new QueryClient({
      defaultOptions: {
        queries: {
          staleTime: 60 * 1000,
          refetchOnWindowFocus: false,
          refetchOnMount: false,
          retry: 1,
        },
        mutations: {
          retry: 0,
        },
      },
    });
  }

  return clientQueryClientInstance;
}

export function QueryProvider({ children }) {
  queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}