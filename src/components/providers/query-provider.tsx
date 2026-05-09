/**
 * Query Provider - Configures TanStack Query for the application
 * Uses React 19+ QueryClient pattern with proper SSR support
 */

"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// Create query client with optimal defaults
let clientQueryClientInstance: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always create a new client for each request
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

  // Browser: reuse client across the entire app lifecycle
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

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}