"use client";

/**
 * Table — lightweight Framer Motion animations.
 *
 * What's animated:
 *  - TableRow: staggered fade+slide entrance via `whileInView`
 *  - TableRow: subtle y-lift on hover (body rows only)
 *  - TableCell: no animation (keeps text readable during scroll)
 *
 * New props on TableRow:
 *  - index?   number   Row index for stagger delay (default 0)
 *  - animate? boolean  Opt out per-row (default true)
 *
 * Everything else — API, classNames — is unchanged.
 */

import * as React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

// ── Table container ──────────────────────────────────────────
function Table({ className, ...props }) {
  return (
    <div
      data-slot="table-container"
      className="relative w-full overflow-x-auto"
    >
      <table
        data-slot="table"
        className={cn("w-full caption-bottom text-sm", className)}
        {...props}
      />
    </div>
  );
}

// ── Header ───────────────────────────────────────────────────
function TableHeader({ className, ...props }) {
  return (
    <thead
      data-slot="table-header"
      className={cn("[&_tr]:border-b", className)}
      {...props}
    />
  );
}

// ── Body ─────────────────────────────────────────────────────
function TableBody({ className, ...props }) {
  return (
    <tbody
      data-slot="table-body"
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  );
}

// ── Footer ───────────────────────────────────────────────────
function TableFooter({ className, ...props }) {
  return (
    <tfoot
      data-slot="table-footer"
      className={cn(
        "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  );
}

// ── Row — stagger entrance + hover lift ──────────────────────
// `motion.tr` is valid — Framer Motion supports any HTML element.
function TableRow({ className, index = 0, animate = true, ...props }) {
  const reduced = useReducedMotion();

  if (!animate || reduced) {
    return (
      <tr
        data-slot="table-row"
        className={cn(
          "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
          className,
        )}
        {...props}
      />
    );
  }

  return (
    <motion.tr
      data-slot="table-row"
      className={cn(
        "border-b transition-colors hover:bg-muted/50 has-aria-expanded:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      // ── Entrance: staggered fade + slide up ──────────────
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -24px 0px" }}
      transition={{
        duration: 0.25,
        delay: Math.min(index * 0.04, 0.3), // cap at 0.3s so long tables don't drag
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      // ── Hover: 1px lift, no scale (keeps table alignment intact) ──
      whileHover={{ y: -1, transition: { duration: 0.15, ease: "easeOut" } }}
      whileTap={{ y: 0, transition: { duration: 0.1 } }}
      {...props}
    />
  );
}

// ── Head cell ────────────────────────────────────────────────
function TableHead({ className, ...props }) {
  return (
    <th
      data-slot="table-head"
      className={cn(
        "h-10 px-2 text-left align-middle font-medium whitespace-nowrap text-foreground [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

// ── Body cell ────────────────────────────────────────────────
function TableCell({ className, ...props }) {
  return (
    <td
      data-slot="table-cell"
      className={cn(
        "p-2 align-middle whitespace-nowrap [&:has([role=checkbox])]:pr-0",
        className,
      )}
      {...props}
    />
  );
}

// ── Caption ──────────────────────────────────────────────────
function TableCaption({ className, ...props }) {
  return (
    <caption
      data-slot="table-caption"
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

export {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
};
