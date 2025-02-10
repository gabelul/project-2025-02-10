const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

export const DashboardTopics = {
  STATS: 'dashboard.stats',
  PERFORMANCE: 'dashboard.performance',
  PROVIDERS: 'dashboard.providers'
}

export function getWebSocketUrl() {
  return WS_URL
}

export function transformDashboardData(message) {
  switch (message.topic) {
    case DashboardTopics.STATS:
      return {
        type: 'stats',
        data: message.data
      }
    case DashboardTopics.PERFORMANCE:
      return {
        type: 'performance',
        data: message.data
      }
    case DashboardTopics.PROVIDERS:
      return {
        type: 'providers',
        data: message.data
      }
    default:
      return null
  }
}

// Fallback polling function
export async function fetchDashboardData() {
  // Simulate API latency
  await new Promise(resolve => setTimeout(resolve, 500))

  return {
    stats: {
      totalRequests: Math.floor(40000 + Math.random() * 10000),
      activeModels: 14,
      monthlyCost: 2450 + Math.floor(Math.random() * 200),
      systemHealth: 98.2
    },
    performance: Array.from({ length: 7 }, (_, i) => ({
      name: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      value: 300 + Math.floor(Math.random() * 300)
    })),
    providers: [
      {
        name: "OpenAI",
        status: Math.random() > 0.1 ? "operational" : "degraded",
        latency: `${40 + Math.floor(Math.random() * 10)}ms`,
        models: 5
      },
      // ... other providers
    ]
  }
}