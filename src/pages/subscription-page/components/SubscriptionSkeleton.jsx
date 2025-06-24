import { Skeleton } from "../../../shared/ui/skeleton/Skeleton";

export const SubscriptionSkeleton = () => {
  return (
    <div className="flex h-full flex-col items-center gap-2 py-10 text-white">
      <div className="w-full max-w-7xl space-y-3 rounded-2xl bg-dark-coal p-3">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-48" />
          <div className="flex gap-3">
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Usage Details Skeleton */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-dark-graphite p-5">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
            <Skeleton className="h-10 w-full" />
          </div>

          {/* Basic Plan Features Skeleton */}
          <div className="space-y-4 rounded-lg bg-dark-graphite p-5">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-3">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Skeleton className="size-5 rounded-full" />
                  <Skeleton className="h-4 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Billing & Payment Skeleton */}
          <div className="flex flex-col justify-between space-y-4 rounded-lg bg-dark-graphite p-5">
            <Skeleton className="h-6 w-32" />
            <div className="space-y-1">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>

      <div className="w-full max-w-7xl flex-1 space-y-2">
        {/* Billing Toggle Skeleton */}
        <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-2xl bg-dark-coal p-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>

        {/* Plan Options Skeleton */}
        <div className="grid flex-1 grid-cols-1 gap-2 md:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="space-y-5 rounded-2xl bg-dark-coal px-7 py-5">
              <div className="space-y-2">
                <Skeleton className="h-6 w-24" />
                <div className="space-y-2">
                  <Skeleton className="h-8 w-32" />
                  <Skeleton className="h-4 w-40" />
                </div>
              </div>
              <div className="space-y-2">
                <Skeleton className="h-10 w-full" />
                <div className="flex items-center justify-center">
                  <Skeleton className="h-4 w-20" />
                </div>
                <div className="space-y-2">
                  {[...Array(5)].map((_, featureIndex) => (
                    <div key={featureIndex} className="flex items-center gap-2">
                      <Skeleton className="size-5 rounded-full" />
                      <Skeleton className="h-4 w-40" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 