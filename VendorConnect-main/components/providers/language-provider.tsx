"use client"

import type React from "react"
import { useState } from "react"
import { LanguageContext, translations } from "@/hooks/use-language"

type Language = "en" | "hi"

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")


  const toggleLanguage = () => {
    setLanguage((prev) => (prev === "en" ? "hi" : "en"))
  }

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  const value = {
    language,
    toggleLanguage,
    t,
  }

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}
