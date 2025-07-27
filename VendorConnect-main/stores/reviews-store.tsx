import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Review {
  id: string
  orderId: string
  supplierId: string
  supplierName: string
  customerId: string
  customerName: string
  rating: number
  comment: string
  date: string
  verified: boolean
  helpful: number
  reported: boolean
}

interface ReviewsState {
  reviews: Review[]
  userReviews: Review[] // Reviews by current user
}

interface ReviewsActions {
  addReview: (review: Omit<Review, 'id' | 'date' | 'helpful' | 'reported'>) => void
  updateReview: (reviewId: string, updates: Partial<Review>) => void
  deleteReview: (reviewId: string) => void
  getSupplierReviews: (supplierId: string) => Review[]
  getUserReviews: (customerId: string) => Review[]
  getOrderReview: (orderId: string) => Review | null
  markReviewHelpful: (reviewId: string) => void
  reportReview: (reviewId: string) => void
  getSupplierRating: (supplierId: string) => { averageRating: number; totalReviews: number }
}

type ReviewsStore = ReviewsState & ReviewsActions

export const useReviewsStore = create<ReviewsStore>()(
  persist(
    (set, get) => ({
      // Initial state
      reviews: [],
      userReviews: [],

      // Actions
      addReview: (newReview) => {
        const review: Review = {
          ...newReview,
          id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          date: new Date().toISOString(),
          helpful: 0,
          reported: false,
        }

        set((state) => ({
          reviews: [...state.reviews, review],
          userReviews: [...state.userReviews, review],
        }))
      },

      updateReview: (reviewId, updates) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, ...updates } : review
          ),
          userReviews: state.userReviews.map((review) =>
            review.id === reviewId ? { ...review, ...updates } : review
          ),
        }))
      },

      deleteReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.filter((review) => review.id !== reviewId),
          userReviews: state.userReviews.filter((review) => review.id !== reviewId),
        }))
      },

      getSupplierReviews: (supplierId) => {
        return get().reviews.filter((review) => review.supplierId === supplierId)
      },

      getUserReviews: (customerId) => {
        return get().reviews.filter((review) => review.customerId === customerId)
      },

      getOrderReview: (orderId) => {
        return get().reviews.find((review) => review.orderId === orderId) || null
      },

      markReviewHelpful: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId
              ? { ...review, helpful: review.helpful + 1 }
              : review
          ),
        }))
      },

      reportReview: (reviewId) => {
        set((state) => ({
          reviews: state.reviews.map((review) =>
            review.id === reviewId ? { ...review, reported: true } : review
          ),
        }))
      },

      getSupplierRating: (supplierId) => {
        const supplierReviews = get().reviews.filter(
          (review) => review.supplierId === supplierId && !review.reported
        )
        
        if (supplierReviews.length === 0) {
          return { averageRating: 0, totalReviews: 0 }
        }

        const totalRating = supplierReviews.reduce((sum, review) => sum + review.rating, 0)
        const averageRating = parseFloat((totalRating / supplierReviews.length).toFixed(1))

        return {
          averageRating,
          totalReviews: supplierReviews.length,
        }
      },
    }),
    {
      name: 'marketplace-reviews',
      version: 1,
    }
  )
)
