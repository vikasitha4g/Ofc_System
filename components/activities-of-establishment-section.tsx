"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Home, Users, Calendar, FileText, Shield, Archive, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import StaffManagementForm from "./staff-management-form"
import StaffLeaveManagement from "./staff-leave-management"

export default function ActivitiesOfEstablishmentSection() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  const handleTabClick = (tab: string) => {
    setActiveTab(tab)
  }

  const handleClose = () => {
    router.push("/office-section")
  }

  return (
    <div className="flex h-screen w-full overflow-hidden">
      {/* Left Sidebar */}
      <div className="w-20 bg-[#00A3D9] flex flex-col items-center py-6 text-white">
        <div className="flex flex-col items-center space-y-8">
          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "home" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("home")}
          >
            <Home size={24} />
            <span className="text-xs mt-1">Home</span>
          </div>

          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "staff" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("staff")}
          >
            <Users size={24} />
            <span className="text-xs mt-1">Staff</span>
          </div>

          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "leave" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("leave")}
          >
            <Calendar size={24} />
            <span className="text-xs mt-1">Leave</span>
          </div>

          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "br" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("br")}
          >
            <FileText size={24} />
            <span className="text-xs mt-1">BR</span>
          </div>

          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "firearms" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("firearms")}
          >
            <Shield size={24} />
            <span className="text-xs mt-1">Firearms</span>
          </div>

          <div
            className={`p-3 rounded-lg cursor-pointer transition-all ${activeTab === "archive" ? "bg-white/20" : "hover:bg-white/10"}`}
            onClick={() => handleTabClick("archive")}
          >
            <Archive size={24} />
            <span className="text-xs mt-1">Archive</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 bg-[#F0F7FA] overflow-auto">
        {activeTab === "staff" ? (
          <StaffManagementForm />
        ) : activeTab === "leave" ? (
          <StaffLeaveManagement />
        ) : (
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div className="relative w-80">
                <Input type="text" placeholder="SEARCH" className="pl-10 pr-4 py-2 rounded-full border-gray-300" />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-600" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </div>
                {/* Removed Close button as requested */}
              </div>
            </div>

            {/* Welcome Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="bg-gradient-to-r from-[#4A9DFF] to-[#9747FF] rounded-xl p-6 text-white">
                <h2 className="text-2xl font-bold mb-1">WELCOME BACK, ADMIN</h2>
                <p className="text-sm opacity-80 mb-4">
                  Access and manage all establishment section activities from this dashboard
                </p>
                <div className="flex items-center">
                  <div className="bg-white/20 rounded-full p-2">
                    <Users className="h-8 w-8" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-4">QUICK STATS</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">Total Staff</p>
                    <p className="text-2xl font-bold text-blue-600">124</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-500">On Leave</p>
                    <p className="text-2xl font-bold text-green-600">7</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Activities Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="bg-white rounded-xl p-6 shadow-sm col-span-2">
                <h3 className="text-lg font-medium text-gray-700 mb-4">RECENT ACTIVITIES</h3>
                <div className="space-y-4">
                  {[1, 2, 3].map((item) => (
                    <div key={item} className="flex items-start p-3 border-b border-gray-100">
                      <div className="bg-blue-100 rounded-full p-2 mr-4">
                        <FileText className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">Staff Record Updated</p>
                        <p className="text-sm text-gray-500">
                          Employee ID: ES{1000 + item} • {item} hour{item !== 1 ? "s" : ""} ago
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm">
                <h3 className="text-lg font-medium text-gray-700 mb-4">PENDING TASKS</h3>
                <div className="space-y-3">
                  {[
                    "Review leave applications",
                    "Update staff records",
                    "Process retirement documents",
                    "Prepare monthly report",
                  ].map((task, index) => (
                    <div key={index} className="flex items-center">
                      <div className="h-4 w-4 rounded-full border border-blue-500 mr-3"></div>
                      <p className="text-sm">{task}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Modules Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-medium text-gray-700 mb-4">ESTABLISHMENT MODULES</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  {
                    name: "Staff Management",
                    icon: <Users className="h-6 w-6 text-blue-600" />,
                    action: () => handleTabClick("staff"),
                  },
                  {
                    name: "Leave Management",
                    icon: <Calendar className="h-6 w-6 text-green-600" />,
                    action: () => handleTabClick("leave"),
                  },
                  {
                    name: "BR Management",
                    icon: <FileText className="h-6 w-6 text-purple-600" />,
                    action: () => handleTabClick("br"),
                  },
                  {
                    name: "Archive",
                    icon: <Archive className="h-6 w-6 text-orange-600" />,
                    action: () => handleTabClick("archive"),
                  },
                ].map((module, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={module.action}
                  >
                    <div className="bg-white p-3 rounded-full mb-3 shadow-sm">{module.icon}</div>
                    <p className="text-sm font-medium text-center">{module.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

