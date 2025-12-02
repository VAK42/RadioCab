"use client"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../../components/ui/card"
import { Input } from "../../../components/ui/input"
import { Button } from "../../../components/ui/button"
import { Label } from "../../../components/ui/label"
import { apiService } from "../../../lib/api"
export default function VerifyRegisterPage() {
  const searchParams = useSearchParams()
  const emailParam = searchParams.get('email') || ''
  const [email, setEmail] = useState<string>(emailParam)
  const [code, setCode] = useState<string>("")
  const [submitting, setSubmitting] = useState(false)
  const [resending, setResending] = useState(false)
  useEffect(() => {
    if (!email && typeof window !== 'undefined') {
      try {
        const pending = sessionStorage.getItem('pendingRegistration')
        if (pending) {
          const parsed = JSON.parse(pending)
          if (parsed?.email) setEmail(parsed.email)
        }
      } catch { }
    }
  }, [email])
  const handleVerify = async () => {
    if (!email || !code) {
      alert('Please Enter Email And Verification Code')
      return
    }
    try {
      setSubmitting(true)
      await apiService.post('/accounts/verify-email', { email, code })
      const pendingRaw = sessionStorage.getItem('pendingRegistration')
      if (!pendingRaw) {
        alert('Pending Registration Data Not Found')
        return
      }
      const pending = JSON.parse(pendingRaw)
      const payload = {
        username: pending.username,
        password: pending.password,
        fullName: pending.fullName,
        phone: pending.phone || undefined,
        email: pending.email,
        role: 'CUSTOMER'
      }
      await apiService.post('/accounts', payload)
      sessionStorage.removeItem('pendingRegistration')
      alert('Verification Successful. Account Has Been Created. Please Login.')
      window.location.href = '/login'
    } catch (e: any) {
      alert(`Verification Failed: ${e?.message || 'Invalid Code'}`)
    } finally {
      setSubmitting(false)
    }
  }
  const resend = async () => {
    if (!email) { alert('Please Enter Email'); return }
    try {
      setResending(true)
      await apiService.post('/accounts/send-email-verification', { email })
      alert('Verification Code Has Been Resent To Your Email')
    } catch (e: any) {
      alert(`Cannot Resend Code: ${e?.message || 'Unknown Error'}`)
    } finally {
      setResending(false)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black py-12 px-4">
      <div className="max-w-md mx-auto">
        <Card className="bg-white/80 dark:bg-gray-800/80">
          <CardHeader>
            <CardTitle>Verify Email</CardTitle>
            <CardDescription>Enter The OTP Code Sent To Your Email To Complete Registration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </div>
            <div className="space-y-2">
              <Label>Verification Code</Label>
              <Input value={code} onChange={(e) => setCode(e.target.value)} placeholder="Enter 6-Character Code" />
            </div>
            <Button disabled={submitting} onClick={handleVerify} className="w-full">
              {submitting ? 'Verifying...' : 'Verify'}
            </Button>
            <Button variant="outline" disabled={resending} onClick={resend} className="w-full">
              {resending ? 'Resending...' : 'Resend Code'}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}