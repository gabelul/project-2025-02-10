"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Activity, Settings, MessageSquare, Database } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button variant="outline">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-8 w-8 text-blue-500" />
            <div>
              <h3 className="font-semibold">Active Tasks</h3>
              <p className="text-2xl font-bold">24</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="font-semibold">Content Generated</h3>
              <p className="text-2xl font-bold">1,234</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Database className="h-8 w-8 text-purple-500" />
            <div>
              <h3 className="font-semibold">Active Providers</h3>
              <p className="text-2xl font-bold">3</p>
            </div>
          </div>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="providers">Providers</TabsTrigger>
          <TabsTrigger value="prompts">Prompts</TabsTrigger>
          <TabsTrigger value="monitoring">Monitoring</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-2">
                <Link href="/admin/providers">
                  <Button className="w-full justify-start" variant="outline">
                    Configure Providers
                  </Button>
                </Link>
                <Link href="/admin/prompts">
                  <Button className="w-full justify-start" variant="outline">
                    Manage Prompts
                  </Button>
                </Link>
                <Link href="/admin/monitoring">
                  <Button className="w-full justify-start" variant="outline">
                    View Performance
                  </Button>
                </Link>
              </div>
            </Card>
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">System Status</h3>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span>API Status</span>
                  <span className="text-green-500">Operational</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Queue Status</span>
                  <span className="text-green-500">Normal</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Database Status</span>
                  <span className="text-green-500">Connected</span>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}