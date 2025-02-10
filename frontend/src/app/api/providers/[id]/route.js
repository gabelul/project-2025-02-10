import { NextResponse } from 'next/server'

const mockProvider = {
  id: "1",
  name: "OpenAI Provider",
  description: "OpenAI API integration",
  apiKey: "sk-mock-key",
  baseUrl: "https://api.openai.com/v1",
  environment: "development",
  timeout: 30000,
  retryAttempts: 3,
  rateLimit: {
    enabled: true,
    requestsPerMinute: 1000,
    burstLimit: 10
  },
  security: {
    enableIPWhitelist: false,
    ipWhitelist: "",
    enableRequestLogging: true,
    enableRateLimiting: true
  }
}

export async function GET(request, { params }) {
  try {
    // In a real app, fetch from database
    if (params.id === "1") {
      return NextResponse.json(mockProvider)
    }
    
    return NextResponse.json(
      { error: "Provider not found" },
      { status: 404 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}