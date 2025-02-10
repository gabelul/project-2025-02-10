"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { Activity, Server, Cpu, Memory, AlertTriangle, CheckCircle } from "lucide-react"

// Simulate real-time data - replace with actual API calls
const generateMetrics = () => ({
  cpu: Math.floor(Math.random() * 100),
  memory: Math.floor(Math.random() * 100),
  requests: Math.floor(Math.random() * 1000),
  latency: Math.floor(Math.random() * 500),
  uptime: "99.99%",
  status: Math.random() > 0.1 ? "operational" : "degraded"
})

export default function MonitoringPage() {
  const [metrics, setMetrics] = useState(generateMetrics())
  const [historicalData, setHistoricalData] = useState([])

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      const newMetrics = generateMetrics()
      setMetrics(newMetrics)
      setHistoricalData(prev => [...prev.slice(-20), {
        time: new Date().toLocaleTimeString(),
        ...newMetrics
      }])
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold mb-6">System Health</h1>

      <Alert variant={metrics.status === "operational" ? "default" : "destructive"}>
        <AlertDescription className="flex items-center">
          {metrics.status === "operational" ? (
            <CheckCircle className="mr-2 h-4 w-4" />
          ) : (
            <AlertTriangle className="mr-2 h-4 w-4" />
          )}
          System Status: {metrics.status.toUpperCase()}
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Cpu className="h-4 w-4 text-blue-500" />
            <h3 className="font-semibold">CPU Usage</h3>
          </div>
          <Progress value={metrics.cpu} className="mt-2" />
          <p className="text-right text-sm text-gray-500">{metrics.cpu}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Memory className="h-4 w-4 text-green-500" />
            <h3 className="font-semibold">Memory Usage</h3>
          </div>
          <Progress value={metrics.memory} className="mt-2" />
          <p className="text-right text-sm text-gray-500">{metrics.memory}%</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-purple-500" />
            <h3 className="font-semibold">Request Rate</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.requests}/min</p>
        </Card>

        <Card className="p-4">
          <div className="flex items-center space-x-2">
            <Server className="h-4 w-4 text-orange-500" />
            <h3 className="font-semibold">Uptime</h3>
          </div>
          <p className="text-2xl font-bold mt-2">{metrics.uptime}</p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">System Metrics History</h3>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={historicalData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="cpu" stroke="#3b82f6" name="CPU" />
              <Line type="monotone" dataKey="memory" stroke="#22c55e" name="Memory" />
              <Line type="monotone" dataKey="requests" stroke="#a855f7" name="Requests" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  )
}