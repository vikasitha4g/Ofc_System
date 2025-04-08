"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Users,
  Calendar,
  FileText,
  Shield,
  Archive,
  Search,
  Bell,
  Menu,
  User,
  BarChart3,
  Clock,
  FileBarChart,
  Briefcase,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import StaffManagementForm from "@/components/staff-management-form"
import StaffLeaveManagement from "@/components/staff-leave-management"

export default function EstablishmentActivitiesPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("home")

  // Function to render the appropriate content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "staff-management":
        return <StaffManagementForm />
      case "leave-management":
        return <StaffLeaveManagement />
      case "home":
        return <DashboardContent />
      default:
        return <ComingSoonContent tabName={activeTab} />
    }
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-20 md:w-64 bg-gradient-to-b from-blue-500 to-blue-700 text-white flex flex-col">
        <div className="p-4 flex items-center justify-center md:justify-start">
          <h1 className="text-xl font-bold hidden md:block">Establishment</h1>
          <span className="md:hidden text-2xl font-bold">E</span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <nav className="px-2 py-4 space-y-2">
            <SidebarItem
              icon={<Home size={24} className="text-yellow-300" />}
              label="Home"
              active={activeTab === "home"}
              onClick={() => setActiveTab("home")}
            />
            <SidebarItem
              icon={<Users size={24} className="text-green-300" />}
              label="Staff Management"
              active={activeTab === "staff-management"}
              onClick={() => setActiveTab("staff-management")}
            />
            <SidebarItem
              icon={<Calendar size={24} className="text-red-300" />}
              label="Leave Management"
              active={activeTab === "leave-management"}
              onClick={() => setActiveTab("leave-management")}
            />
            <SidebarItem
              icon={<FileText size={24} className="text-purple-300" />}
              label="BR Management"
              active={activeTab === "br-management"}
              onClick={() => setActiveTab("br-management")}
            />
            <SidebarItem
              icon={<Shield size={24} className="text-orange-300" />}
              label="Firearms Licenses"
              active={activeTab === "firearms-licenses"}
              onClick={() => setActiveTab("firearms-licenses")}
            />
            <SidebarItem
              icon={<Archive size={24} className="text-pink-300" />}
              label="Archive Work"
              active={activeTab === "archive-work"}
              onClick={() => setActiveTab("archive-work")}
            />
          </nav>
        </div>

        <div className="p-4">
          <Button
            variant="outline"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white border-white"
            onClick={() => router.push("/office-section")}
          >
            Back to Office
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        {activeTab === "home" && (
          <header className="bg-white shadow-sm p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Menu className="h-6 w-6 text-gray-500 cursor-pointer md:hidden" />
                <h1 className="text-xl font-semibold text-gray-800">Activities of Establishment Section</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Search..."
                    className="pl-10 pr-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                </div>

                <div className="relative">
                  <Bell className="h-6 w-6 text-gray-500 cursor-pointer" />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                    3
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-white">
                    <User className="h-5 w-5" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 hidden md:block">Admin</span>
                </div>
              </div>
            </div>
          </header>
        )}

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-50">{renderContent()}</main>
      </div>
    </div>
  )
}

// Sidebar Item Component
function SidebarItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      className={`flex items-center space-x-3 w-full p-3 rounded-lg transition-colors ${
        active ? "bg-blue-800 text-white" : "text-blue-100 hover:bg-blue-600"
      }`}
      onClick={onClick}
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="hidden md:block">{label}</span>
    </button>
  )
}

