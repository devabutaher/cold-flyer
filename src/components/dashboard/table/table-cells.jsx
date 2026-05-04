import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

/* ── Avatar + two-line label ──────────────────────────── */
export function AvatarCell({ src, name, sub, avatarShape = "rounded-md" }) {
  const initials = name?.slice(0, 2).toUpperCase() ?? "??";
  return (
    <div className="flex items-center gap-3 min-w-0">
      <Avatar className={cn("h-9 w-9 shrink-0", avatarShape)}>
        <AvatarImage src={src} alt={name} />
        <AvatarFallback
          className={cn("text-xs font-medium bg-muted", avatarShape)}
        >
          {initials}
        </AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="text-sm font-medium text-foreground truncate leading-tight">
          {name}
        </p>
        {sub && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{sub}</p>
        )}
      </div>
    </div>
  );
}

/* ── Price with optional strikethrough ───────────────── */
export function PriceCell({ price, originalPrice, currency = "৳" }) {
  const hasDiscount = originalPrice && originalPrice > price;
  return (
    <div>
      <p className="text-sm font-semibold text-foreground">
        {currency}
        {price?.toLocaleString()}
      </p>
      {hasDiscount && (
        <p className="text-xs text-muted-foreground line-through">
          {currency}
          {originalPrice.toLocaleString()}
        </p>
      )}
    </div>
  );
}

/* ── Stock level with colour coding ──────────────────── */
export function StockCell({ stock }) {
  const isOut = stock === 0;
  const isLow = !isOut && stock <= 10;
  return (
    <div className="flex items-center gap-1.5">
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full shrink-0",
          isOut ? "bg-destructive" : isLow ? "bg-amber-500" : "bg-green-500",
        )}
      />
      <span
        className={cn(
          "text-sm font-medium tabular-nums",
          isOut
            ? "text-destructive"
            : isLow
              ? "text-amber-600"
              : "text-foreground",
        )}
      >
        {isOut ? "Out" : stock}
      </span>
    </div>
  );
}

/* ── Star rating ─────────────────────────────────────── */
export function RatingCell({ rating }) {
  const r = Number(rating ?? 0);
  return (
    <div className="flex items-center gap-1">
      <span className="text-primary text-sm leading-none">★</span>
      <span className="text-sm font-medium tabular-nums">{r.toFixed(1)}</span>
    </div>
  );
}

/* ── Generic coloured badge ──────────────────────────── */
export function StatusBadge({ value, map = {} }) {
  const cfg = map[value] ?? {
    label: value,
    className: "bg-secondary text-foreground",
  };
  if (!value) return <span className="text-muted-foreground text-xs">—</span>;
  return (
    <Badge
      className={cn(
        "border-none text-[10px] font-semibold tracking-wide",
        cfg.className,
      )}
    >
      {cfg.label ?? value}
    </Badge>
  );
}

/* ── Mono label (SKU, ID, etc.) ──────────────────────── */
export function MonoCell({ value, fallback = "—" }) {
  if (!value)
    return <span className="text-muted-foreground text-xs">{fallback}</span>;
  return (
    <span className="text-xs text-muted-foreground font-mono">{value}</span>
  );
}
