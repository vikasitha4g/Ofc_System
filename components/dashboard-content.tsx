"use client"

import { useState } from "react"
import { Search, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import InventoryTable from "@/components/inventory-table"
import StockTransactionForm from "@/components/stock-transaction-form"
import WallClock from "@/components/wall-clock"
import DateDisplay from "@/components/date-display"

export default function DashboardContent() {
  const [activeTab, setActiveTab] = useState("inventory")
  const [filterType, setFilterType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [inventoryData, setInventoryData] = useState({
    outOfStock: 13,
    reOrder: 18,
    currentStock: 969,
    monthlyReceived: 45280,
    stockCost: 142318,
  })

  // Function to refresh data
  const handleRefresh = () => {
    // In a real app, this would fetch fresh data from the server
    // For demo purposes, we'll just reset the filter
    setFilterType("all")
    setSearchQuery("")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-green-50">
      <header className="bg-teal-600 text-white shadow-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="w-48">
              <WallClock />
              <DateDisplay />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-center flex-1">
              Inventory Management System - Galenbindunuwewa DS
            </h1>
            <div className="w-48">{/* Empty div for balance */}</div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <Card className="bg-red-300 border-red-400 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inventoryData.outOfStock}</div>
              <div className="text-sm font-medium">Out of Stock</div>
            </CardContent>
          </Card>

          <Card className="bg-amber-200 border-amber-300 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inventoryData.reOrder}</div>
              <div className="text-sm font-medium">Re-Order</div>
            </CardContent>
          </Card>

          <Card className="bg-indigo-300 border-indigo-400 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inventoryData.currentStock}</div>
              <div className="text-sm font-medium">Current Stock</div>
            </CardContent>
          </Card>

          <Card className="bg-green-300 border-green-400 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inventoryData.monthlyReceived.toLocaleString()}</div>
              <div className="text-sm font-medium">Monthly Received</div>
            </CardContent>
          </Card>

          <Card className="bg-cyan-300 border-cyan-400 shadow-sm">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold">{inventoryData.stockCost.toLocaleString()}</div>
              <div className="text-sm font-medium">Stock Cost</div>
            </CardContent>
          </Card>

          <Card className="bg-yellow-100 border-yellow-200 shadow-sm">
            <CardContent className="p-4 text-center flex flex-col items-center justify-center">
              <div className="text-sm font-medium">Stock IN/OUT</div>
              <Button size="sm" variant="outline" className="mt-1 bg-white" onClick={() => setActiveTab("transaction")}>
                Add Product
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2 w-full">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="transaction">Stock In/Out</TabsTrigger>
          </TabsList>

          <TabsContent value="inventory" className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by product name or code..."
                  className="pl-8 bg-blue-50 border-blue-100 focus:border-blue-200"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <RadioGroup
                defaultValue="all"
                className="flex space-x-2"
                value={filterType}
                onValueChange={setFilterType}
              >
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="all" id="all" />
                  <Label htmlFor="all">All</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="received" id="received" />
                  <Label htmlFor="received">Received</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="issued" id="issued" />
                  <Label htmlFor="issued">Issued</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="reorder" id="reorder" />
                  <Label htmlFor="reorder">Re-Order</Label>
                </div>
                <div className="flex items-center space-x-1">
                  <RadioGroupItem value="outofstock" id="outofstock" />
                  <Label htmlFor="outofstock">Out of Stock</Label>
                </div>
              </RadioGroup>

              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={handleRefresh}>
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Refresh
                </Button>
              </div>
            </div>

            <InventoryTable searchQuery={searchQuery} filterType={filterType} />
          </TabsContent>

          <TabsContent value="transaction">
            <Card>
              <CardContent className="pt-6">
                <StockTransactionForm updateInventoryData={setInventoryData} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}

