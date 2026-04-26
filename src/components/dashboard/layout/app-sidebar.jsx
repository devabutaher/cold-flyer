"use client";

import Logo from "@/components/ui/logo";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNavLinks, navGroups } from "./app-shared";
import { NavGroup } from "./nav-group";

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton asChild variant="outline">
          <Logo />
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenuItem className="flex items-center gap-2">
            <SidebarMenuButton
              className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-bold"
              tooltip="Add New Product"
            >
              <PlusIcon />
              <span>Add New Product</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarGroup>

        {navGroups.map((group, index) => (
          <NavGroup
            key={`sidebar-group-${index}`}
            {...group}
            pathname={pathname}
          />
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu className="mt-2">
          {footerNavLinks.map((item) => {
            const isActive = pathname === item.path;
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  size="sm"
                  className={
                    isActive
                      ? "bg-accent text-accent-foreground font-bold"
                      : "text-muted-foreground"
                  }
                >
                  <Link href={item.path}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
