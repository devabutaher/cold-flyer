"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

export default function ErrorPage({ error, unstable_retry }) {
  const t = useTranslations("errors");

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background text-foreground container mx-auto">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">{t("somethingWentWrong") || "Something went wrong!"}</h2>
        <h3 className="text-muted-foreground mb-6 max-w-sm">
          {error?.message || t("unexpectedError") || "An unexpected error occurred"}
        </h3>
        <div className="flex gap-4 items-center">
          <Button size="lg" onClick={() => unstable_retry()}>
            {t("tryAgain") || "Try again"}
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href={"/"}>{t("goHome") || "Go home"}</Link>
          </Button>
        </div>
      </div>
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-primary/90"></div>
        <Image
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="Error illustration"
          fill
          loading="eager"
          quality={90}
          unoptimized
          className="object-contain contrast-105 brightness-105 saturate-110"
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>
    </div>
  );
}
