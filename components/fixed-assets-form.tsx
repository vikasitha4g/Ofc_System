"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Save, Download, FileText, Edit } from "lucide-react"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

type Asset = {
  id: string
  assetTagId: string
  category: string
  name: string
  quantity: number
  description: string
  otherFacts: string
  dueDate: string
  status: "Active" | "Assigned" | "New-in stock" | "Used-in stock"
}

// Update the Asset Management Dashboard with new functionality
export default function FixedAssetsForm({ onClose }: { onClose: () => void }) {
  const [assets, setAssets] = useState<Asset[]>([
    {
      id: "1",
      assetTagId: "A014",
      category: "Office Furniture",
      name: "Table computer",
      quantity: 5,
      description: "Table computer",
      otherFacts: "Located in main office",
      dueDate: "No due date",
      status: "Assigned",
    },
    {
      id: "2",
      assetTagId: "A015",
      category: "Office Furniture",
      name: "Executive Desk",
      quantity: 2,
      description: "Mahogany executive desk with drawers",
      otherFacts: "Located in manager's office",
      dueDate: "No due date",
      status: "Assigned",
    },
    {
      id: "3",
      assetTagId: "A016",
      category: "Electronics",
      name: "Desktop Computer",
      quantity: 10,
      description: "Dell OptiPlex with i7 processor",
      otherFacts: "Warranty until 2025",
      dueDate: "No due date",
      status: "Active",
    },
    {
      id: "4",
      assetTagId: "A017",
      category: "Electronics",
      name: "Printer",
      quantity: 3,
      description: "HP LaserJet Pro",
      otherFacts: "Networked to all computers",
      dueDate: "No due date",
      status: "New-in stock",
    },
    {
      id: "5",
      assetTagId: "A018",
      category: "Other Items",
      name: "Filing Cabinet",
      quantity: 8,
      description: "Metal 4-drawer filing cabinet",
      otherFacts: "Fire resistant",
      dueDate: "No due date",
      status: "Used-in stock",
    },
  ])

  // Add a new state for search query
  const [searchQuery, setSearchQuery] = useState("")

  // Add a state for filtered assets
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>(assets)

  // Add state for summary dialog
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)

  // Add state for editing mode
  const [isEditing, setIsEditing] = useState(false)
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null)

  const [newAsset, setNewAsset] = useState<Partial<Asset>>({
    assetTagId: "",
    category: "Office Furniture",
    name: "",
    quantity: 1,
    description: "",
    otherFacts: "",
    dueDate: "No due date",
    status: "New-in stock",
  })

  // Calculate summary data
  const officeFurnitureCount = assets
    .filter((asset) => asset.category === "Office Furniture")
    .reduce((sum, asset) => sum + asset.quantity, 0)

  const electronicsCount = assets
    .filter((asset) => asset.category === "Electronics")
    .reduce((sum, asset) => sum + asset.quantity, 0)

  const otherItemsCount = assets
    .filter((asset) => asset.category === "Other Items")
    .reduce((sum, asset) => sum + asset.quantity, 0)

  const totalAssets = officeFurnitureCount + electronicsCount + otherItemsCount

  // Calculate status percentages for pie chart
  const activeCount = assets.filter((asset) => asset.status === "Active").length
  const assignedCount = assets.filter((asset) => asset.status === "Assigned").length
  const newInStockCount = assets.filter((asset) => asset.status === "New-in stock").length
  const usedInStockCount = assets.filter((asset) => asset.status === "Used-in stock").length
  const totalCount = assets.length

  // Data for pie chart
  const chartData = [
    { name: "Active", value: activeCount, percentage: Math.round((activeCount / totalCount) * 100) },
    { name: "Assigned", value: assignedCount, percentage: Math.round((assignedCount / totalCount) * 100) },
    { name: "New-in stock", value: newInStockCount, percentage: Math.round((newInStockCount / totalCount) * 100) },
    { name: "Used-in stock", value: usedInStockCount, percentage: Math.round((usedInStockCount / totalCount) * 100) },
  ]

  // Updated color palette based on the specified colors
  const COLORS = ["#444444", "#774a62", "#39918c", "#e57f84"]

  // Handle save (renamed from save/update)
  const handleSave = () => {
    if (!newAsset.assetTagId || !newAsset.name) {
      alert("Asset Tag ID and name are required")
      return
    }

    const asset: Asset = {
      id: Date.now().toString(),
      assetTagId: newAsset.assetTagId || "",
      category: newAsset.category || "Office Furniture",
      name: newAsset.name || "",
      quantity: newAsset.quantity || 1,
      description: newAsset.description || "",
      otherFacts: newAsset.otherFacts || "",
      dueDate: newAsset.dueDate || "No due date",
      status: newAsset.status || "New-in stock",
    }

    setAssets([...assets, asset])
    setFilteredAssets([...assets, asset])

    // Reset form
    setNewAsset({
      assetTagId: "",
      category: "Office Furniture",
      name: "",
      quantity: 1,
      description: "",
      otherFacts: "",
      dueDate: "No due date",
      status: "New-in stock",
    })
  }

  // Handle update (new function)
  const handleUpdate = () => {
    if (!selectedAssetId) return

    if (!newAsset.assetTagId || !newAsset.name) {
      alert("Asset Tag ID and name are required")
      return
    }

    const updatedAssets = assets.map((asset) =>
      asset.id === selectedAssetId
        ? {
            ...asset,
            assetTagId: newAsset.assetTagId || asset.assetTagId,
            category: newAsset.category || asset.category,
            name: newAsset.name || asset.name,
            quantity: newAsset.quantity || asset.quantity,
            description: newAsset.description || asset.description,
            otherFacts: newAsset.otherFacts || asset.otherFacts,
            status: newAsset.status || asset.status,
          }
        : asset,
    )

    setAssets(updatedAssets)
    setFilteredAssets(updatedAssets)

    // Reset form and editing state
    setNewAsset({
      assetTagId: "",
      category: "Office Furniture",
      name: "",
      quantity: 1,
      description: "",
      otherFacts: "",
      dueDate: "No due date",
      status: "New-in stock",
    })
    setIsEditing(false)
    setSelectedAssetId(null)
  }

  // Update the handleSearch function to filter by item name and populate form
  const handleSearch = () => {
    if (!searchQuery) {
      setFilteredAssets(assets)
      return
    }

    const filtered = assets.filter((asset) => asset.name.toLowerCase().includes(searchQuery.toLowerCase()))
    setFilteredAssets(filtered)

    // If only one asset is found, populate the form for editing
    if (filtered.length === 1) {
      const asset = filtered[0]
      setNewAsset({
        assetTagId: asset.assetTagId,
        category: asset.category,
        name: asset.name,
        quantity: asset.quantity,
        description: asset.description,
        otherFacts: asset.otherFacts,
        dueDate: asset.dueDate,
        status: asset.status,
      })
      setIsEditing(true)
      setSelectedAssetId(asset.id)
    }
  }

  // Add a clear function to reset the filtering
  const handleClearSearch = () => {
    setSearchQuery("")
    setFilteredAssets(assets)
    setIsEditing(false)
    setSelectedAssetId(null)

    // Reset form
    setNewAsset({
      assetTagId: "",
      category: "Office Furniture",
      name: "",
      quantity: 1,
      description: "",
      otherFacts: "",
      dueDate: "No due date",
      status: "New-in stock",
    })
  }

  // Download as PDF with all required information
  const handleDownload = () => {
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text("Asset Details Report", 105, 15, { align: "center" })

    // Add date
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 22, { align: "center" })

    // Create table data with all required fields
    const tableColumn = [
      "Asset Tag ID",
      "Item Name",
      "Quantity",
      "Status",
      "Item Category",
      "Description",
      "Other Facts",
    ]
    const tableRows = filteredAssets.map((asset) => [
      asset.assetTagId,
      asset.name,
      asset.quantity.toString(),
      asset.status,
      asset.category,
      asset.description,
      asset.otherFacts,
    ])

    // Add table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 30,
      theme: "grid",
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [57, 145, 140], textColor: [255, 255, 255] },
    })

    // Save the PDF
    doc.save("Asset_Details_Report.pdf")
  }

  // Implement summary report functionality with dialog
  const handleSummary = () => {
    setIsSummaryDialogOpen(true)
  }

  // Rest of the component...

  return (
    <div className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 text-gray-800">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Asset management dashboard to track system performance</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-gradient-to-br from-[#444444] to-[#313e61] border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{officeFurnitureCount}</div>
              <div className="text-sm text-gray-200">Total Number of Office Furniture</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#774a62] to-[#bf3880] border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{electronicsCount}</div>
              <div className="text-sm text-gray-200">Total Number of Electronics Items</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#39918c] to-[#7954a1] border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{otherItemsCount}</div>
              <div className="text-sm text-gray-200">Total Number of Other Items</div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-[#e57f84] to-[#7954a1] border-none shadow-lg">
          <CardContent className="p-4">
            <div className="flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full w-12 h-12 mx-auto mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{totalAssets}</div>
              <div className="text-sm text-gray-200">Total Assets</div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Asset Form */}
        <Card className="bg-white border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#444444] to-[#313e61] text-white rounded-t-lg">
            <CardTitle>Inventory on status basis</CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name, props) => [`${props.payload.percentage}%`, name]} />
                  <Legend
                    layout="horizontal"
                    verticalAlign="bottom"
                    align="center"
                    formatter={(value, entry, index) => {
                      const { payload } = entry
                      return `${value} ${payload.percentage}%`
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Asset Form */}
        <Card className="bg-white border-none shadow-lg">
          <CardHeader className="bg-gradient-to-r from-[#774a62] to-[#bf3880] text-white rounded-t-lg">
            <CardTitle>Asset details</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-[300px] overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="text-gray-700">Asset tag ID</TableHead>
                    <TableHead className="text-gray-700">Item Name</TableHead>
                    <TableHead className="text-gray-700">Quantity</TableHead>
                    <TableHead className="text-gray-700">Item Category</TableHead>
                    <TableHead className="text-gray-700">Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAssets.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-4 text-gray-500">
                        No assets found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAssets.map((asset) => (
                      <TableRow key={asset.id} className="border-gray-100 hover:bg-gray-50">
                        <TableCell className="font-medium text-gray-800">{asset.assetTagId}</TableCell>
                        <TableCell className="text-gray-600">{asset.name}</TableCell>
                        <TableCell className="text-gray-600">{asset.quantity}</TableCell>
                        <TableCell className="text-gray-600">{asset.category}</TableCell>
                        <TableCell className="text-gray-600">{asset.status}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Asset Form */}
      <Card className="bg-white border-none shadow-lg">
        <CardHeader className="bg-gradient-to-r from-[#39918c] to-[#7954a1] text-white">
          <CardTitle>Add New Asset</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="assetTagId" className="text-gray-700">
                Serial Number
              </Label>
              <Input
                id="assetTagId"
                value={newAsset.assetTagId || ""}
                onChange={(e) => setNewAsset({ ...newAsset, assetTagId: e.target.value })}
                placeholder="Enter asset tag ID"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category" className="text-gray-700">
                Item Category
              </Label>
              <Select
                value={newAsset.category || "Office Furniture"}
                onValueChange={(value) => setNewAsset({ ...newAsset, category: value })}
              >
                <SelectTrigger id="category" className="bg-gray-50 border-gray-300 text-gray-800 focus:ring-[#39918c]">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  <SelectItem value="Office Furniture">Office Furniture</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Other Items">Other Items</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-700">
                Item Name
              </Label>
              <Input
                id="name"
                value={newAsset.name || ""}
                onChange={(e) => setNewAsset({ ...newAsset, name: e.target.value })}
                placeholder="Enter item name"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="quantity" className="text-gray-700">
                Quantity
              </Label>
              <Input
                id="quantity"
                type="number"
                value={newAsset.quantity || ""}
                onChange={(e) => setNewAsset({ ...newAsset, quantity: Number(e.target.value) })}
                placeholder="Enter quantity"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-700">
                Description
              </Label>
              <Input
                id="description"
                value={newAsset.description || ""}
                onChange={(e) => setNewAsset({ ...newAsset, description: e.target.value })}
                placeholder="Enter description"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="otherFacts" className="text-gray-700">
                Other Facts
              </Label>
              <Input
                id="otherFacts"
                value={newAsset.otherFacts || ""}
                onChange={(e) => setNewAsset({ ...newAsset, otherFacts: e.target.value })}
                placeholder="Enter other facts"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-gray-700">
                Status
              </Label>
              <Select
                value={newAsset.status || "New-in stock"}
                onValueChange={(value: any) => setNewAsset({ ...newAsset, status: value })}
              >
                <SelectTrigger id="status" className="bg-gray-50 border-gray-300 text-gray-800 focus:ring-[#39918c]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent className="bg-white text-gray-800">
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Assigned">Assigned</SelectItem>
                  <SelectItem value="New-in stock">New-in stock</SelectItem>
                  <SelectItem value="Used-in stock">Used-in stock</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Search box with new dimensions and clear button */}
          <div className="space-y-2 mb-6">
            <Label htmlFor="searchQuery" className="text-gray-700">
              Item Name
            </Label>
            <div className="flex space-x-2">
              <Input
                id="searchQuery"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter item name to search"
                className="bg-gray-50 border-gray-300 text-gray-800 focus:border-[#39918c] focus:ring-[#39918c]"
                style={{ height: "60px", width: "639px" }}
              />
              <Button onClick={handleSearch} className="bg-[#444444] hover:bg-[#313e61]">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
              <Button onClick={handleClearSearch} className="bg-[#774a62] hover:bg-[#bf3880]">
                Clear
              </Button>
            </div>
          </div>

          <div className="flex justify-between pt-4">
            {isEditing ? (
              <Button onClick={handleUpdate} className="bg-[#39918c] hover:bg-[#7954a1]">
                <Edit className="h-4 w-4 mr-2" />
                Update
              </Button>
            ) : (
              <Button onClick={handleSave} className="bg-[#774a62] hover:bg-[#bf3880]">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            )}
            <Button onClick={handleDownload} className="bg-[#39918c] hover:bg-[#7954a1]">
              <Download className="h-4 w-4 mr-2" />
              Download as PDF
            </Button>
            <Button onClick={handleSummary} className="bg-[#e57f84] hover:bg-[#7954a1]">
              <FileText className="h-4 w-4 mr-2" />
              Summary
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Asset Summary Report</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-bold mb-2">Status Breakdown</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-sm text-gray-600">Active:</p>
                    <p className="font-medium">
                      {assets.filter((a) => a.status === "Active").length} (
                      {Math.round((assets.filter((a) => a.status === "Active").length / assets.length) * 100)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Assigned:</p>
                    <p className="font-medium">
                      {assets.filter((a) => a.status === "Assigned").length} (
                      {Math.round((assets.filter((a) => a.status === "Assigned").length / assets.length) * 100)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">New-in stock:</p>
                    <p className="font-medium">
                      {assets.filter((a) => a.status === "New-in stock").length} (
                      {Math.round((assets.filter((a) => a.status === "New-in stock").length / assets.length) * 100)}%)
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Used-in stock:</p>
                    <p className="font-medium">
                      {assets.filter((a) => a.status === "Used-in stock").length} (
                      {Math.round((assets.filter((a) => a.status === "Used-in stock").length / assets.length) * 100)}%)
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-bold mb-2">Category Breakdown</h3>
                <div className="space-y-2">
                  {Object.entries(
                    assets.reduce(
                      (acc, asset) => {
                        acc[asset.category] = (acc[asset.category] || 0) + 1
                        return acc
                      },
                      {} as Record<string, number>,
                    ),
                  ).map(([category, count]) => (
                    <div key={category} className="flex justify-between">
                      <span>{category}:</span>
                      <span>
                        {count} ({Math.round((count / assets.length) * 100)}%)
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-100 p-4 rounded-md">
                <h3 className="font-bold mb-2">Quantity Summary</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Items:</span>
                    <span>{assets.reduce((sum, asset) => sum + asset.quantity, 0)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average Quantity per Asset:</span>
                    <span>{(assets.reduce((sum, asset) => sum + asset.quantity, 0) / assets.length).toFixed(1)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

