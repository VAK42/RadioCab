"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Label } from "../../../components/ui/label"
import { Button } from "../../../components/ui/button"
import { apiService } from "../../../lib/api"
import Link from "next/link"
export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [sent, setSent] = useState(false)
  const [code, setCode] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const sendOtp = async () => {
    if (!email) { alert('Please Enter Email'); return }
    try {
      setLoading(true)
      await apiService.post('/accounts/send-password-reset', { email })
      setSent(true)
    } catch (e: any) {
      alert(`Cannot Send Code: ${e?.message || 'Unknown Error'}`)
    } finally {
      setLoading(false)
    }
  }
  const resetPassword = async () => {
    if (!email || !code || !newPassword) { alert('Please Fill In All Fields'); return }
    if (newPassword !== confirmPassword) { alert('Confirm Password Does Not Match'); return }
    try {
      setLoading(true)
      await apiService.post('/accounts/reset-password', { email, code, newPassword })
      alert('Password Changed Successfully. Please Login Again.')
      window.location.href = '/login'
    } catch (e: any) {
      alert(`Password Change Failed: ${e?.message || 'Invalid Code'}`)
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80">
          <CardHeader>
            <CardTitle>Forgot Password</CardTitle>
            <CardDescription>Enter Email To Receive OTP Code For Password Reset</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            {!sent ? (
              <Button onClick={sendOtp} disabled={loading} className="w-full">
                {loading ? 'Sending...' : 'Send Code'}
              </Button>
            ) : (
              <>
                <div className="space-y-2">
                  <Label>OTP Code</Label>
                  <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter Code" />
                </div>
                <div className="space-y-2">
                  <Label>New Password</Label>
                  <Input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="New Password" />
                </div>
                <div className="space-y-2">
                  <Label>Confirm Password</Label>
                  <Input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-Enter Password" />
                </div>
                <Button onClick={resetPassword} disabled={loading} className="w-full">
                  {loading ? 'Changing...' : 'Change Password'}
                </Button>
                <Button variant="outline" onClick={sendOtp} disabled={loading} className="w-full">
                  Resend Code
                </Button>
              </>
            )}
            <div className="text-center text-sm">
              <Link className="text-yellow-600" href="/login">Back To Login</Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}