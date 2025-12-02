"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import { Building2, Car, MessageSquare, Shield, Clock, Phone, Mail, MapPin, CheckCircle, Star, Users, Zap, Globe } from "lucide-react"
import Link from "next/link"
export default function ServicesPage() {
  const services = [
    {
      icon: Building2,
      title: "Register Taxi Company",
      description: "Register Your Taxi Company On The System To Reach More Customers",
      features: ["Display Company Information", "Manage Fleet", "Track Orders", "Revenue Reports"],
      pricing: "From 200,000 VND/Month",
      link: "/listing",
    },
    {
      icon: Car,
      title: "Register Driver",
      description: "Join The Professional Driver Network And Find Job Opportunities",
      features: ["Professional Driver Profile", "Connect With Companies", "Customer Reviews", "24/7 Support"],
      pricing: "150,000 VND/Month",
      link: "/drivers",
    },
    {
      icon: MessageSquare,
      title: "Customer Support",
      description: "Comprehensive Support And Feedback System For All Users",
      features: ["24/7 Support", "Complaint Handling", "Service Consulting", "Quick Response"],
      pricing: "Free",
      link: "/feedback",
    },
  ]
  const benefits = [
    {
      icon: Globe,
      title: "Nationwide Network",
      description: "Connect Nationwide With Thousands Of Taxi Companies And Drivers",
    },
    {
      icon: Shield,
      title: "Absolute Security",
      description: "Information Is Encrypted And Protected According To International Standards",
    },
    {
      icon: Zap,
      title: "Modern Technology",
      description: "Advanced Technology Platform, User-Friendly Interface",
    },
    {
      icon: Users,
      title: "Large Community",
      description: "Over 10,000 Members Currently Using The Service",
    },
  ]
  const stats = [
    { number: "500+", label: "Taxi Companies" },
    { number: "2,000+", label: "Drivers" },
    { number: "50,000+", label: "Customers" },
    { number: "99.9%", label: "Uptime" },
  ]
  const testimonials = [
    {
      name: "Nguyen Van A",
      role: "Director Of Mai Linh Taxi",
      content: "RadioCabs.In Has Helped Us Expand Our Customer Base Significantly. The System Is Easy To Use And Well Supported.",
      rating: 5,
    },
    {
      name: "Tran Thi B",
      role: "Independent Driver",
      content: "I Have Found Many Good Job Opportunities Through This Platform. Very Satisfied With The Service.",
      rating: 5,
    },
    {
      name: "Le Van C",
      role: "Transport Company Owner",
      content: "Effective Advertising Service, Helps Increase Brand Awareness And Attract New Customers.",
      rating: 4,
    },
  ]
  return (
    <div className="min-h-screen bg-black text-yellow-400 bg-gradient-to-br from-yellow-50 via-yellow-100 to-yellow-200 text-gray-900 dark:bg-black dark:text-yellow-400 pageEnter">
      <section className="heroSection py-20 bg-gradient-to-br from-yellow-100 via-yellow-200 to-yellow-300 dark:from-black dark:via-yellow-900/10 dark:to-black relative overflow-hidden fadeInScale">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_60%,rgba(255,193,7,0.1),transparent_50%)]"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 text-black dark:bg-gradient-to-r dark:from-yellow-400 dark:via-yellow-300 dark:to-yellow-500 dark:bg-clip-text dark:text-transparent animate-pulse">
            Services & Information
          </h1>
          <p className="text-xl text-gray-700 dark:text-yellow-200 mb-8 max-w-3xl mx-auto leading-relaxed">
            Discover RadioCabs.In's Comprehensive Services - The Leading Connection Platform In Vietnam's Taxi Industry
          </p>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black slideInRight">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-yellow-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-yellow-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 slideInLeft">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services.map((service, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 shadow-2xl shadow-yellow-500/10 hover:shadow-yellow-500/20 transition-all duration-300"
              >
                <CardHeader>
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                      <service.icon className="w-6 h-6 text-black" />
                    </div>
                    <div>
                      <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400">{service.title}</CardTitle>
                      <Badge className="bg-yellow-500/20 text-gray-900 dark:text-yellow-400 border-yellow-500/30 mt-1">
                        {service.pricing}
                      </Badge>
                    </div>
                  </div>
                  <CardDescription className="text-gray-600 dark:text-yellow-200 text-base">{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-gray-900 dark:text-yellow-400 font-semibold mb-2">Main Features:</h4>
                      <ul className="space-y-2">
                        {service.features.map((feature, idx) => (
                          <li key={idx} className="flex items-center space-x-2 text-gray-600 dark:text-yellow-200">
                            <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Button
                      asChild
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold shadow-lg shadow-yellow-500/25 hover:shadow-yellow-500/40 transition-all duration-300"
                    >
                      <Link href={service.link}>Learn More</Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">Why Choose RadioCabs.In?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <Card
                key={index}
                className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30 text-center"
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-black" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">{benefit.title}</h3>
                  <p className="text-gray-600 dark:text-yellow-200 text-sm">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">What Our Customers Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-1 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < testimonial.rating ? "text-gray-900 dark:text-yellow-400 fill-current" : "text-gray-600 dark:text-yellow-600"}`}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600 dark:text-yellow-200 mb-4 italic">"{testimonial.content}"</p>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">{testimonial.name}</p>
                    <p className="text-gray-700 dark:text-yellow-300 text-sm">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-r from-yellow-900/10 to-black">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center text-gray-900 dark:text-yellow-400 mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Register</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Create An Account And Fill In Required Information</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Verify</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">We Verify Information And Approve</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Activate</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Account Is Activated And Ready To Use</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">4</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-yellow-400 mb-2">Connect</h3>
              <p className="text-gray-600 dark:text-yellow-200 text-sm">Start Connecting And Using Services</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-yellow-400 mb-6">Contact Us</h2>
              <p className="text-gray-600 dark:text-yellow-200 mb-8 text-lg">
                Have Questions Or Need Support? Our Team Of Experts Is Always Ready To Help You 24/7.
              </p>
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Phone className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Hotline</p>
                    <p className="text-gray-600 dark:text-yellow-200">1900-Xxxx (24/7)</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Mail className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Email</p>
                    <p className="text-gray-600 dark:text-yellow-200">support@radiocabs.in</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <MapPin className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Address</p>
                    <p className="text-gray-600 dark:text-yellow-200">123 ABC Street, District 1, HCMC</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-6 h-6 text-black" />
                  </div>
                  <div>
                    <p className="text-gray-900 dark:text-yellow-400 font-semibold">Working Hours</p>
                    <p className="text-gray-600 dark:text-yellow-200">24/7 - Non-Stop Support</p>
                  </div>
                </div>
              </div>
            </div>
            <Card className="bg-gradient-to-br from-yellow-900/20 to-black border-yellow-500/30">
              <CardHeader>
                <CardTitle className="text-2xl text-gray-900 dark:text-yellow-400">Start Today</CardTitle>
                <CardDescription className="text-gray-600 dark:text-yellow-200">Choose A Service That Suits Your Needs</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3"
                >
                  <Link href="/listing">
                    <Building2 className="w-4 h-4 mr-2" />
                    Register Company
                  </Link>
                </Button>
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3"
                >
                  <Link href="/drivers">
                    <Car className="w-4 h-4 mr-2" />
                    Register Driver
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full border-yellow-500/50 text-gray-700 dark:text-yellow-400 hover:bg-yellow-500/10 py-3 bg-transparent"
                >
                  <Link href="/feedback">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Feedback
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}