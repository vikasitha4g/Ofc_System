"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Printer, Upload } from "lucide-react"

export default function StoreReportsForm() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedMonth, setSelectedMonth] = useState<string>("All")
  const [selectedYear, setSelectedYear] = useState<string>("2023")
  const [showSummary, setShowSummary] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Sample data for officers
  const officers = [
    {
      id: "1",
      idNumber: "EMP001",
      name: "John Smith",
      position: "Administrative Officer",
      department: "Administration",
      photo: null,
      items: [
        { id: "1-1", description: "Office Chair", quantity: 2, cost: 6000, date: "2023-01-15" },
        { id: "1-2", description: "Desk Lamp", quantity: 1, cost: 1200, date: "2023-01-15" },
        { id: "1-3", description: "Whiteboard", quantity: 1, cost: 3500, date: "2023-03-10" },
      ],
    },
    {
      id: "2",
      idNumber: "EMP002",
      name: "Sarah Johnson",
      position: "Finance Officer",
      department: "Account",
      photo: null,
      items: [
        { id: "2-1", description: "Filing Cabinet", quantity: 1, cost: 4500, date: "2023-02-10" },
        { id: "2-2", description: "Calculator", quantity: 2, cost: 1500, date: "2023-04-05" },
      ],
    },
  ]

  // Find officer by ID number
  const foundOfficer = officers.find((officer) => officer.idNumber.toLowerCase() === searchQuery.toLowerCase())

  // Filter items by month and year
  const filteredItems = foundOfficer
    ? foundOfficer.items.filter((item) => {
        if (selectedMonth === "All") return true

        const itemDate = new Date(item.date)
        const itemMonth = itemDate.toLocaleString("default", { month: "long" })
        const itemYear = itemDate.getFullYear().toString()

        return (selectedMonth === "All" || itemMonth === selectedMonth) && itemYear === selectedYear
      })
    : []

  // Calculate totals for summary
  const totalItems = filteredItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCost = filteredItems.reduce((sum, item) => sum + item.cost, 0)

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you would upload the file to a server
      alert(`Photo uploaded: ${file.name}`)
    }
  }

  // Handle print
  const handlePrint = () => {
    window.print()
  }

  // Generate months array
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

  // Generate years array (last 5 years)
  const currentYear = new Date().getFullYear()
  const years = Array.from({ length: 5 }, (_, i) => (currentYear - i).toString())

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Report as Officer</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setShowSummary(!showSummary)} className="bg-purple-600 hover:bg-purple-700">
            {showSummary ? "Hide Summary" : "Report Summary"}
          </Button>
          <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Officer Item Report</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search by ID Number..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-8"
                  />
                </div>
              </div>
              <div className="flex space-x-2">
                <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="All">All Months</SelectItem>
                    {months.map((month) => (
                      <SelectItem key={month} value={month}>
                        {month}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={selectedYear} onValueChange={setSelectedYear}>
                  <SelectTrigger className="w-[100px]">
                    <SelectValue placeholder="Year" />
                  </SelectTrigger>
                  <SelectContent>
                    {years.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {foundOfficer ? (
              <div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex-1">
                      <h3 className="font-medium text-lg mb-2">{foundOfficer.name}</h3>
                      <p className="text-gray-600">ID: {foundOfficer.idNumber}</p>
                      <p className="text-gray-600">Position: {foundOfficer.position}</p>
                      <p className="text-gray-600">Department: {foundOfficer.department}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2 overflow-hidden">
                        {foundOfficer.photo ? (
                          <img
                            src={foundOfficer.photo || "/placeholder.svg"}
                            alt={foundOfficer.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <span className="text-gray-400">No Photo</span>
                        )}
                      </div>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileUpload}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="text-xs"
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Upload Photo
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="font-medium mb-2">
                    Items Obtained ({selectedMonth === "All" ? "All Months" : selectedMonth} {selectedYear})
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-right">Quantity</TableHead>
                        <TableHead className="text-right">Cost (Rs)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredItems.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={4} className="text-center py-4 text-muted-foreground">
                            No items found for this period
                          </TableCell>
                        </TableRow>
                      ) : (
                        filteredItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>{item.date}</TableCell>
                            <TableCell>{item.description}</TableCell>
                            <TableCell className="text-right">{item.quantity}</TableCell>
                            <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                          </TableRow>
                        ))
                      )}
                      {filteredItems.length > 0 && (
                        <TableRow className="font-medium">
                          <TableCell colSpan={2} className="text-right">
                            Total:
                          </TableCell>
                          <TableCell className="text-right">{totalItems}</TableCell>
                          <TableCell className="text-right">Rs {totalCost.toLocaleString()}</TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </div>
            ) : searchQuery ? (
              <div className="text-center py-8 text-muted-foreground">
                No officer found with ID Number: {searchQuery}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">Enter an ID Number to view officer report</div>
            )}
          </CardContent>
        </Card>

        {showSummary && foundOfficer && (
          <Card>
            <CardHeader>
              <CardTitle>Summary Report</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                  <h3 className="font-medium mb-2">Officer Details</h3>
                  <p>
                    <strong>Name:</strong> {foundOfficer.name}
                  </p>
                  <p>
                    <strong>ID Number:</strong> {foundOfficer.idNumber}
                  </p>
                  <p>
                    <strong>Position:</strong> {foundOfficer.position}
                  </p>
                  <p>
                    <strong>Department:</strong> {foundOfficer.department}
                  </p>
                </div>

                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-medium mb-2">Items Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Total Items</p>
                      <p className="text-xl font-bold">{totalItems}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total Cost</p>
                      <p className="text-xl font-bold">Rs {totalCost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handlePrint} className="w-full bg-blue-600 hover:bg-blue-700">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </div>
  )
}

