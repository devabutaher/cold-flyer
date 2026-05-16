"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

const Error = () => {
  const t = useTranslations("errors");
  const router = useRouter();

  return (
    <div className="grid min-h-screen grid-cols-1 lg:grid-cols-2 bg-background text-foreground">
      <div className="flex flex-col items-center justify-center px-4 py-8 text-center">
        <h2 className="mb-6 text-5xl font-semibold">{t("notFoundTitle")}</h2>
        <h3 className="mb-1.5 text-3xl font-semibold">{t("notFoundDesc")}</h3>
        <p className="text-muted-foreground mb-6 max-w-sm">
          The page you're looking for isn't found, we suggest you to go back.
        </p>
        <Button size="lg" onClick={() => router.back()}>
          {t("goHome")}
        </Button>
      </div>
      <div className="relative max-h-screen w-full p-2 max-lg:hidden">
        <div className="h-full w-full rounded-2xl bg-primary/90"></div>
        <Image
          src="https://cdn.shadcnstudio.com/ss-assets/blocks/marketing/error/image-1.png"
          alt="404 illustration"
          fill
          loading="eager"
          className="object-contain"
        />
      </div>
    </div>
  );
};

export default Error;
