"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Save, Loader2 } from "lucide-react"

export function ProviderDetail({ id }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Ensure component is mounted before rendering form
  useEffect(() => {
    setMounted(true)
  }, [])

  const form = useForm({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      baseUrl: "https://api.provider.com/v1",
      environment: "production",
      settings: {
        rateLimit: 1000,
        timeout: 30000,
        retryAttempts: 3,
      },
      security: {
        enableRateLimiting: false,
        enableIPWhitelist: false,
        ipWhitelist: "",
        enableRequestLogging: true,
      }
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Success",
        description: "Provider configuration saved successfully",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Don't render until mounted to prevent hydration mismatch
  if (!mounted) {
    return null
  }

  return (
    <div className="space-y-6 p-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold">Provider Configuration</h1>
          </div>
          <p className="text-muted-foreground">
            Configure and monitor provider settings
          </p>
        </div>
      </div>

      <div className="space-y-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Tabs defaultValue="general" className="space-y-6">
              <TabsList>
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="security">Security</TabsTrigger>
              </TabsList>

              <TabsContent value="general">
                <Card className="p-6">
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="apiKey"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>API Key</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormDescription>
                            Your provider API key for authentication
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* ... other general fields ... */}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="security">
                <Card className="p-6">
                  <div className="space-y-4">
                    {/* ... security fields ... */}
                  </div>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="mt-6 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  )
}