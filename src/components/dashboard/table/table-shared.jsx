import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export function TagBadge({ tag }) {
  if (!tag) return <span className="text-muted-foreground text-xs">—</span>;
  const styles =
    {
      "Best Seller": "bg-primary/10 text-primary",
      New: "bg-blue-500/10 text-blue-600",
      Sale: "bg-destructive/10 text-destructive",
    }[tag] ?? "bg-secondary text-foreground";
  return (
    <Badge className={cn("border-none text-[10px] font-bold", styles)}>
      {tag}
    </Badge>
  );
}
