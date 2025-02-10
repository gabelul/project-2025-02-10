"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { 
  Activity, 
  AlertCircle,
  ArrowDown,
  ArrowUp,
  Boxes,
  CircleDollarSign,
  Cpu,
  Database,
  Server,
  Shield,
  Clock
} from "lucide-react"

// Sample data - replace with real data
const performanceData = [
  { name: "Mon", value: 400 },
  { name: "Tue", value: 300 },
  { name: "Wed", value: 500 },
  { name: "Thu", value: 450 },
  { name: "Fri", value: 470 },
  { name: "Sat", value: 480 },
  { name: "Sun", value: 600 }
]

const costData = [
  { name: "Mon", value: 120 },
  { name: "Tue", value: 140 },
  { name: "Wed", value: 180 },
  { name: "Thu", value: 160 },
  { name: "Fri", value: 150 },
  { name: "Sat", value: 170 },
  { name: "Sun", value: 190 }
]

const providers = [
  { name: "OpenAI", status: "operational", latency: "45ms", models: 5 },
  { name: "Anthropic", status: "degraded", latency: "120ms", models: 3 },
  { name: "Cohere", status: "operational", latency: "65ms", models: 4 },
  { name: "Mistral", status: "operational", latency: "55ms", models: 2 }
]

const activities = [
  { time: "2 min ago", message: "New model deployed", type: "success" },
  { time: "15 min ago", message: "High latency detected", type: "warning" },
  { time: "1 hour ago", message: "Cost threshold reached", type: "error" },
  { time: "2 hours ago", message: "System update completed", type: "info" }
]

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-6 p-8">
      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Total Requests</p>
              <p className="text-2xl font-bold">45.2k</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Activity className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            12% from last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Active Models</p>
              <p className="text-2xl font-bold">14</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900">
              <Boxes className="h-6 w-6 text-blue-600 dark:text-blue-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-blue-600">
            <Database className="mr-1 h-4 w-4" />
            3 new this week
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">Monthly Cost</p>
              <p className="text-2xl font-bold">$2,450</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 dark:bg-green-900">
              <CircleDollarSign className="h-6 w-6 text-green-600 dark:text-green-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-red-600">
            <ArrowUp className="mr-1 h-4 w-4" />
            8% over budget
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-sm font-medium text-muted-foreground">System Health</p>
              <p className="text-2xl font-bold">98.2%</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900">
              <Shield className="h-6 w-6 text-purple-600 dark:text-purple-300" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm text-green-600">
            <Cpu className="mr-1 h-4 w-4" />
            All systems normal
          </div>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Performance</h3>
            <p className="text-sm text-muted-foreground">Request volume over time</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={performanceData}>
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
        </Card>
        <Card className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-medium">Cost Tracking</h3>
            <p className="text-sm text-muted-foreground">Daily cost distribution</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData}>
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
        </Card>
      </div>

      {/* Provider Status Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {providers.map((provider) => (
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
        ))}
      </div>

      {/* Activity Feed */}
      <Card className="p-6">
        <div className="mb-4">
          <h3 className="text-lg font-medium">Recent Activity</h3>
          <p className="text-sm text-muted-foreground">System events and alerts</p>
        </div>
        <ScrollArea className="h-[200px]">
          <div className="space-y-4">
            {activities.map((activity, index) => (
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
    </div>
  )
}