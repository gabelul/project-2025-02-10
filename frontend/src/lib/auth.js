"use client"

const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}

export const TEST_USERS = {
  'admin@example.com': { password: 'admin123', role: ROLES.ADMIN },
  'editor@example.com': { password: 'editor123', role: ROLES.EDITOR },
  'viewer@example.com': { password: 'viewer123', role: ROLES.VIEWER }
}

export function validateCredentials(email, password) {
  const user = TEST_USERS[email]
  if (!user || user.password !== password) {
    return null
  }
  return {
    email,
    role: user.role
  }
}

export function getSession() {
  if (typeof window !== 'undefined') {
    const session = localStorage.getItem('session')
    return session ? JSON.parse(session) : null
  }
  return null
}

export function setSession(data) {
  if (typeof window !== 'undefined') {
    localStorage.setItem('session', JSON.stringify(data))
  }
}

export function clearSession() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('session')
  }
}