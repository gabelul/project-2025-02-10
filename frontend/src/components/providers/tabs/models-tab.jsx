"use client"

import { useState } from "react"
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from "@/components/ui/card"
import { 
  Table, TableHeader, TableBody, TableRow,
  TableHead, TableCell 
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer
} from "recharts"
import { 
  Cpu, Zap, Clock, AlertTriangle, 
  DollarSign, ChevronUp, ChevronDown 
} from "lucide-react"

export function ModelsTab({ form }) {
  const [sortConfig, setSortConfig] = useState({
    key: 'name',
    direction: 'asc'
  })

  // Mock data - replace with real data from form
  const models = [
    {
      id: "1",
      name: "GPT-4",
      enabled: true,
      costPerRequest: 0.03,
      metrics: {
        latency: 250,
        successRate: 99.8,
        errorRate: 0.2
      }
    },
    {
      id: "2",
      name: "GPT-3.5",
      enabled: true,
      costPerRequest: 0.01,
      metrics: {
        latency: 150,
        successRate: 99.9,
        errorRate: 0.1
      }
    },
    // Add more models as needed
  ]

  // Sorting function
  const sortedModels = [...models].sort((a, b) => {
    if (sortConfig.direction === 'asc') {
      return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1
    }
    return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1
  })

  // Performance comparison data
  const performanceData = models.map(model => ({
    name: model.name,
    latency: model.metrics.latency,
    errorRate: model.metrics.errorRate,
    cost: model.costPerRequest
  }))

  return (
    <div className="space-y-6">
      {/* Models List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Cpu className="h-5 w-5" />
            Associated Models
          </CardTitle>
          <CardDescription>
            Manage and monitor your provider's model configurations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Model Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Latency</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Cost/Request</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedModels.map((model) => (
                <TableRow key={model.id}>
                  <TableCell className="font-medium">{model.name}</TableCell>
                  <TableCell>
                    <Switch
                      checked={model.enabled}
                      onCheckedChange={(checked) => {
                        // Update model status
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      {model.metrics.latency}ms
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={model.metrics.successRate > 99.5 ? "success" : "warning"}>
                      {model.metrics.successRate}%
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {model.costPerRequest.toFixed(3)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      Configure
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Performance Comparison
          </CardTitle>
          <CardDescription>
            Compare performance metrics across models
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={performanceData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))"
                  }}
                />
                <Bar 
                  name="Latency (ms)" 
                  dataKey="latency" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Error Rate (%)" 
                  dataKey="errorRate" 
                  fill="hsl(var(--destructive))" 
                  radius={[4, 4, 0, 0]}
                />
                <Bar 
                  name="Cost ($)" 
                  dataKey="cost" 
                  fill="hsl(var(--secondary))" 
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Error Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Error Analysis
          </CardTitle>
          <CardDescription>
            Model-specific error rates and patterns
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {models.map((model) => (
              <Card key={model.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm">{model.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Error Rate</span>
                      <Badge variant={model.metrics.errorRate < 0.5 ? "success" : "destructive"}>
                        {model.metrics.errorRate}%
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Success Rate</span>
                      <Badge variant="outline">
                        {model.metrics.successRate}%
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}