"use client";

import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from "lucide-react";

function Pagination({ className, ...props }) {
  const t = useTranslations("common");
  return (
    <nav
      role="navigation"
      aria-label={t("pagination")}
      data-slot="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
      {...props}
    />
  );
}

function PaginationContent({ className, ...props }) {
  return <ul data-slot="pagination-content" className={cn("flex items-center gap-1", className)} {...props} />;
}

function PaginationItem({ ...props }) {
  return <li data-slot="pagination-item" {...props} />;
}

function PaginationLink({ className, isActive, size = "icon", ...props }) {
  return (
    <Button asChild variant={isActive ? "outline" : "ghost"} size={size} className={cn(className)}>
      <a aria-current={isActive ? "page" : undefined} data-slot="pagination-link" data-active={isActive} {...props} />
    </Button>
  );
}

function PaginationPrevious({ className, text, ...props }) {
  const t = useTranslations("common");
  return (
    <PaginationLink aria-label={t("goToPreviousPage")} size="default" className={cn("pl-2!", className)} {...props}>
      <ChevronLeftIcon data-icon="inline-start" />
      <span className="hidden sm:block">{text || t("previous")}</span>
    </PaginationLink>
  );
}

function PaginationNext({ className, text, ...props }) {
  const t = useTranslations("common");
  return (
    <PaginationLink aria-label={t("goToNextPage")} size="default" className={cn("pr-2!", className)} {...props}>
      <span className="hidden sm:block">{text || t("next")}</span>
      <ChevronRightIcon data-icon="inline-end" />
    </PaginationLink>
  );
}

function PaginationEllipsis({ className, ...props }) {
  const t = useTranslations("common");
  return (
    <span
      aria-hidden
      data-slot="pagination-ellipsis"
      className={cn("flex size-9 items-center justify-center [&_svg:not([class*='size-'])]:size-4", className)}
      {...props}
    >
      <MoreHorizontalIcon />
      <span className="sr-only">{t("morePages")}</span>
    </span>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
};
