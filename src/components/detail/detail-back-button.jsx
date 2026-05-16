"use client";

import { useTranslations } from "next-intl";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "../ui/button";

export function DetailBackButton({ href, label }) {
  const t = useTranslations("common");
  return (
    <Link href={href}>
      <Button variant="link" className="px-0 py-6">
        <ChevronLeft size={15} />
        {t("backTo", { label })}
      </Button>
    </Link>
  );
}

export default DetailBackButton;
