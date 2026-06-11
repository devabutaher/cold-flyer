"use client";

import { useAuth } from "@/components/providers";
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
import { HomeIcon, PlusIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { footerNavLinks, navGroups } from "./app-shared";
import { NavGroup } from "./nav-group";

export function AppSidebar() {
  const pathname = usePathname();
  const { backendUser } = useAuth();
  const userRole = backendUser?.role;

  const visibleGroups = navGroups
    .map((group) => ({
      ...group,
      items: group.items
        .filter((item) => item.roles?.includes(userRole))
        .map((item) => ({
          ...item,
          subItems: item.subItems?.filter((s) => s.roles?.includes(userRole)),
        }))
        .filter((item) => !item.subItems || item.subItems.length > 0),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader className="h-14 justify-center">
        <SidebarMenuButton asChild>
          <Link href="/">
            <HomeIcon />
            <h1 className="font-bold text-xl font-sans">
              Cold<span className="text-primary">Flyer</span>
            </h1>
          </Link>
        </SidebarMenuButton>
      </SidebarHeader>

      <SidebarContent>
        {["admin", "moderator"].includes(userRole) && (
          <SidebarGroup className="space-y-2">
            <SidebarMenuItem className="flex items-center gap-2">
              <Link href="/dashboard/items/add" className="w-full">
                <SidebarMenuButton
                  className="min-w-8 bg-primary text-primary-foreground duration-200 ease-linear hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground font-bold"
                  tooltip="Add New Product"
                >
                  <PlusIcon />
                  <span>Add New Product</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
            <SidebarMenuItem className="flex items-center gap-2">
              <Link href="/dashboard/services/add" className="w-full">
                <SidebarMenuButton
                  className="min-w-8 bg-secondary text-secondary-foreground duration-200 ease-linear hover:bg-secondary/90 hover:text-secondary-foreground active:bg-secondary/90 active:text-secondary-foreground font-bold"
                  tooltip="Add New Service"
                >
                  <PlusIcon />
                  <span>Add New Service</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          </SidebarGroup>
        )}

        {visibleGroups.map((group, index) => (
          <NavGroup key={`sidebar-group-${index}`} {...group} pathname={pathname} />
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
                  className={isActive ? "bg-accent text-accent-foreground font-bold" : "text-muted-foreground"}
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
