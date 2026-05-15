export function PriceRow({ label, value, highlight, muted, className = "" }) {
  return (
    <div className={`flex items-center justify-between text-sm ${className}`}>
      <span className={muted ? "text-muted-foreground" : ""}>{label}</span>
      <span className={highlight ? "font-bold text-base text-foreground" : ""}>{value}</span>
    </div>
  );
}
