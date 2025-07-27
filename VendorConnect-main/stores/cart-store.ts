import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  productId: string
  productName: string
  supplierId: string
  supplierName: string
  price: number
  quantity: number
  unit: string
  image: string
  minOrder: string
  inStock: boolean
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
}

interface CartActions {
  addToCart: (item: Omit<CartItem, 'id'>) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  getItemQuantity: (productId: string, supplierId: string) => number
}

type CartStore = CartState & CartActions

const calculateTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalAmount: items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
})

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // Initial state
      items: [],
      totalItems: 0,
      totalAmount: 0,

      // Actions
      addToCart: (newItem) => {
        const { items } = get()
        const existingItemIndex = items.findIndex(
          item => 
            item.productId === newItem.productId && 
            item.supplierId === newItem.supplierId
        )

        let updatedItems: CartItem[]

        if (existingItemIndex > -1) {
          // Update existing item quantity
          updatedItems = items.map((item, index) =>
            index === existingItemIndex
              ? { ...item, quantity: item.quantity + newItem.quantity }
              : item
          )
        } else {
          // Add new item
          const cartItem: CartItem = {
            ...newItem,
            id: `${newItem.productId}-${newItem.supplierId}-${Date.now()}`,
          }
          updatedItems = [...items, cartItem]
        }

        const totals = calculateTotals(updatedItems)
        set({
          items: updatedItems,
          ...totals,
        })
      },

      removeFromCart: (id) => {
        const { items } = get()
        const updatedItems = items.filter(item => item.id !== id)
        const totals = calculateTotals(updatedItems)
        
        set({
          items: updatedItems,
          ...totals,
        })
      },

      updateQuantity: (id, quantity) => {
        const { items } = get()
        
        if (quantity < 1) {
          // Remove item if quantity is less than 1
          get().removeFromCart(id)
          return
        }

        const updatedItems = items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
        const totals = calculateTotals(updatedItems)

        set({
          items: updatedItems,
          ...totals,
        })
      },

      clearCart: () => {
        set({
          items: [],
          totalItems: 0,
          totalAmount: 0,
        })
      },

      getItemQuantity: (productId, supplierId) => {
        const { items } = get()
        const item = items.find(
          item => item.productId === productId && item.supplierId === supplierId
        )
        return item ? item.quantity : 0
      },
    }),
    {
      name: 'marketplace-cart', 
      version: 1, 
    }
  )
)
