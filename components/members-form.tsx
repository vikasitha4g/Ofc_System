"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileDown, Printer, Plus, Search, Calendar, Eye, Trash2 } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"

type MemberRequest = {
  id: string
  serialNumber: string
  officerName: string
  position: string
  department: string
  dateRequested: Date
  status: "Pending" | "Approved" | "Issued" | "Rejected"
  items: RequestItem[]
}

type RequestItem = {
  id: string
  serialNumber: string
  description: string
  quantityRequested: number
  quantityIssued: number
  cost: number
}

export default function MembersForm({ onClose }: { onClose: () => void }) {
  const [members, setMembers] = useState<MemberRequest[]>([
    {
      id: "1",
      serialNumber: "001",
      officerName: "John Smith",
      position: "Administrative Officer",
      department: "Administration",
      dateRequested: new Date(2023, 0, 15),
      status: "Issued",
      items: [
        {
          id: "1-1",
          serialNumber: "001-A",
          description: "Office Chair",
          quantityRequested: 2,
          quantityIssued: 2,
          cost: 6000,
        },
        {
          id: "1-2",
          serialNumber: "001-B",
          description: "Desk Lamp",
          quantityRequested: 1,
          quantityIssued: 1,
          cost: 1200,
        },
      ],
    },
    {
      id: "2",
      serialNumber: "002",
      officerName: "Sarah Johnson",
      position: "Finance Officer",
      department: "Account",
      dateRequested: new Date(2023, 1, 10),
      status: "Issued",
      items: [
        {
          id: "2-1",
          serialNumber: "002-A",
          description: "Filing Cabinet",
          quantityRequested: 1,
          quantityIssued: 1,
          cost: 4500,
        },
      ],
    },
    {
      id: "3",
      serialNumber: "003",
      officerName: "Michael Brown",
      position: "IT Specialist",
      department: "Development",
      dateRequested: new Date(2023, 2, 5),
      status: "Pending",
      items: [
        {
          id: "3-1",
          serialNumber: "003-A",
          description: "Laptop",
          quantityRequested: 1,
          quantityIssued: 0,
          cost: 85000,
        },
        {
          id: "3-2",
          serialNumber: "003-B",
          description: "Monitor",
          quantityRequested: 2,
          quantityIssued: 0,
          cost: 12000,
        },
      ],
    },
    {
      id: "4",
      serialNumber: "004",
      officerName: "Emily Davis",
      position: "HR Manager",
      department: "Establishment",
      dateRequested: new Date(2023, 3, 20),
      status: "Approved",
      items: [
        {
          id: "4-1",
          serialNumber: "004-A",
          description: "Whiteboard",
          quantityRequested: 2,
          quantityIssued: 1,
          cost: 3000,
        },
      ],
    },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isSummaryDialogOpen, setIsSummaryDialogOpen] = useState(false)
  const [isOfficerRequestDialogOpen, setIsOfficerRequestDialogOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedRequest, setSelectedRequest] = useState<MemberRequest | null>(null)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)

  const [newRequest, setNewRequest] = useState<Partial<MemberRequest>>({
    serialNumber: "",
    officerName: "",
    position: "",
    department: "",
    dateRequested: new Date(),
    status: "Pending",
    items: [],
  })

  const [newItem, setNewItem] = useState<Partial<RequestItem>>({
    serialNumber: "",
    description: "",
    quantityRequested: 0,
    quantityIssued: 0,
    cost: 0,
  })

  // Filter members based on search query and active tab
  const filteredMembers = members.filter((member) => {
    const matchesSearch =
      member.officerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.department.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === "all") return matchesSearch
    if (activeTab === "pending") return matchesSearch && member.status === "Pending"
    if (activeTab === "approved") return matchesSearch && member.status === "Approved"
    if (activeTab === "issued") return matchesSearch && member.status === "Issued"
    if (activeTab === "rejected") return matchesSearch && member.status === "Rejected"

    return matchesSearch
  })

  // Calculate summary statistics
  const totalRequested = members.reduce(
    (sum, member) => sum + member.items.reduce((itemSum, item) => itemSum + item.quantityRequested, 0),
    0,
  )

  const totalIssued = members.reduce(
    (sum, member) => sum + member.items.reduce((itemSum, item) => itemSum + item.quantityIssued, 0),
    0,
  )

  const totalCost = members.reduce(
    (sum, member) => sum + member.items.reduce((itemSum, item) => itemSum + item.cost, 0),
    0,
  )

  // Group by department for summary
  const departmentSummary = members.reduce(
    (acc, member) => {
      const dept = member.department
      if (!acc[dept]) {
        acc[dept] = {
          requested: 0,
          issued: 0,
          cost: 0,
        }
      }

      member.items.forEach((item) => {
        acc[dept].requested += item.quantityRequested
        acc[dept].issued += item.quantityIssued
        acc[dept].cost += item.cost
      })

      return acc
    },
    {} as Record<string, { requested: number; issued: number; cost: number }>,
  )

  // Add item to request
  const handleAddItem = () => {
    if (!newItem.serialNumber || !newItem.description || !newItem.quantityRequested) {
      alert("Serial number, description and quantity requested are required")
      return
    }

    const item: RequestItem = {
      id: Date.now().toString(),
      serialNumber: newItem.serialNumber || "",
      description: newItem.description || "",
      quantityRequested: newItem.quantityRequested || 0,
      quantityIssued: newItem.quantityIssued || 0,
      cost: newItem.cost || 0,
    }

    setNewRequest({
      ...newRequest,
      items: [...(newRequest.items || []), item],
    })

    // Reset item form
    setNewItem({
      serialNumber: "",
      description: "",
      quantityRequested: 0,
      quantityIssued: 0,
      cost: 0,
    })
  }

  // Remove item from request
  const handleRemoveItem = (itemId: string) => {
    setNewRequest({
      ...newRequest,
      items: (newRequest.items || []).filter((item) => item.id !== itemId),
    })
  }

  // Handle adding a new request
  const handleAddRequest = () => {
    if (!newRequest.officerName || !newRequest.department || !(newRequest.items && newRequest.items.length > 0)) {
      alert("Officer name, department and at least one item are required")
      return
    }

    const request: MemberRequest = {
      id: Date.now().toString(),
      serialNumber: `00${members.length + 1}`,
      officerName: newRequest.officerName || "",
      position: newRequest.position || "",
      department: newRequest.department || "",
      dateRequested: newRequest.dateRequested || new Date(),
      status: newRequest.status || "Pending",
      items: newRequest.items || [],
    }

    setMembers([...members, request])
    setIsAddDialogOpen(false)
    setNewRequest({
      serialNumber: "",
      officerName: "",
      position: "",
      department: "",
      dateRequested: new Date(),
      status: "Pending",
      items: [],
    })
  }

  // View officer request details
  const handleViewRequest = (request: MemberRequest) => {
    setSelectedRequest(request)
    setIsOfficerRequestDialogOpen(true)
  }

  // Delete officer request
  const handleDeleteRequest = () => {
    if (!selectedRequest) return

    setMembers(members.filter((member) => member.id !== selectedRequest.id))
    setIsOfficerRequestDialogOpen(false)
    setSelectedRequest(null)
  }

  // Confirm delete
  const handleConfirmDelete = () => {
    setIsDeleteConfirmOpen(true)
  }

  // Generate PDF for summary
  const generateSummaryPDF = () => {
    // Create a printable div
    const printContent = document.createElement("div")
    printContent.style.width = "100%"
    printContent.style.padding = "20px"

    // Add header
    const header = document.createElement("div")
    header.innerHTML = `
  <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px;">Member Requests Summary</h1>
  <p style="text-align: center; margin-bottom: 20px;">Date: ${format(new Date(), "PPP")}</p>
`
    printContent.appendChild(header)

    // Add summary statistics
    const stats = document.createElement("div")
    stats.style.display = "flex"
    stats.style.justifyContent = "space-between"
    stats.style.marginBottom = "20px"
    stats.innerHTML = `
  <div style="background-color: #e6f7ff; padding: 15px; border-radius: 8px; width: 30%;">
    <h3 style="margin: 0 0 10px 0;">Total Requested</h3>
    <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalRequested}</p>
  </div>
  <div style="background-color: #f6ffed; padding: 15px; border-radius: 8px; width: 30%;">
    <h3 style="margin: 0 0 10px 0;">Total Issued</h3>
    <p style="font-size: 24px; font-weight: bold; margin: 0;">${totalIssued}</p>
  </div>
  <div style="background-color: #fff7e6; padding: 15px; border-radius: 8px; width: 30%;">
    <h3 style="margin: 0 0 10px 0;">Total Cost</h3>
    <p style="font-size: 24px; font-weight: bold; margin: 0;">Rs ${totalCost.toLocaleString()}</p>
  </div>
`
    printContent.appendChild(stats)

    // Add department summary table with adjusted column widths
    const deptSummary = document.createElement("div")
    deptSummary.innerHTML = `
<h2 style="margin: 20px 0;">Department Summary</h2>
<table style="width: 90%; border-collapse: collapse; margin-bottom: 20px; margin-left: auto; margin-right: auto;">
  <thead>
    <tr>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: left; width: 45%;">Department</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 15%;">Requested</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 15%;">Issued</th>
      <th style="border: 1px solid #ddd; padding: 8px; text-align: right; width: 25%;">Cost (Rs)</th>
    </tr>
  </thead>
  <tbody>
    ${Object.entries(departmentSummary)
      .map(
        ([dept, data]) => `
      <tr>
        <td style="border: 1px solid #ddd; padding: 8px;">${dept}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${data.requested}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${data.issued}</td>
        <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${data.cost.toLocaleString()}</td>
      </tr>
    `,
      )
      .join("")}
  </tbody>
</table>
`
    printContent.appendChild(deptSummary)

    // Add detailed table
    const detailedTable = document.createElement("div")
    detailedTable.innerHTML = `
  <h2 style="margin: 20px 0;">Detailed Requests</h2>
  <table style="width: 90%; border-collapse: collapse; margin-bottom: 20px; margin-left: auto; margin-right: auto;">
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Serial No.</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Officer Name</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Department</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Items</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Total Cost (Rs)</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Status</th>
      </tr>
    </thead>
    <tbody>
      ${filteredMembers
        .map(
          (member) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${member.serialNumber}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${member.officerName}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${member.department}</td>
          <td style="border: 1px solid #ddd; padding: 8px;">${member.items.length} items</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">Rs ${member.items.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${member.status}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  </table>
`

    printContent.appendChild(detailedTable)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Member Requests Summary</title>
          <style>
            body { font-family: Arial, sans-serif; }
          </style>
        </head>
        <body>
          ${printContent.outerHTML}
        </body>
      </html>
    `)

      printWindow.document.close()

      // Print
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Member Requests</h1>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Request
          </Button>
          <Button onClick={() => setIsSummaryDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
            <FileDown className="h-4 w-4 mr-2" />
            Summary
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-blue-700 mb-1">Total Requested Items</span>
              <span className="text-2xl font-bold">{totalRequested}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-green-700 mb-1">Total Issued Items</span>
              <span className="text-2xl font-bold">{totalIssued}</span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-amber-50 border-amber-200">
          <CardContent className="p-6">
            <div className="flex flex-col">
              <span className="text-sm text-amber-700 mb-1">Total Cost</span>
              <span className="text-2xl font-bold">Rs {totalCost.toLocaleString()}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Requests</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="issued">Issued</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Serial No.</TableHead>
                    <TableHead>Officer Name</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Department</TableHead>
                    <TableHead>Date Requested</TableHead>
                    <TableHead className="text-center">Items</TableHead>
                    <TableHead className="text-right">Total Cost (Rs)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredMembers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-4 text-muted-foreground">
                        No requests found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredMembers.map((member) => (
                      <TableRow key={member.id}>
                        <TableCell className="font-medium">{member.serialNumber}</TableCell>
                        <TableCell>{member.officerName}</TableCell>
                        <TableCell>{member.position}</TableCell>
                        <TableCell>{member.department}</TableCell>
                        <TableCell>{format(member.dateRequested, "dd MMM yyyy")}</TableCell>
                        <TableCell className="text-center">{member.items.length}</TableCell>
                        <TableCell className="text-right">
                          Rs {member.items.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              member.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : member.status === "Approved"
                                  ? "bg-blue-100 text-blue-800"
                                  : member.status === "Issued"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-red-100 text-red-800"
                            }`}
                          >
                            {member.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-center">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleViewRequest(member)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Request Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Add New Request</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="officerName">Officer Name</Label>
              <Input
                id="officerName"
                value={newRequest.officerName || ""}
                onChange={(e) => setNewRequest({ ...newRequest, officerName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="position">Position</Label>
              <Input
                id="position"
                value={newRequest.position || ""}
                onChange={(e) => setNewRequest({ ...newRequest, position: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="department">Department</Label>
              <Select
                value={newRequest.department || ""}
                onValueChange={(value) => setNewRequest({ ...newRequest, department: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Establishment">Establishment</SelectItem>
                  <SelectItem value="Account">Account</SelectItem>
                  <SelectItem value="Development">Development</SelectItem>
                  <SelectItem value="Land">Land</SelectItem>
                  <SelectItem value="Field Officer's">Field Officer's</SelectItem>
                  <SelectItem value="Social Service">Social Service</SelectItem>
                  <SelectItem value="Grama Niladhari">Grama Niladhari</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dateRequested">Date Requested</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {newRequest.dateRequested ? format(newRequest.dateRequested, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={newRequest.dateRequested}
                    onSelect={(date) => date && setNewRequest({ ...newRequest, dateRequested: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Requested Items</h3>
            </div>

            <div className="border rounded-md p-4">
              <div className="grid grid-cols-5 gap-2 mb-4">
                <div className="space-y-2">
                  <Label htmlFor="serialNumber">Serial Number</Label>
                  <Input
                    id="serialNumber"
                    value={newItem.serialNumber || ""}
                    onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newItem.description || ""}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="quantityRequested">Qty Requested</Label>
                  <Input
                    id="quantityRequested"
                    type="number"
                    value={newItem.quantityRequested || ""}
                    onChange={(e) => setNewItem({ ...newItem, quantityRequested: Number(e.target.value) })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost (Rs)</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="cost"
                      type="number"
                      value={newItem.cost || ""}
                      onChange={(e) => setNewItem({ ...newItem, cost: Number(e.target.value) })}
                    />
                    <Button type="button" onClick={handleAddItem} className="flex-shrink-0">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Serial Number</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-center">Qty Requested</TableHead>
                    <TableHead className="text-center">Qty Issued</TableHead>
                    <TableHead className="text-right">Cost (Rs)</TableHead>
                    <TableHead className="w-[50px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {newRequest.items && newRequest.items.length > 0 ? (
                    newRequest.items.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>{item.serialNumber}</TableCell>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">{item.quantityRequested}</TableCell>
                        <TableCell className="text-center">{item.quantityIssued}</TableCell>
                        <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-red-500"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                        No items added yet
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddRequest}>Add Request</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Summary Dialog */}
      <Dialog open={isSummaryDialogOpen} onOpenChange={setIsSummaryDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Member Requests Summary</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="grid grid-cols-3 gap-4 mb-6">
              <Card className="bg-blue-50 border-blue-200">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-blue-700 mb-1">Total Requested</span>
                    <span className="text-2xl font-bold">{totalRequested}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-green-50 border-green-200">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-green-700 mb-1">Total Issued</span>
                    <span className="text-2xl font-bold">{totalIssued}</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-amber-50 border-amber-200">
                <CardContent className="p-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-amber-700 mb-1">Total Cost</span>
                    <span className="text-2xl font-bold">Rs {totalCost.toLocaleString()}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle>Department Summary</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="max-w-[90%] mx-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Department</TableHead>
                        <TableHead className="text-right">Requested</TableHead>
                        <TableHead className="text-right">Issued</TableHead>
                        <TableHead className="text-right">Cost (Rs)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {Object.entries(departmentSummary).map(([dept, data]) => (
                        <TableRow key={dept}>
                          <TableCell className="font-medium">{dept}</TableCell>
                          <TableCell className="text-right">{data.requested}</TableCell>
                          <TableCell className="text-right">{data.issued}</TableCell>
                          <TableCell className="text-right">Rs {data.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button onClick={generateSummaryPDF} className="bg-purple-600 hover:bg-purple-700">
                <Printer className="h-4 w-4 mr-2" />
                Print Summary
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Officer Request Dialog */}
      <Dialog open={isOfficerRequestDialogOpen} onOpenChange={setIsOfficerRequestDialogOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Officer Request Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="py-4">
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-gray-500">Officer Name</p>
                  <p className="font-medium">{selectedRequest.officerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Position</p>
                  <p className="font-medium">{selectedRequest.position}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Date Requested</p>
                  <p className="font-medium">{format(selectedRequest.dateRequested, "PPP")}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedRequest.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : selectedRequest.status === "Approved"
                          ? "bg-blue-100 text-blue-800"
                          : selectedRequest.status === "Issued"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                    }`}
                  >
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Requested Items</CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Serial Number</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead className="text-center">Qty Requested</TableHead>
                        <TableHead className="text-center">Qty Issued</TableHead>
                        <TableHead className="text-right">Cost (Rs)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedRequest.items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantityRequested}</TableCell>
                          <TableCell className="text-center">{item.quantityIssued}</TableCell>
                          <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                        </TableRow>
                      ))}
                      <TableRow>
                        <TableCell colSpan={4} className="text-right font-bold">
                          Total
                        </TableCell>
                        <TableCell className="text-right font-bold">
                          Rs {selectedRequest.items.reduce((sum, item) => sum + item.cost, 0).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}
          <DialogFooter>
            <Button variant="destructive" onClick={handleConfirmDelete}>
              Delete
            </Button>
            <Button variant="outline" onClick={() => setIsOfficerRequestDialogOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this request? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {selectedRequest && (
              <div className="space-y-2">
                <p>
                  <strong>Serial Number:</strong> {selectedRequest.serialNumber}
                </p>
                <p>
                  <strong>Officer Name:</strong> {selectedRequest.officerName}
                </p>
                <p>
                  <strong>Department:</strong> {selectedRequest.department}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteRequest}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

