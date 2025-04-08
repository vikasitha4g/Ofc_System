"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, RefreshCw, Save, Trash2 } from "lucide-react"

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
  rackNumber: string
}

export default function AddProductForm() {
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
      rackNumber: "A-01",
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
      rackNumber: "A-02",
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
      rackNumber: "B-01",
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
      rackNumber: "C-03",
    },
  ])

  const [searchQuery, setSearchQuery] = useState("")
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    code: "",
    name: "",
    category: "Furniture",
    quantity: 0,
    unit: "Pcs",
    unitPrice: 0,
    rackNumber: "",
  })
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Handle search
  const handleSearch = () => {
    const found = products.find((product) => product.code.toLowerCase() === searchQuery.toLowerCase())
    if (found) {
      setSelectedProduct(found)
      setNewProduct({
        ...found,
      })
    } else {
      alert("No product found with that code")
    }
  }

  // Handle refresh
  const handleRefresh = () => {
    setSearchQuery("")
    setSelectedProduct(null)
    setNewProduct({
      code: "",
      name: "",
      category: "Furniture",
      quantity: 0,
      unit: "Pcs",
      unitPrice: 0,
      rackNumber: "",
    })
  }

  // Handle save/update
  const handleSave = () => {
    if (!newProduct.code || !newProduct.name) {
      alert("Product code and name are required")
      return
    }

    const totalPrice = (newProduct.quantity || 0) * (newProduct.unitPrice || 0)
    let status: "In Stock" | "Low Stock" | "Out of Stock" = "In Stock"

    if ((newProduct.quantity || 0) === 0) {
      status = "Out of Stock"
    } else if ((newProduct.quantity || 0) <= 5) {
      status = "Low Stock"
    }

    const updatedProduct: Product = {
      id: selectedProduct?.id || Date.now().toString(),
      code: newProduct.code || "",
      name: newProduct.name || "",
      category: newProduct.category || "Furniture",
      quantity: newProduct.quantity || 0,
      unit: newProduct.unit || "Pcs",
      unitPrice: newProduct.unitPrice || 0,
      totalPrice,
      status,
      lastUpdated: new Date().toISOString().split("T")[0],
      rackNumber: newProduct.rackNumber || "",
    }

    if (selectedProduct) {
      // Update existing product
      setProducts(products.map((product) => (product.id === selectedProduct.id ? updatedProduct : product)))
    } else {
      // Add new product
      setProducts([...products, updatedProduct])
    }

    // Reset form
    handleRefresh()
  }

  // Handle delete
  const handleDelete = () => {
    if (!selectedProduct) {
      alert("Please select a product to delete")
      return
    }

    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((product) => product.id !== selectedProduct.id))
      handleRefresh()
    }
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8"
            />
          </div>
          <Button onClick={handleSearch} className="bg-blue-600 hover:bg-blue-700">
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          <Button onClick={handleRefresh} className="bg-green-600 hover:bg-green-700">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product Form */}
        <Card>
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Product Code</Label>
                <Input
                  id="code"
                  value={newProduct.code || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, code: e.target.value })}
                  placeholder="Enter product code"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="name">Product Name</Label>
                <Input
                  id="name"
                  value={newProduct.name || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  placeholder="Enter product name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={newProduct.category || "Furniture"}
                  onValueChange={(value) => setNewProduct({ ...newProduct, category: value })}
                >
                  <SelectTrigger id="category">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Furniture">Furniture</SelectItem>
                    <SelectItem value="Stationery">Stationery</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem>
                    <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit</Label>
                <Select
                  value={newProduct.unit || "Pcs"}
                  onValueChange={(value) => setNewProduct({ ...newProduct, unit: value })}
                >
                  <SelectTrigger id="unit">
                    <SelectValue placeholder="Select unit" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pcs">Pieces</SelectItem>
                    <SelectItem value="Box">Box</SelectItem>
                    <SelectItem value="Reams">Reams</SelectItem>
                    <SelectItem value="Kg">Kilograms</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={newProduct.quantity || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, quantity: Number(e.target.value) })}
                  placeholder="Enter quantity"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitPrice">Unit Price (Rs)</Label>
                <Input
                  id="unitPrice"
                  type="number"
                  value={newProduct.unitPrice || ""}
                  onChange={(e) => setNewProduct({ ...newProduct, unitPrice: Number(e.target.value) })}
                  placeholder="Enter unit price"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rackNumber">Rack Number</Label>
              <Input
                id="rackNumber"
                value={newProduct.rackNumber || ""}
                onChange={(e) => setNewProduct({ ...newProduct, rackNumber: e.target.value })}
                placeholder="Enter rack number (e.g., A-01)"
              />
            </div>

            <div className="flex justify-between pt-4">
              <Button variant="destructive" onClick={handleDelete}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
              <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                {selectedProduct ? "Update" : "Save"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Products Table */}
        <Card>
          <CardHeader>
            <CardTitle>Products List</CardTitle>
          </CardHeader>
          <CardContent className="p-0 max-h-[500px] overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead>Rack</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProducts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-4 text-muted-foreground">
                      No products found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProducts.map((product) => (
                    <TableRow
                      key={product.id}
                      className={selectedProduct?.id === product.id ? "bg-blue-50" : ""}
                      onClick={() => {
                        setSelectedProduct(product)
                        setNewProduct({ ...product })
                      }}
                    >
                      <TableCell className="font-medium">{product.code}</TableCell>
                      <TableCell>{product.name}</TableCell>
                      <TableCell>{product.category}</TableCell>
                      <TableCell className="text-right">{product.quantity}</TableCell>
                      <TableCell className="text-right">{product.unitPrice.toLocaleString()}</TableCell>
                      <TableCell>{product.rackNumber}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

