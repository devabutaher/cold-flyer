"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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
  useSidebar,
} from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { ChevronRightIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

function SidebarFlyout({ items, top, onMouseEnter, onMouseLeave, onItemClick }) {
  const pathname = usePathname();

  return (
    <div
      data-sidebar-flyout
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="fixed left-14 z-50 min-w-48 rounded-lg bg-sidebar p-2 shadow-xl"
      style={{ top }}
    >
      <div className="flex flex-col gap-0.5">
        {items.map((subItem) => {
          const isSubActive = pathname === subItem.path;
          return (
            <Link
              key={subItem.title}
              href={subItem.path}
              onClick={onItemClick}
              className={cn(
                "flex items-center gap-2 rounded-md px-2 py-1.5 text-sm text-sidebar-foreground transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isSubActive && "bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground font-bold",
              )}
            >
              {subItem.icon}
              <span>{subItem.title}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export function NavGroup({ label, items }) {
  const pathname = usePathname();
  const { setOpenMobile, state } = useSidebar();
  const [flyout, setFlyout] = useState(null);
  const openTimer = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(openTimer.current);
      clearTimeout(closeTimer.current);
    };
  }, []);

  const closeFlyout = useCallback(() => setFlyout(null), []);

  const handleItemEnter = (e, subItems, title) => {
    if (state !== "collapsed") return;
    clearTimeout(closeTimer.current);
    clearTimeout(openTimer.current);
    const menuItem = e.currentTarget.closest('[data-sidebar="menu-item"]');
    if (!menuItem) return;
    const rect = menuItem.getBoundingClientRect();
    openTimer.current = setTimeout(() => {
      setFlyout({ top: rect.top, items: subItems, title });
    }, 250);
  };

  const handleItemLeave = () => {
    clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(closeFlyout, 250);
  };

  const handleFlyoutEnter = () => {
    clearTimeout(closeTimer.current);
  };

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
                          tooltip={state !== "collapsed" ? item.title : undefined}
                          isActive={hasActiveChild}
                          className={cn(
                            hasActiveChild && "bg-accent text-accent-foreground font-bold",
                            "transition-all duration-200",
                          )}
                          onMouseEnter={(e) => handleItemEnter(e, item.subItems, item.title)}
                          onMouseLeave={handleItemLeave}
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
                                      <Link href={subItem.path} onClick={() => setOpenMobile(false)}>
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
                        <Link href={item.path} onClick={() => setOpenMobile(false)}>
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
      {state === "collapsed" && flyout && (
        <SidebarFlyout
          items={flyout.items}
          top={flyout.top}
          onMouseEnter={handleFlyoutEnter}
          onMouseLeave={handleItemLeave}
          onItemClick={() => { setOpenMobile(false); closeFlyout(); }}
        />
      )}
    </SidebarGroup>
  );
}
