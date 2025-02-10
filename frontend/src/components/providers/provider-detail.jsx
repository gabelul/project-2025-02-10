"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { Form } from "@/components/ui/form"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { ConfigurationTab } from "./tabs/configuration-tab"
import { PerformanceTab } from "./tabs/performance-tab"
import { ModelsTab } from "./tabs/models-tab"
import { Skeleton } from "@/components/ui/skeleton"

export function ProviderDetail({ id }) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "",
      description: "",
      apiKey: "",
      baseUrl: "https://api.provider.com/v1",
      environment: "development",
      timeout: 30000,
      retryAttempts: 3,
      rateLimit: {
        enabled: true,
        requestsPerMinute: 1000,
        burstLimit: 10
      },
      security: {
        enableIPWhitelist: false,
        ipWhitelist: "",
        enableRequestLogging: true,
        enableRateLimiting: true
      }
    }
  })

  useEffect(() => {
    async function loadProvider() {
      try {
        const response = await fetch(`/api/providers/${id}`)
        if (!response.ok) throw new Error('Failed to load provider')
        const data = await response.json()
        form.reset(data)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load provider details",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }

    loadProvider()
  }, [id, form, toast])

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`/api/providers/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })

      if (!response.ok) throw new Error('Failed to update provider')

      toast({
        title: "Success",
        description: "Provider updated successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider",
        variant: "destructive",
      })
    }
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <AdminBreadcrumb 
        segments={[
          { label: "Providers", href: "/admin/providers" },
          form.getValues("name") || `Provider ${id}`
        ]} 
      />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <Tabs defaultValue="config">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="config">Configuration</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="models">Models</TabsTrigger>
            </TabsList>

            <TabsContent value="config">
              <ConfigurationTab isLoading={isLoading} />
            </TabsContent>

            <TabsContent value="performance">
              <PerformanceTab providerId={id} />
            </TabsContent>

            <TabsContent value="models">
              <ModelsTab providerId={id} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end">
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}