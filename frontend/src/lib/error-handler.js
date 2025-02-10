export const ErrorTypes = {
  VALIDATION: 'validation',
  API: 'api',
  NETWORK: 'network',
  CONFIGURATION: 'configuration',
  PERMISSION: 'permission',
  UNKNOWN: 'unknown'
}

export class ProviderError extends Error {
  constructor(type, message, details = null) {
    super(message)
    this.type = type
    this.details = details
    this.timestamp = new Date()
  }
}

export const handleProviderError = (error, toast) => {
  console.error('Provider Error:', error)

  if (error instanceof ProviderError) {
    switch (error.type) {
      case ErrorTypes.VALIDATION:
        toast({
          title: "Validation Error",
          description: error.message,
          variant: "destructive",
        })
        return error.details || {}

      case ErrorTypes.API:
        toast({
          title: "API Error",
          description: "Failed to communicate with the provider API",
          variant: "destructive",
        })
        break

      case ErrorTypes.NETWORK:
        toast({
          title: "Network Error",
          description: "Please check your internet connection",
          variant: "destructive",
        })
        break

      case ErrorTypes.CONFIGURATION:
        toast({
          title: "Configuration Error",
          description: error.message,
          variant: "destructive",
        })
        break

      case ErrorTypes.PERMISSION:
        toast({
          title: "Permission Error",
          description: "You don't have permission to perform this action",
          variant: "destructive",
        })
        break

      default:
        toast({
          title: "Error",
          description: error.message || "An unexpected error occurred",
          variant: "destructive",
        })
    }
  } else {
    toast({
      title: "Error",
      description: error.message || "An unexpected error occurred",
      variant: "destructive",
    })
  }

  return null
}