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
import { CheckCircle2, ChevronDown, Eye, MoreHorizontal, Trash2, XCircle } from "lucide-react";
import { useState } from "react";

export function ApplicationRowActions({ application, onView, onApprove, onReject, onDelete }) {
  const [showDelete, setShowDelete] = useState(false);

  const isPending = application.status === "pending";

  const handleDialogClose = (open) => {
    if (!open) setShowDelete(false);
  };

  const handleConfirmDelete = async (e) => {
    e.stopPropagation();
    await onDelete?.(application._id);
    setShowDelete(false);
  };

  return (
    <>
      <div className="flex items-center justify-end gap-2" onClick={(e) => e.stopPropagation()}>
        {isPending && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-7 px-3 text-xs gap-1">
                Actions
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-auto min-w-40">
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onApprove?.(application);
                }}
              >
                <CheckCircle2 size={14} className="mr-2 text-green-600" />
                Approve
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  onReject?.(application);
                }}
              >
                <XCircle size={14} className="mr-2 text-destructive" />
                Reject with Feedback
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
              <span className="sr-only">Application actions</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem
              onClick={(e) => {
                e.stopPropagation();
                onView?.(application);
              }}
            >
              <Eye size={13} className="mr-2" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(true);
              }}
            >
              <Trash2 size={13} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <AlertDialog open={showDelete} onOpenChange={handleDialogClose}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this application?</AlertDialogTitle>
            <AlertDialogDescription>
              Application from <strong>{application.name}</strong> for <strong>{application.position}</strong> will be
              permanently deleted.
              {application.status === "approved" && (
                <span className="block mt-2 text-destructive">
                  This application is already approved. Remove the technician profile first.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={(e) => {
                e.stopPropagation();
                setShowDelete(false);
              }}
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
              onClick={handleConfirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
