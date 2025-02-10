"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProviderDetail } from "@/components/providers/provider-detail"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

function ProviderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <Skeleton className="h-8 w-[200px]" />
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
  const id = params?.id

  if (!id) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb 
          items={[
            { label: "Providers", href: "/admin/providers" },
            { label: "Error" }
          ]} 
        />
        <Card>
          <CardContent className="p-6">
            Invalid provider ID
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Suspense fallback={<ProviderDetailSkeleton />}>
      <ProviderDetail id={id} />
    </Suspense>
  )
}