// Dashboard Content Component
function DashboardContent() {
  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white mb-6 shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Welcome to Establishment Section</h2>
            <p className="text-blue-100 max-w-2xl">
              Manage staff records, leave applications, BR management, firearms licenses, and archive work efficiently.
            </p>
          </div>
          <img
            src="/placeholder.svg?height=120&width=120"
            alt="Establishment"
            className="mt-4 md:mt-0 h-24 w-24 object-cover rounded-full bg-white p-1"
          />
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <StatCard
          title="Total Staff"
          value="124"
          icon={<Users className="h-8 w-8 text-blue-500" />}
          change="+3 this month"
          color="blue"
        />
        <StatCard
          title="Pending Leave"
          value="8"
          icon={<Calendar className="h-8 w-8 text-green-500" />}
          change="5 approved today"
          color="green"
        />
        <StatCard
          title="BR Requests"
          value="15"
          icon={<FileText className="h-8 w-8 text-amber-500" />}
          change="3 pending approval"
          color="amber"
        />
        <StatCard
          title="Firearms Licenses"
          value="42"
          icon={<Shield className="h-8 w-8 text-red-500" />}
          change="2 expiring soon"
          color="red"
        />
      </div>

      {/* Quick Access Modules */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Access</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <ModuleCard
          title="Staff Management"
          description="Manage staff records, appointments, and details"
          icon={<Users className="h-10 w-10 text-blue-500" />}
          onClick={() => {}}
        />
        <ModuleCard
          title="Leave Management"
          description="Process leave applications and track balances"
          icon={<Calendar className="h-10 w-10 text-green-500" />}
          onClick={() => {}}
        />
        <ModuleCard
          title="BR Management"
          description="Handle BR requests and approvals"
          icon={<FileText className="h-10 w-10 text-amber-500" />}
          onClick={() => {}}
        />
        <ModuleCard
          title="Firearms Licenses"
          description="Process and track firearms license applications"
          icon={<Shield className="h-10 w-10 text-red-500" />}
          onClick={() => {}}
        />
        <ModuleCard
          title="Archive Work"
          description="Access and manage archived documents"
          icon={<Archive className="h-10 w-10 text-purple-500" />}
          onClick={() => {}}
        />
        <ModuleCard
          title="Reports & Analytics"
          description="Generate reports and view analytics"
          icon={<BarChart3 className="h-10 w-10 text-indigo-500" />}
          onClick={() => {}}
        />
      </div>

      {/* Recent Activities */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="bg-white rounded-xl shadow-md p-6 flex-1">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <Clock className="mr-2 h-5 w-5 text-blue-500" />
            Recent Activities
          </h3>
          <div className="space-y-4">
            <ActivityItem
              title="Leave Approved"
              description="Sachini Rasnayaka's leave request was approved"
              time="2 hours ago"
            />
            <ActivityItem
              title="New Staff Added"
              description="Hiroshini Kumari was added to the staff database"
              time="Yesterday"
            />
            <ActivityItem
              title="BR Request Processed"
              description="BR request #2023-45 was processed and approved"
              time="Yesterday"
            />
            <ActivityItem
              title="Firearms License Renewed"
              description="License #FL-2023-089 was renewed for 2 years"
              time="2 days ago"
            />
            <ActivityItem
              title="Documents Archived"
              description="15 documents were moved to the digital archive"
              time="3 days ago"
            />
          </div>
          <Button variant="outline" className="w-full mt-4">
            View All Activities
          </Button>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 md:w-80 lg:w-96">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <FileBarChart className="mr-2 h-5 w-5 text-blue-500" />
            Upcoming Tasks
          </h3>
          <div className="space-y-3">
            <TaskItem title="Staff Performance Review" date="April 15, 2025" priority="High" />
            <TaskItem title="Process Leave Applications" date="April 8, 2025" priority="Medium" />
            <TaskItem title="Update Staff Records" date="April 10, 2025" priority="Medium" />
            <TaskItem title="Firearms License Renewals" date="April 20, 2025" priority="Low" />
            <TaskItem title="Monthly Report Submission" date="April 30, 2025" priority="High" />
          </div>
          <Button variant="outline" className="w-full mt-4">
            View Calendar
          </Button>
        </div>
      </div>
    </div>
  )
}

// Stat Card Component
function StatCard({
  title,
  value,
  icon,
  change,
  color,
}: {
  title: string
  value: string
  icon: React.ReactNode
  change: string
  color: string
}) {
  const bgColor = `bg-${color}-50`
  const borderColor = `border-${color}-200`

  return (
    <div className={`bg-white border ${borderColor} rounded-xl p-6 shadow-sm`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="text-3xl font-bold mt-1 text-gray-800">{value}</h3>
        </div>
        <div className={`p-3 rounded-full ${bgColor}`}>{icon}</div>
      </div>
      <p className="text-xs text-gray-500 mt-4">{change}</p>
    </div>
  )
}

// Module Card Component
function ModuleCard({
  title,
  description,
  icon,
  onClick,
}: {
  title: string
  description: string
  icon: React.ReactNode
  onClick: () => void
}) {
  return (
    <div
      className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start">
        <div className="p-3 rounded-full bg-gray-50 mr-4">{icon}</div>
        <div>
          <h3 className="font-semibold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        </div>
      </div>
    </div>
  )
}

// Activity Item Component
function ActivityItem({
  title,
  description,
  time,
}: {
  title: string
  description: string
  time: string
}) {
  return (
    <div className="border-b border-gray-100 pb-3">
      <div className="flex justify-between">
        <h4 className="font-medium text-gray-800">{title}</h4>
        <span className="text-xs text-gray-400">{time}</span>
      </div>
      <p className="text-sm text-gray-500 mt-1">{description}</p>
    </div>
  )
}

// Task Item Component
function TaskItem({
  title,
  date,
  priority,
}: {
  title: string
  date: string
  priority: "High" | "Medium" | "Low"
}) {
  const getPriorityColor = () => {
    switch (priority) {
      case "High":
        return "text-red-500 bg-red-50"
      case "Medium":
        return "text-amber-500 bg-amber-50"
      case "Low":
        return "text-green-500 bg-green-50"
      default:
        return "text-gray-500 bg-gray-50"
    }
  }

  return (
    <div className="flex items-center justify-between p-3 border border-gray-100 rounded-lg">
      <div className="flex items-center">
        <Briefcase className="h-5 w-5 text-blue-500 mr-3" />
        <div>
          <h4 className="font-medium text-gray-800 text-sm">{title}</h4>
          <p className="text-xs text-gray-500">{date}</p>
        </div>
      </div>
      <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor()}`}>{priority}</span>
    </div>
  )
}

// Coming Soon Component
function ComingSoonContent({ tabName }: { tabName: string }) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-6">
      <div className="text-6xl mb-4">🚧</div>
      <h2 className="text-2xl font-bold text-gray-800 mb-2">Coming Soon</h2>
      <p className="text-gray-600 text-center max-w-md mb-6">
        The{" "}
        {tabName
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")}{" "}
        module is currently under development and will be available soon.
      </p>
      <Button onClick={() => window.history.back()}>Go Back</Button>
    </div>
  )
}

