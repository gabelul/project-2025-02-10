"use client"

import { useState, useCallback } from 'react'
import { useWebSocket } from '@/hooks/use-websocket'
import { getWebSocketUrl, transformDashboardData, fetchDashboardData } from '@/lib/dashboard-service'
import { useRealTime } from "@/hooks/use-real-time"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Activity, 
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CircleDollarSign,
  Shield,
  Clock,
  RefreshCcw
} from "lucide-react"

function MetricCard({ title, value, icon: Icon, trend, loading }) {
  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <Skeleton className="h-8 w-24" />
          </div>
          <Skeleton className="h-12 w-12 rounded-full" />
        </div>
        <Skeleton className="mt-4 h-4 w-28" />
      </Card>
    )
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
          <Icon className="h-6 w-6 text-primary" />
        </div>
      </div>
      {trend && (
        <div className={`mt-4 flex items-center text-sm ${trend.up ? 'text-green-600' : 'text-red-600'}`}>
          {trend.up ? <ArrowUp className="mr-1 h-4 w-4" /> : <ArrowDown className="mr-1 h-4 w-4" />}
          {trend.value}% from last month
        </div>
      )}
    </Card>
  )
}

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState({
    stats: null,
    performance: null,
    providers: null
  })

  const handleWebSocketMessage = useCallback((message) => {
    const transformed = transformDashboardData(message)
    if (transformed) {
      setDashboardData(prev => ({
        ...prev,
        [transformed.type]: transformed.data
      }))
    }
  }, [])

  const {
    isConnected,
    connectionStatus
  } = useWebSocket(getWebSocketUrl(), {
    onMessage: handleWebSocketMessage
  })

  // Fallback polling when WebSocket fails
  const {
    data: polledData,
    loading: pollingLoading,
    error: pollingError,
    lastUpdated,
    refresh
  } = useRealTime(fetchDashboardData, 10000, !isConnected)

  // Use WebSocket data or fallback to polling data
  const data = isConnected ? dashboardData : polledData
  const loading = connectionStatus === 'connecting' || pollingLoading
  const error = pollingError

  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Header with connection status */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant={
              isConnected ? "success" : 
              connectionStatus === 'reconnecting' ? "warning" : 
              "destructive"
            }>
              {connectionStatus === 'connected' ? 'Live Updates' :
               connectionStatus === 'reconnecting' ? 'Reconnecting' :
               'Polling Updates'}
            </Badge>
            {lastUpdated && !isConnected && (
              <span className="text-sm text-muted-foreground">
                Last updated: {format(lastUpdated, 'HH:mm:ss')}
              </span>
            )}
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={refresh}
          disabled={loading || isConnected}
        >
          <RefreshCcw className={cn(
            "mr-2 h-4 w-4",
            loading && "animate-spin"
          )} />
          Refresh
        </Button>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total Requests"
          value={data?.stats?.totalRequests || "45.2k"}
          icon={Activity}
          trend={{ value: 12, up: true }}
          loading={loading}
        />
        <MetricCard
          title="Active Models"
          value={data?.stats?.activeModels || "14"}
          icon={Boxes}
          trend={{ value: 3, up: true }}
          loading={loading}
        />
        <MetricCard
          title="Monthly Cost"
          value={data?.stats?.monthlyCost || "$2,450"}
          icon={CircleDollarSign}
          trend={{ value: 8, up: false }}
          loading={loading}
        />
        <MetricCard
          title="System Health"
          value={data?.stats?.systemHealth || "98.2%"}
          icon={Shield}
          loading={loading}
        />
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Performance</h3>
            <p className="text-sm text-muted-foreground">Request volume over time</p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data?.performance || [
                  { name: "Mon", value: 400 },
                  { name: "Tue", value: 300 },
                  { name: "Wed", value: 500 },
                  { name: "Thu", value: 450 },
                  { name: "Fri", value: 470 },
                  { name: "Sat", value: 480 },
                  { name: "Sun", value: 600 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Cost Tracking</h3>
            <p className="text-sm text-muted-foreground">Daily cost distribution</p>
          </div>
          {loading ? (
            <div className="h-[300px] flex items-center justify-center">
              <Skeleton className="h-[250px] w-full" />
            </div>
          ) : (
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.costData || [
                  { name: "Mon", value: 120 },
                  { name: "Tue", value: 140 },
                  { name: "Wed", value: 180 },
                  { name: "Thu", value: 160 },
                  { name: "Fri", value: 150 },
                  { name: "Sat", value: 170 },
                  { name: "Sun", value: 190 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar 
                    dataKey="value" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      {/* Provider Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {loading ? (
          Array(4).fill(0).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))
        ) : (
          (data?.providers || [
            { name: "OpenAI", status: "operational", latency: "45ms", models: 5 },
            { name: "Anthropic", status: "degraded", latency: "120ms", models: 3 },
            { name: "Cohere", status: "operational", latency: "65ms", models: 4 },
            { name: "Mistral", status: "operational", latency: "55ms", models: 2 }
          ]).map((provider) => (
            <Card key={provider.name} className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-medium">{provider.name}</h3>
                <Badge variant={provider.status === "operational" ? "success" : "destructive"}>
                  {provider.status}
                </Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Latency</span>
                  <span>{provider.latency}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Active Models</span>
                  <span>{provider.models}</span>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">System events and alerts</p>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {(data?.activities || [
              { time: "2 min ago", message: "New model deployed", type: "success" },
              { time: "15 min ago", message: "High latency detected", type: "warning" },
              { time: "1 hour ago", message: "Cost threshold reached", type: "error" },
              { time: "2 hours ago", message: "System update completed", type: "info" }
            ]).map((activity, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full",
                  {
                    "bg-green-100 dark:bg-green-900": activity.type === "success",
                    "bg-yellow-100 dark:bg-yellow-900": activity.type === "warning",
                    "bg-red-100 dark:bg-red-900": activity.type === "error",
                    "bg-blue-100 dark:bg-blue-900": activity.type === "info",
                  }
                )}>
                  <Clock className={cn(
                    "h-4 w-4",
                    {
                      "text-green-600 dark:text-green-300": activity.type === "success",
                      "text-yellow-600 dark:text-yellow-300": activity.type === "warning",
                      "text-red-600 dark:text-red-300": activity.type === "error",
                      "text-blue-600 dark:text-blue-300": activity.type === "info",
                    }
                  )} />
                </div>
                <div>
                  <p className="text-sm font-medium">{activity.message}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>

      {/* Error handling */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to update dashboard data. Will retry automatically.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}