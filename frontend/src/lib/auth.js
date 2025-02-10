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

export const validateCredentials = (email, password) => {
  const user = USERS[email]
  if (!user || user.password !== password) {
    return null
  }
  return {
    email,
    role: user.role
  }
}