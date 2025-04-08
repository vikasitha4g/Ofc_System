"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Trash2 } from "lucide-react"

type RequestItem = {
  id: string
  serialNumber: string
  description: string
  quantityRequested: number
  cost: number
}

export default function StoreRoomForm({ onClose }: { onClose: () => void }) {
  const [officerName, setOfficerName] = useState("")
  const [idNumber, setIdNumber] = useState("")
  const [position, setPosition] = useState("")
  const [department, setDepartment] = useState("")
  const [items, setItems] = useState<RequestItem[]>([])
  const [showConfirmation, setShowConfirmation] = useState(false)

  // New item form state
  const [itemSerialNumber, setItemSerialNumber] = useState("")
  const [itemDescription, setItemDescription] = useState("")
  const [itemQuantity, setItemQuantity] = useState(1)
  const [itemCost, setItemCost] = useState(0)

  // Add item to request
  const handleAddItem = () => {
    if (!itemSerialNumber || !itemDescription || itemQuantity <= 0) {
      alert("Serial number, description and quantity requested are required")
      return
    }

    const newItem: RequestItem = {
      id: Date.now().toString(),
      serialNumber: itemSerialNumber,
      description: itemDescription,
      quantityRequested: itemQuantity,
      cost: itemCost,
    }

    setItems([...items, newItem])

    // Reset item form
    setItemSerialNumber("")
    setItemDescription("")
    setItemQuantity(1)
    setItemCost(0)
  }

  // Remove item from request
  const handleRemoveItem = (itemId: string) => {
    setItems(items.filter((item) => item.id !== itemId))
  }

  // Handle adding a new request
  const handleAddRequest = () => {
    if (!officerName || !idNumber || !department || items.length === 0) {
      alert("Officer name, ID number, department and at least one item are required")
      return
    }

    // Show confirmation table
    setShowConfirmation(true)
  }

  // Calculate total cost
  const totalCost = items.reduce((sum, item) => sum + item.cost, 0)

  return (
    <div className="p-6 bg-[#ece3f0] min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Store Room - Add New Request</h1>
        {/* Close button removed */}
      </div>

      {!showConfirmation ? (
        <Card>
          <CardHeader>
            <CardTitle>Add New Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="officerName">Officer Name</Label>
                <Input id="officerName" value={officerName} onChange={(e) => setOfficerName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="idNumber">ID Number</Label>
                <Input
                  id="idNumber"
                  value={idNumber}
                  onChange={(e) => setIdNumber(e.target.value)}
                  placeholder="Enter officer ID number"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input id="position" value={position} onChange={(e) => setPosition(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select value={department} onValueChange={setDepartment}>
                  <SelectTrigger id="department">
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
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Requested Items</h3>
              </div>

              <div className="border rounded-md p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="serialNumber">Serial Number</Label>
                    <Input
                      id="serialNumber"
                      value={itemSerialNumber}
                      onChange={(e) => setItemSerialNumber(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      value={itemDescription}
                      onChange={(e) => setItemDescription(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantityRequested">Qty Requested</Label>
                    <Input
                      id="quantityRequested"
                      type="number"
                      value={itemQuantity}
                      onChange={(e) => setItemQuantity(Number(e.target.value))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cost">Cost (Rs)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="cost"
                        type="number"
                        value={itemCost}
                        onChange={(e) => setItemCost(Number(e.target.value))}
                        className="w-full"
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
                      <TableHead className="text-right">Cost (Rs)</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.length > 0 ? (
                      items.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell>{item.serialNumber}</TableCell>
                          <TableCell>{item.description}</TableCell>
                          <TableCell className="text-center">{item.quantityRequested}</TableCell>
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
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No items added yet
                        </TableCell>
                      </TableRow>
                    )}
                    {items.length > 0 && (
                      <TableRow>
                        <TableCell colSpan={3} className="text-right font-bold">
                          Total:
                        </TableCell>
                        <TableCell className="text-right font-bold">Rs {totalCost.toLocaleString()}</TableCell>
                        <TableCell></TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button onClick={handleAddRequest}>Add Request</Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Request Confirmation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p>
                    <strong>Officer Name:</strong> {officerName}
                  </p>
                  <p>
                    <strong>ID Number:</strong> {idNumber}
                  </p>
                </div>
                <div>
                  <p>
                    <strong>Position:</strong> {position}
                  </p>
                  <p>
                    <strong>Department:</strong> {department}
                  </p>
                </div>
              </div>
            </div>

            <Table className="bg-green-50 border border-green-100 rounded-lg overflow-hidden">
              <TableHeader className="bg-green-100">
                <TableRow>
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">Qty Requested</TableHead>
                  <TableHead className="text-right">Cost (Rs)</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="border-t border-green-200">
                    <TableCell>{item.serialNumber}</TableCell>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-center">{item.quantityRequested}</TableCell>
                    <TableCell className="text-right">{item.cost.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
                <TableRow className="border-t border-green-200 font-bold">
                  <TableCell colSpan={3} className="text-right">
                    Total:
                  </TableCell>
                  <TableCell className="text-right">Rs {totalCost.toLocaleString()}</TableCell>
                </TableRow>
              </TableBody>
            </Table>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowConfirmation(false)}>
                Back
              </Button>
              <Button
                onClick={() => {
                  // Show a more detailed confirmation message
                  const confirmationMessage = `
                    Request submitted successfully!
                    
                    Officer: ${officerName}
                    Department: ${department}
                    Total Items: ${items.length}
                    Total Cost: Rs ${totalCost.toLocaleString()}
                    
                    Your request has been recorded and will be processed shortly.
                  `
                  alert(confirmationMessage)
                  if (onClose) onClose()
                }}
              >
                Confirm Request
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

