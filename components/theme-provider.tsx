"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"
import type { ThemeProviderProps } from "next-themes/dist/types"

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  React.useEffect(() => {
    // Check for saved theme preference
    const savedTheme = localStorage.getItem("theme")
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark")
      document.documentElement.setAttribute("data-theme", "dark")
    } else if (savedTheme === "light") {
      document.documentElement.classList.remove("dark")
      document.documentElement.setAttribute("data-theme", "light")
    }
  }, [])

  return <NextThemesProvider {...props}>{children}</NextThemesProvider>
}

