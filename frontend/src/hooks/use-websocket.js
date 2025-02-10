"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from "@/hooks/use-toast"

/**
 * Custom hook for managing WebSocket connections with automatic reconnection
 * and error handling capabilities.
 * 
 * @param {string} url - WebSocket server URL
 * @param {Object} options - Configuration options
 * @param {number} options.reconnectAttempts - Maximum number of reconnection attempts
 * @param {number} options.reconnectInterval - Time between reconnection attempts (ms)
 * @param {Function} options.onMessage - Callback for handling incoming messages
 * @param {Function} options.onError - Custom error handler
 */
export function useWebSocket(url, options = {}) {
  const { 
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage: onMessageCallback,
    onError: onErrorCallback
  } = options

  // State management
  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const [error, setError] = useState(null)
  const { toast } = useToast()
  
  // Refs to persist across renders
  const ws = useRef(null)
  const reconnectCount = useRef(0)
  const reconnectTimer = useRef(null)
  const heartbeatInterval = useRef(null)

  /**
   * Handles WebSocket connection errors and triggers reconnection
   * @param {Error} error - The error that occurred
   */
  const handleError = useCallback((error) => {
    setError(error)
    onErrorCallback?.(error)
    
    toast({
      title: "Connection Error",
      description: error.message || "Failed to connect to real-time updates",
      variant: "destructive",
    })
  }, [onErrorCallback, toast])

  /**
   * Initiates heartbeat mechanism to detect connection issues
   */
  const startHeartbeat = useCallback(() => {
    heartbeatInterval.current = setInterval(() => {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify({ type: 'ping' }))
      }
    }, 30000) // 30 second interval
  }, [])

  /**
   * Cleans up WebSocket connection and related timers
   */
  const cleanup = useCallback(() => {
    if (ws.current) {
      ws.current.close()
      ws.current = null
    }
    if (reconnectTimer.current) {
      clearTimeout(reconnectTimer.current)
    }
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current)
    }
  }, [])

  /**
   * Establishes WebSocket connection with error handling and reconnection logic
   */
  const connect = useCallback(() => {
    cleanup()

    try {
      ws.current = new WebSocket(url)

      // Connection established successfully
      ws.current.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('connected')
        setError(null)
        reconnectCount.current = 0
        startHeartbeat()
        
        toast({
          title: "Connected",
          description: "Real-time updates enabled",
        })
      }

      // Connection closed - attempt reconnection
      ws.current.onclose = (event) => {
        setIsConnected(false)
        setConnectionStatus('disconnected')
        cleanup()
        
        // Attempt reconnection if not closed intentionally
        if (!event.wasClean && reconnectCount.current < reconnectAttempts) {
          reconnectTimer.current = setTimeout(() => {
            reconnectCount.current += 1
            setConnectionStatus('reconnecting')
            connect()
            
            toast({
              title: "Reconnecting",
              description: `Attempt ${reconnectCount.current} of ${reconnectAttempts}`,
              variant: "warning",
            })
          }, reconnectInterval)
        } else {
          setConnectionStatus('failed')
          handleError(new Error("Connection failed after maximum attempts"))
        }
      }

      // Handle incoming messages
      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle heartbeat response
          if (data.type === 'pong') {
            return
          }
          
          setLastMessage(data)
          onMessageCallback?.(data)
        } catch (error) {
          handleError(new Error('Failed to parse WebSocket message'))
        }
      }

      // Handle connection errors
      ws.current.onerror = (error) => {
        handleError(error)
      }

    } catch (error) {
      handleError(error)
      setConnectionStatus('failed')
    }
  }, [url, reconnectAttempts, reconnectInterval, onMessageCallback, handleError, startHeartbeat, cleanup, toast])

  // Initialize connection
  useEffect(() => {
    connect()
    return cleanup
  }, [connect, cleanup])

  /**
   * Sends a message through the WebSocket connection
   * @param {Object} message - Message to send
   * @returns {boolean} - Success status
   */
  const sendMessage = useCallback((message) => {
    try {
      if (ws.current?.readyState === WebSocket.OPEN) {
        ws.current.send(JSON.stringify(message))
        return true
      }
      throw new Error('WebSocket is not connected')
    } catch (error) {
      handleError(error)
      return false
    }
  }, [handleError])

  return {
    isConnected,
    lastMessage,
    connectionStatus,
    error,
    sendMessage
  }
}