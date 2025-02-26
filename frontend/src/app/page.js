"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Shield, User, AlertCircle, CheckCircle } from "lucide-react"
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
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)

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

      // Show success state
      setSuccess(true)
      
      // Show success toast
      toast({
        title: "Login successful! 🎉",
        description: `Welcome back, ${data.user.role.toUpperCase()}`,
        variant: "success",
      })

      // Show redirecting toast
      setTimeout(() => {
        toast({
          title: "Redirecting...",
          description: "Taking you to your dashboard",
        })
      }, 500)

      // Delay redirect slightly to show success state
      setTimeout(() => {
        router.push('/admin')
      }, 1000)

    } catch (error) {
      setError(error.message)
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
    setError("")
    setSuccess(false)
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

          {error && (
            <Alert variant="destructive" className="animate-shake">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="bg-green-50 text-green-700 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-500" />
              <AlertDescription>Login successful! Redirecting...</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => {
                  setError("")
                  setSuccess(false)
                  setFormData(prev => ({
                    ...prev,
                    email: e.target.value
                  }))
                }}
                required
                className={error ? "border-red-500" : success ? "border-green-500" : ""}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => {
                  setError("")
                  setSuccess(false)
                  setFormData(prev => ({
                    ...prev,
                    password: e.target.value
                  }))
                }}
                required
                className={error ? "border-red-500" : success ? "border-green-500" : ""}
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
              className={`w-full ${success ? 'bg-green-500 hover:bg-green-600' : ''}`}
              disabled={isLoading || success}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Signing in...
                </>
              ) : success ? (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Success!
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