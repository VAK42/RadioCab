"use client"
import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { LogIn, Shield, User, Eye, EyeOff, Building2, AlertCircle } from "lucide-react"
import { login, getCurrentUser } from "../../lib/auth"
import { Alert, AlertDescription } from "../../components/ui/alert"
import Link from "next/link"
export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState("")
  const [usernameError, setUsernameError] = useState("")
  const [passwordError, setPasswordError] = useState("")
  const usernameMin = 3
  const usernameMax = 50
  const passwordMin = 6
  const passwordMax = 100
  useEffect(() => {
    const user = getCurrentUser()
    if (!user) return
    try {
      const raw = localStorage.getItem('userSession')
      const sess = raw ? JSON.parse(raw) : null
      const hasAuth = typeof document !== 'undefined' && document.cookie.includes('authToken=')
      const hasRole = typeof document !== 'undefined' && document.cookie.includes('userRole=')
      if (sess && (!hasAuth || !hasRole)) {
        const exp = sess?.expiresAt ? new Date(sess.expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const expires = `; Expires=${exp.toUTCString()}`
        document.cookie = `authToken=${encodeURIComponent(sess?.accessToken || '')}; Path=/; SameSite=Lax${expires}`
        document.cookie = `userRole=${encodeURIComponent(user.role)}; Path=/; SameSite=Lax${expires}`
      }
    } catch { }
    const go = (path: string) => {
      try { router.replace(path) } catch { window.location.href = path }
    }
    const from = searchParams?.get('from')
    if (from) {
      go(from)
      return
    }
    switch (user.role) {
      case 'ADMIN':
        go('/admin/overview')
        break
      case 'MANAGER':
        go('/company')
        break
      case 'DRIVER':
        go('/driver/orders')
        break
      case 'ACCOUNTANT':
        go('/company')
        break
      case 'DISPATCHER':
        go('/company')
        break
      case 'CUSTOMER':
        go('/booking')
        break
      default:
        go('/')
    }
  }, [router, searchParams])
  const handleInputChange = (field: string, value: string) => {
    setLoginData((prev) => ({ ...prev, [field]: value }))
    setError("")
    if (field === 'username') {
      if (!value || value.trim().length < usernameMin) {
        setUsernameError(`Username Must Have At Least ${usernameMin} Characters.`)
      } else if (value.length > usernameMax) {
        setUsernameError(`Username Must Not Exceed ${usernameMax} Characters.`)
      } else {
        setUsernameError("")
      }
    }
    if (field === 'password') {
      if (!value || value.length < passwordMin) {
        setPasswordError(`Password Must Have At Least ${passwordMin} Characters.`)
      } else if (value.length > passwordMax) {
        setPasswordError(`Password Must Not Exceed ${passwordMax} Characters.`)
      } else {
        setPasswordError("")
      }
    }
  }
  const validateAll = (): boolean => {
    let ok = true
    if (!loginData.username || loginData.username.trim().length < usernameMin) {
      setUsernameError(`Username Must Have At Least ${usernameMin} Characters.`)
      ok = false
    } else if (loginData.username.length > usernameMax) {
      setUsernameError(`Username Must Not Exceed ${usernameMax} Characters.`)
      ok = false
    } else {
      setUsernameError("")
    }
    if (!loginData.password || loginData.password.length < passwordMin) {
      setPasswordError(`Password Must Have At Least ${passwordMin} Characters.`)
      ok = false
    } else if (loginData.password.length > passwordMax) {
      setPasswordError(`Password Must Not Exceed ${passwordMax} Characters.`)
      ok = false
    } else {
      setPasswordError("")
    }
    return ok
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    if (!validateAll()) {
      return
    }
    try {
      const user = await login(loginData.username, loginData.password)
      if (!user) {
        setError("Incorrect Username Or Password!")
        return
      }
      try {
        const raw = localStorage.getItem('userSession')
        const sess = raw ? JSON.parse(raw) : null
        const exp = sess?.expiresAt ? new Date(sess.expiresAt) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        const expires = `; Expires=${exp.toUTCString()}`
        document.cookie = `authToken=${encodeURIComponent(sess?.accessToken || '')}; Path=/; SameSite=Lax${expires}`
        document.cookie = `userRole=${encodeURIComponent(user.role)}; Path=/; SameSite=Lax${expires}`
      } catch { }
      switch (user.role) {
        case 'ADMIN':
          window.location.href = "/admin/overview"
          break
        case 'MANAGER':
          window.location.href = "/company"
          break
        case 'DRIVER':
          window.location.href = "/driver/orders"
          break
        case 'ACCOUNTANT':
          window.location.href = "/company"
          break
        case 'DISPATCHER':
          window.location.href = "/company"
          break
        case 'CUSTOMER':
          window.location.href = "/booking"
          break
        default:
          window.location.href = "/"
      }
    } catch (error) {
      setError("An Error Occurred During Login. Please Try Again!")
    }
  }
  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 pageEnter">
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fadeInScale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            System Login
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            Access Your Account To Manage Information And Use RadioCabs.In Services
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16 slideInLeft">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-md mx-auto">
            <Card className="bg-gradient-to-br from-yellow-200/80 to-yellow-300/80 dark:from-yellow-900/20 dark:to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400 mb-2 flex items-center justify-center gap-2">
                  <LogIn className="w-6 h-6" />
                  System Login
                </CardTitle>
                <CardDescription className="text-yellow-200">
                  The System Will Automatically Assign Permissions Based On Your Role
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <Alert variant="destructive" className="bg-red-900/20 border-red-500/50">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-gray-700 dark:text-yellow-300">
                      Username Or Email *
                    </Label>
                    <Input
                      id="username"
                      minLength={usernameMin}
                      maxLength={usernameMax}
                      value={loginData.username}
                      onChange={(e) => handleInputChange("username", e.target.value)}
                      className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400"
                      placeholder="Enter Username, Email Or User Code"
                      required
                    />
                    {usernameError && (
                      <p className="text-sm text-red-600 dark:text-red-400 mt-1">{usernameError}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-gray-700 dark:text-yellow-300">
                      Password *
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        minLength={passwordMin}
                        maxLength={passwordMax}
                        value={loginData.password}
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        className="bg-white/80 dark:bg-black/50 border-yellow-500/50 text-gray-900 dark:text-yellow-100 focus:border-yellow-400 pr-10"
                        placeholder="Enter Password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 dark:text-yellow-400 hover:text-gray-800 dark:hover:text-yellow-300"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>
                  {passwordError && (
                    <p className="text-sm text-red-600 dark:text-red-400 -mt-4">{passwordError}</p>
                  )}
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                  <div className="text-center space-y-2">
                    <p className="text-yellow-200 text-sm">Don't Have An Account?</p>
                    <div className="flex flex-col space-y-1 text-sm">
                      <Link href="/listing" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                        Register Taxi Company
                      </Link>
                      <Link href="/drivers" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                        Register Driver
                      </Link>
                      <Link href="/demo-accounts" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                        View Demo Accounts
                      </Link>
                      <Link href="/login/forgot" className="text-gray-700 dark:text-yellow-400 hover:text-gray-900 dark:hover:text-yellow-300 transition-colors">
                        Forgot Password?
                      </Link>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-yellow-100/80 to-yellow-200/80 dark:from-yellow-900/10 dark:to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Role-Based Permissions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="bg-gradient-to-br from-red-200/80 to-red-300/80 dark:from-red-900/20 dark:to-black border-red-500/30 text-center">
              <CardContent className="p-6">
                <Shield className="w-12 h-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-red-400 mb-2">ADMIN</h3>
                <p className="text-gray-600 dark:text-red-200 text-sm">View Entire System (Read Only)</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-blue-200/80 to-blue-300/80 dark:from-blue-900/20 dark:to-black border-blue-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-blue-400 mb-2">MANAGER</h3>
                <p className="text-gray-600 dark:text-blue-200 text-sm">Full Company Management</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-green-200/80 to-green-300/80 dark:from-green-900/20 dark:to-black border-green-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-green-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-green-400 mb-2">DRIVER</h3>
                <p className="text-gray-600 dark:text-green-200 text-sm">View Own Orders</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-purple-200/80 to-purple-300/80 dark:from-purple-900/20 dark:to-black border-purple-500/30 text-center">
              <CardContent className="p-6">
                <Building2 className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-purple-400 mb-2">ACCOUNTANT</h3>
                <p className="text-gray-600 dark:text-purple-200 text-sm">View Revenue Reports</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-orange-200/80 to-orange-300/80 dark:from-orange-900/20 dark:to-black border-orange-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-orange-600 dark:text-orange-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-orange-400 mb-2">DISPATCHER</h3>
                <p className="text-gray-600 dark:text-orange-200 text-sm">Dispatch Orders</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-br from-cyan-200/80 to-cyan-300/80 dark:from-cyan-900/20 dark:to-black border-cyan-500/30 text-center">
              <CardContent className="p-6">
                <User className="w-12 h-12 text-cyan-600 dark:text-cyan-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-cyan-400 mb-2">CUSTOMER</h3>
                <p className="text-gray-600 dark:text-cyan-200 text-sm">Book Rides And Use Services</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}