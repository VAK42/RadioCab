"use client"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Phone, Mail, MapPin, Clock } from "lucide-react"
export default function ContactPage() {
  return (
    <main className="container py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold">Contact</h1>
        <p className="mt-2 text-gray-600 dark:text-yellow-200">Fixed Contact Information (Template) Of RadioCabs.</p>
      </div>
      <div className="max-w-2xl mx-auto">
        <Card className="bg-white/90 dark:bg-gray-900/50 border border-yellow-500/20 shadow-lg">
          <CardHeader>
            <CardTitle className="text-lg">Contact Information (Template)</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10">
              <Phone className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium">Hotline</div>
                <div className="text-sm text-gray-600 dark:text-yellow-200">1900 1234</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10">
              <Mail className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium">Email</div>
                <div className="text-sm text-gray-600 dark:text-yellow-200">support@radiocabs.in</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10">
              <MapPin className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium">Address</div>
                <div className="text-sm text-gray-600 dark:text-yellow-200">No. 1 Tran Duy Hung, Cau Giay, Hanoi</div>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 rounded-lg bg-yellow-50/60 dark:bg-yellow-900/10">
              <Clock className="w-5 h-5 text-yellow-500 mt-0.5" />
              <div>
                <div className="font-medium">Working Hours</div>
                <div className="text-sm text-gray-600 dark:text-yellow-200">08:00 - 18:00 (Monday - Friday)</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}