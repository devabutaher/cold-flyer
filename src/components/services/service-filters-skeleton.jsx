export default function ServiceFiltersSkeleton() {
  return (
    <div className="py-3 flex items-center gap-3 overflow-x-auto min-w-0">
      <div className="flex items-center gap-2 text-muted-foreground mr-1 shrink-0">
        <span className="text-[10px] font-black uppercase tracking-widest">
          Filters:
        </span>
      </div>
      <div className="h-8 w-28 bg-muted animate-pulse rounded" />
      <div className="h-8 w-28 bg-muted animate-pulse rounded" />
      <div className="h-8 w-28 bg-muted animate-pulse rounded" />
    </div>
  );
}