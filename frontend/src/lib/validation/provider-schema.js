import * as z from "zod"

export const providerFormSchema = z.object({
  name: z.string().min(2).max(50),
  description: z.string().optional(),
  apiKey: z.string().min(1),
  baseUrl: z.string().url(),
  version: z.string(),
  environment: z.enum(["development", "staging", "production"]),
  timeout: z.number().min(1000).max(60000),
  retryAttempts: z.number().min(0).max(5),
  rateLimit: z.object({
    enabled: z.boolean(),
    requestsPerMinute: z.number().min(1),
    burstLimit: z.number().min(1)
  }),
  security: z.object({
    enableIPWhitelist: z.boolean(),
    ipWhitelist: z.string().optional(),
    enableRequestLogging: z.boolean(),
    enableRateLimiting: z.boolean(),
    requireAuthentication: z.boolean(),
    authMethod: z.enum(["bearer", "basic", "oauth"]).optional(),
  }),
  models: z.array(z.object({
    id: z.string(),
    name: z.string(),
    enabled: z.boolean(),
    costPerRequest: z.number().optional(),
    performanceMetrics: z.object({
      averageLatency: z.number(),
      successRate: z.number(),
      errorRate: z.number()
    }).optional()
  })),
  monitoring: z.object({
    enableAlerts: z.boolean(),
    alertThresholds: z.object({
      errorRate: z.number(),
      latency: z.number(),
      costLimit: z.number()
    }).optional()
  }).optional()
})