const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001'

export const DashboardTopics = {
  STATS: 'dashboard.stats',
  PERFORMANCE: 'dashboard.performance',
  PROVIDERS: 'dashboard.providers'
}

export function getWebSocketUrl() {
  return WS_URL
}

import { z } from "zod"

// Validation schemas for incoming data
const statsSchema = z.object({
  totalRequests: z.number(),
  activeModels: z.number(),
  monthlyCost: z.number(),
  systemHealth: z.number()
})

const performanceSchema = z.array(z.object({
  name: z.string(),
  value: z.number()
}))

const providerSchema = z.object({
  name: z.string(),
  status: z.enum(['operational', 'degraded', 'down']),
  latency: z.string(),
  models: z.number()
})

/**
 * Validates and transforms incoming WebSocket messages
 * @param {Object} message - Raw WebSocket message
 * @returns {Object|null} Transformed data or null if invalid
 */
export function transformDashboardData(message) {
  try {
    switch (message.topic) {
      case DashboardTopics.STATS:
        return {
          type: 'stats',
          data: statsSchema.parse(message.data)
        }
      case DashboardTopics.PERFORMANCE:
        return {
          type: 'performance',
          data: performanceSchema.parse(message.data)
        }
      case DashboardTopics.PROVIDERS:
        return {
          type: 'providers',
          data: z.array(providerSchema).parse(message.data)
        }
      default:
        console.warn('Unknown message topic:', message.topic)
        return null
    }
  } catch (error) {
    console.error('Data validation error:', error)
    throw new Error(`Invalid data received for ${message.topic}`)
  }
}

/**
 * Error types for dashboard operations
 */
export const DashboardErrors = {
  CONNECTION: 'connection_error',
  VALIDATION: 'validation_error',
  TIMEOUT: 'timeout_error',
  UNKNOWN: 'unknown_error'
}

/**
 * Creates an error object with additional context
 * @param {string} type - Error type from DashboardErrors
 * @param {string} message - Error message
 * @param {*} details - Additional error details
 */
export function createDashboardError(type, message, details = null) {
  return {
    type,
    message,
    details,
    timestamp: new Date().toISOString()
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