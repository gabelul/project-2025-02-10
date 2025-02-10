"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { ConfigurationTab } from "./tabs/configuration-tab"
import { PerformanceTab } from "./tabs/performance-tab"
import { ModelsTab } from "./tabs/models-tab"

export function ProviderDetail({ id }) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [provider, setProvider] = useState(null)
  const router = useRouter()

  useEffect(() => {
    async function loadProvider() {
      try {
        const response = await fetch(`/api/providers/${id}`)
        if (!response.ok) throw new Error('Failed to load provider')
        const data = await response.json()
        setProvider(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }

    loadProvider()
  }, [id])

  if (!mounted) return null

  if (error) {
    return (
      <div className="space-y-6">
        <AdminBreadcrumb segments={["Providers", "Error"]} />
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  const breadcrumbSegments = [
    { label: "Providers", href: "/admin/providers" },
    provider?.name || `Provider ${id}`
  ]

  return (
    <div className="space-y-6">
      <AdminBreadcrumb segments={breadcrumbSegments} />
      
      <Tabs defaultValue="config" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <ConfigurationTab provider={provider} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTab providerId={id} />
        </TabsContent>

        <TabsContent value="models">
          <ModelsTab providerId={id} />
        </TabsContent>
      </Tabs>
    </div>
  )
}