"use client"

// Simple in-memory session management (replace with your backend auth in production)
let isAuthenticated = false

export const auth = {
  login: async (email, password) => {
    // Simulate API call - replace with real authentication
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    if (email === "admin@example.com" && password === "admin123") {
      isAuthenticated = true
      localStorage.setItem('isAuthenticated', 'true')
      return true
    }
    throw new Error("Invalid credentials")
  },

  logout: () => {
    isAuthenticated = false
    localStorage.removeItem('isAuthenticated')
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('isAuthenticated') === 'true'
    }
    return false
  }
}