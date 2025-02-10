"use client"

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}

// Test users database
const USERS = {
  'admin@example.com': { password: 'admin123', role: ROLES.ADMIN },
  'editor@example.com': { password: 'editor123', role: ROLES.EDITOR },
  'viewer@example.com': { password: 'viewer123', role: ROLES.VIEWER }
}

export const auth = {
  login: async (email, password) => {
    const user = USERS[email]
    if (!user || user.password !== password) {
      throw new Error('Invalid credentials')
    }
    
    return {
      email,
      role: user.role
    }
  }
}