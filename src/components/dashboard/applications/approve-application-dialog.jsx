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

export default function ApproveApplicationDialog({ application, open, onOpenChange, onConfirm, loading }) {
  if (!application) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Approve Application</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span className="block">
              This will approve <strong>{application.name}</strong> for the position of{" "}
              <strong>{application.position}</strong>.
            </span>
            <span className="block text-sm text-muted-foreground">
              A worker profile will be created and the applicant will be notified via email. If the user does not
              exist, a new account will be created.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={loading}>
            {loading ? "Approving..." : "Approve"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
