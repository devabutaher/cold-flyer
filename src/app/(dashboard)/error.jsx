"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

export default function DashboardError({ error, unstable_retry }) {
  const t = useTranslations("errors");

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 py-8 text-center">
      <h2 className="mb-4 text-3xl font-semibold">{t("dashboardError") || "Dashboard error"}</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        {error?.message || t("unexpectedError") || "An unexpected error occurred in the dashboard"}
      </p>
      <div className="flex gap-4 items-center">
        <Button size="lg" onClick={() => unstable_retry()}>
          {t("tryAgain") || "Try again"}
        </Button>
      </div>
    </div>
  );
}
