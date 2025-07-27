"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/hooks/use-language"
import { Package, Truck, CheckCircle, Clock, MapPin, Phone } from "lucide-react"

interface Order {
  id: string
  supplier: string
  items: { name: string; quantity: string; price: number }[]
  totalAmount: number
  status: "pending" | "confirmed" | "in-transit" | "delivered" | "cancelled"
  orderDate: string
  deliveryDate?: string
  trackingId?: string
  supplierContact: string
  deliveryAddress: string
}

export function OrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])

  useEffect(() => {
    // Demo data
    const demoOrders: Order[] = [
      {
        id: "ORD-001",
        supplier: "Fresh Vegetables Co.",
        items: [
          { name: "Onions", quantity: "10 kg", price: 200 },
          { name: "Tomatoes", quantity: "5 kg", price: 150 },
          { name: "Potatoes", quantity: "8 kg", price: 160 },
        ],
        totalAmount: 510,
        status: "delivered",
        orderDate: "2024-01-15",
        deliveryDate: "2024-01-17",
        trackingId: "TRK123456",
        supplierContact: "+91 98765 43210",
        deliveryAddress: "Shop 15, Street Food Market, Andheri West, Mumbai",
      },
      {
        id: "ORD-002",
        supplier: "Spice Masters",
        items: [
          { name: "Turmeric Powder", quantity: "2 kg", price: 180 },
          { name: "Red Chili Powder", quantity: "1 kg", price: 120 },
          { name: "Coriander Powder", quantity: "1.5 kg", price: 90 },
        ],
        totalAmount: 390,
        status: "in-transit",
        orderDate: "2024-01-18",
        deliveryDate: "2024-01-20",
        trackingId: "TRK789012",
        supplierContact: "+91 87654 32109",
        deliveryAddress: "Shop 15, Street Food Market, Andheri West, Mumbai",
      },
      {
        id: "ORD-003",
        supplier: "Oil & More",
        items: [
          { name: "Sunflower Oil", quantity: "5 L", price: 450 },
          { name: "Mustard Oil", quantity: "2 L", price: 280 },
        ],
        totalAmount: 730,
        status: "confirmed",
        orderDate: "2024-01-20",
        deliveryDate: "2024-01-22",
        trackingId: "TRK345678",
        supplierContact: "+91 76543 21098",
        deliveryAddress: "Shop 15, Street Food Market, Andheri West, Mumbai",
      },
      {
        id: "ORD-004",
        supplier: "Grain Suppliers Ltd.",
        items: [
          { name: "Basmati Rice", quantity: "25 kg", price: 1250 },
          { name: "Toor Dal", quantity: "5 kg", price: 400 },
        ],
        totalAmount: 1650,
        status: "pending",
        orderDate: "2024-01-21",
        supplierContact: "+91 65432 10987",
        deliveryAddress: "Shop 15, Street Food Market, Andheri West, Mumbai",
      },
    ]

    setOrders(demoOrders)
  }, [])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "confirmed":
        return <CheckCircle className="h-4 w-4" />
      case "in-transit":
        return <Truck className="h-4 w-4" />
      case "delivered":
        return <Package className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "confirmed":
        return "bg-blue-100 text-blue-800"
      case "in-transit":
        return "bg-purple-100 text-purple-800"
      case "delivered":
        return "bg-green-100 text-green-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const activeOrders = orders.filter((order) => ["pending", "confirmed", "in-transit"].includes(order.status))
  const completedOrders = orders.filter((order) => ["delivered", "cancelled"].includes(order.status))

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("my_orders")}</h1>
          <p className="text-gray-600">{t("orders_subtitle")}</p>
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">
              {t("active_orders")} ({activeOrders.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              {t("completed_orders")} ({completedOrders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            {activeOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {order.id}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{t(order.status)}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {t("ordered_from")} {order.supplier} • {order.orderDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{order.totalAmount}</p>
                      {order.deliveryDate && (
                        <p className="text-sm text-gray-600">
                          {t("delivery")}: {order.deliveryDate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t("items_ordered")}:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600 ml-2">({item.quantity})</span>
                          </div>
                          <span className="font-semibold">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {order.trackingId && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <h4 className="font-semibold text-blue-900 mb-2">{t("tracking_info")}:</h4>
                      <p className="text-blue-800">
                        {t("tracking_id")}: <span className="font-mono">{order.trackingId}</span>
                      </p>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="flex items-start space-x-2">
                      <Phone className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium">{t("supplier_contact")}</p>
                        <p className="text-sm text-gray-600">{order.supplierContact}</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <MapPin className="h-4 w-4 text-gray-400 mt-1" />
                      <div>
                        <p className="text-sm font-medium">{t("delivery_address")}</p>
                        <p className="text-sm text-gray-600">{order.deliveryAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4">
                    {order.status === "pending" && (
                      <Button variant="outline" size="sm">
                        {t("cancel_order")}
                      </Button>
                    )}
                    <Button size="sm">{t("contact_supplier")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {activeOrders.length === 0 && (
              <div className="text-center py-12">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t("no_active_orders")}</p>
                <p className="text-gray-400 mt-2">{t("start_shopping_message")}</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="completed" className="space-y-6">
            {completedOrders.map((order) => (
              <Card key={order.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {order.id}
                        <Badge className={getStatusColor(order.status)}>
                          {getStatusIcon(order.status)}
                          <span className="ml-1">{t(order.status)}</span>
                        </Badge>
                      </CardTitle>
                      <CardDescription>
                        {t("ordered_from")} {order.supplier} • {order.orderDate}
                      </CardDescription>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">₹{order.totalAmount}</p>
                      {order.deliveryDate && (
                        <p className="text-sm text-gray-600">
                          {t("delivered_on")}: {order.deliveryDate}
                        </p>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold mb-2">{t("items_ordered")}:</h4>
                    <div className="space-y-2">
                      {order.items.map((item, index) => (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
                        >
                          <div>
                            <span className="font-medium">{item.name}</span>
                            <span className="text-gray-600 ml-2">({item.quantity})</span>
                          </div>
                          <span className="font-semibold">₹{item.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end space-x-2 pt-4 border-t">
                    <Button variant="outline" size="sm">
                      {t("reorder")}
                    </Button>
                    <Button size="sm">{t("rate_supplier")}</Button>
                  </div>
                </CardContent>
              </Card>
            ))}

            {completedOrders.length === 0 && (
              <div className="text-center py-12">
                <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 text-lg">{t("no_completed_orders")}</p>
                <p className="text-gray-400 mt-2">{t("completed_orders_message")}</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
