"use client"

import { ProviderDetail } from "@/components/providers/provider-detail"

export default function ProviderPage({ params }) {
  return (
    <div className="container mx-auto py-6">
      <ProviderDetail id={params.id} />
    </div>
  )
}