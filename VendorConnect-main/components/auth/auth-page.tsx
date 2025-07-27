"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { ShoppingCart, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function AuthPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [userType, setUserType] = useState<"vendor" | "supplier">("vendor")
  const { signIn, signUp } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()

  const handleAuth = async (e: React.FormEvent<HTMLFormElement>, isSignUp: boolean) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      if (isSignUp) {
        const profileData = {
          name: formData.get("name") as string,
          phone: formData.get("phone") as string,
          userType,
          ...(userType === "vendor"
            ? {
                businessName: formData.get("businessName") as string,
                location: formData.get("location") as string,
                foodType: formData.get("foodType") as string,
                dailyRequirements: formData.get("dailyRequirements") as string,
              }
            : {
                companyName: formData.get("companyName") as string,
                businessAddress: formData.get("businessAddress") as string,
                supplierType: formData.get("supplierType") as string,
                description: formData.get("description") as string,
              }),
        }
        await signUp(email, password, profileData)
      } else {
        await signIn(email, password)
      }
      router.push("/dashboard")
    } catch (error) {
      console.error("Auth error:", error)
      // In a real app, show error message to user
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center mb-8">
          <Link href="/" className="flex items-center text-orange-600 hover:text-orange-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back_to_home")}
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <div className="flex items-center justify-center mb-4">
              <ShoppingCart className="h-8 w-8 text-orange-600" />
              <span className="ml-2 text-xl font-bold">VendorConnect</span>
            </div>
            <CardTitle>{t("welcome")}</CardTitle>
            <CardDescription>{t("auth_description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="signin">{t("sign_in")}</TabsTrigger>
                <TabsTrigger value="signup">{t("sign_up")}</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={(e) => handleAuth(e, false)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input id="email" name="email" type="email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">{t("password")}</Label>
                    <Input id="password" name="password" type="password" required />
                  </div>
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? t("signing_in") : t("sign_in")}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>{t("user_type")}</Label>
                    <Select value={userType} onValueChange={(value: "vendor" | "supplier") => setUserType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="vendor">{t("street_food_vendor")}</SelectItem>
                        <SelectItem value="supplier">{t("supplier")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <form onSubmit={(e) => handleAuth(e, true)} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">{t("full_name")}</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">{t("phone")}</Label>
                        <Input id="phone" name="phone" type="tel" required />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">{t("email")}</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">{t("password")}</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>

                    {userType === "vendor" ? (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="businessName">{t("business_name")}</Label>
                          <Input id="businessName" name="businessName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">{t("location")}</Label>
                          <Input id="location" name="location" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="foodType">{t("food_type")}</Label>
                          <Select name="foodType" required>
                            <SelectTrigger>
                              <SelectValue placeholder={t("select_food_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="chaat">{t("chaat")}</SelectItem>
                              <SelectItem value="dosa">{t("dosa")}</SelectItem>
                              <SelectItem value="pav-bhaji">{t("pav_bhaji")}</SelectItem>
                              <SelectItem value="biryani">{t("biryani")}</SelectItem>
                              <SelectItem value="other">{t("other")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dailyRequirements">{t("daily_requirements")}</Label>
                          <Textarea
                            id="dailyRequirements"
                            name="dailyRequirements"
                            placeholder={t("daily_requirements_placeholder")}
                          />
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label htmlFor="companyName">{t("company_name")}</Label>
                          <Input id="companyName" name="companyName" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="businessAddress">{t("business_address")}</Label>
                          <Textarea id="businessAddress" name="businessAddress" required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="supplierType">{t("supplier_type")}</Label>
                          <Select name="supplierType" required>
                            <SelectTrigger>
                              <SelectValue placeholder={t("select_supplier_type")} />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="vegetables">{t("vegetables")}</SelectItem>
                              <SelectItem value="spices">{t("spices")}</SelectItem>
                              <SelectItem value="oils">{t("oils")}</SelectItem>
                              <SelectItem value="grains">{t("grains")}</SelectItem>
                              <SelectItem value="dairy">{t("dairy")}</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="description">{t("business_description")}</Label>
                          <Textarea
                            id="description"
                            name="description"
                            placeholder={t("business_description_placeholder")}
                          />
                        </div>
                      </>
                    )}

                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? t("creating_account") : t("create_account")}
                    </Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
