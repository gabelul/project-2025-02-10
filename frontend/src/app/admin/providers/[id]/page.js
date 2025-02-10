"use client"

import { Suspense } from "react"
import { useParams } from "next/navigation"
import { ProviderDetail } from "@/components/providers/provider-detail"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

function ProviderDetailSkeleton() {
  return (
    <div className="space-y-6">
      <AdminBreadcrumb 
        items={[
          { label: "Providers", href: "/admin/providers" },
          { label: "Loading..." }
        ]} 
      />
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

function ErrorDisplay({ message }) {
  return (
    <>
      <AdminBreadcrumb 
        items={[
          { label: "Providers", href: "/admin/providers" },
          { label: "Error" }
        ]} 
      />
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </>
  )
}

export default function ProviderPage() {
  const params = useParams()
  const id = params?.id

  if (!id) {
    return <ErrorDisplay message="Invalid provider ID" />
  }

  return (
    <div className="container mx-auto py-6">
      <Suspense fallback={<ProviderDetailSkeleton />}>
        <ProviderDetail id={id} />
      </Suspense>
    </div>
  )
}