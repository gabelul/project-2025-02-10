"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProviderDetail } from "@/components/providers/provider-detail"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton component
function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-4 w-[100px]" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <Skeleton className="h-4 w-[100px] mb-2" />
              <Skeleton className="h-8 w-[120px]" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

export default function ProviderPage() {
  const params = useParams()

  if (!params?.id) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb segments={["Providers", "Error"]} />
        <Card>
          <CardContent className="p-6">
            Invalid provider ID
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="container space-y-6">
      <Suspense fallback={<LoadingSkeleton />}>
        <ProviderDetail id={params.id} />
      </Suspense>
    </div>
  )
}