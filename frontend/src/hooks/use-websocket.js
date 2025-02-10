"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { useToast } from "@/hooks/use-toast"

export function useWebSocket(url, options = {}) {
  const { 
    reconnectAttempts = 5,
    reconnectInterval = 3000,
    onMessage: onMessageCallback
  } = options

  const [isConnected, setIsConnected] = useState(false)
  const [lastMessage, setLastMessage] = useState(null)
  const [connectionStatus, setConnectionStatus] = useState('connecting')
  const { toast } = useToast()
  
  const ws = useRef(null)
  const reconnectCount = useRef(0)
  const reconnectTimer = useRef(null)

  const connect = useCallback(() => {
    try {
      ws.current = new WebSocket(url)

      ws.current.onopen = () => {
        setIsConnected(true)
        setConnectionStatus('connected')
        reconnectCount.current = 0
        toast({
          title: "Connected",
          description: "Real-time updates enabled",
        })
      }

      ws.current.onclose = () => {
        setIsConnected(false)
        setConnectionStatus('disconnected')
        
        if (reconnectCount.current < reconnectAttempts) {
          reconnectTimer.current = setTimeout(() => {
            reconnectCount.current += 1
            connect()
            setConnectionStatus('reconnecting')
            toast({
              title: "Reconnecting",
              description: `Attempt ${reconnectCount.current} of ${reconnectAttempts}`,
            })
          }, reconnectInterval)
        } else {
          setConnectionStatus('failed')
          toast({
            title: "Connection Failed",
            description: "Falling back to polling updates",
            variant: "destructive",
          })
        }
      }

      ws.current.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          setLastMessage(data)
          onMessageCallback?.(data)
        } catch (error) {
          console.error('WebSocket message parse error:', error)
        }
      }

      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error)
        toast({
          title: "Connection Error",
          description: "Error connecting to real-time updates",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error('WebSocket connection error:', error)
      setConnectionStatus('failed')
    }
  }, [url, reconnectAttempts, reconnectInterval, onMessageCallback, toast])

  useEffect(() => {
    connect()

    return () => {
      if (ws.current) {
        ws.current.close()
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current)
      }
    }
  }, [connect])

  const sendMessage = useCallback((message) => {
    if (ws.current && isConnected) {
      ws.current.send(JSON.stringify(message))
    }
  }, [isConnected])

  return {
    isConnected,
    lastMessage,
    connectionStatus,
    sendMessage
  }
}