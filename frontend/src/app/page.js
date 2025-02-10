"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Shield, User } from "lucide-react"
import Link from "next/link"

const TEST_ACCOUNTS = [
  { email: 'admin@example.com', password: 'admin123', role: 'Admin' },
  { email: 'editor@example.com', password: 'editor123', role: 'Editor' },
  { email: 'viewer@example.com', password: 'viewer123', role: 'Viewer' }
]

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Login failed')
      }

      toast({
        title: "Login successful",
        description: `Welcome back, ${data.user.role.toUpperCase()}`,
      })
      
      router.push('/admin')
    } catch (error) {
      toast({
        title: "Login failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fillTestAccount = (account) => {
    setFormData({
      email: account.email,
      password: account.password
    })
    toast({
      title: "Test Account Selected",
      description: `${account.role} account credentials filled`,
    })
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold">Admin Portal</h1>
            <p className="text-gray-500 mt-2">Sign in to access the dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  email: e.target.value
                }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  password: e.target.value
                }))}
                required
              />
            </div>

            <div className="flex justify-end">
              <Link 
                href="/reset-password" 
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </Button>
          </form>

          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Test Accounts
                </span>
              </div>
            </div>

            <div className="grid gap-2">
              {TEST_ACCOUNTS.map((account) => (
                <Button
                  key={account.email}
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => fillTestAccount(account)}
                >
                  <User className="mr-2 h-4 w-4" />
                  {account.role}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </Card>
    </main>
  )
}