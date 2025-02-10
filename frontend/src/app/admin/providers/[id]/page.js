"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  ArrowLeft, 
  Server, 
  Settings, 
  Activity,
  Clock,
  Shield,
  Boxes,
  AlertCircle,
  DollarSign
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
  const [isEnabled, setIsEnabled] = useState(true)

  const handleStatusChange = (checked) => {
    setIsEnabled(checked)
    toast({
      title: checked ? "Provider Enabled" : "Provider Disabled",
      description: `Provider has been ${checked ? "enabled" : "disabled"}`,
    })
  }

  return (
    <div className="space-y-6 p-8">
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
            <h1 className="text-2xl font-bold">OpenAI Provider</h1>
          </div>
          <p className="text-muted-foreground">
            Configure and monitor provider settings
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Switch
              checked={isEnabled}
              onCheckedChange={handleStatusChange}
            />
            <span className="text-sm text-muted-foreground">
              {isEnabled ? "Enabled" : "Disabled"}
            </span>
          </div>
          <Badge className={isEnabled ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}>
            {isEnabled ? "Operational" : "Disabled"}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="configuration">Configuration</TabsTrigger>
          <TabsTrigger value="models">Models</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
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
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Daily Cost</p>
                  <p className="text-2xl font-bold">$124.50</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Performance Charts */}
          <div className="grid gap-4 md:grid-cols-2">
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

        {/* Configuration Tab */}
        <TabsContent value="configuration" className="space-y-6">
          <Card className="p-6">
            <Form>
              <div className="space-y-4">
                <FormField
                  name="apiKey"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>API Key</FormLabel>
                      <FormControl>
                        <Input type="password" placeholder="••••••••" />
                      </FormControl>
                      <FormDescription>
                        Your provider API key for authentication
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  name="baseUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Base URL</FormLabel>
                      <FormControl>
                        <Input placeholder="https://api.provider.com/v1" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  name="environment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Environment</FormLabel>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Select environment" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Production</SelectItem>
                          <SelectItem value="staging">Staging</SelectItem>
                          <SelectItem value="development">Development</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
                <Button>Save Changes</Button>
              </div>
            </Form>
          </Card>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Model Cards */}
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
        <TabsContent value="security" className="space-y-6">
          <Card className="p-6">
            <Form>
              <div className="space-y-4">
                <FormField
                  name="rateLimit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Rate Limit</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="1000" />
                      </FormControl>
                      <FormDescription>
                        Maximum requests per minute
                      </FormDescription>
                    </FormItem>
                  )}
                />
                <FormField
                  name="ipWhitelist"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>IP Whitelist</FormLabel>
                      <FormControl>
                        <Input placeholder="Comma-separated IPs" />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button>Update Security Settings</Button>
              </div>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}