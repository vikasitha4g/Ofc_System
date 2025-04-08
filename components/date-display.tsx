"use client"

import { useState, useEffect } from "react"

export default function DateDisplay() {
  const [date, setDate] = useState<string>("")

  useEffect(() => {
    // Function to update the date
    const updateDate = () => {
      const now = new Date()
      const options: Intl.DateTimeFormatOptions = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      }
      setDate(now.toLocaleDateString("en-US", options))
    }

    // Update date immediately
    updateDate()

    // Set up interval to update date every minute (in case day changes at midnight)
    const interval = setInterval(updateDate, 60000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-right">
      <div className="text-xs text-gray-300">{date}</div>
    </div>
  )
}

