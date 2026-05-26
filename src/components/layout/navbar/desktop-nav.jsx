"use client";

import { LinkItem } from "@/components/layout/navbar/shared";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { getData } from "@/data";
import { useLocale, useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function DesktopNav() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const pathname = usePathname();
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const mainNavLinks = getData("mainNavLinks", locale);
  const primaryLinks = getData("primaryLinks", locale);
  const moreLinks = getData("moreLinks", locale);

  return (
    // Changed from lg:flex → xl:flex to stay in sync with navbar breakpoint
    <NavigationMenu viewport={false} className="hidden xl:flex">
      <NavigationMenuList>
        {/* Product categories with dropdown */}
        {mainNavLinks.map((category) => (
          <NavigationMenuItem key={category.category} className="bg-transparent">
            <NavigationMenuTrigger className="bg-transparent">
              <NavigationMenuLink>{category.category}</NavigationMenuLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-1 pr-1.5">
              <div className="w-xs space-y-2 rounded-lg bg-popover p-2">
                {category.links.map((item, i) => (
                  <NavigationMenuLink asChild key={`${item.href}-${i}`}>
                    <LinkItem {...item} />
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}

        {/* Primary flat links */}
        {primaryLinks.map((link) => {
          const isActive =
            pathWithoutLocale === link.href ||
            pathWithoutLocale === link.href + "/" ||
            (link.href !== "/" && pathWithoutLocale.startsWith(link.href + "/"));

          return (
            <NavigationMenuLink key={link.href} asChild>
              <Link
                className={cn(
                  "rounded-md px-4 py-2 font-medium hover:bg-accent",
                  isActive && "bg-accent text-accent-foreground font-semibold",
                )}
                href={link.href}
              >
                {link.label}
              </Link>
            </NavigationMenuLink>
          );
        })}

        {/* More dropdown */}
        <NavigationMenuItem className="bg-transparent">
          <NavigationMenuTrigger className="bg-transparent">
            <NavigationMenuLink>{t("more")}</NavigationMenuLink>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-1 pr-1.5">
            <div className="w-xs space-y-2 rounded-lg bg-popover p-2">
              {moreLinks.map((item, i) => (
                <NavigationMenuLink asChild key={`more-${item.href}-${i}`}>
                  <LinkItem {...item} />
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
