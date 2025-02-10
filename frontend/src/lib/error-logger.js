import { v4 as uuidv4 } from 'uuid'

export const LogLevel = {
  INFO: 'info',
  WARN: 'warn',
  ERROR: 'error',
  CRITICAL: 'critical',
  DEBUG: 'debug'
}

export const ErrorSeverity = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical'
}

export const ErrorCategory = {
  VALIDATION: 'validation',
  API: 'api',
  NETWORK: 'network',
  CONFIGURATION: 'configuration',
  SECURITY: 'security',
  PERFORMANCE: 'performance',
  DATABASE: 'database',
  AUTHENTICATION: 'authentication',
  AUTHORIZATION: 'authorization',
  INTEGRATION: 'integration',
  UNKNOWN: 'unknown'
}

class ErrorLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000
    this.subscribers = new Set()
  }

  log(level, message, error = null, context = {}) {
    const timestamp = new Date()
    const logEntry = {
      id: uuidv4(),
      timestamp,
      level,
      message,
      error: error ? {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      } : null,
      context: {
        ...context,
        url: typeof window !== 'undefined' ? window.location.href : '',
        userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : '',
        environment: process.env.NODE_ENV,
      }
    }

    // Add to history and trim if needed
    this.logs.unshift(logEntry)
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(0, this.maxLogs)
    }

    // Notify subscribers
    this.notifySubscribers(logEntry)

    // Console output with styling
    this.consoleOutput(logEntry)

    return logEntry
  }

  consoleOutput(logEntry) {
    const styles = {
      [LogLevel.INFO]: 'color: #3b82f6', // blue
      [LogLevel.WARN]: 'color: #eab308', // yellow
      [LogLevel.ERROR]: 'color: #ef4444', // red
      [LogLevel.CRITICAL]: 'color: #7c2d12', // dark red
      [LogLevel.DEBUG]: 'color: #8b5cf6' // purple
    }

    console.group(
      `%c[${logEntry.level.toUpperCase()}] ${logEntry.message}`,
      styles[logEntry.level]
    )
    if (logEntry.error) {
      console.error('Error:', logEntry.error)
    }
    console.log('Context:', logEntry.context)
    console.log('Timestamp:', logEntry.timestamp.toISOString())
    console.groupEnd()
  }

  subscribe(callback) {
    this.subscribers.add(callback)
    return () => this.subscribers.delete(callback)
  }

  notifySubscribers(logEntry) {
    this.subscribers.forEach(callback => callback(logEntry))
  }

  getFilteredLogs({
    level = null,
    category = null,
    severity = null,
    startDate = null,
    endDate = null,
    search = null
  } = {}) {
    return this.logs.filter(log => {
      if (level && log.level !== level) return false
      if (category && log.context.category !== category) return false
      if (severity && log.context.severity !== severity) return false
      if (startDate && log.timestamp < startDate) return false
      if (endDate && log.timestamp > endDate) return false
      if (search) {
        const searchLower = search.toLowerCase()
        return (
          log.message.toLowerCase().includes(searchLower) ||
          log.error?.message.toLowerCase().includes(searchLower)
        )
      }
      return true
    })
  }

  getErrorStats() {
    const now = new Date()
    const last24Hours = new Date(now - 24 * 60 * 60 * 1000)

    const stats = {
      total: 0,
      by: {
        level: {},
        category: {},
        severity: {}
      },
      recent: {
        total: 0,
        critical: 0
      }
    }

    this.logs.forEach(log => {
      // Total count
      stats.total++

      // Count by level
      stats.by.level[log.level] = (stats.by.level[log.level] || 0) + 1

      // Count by category
      if (log.context.category) {
        stats.by.category[log.context.category] = 
          (stats.by.category[log.context.category] || 0) + 1
      }

      // Count by severity
      if (log.context.severity) {
        stats.by.severity[log.context.severity] = 
          (stats.by.severity[log.context.severity] || 0) + 1
      }

      // Recent errors (last 24 hours)
      if (log.timestamp > last24Hours) {
        stats.recent.total++
        if (log.context.severity === ErrorSeverity.CRITICAL) {
          stats.recent.critical++
        }
      }
    })

    return stats
  }

  clearLogs() {
    this.logs = []
    this.notifySubscribers({ type: 'clear' })
  }
}

export const errorLogger = new ErrorLogger()

// Helper function to create detailed error context
export function createErrorContext(category, severity, details = {}) {
  return {
    category,
    severity,
    timestamp: new Date().toISOString(),
    ...details
  }
}

// Helper function to log provider configuration errors
export function logProviderError(error, context = {}) {
  const errorContext = {
    ...context,
    category: ErrorCategory.CONFIGURATION,
    severity: ErrorSeverity.HIGH,
  }

  return errorLogger.log(
    LogLevel.ERROR,
    `Provider Configuration Error: ${error.message}`,
    error,
    errorContext
  )
}