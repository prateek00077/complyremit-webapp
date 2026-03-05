import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-16 w-full max-w-xl mx-auto" />
      <Skeleton className="h-10 w-64" />
      <div className="space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-3/4" />
      </div>
      <Skeleton className="h-48 w-full" />
    </div>
  );
}
