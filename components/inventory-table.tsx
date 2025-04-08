"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Eye, FileText } from "lucide-react"

type InventoryItem = {
  id: string
  code: string
  name: string
  category: string
  quantity: number
  unit: string
  unitPrice: number
  totalPrice: number
  status: "In Stock" | "Low Stock" | "Out of Stock"
  lastUpdated: string
}

interface InventoryTableProps {
  searchQuery: string
  filterType: string
}

export default function InventoryTable({ searchQuery, filterType }: InventoryTableProps) {
  // Sample inventory data
  const [inventoryItems] = useState<InventoryItem[]>([
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
      lastUpdated: "2023-12-15",
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
      lastUpdated: "2023-12-10",
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
      lastUpdated: "2023-11-28",
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
      lastUpdated: "2023-12-05",
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
      lastUpdated: "2023-12-01",
    },
    {
      id: "6",
      code: "IT006",
      name: "Laptop",
      category: "Electronics",
      quantity: 3,
      unit: "Pcs",
      unitPrice: 85000,
      totalPrice: 255000,
      status: "Low Stock",
      lastUpdated: "2023-11-15",
    },
    {
      id: "7",
      code: "IT007",
      name: "Whiteboard",
      category: "Office Supplies",
      quantity: 0,
      unit: "Pcs",
      unitPrice: 3500,
      totalPrice: 0,
      status: "Out of Stock",
      lastUpdated: "2023-10-20",
    },
  ])

  // Filter items based on search query and filter type
  const filteredItems = inventoryItems.filter((item) => {
    // Search filter
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase())

    // Type filter
    let matchesType = true
    if (filterType === "received") {
      matchesType = item.status === "In Stock"
    } else if (filterType === "issued") {
      matchesType = item.quantity > 0
    } else if (filterType === "reorder") {
      matchesType = item.status === "Low Stock"
    } else if (filterType === "outofstock") {
      matchesType = item.status === "Out of Stock"
    }

    return matchesSearch && matchesType
  })

  return (
    <div className="rounded-md border bg-white">
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
            <TableHead className="text-center">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="h-24 text-center">
                No items found.
              </TableCell>
            </TableRow>
          ) : (
            filteredItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.code}</TableCell>
                <TableCell>{item.name}</TableCell>
                <TableCell>{item.category}</TableCell>
                <TableCell className="text-right">{item.quantity}</TableCell>
                <TableCell className="text-center">{item.unit}</TableCell>
                <TableCell className="text-right">{item.unitPrice.toLocaleString()}</TableCell>
                <TableCell className="text-right">{item.totalPrice.toLocaleString()}</TableCell>
                <TableCell className="text-center">
                  <Badge
                    variant={
                      item.status === "In Stock" ? "default" : item.status === "Low Stock" ? "outline" : "destructive"
                    }
                  >
                    {item.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-center">
                  <div className="flex justify-center space-x-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View details</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <FileText className="h-4 w-4" />
                      <span className="sr-only">View history</span>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

