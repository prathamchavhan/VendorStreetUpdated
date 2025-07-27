"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Users, TrendingDown, Shield, Globe, Menu, X } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/hooks/use-language"

export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { t, toggleLanguage, language } = useLanguage()

  const features = [
    {
      icon: ShoppingCart,
      title: t("verified_suppliers"),
      description: t("verified_suppliers_desc"),
    },
    {
      icon: Users,
      title: t("group_buying"),
      description: t("group_buying_desc"),
    },
    {
      icon: TrendingDown,
      title: t("best_prices"),
      description: t("best_prices_desc"),
    },
    {
      icon: Shield,
      title: t("secure_payments"),
      description: t("secure_payments_desc"),
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold text-gray-900">VendorConnect</span>
            </div>

            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" onClick={toggleLanguage} className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "हिंदी" : "English"}
              </Button>
              <Link href="/auth">
                <Button variant="outline">{t("login")}</Button>
              </Link>
              <Link href="/auth">
                <Button>{t("get_started")}</Button>
              </Link>
            </div>

            <div className="md:hidden">
              <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-4 py-2 space-y-2">
              <Button variant="ghost" onClick={toggleLanguage} className="w-full justify-start">
                <Globe className="h-4 w-4 mr-2" />
                {language === "en" ? "हिंदी" : "English"}
              </Button>
              <Link href="/auth" className="block">
                <Button variant="outline" className="w-full bg-transparent">
                  {t("login")}
                </Button>
              </Link>
              <Link href="/auth" className="block">
                <Button className="w-full">{t("get_started")}</Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            {t("for_street_food_vendors")}
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">{t("hero_title")}</h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">{t("hero_description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth">
              <Button size="lg" className="w-full sm:w-auto">
                {t("start_selling")}
              </Button>
            </Link>
            <Link href="/auth">
              <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent">
                {t("become_supplier")}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">{t("why_choose_us")}</h2>
            <p className="text-lg text-gray-600">{t("features_description")}</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="text-center">
                <CardHeader>
                  <feature.icon className="h-12 w-12 text-orange-600 mx-auto mb-4" />
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription>{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-orange-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">{t("ready_to_start")}</h2>
          <p className="text-xl text-orange-100 mb-8">{t("join_thousands")}</p>
          <Link href="/auth">
            <Button size="lg" variant="secondary">
              {t("get_started_free")}
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold">VendorConnect</span>
            </div>
            <p className="text-gray-400">© 2024 VendorConnect. {t("all_rights_reserved")}</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
