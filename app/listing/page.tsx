"use client"
import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Building2, Phone } from "lucide-react"
import { useLanguage } from "../../components/languageContext"
import { useToast } from "../../components/ui/useToast"
import { getCurrentUser, isManager, isAccountant, isDispatcher, isDriver, isAdmin } from "../../lib/auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
export default function ListingPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(null)
  const [formData, setFormData] = useState({
    name: "",
    hotline: "",
    email: "",
    address: "",
    taxCode: "",
    fax: "",
    urlPage: "",
  })
  const { toast } = useToast()
  useEffect(() => {
    const user = getCurrentUser()
    if (user) setCurrentUser(user)
    if (user && (isManager() || isAccountant() || isDispatcher() || isDriver())) {
      router.push('/company')
    }
  }, [router])
  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (currentUser?.companyId) {
      toast({ title: 'Cannot Register', description: 'Your Account Already Has A Company.' })
      return
    }
    try {
      try {
        const apiService = (await import('../../lib/api')).apiService
        const companiesResponse = await apiService.getCompanies({ pageSize: 1000 })
        const companiesData = (companiesResponse as any).items || (companiesResponse as any).data?.items || (companiesResponse as any).Items || (companiesResponse as any).data || []
        const exists = companiesData.some((c: any) => (c.contactAccountId ?? c.contactAccountId) === Number(currentUser?.id))
        if (exists) {
          toast({ title: 'Cannot Register', description: 'This Account Has Already Registered A Company.' })
          return
        }
      } catch {
      }
      const apiService = (await import('../../lib/api')).apiService
      await apiService.createCompany({
        name: formData.name.trim(),
        hotline: formData.hotline.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        taxCode: formData.taxCode.trim(),
        fax: formData.fax?.trim() || undefined,
        urlPage: formData.urlPage?.trim() || undefined,
        contactAccountId: currentUser?.id ? Number(currentUser.id) : undefined,
      })
      toast({ title: 'Company Registration Successful', description: 'Will Redirect To Homepage Shortly.' })
      setFormData({ name: '', hotline: '', email: '', address: '', taxCode: '', fax: '', urlPage: '' })
      setTimeout(() => router.push('/'), 1200)
    } catch (err: any) {
      toast({ title: 'Registration Failed', description: err?.message || 'Please Check Your Information Again' })
    }
  }
  const handleReset = () => {
    setFormData({ name: '', hotline: '', email: '', address: '', taxCode: '', fax: '', urlPage: '' })
  }
  return (
    <div className="min-h-screen bg-black text-primary bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-primary pageEnter">
      <section className="heroSection py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fadeInScale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 sm:px-6 text-center relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            {t.listingTitle}
          </h1>
          <p className="text-lg sm:text-xl text-gray-700 dark:text-yellow-200 mb-6 sm:mb-8 max-w-3xl mx-auto leading-relaxed">
            {t.listingSubtitle}
          </p>
        </div>
      </section>
      <section className="py-12 sm:py-16 slideInLeft">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="w-full">
            <Card className="bg-white/90 dark:bg-card/80 backdrop-blur border-primary/30 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-3xl text-gray-900 dark:text-foreground mb-2">Register Taxi Company</CardTitle>
                <CardDescription className="text-gray-600 dark:text-muted-foreground">
                  Fill In Information To Register Your Taxi Company
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {currentUser?.companyId && (
                    <div className="p-3 rounded border border-yellow-500/30 bg-yellow-500/10 text-yellow-800 dark:text-yellow-200">
                      Your Account Already Has A Company. Cannot Register Another.
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        <Building2 className="w-5 h-5" />
                        Company Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="companyName" className="text-gray-700 dark:text-foreground">
                          Company Name *
                        </Label>
                        <Input
                          id="companyName"
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <h3 className="text-xl font-semibold text-primary flex items-center gap-2">
                        <Phone className="w-5 h-5" />
                        Contact Information
                      </h3>
                      <div className="space-y-2">
                        <Label htmlFor="address" className="text-gray-700 dark:text-foreground">
                          Address *
                        </Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => handleInputChange("address", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-gray-700 dark:text-foreground">
                          Phone Number *
                        </Label>
                        <Input
                          id="mobile"
                          value={formData.hotline}
                          onChange={(e) => handleInputChange("hotline", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="fax" className="text-gray-700 dark:text-foreground">
                          Fax
                        </Label>
                        <Input
                          id="fax"
                          value={formData.fax}
                          onChange={(e) => handleInputChange("fax", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700 dark:text-foreground">
                          Email *
                        </Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => handleInputChange("email", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="taxCode" className="text-gray-700 dark:text-foreground">
                          Tax Code *
                        </Label>
                        <Input
                          id="taxCode"
                          value={formData.taxCode}
                          onChange={(e) => handleInputChange("taxCode", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="urlPage" className="text-gray-700 dark:text-foreground">
                          Website (Optional)
                        </Label>
                        <Input
                          id="urlPage"
                          value={formData.urlPage}
                          onChange={(e) => handleInputChange("urlPage", e.target.value)}
                          className="bg-white dark:bg-input border-border text-foreground focus:border-primary"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                      disabled={!!currentUser?.companyId}
                    >
                      Register
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleReset}
                      className="flex-1 border-yellow-500/50 text-primary hover:bg-yellow-500/10 py-3 bg-transparent"
                    >
                      Reset
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}