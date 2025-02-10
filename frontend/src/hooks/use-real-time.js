"use client"

import { useState, useEffect, useCallback } from 'react'
import { useToast } from "@/hooks/use-toast"

export function useRealTime(fetchFn, interval = 5000) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)
  const { toast } = useToast()

  const fetchData = useCallback(async () => {
    try {
      const result = await fetchFn()
      setData(result)
      setLastUpdated(new Date())
      setError(null)
    } catch (err) {
      setError(err)
      toast({
        title: "Update Failed",
        description: "Could not fetch latest data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }, [fetchFn, toast])

  useEffect(() => {
    fetchData()
    const timer = setInterval(fetchData, interval)

    return () => clearInterval(timer)
  }, [fetchData, interval])

  const refresh = () => {
    setLoading(true)
    fetchData()
  }

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh
  }
}