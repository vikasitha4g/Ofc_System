"use client"

import { useState, useEffect } from "react"
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
import { Printer, Plus, Search, Trash2 } from "lucide-react"

type ProcurementItem = {
  id: string
  serialNumber: string
  description: string
  price: number
}

export default function ProcurementForm({ onClose }: { onClose: () => void }) {
  const [items, setItems] = useState<ProcurementItem[]>([
    { id: "1", serialNumber: "001", description: "Rice", price: 120 },
    { id: "2", serialNumber: "002", description: "Dhal", price: 180 },
    { id: "3", serialNumber: "003", description: "Sugar", price: 150 },
    { id: "4", serialNumber: "004", description: "Tea", price: 200 },
    { id: "5", serialNumber: "005", description: "Milk", price: 90 },
  ])

  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [deleteSerialNumber, setDeleteSerialNumber] = useState("")
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<ProcurementItem | null>(null)

  const [newItem, setNewItem] = useState<Partial<ProcurementItem>>({
    serialNumber: "",
    description: "",
    price: 0,
  })

  // Load items from localStorage on component mount
  useEffect(() => {
    const savedItems = localStorage.getItem("procurementItems")
    if (savedItems) {
      try {
        setItems(JSON.parse(savedItems))
      } catch (e) {
        console.error("Error parsing saved items:", e)
      }
    }
  }, [])

  // Save items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("procurementItems", JSON.stringify(items))
  }, [items])

  const filteredItems = items.filter(
    (item) =>
      item.serialNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddItem = () => {
    if (!newItem.serialNumber || !newItem.description) {
      alert("Serial number and description are required")
      return
    }

    const item: ProcurementItem = {
      id: Date.now().toString(),
      serialNumber: newItem.serialNumber || "",
      description: newItem.description || "",
      price: newItem.price || 0,
    }

    const updatedItems = [...items, item]
    setItems(updatedItems)
    localStorage.setItem("procurementItems", JSON.stringify(updatedItems))

    setIsAddDialogOpen(false)
    setNewItem({
      serialNumber: "",
      description: "",
      price: 0,
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteSerialNumber) return

    const itemToDelete = items.find((item) => item.serialNumber === deleteSerialNumber)

    if (!itemToDelete) {
      alert("No item found with that serial number")
      return
    }

    setItemToDelete(itemToDelete)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteItem = () => {
    if (!itemToDelete) return

    const updatedItems = items.filter((item) => item.serialNumber !== itemToDelete.serialNumber)

    setItems(updatedItems)
    setDeleteSerialNumber("")
    setIsDeleteConfirmOpen(false)
    setItemToDelete(null)
  }

  const handlePrint = () => {
    // Create a printable div
    const printContent = document.createElement("div")
    printContent.style.width = "100%"
    printContent.style.padding = "20px"

    // Add header
    const header = document.createElement("div")
    header.innerHTML = `
    <h1 style="text-align: center; font-size: 28px; margin-bottom: 20px; text-decoration: underline;">Prices at the Welfare Canteen - ${currentYear}</h1>
  `
    printContent.appendChild(header)

    // Add table
    const table = document.createElement("table")
    table.style.width = "100%"
    table.style.borderCollapse = "collapse"
    table.style.marginBottom = "20px"

    // Add table header
    table.innerHTML = `
    <thead>
      <tr>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Serial Number</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Description</th>
        <th style="border: 1px solid #ddd; padding: 8px; text-align: right;">Price (Rs)</th>
      </tr>
    </thead>
    <tbody>
      ${items
        .map(
          (item) => `
        <tr>
          <td style="border: 1px solid #ddd; padding: 8px;">${item.serialNumber}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: center;">${item.description}</td>
          <td style="border: 1px solid #ddd; padding: 8px; text-align: right;">${item.price.toFixed(2)}</td>
        </tr>
      `,
        )
        .join("")}
    </tbody>
  `
    printContent.appendChild(table)

    // Add footer
    const footer = document.createElement("div")
    footer.innerHTML = `
    <p style="margin-top: 40px;"><strong>Authorized Signature: </strong>________________________</p>
    <p style="margin-top: 10px;"><strong>Date: </strong>________________________</p>
  `
    printContent.appendChild(footer)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
      <html>
        <head>
          <title>Procurement</title>
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

  const currentYear = new Date().getFullYear()

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Welfare</h1>
        <div className="flex space-x-2">
          <Button onClick={() => setIsAddDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Details
          </Button>
          <Button onClick={handlePrint} className="bg-green-600 hover:bg-green-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-center text-xl font-bold underline">
            Prices at the Welfare Canteen - {currentYear}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <div className="relative w-64">
              <Input
                placeholder="Search by serial number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="flex space-x-2">
              <Input
                placeholder="Enter serial number to delete"
                value={deleteSerialNumber}
                onChange={(e) => setDeleteSerialNumber(e.target.value)}
                className="w-48"
              />
              <Button onClick={handleDeleteConfirm} variant="destructive" disabled={!deleteSerialNumber}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Serial Number</TableHead>
                <TableHead className="text-center">Description</TableHead>
                <TableHead className="text-right">Price (Rs)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow
                  key={item.id}
                  className={deleteSerialNumber && item.serialNumber === deleteSerialNumber ? "bg-red-100" : ""}
                >
                  <TableCell>{item.serialNumber}</TableCell>
                  <TableCell className="text-center">{item.description}</TableCell>
                  <TableCell className="text-right">{item.price.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="serialNumber" className="text-right">
                Serial Number
              </Label>
              <Input
                id="serialNumber"
                value={newItem.serialNumber || ""}
                onChange={(e) => setNewItem({ ...newItem, serialNumber: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Input
                id="description"
                value={newItem.description || ""}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price
              </Label>
              <Input
                id="price"
                type="number"
                value={newItem.price || ""}
                onChange={(e) => setNewItem({ ...newItem, price: Number(e.target.value) })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this item? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            {itemToDelete && (
              <div className="space-y-2">
                <p>
                  <strong>Serial Number:</strong> {itemToDelete.serialNumber}
                </p>
                <p>
                  <strong>Description:</strong> {itemToDelete.description}
                </p>
                <p>
                  <strong>Price:</strong> Rs {itemToDelete.price.toFixed(2)}
                </p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmOpen(false)}>
              No
            </Button>
            <Button variant="destructive" onClick={handleDeleteItem}>
              Yes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

