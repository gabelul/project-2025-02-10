"use client"

import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { 
  Loader2, 
  ChevronDown, 
  ChevronUp,
  Clock,
  Activity,
  AlertTriangle,
  DollarSign,
  BarChart,
  Zap
} from "lucide-react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"

export function ModelsTab({ providerId }) {
  const { toast } = useToast()
  const [loadingModel, setLoadingModel] = useState(null)
  const [expandedModel, setExpandedModel] = useState(null)
  
  // Mock data - replace with real API call
  const [models, setModels] = useState([
    {
      id: "gpt-4",
      name: "GPT-4",
      enabled: true,
      metrics: {
        performance: {
          avgResponseTime: 250,
          p95ResponseTime: 450,
          successRate: 99.8,
          errorRate: 0.2,
          errorBreakdown: {
            timeout: 0.1,
            validation: 0.05,
            server: 0.05
          }
        },
        usage: {
          requestsPerMinute: 100,
          totalRequests: 150000,
          peakUsage: 250,
          avgTokensPerRequest: 500
        },
        quality: {
          outputQualityScore: 0.95,
          validationSuccessRate: 99.5,
          avgTokenRatio: 1.8,
          contextUtilization: 0.85
        },
        cost: {
          costPer1kTokens: 0.03,
          dailyCost: 150.25,
          costEfficiencyScore: 0.92,
          budgetUtilization: 75
        }
      }
    },
    // ... other models
  ])

  const toggleModelStatus = (modelId, enabled) => {
    setLoadingModel(modelId)
    try {
      // Simulated toggle logic
      setModels(models.map(model => 
        model.id === modelId ? { ...model, enabled } : model
      ))
      toast({
        title: `Model ${enabled ? 'Enabled' : 'Disabled'}`,
        description: `${modelId} has been ${enabled ? 'enabled' : 'disabled'}`
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update model status',
        variant: 'destructive'
      })
    } finally {
      setLoadingModel(null)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Associated Models</CardTitle>
          <CardDescription>Manage and monitor your provider's models</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[30px]"></TableHead>
                <TableHead>Model</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Success Rate</TableHead>
                <TableHead>Cost/1k Tokens</TableHead>
                <TableHead className="w-[100px]">Enable/Disable</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {models.map((model) => (
                <Collapsible
                  key={model.id}
                  open={expandedModel === model.id}
                  onOpenChange={() => setExpandedModel(expandedModel === model.id ? null : model.id)}
                >
                  <TableRow>
                    <TableCell>
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm">
                          {expandedModel === model.id ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TableCell>
                    <TableCell className="font-medium">{model.name}</TableCell>
                    <TableCell>
                      <Badge variant={model.enabled ? "success" : "secondary"}>
                        {model.enabled ? "Active" : "Disabled"}
                      </Badge>
                    </TableCell>
                    <TableCell>{model.metrics.performance.avgResponseTime}ms</TableCell>
                    <TableCell>
                      <Badge variant={model.metrics.performance.successRate > 99.5 ? "success" : "warning"}>
                        {model.metrics.performance.successRate}%
                      </Badge>
                    </TableCell>
                    <TableCell>${model.metrics.cost.costPer1kTokens}</TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        {loadingModel === model.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Switch
                            checked={model.enabled}
                            onCheckedChange={(checked) => toggleModelStatus(model.id, checked)}
                            aria-label={`Toggle ${model.name}`}
                          />
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                  
                  <CollapsibleContent asChild>
                    <TableRow className="bg-muted/50">
                      <TableCell colSpan={7} className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          {/* Performance Metrics */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Clock className="h-4 w-4" />
                                Performance
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Response</span>
                                <span>{model.metrics.performance.avgResponseTime}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">P95 Response</span>
                                <span>{model.metrics.performance.p95ResponseTime}ms</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Error Rate</span>
                                <span>{model.metrics.performance.errorRate}%</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Usage Metrics */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Activity className="h-4 w-4" />
                                Usage
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Requests/min</span>
                                <span>{model.metrics.usage.requestsPerMinute}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Total Requests</span>
                                <span>{model.metrics.usage.totalRequests.toLocaleString()}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Avg Tokens</span>
                                <span>{model.metrics.usage.avgTokensPerRequest}</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Quality Metrics */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <Zap className="h-4 w-4" />
                                Quality
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Quality Score</span>
                                <span>{(model.metrics.quality.outputQualityScore * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Token Ratio</span>
                                <span>{model.metrics.quality.avgTokenRatio}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Context Usage</span>
                                <span>{(model.metrics.quality.contextUtilization * 100).toFixed(1)}%</span>
                              </div>
                            </CardContent>
                          </Card>

                          {/* Cost Analysis */}
                          <Card>
                            <CardHeader className="pb-2">
                              <CardTitle className="text-sm flex items-center gap-2">
                                <DollarSign className="h-4 w-4" />
                                Cost
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2 text-sm">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Daily Cost</span>
                                <span>${model.metrics.cost.dailyCost.toFixed(2)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Efficiency</span>
                                <span>{(model.metrics.cost.costEfficiencyScore * 100).toFixed(1)}%</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Budget Used</span>
                                <span>{model.metrics.cost.budgetUtilization}%</span>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </TableCell>
                    </TableRow>
                  </CollapsibleContent>
                </Collapsible>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}