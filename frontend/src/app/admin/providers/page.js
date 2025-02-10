"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { AdminBreadcrumb } from "@/components/ui/admin-breadcrumb"
import { 
  Search, 
  Server, 
  Clock, 
  Activity,
  AlertCircle,
  Settings,
  Plus,
  CheckCircle,
  XCircle
} from "lucide-react"

// Sample data - replace with real API data
const PROVIDERS = [
  {
    id: 1,
    name: "OpenAI",
    status: "operational",
    uptime: "99.9%",
    responseTime: "150ms",
    models: 5,
    type: "Primary",
    isEnabled: true,
    lastSync: "2 mins ago"
  },
  {
    id: 2,
    name: "Anthropic",
    status: "degraded",
    uptime: "98.5%",
    responseTime: "200ms",
    models: 3,
    type: "Secondary",
    isEnabled: true,
    lastSync: "5 mins ago"
  },
  {
    id: 3,
    name: "Cohere",
    status: "down",
    uptime: "95.0%",
    responseTime: "300ms",
    models: 2,
    type: "Secondary",
    isEnabled: false,
    lastSync: "10 mins ago"
  }
]

const STATUS_STYLES = {
  operational: {
    badge: "bg-green-500/10 text-green-500",
    icon: CheckCircle,
    text: "text-green-500"
  },
  degraded: {
    badge: "bg-yellow-500/10 text-yellow-500",
    icon: AlertCircle,
    text: "text-yellow-500"
  },
  down: {
    badge: "bg-red-500/10 text-red-500",
    icon: XCircle,
    text: "text-red-500"
  }
}

function ProviderCard({ provider, onStatusChange }) {
  const router = useRouter()
  const { toast } = useToast()
  const statusStyle = STATUS_STYLES[provider.status]

  const handleStatusToggle = async (checked) => {
    try {
      await onStatusChange(provider.id, checked)
      toast({
        title: checked ? "Provider Enabled" : "Provider Disabled",
        description: `${provider.name} has been ${checked ? "enabled" : "disabled"}`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update provider status",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${statusStyle.badge}`}>
              <Server className="h-6 w-6" />
            </div>
            <div>
              <h3 className="font-semibold">{provider.name}</h3>
              <p className="text-sm text-muted-foreground">{provider.type}</p>
            </div>
          </div>
          <Badge className={statusStyle.badge}>
            <statusStyle.icon className="mr-1 h-4 w-4" />
            {provider.status}
          </Badge>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Clock className="mr-1 h-4 w-4" />
              Response Time
            </div>
            <p className="font-medium">{provider.responseTime}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center text-sm text-muted-foreground">
              <Activity className="mr-1 h-4 w-4" />
              Uptime
            </div>
            <p className="font-medium">{provider.uptime}</p>
          </div>
        </div>

        {/* Additional Info */}
        <div className="pt-4 border-t space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Active Models</span>
            <span>{provider.models}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Last Sync</span>
            <span>{provider.lastSync}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-4 border-t">
          <Switch
            checked={provider.isEnabled}
            onCheckedChange={handleStatusToggle}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push(`/admin/providers/${provider.id}`)}
          >
            <Settings className="mr-2 h-4 w-4" />
            Configure
          </Button>
        </div>
      </div>
    </Card>
  )
}

export default function ProvidersPage() {
  const [filter, setFilter] = useState({
    search: "",
    status: "all",
    type: "all"
  })

  const handleStatusChange = async (id, status) => {
    // Implement status change logic
    console.log(`Provider ${id} status changed to ${status}`)
  }

  const filteredProviders = PROVIDERS.filter(provider => {
    if (filter.search && !provider.name.toLowerCase().includes(filter.search.toLowerCase())) {
      return false
    }
    if (filter.status !== "all" && provider.status !== filter.status) {
      return false
    }
    if (filter.type !== "all" && provider.type !== filter.type) {
      return false
    }
    return true
  })

  return (
    <div className="space-y-6 p-8">
      <AdminBreadcrumb />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Providers</h1>
          <p className="text-muted-foreground">
            Manage and monitor your AI providers
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Provider
        </Button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 flex-1">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search providers..."
            value={filter.search}
            onChange={(e) => setFilter(prev => ({ ...prev, search: e.target.value }))}
            className="max-w-sm"
          />
        </div>
        <Select
          value={filter.status}
          onValueChange={(value) => setFilter(prev => ({ ...prev, status: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="operational">Operational</SelectItem>
            <SelectItem value="degraded">Degraded</SelectItem>
            <SelectItem value="down">Down</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filter.type}
          onValueChange={(value) => setFilter(prev => ({ ...prev, type: value }))}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="Primary">Primary</SelectItem>
            <SelectItem value="Secondary">Secondary</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Provider Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredProviders.map((provider) => (
          <ProviderCard
            key={provider.id}
            provider={provider}
            onStatusChange={handleStatusChange}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredProviders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-1">No providers found</h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filters
          </p>
        </div>
      )}
    </div>
  )
}