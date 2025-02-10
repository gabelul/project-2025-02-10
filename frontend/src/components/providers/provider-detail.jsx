"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ConfigurationTab } from "./tabs/configuration-tab"
import { PerformanceTab } from "./tabs/performance-tab"
import { ModelsTab } from "./tabs/models-tab"

export function ProviderDetail({ id }) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()
  const { toast } = useToast()

  // Form setup with initial empty values
  const form = useForm({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      apiKey: "",
      baseUrl: "",
      environment: "development",
      // ... other default values
    }
  })

  // Load provider data
  useEffect(() => {
    async function loadProvider() {
      try {
        // Mock API call - replace with real API
        const response = await fetch(`/api/providers/${id}`)
        const data = await response.json()
        
        if (response.ok) {
          // Reset form with provider data
          form.reset(data)
        } else {
          setError(data.message || "Failed to load provider")
          toast({
            title: "Error",
            description: "Failed to load provider details",
            variant: "destructive",
          })
        }
      } catch (err) {
        setError(err.message)
        toast({
          title: "Error",
          description: "An error occurred while loading provider details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }

    loadProvider()
  }, [id, form, toast])

  // Don't render until mounted to prevent hydration issues
  if (!mounted) return null

  // Show error state
  if (error) {
    return (
      <div className="rounded-lg border border-destructive p-4">
        <h2 className="text-lg font-semibold text-destructive mb-2">Error Loading Provider</h2>
        <p className="text-muted-foreground">{error}</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="config" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="config">Configuration</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
        </TabsList>

        <TabsContent value="config">
          <ConfigurationTab form={form} />
        </TabsContent>

        <TabsContent value="performance">
          <PerformanceTab providerId={id} />
        </TabsContent>

        <TabsContent value="models">
          <ModelsTab providerId={id} form={form} />
        </TabsContent>
      </Tabs>
    </div>
  )
}