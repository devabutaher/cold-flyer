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
import { CreditCard, Eye, MoreHorizontal, Smartphone, X } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export function OrderRowActions({ order, onPay, onCancel, payingOrderId }) {
  const [showCancel, setShowCancel] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);

  const canPay = order.paymentMethod !== "cod" && order.paymentStatus !== "paid" && order.status !== "cancelled";
  const canCancel = order.paymentMethod !== "cod" && order.paymentStatus !== "paid" && order.status !== "cancelled";
  const isPaying = payingOrderId === order._id;

  const handleConfirmCancel = async (e) => {
    e.stopPropagation();
    setIsCancelling(true);
    try {
      await onCancel(order._id);
      setShowCancel(false);
    } catch (error) {
      console.error("Failed to cancel order:", error);
    } finally {
      setIsCancelling(false);
    }
  };

  const handleDialogClose = (open) => {
    if (!open) {
      setShowCancel(false);
    }
  };

  return (
    <>
      <div
        className="flex items-center justify-end gap-2"
        onClick={(e) => e.stopPropagation()} // Prevent row click when clicking action buttons
      >
        {canPay && (
          <>
            <Button
              size="sm"
              className="h-7 px-3 text-xs"
              disabled={isPaying}
              onClick={(e) => {
                e.stopPropagation();
                onPay(order._id, "stripe");
              }}
            >
              <CreditCard size={12} className="mr-1.5" />
              {isPaying ? "Processing…" : "Pay"}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground"
                  disabled={isPaying}
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal size={14} />
                  <span className="sr-only">Payment options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPay(order._id, "stripe"); }}>
                  <CreditCard size={13} className="mr-2" />
                  Pay with Card (Stripe)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onPay(order._id, "sslcommerz"); }}>
                  <Smartphone size={13} className="mr-2" />
                  Pay with SSLCOMMERZ
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal size={14} />
              <span className="sr-only">Order actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem asChild>
              <Link
                href={`/dashboard/orders/${order._id}`}
                className="flex items-center w-full"
                onClick={(e) => e.stopPropagation()}
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
                  <X size={13} />
                  Cancel Order
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showCancel} onOpenChange={handleDialogClose}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel this order?</AlertDialogTitle>
            <AlertDialogDescription>
              Order <strong>{order.orderNumber || `#${order._id?.slice(-8).toUpperCase()}`}</strong> will be cancelled.
              This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
                setShowCancel(false);
              }}
            >
              Keep Order
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleConfirmCancel}
              disabled={isCancelling}
            >
              {isCancelling ? "Cancelling..." : "Cancel Order"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
