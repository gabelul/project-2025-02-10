"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { ProviderBackup } from "@/lib/provider-backup"
import { PermissionGate } from "@/components/ui/permission-gate"
import { PERMISSIONS } from "@/lib/auth"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { 
  Download, Upload, Save, ArrowLeft, Server, Settings, 
  Activity, Clock, Shield, Boxes, AlertCircle, DollarSign,
  Loader2
} from "lucide-react"

// Add saveProviderConfig function
async function saveProviderConfig(data) {
  // Implement the actual API call to save provider configuration
  // This is a placeholder implementation
  console.log('Saving provider configuration:', data)
  // You would typically make an API call here
  // For example: await fetch('/api/providers', { method: 'POST', body: JSON.stringify(data) })
}

export default function ProviderDetailPage({ params }) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [userRole, setUserRole] = useState('editor') // Get from auth context

  // Initialize form with validation
  const form = useForm({
    resolver: zodResolver(providerFormSchema),
    defaultValues: {
      name: "",
      apiKey: "",
      baseUrl: "https://api.provider.com/v1",
      environment: "production",
      rateLimit: 1000,
      timeout: 30000,
      retryAttempts: 3,
      ipWhitelist: "",
      models: [],
      securitySettings: {
        enableRateLimiting: true,
        enableIPWhitelist: false,
        enableRequestLogging: true,
      },
      backupSchedule: "never"
    }
  })

  const onSubmit = async (data) => {
    setIsLoading(true)
    try {
      // API call to save configuration
      await saveProviderConfig(data)
      
      toast({
        title: "Success",
        description: "Provider configuration saved successfully",
      })
    } catch (error) {
      console.error('Save failed:', error)
      toast({
        title: "Error",
        description: error.message || "Failed to save configuration",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleExport = async () => {
    setBackupInProgress(true)
    try {
      await ProviderBackup.exportConfig(params.id)
      toast({
        title: "Success",
        description: "Configuration exported successfully",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setBackupInProgress(false)
    }
  }

  const handleImport = async (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    setBackupInProgress(true)
    try {
      const config = await ProviderBackup.importConfig(file)
      form.reset(config.config)
      
      toast({
        title: "Success",
        description: "Configuration imported successfully",
      })
    } catch (error) {
      toast({
        title: "Import Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setBackupInProgress(false)
    }
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
            <h1 className="text-2xl font-bold">Provider Configuration</h1>
          </div>
          <p className="text-muted-foreground">
            Configure and monitor provider settings
          </p>
        </div>

        <PermissionGate
          permission={PERMISSIONS.PROVIDER.EDIT}
          userRole={userRole}
        >
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={backupInProgress}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-config"
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById('import-config').click()}
                disabled={backupInProgress}
              >
                <Upload className="mr-2 h-4 w-4" />
                Import
              </Button>
            </div>
          </div>
        </PermissionGate>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.CONFIGURE}
            userRole={userRole}
          >
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </PermissionGate>
          <TabsTrigger value="models">Models</TabsTrigger>
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.MANAGE_SECURITY}
            userRole={userRole}
          >
            <TabsTrigger value="security">Security</TabsTrigger>
          </PermissionGate>
        </TabsList>

        {/* Overview Tab - Accessible to all */}
        <TabsContent value="overview" className="space-y-6">
          {/* Quick Stats */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* ... existing stats cards ... */}
          </div>

          {/* Performance Charts */}
          <div className="grid gap-4 md:grid-cols-2">
            {/* ... existing charts ... */}
          </div>
        </TabsContent>

        {/* Configuration Tab */}
        <TabsContent value="configuration">
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.CONFIGURE}
            userRole={userRole}
            showError
          >
            <Card className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* ... existing configuration form fields ... */}
                </form>
              </Form>
            </Card>
          </PermissionGate>
        </TabsContent>

        {/* Models Tab */}
        <TabsContent value="models" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* ... existing model cards ... */}
          </div>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security">
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.MANAGE_SECURITY}
            userRole={userRole}
            showError
          >
            <Card className="p-6">
              <Form {...form}>
                <div className="space-y-4">
                  {/* ... existing security settings ... */}
                </div>
              </Form>
            </Card>
          </PermissionGate>
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
        
        <PermissionGate
          permission={PERMISSIONS.PROVIDER.EDIT}
          userRole={userRole}
        >
          <Button 
            type="submit" 
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
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
        </PermissionGate>
      </div>
    </div>
  )
}