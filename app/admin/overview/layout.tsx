"use client"
import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Building2, DollarSign, Menu, X, ChevronRight } from "lucide-react"
import { Button } from "../../../components/ui/button"
const adminSections = [
  {
    title: "System Information",
    href: "/admin/overview",
    icon: Building2,
    description: "Overview Of Companies, Employees, Vehicles, Orders"
  },
  {
    title: "Membership Management",
    href: "/admin/overview/membership",
    icon: DollarSign,
    description: "Revenue, Service Packages, Payment History"
  },
  {
    title: "New Registrations",
    href: "/admin/overview/registrations",
    icon: ChevronRight,
    description: "List Of Companies With NEW Status"
  }
]
export default function AdminOverviewLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-red-100 to-red-200 dark:from-black dark:via-red-900/10 dark:to-black">
      <div className="flex">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        <div className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm 
          border-r border-gray-200 dark:border-gray-800 z-50 transform transition-transform duration-300
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400">
              Admin Panel
            </h2>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          <nav className="p-4 space-y-2">
            {adminSections.map((section) => {
              const isActive = pathname === section.href
              const Icon = section.icon
              return (
                <Link
                  key={section.href}
                  href={section.href}
                  className={`
                    block p-4 rounded-lg transition-all duration-200
                    ${isActive
                      ? 'bg-red-100 dark:bg-red-900/30 border-l-4 border-red-600'
                      : 'hover:bg-gray-100 dark:hover:bg-gray-800 border-l-4 border-transparent'
                    }
                  `}
                  onClick={() => setSidebarOpen(false)}
                >
                  <div className="flex items-start gap-3">
                    <Icon className={`w-5 h-5 mt-0.5 ${isActive ? 'text-red-600' : 'text-gray-600 dark:text-gray-400'}`} />
                    <div className="flex-1">
                      <h3 className={`font-semibold ${isActive ? 'text-red-600' : 'text-gray-900 dark:text-gray-100'}`}>
                        {section.title}
                      </h3>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {section.description}
                      </p>
                    </div>
                    {isActive && <ChevronRight className="w-4 h-4 text-red-600" />}
                  </div>
                </Link>
              )
            })}
          </nav>
        </div>
        <div className="flex-1">
          <div className="lg:hidden flex items-center gap-4 p-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-800 sticky top-0 z-30">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="text-lg font-bold text-red-600 dark:text-red-400">
              Admin Overview
            </h1>
          </div>
          <div className="p-6">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}