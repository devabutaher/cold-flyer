"use client";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppHeader } from "./app-header";
import { AppSidebar } from "./app-sidebar";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";

export function AppShell({ children }) {
  const pathname = usePathname();

  return (
    <div className="relative overflow-hidden">
      <SidebarProvider className="relative h-svh">
        <AppSidebar />
        <SidebarInset className="md:peer-data-[variant=inset]:ml-0">
          <AppHeader />
          <div className="relative flex flex-1 flex-col gap-4 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6">
            <motion.div
              key={pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              className="mx-auto w-full max-w-[1400px]"
            >
              {children}
            </motion.div>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
