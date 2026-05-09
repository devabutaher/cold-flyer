import { Skeleton } from "../ui/skeleton";

export function DetailSkeleton() {
  return (
    <div className="bg-background min-h-screen py-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-16">
        <div className="relative">
          <Skeleton className="aspect-square w-full max-w-lg mx-auto rounded-lg" />
        </div>

        <div className="flex flex-col space-y-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-20" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-5 w-2/3" />
          </div>

          <Skeleton className="h-10 w-40" />

          <Skeleton className="h-5 w-32" />

          <div className="flex gap-6">
            <Skeleton className="h-12 w-32" />
            <Skeleton className="h-12 w-32" />
          </div>

          <div className="flex gap-3">
            <Skeleton className="h-12 flex-1" />
            <Skeleton className="h-12 flex-1" />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
            <Skeleton className="h-20" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailSkeleton;
