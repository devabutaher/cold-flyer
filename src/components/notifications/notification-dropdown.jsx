"use client";

import { useNotificationsQuery, useMarkNotificationRead, useMarkAllNotificationsRead } from "@/hooks/queries";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BellIcon, CheckCheck, Loader2 } from "lucide-react";
import { useMemo } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

function getNotificationUrl(notification) {
  const data = notification.data || {};
  if (data.url) return data.url;
  if (data.orderId) return `/dashboard/orders/${data.orderId}`;
  if (data.serviceId) return `/dashboard/bookings/${data.serviceId}`;
  return "#";
}

const TYPE_ICONS = {
  order_update: "🛒",
  payment: "💳",
  service: "🔧",
  review: "⭐",
  system: "⚙️",
  promotion: "🎉",
};

export function NotificationDropdown() {
  const { data: notifications = [], isLoading } = useNotificationsQuery();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = useMemo(() => notifications.filter((n) => !n.isRead).length, [notifications]);

  const handleMarkAllRead = () => {
    markAllRead.mutate();
  };

  const handleMarkRead = (id) => {
    markRead.mutate(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button aria-label="Notifications" size="icon-sm" variant="outline" className="relative">
          <BellIcon />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-bold text-destructive-foreground px-1">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-80">
        <DropdownMenuLabel className="flex items-center justify-between">
          <span>Notifications</span>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="xs"
              className="gap-1 text-xs h-auto py-0.5"
              onClick={handleMarkAllRead}
              disabled={markAllRead.isPending}
            >
              {markAllRead.isPending ? <Loader2 size={12} className="animate-spin" /> : <CheckCheck size={12} />}
              Mark all read
            </Button>
          )}
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 size={20} className="animate-spin text-muted-foreground" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">No notifications yet</div>
        ) : (
          <div className="max-h-72 overflow-y-auto">
            {notifications.map((n) => (
              <DropdownMenuItem
                key={n._id}
                className={cn(
                  "flex flex-col items-start gap-0.5 py-3 px-3 cursor-pointer",
                  !n.isRead && "bg-accent/50",
                )}
                asChild
              >
                <Link
                  href={getNotificationUrl(n)}
                  onClick={() => {
                    if (!n.isRead) handleMarkRead(n._id);
                  }}
                >
                  <div className="flex items-center gap-2 w-full">
                    <span className="text-sm">{TYPE_ICONS[n.type] || "📬"}</span>
                    <span className="text-sm font-medium flex-1 truncate">{n.title}</span>
                    {!n.isRead && <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 pl-6">{n.message}</p>
                  <span className="text-[10px] text-muted-foreground pl-6 mt-0.5">
                    {new Date(n.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </Link>
              </DropdownMenuItem>
            ))}
          </div>
        )}

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild className="justify-center text-sm font-medium">
          <Link href="/dashboard">View all notifications</Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
