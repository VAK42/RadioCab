"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AdminOnly } from "../../components/roleBasedAccess"
export default function AdminRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.replace("/admin/dashboard")
  }, [router])
  return (
    <AdminOnly>
      <div className="min-h-screen bg-background flex items-center justify-center pageEnter">
        <div className="text-center fadeInScale">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Redirecting To Admin Dashboard...</p>
        </div>
      </div>
    </AdminOnly>
  )
}