"use client"

import { createContext, useContext } from "react"

interface UserProfile {
  name: string
  email: string
  phone: string
  userType: "vendor" | "supplier" | "admin"
  businessName?: string
  location?: string
  foodType?: string
  dailyRequirements?: string
  companyName?: string
  businessAddress?: string
  supplierType?: string
  description?: string
  verified?: boolean
  createdAt: string
}

interface User {
  uid: string
  email: string | null
  displayName: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, profileData: Partial<UserProfile>) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Export types and context for the provider
export type { User, UserProfile, AuthContextType }
export { AuthContext }
