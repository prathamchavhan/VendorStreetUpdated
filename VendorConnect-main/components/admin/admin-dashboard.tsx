"use client"

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useAuth } from "@/hooks/use-auth"
import { Users, Package, TrendingUp, AlertCircle, CheckCircle, X, Eye } from "lucide-react"

interface PendingSupplier {
  id: string
  name: string
  email: string
  companyName: string
  supplierType: string
  location: string
  registrationDate: string
  documents: string[]
}

interface Order {
  id: string
  vendor: string
  supplier: string
  amount: number
  status: string
  date: string
}

export function AdminDashboard() {
  const { t } = useLanguage()
  const { profile } = useAuth()
  const [pendingSuppliers, setPendingSuppliers] = useState<PendingSupplier[]>([])
  const [recentOrders, setRecentOrders] = useState<Order[]>([])
  const [stats, setStats] = useState({
    totalVendors: 0,
    totalSuppliers: 0,
    pendingVerifications: 0,
    monthlyRevenue: 0,
  })

  useEffect(() => {
    // Demo data
    const demoSuppliers: PendingSupplier[] = [
      {
        id: "1",
        name: "Amit Patel",
        email: "amit@freshveggies.com",
        companyName: "Fresh Vegetables Co.",
        supplierType: "vegetables",
        location: "Mumbai, Maharashtra",
        registrationDate: "2024-01-20",
        documents: ["GST Certificate", "Trade License", "Bank Details"],
      },
      {
        id: "2",
        name: "Sunita Devi",
        email: "sunita@spicemasters.com",
        companyName: "Spice Masters",
        supplierType: "spices",
        location: "Delhi, NCR",
        registrationDate: "2024-01-19",
        documents: ["GST Certificate", "FSSAI License", "Bank Details"],
      },
    ]

    const demoOrders: Order[] = [
      {
        id: "ORD-001",
        vendor: "Raj Kumar",
        supplier: "Fresh Vegetables Co.",
        amount: 510,
        status: "delivered",
        date: "2024-01-21",
      },
      {
        id: "ORD-002",
        vendor: "Priya Sharma",
        supplier: "Spice Masters",
        amount: 390,
        status: "in-transit",
        date: "2024-01-20",
      },
    ]

    setPendingSuppliers(demoSuppliers)
    setRecentOrders(demoOrders)
    setStats({
      totalVendors: 156,
      totalSuppliers: 43,
      pendingVerifications: 8,
      monthlyRevenue: 125000,
    })
  }, [])

  const handleSupplierAction = (supplierId: string, action: "approve" | "reject") => {
    setPendingSuppliers((prev) => prev.filter((s) => s.id !== supplierId))
    // In real app, make API call here
  }

  // Check if user is admin
  if (!profile || profile.userType !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center">{t("access_denied")}</CardTitle>
            <CardDescription className="text-center">{t("admin_access_required")}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("admin_dashboard")}</h1>
          <p className="text-gray-600">{t("admin_dashboard_subtitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_vendors")}</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalVendors}</div>
              <p className="text-xs text-muted-foreground">+12% {t("from_last_month")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("total_suppliers")}</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalSuppliers}</div>
              <p className="text-xs text-muted-foreground">+5% {t("from_last_month")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("pending_verifications")}</CardTitle>
              <AlertCircle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{stats.pendingVerifications}</div>
              <p className="text-xs text-muted-foreground">{t("requires_attention")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{t("monthly_revenue")}</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹{stats.monthlyRevenue.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">+18% {t("from_last_month")}</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="verifications" className="space-y-4">
          <TabsList>
            <TabsTrigger value="verifications">
              {t("pending_verifications")} ({pendingSuppliers.length})
            </TabsTrigger>
            <TabsTrigger value="orders">{t("recent_orders")}</TabsTrigger>
            <TabsTrigger value="analytics">{t("analytics")}</TabsTrigger>
          </TabsList>

          <TabsContent value="verifications" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("supplier_verification_requests")}</CardTitle>
                <CardDescription>{t("review_and_approve_suppliers")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("supplier_name")}</TableHead>
                      <TableHead>{t("company")}</TableHead>
                      <TableHead>{t("type")}</TableHead>
                      <TableHead>{t("location")}</TableHead>
                      <TableHead>{t("registration_date")}</TableHead>
                      <TableHead>{t("actions")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingSuppliers.map((supplier) => (
                      <TableRow key={supplier.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{supplier.name}</p>
                            <p className="text-sm text-gray-600">{supplier.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>{supplier.companyName}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{t(supplier.supplierType)}</Badge>
                        </TableCell>
                        <TableCell>{supplier.location}</TableCell>
                        <TableCell>{supplier.registrationDate}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline">
                              <Eye className="h-4 w-4 mr-1" />
                              {t("review")}
                            </Button>
                            <Button size="sm" onClick={() => handleSupplierAction(supplier.id, "approve")}>
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {t("approve")}
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleSupplierAction(supplier.id, "reject")}
                            >
                              <X className="h-4 w-4 mr-1" />
                              {t("reject")}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>

                {pendingSuppliers.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                    <p className="text-gray-500">{t("no_pending_verifications")}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>{t("recent_orders")}</CardTitle>
                <CardDescription>{t("monitor_platform_activity")}</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("order_id")}</TableHead>
                      <TableHead>{t("vendor")}</TableHead>
                      <TableHead>{t("supplier")}</TableHead>
                      <TableHead>{t("amount")}</TableHead>
                      <TableHead>{t("status")}</TableHead>
                      <TableHead>{t("date")}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">{order.id}</TableCell>
                        <TableCell>{order.vendor}</TableCell>
                        <TableCell>{order.supplier}</TableCell>
                        <TableCell>₹{order.amount}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell>{order.date}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>{t("platform_growth")}</CardTitle>
                  <CardDescription>{t("user_registration_trends")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("new_vendors_this_month")}</span>
                      <span className="font-semibold text-green-600">+23</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t("new_suppliers_this_month")}</span>
                      <span className="font-semibold text-blue-600">+8</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t("total_transactions")}</span>
                      <span className="font-semibold">₹2,45,000</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t("popular_categories")}</CardTitle>
                  <CardDescription>{t("most_ordered_items")}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span>{t("vegetables")}</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t("spices")}</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t("oils")}</span>
                      <span className="font-semibold">15%</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span>{t("grains")}</span>
                      <span className="font-semibold">12%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
