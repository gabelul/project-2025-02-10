"use server"

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

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

export async function login(email, password) {
  const user = USERS[email]
  
  if (user && user.password === password) {
    const userData = {
      email,
      role: user.role,
      timestamp: new Date().toISOString()
    }
    
    cookies().set('auth', JSON.stringify(userData), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 // 24 hours
    })
    
    return userData
  }
  
  throw new Error('Invalid credentials')
}

export async function logout() {
  cookies().delete('auth')
  redirect('/')
}

export async function getUser() {
  const authCookie = cookies().get('auth')
  if (!authCookie) return null
  
  try {
    return JSON.parse(authCookie.value)
  } catch {
    return null
  }
}

export async function checkRole(requiredRole) {
  const user = await getUser()
  if (!user) return false
  
  if (user.role === ROLES.ADMIN) return true
  if (user.role === ROLES.EDITOR && requiredRole === ROLES.VIEWER) return true
  return user.role === requiredRole
}