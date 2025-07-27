// components/create-group-dialog.tsx
"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/hooks/use-language"
import { Plus, Calendar, Users, Target, MapPin, Package } from "lucide-react"

interface CreateGroupDialogProps {
  onCreateGroup: (group: any) => void
}

export function CreateGroupDialog({ onCreateGroup }: CreateGroupDialogProps) {
  const { t } = useLanguage()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    location: "",
    targetAmount: "",
    maxParticipants: "",
    duration: "",
    estimatedSavings: ""
  })

  const categories = [
    { value: "vegetables", label: "Vegetables" },
    { value: "spices", label: "Spices & Seasonings" },
    { value: "oils", label: "Cooking Oils" },
    { value: "grains", label: "Rice & Grains" },
    { value: "dairy", label: "Dairy Products" },
    { value: "pulses", label: "Pulses & Lentils" }
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const newGroup = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      organizer: "You", // This would come from user context
      location: formData.location,
      targetAmount: parseInt(formData.targetAmount),
      currentAmount: 0,
      participants: 1, // Creator is first participant
      maxParticipants: parseInt(formData.maxParticipants),
      timeLeft: `${formData.duration} days`,
      category: formData.category,
      savings: `${formData.estimatedSavings}%`,
      status: "active" as const,
    }

    onCreateGroup(newGroup)
    setOpen(false)
    
    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "",
      location: "",
      targetAmount: "",
      maxParticipants: "",
      duration: "",
      estimatedSavings: ""
    })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          {t("create_group")}
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            {t("create_new_group_buy")}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Package className="h-5 w-5 mr-2" />
              Basic Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">{t("group_title")} *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Bulk Onion Purchase - Andheri"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">{t("category")} *</Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t("description")} *</Label>
              <Textarea
                id="description"
                placeholder="Describe what you're buying, quality, supplier details, etc."
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                rows={3}
                required
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              Location Details
            </h3>
            
            <div className="space-y-2">
              <Label htmlFor="location">{t("pickup_location")} *</Label>
              <Input
                id="location"
                placeholder="e.g., Andheri West, Mumbai"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Group Settings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Group Settings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="targetAmount">{t("target_amount")} (₹) *</Label>
                <Input
                  id="targetAmount"
                  type="number"
                  placeholder="25000"
                  value={formData.targetAmount}
                  onChange={(e) => handleInputChange("targetAmount", e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxParticipants">{t("max_participants")} *</Label>
                <Input
                  id="maxParticipants"
                  type="number"
                  placeholder="20"
                  value={formData.maxParticipants}
                  onChange={(e) => handleInputChange("maxParticipants", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Timing & Savings */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Timing & Expected Savings
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">{t("duration_days")} *</Label>
                <Select value={formData.duration} onValueChange={(value) => handleInputChange("duration", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="3">3 days</SelectItem>
                    <SelectItem value="5">5 days</SelectItem>
                    <SelectItem value="7">1 week</SelectItem>
                    <SelectItem value="14">2 weeks</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimatedSavings">{t("estimated_savings")} (%) *</Label>
                <Input
                  id="estimatedSavings"
                  type="number"
                  placeholder="25"
                  value={formData.estimatedSavings}
                  onChange={(e) => handleInputChange("estimatedSavings", e.target.value)}
                  required
                />
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              {t("cancel")}
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              <Plus className="h-4 w-4 mr-2" />
              {t("create_group")}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

