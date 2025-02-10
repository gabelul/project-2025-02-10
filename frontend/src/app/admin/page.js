"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar } from "@/components/ui/avatar"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Plus, Search, CreditCard, Activity, Users, DollarSign } from "lucide-react"

// Sample data for charts
const revenueData = [
  { month: 'Jan', value: 12000 },
  { month: 'Feb', value: 13500 },
  { month: 'Mar', value: 14200 },
  { month: 'Apr', value: 11800 },
  { month: 'May', value: 15400 },
  { month: 'Jun', value: 16200 },
  { month: 'Jul', value: 15231.89 },
]

const exerciseData = [
  { month: 'Jan', current: 65, previous: 45 },
  { month: 'Feb', current: 75, previous: 55 },
  { month: 'Mar', current: 85, previous: 65 },
  { month: 'Apr', current: 95, previous: 75 },
  { month: 'May', current: 85, previous: 85 },
  { month: 'Jun', current: 75, previous: 65 },
  { month: 'Jul', current: 65, previous: 55 },
]

const teamMembers = [
  { name: 'Sofia Davis', email: 'sofia@example.com', role: 'Owner' },
  { name: 'Jackson Lee', email: 'jackson@example.com', role: 'Member' },
]

export default function AdminDashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center space-x-2">
          <Button>Download</Button>
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Total Revenue</div>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">$15,231.89</div>
          <div className="text-xs text-muted-foreground">
            +20.1% from last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Subscriptions</div>
            <Users className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">+2350</div>
          <div className="text-xs text-muted-foreground">
            +180.1% from last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active Users</div>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">1,234</div>
          <div className="text-xs text-muted-foreground">
            +19% from last month
          </div>
        </Card>
        <Card className="p-6">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium">Active Providers</div>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="text-2xl font-bold">12</div>
          <div className="text-xs text-muted-foreground">
            +2 from last month
          </div>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Team Members */}
        <Card className="col-span-3 p-6">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg font-medium">Team Members</h3>
              <p className="text-sm text-muted-foreground">
                Invite your team members to collaborate.
              </p>
            </div>
            <Button size="sm" className="shrink-0">
              <Plus className="mr-2 h-4 w-4" />
              Add Member
            </Button>
          </div>
          <div className="space-y-4">
            {teamMembers.map((member) => (
              <div
                key={member.email}
                className="flex items-center justify-between"
              >
                <div className="flex items-center space-x-4">
                  <Avatar className="h-8 w-8">
                    <div className="font-medium">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {member.email}
                    </p>
                  </div>
                </div>
                <Badge variant="secondary">{member.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Charts */}
        <Card className="col-span-4 p-6">
          <div className="flex items-center justify-between pb-4">
            <div>
              <h3 className="text-lg font-medium">Exercise Minutes</h3>
              <p className="text-sm text-muted-foreground">
                Your exercise minutes are ahead of where you normally are.
              </p>
            </div>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={exerciseData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="current" 
                  stroke="#8884d8" 
                  name="Current"
                />
                <Line 
                  type="monotone" 
                  dataKey="previous" 
                  stroke="#82ca9d" 
                  name="Previous"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  )
}