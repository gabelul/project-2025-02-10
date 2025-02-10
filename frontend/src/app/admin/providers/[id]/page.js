"use client"

import { ProviderDetail } from "@/components/providers/provider-detail"
import { useParams } from "next/navigation"

export default function ProviderPage() {
  const params = useParams()
  const id = params?.id

  if (!id) {
    return <div>Invalid provider ID</div>
  }

  return <ProviderDetail id={id} />
}