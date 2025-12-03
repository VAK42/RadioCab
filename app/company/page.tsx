"use client"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
export default function CompanyRedirectPage() {
  const router = useRouter()
  useEffect(() => {
    router.push("/company/employees")
  }, [router])
  return (
    <div className="p-8 text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
      <p className="mt-4 text-gray-600 dark:text-yellow-200">Redirecting...</p>
    </div>
  )
}