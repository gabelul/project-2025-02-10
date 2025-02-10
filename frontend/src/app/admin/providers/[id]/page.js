"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { providerFormSchema } from "@/lib/validation/provider-schema"
import { ProviderBackup } from "@/lib/provider-backup"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { Download, Upload, Save, Loader2 } from "lucide-react"
import { PermissionGate } from "@/components/ui/permission-gate"
import { PERMISSIONS } from "@/lib/auth"

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
  const [isLoading, setIsLoading] = useState(false)
  const [backupInProgress, setBackupInProgress] = useState(false)
  const [userRole, setUserRole] = useState('editor') // Get from auth context
  const { toast } = useToast()

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
      {/* Header with Role-Based Actions */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Provider Configuration</h1>
        <div className="flex items-center gap-2">
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.EXPORT}
            userRole={userRole}
          >
            <Button
              variant="outline"
              onClick={handleExport}
              disabled={backupInProgress}
            >
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </PermissionGate>

          <PermissionGate
            permission={PERMISSIONS.PROVIDER.IMPORT}
            userRole={userRole}
          >
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
          </PermissionGate>
        </div>
      </div>

      {/* Configuration Tabs with Role-Based Access */}
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.CONFIGURE}
            userRole={userRole}
          >
            <TabsTrigger value="configuration">Configuration</TabsTrigger>
          </PermissionGate>
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.MANAGE_SECURITY}
            userRole={userRole}
          >
            <TabsTrigger value="security">Security</TabsTrigger>
          </PermissionGate>
        </TabsList>

        {/* Overview Tab - Accessible to all */}
        <TabsContent value="overview">
          <Card className="p-6">
            {/* ... Overview content ... */}
          </Card>
        </TabsContent>

        {/* Configuration Tab - Protected */}
        <TabsContent value="configuration">
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.CONFIGURE}
            userRole={userRole}
            showError
          >
            <Card className="p-6">
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Provider Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter provider name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Add other configuration form fields as needed */}
                </form>
              </Form>
            </Card>
          </PermissionGate>
        </TabsContent>

        {/* Security Tab - Protected */}
        <TabsContent value="security">
          <PermissionGate
            permission={PERMISSIONS.PROVIDER.MANAGE_SECURITY}
            userRole={userRole}
            showError
          >
            <Card className="p-6">
              <h3 className="text-lg font-medium mb-4">Security Settings</h3>
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="securitySettings.enableRateLimiting"
                  render={({ field }) => (
                    <FormItem className="flex items-center justify-between">
                      <div>
                        <FormLabel>Rate Limiting</FormLabel>
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
              </div>
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
          <Button type="submit" disabled={isLoading}>
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