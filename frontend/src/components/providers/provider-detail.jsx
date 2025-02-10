"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { getProvider, updateProvider } from "@/lib/dashboard-service"
import { ConfigurationTab } from "./tabs/configuration-tab"
import { PerformanceTab } from "./tabs/performance-tab"
import { ModelsTab } from "./tabs/models-tab"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"

export function ProviderDetail({ id }) {
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [providerName, setProviderName] = useState("")
  const router = useRouter()
  const { toast } = useToast()

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

  useEffect(() => {
    async function loadProvider() {
      try {
        const data = await getProvider(id)
        form.reset(data)
        setProviderName(data.name)
      } catch (err) {
        setError(err.message)
        toast({
          title: "Error",
          description: err.message,
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
        setMounted(true)
      }
    }

    loadProvider()
  }, [id, form, toast])

  if (!mounted) return null

  // Create breadcrumb overrides with actual provider name
  const breadcrumbOverrides = {
    [id]: providerName || `Provider ${id}` // Use ID as fallback
  }

  if (error) {
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
          <AlertTitle>Error Loading Provider</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      </>
    )
  }

  return (
    <div className="space-y-6">
      <AdminBreadcrumb 
        items={[
          { label: "Providers", href: "/admin/providers" },
          { label: providerName || `Provider ${id}` }
        ]} 
        overrides={breadcrumbOverrides}
      />
      
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