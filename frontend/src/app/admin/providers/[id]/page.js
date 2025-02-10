import { use } from "react"
import { ProviderDetail } from "@/components/providers/provider-detail"

export default function ProviderDetailPage({ params }) {
  const resolvedParams = use(params)
  return <ProviderDetail id={resolvedParams.id} />
}