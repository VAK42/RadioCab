"use client"
import { useState, useEffect } from "react"
import RouteCalculator from "../../components/routeCalculator"
import { Card, CardContent } from "../../components/ui/card"
import { Car, ArrowLeft } from "lucide-react"
import { Button } from "../../components/ui/button"
import Link from "next/link"
export default function BookPage() {
  const [modelPrice, setModelPrice] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    const storedPrice = sessionStorage.getItem('selectedModelPrice')
    if (storedPrice) {
      try {
        const parsed = JSON.parse(storedPrice)
        setModelPrice(parsed)
        setLoading(false)
      } catch (e) {
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }, [])
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-yellow-200">Loading...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 dark:from-black dark:via-yellow-900/10 dark:to-black">
      <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm border-b border-primary/20 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="h-4 w-4" />
                  Back To Homepage
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <Car className="h-6 w-6 text-yellow-600" />
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Book Taxi
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {modelPrice ? (
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-0">
                <RouteCalculator modelPrice={modelPrice} />
              </CardContent>
            </Card>
          ) : (
            <Card className="border-primary/20 shadow-lg">
              <CardContent className="p-12 text-center">
                <Car className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  No Vehicle Selected
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Please Select A Vehicle Type From The Homepage To Book A Ride
                </p>
                <Link href="/">
                  <Button className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back To Homepage
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}