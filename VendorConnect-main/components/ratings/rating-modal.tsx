"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useLanguage } from "@/hooks/use-language"
import { useReviewsStore } from "@/stores/reviews-store"
import { useAuth } from "@/hooks/use-auth" // Assuming you have this
import { Star, Send } from "lucide-react"
import { toast } from "sonner"

interface RatingModalProps {
  isOpen: boolean
  onClose: () => void
  supplierName: string
  supplierId: string
  orderId: string
}

export function RatingModal({ isOpen, onClose, supplierName, supplierId, orderId }: RatingModalProps) {
  const { t } = useLanguage()
  const { user, profile } = useAuth()
  const { addReview, getOrderReview } = useReviewsStore()
  const [rating, setRating] = useState(0)
  const [hoveredRating, setHoveredRating] = useState(0)
  const [comment, setComment] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Check if user has already reviewed this order
  const existingReview = getOrderReview(orderId)

  const handleSubmit = async () => {
    if (rating === 0) {
      toast.error(t("please_select_rating"))
      return
    }

    if (!user || !profile) {
      toast.error(t("please_login_to_rate"))
      return
    }

    setIsSubmitting(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const reviewData = {
        orderId,
        supplierId,
        supplierName,
        customerId: "123",
        customerName: profile.name,
        rating,
        comment: comment.trim(),
        verified: true, // Assuming verified since it's from a completed order
      }
      
      addReview(reviewData)
      
      toast.success(t("rating_submitted_successfully"))
      
      // Reset form
      setRating(0)
      setComment("")
      onClose()
    } catch (error) {
      toast.error(t("rating_submission_failed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleStarClick = (starValue: number) => {
    setRating(starValue)
  }

  const handleStarHover = (starValue: number) => {
    setHoveredRating(starValue)
  }

  const handleStarLeave = () => {
    setHoveredRating(0)
  }

  if (existingReview) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("review_already_submitted")}</DialogTitle>
            <DialogDescription>
              {t("you_have_already_reviewed")} {supplierName}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      className={`h-4 w-4 ${
                        star <= existingReview.rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-medium">
                  {existingReview.rating}/5 {t("stars")}
                </span>
              </div>
              {existingReview.comment && (
                <p className="text-sm text-gray-600">{existingReview.comment}</p>
              )}
              <p className="text-xs text-gray-500 mt-2">
                {t("reviewed_on")} {new Date(existingReview.date).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onClose}>{t("close")}</Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("rate_supplier")}</DialogTitle>
          <DialogDescription>
            {t("rate_supplier_description")} {supplierName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Star Rating */}
          <div className="space-y-2">
            <Label>{t("your_rating")}</Label>
            <div className="flex items-center space-x-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleStarClick(star)}
                  onMouseEnter={() => handleStarHover(star)}
                  onMouseLeave={handleStarLeave}
                  className="p-1 hover:scale-110 transition-transform"
                >
                  <Star
                    className={`h-8 w-8 ${
                      star <= (hoveredRating || rating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                </button>
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating > 0 && (
                  <>
                    {rating}/5 {rating === 1 ? t("star") : t("stars")}
                  </>
                )}
              </span>
            </div>
          </div>

          {/* Review Text */}
          <div className="space-y-2">
            <Label htmlFor="comment">{t("your_review")} ({t("optional")})</Label>
            <Textarea
              id="comment"
              placeholder={t("share_your_experience")}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={4}
              maxLength={500}
            />
            <div className="text-xs text-gray-500 text-right">
              {comment.length}/500 {t("characters")}
            </div>
          </div>

          {/* Order Info */}
          <div className="bg-gray-50 p-3 rounded-lg">
            <div className="text-sm">
              <span className="font-medium">{t("order_id")}:</span> {orderId}
            </div>
            <div className="text-sm">
              <span className="font-medium">{t("supplier")}:</span> {supplierName}
            </div>
          </div>
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            {t("cancel")}
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting || rating === 0}>
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                {t("submitting")}
              </>
            ) : (
              <>
                <Send className="h-4 w-4 mr-2" />
                {t("submit_rating")}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
