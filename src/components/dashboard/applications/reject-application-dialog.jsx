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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

const rejectNotesSchema = z.object({
  notes: z.string().optional(),
});

export default function RejectApplicationDialog({ application, open, onOpenChange, onConfirm, loading }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { notes: "" },
    resolver: zodResolver(rejectNotesSchema),
    mode: "onTouched",
  });

  if (!application) return null;

  const onSubmit = (data) => {
    onConfirm(data.notes);
    reset();
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              This will reject the application from <strong>{application.name}</strong> for{" "}
              <strong>{application.position}</strong>. The applicant will be notified via email.
            </AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <Label htmlFor="reject-notes">Feedback (optional)</Label>
            <Controller
              name="notes"
              control={control}
              render={({ field, fieldState }) => (
                <Textarea
                  id="reject-notes"
                  placeholder="Provide feedback on why the application was not accepted..."
                  value={field.value ?? ""}
                  onChange={field.onChange}
                  rows={3}
                  aria-invalid={fieldState.invalid}
                />
              )}
            />
            {errors.notes && <p className="text-xs text-destructive">{errors.notes.message}</p>}
            <p className="text-xs text-muted-foreground">This note will be included in the rejection email.</p>
          </div>

          <AlertDialogFooter>
            <AlertDialogCancel type="button" disabled={loading}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction type="submit" disabled={loading}>
              {loading ? "Rejecting..." : "Reject"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}
