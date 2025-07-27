"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { ShoppingCart, Menu, X, Home, Package, Users, FileText, Settings, LogOut, Globe, Bell } from "lucide-react"
import Link from "next/link"
import { CartIcon } from "@/components/cart/cart-icon"
import { useRouter, usePathname } from "next/navigation"

export function Navigation() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { user, profile, signOut } = useAuth()
  const { t, toggleLanguage, language } = useLanguage()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const navItems = [
    { href: "/dashboard", label: t("dashboard"), icon: Home },
    { href: "/marketplace", label: t("marketplace"), icon: Package },
    { href: "/groups", label: t("group_buying"), icon: Users },
    { href: "/orders", label: t("orders"), icon: FileText },
  ]

  if (profile?.userType === "admin") {
    navItems.push({ href: "/admin", label: t("admin"), icon: Settings })
  }

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center">
            <ShoppingCart className="h-8 w-8 text-orange-600" />
            <span className="ml-2 text-xl font-bold text-gray-900">VendorConnect</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
              >
                <item.icon className="h-4 w-4 mr-2" />
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop Right Side */}
          <div className="hidden md:flex items-center space-x-4">
            <CartIcon />
            
            <Button variant="ghost" size="icon">
              <Bell className="h-4 w-4" />
            </Button>

            <Button variant="ghost" onClick={toggleLanguage} className="flex items-center">
              <Globe className="h-4 w-4 mr-2" />
              {language === "en" ? "हिंदी" : "English"}
            </Button>

            {user && profile && (
              <div className="flex items-center space-x-2">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{profile.name}</p>
                  <p className="text-xs text-gray-500 capitalize">{profile.userType}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={handleSignOut}>
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <CartIcon />
            <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-2 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  pathname === item.href
                    ? "bg-orange-100 text-orange-700"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
              </Link>
            ))}

            <div className="border-t pt-4 mt-4">
              {user && profile && (
                <div className="flex items-center px-3 py-2">
                  <div className="flex-1">
                    <p className="text-base font-medium text-gray-900">{profile.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{profile.userType}</p>
                  </div>
                </div>
              )}

              <Button variant="ghost" onClick={toggleLanguage} className="w-full justify-start px-3 py-2">
                <Globe className="h-5 w-5 mr-3" />
                {language === "en" ? "हिंदी" : "English"}
              </Button>

              {user && (
                <Button
                  variant="ghost"
                  onClick={handleSignOut}
                  className="w-full justify-start px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <LogOut className="h-5 w-5 mr-3" />
                  {t("sign_out")}
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
