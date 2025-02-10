class ErrorLogger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000
    this.subscribers = new Set()
    this.counter = 0
  }

  generateErrorId() {
    this.counter += 1
    return `${Date.now()}_${this.counter}`
  }

  log(level, message, error = null, context = {}) {
    const timestamp = new Date()
    const logEntry = {
      id: this.generateErrorId(),
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
      [LogLevel.INFO]: 'color: #3b82f6',
      [LogLevel.WARN]: 'color: #eab308',
      [LogLevel.ERROR]: 'color: #ef4444',
      [LogLevel.CRITICAL]: 'color: #7c2d12',
      [LogLevel.DEBUG]: 'color: #8b5cf6'
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

    return {
      total: this.logs.length,
      by: {
        level: this.groupBy('level'),
        category: this.groupBy('context.category'),
        severity: this.groupBy('context.severity')
      },
      recent: {
        total: this.logs.filter(log => log.timestamp > last24Hours).length,
        critical: this.logs.filter(log => 
          log.timestamp > last24Hours && 
          log.context.severity === ErrorSeverity.CRITICAL
        ).length
      }
    }
  }

  groupBy(key) {
    return this.logs.reduce((acc, log) => {
      const value = key.split('.').reduce((obj, k) => obj?.[k], log)
      if (value) {
        acc[value] = (acc[value] || 0) + 1
      }
      return acc
    }, {})
  }

  clearLogs() {
    this.logs = []
    this.notifySubscribers({ type: 'clear' })
  }
}

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

export const errorLogger = new ErrorLogger()

export function createErrorContext(category, severity, details = {}) {
  return {
    category,
    severity,
    timestamp: new Date().toISOString(),
    ...details
  }
}

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