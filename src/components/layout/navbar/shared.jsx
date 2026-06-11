"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import {
  AirVent,
  Briefcase,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  Mail,
  Moon,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Sun,
  Truck,
  Users,
} from "lucide-react";
import { useLocale, useTranslations } from "next-intl";

export const NAV_ICONS = {
  AirVent,
  Briefcase,
  FileText,
  HelpCircle,
  Layers,
  LayoutGrid,
  Mail,
  Package,
  Settings,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
};
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function LinkItem({ label, description, icon, className, href, onClick, ...props }) {
  const pathname = usePathname();
  const locale = useLocale();
  const Icon = typeof icon === "string" ? NAV_ICONS[icon] : null;
  const pathWithoutLocale = pathname.replace(new RegExp(`^/${locale}`), "") || "/";
  const isActive =
    pathWithoutLocale === href ||
    pathWithoutLocale === href + "/" ||
    (href !== "/" && pathWithoutLocale.startsWith(href + "/"));

  return (
    <Link
      className={cn(
        "flex items-center gap-x-2",
        isActive && "bg-accent text-accent-foreground font-semibold",
        className,
      )}
      href={href}
      onClick={onClick}
      {...props}
    >
      <div
        className={cn(
          "flex aspect-square size-6 shrink-0 items-center justify-center rounded-lg border bg-card text-sm shadow-sm",
          "[&_svg:not([class*='size-'])]:size-4 [&_svg:not([class*='size-'])]:text-foreground",
        )}
      >
        {typeof icon === "string" ? (Icon ? <Icon size={16} /> : null) : icon}
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="text-sm font-medium">{label}</span>
        {description && <span className="text-xs text-muted-foreground">{description}</span>}
      </div>
    </Link>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        size="icon"
        variant="outline"
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        aria-label="Toggle theme"
      >
        <motion.div
          key={theme}
          initial={{ rotate: -90, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <Sun size={16} className="hidden dark:block" />
          <Moon size={16} className="block dark:hidden" />
        </motion.div>
      </Button>
    </motion.div>
  );
}

/**
 * NavButtons
 *
 * context="desktop" — renders in the sticky navbar (flex-row, all items inline including
 *                     ThemeToggle and UserDropdown)
 * context="mobile"  — renders inside the mobile sheet footer (flex-col, full-width buttons,
 *                     no ThemeToggle/UserDropdown since those live elsewhere in the sheet)
 */
export function NavButtons({ onAuthenticated, context = "desktop", onClick }) {
  const t = useTranslations("nav");
  const { backendUser, loading } = useAuth();

  const isMobile = context === "mobile";

  if (loading) {
    return (
      <div className={cn("flex gap-2", isMobile ? "w-full flex-col" : "flex-row items-center")}>
        <Skeleton className={cn("h-9 rounded-md", isMobile ? "w-full" : "w-24")} />
        {!isMobile && <Skeleton className="h-9 w-24 rounded-md" />}
      </div>
    );
  }

  if (backendUser) {
    return (
      <div className={cn("flex gap-2", isMobile ? "w-full flex-col" : "flex-row items-center")}>
        <Link href="/dashboard" className={isMobile ? "w-full" : undefined}>
          <Button className={cn(isMobile && "w-full")} onClick={onClick}>
            {t("dashboard")}
          </Button>
        </Link>
        <Link href="/dashboard/bookings" className={isMobile ? "w-full" : undefined}>
          <Button variant="outline" className={cn(isMobile && "w-full")} onClick={onClick}>
            {t("myBookings")}
          </Button>
        </Link>
        {/* ThemeToggle + UserDropdown only on desktop — mobile sheet has its own footer */}
        {!isMobile && (
          <>
            <ThemeToggle />
            <UserDropdown />
          </>
        )}
      </div>
    );
  }

  return (
    <div className={cn("flex gap-2", isMobile ? "w-full flex-col" : "flex-row items-center")}>
      {!isMobile && <ThemeToggle />}
      <Link href="/auth" className={isMobile ? "w-full" : undefined}>
        <Button
          variant="default"
          className={cn(isMobile && "w-full")}
          onClick={(e) => {
            onAuthenticated?.(e);
            onClick?.(e);
          }}
        >
          {t("signIn")}
        </Button>
      </Link>
    </div>
  );
}
