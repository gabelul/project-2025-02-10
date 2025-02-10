import * as z from "zod"
import { isValidUrl } from "@/lib/utils"

export const providerFormSchema = z.object({
  name: z.string()
    .min(2, "Provider name must be at least 2 characters")
    .max(50, "Provider name cannot exceed 50 characters"),
  
  apiKey: z.string()
    .min(20, "API key seems too short")
    .max(200, "API key exceeds maximum length")
    .regex(/^[A-Za-z0-9_-]+$/, "API key contains invalid characters"),
  
  baseUrl: z.string()
    .min(1, "Base URL is required")
    .refine(isValidUrl, "Must be a valid URL")
    .refine(url => url.startsWith('https://'), "Must use HTTPS"),
  
  environment: z.enum(["production", "staging", "development"], {
    required_error: "Please select an environment",
  }),
  
  rateLimit: z.number()
    .min(1, "Rate limit must be at least 1")
    .max(10000, "Rate limit cannot exceed 10000")
    .default(1000),
  
  timeout: z.number()
    .min(1000, "Timeout must be at least 1000ms")
    .max(60000, "Timeout cannot exceed 60 seconds")
    .default(30000),
  
  retryAttempts: z.number()
    .min(0, "Retry attempts cannot be negative")
    .max(5, "Maximum 5 retry attempts allowed")
    .default(3),
  
  ipWhitelist: z.string()
    .optional()
    .refine(ips => {
      if (!ips) return true
      return ips.split(',').every(ip => 
        /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(ip.trim())
      )
    }, "Invalid IP address format"),
  
  models: z.array(z.string()).default([]),
  
  securitySettings: z.object({
    enableRateLimiting: z.boolean().default(true),
    enableIPWhitelist: z.boolean().default(false),
    enableRequestLogging: z.boolean().default(true),
  }).default({}),
  
  backupSchedule: z.enum(["never", "daily", "weekly", "monthly"]).default("never"),
}).refine(data => {
  if (data.securitySettings.enableIPWhitelist && !data.ipWhitelist) {
    return false
  }
  return true
}, {
  message: "IP whitelist is required when IP whitelisting is enabled",
  path: ["ipWhitelist"],
})