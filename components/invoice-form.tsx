"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Printer, Plus, Trash2, Download } from "lucide-react"

type InvoiceItem = {
  id: string
  description: string
  quantity: number
  unitPrice: number
  amount: number
}

export default function InvoiceForm({ onClose }: { onClose: () => void }) {
  const [invoiceNumber, setInvoiceNumber] = useState("INV-2023-001")
  const [invoiceDate, setInvoiceDate] = useState<Date>(new Date())
  const [dueDate, setDueDate] = useState<Date>(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days from now
  const [customerName, setCustomerName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerAddress, setCustomerAddress] = useState("")
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: "1", description: "Office Chair", quantity: 2, unitPrice: 8000, amount: 16000 },
    { id: "2", description: "Office Desk", quantity: 1, unitPrice: 12000, amount: 12000 },
  ])
  const [newItem, setNewItem] = useState<Partial<InvoiceItem>>({
    description: "",
    quantity: 1,
    unitPrice: 0,
    amount: 0,
  })

  // Calculate subtotal, tax, and total
  const subtotal = items.reduce((sum, item) => sum + item.amount, 0)
  const taxRate = 0.05 // 5% tax
  const taxAmount = subtotal * taxRate
  const total = subtotal + taxAmount

  // Handle adding a new item
  const handleAddItem = () => {
    if (!newItem.description || !newItem.quantity || !newItem.unitPrice) {
      alert("Please fill in all item details")
      return
    }

    const amount = (newItem.quantity || 0) * (newItem.unitPrice || 0)
    const item: InvoiceItem = {
      id: Date.now().toString(),
      description: newItem.description || "",
      quantity: newItem.quantity || 0,
      unitPrice: newItem.unitPrice || 0,
      amount,
    }

    setItems([...items, item])
    setNewItem({
      description: "",
      quantity: 1,
      unitPrice: 0,
      amount: 0,
    })
  }

  // Handle removing an item
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  // Handle input change for new item
  const handleNewItemChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updatedItem = { ...newItem, [name]: name === "description" ? value : Number(value) }

    // Calculate amount if both quantity and unitPrice are available
    if ((name === "quantity" || name === "unitPrice") && updatedItem.quantity && updatedItem.unitPrice) {
      updatedItem.amount = updatedItem.quantity * updatedItem.unitPrice
    }

    setNewItem(updatedItem)
  }

  // Generate and download invoice as Word document
  const handleDownloadDoc = () => {
    // Create HTML content for the Word document
    const htmlContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head>
        <meta charset="utf-8">
        <title>Invoice ${invoiceNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; }
          .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .invoice-details { margin-bottom: 20px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .text-right { text-align: right; }
          .total-row { font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="invoice-header">
          <div>
            <div class="invoice-title">INVOICE</div>
            <div>Galenbindunuwewa DS Office</div>
            <div>123 Main Street, Galenbindunuwewa</div>
            <div>Tel: +94 123 456 789</div>
          </div>
          <div>
            <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
            <div><strong>Date:</strong> ${format(invoiceDate, "PPP")}</div>
            <div><strong>Due Date:</strong> ${format(dueDate, "PPP")}</div>
          </div>
        </div>

        <div class="invoice-details">
          <div><strong>Bill To:</strong></div>
          <div>${customerName}</div>
          <div>${customerEmail}</div>
          <div>${customerAddress}</div>
        </div>

        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th class="text-right">Quantity</th>
              <th class="text-right">Unit Price (Rs)</th>
              <th class="text-right">Amount (Rs)</th>
            </tr>
          </thead>
          <tbody>
            ${items
              .map(
                (item) => `
              <tr>
                <td>${item.description}</td>
                <td class="text-right">${item.quantity}</td>
                <td class="text-right">${item.unitPrice.toFixed(2)}</td>
                <td class="text-right">${item.amount.toFixed(2)}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" class="text-right"><strong>Subtotal</strong></td>
              <td class="text-right">${subtotal.toFixed(2)}</td>
            </tr>
            <tr>
              <td colspan="3" class="text-right"><strong>Tax (5%)</strong></td>
              <td class="text-right">${taxAmount.toFixed(2)}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" class="text-right"><strong>Total</strong></td>
              <td class="text-right">${total.toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>

        <div>
          <p><strong>Payment Terms:</strong> Payment due within 7 days of invoice date.</p>
          <p><strong>Notes:</strong> Thank you for your business!</p>
        </div>
      </body>
      </html>
    `

    // Create a Blob with the HTML content
    const blob = new Blob([htmlContent], { type: "application/msword" })
    const url = URL.createObjectURL(blob)

    // Create a link and trigger download
    const link = document.createElement("a")
    link.href = url
    link.download = `Invoice_${invoiceNumber}.doc`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // Print invoice
  const handlePrint = () => {
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const htmlContent = `
        <html>
          <head>
            <title>Invoice ${invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; }
              .invoice-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .invoice-title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
              .invoice-details { margin-bottom: 20px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .text-right { text-align: right; }
              .total-row { font-weight: bold; }
              @media print {
                button { display: none; }
              }
            </style>
          </head>
          <body>
            <div class="invoice-header">
              <div>
                <div class="invoice-title">INVOICE</div>
                <div>Galenbindunuwewa DS Office</div>
                <div>123 Main Street, Galenbindunuwewa</div>
                <div>Tel: +94 123 456 789</div>
              </div>
              <div>
                <div><strong>Invoice #:</strong> ${invoiceNumber}</div>
                <div><strong>Date:</strong> ${format(invoiceDate, "PPP")}</div>
                <div><strong>Due Date:</strong> ${format(dueDate, "PPP")}</div>
              </div>
            </div>

            <div class="invoice-details">
              <div><strong>Bill To:</strong></div>
              <div>${customerName}</div>
              <div>${customerEmail}</div>
              <div>${customerAddress}</div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-right">Quantity</th>
                  <th class="text-right">Unit Price (Rs)</th>
                  <th class="text-right">Amount (Rs)</th>
                </tr>
              </thead>
              <tbody>
                ${items
                  .map(
                    (item) => `
                  <tr>
                    <td>${item.description}</td>
                    <td class="text-right">${item.quantity}</td>
                    <td class="text-right">${item.unitPrice.toFixed(2)}</td>
                    <td class="text-right">${item.amount.toFixed(2)}</td>
                  </tr>
                `,
                  )
                  .join("")}
              </tbody>
              <tfoot>
                <tr>
                  <td colspan="3" class="text-right"><strong>Subtotal</strong></td>
                  <td class="text-right">${subtotal.toFixed(2)}</td>
                </tr>
                <tr>
                  <td colspan="3" class="text-right"><strong>Tax (5%)</strong></td>
                  <td class="text-right">${taxAmount.toFixed(2)}</td>
                </tr>
                <tr class="total-row">
                  <td colspan="3" class="text-right"><strong>Total</strong></td>
                  <td class="text-right">${total.toFixed(2)}</td>
                </tr>
              </tfoot>
            </table>

            <div>
              <p><strong>Payment Terms:</strong> Payment due within 7 days of invoice date.</p>
              <p><strong>Notes:</strong> Thank you for your business!</p>
            </div>

            <button onclick="window.print()" style="padding: 10px 20px; background-color: #4CAF50; color: white; border: none; cursor: pointer; margin-top: 20px;">
              Print Invoice
            </button>
          </body>
        </html>
      `

      printWindow.document.write(htmlContent)
      printWindow.document.close()
    }
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Invoice Generator</h1>
        <div className="flex space-x-2">
          <Button onClick={handlePrint} className="bg-blue-600 hover:bg-blue-700">
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button onClick={handleDownloadDoc} className="bg-green-600 hover:bg-green-700">
            <Download className="h-4 w-4 mr-2" />
            Download DOC
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice Details */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Invoice Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="invoiceNumber">Invoice Number</Label>
              <Input id="invoiceNumber" value={invoiceNumber} onChange={(e) => setInvoiceNumber(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="invoiceDate">Invoice Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="invoiceDate">
                    {format(invoiceDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={invoiceDate}
                    onSelect={(date) => date && setInvoiceDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal" id="dueDate">
                    {format(dueDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={(date) => date && setDueDate(date)}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Enter customer name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerEmail">Customer Email</Label>
              <Input
                id="customerEmail"
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Enter customer email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customerAddress">Customer Address</Label>
              <Input
                id="customerAddress"
                value={customerAddress}
                onChange={(e) => setCustomerAddress(e.target.value)}
                placeholder="Enter customer address"
              />
            </div>
          </CardContent>
        </Card>

        {/* Invoice Items */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Invoice Items</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Unit Price (Rs)</TableHead>
                  <TableHead className="text-right">Amount (Rs)</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell className="text-right">{item.quantity}</TableCell>
                    <TableCell className="text-right">{item.unitPrice.toFixed(2)}</TableCell>
                    <TableCell className="text-right">{item.amount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(item.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                        <span className="sr-only">Remove</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Add new item row */}
                <TableRow>
                  <TableCell>
                    <Input
                      name="description"
                      value={newItem.description || ""}
                      onChange={handleNewItemChange}
                      placeholder="Item description"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      name="quantity"
                      type="number"
                      value={newItem.quantity || ""}
                      onChange={handleNewItemChange}
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      name="unitPrice"
                      type="number"
                      value={newItem.unitPrice || ""}
                      onChange={handleNewItemChange}
                      className="text-right"
                    />
                  </TableCell>
                  <TableCell className="text-right">{newItem.amount ? newItem.amount.toFixed(2) : "0.00"}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="sm" onClick={handleAddItem} className="h-8 w-8 p-0">
                      <Plus className="h-4 w-4 text-green-500" />
                      <span className="sr-only">Add</span>
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
              <tfoot>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Subtotal
                  </TableCell>
                  <TableCell className="text-right font-medium">{subtotal.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-medium">
                    Tax (5%)
                  </TableCell>
                  <TableCell className="text-right font-medium">{taxAmount.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">
                    Total
                  </TableCell>
                  <TableCell className="text-right font-bold">{total.toFixed(2)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </tfoot>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

