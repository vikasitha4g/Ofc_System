"use client"

import { useState, useEffect } from "react"

export default function WallClock() {
  const [time, setTime] = useState<string>("00:00:00")

  useEffect(() => {
    // Function to update the time
    const updateTime = () => {
      const now = new Date()
      const hours = now.getHours().toString().padStart(2, "0")
      const minutes = now.getMinutes().toString().padStart(2, "0")
      const seconds = now.getSeconds().toString().padStart(2, "0")
      setTime(`${hours}:${minutes}:${seconds}`)
    }

    // Update time immediately
    updateTime()

    // Set up interval to update time every second
    const interval = setInterval(updateTime, 1000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-right">
      <div className="text-lg font-bold text-white">{time}</div>
    </div>
  )
}

