"use client";

import { useTranslations } from "next-intl";
import {
  BadgeCheckIcon,
  CalendarCheck,
  CreditCardIcon,
  LayoutDashboard,
  LogOutIcon,
  Package,
  Tag,
  UserCog,
  Users,
  Wrench,
} from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";

export function UserDropdown() {
  const t = useTranslations("common");
  const tn = useTranslations("nav");
  const { backendUser, logOut } = useAuth();
  const router = useRouter();

  if (!backendUser) return null;

  const name = backendUser.name || backendUser.email || "User";
  const initial = name[0]?.toUpperCase() || "U";
  const isAdmin = backendUser?.role === "admin";

  const handleLogOut = () => {
    logOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="bg-primary">
            <AvatarImage src={backendUser.avatar || ""} alt={name} />
            <AvatarFallback className="bg-primary text-inverted-foreground">{initial}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuGroup>
          <Link href="/dashboard" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <LayoutDashboard className="mr-2 size-4" />
              {tn("dashboard")}
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <BadgeCheckIcon className="mr-2 size-4" />
              {t("profile")}
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/orders" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCardIcon className="mr-2 size-4" />
              {t("orders")}
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/bookings" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <CalendarCheck className="mr-2 size-4" />
              {tn("myBookings")}
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        {isAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuLabel>Admin</DropdownMenuLabel>
              <Link href="/dashboard/items" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Package className="mr-2 size-4" />
                  {tn("items")}
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/services" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Wrench className="mr-2 size-4" />
                  {t("services")}
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/bookings" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <CalendarCheck className="mr-2 size-4" />
                  {tn("bookings")}
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/users" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Users className="mr-2 size-4" />
                  {tn("users")}
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/technicians" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <UserCog className="mr-2 size-4" />
                  {tn("technicians")}
                </DropdownMenuItem>
              </Link>
              <Link href="/dashboard/coupons" passHref>
                <DropdownMenuItem className="cursor-pointer">
                  <Tag className="mr-2 size-4" />
                  {tn("coupons")}
                </DropdownMenuItem>
              </Link>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator />
        <button className="w-full" onClick={handleLogOut}>
          <DropdownMenuItem>
            <LogOutIcon className="mr-2 size-4" />
            {tn("signOut")}
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
