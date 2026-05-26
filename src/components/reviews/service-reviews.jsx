"use client";

import { useQuery } from "@tanstack/react-query";
import { useTranslations, useLocale } from "next-intl";
import { Star, User as UserIcon, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn, formatDate } from "@/lib/utils";
import { getClient, extractList } from "@/lib/http-client";

async function fetcher(url) {
  const res = await getClient().get(url);
  return extractList(res, "reviews");
}

export function ServiceReviews({ serviceId }) {
  const t = useTranslations("common");
  const locale = useLocale();
  const { data: reviews = [], isLoading } = useQuery({
    queryKey: ["service-reviews", serviceId],
    queryFn: () => fetcher(`/reviews?service=${serviceId}`),
    enabled: !!serviceId,
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  if (!reviews.length) return null;

  const avgRating = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{t("customerReviews")}</CardTitle>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
            <span className="font-bold">{avgRating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">({reviews.length})</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {reviews.map((review) => (
          <div key={review._id} className="border-b border-border pb-4 last:border-0 last:pb-0">
            <div className="flex items-center gap-2 mb-1">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10">
                <UserIcon className="h-3.5 w-3.5 text-primary" />
              </div>
              <span className="text-sm font-medium">{review.user?.name || t("anonymous")}</span>
              <div className="flex gap-0.5 ml-auto">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={12}
                    className={cn(
                      star <= review.rating ? "fill-yellow-500 text-yellow-500" : "text-muted-foreground/20",
                    )}
                  />
                ))}
              </div>
            </div>
            {review.comment && <p className="text-sm text-muted-foreground pl-9">{review.comment}</p>}
            <p className="text-xxs text-muted-foreground pl-9 mt-1">
              {formatDate(review.createdAt, locale, {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
