"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useReviewsStore } from "@/stores/reviews-store"
import { useLanguage } from "@/hooks/use-language"
import { Star, ThumbsUp, Flag, MoreHorizontal } from "lucide-react"
import { toast } from "sonner"

interface SupplierReviewsProps {
  supplierId: string
  supplierName: string
  showAddReview?: boolean
}

export function SupplierReviews({ supplierId, supplierName, showAddReview = false }: SupplierReviewsProps) {
  const { t } = useLanguage()
  const { 
    getSupplierReviews, 
    getSupplierRating, 
    markReviewHelpful, 
    reportReview 
  } = useReviewsStore()
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'highest' | 'lowest'>('newest')

  const reviews = getSupplierReviews(supplierId)
  const { averageRating, totalReviews } = getSupplierRating(supplierId)

  const sortedReviews = [...reviews].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      case 'oldest':
        return new Date(a.date).getTime() - new Date(b.date).getTime()
      case 'highest':
        return b.rating - a.rating
      case 'lowest':
        return a.rating - b.rating
      default:
        return 0
    }
  })

  const handleMarkHelpful = (reviewId: string) => {
    markReviewHelpful(reviewId)
    toast.success(t("marked_as_helpful"))
  }

  const handleReportReview = (reviewId: string) => {
    if (window.confirm(t("confirm_report_review"))) {
      reportReview(reviewId)
      toast.success(t("review_reported"))
    }
  }

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++
    })
    return distribution
  }

  const ratingDistribution = getRatingDistribution()

  if (reviews.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {t("no_reviews_yet")}
          </h3>
          <p className="text-gray-600">
            {t("be_first_to_review")} {supplierName}
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gray-900 mb-2">
                {averageRating.toFixed(1)}
              </div>
              <div className="flex items-center justify-center mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= Math.round(averageRating)
                        ? 'fill-yellow-400 text-yellow-400'
                        : 'text-gray-300'
                    }`}
                  />
                ))}
              </div>
              <p className="text-sm text-gray-600">
                {totalReviews} {totalReviews === 1 ? t("review") : t("reviews")}
              </p>
            </div>
            
            <div className="space-y-2">
              {[5, 4, 3, 2, 1].map((rating) => (
                <div key={rating} className="flex items-center gap-2">
                  <span className="text-sm font-medium w-8">{rating}</span>
                  <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-yellow-400 h-2 rounded-full"
                      style={{
                        width: `${totalReviews > 0 ? (ratingDistribution[rating as keyof typeof ratingDistribution] / totalReviews) * 100 : 0}%`
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 w-8">
                    {ratingDistribution[rating as keyof typeof ratingDistribution]}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Sort Options */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{t("customer_reviews")}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">{t("sort_by")}:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
            className="text-sm border border-gray-300 rounded px-2 py-1"
          >
            <option value="newest">{t("newest_first")}</option>
            <option value="oldest">{t("oldest_first")}</option>
            <option value="highest">{t("highest_rating")}</option>
            <option value="lowest">{t("lowest_rating")}</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {sortedReviews.map((review) => (
          <Card key={review.id} className={review.reported ? "opacity-50" : ""}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={`/avatars/${review.customerId}.png`} />
                    <AvatarFallback>
                      {review.customerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{review.customerName}</h4>
                      {review.verified && (
                        <Badge variant="outline" className="text-xs text-green-600 border-green-200">
                          {t("verified_purchase")}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`h-4 w-4 ${
                              star <= review.rating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(review.date).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleReportReview(review.id)}
                  disabled={review.reported}
                >
                  <Flag className="h-4 w-4" />
                </Button>
              </div>

              {review.comment && (
                <p className="text-gray-700 mb-4">{review.comment}</p>
              )}

              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleMarkHelpful(review.id)}
                  className="text-gray-600 hover:text-gray-900"
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  {t("helpful")} ({review.helpful})
                </Button>
                
                {review.reported && (
                  <Badge variant="destructive" className="text-xs">
                    {t("reported")}
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
