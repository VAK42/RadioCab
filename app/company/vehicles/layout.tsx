"use client"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Car, MapPin, Tag, Layers } from "lucide-react"
const vehicleTabs = [
  {
    title: "Segments",
    href: "/company/vehicles/segments",
    icon: Tag,
    description: "Segments"
  },
  {
    title: "Models",
    href: "/company/vehicles/models",
    icon: Car,
    description: "Models"
  },
  {
    title: "Vehicle Instances",
    href: "/company/vehicles/instances",
    icon: Layers,
    description: "Actual Vehicles"
  },
  {
    title: "Operating Zones",
    href: "/company/vehicles/zones",
    icon: MapPin,
    description: "Zones"
  }
]
export default function VehiclesLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  return (
    <div className="space-y-6">
      <div className="bg-white/90 dark:bg-gray-800/90 rounded-lg border border-gray-200 dark:border-gray-700 p-1">
        <div className="flex gap-1">
          {vehicleTabs.map((tab) => {
            const isActive = pathname === tab.href
            const Icon = tab.icon
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`
                  flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-md transition-all duration-200
                  ${isActive
                    ? 'bg-yellow-500 text-black font-semibold shadow-md'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.title}</span>
                <span className="sm:hidden">{tab.title.split(' ')[0]}</span>
              </Link>
            )
          })}
        </div>
      </div>
      <div>
        {children}
      </div>
    </div>
  )
}