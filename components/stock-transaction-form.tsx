"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"

type Product = {
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
  rackNumber: string // Added rack number field
}

type StockTransaction = {
  id: string
  date: string
  type: "Stock In" | "Stock Out"
  productId: string
  productName: string
  quantity: number
  unitPrice: number
  totalPrice: number
  notes: string
  rackNumber: string // Added rack number field
}

interface StockTransactionFormProps {
  updateInventoryData: (data: any) => void
}

export default function StockTransactionForm({ updateInventoryData }: StockTransactionFormProps) {
  const [activeTab, setActiveTab] = useState("stockIn")
  const [products, setProducts] = useState<Product[]>([
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
      rackNumber: "A-01", // Added rack number
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
      rackNumber: "A-02", // Added rack number
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
      rackNumber: "B-01", // Added rack number
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
      rackNumber: "C-03", // Added rack number
    },
  ])

  const [transactions, setTransactions] = useState<StockTransaction[]>([
    {
      id: "1",
      date: "2023-12-15",
      type: "Stock In",
      productId: "1",
      productName: "Office Desk",
      quantity: 5,
      unitPrice: 12000,
      totalPrice: 60000,
      notes: "Initial stock",
      rackNumber: "A-01", // Added rack number
    },
    {
      id: "2",
      date: "2023-12-10",
      type: "Stock In",
      productId: "2",
      productName: "Office Chair",
      quantity: 10,
      unitPrice: 8000,
      totalPrice: 80000,
      notes: "Initial stock",
      rackNumber: "A-02", // Added rack number
    },
    {
      id: "3",
      date: "2023-12-05",
      type: "Stock Out",
      productId: "2",
      productName: "Office Chair",
      quantity: 2,
      unitPrice: 8000,
      totalPrice: 16000,
      notes: "Issued to HR department",
      rackNumber: "A-02", // Added rack number
    },
  ])

  const [selectedProduct, setSelectedProduct] = useState<string>("")
  const [quantity, setQuantity] = useState<number>(1)
  const [unitPrice, setUnitPrice] = useState<number>(0)
  const [notes, setNotes] = useState<string>("")
  const [rackNumber, setRackNumber] = useState<string>("") // Added rack number state

  // Update unit price when product is selected
  useEffect(() => {
    if (selectedProduct) {
      const product = products.find((p) => p.id === selectedProduct)
      if (product) {
        setUnitPrice(product.unitPrice)
        setRackNumber(product.rackNumber) // Set the rack number from the selected product
      }
    } else {
      setUnitPrice(0)
      setRackNumber("") // Reset rack number when no product is selected
    }
  }, [selectedProduct, products])

  // Calculate total price
  const totalPrice = quantity * unitPrice

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedProduct || quantity <= 0) {
      alert("Please select a product and enter a valid quantity")
      return
    }

    const product = products.find((p) => p.id === selectedProduct)
    if (!product) return

    // Create new transaction
    const newTransaction: StockTransaction = {
      id: Date.now().toString(),
      date: format(new Date(), "yyyy-MM-dd"),
      type: activeTab === "stockIn" ? "Stock In" : "Stock Out",
      productId: selectedProduct,
      productName: product.name,
      quantity,
      unitPrice,
      totalPrice,
      notes,
      rackNumber, // Include rack number in the transaction
    }

    // Update transactions
    setTransactions([newTransaction, ...transactions])

    // Update product quantity and status
    const updatedProducts = products.map((p) => {
      if (p.id === selectedProduct) {
        const newQuantity = activeTab === "stockIn" ? p.quantity + quantity : Math.max(0, p.quantity - quantity)
        const newTotalPrice = newQuantity * p.unitPrice
        let newStatus: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock"

        if (newQuantity === 0) {
          newStatus = "Out of Stock"
        } else if (newQuantity <= 5) {
          newStatus = "Low Stock"
        }

        return {
          ...p,
          quantity: newQuantity,
          totalPrice: newTotalPrice,
          status: newStatus,
          lastUpdated: format(new Date(), "yyyy-MM-dd"),
          rackNumber: rackNumber, // Update rack number
        }
      }
      return p
    })

    setProducts(updatedProducts)

    // Update inventory data in parent component
    const outOfStock = updatedProducts.filter((p) => p.status === "Out of Stock").length
    const lowStock = updatedProducts.filter((p) => p.status === "Low Stock").length
    const totalStock = updatedProducts.reduce((sum, p) => sum + p.quantity, 0)
    const totalCost = updatedProducts.reduce((sum, p) => sum + p.totalPrice, 0)

    updateInventoryData({
      outOfStock,
      reOrder: lowStock,
      currentStock: totalStock,
      stockCost: totalCost,
      monthlyReceived: activeTab === "stockIn" ? totalPrice : 0,
    })

    // Reset form
    setSelectedProduct("")
    setQuantity(1)
    setUnitPrice(0)
    setNotes("")
    setRackNumber("") // Reset rack number
  }

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2">
          <TabsTrigger value="stockIn">Stock In</TabsTrigger>
          <TabsTrigger value="stockOut">Stock Out</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form */}
            <Card>
              <CardContent className="pt-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="product">Product</Label>
                    <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                      <SelectTrigger id="product">
                        <SelectValue placeholder="Select product" />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} ({product.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="quantity">Quantity</Label>
                      <Input
                        id="quantity"
                        type="number"
                        min={1}
                        value={quantity}
                        onChange={(e) => setQuantity(Number.parseInt(e.target.value) || 0)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="unitPrice">Unit Price (Rs)</Label>
                      <Input
                        id="unitPrice"
                        type="number"
                        min={0}
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(Number.parseFloat(e.target.value) || 0)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rackNumber">Rack Number</Label>
                    <Input
                      id="rackNumber"
                      value={rackNumber}
                      onChange={(e) => setRackNumber(e.target.value)}
                      placeholder="Enter rack number (e.g., A-01)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="notes">Notes</Label>
                    <Input
                      id="notes"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Add notes (optional)"
                    />
                  </div>

                  <div className="pt-2">
                    <div className="flex justify-between items-center py-2 border-t border-b">
                      <span className="font-medium">Total Price:</span>
                      <span className="text-xl font-bold">Rs {totalPrice.toLocaleString()}</span>
                    </div>
                  </div>

                  <Button type="submit" className="w-full">
                    {activeTab === "stockIn" ? "Add Stock" : "Issue Stock"}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Recent Transactions */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-4">Recent Transactions</h3>
                <div className="max-h-[400px] overflow-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead className="text-right">Qty</TableHead>
                        <TableHead className="text-right">Total (Rs)</TableHead>
                        <TableHead>Rack</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {transactions.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                            No transactions yet
                          </TableCell>
                        </TableRow>
                      ) : (
                        transactions.slice(0, 10).map((transaction) => (
                          <TableRow key={transaction.id}>
                            <TableCell>{new Date(transaction.date).toLocaleDateString()}</TableCell>
                            <TableCell>
                              <Badge
                                variant={transaction.type === "Stock In" ? "default" : "secondary"}
                                className={
                                  transaction.type === "Stock In"
                                    ? "bg-green-100 text-green-800 hover:bg-green-100"
                                    : "bg-orange-100 text-orange-800 hover:bg-orange-100"
                                }
                              >
                                {transaction.type}
                              </Badge>
                            </TableCell>
                            <TableCell>{transaction.productName}</TableCell>
                            <TableCell className="text-right">{transaction.quantity}</TableCell>
                            <TableCell className="text-right">{transaction.totalPrice.toLocaleString()}</TableCell>
                            <TableCell>{transaction.rackNumber}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Current Inventory */}
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-lg font-medium mb-4">Current Inventory</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Code</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-center">Unit</TableHead>
                    <TableHead className="text-right">Unit Price (Rs)</TableHead>
                    <TableHead className="text-right">Total Price (Rs)</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead>Rack Number</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {products.map((product) => (
                    <TableRow key={product.id}>
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-center">{product.unit}</TableCell>
                      <TableCell className="text-right">{product.unitPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{product.totalPrice.toLocaleString()}</TableCell>
                      <TableCell className="text-center">
                        <Badge
                          variant={
                            product.status === "In Stock"
                              ? "default"
                              : product.status === "Low Stock"
                                ? "outline"
                                : "destructive"
                          }
                        >
                          {product.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{product.rackNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

