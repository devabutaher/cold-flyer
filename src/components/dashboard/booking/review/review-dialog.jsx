"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Star, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function ReviewDialog({ booking, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(booking.customerRating || 0);
  const [hover, setHover] = useState(0);
  const [review, setReview] = useState(booking.customerReview || "");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error("Please select a rating");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/services/bookings/${booking._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          customerRating: rating,
          customerReview: review,
        }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      toast.success("Review submitted! Thank you.");
      setOpen(false);
      onSuccess?.();
    } catch (err) {
      toast.error(err.message || "Failed to submit review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Star size={14} className="mr-2 text-yellow-500" />
          {booking.customerRating ? "Update Review" : "Write a Review"}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {booking.customerRating ? "Update Your Review" : "Rate Your Service"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            How was your experience with {booking.service?.name || "this service"}?
          </AlertDialogDescription>
        </AlertDialogHeader>

        <div className="space-y-4">
          <div>
            <Label>Rating</Label>
            <div className="flex gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="p-0.5 transition-colors"
                >
                  <Star
                    size={24}
                    className={cn(
                      "transition-colors",
                      (hover || rating) >= star
                        ? "fill-yellow-500 text-yellow-500"
                        : "text-muted-foreground/30"
                    )}
                  />
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label>Review (optional)</Label>
            <Textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="Tell us about your experience..."
              rows={4}
            />
          </div>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSubmit} disabled={submitting || rating === 0}>
            {submitting ? (
              <><Loader2 size={14} className="animate-spin mr-2" />Submitting...</>
            ) : (
              "Submit Review"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
