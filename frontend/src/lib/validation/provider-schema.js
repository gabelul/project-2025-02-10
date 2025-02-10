import * as z from "zod"

export const providerFormSchema = z.object({
  name: z.string().min(2, "Provider name must be at least 2 characters"),
  apiKey: z.string().min(20, "API key seems too short"),
  baseUrl: z.string().url("Must be a valid URL"),
  environment: z.enum(["production", "staging", "development"]),
  rateLimit: z.number().min(0).optional(),
  timeout: z.number().min(1000).max(60000).optional(),
  retryAttempts: z.number().min(0).max(5).optional(),
  ipWhitelist: z.string().optional(),
  securitySettings: z.object({
    enableRateLimiting: z.boolean(),
    enableIPWhitelist: z.boolean(),
    enableRequestLogging: z.boolean()
  }).optional()
})