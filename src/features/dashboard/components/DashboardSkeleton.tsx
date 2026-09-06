import React from "react";
import { Skeleton } from "@/components/ui/Skeleton";
import { Card } from "@/components/ui/Card";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header Skeleton */}
      <div className="flex justify-between items-center border-b border-[var(--border)] pb-6">
        <div className="space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-9 w-28" />
      </div>

      {/* Studio Launcher Skeleton */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i} variant="subtle" className="p-4 h-24 flex flex-col justify-between">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-4 w-20" />
          </Card>
        ))}
      </div>

      {/* Two Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card variant="subtle" className="p-6 h-64 space-y-4">
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </Card>
          <Card variant="subtle" className="p-6 h-64 space-y-4">
            <Skeleton className="h-5 w-40" />
            <div className="grid grid-cols-3 gap-3">
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          </Card>
        </div>

        <div className="space-y-6">
          <Card variant="subtle" className="p-6 h-56 space-y-3">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </Card>
          <Card variant="subtle" className="p-6 h-40 space-y-3">
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
          </Card>
        </div>
      </div>
    </div>
  );
}
