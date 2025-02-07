import { Skeleton } from "../ui/skeleton";

export default function PageIntroSkeleton() {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton className="w-1/2 h-5 rounded-full" />
      <div className="flex flex-col gap-2">
        <Skeleton className="w-1/3 h-2 rounded-full" />
        <Skeleton className="w-1/2 h-2 rounded-full" />
        <Skeleton className="w-3/4 h-2 rounded-full" />
        <Skeleton className="w-full h-2 rounded-full" />
        <Skeleton className="w-full h-2 rounded-full" />
        <Skeleton className="w-3/4 h-2 rounded-full" />
        <Skeleton className="w-1/2 h-2 rounded-full" />
        <Skeleton className="w-1/3 h-2 rounded-full" />
      </div>
    </div>
  );
}
