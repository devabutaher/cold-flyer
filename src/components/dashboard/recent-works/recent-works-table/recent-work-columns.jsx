"use client";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Eye, EyeOff, ImageOff } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export function buildRecentWorkColumns({ onDelete }) {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "image",
      header: "",
      cell: ({ row }) => {
        const image = row.original.image;
        if (image?.url) {
          return (
            <div className="relative h-10 w-14 rounded-md overflow-hidden border">
              <Image src={image.url} alt={row.original.title} fill sizes="56px" className="object-cover" />
            </div>
          );
        }
        return (
          <div className="flex h-10 w-14 items-center justify-center rounded-md border bg-muted">
            <ImageOff className="h-4 w-4 text-muted-foreground" />
          </div>
        );
      },
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/dashboard/recent-works/edit/${row.original._id}`}
          className="font-medium hover:text-primary transition-colors line-clamp-1"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <Badge variant="secondary" className="text-xs font-medium">
          {row.original.category}
        </Badge>
      ),
    },
    {
      accessorKey: "clientName",
      header: "Client",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.clientName || "—"}</span>,
    },
    {
      accessorKey: "featured",
      header: "Featured",
      cell: ({ row }) => {
        const featured = row.original.featured;
        return (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <span
                  className={cn(
                    "inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full",
                    featured ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
                  )}
                >
                  {featured ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                  {featured ? "Featured" : "Hidden"}
                </span>
              </TooltipTrigger>
              <TooltipContent>{featured ? "This work is featured on the home page" : "Not featured"}</TooltipContent>
            </Tooltip>
          </TooltipProvider>
        );
      },
    },
    {
      accessorKey: "views",
      header: "Views",
      cell: ({ row }) => <span className="text-sm text-muted-foreground">{row.original.views || 0}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "Created",
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {row.original.createdAt ? format(new Date(row.original.createdAt), "MMM d, yyyy") : "—"}
        </span>
      ),
    },
  ];
}
