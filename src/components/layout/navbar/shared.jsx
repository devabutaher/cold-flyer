"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LinkItem({
  label,
  description,
  icon,
  className,
  href,
  onClick,
  ...props
}) {
  return (
    <a
      className={cn("flex items-center gap-x-2", className)}
      href={href}
      onClick={onClick}
      {...props}
    >
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

export function NavButtons({ onAuthenticated } = {}) {
  const { user, loading } = useAuth();

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
      {user ? (
        <div className="flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          <Link href={"/dashboard"} className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto">Dashboard</Button>
          </Link>
          <Link href={"/my-bookings"} className="w-full lg:w-auto">
            <Button variant="outline" className="w-full lg:w-auto">My Bookings</Button>
          </Link>
          <div className="hidden lg:block">
            <UserDropdown user={user} />
          </div>
        </div>
      ) : (
        <div className="mt-5 lg:mt-0 flex flex-col lg:flex-row gap-2 w-full lg:w-auto">
          <Link href={"/auth"} className="w-full lg:w-auto">
            <Button
              variant="destructive"
              className="w-full lg:w-auto"
              onClick={onAuthenticated}
            >
              Sign In
            </Button>
          </Link>
          <Link href={"/auth"} className="w-full lg:w-auto">
            <Button className="w-full lg:w-auto" onClick={onAuthenticated}>
              Register
            </Button>
          </Link>
        </div>
      )}
    </>
  );
}
