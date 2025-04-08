"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Eye, EyeOff } from "lucide-react"

interface LoginFormProps {
  handleLogin: (e: React.FormEvent) => void
  handleGoogleLogin: () => void
  handleFacebookLogin: () => void
  handleTwitterLogin: () => void
  loginData: {
    username: string
    password: string
    rememberMe: boolean
  }
  setLoginData: React.Dispatch<
    React.SetStateAction<{
      username: string
      password: string
      rememberMe: boolean
    }>
  >
  error: string | null
  isLoading: boolean
  fillAdminCredentials: () => void
}

const LoginForm: React.FC<LoginFormProps> = ({
  handleLogin,
  handleGoogleLogin,
  handleFacebookLogin,
  handleTwitterLogin,
  loginData,
  setLoginData,
  error,
  isLoading,
  fillAdminCredentials,
}) => {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)

  // Add snow animation effect
  useEffect(() => {
    if (typeof document !== "undefined") {
      const style = document.createElement("style")
      const rules = []
      const snowflakesCount = 50

      rules.push(`
        .snow-container {
          height: 100%;
          width: 100%;
          max-width: 100%;
          top: 0;
          overflow: hidden;
          position: absolute;
          z-index: 2;
          pointer-events: none;
        }

        .snowflake {
          position: absolute;
          background-color: white;
          opacity: 0.8;
          border-radius: 50%;
          animation: fall linear forwards;
        }
      `)

      for (let i = 0; i < snowflakesCount; i++) {
        const rule = `
          .snowflake:nth-child(${i}) {
            width: ${Math.random() * 5 + 2}px;
            height: ${Math.random() * 5 + 2}px;
            left: ${Math.random() * 100}%;
            top: -5px;
            opacity: ${Math.random() * 0.8 + 0.2};
            animation-duration: ${Math.random() * 10 + 5}s;
            animation-delay: ${Math.random() * 5}s;
          }
        `
        rules.push(rule)
      }

      rules.push(`
        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }
      `)

      style.textContent = rules.join("")
      document.head.appendChild(style)

      const container = document.querySelector(".snow-container")
      if (container) {
        for (let i = 0; i < snowflakesCount; i++) {
          const snowflake = document.createElement("div")
          snowflake.className = "snowflake"
          container.appendChild(snowflake)
        }
      }

      return () => {
        document.head.removeChild(style)
      }
    }
  }, [])

  return (
    <div className="flex w-full max-w-6xl bg-white rounded-xl shadow-xl overflow-hidden">
      {/* Left side - Login image with snow animation */}
      <div className="hidden md:block md:w-1/2 relative overflow-hidden">
        <div className="snow-container absolute inset-0 pointer-events-none z-10"></div>
        <img
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/front-XsiyW8RyXxVG8gwLLwCuyugrK8f9Lx.jpeg"
          alt="Login illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right side - Login form */}
      <div className="w-full md:w-1/2 p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Login</h1>
          <p className="text-gray-500 text-sm mt-1">
            Don't have an account yet?
            <button
              onClick={() => setActiveTab("register")}
              className="text-purple-600 font-medium ml-1 hover:underline"
            >
              Sign Up
            </button>
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="you@example.com"
                  value={loginData.username}
                  onChange={(e) => setLoginData({ ...loginData, username: e.target.value })}
                  required
                  className="border-gray-300"
                />
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <button type="button" className="text-xs text-purple-600 hover:underline">
                    Forgot Password?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter 6 character or more"
                    value={loginData.password}
                    onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                    required
                    className="border-gray-300"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0 h-full px-3 text-gray-400"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    <span className="sr-only">{showPassword ? "Hide password" : "Show password"}</span>
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  checked={loginData.rememberMe}
                  onCheckedChange={(checked) => setLoginData({ ...loginData, rememberMe: checked as boolean })}
                />
                <label
                  htmlFor="remember"
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-gray-600"
                >
                  Remember me
                </label>
              </div>

              {error && (
                <p
                  className={`text-sm font-medium p-2 rounded-md ${
                    error.includes("successful") ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"
                  }`}
                >
                  {error}
                </p>
              )}

              <Button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center gap-1">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    Logging in...
                  </span>
                ) : (
                  <span className="uppercase font-medium">Login</span>
                )}
              </Button>

              <div className="relative flex items-center justify-center mt-6">
                <div className="border-t border-gray-200 w-full"></div>
                <div className="bg-white px-3 text-sm text-gray-500 absolute">or login with</div>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6">
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  onClick={handleGoogleLogin}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5"
                  >
                    <path
                      fill="#EA4335"
                      d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0545455,0 12,0 C7.27006974,0 3.1977497,2.69829785 1.23999023,6.65002441 L5.26620003,9.76452941 Z"
                    />
                    <path
                      fill="#34A853"
                      d="M16.0407269,18.0125889 C14.9509167,18.7163016 13.5660892,19.0909091 12,19.0909091 C8.86648613,19.0909091 6.21911939,17.076871 5.27698177,14.2678769 L1.23746264,17.3349879 C3.19279051,21.2936293 7.26500293,24 12,24 C14.9328362,24 17.7353462,22.9573905 19.834192,20.9995801 L16.0407269,18.0125889 Z"
                    />
                    <path
                      fill="#4A90E2"
                      d="M19.834192,20.9995801 C22.0291676,18.9520994 23.4545455,15.903663 23.4545455,12 C23.4545455,11.2909091 23.3454545,10.5272727 23.1818182,9.81818182 L12,9.81818182 L12,14.4545455 L18.4363636,14.4545455 C18.1187732,16.013626 17.2662994,17.2212117 16.0407269,18.0125889 L19.834192,20.9995801 Z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.27698177,14.2678769 C5.03832634,13.556323 4.90909091,12.7937589 4.90909091,12 C4.90909091,11.2182781 5.03443647,10.4668121 5.26620003,9.76452941 L1.23999023,6.65002441 C0.43658717,8.26043162 0,10.0753848 0,12 C0,13.9195484 0.444780743,15.7301709 1.23746264,17.3349879 L5.27698177,14.2678769 Z"
                    />
                  </svg>
                  <span>Google</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  onClick={handleFacebookLogin}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5 text-blue-600 fill-current"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  <span>Facebook</span>
                </Button>
                <Button
                  variant="outline"
                  type="button"
                  className="flex items-center justify-center gap-2"
                  onClick={handleTwitterLogin}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                    className="w-5 h-5 text-blue-400 fill-current"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723 10.054 10.054 0 01-3.127 1.184 4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                  <span>Twitter</span>
                </Button>
              </div>

              <div className="text-xs text-center text-gray-500 mt-4">
                <p>Admin credentials for demo:</p>
                <Button variant="link" className="h-auto p-0 text-xs text-purple-600" onClick={fillAdminCredentials}>
                  Username: Darshana | Password: 123
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="register">{/* Register form content remains the same */}</TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginForm

