"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navigation } from "@/components/navigation"
import { useLanguage } from "@/hooks/use-language"
import { useCartStore } from "@/stores/cart-store"
import { SupplierReviews } from "@/components/supplier/supplier-reviews" 
import { 
  ArrowLeft, 
  Star, 
  MapPin, 
  ShoppingCart, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  Truck,
  Shield,
  MessageCircle,
  Heart,
  Share2
} from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  description: string
  price: string
  unit: string
  minOrder: string
  category: string
  images: string[]
  inStock: boolean
  freshness: string
  origin: string
  certifications: string[]
}

interface Supplier {
  id: string
  name: string
  rating: number
  totalReviews: number
  location: string
  joinedDate: string
  verified: boolean
  avatar: string
  description: string
  responseTime: string
  phone: string
  email: string
  products: Product[]
}

interface Review {
  id: string
  customerName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

// Separate component that uses useSearchParams
function ProductDetailsContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { t } = useLanguage()
  const { addToCart, getItemQuantity } = useCartStore()
  
  const supplierId = searchParams.get('supplier')
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState("products")
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    // Demo data - in real app, fetch from API
    const demoSupplier: Supplier = {
      id: supplierId || "fresh-vegetables-co",
      name: "Fresh Vegetables Co.",
      rating: 4.8,
      totalReviews: 127,
      location: "Mumbai, Maharashtra",
      joinedDate: "2022-01-15",
      verified: true,
      avatar: "/supplier-avatar.png?height=100&width=100",
      description: "Premium quality fresh vegetables sourced directly from farms. We ensure the highest standards of quality and freshness.",
      responseTime: "Within 2 hours",
      phone: "+91 98765 43210",
      email: "contact@freshvegetables.com",
      products: [
        {
          id: "1",
          name: "Premium Red Onions",
          description: "Fresh, premium quality red onions sourced from Maharashtra farms. Perfect for cooking and long storage.",
          price: "₹25",
          unit: "per kg",
          minOrder: "10 kg",
          category: "vegetables",
          images: [
            "/onions-1.jpg?height=400&width=600",
            "/onions-2.jpg?height=400&width=600",
            "/onions-3.jpg?height=400&width=600"
          ],
          inStock: true,
          freshness: "Harvested 2 days ago",
          origin: "Nashik, Maharashtra",
          certifications: ["Organic", "Pesticide-free"]
        },
        {
          id: "2",
          name: "Fresh Tomatoes",
          description: "Juicy, ripe tomatoes perfect for cooking and salads. Grown using sustainable farming practices.",
          price: "₹30",
          unit: "per kg",
          minOrder: "5 kg",
          category: "vegetables",
          images: [
            "/tomatoes-1.jpg?height=400&width=600",
            "/tomatoes-2.jpg?height=400&width=600"
          ],
          inStock: true,
          freshness: "Harvested 1 day ago",
          origin: "Pune, Maharashtra",
          certifications: ["Farm Fresh", "Quality Assured"]
        }
      ]
    }

    const demoReviews: Review[] = [
      {
        id: "1",
        customerName: "Rajesh Kumar",
        rating: 5,
        comment: "Excellent quality vegetables. Very fresh and delivered on time.",
        date: "2024-01-15",
        verified: true
      },
      {
        id: "2",
        customerName: "Priya Sharma",
        rating: 4,
        comment: "Good quality but delivery was slightly delayed.",
        date: "2024-01-10",
        verified: true
      }
    ]

