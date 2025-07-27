"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/hooks/use-auth"
import { useLanguage } from "@/hooks/use-language"
import { Navigation } from "@/components/navigation"
import { ShoppingCart, TrendingUp, Users, Package, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export function DashboardPage() {
  const { user, profile, loading } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [stats, setStats] = useState({
    totalOrders: 0,
    activeGroups: 0,
    totalSavings: 0,
    lowStockItems: 0,
  })

  useEffect(() => {
    // Redirect to auth if not logged in
    if (!loading && !user) {
      router.push("/auth")
      return
    }

    // Simulate loading stats
    if (user) {
      const timer = setTimeout(() => {
        setStats({
          totalOrders: 24,
          activeGroups: 3,
          totalSavings: 2500,
          lowStockItems: 5,
        })
      }, 1000)

      return () => clearTimeout(timer)
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user || !profile) {
    return null // Will redirect in useEffect
  }

  const recentOrders = [
    {
      id: "1",
      supplier: "Fresh Vegetables Co.",
      items: "Onions, Tomatoes, Potatoes",
      amount: 450,
      status: "delivered",
    },
    { id: "2", supplier: "Spice Masters", items: "Turmeric, Red Chili, Coriander", amount: 320, status: "in-transit" },
    { id: "3", supplier: "Oil & More", items: "Sunflower Oil, Mustard Oil", amount: 680, status: "pending" },
  ]

  const lowStockAlerts = [
    { item: "Onions", currentStock: "2 kg", reorderLevel: "10 kg" },
    { item: "Tomatoes", currentStock: "1.5 kg", reorderLevel: "8 kg" },
    { item: "Cooking Oil", currentStock: "0.5 L", reorderLevel: "5 L" },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            {t("welcome_back")}, {profile.name}!
          </h1>
          <p className="text-gray-600 mt-2">
            {profile.userType === "vendor" ? t("vendor_dashboard_subtitle") : t("supplier_dashboard_subtitle")}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_orders")}</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalOrders}</div>
              <p className="text-xs text-muted-foreground">+12% {t("from_last_month")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("active_groups")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.activeGroups}</div>
              <p className="text-xs text-muted-foreground">+2 {t("new_this_week")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_savings")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.totalSavings}</div>
              <p className="text-xs text-muted-foreground">+8% {t("from_last_month")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("low_stock_alerts")}</CardTitle>
              <AlertTriangle className="h-4 w-4 text-red-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{stats.lowStockItems}</div>
              <p className="text-xs text-muted-foreground">{t("items_need_reorder")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
            <TabsTrigger value="orders">{t("recent_orders")}</TabsTrigger>
            <TabsTrigger value="alerts">{t("inventory_alerts")}</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("quick_actions")}</CardTitle>
                  <CardDescription>{t("quick_actions_desc")}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/marketplace">
                    <Button className="w-full justify-start">
                      <Package className="mr-2 h-4 w-4" />
                      {t("browse_suppliers")}
                    </Button>
                  </Link>
                  <Link href="/groups">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <Users className="mr-2 h-4 w-4" />
                      {t("join_group_buying")}
                    </Button>
                  </Link>
                  <Link href="/orders">
                    <Button variant="outline" className="w-full justify-start bg-transparent">
                      <ShoppingCart className="mr-2 h-4 w-4" />
                      {t("view_all_orders")}
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("business_insights")}</CardTitle>
                  <CardDescription>{t("business_insights_desc")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("avg_order_value")}</span>
                      <span className="font-semibold">₹425</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("favorite_supplier")}</span>
                      <span className="font-semibold">Fresh Vegetables Co.</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">{t("monthly_spending")}</span>
                      <span className="font-semibold">₹12,500</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("recent_orders")}</CardTitle>
                <CardDescription>{t("recent_orders_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentOrders.map((order) => (
                    <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-semibold">{order.supplier}</h4>
                        <p className="text-sm text-gray-600">{order.items}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">₹{order.amount}</p>
                        <Badge
                          variant={
                            order.status === "delivered"
                              ? "default"
                              : order.status === "in-transit"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {t(order.status)}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="alerts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  {t("low_stock_alerts")}
                </CardTitle>
                <CardDescription>{t("low_stock_desc")}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {lowStockAlerts.map((alert, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50"
                    >
                      <div>
                        <h4 className="font-semibold text-red-900">{alert.item}</h4>
                        <p className="text-sm text-red-700">
                          {t("current")}: {alert.currentStock} | {t("reorder_at")}: {alert.reorderLevel}
                        </p>
                      </div>
                      <Button size="sm" variant="outline">
                        {t("reorder_now")}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
