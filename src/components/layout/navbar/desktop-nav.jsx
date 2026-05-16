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
import { useLocale } from "next-intl";
import { getData } from "@/data";
import Link from "next/link";

export function DesktopNav() {
  const locale = useLocale();
  const { mainNavLinks, staticLinks } = { mainNavLinks: getData("mainNavLinks", locale), staticLinks: getData("staticLinks", locale) };
  return (
    <NavigationMenu className="hidden lg:flex">
      <NavigationMenuList>
        {mainNavLinks.map((category) => (
          <NavigationMenuItem key={category.category} className="bg-transparent">
            <NavigationMenuTrigger className="bg-transparent">
              <NavigationMenuLink>{category.category}</NavigationMenuLink>
            </NavigationMenuTrigger>
            <NavigationMenuContent className="p-1 pr-1.5">
              <div className="rounded-lg w-xs space-y-2 bg-popover p-2">
                {category.links.map((item, i) => (
                  <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                    <LinkItem {...item} />
                  </NavigationMenuLink>
                ))}
              </div>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
        {staticLinks.map((link) => (
          <NavigationMenuLink key={link.label} asChild className="px-4">
            <Link className="rounded-md p-2 hover:bg-accent font-medium" href={link.href}>
              {link.label}
            </Link>
          </NavigationMenuLink>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
