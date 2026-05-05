"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CreditCard, Eye, MoreHorizontal, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function OrderRowActions({ order, onPay, onCancel, payingOrderId }) {
  const [showCancel, setShowCancel] = useState(false);

  const canPay = order.paymentStatus !== "paid";
  const canCancel =
    order.paymentStatus !== "paid" && order.status !== "cancelled";
  const isPaying = payingOrderId === order._id;

  return (
    <>
      <div className="flex items-center justify-end gap-2">
        {canPay && (
          <Button
            size="sm"
            className="h-7 px-3 text-xs"
            disabled={isPaying}
            onClick={(e) => {
              e.stopPropagation();
              onPay(order._id);
            }}
          >
            <CreditCard size={12} className="mr-1.5" />
            {isPaying ? "Processing…" : "Pay Now"}
          </Button>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
            >
              <MoreHorizontal size={14} />
              <span className="sr-only">Order actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/orders/${order._id}`}
                className="flex items-center"
              >
                <Eye size={13} className="mr-2" />
                View Details
              </Link>
            </DropdownMenuItem>
            {canCancel && (
              <>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCancel(true);
                  }}
                >
                  <X size={13} className="mr-2" />
                  Cancel Order
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showCancel} onOpenChange={setShowCancel}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Order{" "}
              <strong>
                {order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}
              </strong>{" "}
              will be cancelled. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Order</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={() => {
                onCancel(order._id);
                setShowCancel(false);
              }}
            >
              Cancel Order
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
