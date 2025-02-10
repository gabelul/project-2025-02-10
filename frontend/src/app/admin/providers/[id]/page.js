"use client"

import { useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { handleProviderError, ProviderError, ErrorTypes } from "@/lib/error-handler"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  ArrowLeft, 
  Settings2,
  Shield,
  Server,
  Activity,
  Clock,
  Boxes,
  AlertCircle,
  Save,
  Loader2
} from "lucide-react"

// Sample performance data
const performanceData = [
  { time: '00:00', responseTime: 150, errorRate: 0.5, cost: 12 },
  { time: '04:00', responseTime: 180, errorRate: 0.8, cost: 15 },
  { time: '08:00', responseTime: 220, errorRate: 1.2, cost: 18 },
  { time: '12:00', responseTime: 160, errorRate: 0.6, cost: 14 },
  { time: '16:00', responseTime: 140, errorRate: 0.4, cost: 11 },
  { time: '20:00', responseTime: 190, errorRate: 0.9, cost: 16 },
]

export default function ProviderDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formError, setFormError] = useState(null)

  // Initialize form with error handling
  const form = useForm({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "OpenAI",
      apiKey: "",
      baseUrl: "https://api.openai.com/v1",
      environment: "production",
      rateLimit: 1000,
      timeout: 30000,
      retryAttempts: 3,
      ipWhitelist: "",
      securitySettings: {
        enableRateLimiting: true,
        enableIPWhitelist: false,
        enableRequestLogging: true,
      }
    },
    mode: "onChange" // Enable real-time validation
  })

  // Handle form submission with error handling
  const onSubmit = async (data) => {
    setIsLoading(true)
    setFormError(null)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      toast({
        title: "Settings saved",
        description: "Provider configuration has been updated",
      })
    } catch (error) {
      const errorResult = handleProviderError(error, toast)
      if (errorResult) {
        setFormError(errorResult)
        form.setError('root', {
          type: error.type,
          message: error.message
        })
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6 p-8">
      {/* Form Error Summary */}
      {formError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            {formError.message}
            {formError.details && (
              <ul className="mt-2 list-disc pl-4">
                {Object.entries(formError.details).map(([key, value]) => (
                  <li key={key}>{value}</li>
                ))}
              </ul>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Header */}
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
        <Button onClick={form.handleSubmit(onSubmit)} disabled={isLoading}>
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

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Avg Response Time</p>
              <p className="text-2xl font-bold">150ms</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Error Rate</p>
              <p className="text-2xl font-bold">0.5%</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <Boxes className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Active Models</p>
              <p className="text-2xl font-bold">5</p>
            </div>
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Status</p>
              <p className="text-2xl font-bold text-green-500">Operational</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="configuration" className="space-y-6">
        <TabsList>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Configuration Tab */}
        <TabsContent value="configuration">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <Card className="p-6">
                <div className="space-y-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Basic Information</h3>
                    
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Provider Name</FormLabel>
                          <FormControl>
                            <Input 
                              {...field}
                              className={form.formState.errors.name && "border-red-500"}
                            />
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
                            <div className="relative">
                              <Input 
                                type="password" 
                                {...field}
                                className={form.formState.errors.apiKey && "border-red-500"}
                              />
                              {form.formState.errors.apiKey && (
                                <AlertCircle className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                              )}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="baseUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Base URL</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="environment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Environment</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select environment" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="production">Production</SelectItem>
                              <SelectItem value="staging">Staging</SelectItem>
                              <SelectItem value="development">Development</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </Card>

              {/* Form Actions */}
              <div className="flex justify-end gap-4">
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
                  disabled={isLoading || !form.formState.isValid}
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
        </TabsContent>

        {/* Performance Tab */}
        <TabsContent value="performance">
          <div className="grid gap-4">
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Response Time</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Error Rate</h3>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={performanceData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="errorRate" 
                      stroke="hsl(var(--destructive))" 
                      strokeWidth={2} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </Card>
          </div>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="space-y-1">
                    <h4 className="font-medium">Model {i + 1}</h4>
                    <p className="text-sm text-muted-foreground">gpt-4-turbo</p>
                  </div>
                  <Switch />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Response Time</span>
                    <span>120ms</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Error Rate</span>
                    <span>0.3%</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <Card className="p-6">
            <Form {...form}>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="securitySettings.enableRateLimiting"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Rate Limiting</FormLabel>
                        <FormDescription>
                          Enable request rate limiting
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="securitySettings.enableIPWhitelist"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">IP Whitelist</FormLabel>
                        <FormDescription>
                          Restrict access to specific IP addresses
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="ipWhitelist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Allowed IP Addresses</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Comma-separated IPs" 
                          {...field}
                          disabled={!form.watch("securitySettings.enableIPWhitelist")}
                        />
                      </FormControl>
                      <FormDescription>
                        Enter IP addresses separated by commas
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}