    setSupplier(demoSupplier)
    setSelectedProduct(demoSupplier.products[0])
    setReviews(demoReviews)
  }, [supplierId])

  const currentCartQuantity = selectedProduct 
    ? getItemQuantity(selectedProduct.id, supplier?.id || '') 
    : 0

  const handleBack = () => {
    router.back()
  }

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product)
    setCurrentImageIndex(0)
  }

  const handleAddToCart = async () => {
    if (!selectedProduct || !supplier) return

    setIsAddingToCart(true)
    
    try {
      const cartItem = {
        productId: selectedProduct.id,
        productName: selectedProduct.name,
        supplierId: supplier.id,
        supplierName: supplier.name,
        price: parseInt(selectedProduct.price.replace('₹', '')),
        quantity: quantity,
        unit: selectedProduct.unit,
        image: selectedProduct.images[0],
        minOrder: selectedProduct.minOrder,
        inStock: selectedProduct.inStock,
      }

      addToCart(cartItem)
      
      toast.success(
        `${quantity} ${selectedProduct.unit} of ${selectedProduct.name} added to cart!`,
        {
          action: {
            label: "View Cart",
            onClick: () => router.push('/cart'),
          },
        }
      )
      
      setQuantity(1)
    } catch (error) {
      toast.error("Failed to add item to cart. Please try again.")
    } finally {
      setIsAddingToCart(false)
    }
  }

  const handleContactSupplier = () => {
    console.log("Contact supplier")
  }

  if (!supplier || !selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
              <div className="space-y-6">
                <div className="h-32 bg-gray-200 rounded-lg"></div>
                <div className="h-40 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Button
          variant="ghost"
          onClick={handleBack}
          className="mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          {t("back_to_marketplace")}
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Images and Details */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-6">
                {/* Product Images */}
                <div className="mb-6">
                  <div className="aspect-video mb-4 overflow-hidden rounded-lg">
                    <img
                      src={selectedProduct.images[currentImageIndex] || "/placeholder.svg"}
                      alt={selectedProduct.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {selectedProduct.images.length > 1 && (
                    <div className="flex gap-2 overflow-x-auto">
                      {selectedProduct.images.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => setCurrentImageIndex(index)}
                          className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                            index === currentImageIndex ? 'border-green-500' : 'border-gray-200'
                          }`}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${selectedProduct.name} ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h1 className="text-2xl font-bold text-gray-900">{selectedProduct.name}</h1>
                      <p className="text-gray-600 mt-1">{selectedProduct.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsWishlisted(!isWishlisted)}
                      >
                        <Heart className={`h-4 w-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
                      </Button>
                      <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="text-3xl font-bold text-green-600">
                      {selectedProduct.price}
                    </span>
                    <span className="text-gray-500">{selectedProduct.unit}</span>
                    <Badge variant={selectedProduct.inStock ? "default" : "destructive"}>
                      {selectedProduct.inStock ? t("in_stock") : t("out_of_stock")}
                    </Badge>
                  </div>

                  {/* Product Details */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-t border-b">
                    <div>
                      <span className="text-sm text-gray-500">{t("minimum_order")}:</span>
                      <p className="font-medium">{selectedProduct.minOrder}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t("freshness")}:</span>
                      <p className="font-medium">{selectedProduct.freshness}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t("origin")}:</span>
                      <p className="font-medium">{selectedProduct.origin}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-500">{t("category")}:</span>
                      <p className="font-medium capitalize">{selectedProduct.category}</p>
                    </div>
                  </div>

                  {/* Certifications */}
                  <div>
                    <span className="text-sm text-gray-500 block mb-2">{t("certifications")}:</span>
                    <div className="flex flex-wrap gap-2">
                      {selectedProduct.certifications.map((cert, index) => (
                        <Badge key={index} variant="outline" className="text-green-600 border-green-600">
                          <Shield className="h-3 w-3 mr-1" />
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Supplier Info and Actions */}
          <div className="space-y-6">
            {/* Order Card */}
            <Card>
              <CardHeader>
                <CardTitle>{t("place_order")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">{t("quantity")}:</label>
                  <div className="flex items-center gap-2 mt-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      -
                    </Button>
                    <span className="px-4 py-2 border rounded text-center min-w-[60px]">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      +
                    </Button>
                    <span className="text-sm text-gray-500">{selectedProduct.unit}</span>
                  </div>
                  {currentCartQuantity > 0 && (
                    <p className="text-sm text-green-600 mt-1">
                      {currentCartQuantity} {selectedProduct.unit} already in cart
                    </p>
                  )}
                </div>

                <div className="text-lg font-semibold">
                  {t("total")}: ₹{parseInt(selectedProduct.price.replace('₹', '')) * quantity}
                </div>

                <div className="space-y-2">
                  <Button 
                    onClick={handleAddToCart} 
                    className="w-full"
                    disabled={!selectedProduct.inStock || isAddingToCart}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    {isAddingToCart ? t("adding_to_cart") : t("add_to_cart")}
                  </Button>
                  <Button variant="outline" onClick={handleContactSupplier} className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    {t("contact_supplier")}
                  </Button>
                </div>

                <div className="text-xs text-gray-500 space-y-1">
                  <div className="flex items-center">
                    <Truck className="h-3 w-3 mr-1" />
                    {t("free_delivery_above")} ₹500
                  </div>
                  <div className="flex items-center">
                    <Package className="h-3 w-3 mr-1" />
                    {t("delivery_in")} 1-2 {t("days")}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={supplier.avatar} alt={supplier.name} />
                    <AvatarFallback>{supplier.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{supplier.name}</CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{supplier.rating}</span>
                      <span className="text-sm text-gray-500">({supplier.totalReviews} {t("reviews")})</span>
                    </div>
                  </div>
                  {supplier.verified && (
                    <Badge className="ml-auto bg-green-600">{t("verified")}</Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-gray-600">{supplier.description}</p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                    {t("member_since")} {new Date(supplier.joinedDate).getFullYear()}
                  </div>
                  <div className="flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-gray-400" />
                    {t("response_time")}: {supplier.responseTime}
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Phone className="h-4 w-4 mr-2" />
                    {t("call")}
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("email")}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Tabs Section */}
        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products">{t("all_products")}</TabsTrigger>
              <TabsTrigger value="reviews">{t("reviews")}</TabsTrigger>
              <TabsTrigger value="about">{t("about_supplier")}</TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {supplier.products.map((product) => (
                  <Card
                    key={product.id}
                    className={`cursor-pointer transition-all ${
                      selectedProduct.id === product.id ? 'ring-2 ring-green-500' : 'hover:shadow-lg'
                    }`}
                    onClick={() => handleProductSelect(product)}
                  >
                    <div className="aspect-video relative overflow-hidden rounded-t-lg">
                      <img
                        src={product.images[0] || "/placeholder.svg"}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <Badge variant="destructive">{t("out_of_stock")}</Badge>
                        </div>
                      )}
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-green-600">
                          {product.price} {product.unit}
                        </span>
                        <Button size="sm" disabled={!product.inStock}>
                          {t("select")}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            {/* Updated Reviews Tab - Replace the existing reviews TabsContent with this */}
            <TabsContent value="reviews" className="mt-6">
              <SupplierReviews 
                supplierId={supplier.id}
                supplierName={supplier.name}
              />
            </TabsContent>

            <TabsContent value="about" className="mt-6">
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">{t("about")} {supplier.name}</h3>
                      <p className="text-gray-600">{supplier.description}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium mb-2">{t("contact_information")}</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center">
                            <Phone className="h-4 w-4 mr-2 text-gray-400" />
                            {supplier.phone}
                          </div>
                          <div className="flex items-center">
                            <Mail className="h-4 w-4 mr-2 text-gray-400" />
                            {supplier.email}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                            {supplier.location}
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h4 className="font-medium mb-2">{t("business_details")}</h4>
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="text-gray-500">{t("member_since")}:</span>
                            <span className="ml-2">{new Date(supplier.joinedDate).toLocaleDateString()}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{t("total_products")}:</span>
                            <span className="ml-2">{supplier.products.length}</span>
                          </div>
                          <div>
                            <span className="text-gray-500">{t("response_time")}:</span>
                            <span className="ml-2">{supplier.responseTime}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

// Loading fallback component
function ProductDetailsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-32 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="h-96 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="space-y-6">
              <div className="h-32 bg-gray-200 rounded-lg"></div>
              <div className="h-40 bg-gray-200 rounded-lg"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Main component that wraps with Suspense
export function ProductDetailsPage() {
  return (
    <Suspense fallback={<ProductDetailsLoading />}>
      <ProductDetailsContent />
    </Suspense>
  )
}
