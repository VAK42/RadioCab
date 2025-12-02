import type React from "react"
import type { Metadata } from "next"
import { Inter, Roboto, Open_Sans } from "next/font/google"
import { Suspense } from "react"
import { ThemeProvider } from "../components/themeProvider"
import { LanguageProvider } from "../components/languageContext"
import { Toaster } from "../components/ui/toaster"
import Header from "../components/header"
import Footer from "../components/footer"
import SmoothTransition from "../components/smoothTransition"
import "./globals.css"
const inter = Inter({
  subsets: ["latin", "latin-ext"],
  variable: "--font-inter",
  display: "swap",
})
const roboto = Roboto({
  subsets: ["latin", "latin-ext"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-roboto",
  display: "swap",
})
const openSans = Open_Sans({
  subsets: ["latin", "latin-ext"],
  variable: "--font-open-sans",
  display: "swap",
})
export const metadata: Metadata = {
  title: "RadioCabs - Leading Taxi Information Portal In Vietnam",
  description: "Connecting Taxi Companies, Drivers & Customers. Register Services, Search Taxi Information & Send Feedback Easily!",
  generator: "RadioCabs",
}
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable} ${roboto.variable} ${openSans.variable}`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <Header />
            <SmoothTransition>
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="loading-spinner w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full"></div>
                </div>
              }>
                {children}
              </Suspense>
            </SmoothTransition>
            <Footer />
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}