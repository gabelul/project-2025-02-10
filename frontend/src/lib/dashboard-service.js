// Simulated API calls - replace with real API endpoints
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