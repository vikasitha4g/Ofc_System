"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <div className="bg-white border border-gray-200 rounded-lg p-8 max-w-md text-center shadow-md">
        <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong!</h2>
        <p className="text-gray-600 mb-6">
          An error occurred while loading this page. Please try again or return to the login page.
        </p>
        <div className="space-x-4">
          <Button onClick={reset}>Try Again</Button>
          <Button variant="outline" asChild>
            <Link href="/login">Return to Login</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

