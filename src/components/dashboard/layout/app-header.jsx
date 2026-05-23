"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { LocaleSwitcher } from "@/components/layout/locale-switcher";
import { ThemeToggle } from "@/components/layout/navbar/shared";
import { NotificationDropdown } from "@/components/notifications/notification-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { MaximizeIcon, MinimizeIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { navLinks } from "./app-shared";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";

const activeItem = navLinks.find((item) => item.isActive);

function FullscreenToggle() {
  const [isFullscreen, setIsFullscreen] = useState(false);

  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", handler);
    return () => document.removeEventListener("fullscreenchange", handler);
  }, []);

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button size="icon-sm" variant="outline" onClick={toggleFullscreen} aria-label="Toggle fullscreen">
        {isFullscreen ? <MinimizeIcon /> : <MaximizeIcon />}
      </Button>
    </motion.div>
  );
}

export function AppHeader() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6 bg-sidebar",
      )}
    >
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator className="mr-2 h-4 data-[orientation=vertical]:self-center" orientation="vertical" />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-2">
        <LocaleSwitcher />
        <ThemeToggle />
        <FullscreenToggle />
        <Separator className="h-4 data-[orientation=vertical]:self-center" orientation="vertical" />
        <NotificationDropdown />
        <UserDropdown />
      </div>
    </motion.header>
  );
}
