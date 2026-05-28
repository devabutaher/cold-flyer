"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const Error = () => {
  const t = useTranslations("errors");
  const router = useRouter();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background text-foreground container mx-auto">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">{t("notFoundTitle")}</h2>
        <h3 className="text-muted-foreground mb-6 max-w-sm">{t("notFoundDesc")}</h3>
        <div className="flex gap-4 items-center">
          <Button size="lg" asChild>
            <Link href={"/"}>{t("goHome")}</Link>
          </Button>
          <Button size="lg" onClick={() => router.back()} variant="outline">
            {t("goBack")}
          </Button>
        </div>
      </div>
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-primary/90"></div>
        <Image
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="404 illustration"
          fill
          loading="eager"
          quality={85}
          unoptimized
          className="object-contain contrast-105 brightness-105 saturate-110"
          sizes="(max-width: 768px) 100vw, 200px"
        />
      </div>
    </div>
  );
};

export default Error;
