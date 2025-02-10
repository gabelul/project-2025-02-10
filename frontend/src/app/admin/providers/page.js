"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Plus, Settings2, Key, AlertCircle, DollarSign, Zap, Clock, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

// Validation schema
const providerSchema = z.object({
  name: z.string().min(2, "Provider name must be at least 2 characters"),
  type: z.enum(["openai", "anthropic", "custom"], {
    required_error: "Please select a provider type",
  }),
  endpoint: z.string().url("Please enter a valid URL"),
  apiKey: z.string().min(20, "API key seems too short").max(100, "API key seems too long"),
})

// Sample usage data - in production this would come from your API
const usageData = [
  { day: '01', requests: 2400, costs: 12 },
  { day: '02', requests: 1398, costs: 8 },
  { day: '03', requests: 9800, costs: 35 },
  { day: '04', requests: 3908, costs: 15 },
  { day: '05', requests: 4800, costs: 18 },
  { day: '06', requests: 3800, costs: 14 },
  { day: '07', requests: 4300, costs: 16 },
]

function UsageMetrics({ provider }) {
  return (
    <div className="space-y-4">
      {/* Rate Limit Status */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Rate Limit Usage</span>
          <span className="text-sm text-gray-500">2,450 / 3,000 requests</span>
        </div>
        <Progress value={82} className="h-2" />
        <div className="flex justify-between text-xs text-gray-500">
          <span>Resets in 2h 15m</span>
          <span className="text-amber-500 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3" />
            Approaching limit
          </span>
        </div>
      </div>

      {/* Cost Metrics */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-sm font-medium">Monthly Cost</p>
              <p className="text-2xl font-bold">$234.50</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-sm font-medium">Avg Response</p>
              <p className="text-2xl font-bold">245ms</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Graph */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">7-Day Usage Trends</h4>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={usageData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="requests" 
                stroke="#2563eb" 
                name="Requests"
              />
              <Line 
                yAxisId="right"
                type="monotone" 
                dataKey="costs" 
                stroke="#16a34a" 
                name="Costs ($)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Model Cost Breakdown */}
      <Card className="p-4">
        <h4 className="text-sm font-medium mb-4">Cost by Model</h4>
        <div className="space-y-2">
          {provider.models.map((model, index) => (
            <div key={index} className="flex justify-between items-center">
              <span className="text-sm">{model}</span>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">${(Math.random() * 100).toFixed(2)}</span>
                <span className="text-xs text-gray-500">
                  ({Math.floor(Math.random() * 1000)} calls)
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}

export default function ProvidersPage() {
  const { toast } = useToast()
  const [providers, setProviders] = useState([
    {
      id: 1,
      name: "OpenAI",
      type: "openai",
      endpoint: "https://api.openai.com/v1",
      isActive: true,
      models: ["gpt-4", "gpt-3.5-turbo"]
    },
    {
      id: 2,
      name: "Anthropic",
      type: "anthropic",
      endpoint: "https://api.anthropic.com/v1",
      isActive: false,
      models: ["claude-2", "claude-instant"]
    }
  ])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isTestingConnection, setIsTestingConnection] = useState(false)

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      name: "",
      type: "",
      endpoint: "",
      apiKey: "",
    },
  })

  const onSubmit = async (data) => {
    setIsTestingConnection(true)
    
    try {
      // Simulate API connection test
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // If connection test passes
      toast({
        title: "Provider Configured Successfully",
        description: "Connection test passed and provider has been added.",
      })
      setIsDialogOpen(false)
      form.reset()
    } catch (error) {
      toast({
        title: "Configuration Failed",
        description: "Could not establish connection with the provider.",
        variant: "destructive",
      })
    } finally {
      setIsTestingConnection(false)
    }
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">AI Providers</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Provider
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Configure AI Provider</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Name</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., OpenAI, Anthropic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Provider Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select provider type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="openai">OpenAI Compatible</SelectItem>
                          <SelectItem value="anthropic">Anthropic Compatible</SelectItem>
                          <SelectItem value="custom">Custom Provider</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endpoint"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Endpoint</FormLabel>
                      <FormControl>
                        <Input placeholder="https://api.example.com/v1" {...field} />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {form.formState.errors?.root && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      {form.formState.errors.root.message}
                    </AlertDescription>
                  </Alert>
                )}

                <div className="flex justify-end space-x-2">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button 
                    type="submit"
                    disabled={isTestingConnection}
                  >
                    {isTestingConnection ? "Testing Connection..." : "Save Provider"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {providers.map((provider) => (
          <Card key={provider.id} className="p-6">
            {/* Provider Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-lg font-semibold">{provider.name}</h3>
                <p className="text-sm text-gray-500">{provider.endpoint}</p>
              </div>
              <Badge variant={provider.isActive ? "default" : "secondary"}>
                {provider.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>

            {/* Usage Metrics */}
            <UsageMetrics provider={provider} />

            {/* Existing Provider Controls */}
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <Switch 
                  checked={provider.isActive}
                  onCheckedChange={(checked) => {
                    // Handle provider status toggle
                    toast({
                      title: checked ? "Provider Activated" : "Provider Deactivated",
                      description: `${provider.name} has been ${checked ? "activated" : "deactivated"}.`,
                    })
                  }}
                />
              </div>
              <Button variant="outline" className="w-full">
                Configure Models
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}