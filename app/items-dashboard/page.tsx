"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useRouter } from "next/navigation"

export default function ItemsDashboard() {
  const router = useRouter()
  const [itemName, setItemName] = useState("")
  const [itemCode, setItemCode] = useState("")
  const [category, setCategory] = useState("")
  const [unit, setUnit] = useState("")
  const [quantity, setQuantity] = useState("")
  const [price, setPrice] = useState("")

  const [items, setItems] = useState([
    { id: 1, name: "Printer Paper A4", code: "PP001", category: "Stationery", unit: "Ream", quantity: 50, price: 750 },
    { id: 2, name: "Ballpoint Pen", code: "BP002", category: "Stationery", unit: "Box", quantity: 20, price: 350 },
    { id: 3, name: "File Folder", code: "FF003", category: "Stationery", unit: "Piece", quantity: 100, price: 45 },
  ])

  const handleAddItem = () => {
    if (!itemName || !itemCode || !category || !unit || !quantity || !price) {
      alert("Please fill all fields")
      return
    }

    const newItem = {
      id: items.length + 1,
      name: itemName,
      code: itemCode,
      category,
      unit,
      quantity: Number.parseInt(quantity),
      price: Number.parseFloat(price),
    }

    setItems([...items, newItem])
    clearForm()
    alert("Item added successfully!")
  }

  const clearForm = () => {
    setItemName("")
    setItemCode("")
    setCategory("")
    setUnit("")
    setQuantity("")
    setPrice("")
  }

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Items Dashboard</h1>
        <Button onClick={() => router.push("/office-section")} className="home-button">
          HOME
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Item Form */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-1">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Item</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <Input value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="Enter item name" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Item Code</label>
              <Input value={itemCode} onChange={(e) => setItemCode(e.target.value)} placeholder="Enter item code" />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Stationery">Stationery</SelectItem>
                  <SelectItem value="Electronics">Electronics</SelectItem>
                  <SelectItem value="Furniture">Furniture</SelectItem>
                  <SelectItem value="Office Supplies">Office Supplies</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Unit</label>
              <Select value={unit} onValueChange={setUnit}>
                <SelectTrigger>
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Piece">Piece</SelectItem>
                  <SelectItem value="Box">Box</SelectItem>
                  <SelectItem value="Ream">Ream</SelectItem>
                  <SelectItem value="Pack">Pack</SelectItem>
                  <SelectItem value="Set">Set</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Quantity</label>
              <Input
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                type="number"
                placeholder="Enter quantity"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Price (Rs.)</label>
              <Input value={price} onChange={(e) => setPrice(e.target.value)} type="number" placeholder="Enter price" />
            </div>

            <div className="flex space-x-2 pt-2">
              <Button onClick={handleAddItem} className="flex-1 bg-green-600 hover:bg-green-700">
                Add Item
              </Button>
              <Button onClick={clearForm} variant="outline" className="flex-1">
                Clear
              </Button>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <div className="bg-white p-6 rounded-lg shadow-md col-span-2">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Item Inventory</h2>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Item Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Price (Rs.)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.name}</TableCell>
                    <TableCell>{item.code}</TableCell>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.unit}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item.price}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* CSS for the HOME button */}
      <style jsx global>{`
        /* From Uiverse.io by namecho */
        .home-button,
        .home-button::after {
          padding: 16px 20px;
          font-size: 18px;
          background: linear-gradient(45deg, transparent 5%, #ff013c 5%);
          border: 0;
          color: #fff;
          letter-spacing: 3px;
          line-height: 1;
          box-shadow: 6px 0px 0px #00e6f6;
          outline: transparent;
          position: relative;
        }

        .home-button::after {
          --slice-0: inset(50% 50% 50% 50%);
          --slice-1: inset(80% -6px 0 0);
          --slice-2: inset(50% -6px 30% 0);
          --slice-3: inset(10% -6px 85% 0);
          --slice-4: inset(40% -6px 43% 0);
          --slice-5: inset(80% -6px 5% 0);
          content: "HOVER ME";
          display: block;
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(45deg, transparent 3%, #00e6f6 3%, #00e6f6 5%, #ff013c 5%);
          text-shadow: -3px -3px 0px #f8f005, 3px 3px 0px #00e6f6;
          clip-path: var(--slice-0);
        }

        .home-button:hover::after {
          animation: 1s glitch;
          animation-timing-function: steps(2, end);
        }

        @keyframes glitch {
          0% {
            clip-path: var(--slice-1);
            transform: translate(-20px, -10px);
          }

          10% {
            clip-path: var(--slice-3);
            transform: translate(10px, 10px);
          }

          20% {
            clip-path: var(--slice-1);
            transform: translate(-10px, 10px);
          }

          30% {
            clip-path: var(--slice-3);
            transform: translate(0px, 5px);
          }

          40% {
            clip-path: var(--slice-2);
            transform: translate(-5px, 0px);
          }

          50% {
            clip-path: var(--slice-3);
            transform: translate(5px, 0px);
          }

          60% {
            clip-path: var(--slice-4);
            transform: translate(5px, 10px);
          }

          70% {
            clip-path: var(--slice-2);
            transform: translate(-10px, 10px);
          }

          80% {
            clip-path: var(--slice-5);
            transform: translate(20px, -10px);
          }

          90% {
            clip-path: var(--slice-1);
            transform: translate(-10px, 0px);
          }

          100% {
            clip-path: var(--slice-1);
            transform: translate(0);
          }
        }
      `}</style>
    </div>
  )
}

