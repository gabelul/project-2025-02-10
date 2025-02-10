"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Loader2, ArrowLeft, Shield } from "lucide-react"
import Link from "next/link"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState("")
  const token = searchParams.get('token')
  const [newPassword, setNewPassword] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = token ? '/api/auth/reset/confirm' : '/api/auth/reset/request'
      const body = token ? { token, newPassword } : { email }

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        throw new Error('Reset request failed')
      }

      toast({
        title: token ? "Password Updated" : "Reset Email Sent",
        description: token 
          ? "Your password has been successfully updated" 
          : "Check your email for reset instructions",
      })

      if (token) {
        router.push('/')
      }
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md p-8">
        <div className="space-y-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-900"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to login
          </Link>

          <div className="text-center">
            <Shield className="h-12 w-12 mx-auto text-primary mb-4" />
            <h1 className="text-2xl font-bold">
              {token ? "Set New Password" : "Reset Password"}
            </h1>
            <p className="text-gray-500 mt-2">
              {token 
                ? "Enter your new password below" 
                : "Enter your email to receive reset instructions"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {token ? (
              <div className="space-y-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <Button 
              type="submit" 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {token ? "Updating Password..." : "Sending Reset Link..."}
                </>
              ) : (
                token ? "Update Password" : "Send Reset Link"
              )}
            </Button>
          </form>
        </div>
      </Card>
    </main>
  )
}