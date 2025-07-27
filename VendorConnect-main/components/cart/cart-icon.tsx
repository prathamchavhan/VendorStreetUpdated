"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart } from "lucide-react"
import { useCartStore } from "@/stores/cart-store"
import { useLanguage } from "@/hooks/use-language"

export function CartIcon() {
  const router = useRouter()
  const { totalItems } = useCartStore()
  const { t } = useLanguage()

  const handleCartClick = () => {
    router.push('/cart')
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCartClick}
      className="relative"
    >
      <ShoppingCart className="h-4 w-4" />
      {totalItems > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
        >
          {totalItems > 99 ? '99+' : totalItems}
        </Badge>
      )}
      <span className="ml-2 hidden sm:inline">{t("cart")}</span>
    </Button>
  )
}
