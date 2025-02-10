import * as z from "zod"

export const providerFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  description: z.string().optional(),
  apiKey: z.string().min(1, "API key is required"),
  baseUrl: z.string().url("Must be a valid URL"),
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
    enableRateLimiting: z.boolean()
  })
})