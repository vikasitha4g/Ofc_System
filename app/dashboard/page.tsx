"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"
import DashboardContent from "@/components/dashboard-content"
import DashboardSidebar from "@/components/layout/dashboard-sidebar"
import { Button } from "@/components/ui/button"

export default function DashboardPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated
    try {
      const authToken = localStorage.getItem("auth-token")

      if (!authToken) {
        console.log("No auth token found, redirecting to login")
        router.replace("/login")
        return
      }

      console.log("Auth token found, user is authenticated")
      setIsAuthenticated(true)
      setIsLoading(false)

      // Add event listener for opening Items Dashboard
      const handleOpenItemsDashboard = () => {
        // Find the Items Dashboard button in the sidebar and click it
        const itemsButton = document.querySelector('[data-sidebar-item="items"]')
        if (itemsButton) {
          ;(itemsButton as HTMLElement).click()
        }
      }

      document.addEventListener("openItemsDashboard", handleOpenItemsDashboard)

      // Clean up event listener
      return () => {
        document.removeEventListener("openItemsDashboard", handleOpenItemsDashboard)
      }
    } catch (e) {
      console.error("Authentication error:", e)
      setError("Authentication error. Please try logging in again.")
      setIsLoading(false)
    }
  }, [router])

  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => router.push("/login")}>Return to Login</Button>
        </div>
      </div>
    )
  }

  // Handle loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  // Update the dashboard layout to properly position content next to sidebar
  return isAuthenticated ? (
    <div className="flex min-h-screen">
      <DashboardSidebar />
      <div className="flex-1 ml-64">
        {" "}
        {/* Add margin-left to prevent content from overlapping sidebar */}
        <DashboardContent />
      </div>
    </div>
  ) : (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <p className="text-red-500">Authentication required</p>
        <Button onClick={() => router.push("/login")}>Go to Login</Button>
      </div>
    </div>
  )
}

