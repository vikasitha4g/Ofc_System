"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"

export default function ItemSummary() {
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [isClient, setIsClient] = useState(false)
  const [totalCost, setTotalCost] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  // Add months dropdown to Item Summary form
  // Add this near the top of the component:
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]

  // Sample data for different months
  const monthlyData = {
    All: [
      { name: "Office Supplies", value: 35000, count: 120 },
      { name: "Electronics", value: 85000, count: 45 },
      { name: "Furniture", value: 62000, count: 30 },
      { name: "Stationery", value: 18000, count: 200 },
    ],
    Jan: [
      { name: "Office Supplies", value: 5000, count: 20 },
      { name: "Electronics", value: 12000, count: 5 },
      { name: "Furniture", value: 8000, count: 3 },
      { name: "Stationery", value: 2000, count: 25 },
    ],
    Feb: [
      { name: "Office Supplies", value: 3000, count: 15 },
      { name: "Electronics", value: 8000, count: 4 },
      { name: "Furniture", value: 5000, count: 2 },
      { name: "Stationery", value: 1500, count: 20 },
    ],
    Mar: [
      { name: "Office Supplies", value: 4000, count: 18 },
      { name: "Electronics", value: 10000, count: 6 },
      { name: "Furniture", value: 7000, count: 4 },
      { name: "Stationery", value: 2500, count: 30 },
    ],
    Apr: [
      { name: "Office Supplies", value: 3500, count: 16 },
      { name: "Electronics", value: 9000, count: 5 },
      { name: "Furniture", value: 6000, count: 3 },
      { name: "Stationery", value: 2200, count: 28 },
    ],
    May: [
      { name: "Office Supplies", value: 4500, count: 19 },
      { name: "Electronics", value: 11000, count: 7 },
      { name: "Furniture", value: 8000, count: 5 },
      { name: "Stationery", value: 2800, count: 32 },
    ],
    Jun: [
      { name: "Office Supplies", value: 5000, count: 22 },
      { name: "Electronics", value: 12000, count: 8 },
      { name: "Furniture", value: 9000, count: 6 },
      { name: "Stationery", value: 3000, count: 35 },
    ],
  }

  // Colors for pie chart
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"]

  useEffect(() => {
    setIsClient(true)
    updateSummaryData(selectedMonth)
  }, [selectedMonth])

  // Update summary data based on selected month
  const updateSummaryData = (month: string) => {
    const data = monthlyData[month as keyof typeof monthlyData] || monthlyData["All"]
    const cost = data.reduce((sum, item) => sum + item.value, 0)
    const items = data.reduce((sum, item) => sum + item.count, 0)

    setTotalCost(cost)
    setTotalItems(items)
  }

  return (
    <div className="p-4 bg-amber-50">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold">Item Summary</h2>
        {/* Then find the dropdown near the top right and update it: */}
        <div className="flex items-center space-x-2">
          <label className="text-sm font-medium">Month:</label>
          <Select value={selectedMonth} onValueChange={setSelectedMonth}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="Select month" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              {months.map((month) => (
                <SelectItem key={month} value={month.substring(0, 3)}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Category Distribution</h3>
            <div className="h-[300px]">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={monthlyData[selectedMonth as keyof typeof monthlyData] || monthlyData["All"]}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {monthlyData[selectedMonth as keyof typeof monthlyData]?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `Rs ${value}`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg"></div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h3 className="text-lg font-medium mb-4">Summary</h3>
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="text-sm text-blue-700 mb-1">Total Cost</div>
                <div className="text-2xl font-bold">Rs {totalCost.toLocaleString()}</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                <div className="text-sm text-green-700 mb-1">Total Items</div>
                <div className="text-2xl font-bold">{totalItems}</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                <div className="text-sm text-purple-700 mb-1">Categories</div>
                <div className="text-2xl font-bold">
                  {(monthlyData[selectedMonth as keyof typeof monthlyData] || monthlyData["All"]).length}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Items Count</TableHead>
                <TableHead className="text-right">Total Cost (Rs)</TableHead>
                <TableHead className="text-right">Average Cost (Rs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(monthlyData[selectedMonth as keyof typeof monthlyData] || monthlyData["All"]).map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell className="text-right">{item.count}</TableCell>
                  <TableCell className="text-right">{item.value.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{Math.round(item.value / item.count).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

