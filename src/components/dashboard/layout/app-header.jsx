"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { BellIcon, SendIcon } from "lucide-react";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { navLinks } from "./app-shared";
import { CustomSidebarTrigger } from "./custom-sidebar-trigger";

const activeItem = navLinks.find((item) => item.isActive);

export function AppHeader() {
  return (
    <header
      className={cn(
        "sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between gap-2 border-b px-4 md:px-6 bg-sidebar",
      )}
    >
      <div className="flex items-center gap-3">
        <CustomSidebarTrigger />
        <Separator
          className="mr-2 h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <AppBreadcrumbs page={activeItem} />
      </div>
      <div className="flex items-center gap-3">
        <Button size="icon-sm" variant="outline">
          <SendIcon />
        </Button>
        <Button aria-label="Notifications" size="icon-sm" variant="outline">
          <BellIcon />
        </Button>
        <Separator
          className="h-4 data-[orientation=vertical]:self-center"
          orientation="vertical"
        />
        <UserDropdown />
      </div>
    </header>
  );
}
