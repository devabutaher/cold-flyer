import { Checkbox } from "@/components/ui/checkbox";
import { AvatarCell } from "../../table/table-cells";
import { BlogRowActions } from "./blog-row-actions";

const CATEGORY_COLORS = {
  Maintenance: "bg-blue-500/10 text-blue-600",
  "Buying Guide": "bg-purple-500/10 text-purple-600",
  "Smart Home": "bg-cyan-500/10 text-cyan-600",
  Tips: "bg-amber-500/10 text-amber-600",
  News: "bg-rose-500/10 text-rose-600",
};

export function buildBlogColumns({ onDelete } = {}) {
  return [
    {
      id: "select",
      size: 44,
      enableSorting: false,
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          onClick={(e) => e.stopPropagation()}
          aria-label="Select row"
        />
      ),
    },

    {
      header: "Title",
      accessorKey: "title",
      cell: ({ row }) => {
        const b = row.original;
        const src = b.image?.url ?? b.img;
        return (
          <div className="flex items-center gap-3 min-w-48">
            <AvatarCell src={src} name={b.title} sub={b.excerpt} avatarShape="rounded-full" />
          </div>
        );
      },
    },

    {
      header: "Category",
      accessorKey: "category",
      cell: ({ row }) => {
        const cat = row.getValue("category");
        const color = CATEGORY_COLORS[cat] || "bg-secondary text-foreground";
        return (
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${color}`}
          >
            {cat}
          </span>
        );
      },
      meta: { filterVariant: "select" },
    },

    {
      header: "Views",
      accessorKey: "views",
      cell: ({ row }) => (
        <span className="text-sm tabular-nums text-muted-foreground">{row.getValue("views") ?? 0}</span>
      ),
    },

    {
      header: "Date",
      accessorKey: "createdAt",
      cell: ({ row }) => {
        const date = row.getValue("createdAt");
        return (
          <span className="text-sm text-muted-foreground">{date ? new Date(date).toLocaleDateString() : "—"}</span>
        );
      },
    },

    {
      id: "actions",
      size: 52,
      enableSorting: false,
      header: "",
      cell: ({ row }) => <BlogRowActions row={row} onDelete={onDelete} />,
    },
  ];
}
