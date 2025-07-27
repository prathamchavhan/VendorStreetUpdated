"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { AuthContext, type User, type UserProfile } from "@/hooks/use-auth"

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Initialize auth state from localStorage for demo purposes
    const initializeAuth = async () => {
      try {
        if (typeof window !== "undefined") {
          const storedUser = localStorage.getItem("vendorconnect-user")
          const storedProfile = localStorage.getItem("vendorconnect-profile")

          if (storedUser && storedProfile) {
            setUser(JSON.parse(storedUser))
            setProfile(JSON.parse(storedProfile))
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error)
      } finally {
        setLoading(false)
      }
    }

    // Add a small delay to ensure proper initialization
    const timer = setTimeout(initializeAuth, 100)
    return () => clearTimeout(timer)
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    try {
      // For demo purposes, simulate authentication
      const demoUser: User = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: "Demo User",
      }

      const demoProfile: UserProfile = {
        name: email.includes("admin") ? "Admin User" : email.includes("supplier") ? "Supplier User" : "Vendor User",
        email: email,
        phone: "+91 98765 43210",
        userType: email.includes("admin") ? "admin" : email.includes("supplier") ? "supplier" : "vendor",
        businessName: "Demo Business",
        location: "Mumbai, Maharashtra",
        foodType: "chaat",
        verified: true,
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("vendorconnect-user", JSON.stringify(demoUser))
        localStorage.setItem("vendorconnect-profile", JSON.stringify(demoProfile))
      }

      setUser(demoUser)
      setProfile(demoProfile)
    } catch (error) {
      console.error("Sign in error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, profileData: Partial<UserProfile>) => {
    setLoading(true)
    try {
      const demoUser: User = {
        uid: `user-${Date.now()}`,
        email: email,
        displayName: profileData.name || "New User",
      }

      const userProfile: UserProfile = {
        name: profileData.name || "",
        email: email,
        phone: profileData.phone || "",
        userType: profileData.userType || "vendor",
        ...profileData,
        verified: false,
        createdAt: new Date().toISOString(),
      }

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("vendorconnect-user", JSON.stringify(demoUser))
        localStorage.setItem("vendorconnect-profile", JSON.stringify(userProfile))
      }

      setUser(demoUser)
      setProfile(userProfile)
    } catch (error) {
      console.error("Sign up error:", error)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("vendorconnect-user")
        localStorage.removeItem("vendorconnect-profile")
      }

      setUser(null)
      setProfile(null)
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  const value = {
    user,
    profile,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
