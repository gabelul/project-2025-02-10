"use client"

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}

const USERS = {
  'admin@example.com': { password: 'admin123', role: ROLES.ADMIN },
  'editor@example.com': { password: 'editor123', role: ROLES.EDITOR },
  'viewer@example.com': { password: 'viewer123', role: ROLES.VIEWER }
}

export const auth = {
  user: null,

  login: async (email, password) => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    const user = USERS[email]
    if (user && user.password === password) {
      const userData = {
        email,
        role: user.role,
        timestamp: new Date().toISOString()
      }
      localStorage.setItem('user', JSON.stringify(userData))
      auth.user = userData
      return userData
    }
    throw new Error("Invalid credentials")
  },

  logout: () => {
    auth.user = null
    localStorage.removeItem('user')
  },

  checkAuth: () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user')
      if (userData) {
        auth.user = JSON.parse(userData)
        return auth.user
      }
    }
    return null
  },

  hasRole: (requiredRole) => {
    const user = auth.checkAuth()
    if (!user) return false
    
    // Admin has access to everything
    if (user.role === ROLES.ADMIN) return true
    
    // Editor has access to editor and viewer content
    if (user.role === ROLES.EDITOR && requiredRole === ROLES.VIEWER) return true
    
    // Direct role match
    return user.role === requiredRole
  }
}