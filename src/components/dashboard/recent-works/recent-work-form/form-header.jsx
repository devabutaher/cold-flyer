"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export function FormHeader({ title }) {
  return (
    <div className="flex items-center gap-4">
      <Link
        href="/dashboard/recent-works"
        className="inline-flex items-center justify-center rounded-lg border bg-background p-2 hover:bg-muted transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
      </Link>
      <div>
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground mt-0.5">Manage your portfolio of completed projects.</p>
      </div>
    </div>
  );
}
