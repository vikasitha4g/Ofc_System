"use client"

import { Badge } from "@/components/ui/badge"
import { TableCell as UITableCell } from "@/components/ui/table"
import { TableRow as UITableRow } from "@/components/ui/table"
import { Table, TableHeader, TableBody, TableHead, TableRow } from "@/components/ui/table"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
  Package,
  ShoppingCart,
  Users,
  LogOut,
  Layers,
  Box,
  FileText,
  FileBarChart,
  FileSpreadsheet,
  ShoppingBag,
  X,
  ChevronDown,
  ChevronRight,
  Database,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import TopIssuedItems from "@/components/top-issued-items"
import ItemSummary from "@/components/item-summary"
import ReportsForm from "@/components/reports-form"
import OrdersForm from "@/components/orders-form"
import InvoiceForm from "@/components/invoice-form"
import ProcurementForm from "@/components/procurement-form"
import MembersForm from "@/components/members-form"
import StoreRoomForm from "@/components/store-room-form"
import StoreReportsForm from "@/components/store-reports-form"
import AddProductForm from "@/components/add-product-form"
import FixedAssetsForm from "@/components/fixed-assets-form"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"

export default function DashboardSidebar() {
  const router = useRouter()
  const [userName, setUserName] = useState<string>("User")
  const [isMobile, setIsMobile] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  // Submenu states
  const [isStoreCalOpen, setIsStoreCalOpen] = useState(false)
  const [isStoreRoomSubOpen, setIsStoreRoomSubOpen] = useState(false)

  // Dialog states
  const [isItemsDialogOpen, setIsItemsDialogOpen] = useState(false)
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false)
  const [isTopIssuedItemsOpen, setIsTopIssuedItemsOpen] = useState(false)
  const [isItemSummaryOpen, setIsItemSummaryOpen] = useState(false)
  const [isReportsOpen, setIsReportsOpen] = useState(false)
  const [isOrdersOpen, setIsOrdersOpen] = useState(false)
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false)
  const [isProcurementOpen, setIsProcurementOpen] = useState(false)
  const [isMembersOpen, setIsMembersOpen] = useState(false)
  const [isThemeDialogOpen, setIsThemeDialogOpen] = useState(false)
  const [isStoreRoomOpen, setIsStoreRoomOpen] = useState(false)
  const [isStoreReportsOpen, setIsStoreReportsOpen] = useState(false)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isFixedAssetsOpen, setIsFixedAssetsOpen] = useState(false)

  useEffect(() => {
    // Set user name based on role
    if (typeof window !== "undefined") {
      const role = localStorage.getItem("user-role")
      if (role === "admin") {
        setUserName("Admin")
      }

      // Check if mobile
      const checkIfMobile = () => {
        setIsMobile(window.innerWidth < 768)
      }

      checkIfMobile()
      window.addEventListener("resize", checkIfMobile)

      // Add event listener for opening Items Dashboard
      const handleOpenItemsDashboard = () => {
        // Open the Items Dashboard form directly
        setIsItemsDialogOpen(true)
      }

      document.addEventListener("openItemsDashboard", handleOpenItemsDashboard)

      // Clean up event listener
      return () => {
        window.removeEventListener("resize", checkIfMobile)
        document.removeEventListener("openItemsDashboard", handleOpenItemsDashboard)
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    router.push("/login")
  }

  // Update the StableDialog component to precisely center forms in the main dashboard area
  const StableDialog = ({
    isOpen,
    onClose,
    children,
    width = "1387px",
    height = "805px",
    preventOutsideClose = true,
    closeButtonTop = "2px", // New prop for adjusting close button position
  }) => {
    if (!isOpen) return null

    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 50,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
        onClick={preventOutsideClose ? (e) => e.stopPropagation() : onClose}
      >
        <div
          style={{
            backgroundColor: "white",
            borderRadius: "8px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            width: width,
            maxWidth: "calc(100vw - 265px)", // Account for sidebar width plus padding
            height: height,
            maxHeight: "90vh",
            overflow: "auto",
            position: "relative",
            marginLeft: "25.5px", // This is added to the sidebar width for perfect centering
            transform: "translateX(112.5px)", // Half of sidebar width to adjust the centering
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {closeButtonTop !== "-8px" && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 z-10"
              style={{ top: closeButtonTop }} // Use the dynamic top position
              onClick={onClose}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
          )}
          {children}
        </div>
      </div>
    )
  }

  // Reposition the tabs in the sidebar
  const NavItems = () => (
    <div className="space-y-6 flex flex-col h-[calc(100vh-100px)]">
      <div className="space-y-1 mt-6 flex-grow">
        {/* Home button with glitch effect */}
        <div className="flex justify-center mb-4">
          {/* From Uiverse.io by namecho */}
          <button onClick={() => router.push("/office-section")}>HOME</button>
        </div>

        {/* Rest of the menu items remain unchanged */}
        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsItemsDialogOpen(true)}
          data-sidebar-item="items"
        >
          <Package className="mr-3 h-5 w-5 text-blue-500" />
          Items
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsCategoryDialogOpen(true)}
        >
          <Layers className="mr-3 h-5 w-5 text-green-500" />
          Category
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsOrdersOpen(true)}
        >
          <ShoppingCart className="mr-3 h-5 w-5 text-orange-500" />
          Orders
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsMembersOpen(true)}
        >
          <Users className="mr-3 h-5 w-5 text-purple-500" />
          Members
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsTopIssuedItemsOpen(true)}
        >
          <FileBarChart className="mr-3 h-5 w-5 text-indigo-500" />
          Top Issued Items
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsItemSummaryOpen(true)}
        >
          <FileBarChart className="mr-3 h-5 w-5 text-pink-500" />
          Item Summary
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsReportsOpen(true)}
        >
          <FileText className="mr-3 h-5 w-5 text-yellow-500" />
          Reports
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsInvoiceOpen(true)}
        >
          <FileSpreadsheet className="mr-3 h-5 w-5 text-pink-500" />
          Invoice
        </Button>

        {/* Store Cal dropdown menu */}
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
            onClick={() => setIsStoreCalOpen(!isStoreCalOpen)}
          >
            <Database className="mr-3 h-5 w-5 text-emerald-500" />
            Store Cal
            {isStoreCalOpen ? (
              <ChevronDown className="ml-auto h-4 w-4" />
            ) : (
              <ChevronRight className="ml-auto h-4 w-4" />
            )}
          </Button>

          {isStoreCalOpen && (
            <div className="pl-8 space-y-1">
              {/* Store Room submenu */}
              <div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
                  onClick={() => setIsStoreRoomSubOpen(!isStoreRoomSubOpen)}
                >
                  <Package className="mr-3 h-4 w-4 text-emerald-500" />
                  Store Room
                  {isStoreRoomSubOpen ? (
                    <ChevronDown className="ml-auto h-4 w-4" />
                  ) : (
                    <ChevronRight className="ml-auto h-4 w-4" />
                  )}
                </Button>

                {isStoreRoomSubOpen && (
                  <div className="pl-8 space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
                      onClick={() => setIsStoreRoomOpen(true)}
                    >
                      <span>Add Request</span>
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
                      onClick={() => setIsFixedAssetsOpen(true)}
                    >
                      <span>Fixed Assets</span>
                    </Button>
                  </div>
                )}
              </div>

              <Button
                variant="ghost"
                className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
                onClick={() => setIsStoreReportsOpen(true)}
              >
                <FileText className="mr-3 h-4 w-4 text-teal-500" />
                Store Reports
              </Button>
            </div>
          )}
        </div>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsProcurementOpen(true)}
        >
          <ShoppingBag className="mr-3 h-5 w-5 text-cyan-500" />
          Welfare Price
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={() => setIsThemeDialogOpen(true)}
        >
          <Box className="mr-3 h-5 w-5 text-indigo-500" />
          Elements
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start text-left px-3 py-4 rounded-md text-base font-medium flex items-center transition-none hover:bg-gray-700 mb-2"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-5 w-5 text-red-500" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <>
      <div className="w-64 bg-gray-800 text-white h-screen fixed left-0 top-0 overflow-y-auto">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-6 flex items-center">
            <Package className="mr-2 h-5 w-5" />
            <span className="text-white">{userName}</span>
          </h2>
          <NavItems />
        </div>
      </div>

      {/* Items Dialog */}
      <StableDialog isOpen={isItemsDialogOpen} onClose={() => setIsItemsDialogOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Items Dashboard</h2>
          </div>
          <AddProductForm />
        </div>
      </StableDialog>

      {/* Category Dialog */}
      <StableDialog isOpen={isCategoryDialogOpen} onClose={() => setIsCategoryDialogOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Category Dashboard</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-purple-700">Total Categories</h3>
                  <span className="text-2xl font-bold text-purple-700">8</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-blue-700">Active Categories</h3>
                  <span className="text-2xl font-bold text-blue-700">6</span>
                </div>
              </CardContent>
            </Card>
            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium text-green-700">Items in Categories</h3>
                  <span className="text-2xl font-bold text-green-700">124</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-medium mb-4">Category List</h3>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Items Count</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <UITableRow>
                  <UITableCell className="font-medium">Furniture</UITableCell>
                  <UITableCell>Office furniture and fixtures</UITableCell>
                  <UITableCell className="text-right">45</UITableCell>
                  <UITableCell className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell className="font-medium">Stationery</UITableCell>
                  <UITableCell>Office stationery supplies</UITableCell>
                  <UITableCell className="text-right">32</UITableCell>
                  <UITableCell className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell className="font-medium">Electronics</UITableCell>
                  <UITableCell>Electronic devices and accessories</UITableCell>
                  <UITableCell className="text-right">28</UITableCell>
                  <UITableCell className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </UITableCell>
                </UITableRow>
                <UITableRow>
                  <UITableCell className="font-medium">Office Supplies</UITableCell>
                  <UITableCell>General office supplies</UITableCell>
                  <UITableCell className="text-right">19</UITableCell>
                  <UITableCell className="text-center">
                    <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                      Active
                    </Badge>
                  </UITableCell>
                </UITableRow>
              </TableBody>
            </Table>
          </div>
        </div>
      </StableDialog>

      {/* Theme Dialog */}
      <StableDialog isOpen={isThemeDialogOpen} onClose={() => setIsThemeDialogOpen(false)} width="433px" height="299px">
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Theme Settings</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Light Theme</span>
              <Switch
                id="light-theme"
                onCheckedChange={(checked) => {
                  if (checked) {
                    document.documentElement.classList.remove("dark")
                    document.documentElement.setAttribute("data-theme", "light")
                    localStorage.setItem("theme", "light")
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Dark Theme</span>
              <Switch
                id="dark-theme"
                onCheckedChange={(checked) => {
                  if (checked) {
                    document.documentElement.classList.add("dark")
                    document.documentElement.setAttribute("data-theme", "dark")
                    localStorage.setItem("theme", "dark")
                  }
                }}
              />
            </div>
            <div className="flex items-center justify-between">
              <span>Default Theme</span>
              <Switch
                id="default-theme"
                defaultChecked
                onCheckedChange={(checked) => {
                  if (checked) {
                    document.documentElement.removeAttribute("data-theme")
                    document.documentElement.classList.remove("dark")
                    localStorage.removeItem("theme")
                  }
                }}
              />
            </div>
          </div>
        </div>
      </StableDialog>

      {/* Top Issued Items Dialog - Updated dimensions */}
      <StableDialog
        isOpen={isTopIssuedItemsOpen}
        onClose={() => setIsTopIssuedItemsOpen(false)}
        width="1116px"
        height="672px"
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Top Issued Items</h2>
          </div>
          <TopIssuedItems />
        </div>
      </StableDialog>

      {/* Item Summary Dialog */}
      <StableDialog isOpen={isItemSummaryOpen} onClose={() => setIsItemSummaryOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Item Summary</h2>
          </div>
          <ItemSummary />
        </div>
      </StableDialog>

      {/* Reports Dialog - Adjusted close button position */}
      <StableDialog isOpen={isReportsOpen} onClose={() => setIsReportsOpen(false)} closeButtonTop="-8px">
        <ReportsForm onClose={() => setIsReportsOpen(false)} />
      </StableDialog>

      {/* Orders Dialog - Adjusted size and close button position */}
      <StableDialog isOpen={isOrdersOpen} onClose={() => setIsOrdersOpen(false)} height="780px" closeButtonTop="-8px">
        <OrdersForm onClose={() => setIsOrdersOpen(false)} />
      </StableDialog>

      {/* Invoice Dialog - Adjusted close button position */}
      <StableDialog
        isOpen={isInvoiceOpen}
        onClose={() => setIsInvoiceOpen(false)}
        width="1200px"
        height="650px"
        closeButtonTop="-8px"
      >
        <InvoiceForm onClose={() => setIsInvoiceOpen(false)} />
      </StableDialog>

      {/* Procurement Dialog - Adjusted close button position */}
      <StableDialog isOpen={isProcurementOpen} onClose={() => setIsProcurementOpen(false)} closeButtonTop="-8px">
        <ProcurementForm onClose={() => setIsProcurementOpen(false)} />
      </StableDialog>

      {/* Members Dialog - Adjusted size and close button position */}
      <StableDialog isOpen={isMembersOpen} onClose={() => setIsMembersOpen(false)} height="780px" closeButtonTop="-8px">
        <MembersForm onClose={() => setIsMembersOpen(false)} />
      </StableDialog>

      {/* Store Room Dialog - Added background color */}
      <StableDialog isOpen={isStoreRoomOpen} onClose={() => setIsStoreRoomOpen(false)}>
        <div style={{ backgroundColor: "#ece3f0", height: "100%" }}>
          <StoreRoomForm onClose={() => setIsStoreRoomOpen(false)} />
        </div>
      </StableDialog>

      {/* Store Reports Dialog */}
      <StableDialog isOpen={isStoreReportsOpen} onClose={() => setIsStoreReportsOpen(false)}>
        <StoreReportsForm />
      </StableDialog>

      {/* Add Product Dialog */}
      <StableDialog isOpen={isAddProductOpen} onClose={() => setIsAddProductOpen(false)}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Add New Product</h2>
          </div>
          <AddProductForm />
        </div>
      </StableDialog>

      {/* Fixed Assets Dialog */}
      <StableDialog isOpen={isFixedAssetsOpen} onClose={() => setIsFixedAssetsOpen(false)}>
        <FixedAssetsForm onClose={() => setIsFixedAssetsOpen(false)} />
      </StableDialog>
    </>
  )
}
;<style jsx global>{`
/* From Uiverse.io by namecho */
button,
button::after {
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

button::after {
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

button:hover::after {
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

