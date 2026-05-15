import { Skeleton } from "@/components/ui/skeleton";
import { TableCell, TableRow } from "@/components/ui/table";

export function TableSkeleton({ columns = 5, rows = 8 }) {
  return Array.from({ length: rows }).map((_, ri) => (
    <TableRow key={ri} className="border-b border-border/60 hover:bg-transparent">
      {Array.from({ length: columns }).map((_, ci) => (
        <TableCell key={ci} className="px-4 py-3">
          <Skeleton
            className="h-4 rounded-md"
            style={{
              width: ci === 0 ? "80%" : ci === columns - 1 ? "40%" : `${55 + ((ci * 13) % 35)}%`,
            }}
          />
        </TableCell>
      ))}
    </TableRow>
  ));
}
