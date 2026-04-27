"use client";

import { UserDropdown } from "@/components/auth/user-dropdown";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";
import Link from "next/link";

export function LinkItem({
  label,
  description,
  icon,
  className,
  href,
  ...props
}) {
  return (
    <a
      className={cn("flex items-center gap-x-2", className)}
      href={href}
      {...props}
    >
      <div
        className={cn(
          "flex aspect-square size-6 items-center justify-center rounded-md border bg-card text-sm shadow-sm",
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

export function NavButtons() {
  const { user, loading } = useAuth();

  if (loading) return null;
  return (
    <>
      {user ? (
        <>
          <Link href={"/dashboard"}>
            <Button>Dashboard</Button>
          </Link>
          <UserDropdown user={user} />
        </>
      ) : (
        <div className="mt-5 md:mt-0 flex flex-col md:flex-row gap-2">
          <Link href={"/auth"}>
            <Button variant="destructive">Sign In</Button>
          </Link>
          <Link href={"/auth"}>
            <Button>Register</Button>
          </Link>
        </div>
      )}
    </>
  );
}
