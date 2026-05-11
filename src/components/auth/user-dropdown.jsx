"use client";

import { BadgeCheckIcon, CreditCardIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/components/providers";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function UserDropdown({ user }) {
  const { logOut } = useAuth();
  const router = useRouter();

  const handleLogOut = () => {
    logOut();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className={"bg-primary"}>
            <AvatarImage
              src={user?.photoURL || ""}
              alt={user?.displayName || "User avatar"}
            />

            <AvatarFallback className={"bg-primary text-background"}>
              {user?.displayName?.[0]?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <Link href="/dashboard/profile" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <BadgeCheckIcon className="mr-2" />
              Profile
            </DropdownMenuItem>
          </Link>
          <Link href="/dashboard/orders" passHref>
            <DropdownMenuItem className="cursor-pointer">
              <CreditCardIcon className="mr-2" />
              Orders
            </DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <button className="w-full" onClick={handleLogOut}>
          <DropdownMenuItem>
            <LogOutIcon className="mr-2" />
            Sign Out
          </DropdownMenuItem>
        </button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
