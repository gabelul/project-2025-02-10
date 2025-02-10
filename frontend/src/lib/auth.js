"use client"

export const ROLES = {
  ADMIN: 'admin',
  EDITOR: 'editor',
  VIEWER: 'viewer'
}

export const PERMISSIONS = {
  PROVIDER: {
    VIEW: 'provider:view',
    CREATE: 'provider:create',
    EDIT: 'provider:edit',
    DELETE: 'provider:delete',
    CONFIGURE: 'provider:configure',
    MANAGE_API_KEYS: 'provider:manage-api-keys',
    MANAGE_SECURITY: 'provider:manage-security',
    EXPORT: 'provider:export',
    IMPORT: 'provider:import'
  }
}

// Role-based permission mappings
const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: Object.values(PERMISSIONS.PROVIDER),
  [ROLES.EDITOR]: [
    PERMISSIONS.PROVIDER.VIEW,
    PERMISSIONS.PROVIDER.EDIT,
    PERMISSIONS.PROVIDER.CONFIGURE,
    PERMISSIONS.PROVIDER.EXPORT
  ],
  [ROLES.VIEWER]: [
    PERMISSIONS.PROVIDER.VIEW
  ]
}

export function hasPermission(userRole, permission) {
  return ROLE_PERMISSIONS[userRole]?.includes(permission) || false
}

export function getPermissionsForRole(role) {
  return ROLE_PERMISSIONS[role] || []
}

// Test user database (replace with real authentication in production)
const USERS = {
  'admin@example.com': { password: 'admin123', role: ROLES.ADMIN },
  'editor@example.com': { password: 'editor123', role: ROLES.EDITOR },
  'viewer@example.com': { password: 'viewer123', role: ROLES.VIEWER }
}

export function validateCredentials(email, password) {
  const user = USERS[email]
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