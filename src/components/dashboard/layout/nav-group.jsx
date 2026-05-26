"use client";

import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export function NavGroup({ label, items }) {
  const pathname = usePathname();

  return (
    <SidebarGroup>
      {label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
      <SidebarMenu>
        {items.map((item, idx) => {
          const isActive = pathname === item.path;
          const hasActiveChild = item.subItems?.some((s) => pathname === s.path);

          return (
            <Collapsible
              asChild
              key={item.title}
              className="group/collapsible"
              defaultOpen={isActive || hasActiveChild}
            >
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, delay: idx * 0.04 }}
              >
                <SidebarMenuItem>
                  {item.subItems?.length ? (
                    <>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton
                          tooltip={item.title}
                          isActive={hasActiveChild}
                          className={cn(
                            hasActiveChild && "bg-accent text-accent-foreground font-bold",
                            "transition-all duration-200",
                          )}
                        >
                          {item.icon}
                          <span>{item.title}</span>
                          <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <AnimatePresence mode="wait">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.25, ease: "easeOut" }}
                          >
                            <SidebarMenuSub>
                              {item.subItems.map((subItem) => {
                                const isSubActive = pathname === subItem.path;
                                return (
                                  <SidebarMenuSubItem key={subItem.title}>
                                    <SidebarMenuSubButton
                                      asChild
                                      isActive={isSubActive}
                                      className={cn(
                                        isSubActive &&
                                          "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold",
                                        "transition-all duration-150",
                                      )}
                                    >
                                      <Link href={subItem.path}>
                                        {subItem.icon}
                                        <span>{subItem.title}</span>
                                      </Link>
                                    </SidebarMenuSubButton>
                                  </SidebarMenuSubItem>
                                );
                              })}
                            </SidebarMenuSub>
                          </motion.div>
                        </AnimatePresence>
                      </CollapsibleContent>
                    </>
                  ) : (
                    <motion.div whileHover={{ x: 2 }} transition={{ duration: 0.15 }}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        isActive={isActive}
                        className={cn(
                          isActive &&
                            "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold",
                          "transition-all duration-200",
                        )}
                      >
                        <Link href={item.path}>
                          {item.icon}
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </motion.div>
                  )}
                </SidebarMenuItem>
              </motion.div>
            </Collapsible>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
