"use client"

import { useEffect, useState } from "react"
import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, 
  Area 
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { 
  Clock, TrendingUp, AlertTriangle, DollarSign,
  ArrowUp, ArrowDown 
} from "lucide-react"

// Mock data for initial render
const mockData = {
  responseTime: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    value: Math.floor(Math.random() * 100) + 100
  })),
  usage: Array.from({ length: 12 }, (_, i) => ({
    time: `${i}:00`,
    requests: Math.floor(Math.random() * 1000)
  })),
  errors: Array.from({ length: 24 }, (_, i) => ({
    time: `${i}:00`,
    rate: (Math.random() * 0.5).toFixed(2)
  })),
  costs: Array.from({ length: 7 }, (_, i) => ({
    time: `Day ${i + 1}`,
    value: Math.floor(Math.random() * 100)
  }))
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-[200px]" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    </div>
  )
}

export function PerformanceTab({ providerId }) {
  const [metrics, setMetrics] = useState(mockData)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function fetchMetrics() {
      try {
        const response = await fetch(`/api/providers/${providerId}/metrics`)
        if (!response.ok) throw new Error('Failed to load metrics')
        const data = await response.json()
        setMetrics(data)
      } catch (err) {
        setError(err.message)
        // Fallback to mock data in case of error
        setMetrics(mockData)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMetrics()
  }, [providerId])

  if (isLoading) return <LoadingSkeleton />

  return (
    <div className="space-y-6">
      {/* Response Time Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Response Time
              </CardTitle>
              <CardDescription>
                Average response time over the last 24 hours
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline">
                Avg: 124ms
              </Badge>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowDown className="h-3 w-3" />
                8%
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.responseTime}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="time" />
                <YAxis />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))"
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Usage and Error Rates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Usage Graph */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  API Usage
                </CardTitle>
                <CardDescription>
                  Requests per minute
                </CardDescription>
              </div>
              <Badge variant="success" className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                12%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={metrics.usage}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))"
                    }}
                  />
                  <Bar 
                    dataKey="requests" 
                    fill="hsl(var(--primary))" 
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Error Rate */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Error Rate
                </CardTitle>
                <CardDescription>
                  Percentage of failed requests
                </CardDescription>
              </div>
              <Badge variant="destructive" className="flex items-center gap-1">
                <ArrowUp className="h-3 w-3" />
                0.02%
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={metrics.errors}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))"
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="rate"
                    stroke="hsl(var(--destructive))"
                    fill="hsl(var(--destructive))"
                    fillOpacity={0.2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}