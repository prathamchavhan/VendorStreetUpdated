"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navigation } from "@/components/navigation"
import { useCartStore } from "@/stores/cart-store"
import { useLanguage } from "@/hooks/use-language"
import { 
  ArrowLeft, 
  Plus, 
  Minus, 
  Trash2, 
  ShoppingBag,
  AlertCircle,
  CreditCard,
  Truck,
  Package,
  Calendar
} from "lucide-react"
import { toast } from "sonner"

export function CartPage() {
  const router = useRouter()
  const { t } = useLanguage()
  const { 
    items, 
    totalItems, 
    totalAmount, 
    updateQuantity, 
    removeFromCart, 
    clearCart 
  } = useCartStore()
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false)

  const handleQuantityUpdate = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
    if (newQuantity < 1) {
      toast.success(t("item_removed_from_cart"))
    }
  }

  const handleRemoveItem = (id: string, productName: string) => {
    removeFromCart(id)
    toast.success(`${productName} ${t("removed_from_cart")}`)
  }

  const handleClearCart = () => {
    if (window.confirm(t("confirm_clear_cart"))) {
      clearCart()
      toast.success(t("cart_cleared"))
    }
  }

  const handleCheckout = async () => {
    setIsProcessingCheckout(true)
    
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      toast.success(t("order_placed_successfully"))
      clearCart()
      router.push('/orders')
    } catch (error) {
      toast.error(t("checkout_failed"))
    } finally {
      setIsProcessingCheckout(false)
    }
  }

  // Group items by supplier
  const groupedItems = items.reduce((groups, item) => {
    const key = item.supplierId
    if (!groups[key]) {
      groups[key] = {
        supplierName: item.supplierName,
        items: [],
        subtotal: 0,
        itemCount: 0
      }
    }
    groups[key].items.push(item)
    groups[key].subtotal += item.price * item.quantity
    groups[key].itemCount += item.quantity
    return groups
  }, {} as Record<string, { 
    supplierName: string; 
    items: typeof items; 
    subtotal: number;
    itemCount: number;
  }>)

  // Calculate totals
  const subtotal = totalAmount
  const deliveryFee = subtotal >= 500 ? 0 : 50
  const taxes = Math.round(subtotal * 0.18)
  const finalTotal = subtotal + deliveryFee + taxes

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>

          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">{t("cart_empty")}</h2>
            <p className="text-gray-600 mb-6">{t("cart_empty_description")}</p>
            <Button onClick={() => router.push('/marketplace')}>
              <Package className="h-4 w-4 mr-2" />
              {t("continue_shopping")}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {t("shopping_cart")}
              </h1>
              <p className="text-gray-600">
                {totalItems} {t("items_in_cart")} • {Object.keys(groupedItems).length} {t("suppliers")}
              </p>
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleClearCart}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("clear_cart")}
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {Object.entries(groupedItems).map(([supplierId, group]) => (
              <Card key={supplierId} className="overflow-hidden">
                <CardHeader className="bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-lg flex items-center">
                        <Package className="h-5 w-5 mr-2 text-orange-600" />
                        {group.supplierName}
                      </CardTitle>
                      <CardDescription className="flex items-center gap-4 mt-1">
                        <span>{group.itemCount} {t("items")}</span>
                        <span>•</span>
                        <span className="font-medium text-green-600">₹{group.subtotal}</span>
                      </CardDescription>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <Truck className="h-4 w-4 mr-1" />
                      {group.subtotal >= 500 ? t("free_delivery") : `₹50 ${t("delivery_fee")}`}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {group.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                          <img
                            src={item.image || "/placeholder.svg"}
                            alt={item.productName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 truncate">{item.productName}</h3>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-sm text-gray-500">
                              ₹{item.price} {item.unit}
                            </span>
                            <span className="text-xs text-gray-400">•</span>
                            <span className="text-xs text-gray-500">
                              {t("min_order")}: {item.minOrder}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 mt-1">
                            {item.inStock ? (
                              <Badge variant="outline" className="text-green-600 border-green-200">
                                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                                {t("in_stock")}
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                <AlertCircle className="h-3 w-3 mr-1" />
                                {t("out_of_stock")}
                              </Badge>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity - 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="px-3 py-1 border rounded text-center min-w-[50px] text-sm font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityUpdate(item.id, item.quantity + 1)}
                            className="h-8 w-8 p-0"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                        
                        <div className="text-right min-w-0">
                          <p className="font-semibold text-lg">₹{item.price * item.quantity}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id, item.productName)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 mt-1"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            {t("remove")}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  {t("order_summary")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>{t("subtotal")} ({totalItems} {t("items")}):</span>
                    <span>₹{subtotal}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("delivery_fee")}:</span>
                    <span className={deliveryFee === 0 ? "text-green-600" : ""}>
                      {deliveryFee === 0 ? t("free") : `₹${deliveryFee}`}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("taxes")} (18%):</span>
                    <span>₹{taxes}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-semibold">
                    <span>{t("total")}:</span>
                    <span>₹{finalTotal}</span>
                  </div>
                </div>

                <Button 
                  onClick={handleCheckout} 
                  className="w-full"
                  size="lg"
                  disabled={isProcessingCheckout || items.some(item => !item.inStock)}
                >
                  {isProcessingCheckout ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      {t("processing")}
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4 mr-2" />
                      {t("proceed_to_checkout")}
                    </>
                  )}
                </Button>

                {items.some(item => !item.inStock) && (
                  <p className="text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1" />
                    {t("remove_out_of_stock_items")}
                  </p>
                )}

                <Button 
                  variant="outline" 
                  onClick={() => router.push('/marketplace')}
                  className="w-full"
                >
                  <Package className="h-4 w-4 mr-2" />
                  {t("continue_shopping")}
                </Button>
              </CardContent>
            </Card>

            {/* Delivery Info */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Truck className="h-4 w-4 mr-2 text-green-600" />
                    <span>
                      {deliveryFee === 0 
                        ? t("free_delivery_qualified") 
                        : `${t("free_delivery_above")} ₹500`
                      }
                    </span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                    <span>{t("expected_delivery")}: 2-3 {t("business_days")}</span>
                  </div>
                  <Separator />
                  <div className="flex items-center text-green-600 text-xs">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    {t("secure_checkout_guaranteed")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
