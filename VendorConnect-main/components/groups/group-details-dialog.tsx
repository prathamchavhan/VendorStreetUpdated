
"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useLanguage } from "@/hooks/use-language"
import { 
  Users, 
  Clock, 
  TrendingDown, 
  MapPin, 
  User, 
  Calendar, 
  Target,
  Package,
  Phone,
  Mail
} from "lucide-react"

interface GroupBuy {
  id: string
  title: string
  description: string
  organizer: string
  location: string
  targetAmount: number
  currentAmount: number
  participants: number
  maxParticipants: number
  timeLeft: string
  category: string
  savings: string
  status: "active" | "completed" | "upcoming"
}

interface GroupDetailsDialogProps {
  group: GroupBuy | null
  isOpen: boolean
  onClose: () => void
  onJoinGroup: (groupId: string) => void
  isUserInGroup: boolean
}

export function GroupDetailsDialog({ 
  group, 
  isOpen, 
  onClose, 
  onJoinGroup,
  isUserInGroup 
}: GroupDetailsDialogProps) {
  const { t } = useLanguage()

  if (!group) return null

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const handleJoinGroup = () => {
    onJoinGroup(group.id)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold mb-2">
            {group.title}
          </DialogTitle>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="h-4 w-4" />
            {group.location}
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Status and Savings */}
          <div className="flex justify-between items-center">
            <Badge variant={group.status === "completed" ? "default" : "secondary"}>
              {t(group.status)}
            </Badge>
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              {group.savings} {t("savings")}
            </Badge>
          </div>

          {/* Progress Section */}
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-medium">{t("funding_progress")}</span>
              <span className="font-semibold text-green-600">
                ₹{group.currentAmount.toLocaleString()} / ₹{group.targetAmount.toLocaleString()}
              </span>
            </div>
            <Progress 
              value={getProgressPercentage(group.currentAmount, group.targetAmount)} 
              className="h-3"
            />
            <div className="text-xs text-gray-500 text-center">
              {getProgressPercentage(group.currentAmount, group.targetAmount).toFixed(1)}% completed
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-blue-900">
                {group.participants}/{group.maxParticipants}
              </p>
              <p className="text-xs text-blue-600">{t("participants")}</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-orange-900">{group.timeLeft}</p>
              <p className="text-xs text-orange-600">{t("time_left")}</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <TrendingDown className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <p className="text-lg font-semibold text-green-900">{group.savings}</p>
              <p className="text-xs text-green-600">{t("discount")}</p>
            </div>
          </div>

          <Separator />

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <Package className="h-5 w-5 mr-2" />
              {t("product_details")}
            </h3>
            <p className="text-gray-700 leading-relaxed">{group.description}</p>
          </div>

          <Separator />

          {/* Organizer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center">
              <User className="h-5 w-5 mr-2" />
              {t("organizer_info")}
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <p className="font-medium">{group.organizer}</p>
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                +91 98765 43210
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                organizer@example.com
              </div>
            </div>
          </div>

          <Separator />

          {/* Additional Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Target className="h-4 w-4 mr-2" />
                {t("target_details")}
              </h4>
              <p className="text-sm text-gray-600">
                Minimum order: ₹{(group.targetAmount * 0.8).toLocaleString()}
              </p>
              <p className="text-sm text-gray-600">
                Expected delivery: 2-3 days after completion
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="font-medium flex items-center">
                <Calendar className="h-4 w-4 mr-2" />
                {t("timeline")}
              </h4>
              <p className="text-sm text-gray-600">
                Started: 2 days ago
              </p>
              <p className="text-sm text-gray-600">
                Ends: In {group.timeLeft}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              {t("close")}
            </Button>
            {group.status === "active" && !isUserInGroup && (
              <Button 
                onClick={handleJoinGroup}
                className="bg-green-600 hover:bg-green-700"
                disabled={group.participants >= group.maxParticipants}
              >
                <Users className="h-4 w-4 mr-2" />
                {group.participants >= group.maxParticipants ? t("group_full") : t("join_group")}
              </Button>
            )}
            {isUserInGroup && (
              <Badge variant="secondary" className="px-4 py-2">
                ✓ {t("already_joined")}
              </Badge>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
