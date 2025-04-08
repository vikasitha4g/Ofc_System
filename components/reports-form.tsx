"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Printer, FileDown } from "lucide-react"

export default function ReportsForm({ onClose }: { onClose: () => void }) {
  const [activeTab, setActiveTab] = useState("inventory")
  const [selectedPeriod, setSelectedPeriod] = useState("This Month")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")

  // Sample data for inventory report
  const inventoryData = [
    {
      id: "1",
      code: "IT001",
      name: "Office Desk",
      category: "Furniture",
      quantity: 15,
      unit: "Pcs",
      unitPrice: 12000,
      totalPrice: 180000,
      status: "In Stock",
    },
    {
      id: "2",
      code: "IT002",
      name: "Office Chair",
      category: "Furniture",
      quantity: 25,
      unit: "Pcs",
      unitPrice: 8000,
      totalPrice: 200000,
      status: "In Stock",
    },
    {
      id: "3",
      code: "IT003",
      name: "Filing Cabinet",
      category: "Furniture",
      quantity: 5,
      unit: "Pcs",
      unitPrice: 15000,
      totalPrice: 75000,
      status: "Low Stock",
    },
    {
      id: "4",
      code: "IT004",
      name: "Printer Paper",
      category: "Stationery",
      quantity: 0,
      unit: "Reams",
      unitPrice: 500,
      totalPrice: 0,
      status: "Out of Stock",
    },
    {
      id: "5",
      code: "IT005",
      name: "Ballpoint Pens",
      category: "Stationery",
      quantity: 150,
      unit: "Box",
      unitPrice: 250,
      totalPrice: 37500,
      status: "In Stock",
    },
  ]

  // Sample data for transactions report
  const transactionsData = [
    {
      id: "1",
      date: "2023-12-15",
      type: "Stock In",
      code: "IT001",
      name: "Office Desk",
      quantity: 5,
      unitPrice: 12000,
      totalPrice: 60000,
      user: "Admin",
    },
    {
      id: "2",
      date: "2023-12-10",
      type: "Stock In",
      code: "IT002",
      name: "Office Chair",
      quantity: 10,
      unitPrice: 8000,
      totalPrice: 80000,
      user: "Admin",
    },
    {
      id: "3",
      date: "2023-12-05",
      type: "Stock Out",
      code: "IT002",
      name: "Office Chair",
      quantity: 2,
      unitPrice: 8000,
      totalPrice: 16000,
      user: "User",
    },
    {
      id: "4",
      date: "2023-11-28",
      type: "Stock In",
      code: "IT003",
      name: "Filing Cabinet",
      quantity: 3,
      unitPrice: 15000,
      totalPrice: 45000,
      user: "Admin",
    },
    {
      id: "5",
      date: "2023-11-20",
      type: "Stock Out",
      code: "IT001",
      name: "Office Desk",
      quantity: 1,
      unitPrice: 12000,
      totalPrice: 12000,
      user: "User",
    },
  ]

  // Sample data for summary report
  const summaryData = {
    totalItems: 195,
    totalCategories: 4,
    totalValue: 492500,
    lowStockItems: 5,
    outOfStockItems: 3,
    topCategories: [
      { name: "Furniture", count: 45, value: 455000 },
      { name: "Stationery", count: 150, value: 37500 },
    ],
  }

  // Filter inventory data based on category
  const filteredInventory =
    selectedCategory === "All Categories"
      ? inventoryData
      : inventoryData.filter((item) => item.category === selectedCategory)

  // Print report
  const handlePrint = () => {
    window.print()
  }

  // Export report as CSV
  const handleExport = () => {
    let csvContent = ""
    let fileName = ""

    if (activeTab === "inventory") {
      // Headers
      csvContent = "Code,Name,Category,Quantity,Unit,Unit Price,Total Price,Status\n"

      // Data
      filteredInventory.forEach((item) => {
        csvContent += `${item.code},${item.name},${item.category},${item.quantity},${item.unit},${item.unitPrice},${item.totalPrice},${item.status}\n`
      })

      fileName = "inventory_report.csv"
    } else if (activeTab === "transactions") {
      // Headers
      csvContent = "Date,Type,Code,Name,Quantity,Unit Price,Total Price,User\n"

      // Data
      transactionsData.forEach((item) => {
        csvContent += `${item.date},${item.type},${item.code},${item.name},${item.quantity},${item.unitPrice},${item.totalPrice},${item.user}\n`
      })

      fileName = "transactions_report.csv"
    } else {
      // Summary report
      csvContent = "Metric,Value\n"
      csvContent += `Total Items,${summaryData.totalItems}\n`
      csvContent += `Total Categories,${summaryData.totalCategories}\n`
      csvContent += `Total Value,${summaryData.totalValue}\n`
      csvContent += `Low Stock Items,${summaryData.lowStockItems}\n`
      csvContent += `Out of Stock Items,${summaryData.outOfStockItems}\n`

      fileName = "summary_report.csv"
    }

    // Create a blob and download
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.setAttribute("href", url)
    link.setAttribute("download", fileName)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Reports Dashboard</h1>
        <div className="flex space-x-2">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleExport} className="bg-green-600 hover:bg-green-700">
            <FileDown className="h-4 w-4 mr-2" />
            Export CSV
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="inventory">Inventory Report</TabsTrigger>
          <TabsTrigger value="transactions">Transactions Report</TabsTrigger>
          <TabsTrigger value="summary">Summary Report</TabsTrigger>
        </TabsList>

        <TabsContent value="inventory" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Inventory Status Report</h2>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                <SelectItem value="Furniture">Furniture</SelectItem>
                <SelectItem value="Stationery">Stationery</SelectItem>
                <SelectItem value="Electronics">Electronics</SelectItem>
                <SelectItem value="Office Supplies">Office Supplies</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-right">Unit Price (Rs)</TableHead>
                    <TableHead className="text-right">Total Price (Rs)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInventory.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>{item.category}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-center">{item.unit}</TableCell>
                      <TableCell className="text-right">{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.totalPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.status === "In Stock"
                              ? "bg-green-100 text-green-800"
                              : item.status === "Low Stock"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                          }`}
                        >
                          {item.status}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="transactions" className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Transactions Report</h2>
            <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Today">Today</SelectItem>
                <SelectItem value="This Week">This Week</SelectItem>
                <SelectItem value="This Month">This Month</SelectItem>
                <SelectItem value="Last Month">Last Month</SelectItem>
                <SelectItem value="Last 3 Months">Last 3 Months</SelectItem>
                <SelectItem value="This Year">This Year</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price (Rs)</TableHead>
                    <TableHead className="text-right">Total Price (Rs)</TableHead>
                    <TableHead>User</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactionsData.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      <TableCell>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            item.type === "Stock In" ? "bg-blue-100 text-blue-800" : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {item.type}
                        </span>
                      </TableCell>
                      <TableCell>{item.code}</TableCell>
                      <TableCell>{item.name}</TableCell>
                      <TableCell className="text-right">{item.quantity}</TableCell>
                      <TableCell className="text-right">{item.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{item.totalPrice.toLocaleString()}</TableCell>
                      <TableCell>{item.user}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="summary" className="space-y-4">
          <h2 className="text-xl font-semibold">Summary Report</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-blue-700">Total Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summaryData.totalItems}</div>
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-green-700">Total Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{summaryData.totalCategories}</div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-purple-700">Total Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">Rs {summaryData.totalValue.toLocaleString()}</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Inventory Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Low Stock Items</span>
                    <span className="text-xl font-bold text-yellow-600">{summaryData.lowStockItems}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b">
                    <span className="text-gray-600">Out of Stock Items</span>
                    <span className="text-xl font-bold text-red-600">{summaryData.outOfStockItems}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Top Categories</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead className="text-right">Items Count</TableHead>
                      <TableHead className="text-right">Total Value (Rs)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {summaryData.topCategories.map((category, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{category.name}</TableCell>
                        <TableCell className="text-right">{category.count}</TableCell>
                        <TableCell className="text-right">{category.value.toLocaleString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

