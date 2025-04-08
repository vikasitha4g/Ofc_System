"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  useEffect(() => {
    // Add console log for debugging
    console.log("Root page loaded, redirecting to login")
    router.replace("/login")
  }, [router])

  // Return a loading state while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-2">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
        <p className="text-sm text-gray-500">Redirecting to login...</p>
      </div>
    </div>
  )
}

