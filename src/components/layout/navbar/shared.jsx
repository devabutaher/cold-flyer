"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Moon, Sun } from "lucide-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";

export function LinkItem({ label, description, icon, className, href, onClick, ...props }) {
  return (
    <a className={cn("flex items-center gap-x-2", className)} href={href} onClick={onClick} {...props}>
      <div
        className={cn(
          "flex aspect-square size-6 items-center justify-center rounded-lg border bg-card text-sm shadow-sm",
          "[&_svg:not([class*='size-'])]:size-5 [&_svg:not([class*='size-'])]:text-foreground",
        )}
      >
        {icon}
      </div>
      <div className="flex flex-col items-start justify-center">
        <span className="font-medium">{label}</span>
      </div>
    </a>
  );
}

function ThemeToggle() {
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

export function NavButtons({ onAuthenticated } = {}) {
  const t = useTranslations("nav");
  const { backendUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
        <Skeleton className="h-9 w-18 rounded-md" />
        <Skeleton className="h-9 w-20 rounded-md" />
      </div>
    );
  }

  return (
    <>
      {backendUser ? (
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          <Link href={"/dashboard"} className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">{t("dashboard")}</Button>
          </Link>
          <Link href={"/my-bookings"} className="w-full lg:w-auto">
            <Button variant="outline" className="w-full lg:w-auto">
              {t("myBookings")}
            </Button>
          </Link>
          <ThemeToggle />
          <div className="hidden lg:block">
            <UserDropdown />
          </div>
        </div>
      ) : (
        <div className="mt-5 lg:mt-0 flex flex-col lg:flex-row gap-2 w-full lg:w-auto items-center">
          <ThemeToggle />
          <Link href={"/auth"} className="w-full lg:w-auto">
            <Button variant="destructive" className="w-full lg:w-auto" onClick={onAuthenticated}>
              {t("signIn")}
            </Button>
          </Link>
          <Link href={"/auth"} className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto" onClick={onAuthenticated}>
              {t("signUp")}
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
