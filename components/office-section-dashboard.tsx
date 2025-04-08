"use client"

import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"
import StaffManagementForm from "./staff-management-form"

export default function OfficeSectionDashboard() {
  const router = useRouter()
  const [showStaffManagement, setShowStaffManagement] = useState(false)

  // Handle box click - only Accounts box should redirect to inventory system
  const handleBoxClick = (section: string) => {
    if (section === "Accounts") {
      router.push("/dashboard")
    } else if (section === "Establishment") {
      router.push("/establishment-activities")
    } else {
      alert(`${section} section is not implemented in this demo`)
    }
  }

  // Create snow and flower animations effect
  useEffect(() => {
    // Create snowflakes
    const createSnowflakes = () => {
      const snowflakesCount = 100
      const snowContainer = document.querySelector(".snow-container")

      if (snowContainer) {
        // Clear existing snowflakes
        snowContainer.innerHTML = ""

        for (let i = 0; i < snowflakesCount; i++) {
          const snowflake = document.createElement("div")
          snowflake.className = "snowflake"

          // Randomize snowflake properties
          snowflake.style.left = `${Math.random() * 100}%`
          snowflake.style.opacity = `${Math.random() * 0.8 + 0.2}`
          snowflake.style.width = `${Math.random() * 5 + 2}px`
          snowflake.style.height = snowflake.style.width

          // Randomize animation duration and delay
          snowflake.style.animationDuration = `${Math.random() * 10 + 5}s`
          snowflake.style.animationDelay = `${Math.random() * 5}s`

          snowContainer.appendChild(snowflake)
        }
      }
    }

    // Create flower petals
    const createFlowerPetals = () => {
      const petalsCount = 80
      const petalsContainer = document.querySelector(".petals-container")

      if (petalsContainer) {
        // Clear existing petals
        petalsContainer.innerHTML = ""

        for (let i = 0; i < petalsCount; i++) {
          const petal = document.createElement("div")
          petal.className = "petal"

          // Randomize petal properties
          petal.style.left = `${Math.random() * 100}%`
          petal.style.opacity = `${Math.random() * 0.7 + 0.3}`

          // Randomize petal size (slightly larger than snowflakes)
          const size = Math.random() * 10 + 5
          petal.style.width = `${size}px`
          petal.style.height = `${size}px`

          // Randomize animation duration and delay
          petal.style.animationDuration = `${Math.random() * 15 + 10}s`
          petal.style.animationDelay = `${Math.random() * 5}s`

          // Randomize rotation
          petal.style.transform = `rotate(${Math.random() * 360}deg)`

          petalsContainer.appendChild(petal)
        }
      }
    }

    createSnowflakes()
    createFlowerPetals()

    // Recreate animations periodically to ensure continuous animation
    const snowInterval = setInterval(createSnowflakes, 15000)
    const petalInterval = setInterval(createFlowerPetals, 15000)

    return () => {
      clearInterval(snowInterval)
      clearInterval(petalInterval)
    }
  }, [])

  // If staff management is shown, render that instead of the dashboard
  if (showStaffManagement) {
    return <StaffManagementForm />
  }

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden"
      style={{ backgroundColor: "#003153" }}
    >
      {/* Snow container - increased z-index to appear over boxes */}
      <div className="snow-container absolute inset-0 pointer-events-none z-15"></div>

      {/* Flower petals container */}
      <div className="petals-container absolute inset-0 pointer-events-none z-10"></div>

      <div
        className="relative z-5 rounded-lg shadow-2xl p-8 bg-opacity-90"
        style={{ width: "1191px", height: "auto", backgroundColor: "#990000" }}
      >
        {/* Logo at the top center */}
        <div className="flex justify-center mb-6">
          <div className="relative w-32 h-32">
            <Image
              src="/images/logo.jpg"
              alt="Galenbindunuwewa Divisional Secretariat Logo"
              width={128}
              height={128}
              className="rounded-full"
            />
          </div>
        </div>

        <h1
          className="text-center text-3xl font-bold mb-8 text-white"
          style={{ textShadow: "0 0 10px rgba(255,255,255,0.5)" }}
        >
          Divisional Secretariat - Galenbindunuwewa
        </h1>

        <div className="grid grid-cols-3 gap-6 justify-center">
          {/* First Row */}
          <div
            className="box-card bg-[#0070BB] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Establishment")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Establishment</h2>
                <p className="text-white/80">Administrative services and personnel management</p>
              </div>

              {/* Section image */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Establishment-hs0ILx11eJSXdQvbr3YIMSND59PpV4.png"
                  alt="Establishment"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>

          <div
            className="box-card bg-[#00A86B] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Land")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Land</h2>
                <p className="text-white/80">Land administration and management services</p>
              </div>

              {/* Section image */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/land-NTwW0IEMiSx6ea03wFfTC439ZgpQpJ.png"
                  alt="Land"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>

          <div
            className="box-card bg-[#f9c74f] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Accounts")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Accounts</h2>
                <p className="text-white/80">Financial management and inventory control</p>
              </div>

              {/* Section image */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Accounts-97TyOyQndtzTx66mXXZGD41lN43m8q.png"
                  alt="Accounts"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div
            className="box-card bg-[#4B3621] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Development")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Development</h2>
                <p className="text-white/80">Regional development projects and initiatives</p>
              </div>

              {/* Section image */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Development-UlcSixQDQ0uHfZCFIJrE4lUmw307G6.png"
                  alt="Development"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>

          <div
            className="box-card bg-[#008B8B] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Field Officers")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Field Officers</h2>
                <p className="text-white/80">Field operations and community services</p>
              </div>

              {/* Section image */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/field%20officers-s3qxrJNQztON0L2t1b72Umu3WSSScN.png"
                  alt="Field Officers"
                  width={80}
                  height={80}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>

          <div
            className="box-card bg-[#004953] rounded-lg p-6 shadow-md cursor-pointer hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            onClick={() => handleBoxClick("Grama Niladhari")}
            style={{ height: "279px", width: "359px" }}
          >
            <div className="flex flex-col h-full">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-2">Grama Niladhari</h2>
                <p className="text-white/80">Village officer services and local administration</p>
              </div>

              {/* Section image with specific dimensions */}
              <div className="flex justify-center my-4">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Grama%20niladhari-Lh9UFANuJoybb1c0c61Rhn7VcBXZFR.png"
                  alt="Grama Niladhari"
                  width={52}
                  height={41}
                  className="rounded-md"
                />
              </div>

              <div className="flex justify-end items-center mt-2">
                <span className="text-white text-sm">More info</span>
                <ArrowRight className="h-4 w-4 ml-1 text-white arrow-icon" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for snow animation, flower petals, and box hover effects */}
      <style jsx global>{`
        .snow-container {
          height: 100%;
          width: 100%;
          max-width: 100%;
          top: 0;
          overflow: hidden;
          position: absolute;
          z-index: 15;
          pointer-events: none;
        }

        .snowflake {
          position: absolute;
          background-color: white;
          border-radius: 50%;
          opacity: 0.8;
          top: -5px;
          animation: fall linear forwards;
        }

        .petals-container {
          height: 100%;
          width: 100%;
          max-width: 100%;
          top: 0;
          overflow: hidden;
          position: absolute;
          z-index: 10;
          pointer-events: none;
        }

        .petal {
          position: absolute;
          background-color: #ff9cba; /* Light pink for peach blossom */
          border-radius: 50% 0 50% 0; /* Petal shape */
          opacity: 0.6;
          top: -10px;
          animation: fallAndSway linear forwards;
          box-shadow: 0 0 5px rgba(255, 156, 186, 0.3);
        }

        @keyframes fall {
          to {
            transform: translateY(100vh);
          }
        }

        @keyframes fallAndSway {
          0% {
            transform: translateY(0) rotate(0deg) translateX(0);
          }
          25% {
            transform: translateY(25vh) rotate(90deg) translateX(10px);
          }
          50% {
            transform: translateY(50vh) rotate(180deg) translateX(-10px);
          }
          75% {
            transform: translateY(75vh) rotate(270deg) translateX(10px);
          }
          100% {
            transform: translateY(100vh) rotate(360deg) translateX(0);
          }
        }

        .box-card {
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .box-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 70%);
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
        }

        .box-card:hover::before {
          opacity: 1;
        }

        .box-card:hover {
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
        }

        .arrow-icon {
          transition: transform 0.3s ease;
        }

        .box-card:hover .arrow-icon {
          transform: translateX(5px);
        }
      `}</style>
    </div>
  )
}

