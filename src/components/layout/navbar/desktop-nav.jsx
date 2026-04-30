import { LinkItem } from "@/components/layout/navbar/shared";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { productLinks } from "@/data/nav-links";
import Link from "next/link";

export function DesktopNav() {
  return (
    <NavigationMenu className="hidden md:flex">
      <NavigationMenuList>
        <NavigationMenuItem className="bg-transparent">
          <NavigationMenuTrigger className="bg-transparent">
            <Link href={"/items"}>Product</Link>
          </NavigationMenuTrigger>
          <NavigationMenuContent className="p-1 pr-1.5">
            <div className="rounded-lg w-xs space-y-2 bg-popover p-2">
              {productLinks.map((item, i) => (
                <NavigationMenuLink asChild key={`item-${item.label}-${i}`}>
                  <LinkItem {...item} />
                </NavigationMenuLink>
              ))}
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuLink asChild className="px-4">
          <Link
            className="rounded-md p-2 hover:bg-accent font-medium"
            href="/services"
          >
            Services
          </Link>
        </NavigationMenuLink>
        <NavigationMenuLink asChild className="px-4">
          <Link
            className="rounded-md p-2 hover:bg-accent font-medium"
            href="/about"
          >
            About
          </Link>
        </NavigationMenuLink>
        <NavigationMenuLink asChild className="px-4">
          <Link
            className="rounded-md p-2 hover:bg-accent font-medium"
            href="/terms"
          >
            Terms
          </Link>
        </NavigationMenuLink>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
