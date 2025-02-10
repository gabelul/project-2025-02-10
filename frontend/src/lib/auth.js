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
  validateCredentials: (email, password) => {
    const user = USERS[email]
    if (user && user.password === password) {
      const userData = {
        email,
        role: user.role,
        timestamp: new Date().toISOString()
      }
      return userData
    }
    return null
  },

  setSession: (userData) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('user', JSON.stringify(userData))
    }
  },

  getSession: () => {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem('user')
      return data ? JSON.parse(data) : null
    }
    return null
  },

  clearSession: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user')
    }
  },

  checkRole: (requiredRole) => {
    const user = auth.getSession()
    if (!user) return false
    
    if (user.role === ROLES.ADMIN) return true
    if (user.role === ROLES.EDITOR && requiredRole === ROLES.VIEWER) return true
    return user.role === requiredRole
  }
}