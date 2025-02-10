import * as z from "zod"
import { isValidUrl } from "@/lib/utils"

// Helper function for URL validation with custom error
const validateUrl = (url, errorMessage) => {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Custom regex patterns
const PATTERNS = {
  API_KEY: /^[a-zA-Z0-9_-]{20,}$/,
  VERSION: /^v\d+(\.\d+)?(\.\d+)?$/,
  IP_ADDRESS: /^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/,
  MODEL_ID: /^[a-zA-Z0-9-]+$/
}

export const providerFormSchema = z.object({
  // Basic Information
  name: z.string()
    .min(2, "Provider name must be at least 2 characters")
    .max(50, "Provider name cannot exceed 50 characters")
    .regex(/^[a-zA-Z0-9\s-]+$/, "Name can only contain letters, numbers, spaces, and hyphens"),

  description: z.string()
    .max(500, "Description cannot exceed 500 characters")
    .optional(),

  // API Configuration
  apiKey: z.string()
    .min(20, "API key must be at least 20 characters")
    .max(200, "API key is too long")
    .regex(PATTERNS.API_KEY, "Invalid API key format")
    .transform(val => val.trim()),

  baseUrl: z.string()
    .min(1, "Base URL is required")
    .refine(url => validateUrl(url, "Invalid URL format"))
    .refine(url => url.startsWith('https://'), "Must use HTTPS")
    .transform(val => val.trim()),

  version: z.string()
    .regex(PATTERNS.VERSION, "Invalid version format (e.g., v1, v1.0, v1.0.0)")
    .optional(),

  environment: z.enum(["production", "staging", "development"], {
    required_error: "Environment is required",
  }),

  // Performance Settings
  timeout: z.number()
    .int("Timeout must be a whole number")
    .min(1000, "Timeout must be at least 1000ms")
    .max(60000, "Timeout cannot exceed 60 seconds")
    .default(30000),

  retryAttempts: z.number()
    .int("Retry attempts must be a whole number")
    .min(0, "Retry attempts cannot be negative")
    .max(5, "Maximum 5 retry attempts allowed")
    .default(3),

  rateLimit: z.object({
    enabled: z.boolean().default(true),
    requestsPerMinute: z.number()
      .int("Must be a whole number")
      .min(1, "Minimum 1 request per minute")
      .max(10000, "Cannot exceed 10000 requests per minute")
      .optional(),
    burstLimit: z.number()
      .int("Must be a whole number")
      .min(1, "Minimum burst limit is 1")
      .optional(),
  }).default({}),

  // Security Settings
  security: z.object({
    enableIPWhitelist: z.boolean().default(false),
    ipWhitelist: z.string()
      .optional()
      .refine(ips => {
        if (!ips) return true
        return ips.split(',').every(ip => 
          PATTERNS.IP_ADDRESS.test(ip.trim())
        )
      }, "Invalid IP address format"),
    enableRequestLogging: z.boolean().default(true),
    enableRateLimiting: z.boolean().default(true),
    requireAuthentication: z.boolean().default(true),
  }).default({}),

  // Model Configuration
  models: z.array(
    z.object({
      id: z.string().regex(PATTERNS.MODEL_ID, "Invalid model ID format"),
      enabled: z.boolean().default(true),
      maxTokens: z.number()
        .int("Must be a whole number")
        .min(1, "Minimum 1 token")
        .max(100000, "Cannot exceed 100000 tokens")
        .optional(),
      temperature: z.number()
        .min(0, "Minimum temperature is 0")
        .max(2, "Maximum temperature is 2")
        .optional(),
      costPerToken: z.number()
        .min(0, "Cost cannot be negative")
        .optional(),
    })
  ).default([]),

  // Advanced Settings
  advanced: z.object({
    customHeaders: z.record(z.string()).optional(),
    webhookUrl: z.string()
      .refine(url => !url || validateUrl(url, "Invalid webhook URL"))
      .optional(),
    fallbackProvider: z.string().optional(),
    maxConcurrentRequests: z.number()
      .int("Must be a whole number")
      .min(1, "Minimum 1 concurrent request")
      .max(100, "Maximum 100 concurrent requests")
      .optional(),
  }).default({}),
}).refine(data => {
  // Cross-field validation
  if (data.security.enableIPWhitelist && !data.security.ipWhitelist) {
    return false
  }
  if (data.rateLimit.enabled && !data.rateLimit.requestsPerMinute) {
    return false
  }
  return true
}, {
  message: "Missing required fields based on enabled features",
  path: ["security"]
}).refine(data => {
  // Environment-specific validation
  if (data.environment === "production") {
    return data.security.requireAuthentication === true
  }
  return true
}, {
  message: "Production environment requires authentication",
  path: ["security.requireAuthentication"]
})