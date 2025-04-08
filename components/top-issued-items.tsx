"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function TopIssuedItems() {
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  // Sample data for different periods
  const periodData = {
    "This Month": [
      { id: 1, name: "Executive Office Desk", quantity: 195, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Storage Cabinet", quantity: 35, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Executive Office Chair", quantity: 344, image: "/placeholder.svg?height=80&width=80" },
    ],
    "Last Month": [
      { id: 1, name: "Filing Cabinet", quantity: 150, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Desk Lamp", quantity: 120, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Whiteboard", quantity: 95, image: "/placeholder.svg?height=80&width=80" },
    ],
    "Last 3 Months": [
      { id: 1, name: "Laptop", quantity: 250, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Monitor", quantity: 180, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Keyboard", quantity: 160, image: "/placeholder.svg?height=80&width=80" },
    ],
    "Last 6 Months": [
      { id: 1, name: "Printer", quantity: 320, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Scanner", quantity: 210, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Projector", quantity: 180, image: "/placeholder.svg?height=80&width=80" },
    ],
    "This Year": [
      { id: 1, name: "Office Chair", quantity: 450, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Office Desk", quantity: 380, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Filing Cabinet", quantity: 320, image: "/placeholder.svg?height=80&width=80" },
    ],
    January: [
      { id: 1, name: "Office Chair", quantity: 45, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Office Desk", quantity: 38, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Filing Cabinet", quantity: 32, image: "/placeholder.svg?height=80&width=80" },
    ],
    February: [
      { id: 1, name: "Laptop", quantity: 25, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Monitor", quantity: 18, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Keyboard", quantity: 16, image: "/placeholder.svg?height=80&width=80" },
    ],
    March: [
      { id: 1, name: "Printer", quantity: 32, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Scanner", quantity: 21, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Projector", quantity: 18, image: "/placeholder.svg?height=80&width=80" },
    ],
    April: [
      { id: 1, name: "Desk Lamp", quantity: 42, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Whiteboard", quantity: 35, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Bookshelf", quantity: 28, image: "/placeholder.svg?height=80&width=80" },
    ],
    May: [
      { id: 1, name: "Conference Table", quantity: 15, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Projector Screen", quantity: 12, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Office Phone", quantity: 30, image: "/placeholder.svg?height=80&width=80" },
    ],
    June: [
      { id: 1, name: "Desk Organizer", quantity: 65, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Paper Shredder", quantity: 18, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Stapler", quantity: 90, image: "/placeholder.svg?height=80&width=80" },
    ],
    July: [
      { id: 1, name: "Printer Paper", quantity: 120, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Ink Cartridges", quantity: 45, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "USB Drives", quantity: 75, image: "/placeholder.svg?height=80&width=80" },
    ],
    August: [
      { id: 1, name: "Notebooks", quantity: 85, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Pens", quantity: 150, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Markers", quantity: 60, image: "/placeholder.svg?height=80&width=80" },
    ],
    September: [
      { id: 1, name: "Desk Chair", quantity: 25, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Standing Desk", quantity: 10, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Monitor Stand", quantity: 35, image: "/placeholder.svg?height=80&width=80" },
    ],
    October: [
      { id: 1, name: "Wireless Mouse", quantity: 55, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Wireless Keyboard", quantity: 48, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Headphones", quantity: 30, image: "/placeholder.svg?height=80&width=80" },
    ],
    November: [
      { id: 1, name: "Desk Lamp", quantity: 40, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "File Folders", quantity: 120, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Binders", quantity: 75, image: "/placeholder.svg?height=80&width=80" },
    ],
    December: [
      { id: 1, name: "Calendar", quantity: 95, image: "/placeholder.svg?height=80&width=80" },
      { id: 2, name: "Planner", quantity: 85, image: "/placeholder.svg?height=80&width=80" },
      { id: 3, name: "Desk Organizer", quantity: 50, image: "/placeholder.svg?height=80&width=80" },
    ],
  }

  // Add state for top items
  const [topItems, setTopItems] = useState(periodData["This Month"])

  // Sample data for statistics based on period
  const statsData = {
    "This Month": {
      lowStockItems: 22,
      allItemGroups: 34,
      allItems: 129,
      activeItemsPercentage: 78,
    },
    "Last Month": {
      lowStockItems: 18,
      allItemGroups: 32,
      allItems: 115,
      activeItemsPercentage: 82,
    },
    "Last 3 Months": {
      lowStockItems: 25,
      allItemGroups: 38,
      allItems: 145,
      activeItemsPercentage: 75,
    },
    "Last 6 Months": {
      lowStockItems: 30,
      allItemGroups: 42,
      allItems: 160,
      activeItemsPercentage: 70,
    },
    "This Year": {
      lowStockItems: 35,
      allItemGroups: 45,
      allItems: 180,
      activeItemsPercentage: 65,
    },
    January: {
      lowStockItems: 15,
      allItemGroups: 28,
      allItems: 95,
      activeItemsPercentage: 80,
    },
    February: {
      lowStockItems: 18,
      allItemGroups: 30,
      allItems: 105,
      activeItemsPercentage: 78,
    },
    March: {
      lowStockItems: 20,
      allItemGroups: 32,
      allItems: 110,
      activeItemsPercentage: 76,
    },
    April: {
      lowStockItems: 22,
      allItemGroups: 33,
      allItems: 115,
      activeItemsPercentage: 74,
    },
    May: {
      lowStockItems: 24,
      allItemGroups: 35,
      allItems: 120,
      activeItemsPercentage: 72,
    },
    June: {
      lowStockItems: 26,
      allItemGroups: 36,
      allItems: 125,
      activeItemsPercentage: 70,
    },
    July: {
      lowStockItems: 28,
      allItemGroups: 38,
      allItems: 130,
      activeItemsPercentage: 68,
    },
    August: {
      lowStockItems: 30,
      allItemGroups: 40,
      allItems: 135,
      activeItemsPercentage: 66,
    },
    September: {
      lowStockItems: 32,
      allItemGroups: 41,
      allItems: 140,
      activeItemsPercentage: 64,
    },
    October: {
      lowStockItems: 33,
      allItemGroups: 42,
      allItems: 145,
      activeItemsPercentage: 62,
    },
    November: {
      lowStockItems: 34,
      allItemGroups: 43,
      allItems: 150,
      activeItemsPercentage: 60,
    },
    December: {
      lowStockItems: 35,
      allItemGroups: 45,
      allItems: 155,
      activeItemsPercentage: 58,
    },
  }

  // State for statistics
  const [stats, setStats] = useState(statsData["This Month"])

  // Colors for top issued items
  const cardColors = ["bg-blue-100 border-blue-200", "bg-green-100 border-green-200", "bg-purple-100 border-purple-200"]

  // Update the period selection handler
  useEffect(() => {
    if (periodData[selectedPeriod]) {
      setTopItems(periodData[selectedPeriod])
      setStats(statsData[selectedPeriod])
    }
  }, [selectedPeriod])

  return (
    <div className="p-4 bg-amber-50">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left side - Statistics */}
        <div className="w-full md:w-1/3 space-y-4">
          <h2 className="text-xl font-semibold">Product Details</h2>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-red-500">Low Stock Items</span>
            <span className="text-xl font-bold">{stats.lowStockItems}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">All Item Groups</span>
            <span className="text-xl font-bold">{stats.allItemGroups}</span>
          </div>

          <div className="flex justify-between items-center py-3 border-b">
            <span className="text-gray-600">All Items</span>
            <span className="text-xl font-bold">{stats.allItems}</span>
          </div>

          <div className="mt-8">
            <h3 className="text-lg font-medium mb-4">Active Items</h3>
            <div className="relative h-40 w-40 mx-auto">
              {isClient ? (
                <>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-xl font-bold">{stats.activeItemsPercentage}%</span>
                  </div>
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#eee"
                      strokeWidth="3"
                    />
                    <path
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="3"
                      strokeDasharray={`${stats.activeItemsPercentage}, 100`}
                    />
                  </svg>
                </>
              ) : (
                <div className="animate-pulse bg-gray-200 w-full h-full rounded-full"></div>
              )}
            </div>
          </div>
        </div>

        {/* Right side - Top Issued Items */}
        <div className="w-full md:w-2/3">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Top Issued Items</h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                <SelectItem value="Last 6 Months">Last 6 Months</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
                <SelectItem value="January">January</SelectItem>
                <SelectItem value="February">February</SelectItem>
                <SelectItem value="March">March</SelectItem>
                <SelectItem value="April">April</SelectItem>
                <SelectItem value="May">May</SelectItem>
                <SelectItem value="June">June</SelectItem>
                <SelectItem value="July">July</SelectItem>
                <SelectItem value="August">August</SelectItem>
                <SelectItem value="September">September</SelectItem>
                <SelectItem value="October">October</SelectItem>
                <SelectItem value="November">November</SelectItem>
                <SelectItem value="December">December</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {topItems.map((item, index) => (
              <Card key={item.id} className={`overflow-hidden ${cardColors[index % cardColors.length]}`}>
                <CardContent className="p-4 flex flex-col items-center">
                  <div className="w-24 h-24 mb-4 border rounded-md flex items-center justify-center">
                    <img src={item.image || "/placeholder.svg"} alt={item.name} className="max-w-full max-h-full" />
                  </div>
                  <h3 className="text-center text-sm font-medium mb-2">{item.name}</h3>
                  <div className="text-2xl font-bold">{item.quantity}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

