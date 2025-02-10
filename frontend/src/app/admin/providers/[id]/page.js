"use client"

import { ProviderDetail } from "@/components/providers/provider-detail"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useParams } from "next/navigation"

export default function ProviderPage() {
  const params = useParams()
  const id = params?.id

  if (!id) {
    return (
      <Card>
        <CardContent>Invalid provider ID</CardContent>
      </Card>
    )
  }

  return <ProviderDetail id={id} />
}