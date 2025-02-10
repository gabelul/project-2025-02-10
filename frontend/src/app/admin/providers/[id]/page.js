"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProviderDetail } from "@/components/providers/provider-detail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

// Loading skeleton for the provider detail
function ProviderDetailSkeleton() {
  return (
    <div className="space-y-6">
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
      <Card>
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export default function ProviderPage() {
  const params = useParams()
  const id = params?.id

  if (!id) {
    return <div>Invalid provider ID</div>
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<ProviderDetailSkeleton />}>
        <ProviderDetail id={id} />
      </Suspense>
    </div>
  )
}