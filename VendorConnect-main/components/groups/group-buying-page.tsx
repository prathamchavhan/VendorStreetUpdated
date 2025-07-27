// Update your GroupBuyingPage component
"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navigation } from "@/components/navigation"
import { CreateGroupDialog } from "@/components/groups/create-group-dialog"
import { GroupDetailsDialog } from "@/components/groups/group-details-dialog"
import { useLanguage } from "@/hooks/use-language"
import { Users, Clock, TrendingDown, MapPin } from "lucide-react"
import { toast } from "sonner" // Add this for notifications

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

export function GroupBuyingPage() {
  const { t } = useLanguage()
  const [activeGroups, setActiveGroups] = useState<GroupBuy[]>([])
  const [myGroups, setMyGroups] = useState<GroupBuy[]>([])
  const [selectedGroup, setSelectedGroup] = useState<GroupBuy | null>(null)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)
  const [userJoinedGroups, setUserJoinedGroups] = useState<Set<string>>(new Set())

  useEffect(() => {
    // Demo data
    const demoGroups: GroupBuy[] = [
      {
        id: "1",
        title: "Bulk Onion Purchase - Andheri",
        description: "Group buying 500kg onions at wholesale price from trusted supplier. Premium quality onions sourced directly from Maharashtra farms. Perfect for restaurants, hostels, and bulk consumers.",
        organizer: "Raj Kumar",
        location: "Andheri, Mumbai",
        targetAmount: 15000,
        currentAmount: 12000,
        participants: 8,
        maxParticipants: 12,
        timeLeft: "2 days",
        category: "vegetables",
        savings: "25%",
        status: "active",
      },
      {
        id: "2",
        title: "Spice Mix Wholesale Deal",
        description: "Premium spices at 30% discount for bulk order. Includes turmeric, red chili powder, coriander powder, and garam masala. All spices are organic and freshly ground.",
        organizer: "Priya Sharma",
        location: "Karol Bagh, Delhi",
        targetAmount: 25000,
        currentAmount: 18500,
        participants: 15,
        maxParticipants: 20,
        timeLeft: "5 days",
        category: "spices",
        savings: "30%",
        status: "active",
      },
      {
        id: "3",
        title: "Cooking Oil Bulk Order",
        description: "Sunflower oil 15L containers at wholesale rates. Cold-pressed, refined sunflower oil perfect for cooking and frying. Bulk packaging reduces per-unit cost significantly.",
        organizer: "Mohammed Ali",
        location: "Bandra, Mumbai",
        targetAmount: 20000,
        currentAmount: 20000,
        participants: 10,
        maxParticipants: 10,
        timeLeft: "Completed",
        category: "oils",
        savings: "20%",
        status: "completed",
      },
    ]

    setActiveGroups(demoGroups.filter((g) => g.status === "active"))
    setMyGroups(demoGroups.filter((g) => g.organizer === "Raj Kumar" || g.participants > 5))
    
    // Initialize some joined groups for demo
    setUserJoinedGroups(new Set(["3"]))
  }, [])

  const handleCreateGroup = (newGroup: GroupBuy) => {
    setActiveGroups(prev => [newGroup, ...prev])
    setMyGroups(prev => [newGroup, ...prev])
    toast.success("Group created successfully!")
  }

  const handleViewDetails = (group: GroupBuy) => {
    setSelectedGroup(group)
    setIsDetailsDialogOpen(true)
  }

  const handleJoinGroup = (groupId: string) => {
    const groupToJoin = activeGroups.find(g => g.id === groupId)
    if (!groupToJoin) return

    // Update the group in activeGroups
    setActiveGroups(prev => prev.map(group => {
      if (group.id === groupId) {
        return {
          ...group,
          participants: group.participants + 1,
          currentAmount: group.currentAmount + Math.floor(group.targetAmount / group.maxParticipants)
        }
      }
      return group
    }))

    // Add to userJoinedGroups
    setUserJoinedGroups(prev => new Set(prev).add(groupId))

    // Add to myGroups if not already there
    setMyGroups(prev => {
      const exists = prev.some(g => g.id === groupId)
      if (!exists) {
        const updatedGroup = {
          ...groupToJoin,
          participants: groupToJoin.participants + 1,
          currentAmount: groupToJoin.currentAmount + Math.floor(groupToJoin.targetAmount / groupToJoin.maxParticipants)
        }
        return [updatedGroup, ...prev]
      }
      return prev.map(group => {
        if (group.id === groupId) {
          return {
            ...group,
            participants: group.participants + 1,
            currentAmount: group.currentAmount + Math.floor(group.targetAmount / group.maxParticipants)
          }
        }
        return group
      })
    })

    toast.success(`Successfully joined "${groupToJoin.title}"!`)
  }

  const getProgressPercentage = (current: number, target: number) => {
    return Math.min((current / target) * 100, 100)
  }

  const isUserInGroup = (groupId: string) => {
    return userJoinedGroups.has(groupId) || myGroups.some(g => g.id === groupId && g.organizer === "You")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("group_buying")}</h1>
            <p className="text-gray-600">{t("group_buying_subtitle")}</p>
          </div>
          <CreateGroupDialog onCreateGroup={handleCreateGroup} />
        </div>

        <Tabs defaultValue="active" className="space-y-6">
          <TabsList>
            <TabsTrigger value="active">{t("active_groups")}</TabsTrigger>
            <TabsTrigger value="my-groups">{t("my_groups")}</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {activeGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.title}</CardTitle>
                        <CardDescription className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </CardDescription>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          {group.savings} {t("savings")}
                        </Badge>
                        {isUserInGroup(group.id) && (
                          <Badge variant="outline" className="text-xs">
                            ✓ {t("joined")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("progress")}</span>
                        <span>
                          ₹{group.currentAmount.toLocaleString()} / ₹{group.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(group.currentAmount, group.targetAmount)} />
                    </div>

                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Users className="h-4 w-4 text-blue-600" />
                        </div>
                        <p className="text-sm font-medium">
                          {group.participants}/{group.maxParticipants}
                        </p>
                        <p className="text-xs text-gray-500">{t("participants")}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <Clock className="h-4 w-4 text-orange-600" />
                        </div>
                        <p className="text-sm font-medium">{group.timeLeft}</p>
                        <p className="text-xs text-gray-500">{t("time_left")}</p>
                      </div>
                      <div>
                        <div className="flex items-center justify-center mb-1">
                          <TrendingDown className="h-4 w-4 text-green-600" />
                        </div>
                        <p className="text-sm font-medium">{group.savings}</p>
                        <p className="text-xs text-gray-500">{t("discount")}</p>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        {t("organized_by")} <span className="font-medium">{group.organizer}</span>
                      </p>
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleViewDetails(group)}
                        >
                          {t("view_details")}
                        </Button>
                        {!isUserInGroup(group.id) && group.participants < group.maxParticipants && (
                          <Button 
                            size="sm"
                            onClick={() => handleJoinGroup(group.id)}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            {t("join_group")}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="my-groups" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {myGroups.map((group) => (
                <Card key={group.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg mb-2">{group.title}</CardTitle>
                        <CardDescription className="flex items-center mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {group.location}
                        </CardDescription>
                        <p className="text-sm text-gray-600 line-clamp-2">{group.description}</p>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Badge variant={group.status === "completed" ? "default" : "secondary"}>
                          {t(group.status)}
                        </Badge>
                        {group.organizer === "You" && (
                          <Badge variant="outline" className="text-xs">
                            {t("organizer")}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span>{t("progress")}</span>
                        <span>
                          ₹{group.currentAmount.toLocaleString()} / ₹{group.targetAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getProgressPercentage(group.currentAmount, group.targetAmount)} />
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t">
                      <p className="text-sm text-gray-600">
                        {group.participants} {t("participants")} • {group.savings} {t("savings")}
                      </p>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleViewDetails(group)}
                      >
                        {t("view_details")}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Group Details Dialog */}
      <GroupDetailsDialog
        group={selectedGroup}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
        onJoinGroup={handleJoinGroup}
        isUserInGroup={selectedGroup ? isUserInGroup(selectedGroup.id) : false}
      />
    </div>
  )
}
