"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginForm from "@/components/login-form"

export default function LoginPage() {
  const router = useRouter()
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  })
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  // Check if already logged in
  useEffect(() => {
    try {
      const authToken = localStorage.getItem("auth-token")
      if (authToken) {
        console.log("User already logged in, redirecting to office section")
        router.push("/office-section")
      }
    } catch (e) {
      console.error("LocalStorage error:", e)
    }
  }, [router])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log("Attempting login with:", loginData.username)

      // Simulate API call
      setTimeout(() => {
        // Simple validation
        if (loginData.username === "Darshana" && loginData.password === "123") {
          console.log("Login successful")

          // Store auth token in localStorage
          localStorage.setItem("auth-token", "sample-token-123")
          localStorage.setItem("user-role", "admin")

          // Redirect to office section dashboard instead of main dashboard
          router.push("/office-section")
        } else {
          console.log("Login failed: Invalid credentials")
          setError("Invalid username or password. Please try again.")
        }
        setIsLoading(false)
      }, 1000) // Reduced timeout for faster login
    } catch (e) {
      console.error("Login error:", e)
      setError("An error occurred during login. Please try again.")
      setIsLoading(false)
    }
  }

  const handleGoogleLogin = () => {
    setError("Google login is not implemented in this demo.")
  }

  const handleFacebookLogin = () => {
    setError("Facebook login is not implemented in this demo.")
  }

  const handleTwitterLogin = () => {
    setError("Twitter login is not implemented in this demo.")
  }

  const fillAdminCredentials = () => {
    setLoginData({
      username: "Darshana",
      password: "123",
      rememberMe: false,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <LoginForm
        handleLogin={handleLogin}
        handleGoogleLogin={handleGoogleLogin}
        handleFacebookLogin={handleFacebookLogin}
        handleTwitterLogin={handleTwitterLogin}
        loginData={loginData}
        setLoginData={setLoginData}
        error={error}
        isLoading={isLoading}
        fillAdminCredentials={fillAdminCredentials}
      />
    </div>
  )
}

