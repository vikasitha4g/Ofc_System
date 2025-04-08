"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

type OrderItem = {
  id: string
  name: string
  quantity: number
  cost: number
  date: string
}

export default function OrdersForm({ onClose }: { onClose: () => void }) {
  const [selectedMonth, setSelectedMonth] = useState("All")
  const [isClient, setIsClient] = useState(false)
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [monthlyData, setMonthlyData] = useState<any[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [totalItems, setTotalItems] = useState(0)

  useEffect(() => {
    setIsClient(true)

    // Sample order data
    const sampleOrders: OrderItem[] = [
      { id: "1", name: "Office Desk", quantity: 5, cost: 2500, date: "2023-01-15" },
      { id: "2", name: "Office Chair", quantity: 10, cost: 3500, date: "2023-02-10" },
      { id: "3", name: "Filing Cabinet", quantity: 3, cost: 1800, date: "2023-03-05" },
      { id: "4", name: "Printer", quantity: 2, cost: 4200, date: "2023-04-20" },
      { id: "5", name: "Laptop", quantity: 5, cost: 12500, date: "2023-05-12" },
      { id: "6", name: "Monitor", quantity: 8, cost: 3200, date: "2023-06-18" },
      { id: "7", name: "Keyboard", quantity: 15, cost: 1500, date: "2023-07-22" },
      { id: "8", name: "Mouse", quantity: 15, cost: 750, date: "2023-08-05" },
      { id: "9", name: "Projector", quantity: 1, cost: 5000, date: "2023-09-14" },
      { id: "10", name: "Whiteboard", quantity: 3, cost: 900, date: "2023-10-30" },
      { id: "11", name: "Paper Shredder", quantity: 2, cost: 600, date: "2023-11-08" },
      { id: "12", name: "Office Supplies", quantity: 50, cost: 2500, date: "2023-12-01" },
    ]

    setOrderItems(sampleOrders)

    // Generate monthly chart data
    updateChartData(sampleOrders, "All")
  }, [])

  // Update chart data based on selected month
  useEffect(() => {
    updateChartData(orderItems, selectedMonth)
  }, [selectedMonth, orderItems])

  // Function to update chart data based on selected month
  const updateChartData = (items: OrderItem[], month: string) => {
    let filteredItems = items

    // Filter items by month if not "All"
    if (month !== "All") {
      const monthIndex = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"].indexOf(
        month,
      )
      if (monthIndex !== -1) {
        filteredItems = items.filter((item) => {
          const itemDate = new Date(item.date)
          return itemDate.getMonth() === monthIndex
        })
      }
    }

    // Calculate totals
    const spent = filteredItems.reduce((sum, item) => sum + item.cost, 0)
    const itemCount = filteredItems.reduce((sum, item) => sum + item.quantity, 0)

    setTotalSpent(spent)
    setTotalItems(itemCount)

    // Generate chart data
    if (month === "All") {
      // Group by month for "All" view
      const monthlyChartData = [
        { name: "Jan", amount: 0 },
        { name: "Feb", amount: 0 },
        { name: "Mar", amount: 0 },
        { name: "Apr", amount: 0 },
        { name: "May", amount: 0 },
        { name: "Jun", amount: 0 },
        { name: "Jul", amount: 0 },
        { name: "Aug", amount: 0 },
        { name: "Sep", amount: 0 },
        { name: "Oct", amount: 0 },
        { name: "Nov", amount: 0 },
        { name: "Dec", amount: 0 },
      ]

      // Sum up costs by month
      items.forEach((item) => {
        const date = new Date(item.date)
        const monthIndex = date.getMonth()
        monthlyChartData[monthIndex].amount += item.cost
      })

      setMonthlyData(monthlyChartData)
    } else {
      // For specific month, show weekly breakdown
      const weeklyData = [
        { name: "Week 1", amount: 0 },
        { name: "Week 2", amount: 0 },
        { name: "Week 3", amount: 0 },
        { name: "Week 4", amount: 0 },
      ]

      // Distribute the filtered items into weeks (simplified)
      filteredItems.forEach((item, index) => {
        const weekIndex = index % 4 // Simple distribution for demo
        weeklyData[weekIndex].amount += item.cost
      })

      setMonthlyData(weeklyData)
    }
  }

  // Filter orders by month
  const filteredOrders =
    selectedMonth === "All"
      ? orderItems
      : orderItems.filter((item) => {
          const itemMonth = new Date(item.date).toLocaleString("default", { month: "short" })
          return itemMonth === selectedMonth
        })

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Monthly Orders</h1>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All Months</SelectItem>
            <SelectItem value="Jan">January</SelectItem>
            <SelectItem value="Feb">February</SelectItem>
            <SelectItem value="Mar">March</SelectItem>
            <SelectItem value="Apr">April</SelectItem>
            <SelectItem value="May">May</SelectItem>
            <SelectItem value="Jun">June</SelectItem>
            <SelectItem value="Jul">July</SelectItem>
            <SelectItem value="Aug">August</SelectItem>
            <SelectItem value="Sep">September</SelectItem>
            <SelectItem value="Oct">October</SelectItem>
            <SelectItem value="Nov">November</SelectItem>
            <SelectItem value="Dec">December</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Spent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#189ab4" }}>
              Rs {totalSpent.toLocaleString()}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedMonth === "All" ? "All time" : selectedMonth} purchases
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold" style={{ color: "#868b8e" }}>
              {totalItems}
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {selectedMonth === "All" ? "All time" : selectedMonth} quantity
            </p>
          </CardContent>
        </Card>
      </div>

      {selectedMonth === "All" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Monthly Purchases</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Rs ${value}`, "Amount"]} />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="Amount Spent"
                      fill="#8884d8"
                      animationDuration={1500}
                      animationBegin={300}
                      animationEasing="ease-in-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="md:col-span-1">
            <CardHeader>
              <CardTitle>Orders List</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px] overflow-auto p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Cost (Rs)</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{selectedMonth} Weekly Breakdown</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`Rs ${value}`, "Amount"]} />
                    <Legend />
                    <Bar
                      dataKey="amount"
                      name="Amount Spent"
                      fill="#8884d8"
                      animationDuration={1500}
                      animationBegin={300}
                      animationEasing="ease-in-out"
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="animate-pulse bg-gray-200 w-full h-full rounded-lg"></div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Orders List</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item Name</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Cost (Rs)</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell className="text-right">{item.quantity}</TableCell>
                        <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                        <TableCell>{new Date(item.date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

