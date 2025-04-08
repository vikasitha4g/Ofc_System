"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { format, addDays, differenceInDays } from "date-fns"
import {
  CalendarIcon,
  Download,
  X,
  ChevronLeft,
  ChevronRight,
  CalendarPlus2Icon as CalendarIcon2,
  FileText,
  Clock,
} from "lucide-react"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { Settings } from "lucide-react"

type LeaveRecord = {
  id: string
  empId: string
  empName: string
  date: Date
  leaveType: string
  reason: string
}

type Employee = {
  id: string
  empId: string
  empName: string
  leaveHistory: {
    privilegeLeave: number
    leaveWithoutPay: number
    sickLeave: number
    casualLeave: number
    maternityLeave: number
    weddingLeave: number
    halfdayLeave: number
    total: number
  }
}

type LeaveType = {
  name: string
  code: string
  color: string
}

export default function StaffLeaveManagement() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("leave-tracker")
  const [startDate, setStartDate] = useState<Date>(new Date(2025, 0, 1)) // Jan 1, 2025
  const [endDate, setEndDate] = useState<Date>(new Date(2025, 0, 31)) // Jan 31, 2025
  const [selectedMonth, setSelectedMonth] = useState("April-2025")
  const [selectedYear, setSelectedYear] = useState("2025")
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null)
  const [employeeId, setEmployeeId] = useState("")
  const [employeeName, setEmployeeName] = useState("")
  const [leaveStartDate, setLeaveStartDate] = useState<Date | undefined>(new Date(2025, 3, 1)) // Apr 1, 2025
  const [leaveEndDate, setLeaveEndDate] = useState<Date | undefined>(new Date(2025, 3, 10)) // Apr 10, 2025
  const [leaveType, setLeaveType] = useState("PL")
  const [leaveReason, setLeaveReason] = useState("")
  const [leaveDuration, setLeaveDuration] = useState(10)

  // Calendar state for Mark Leave tab
  const [calendarMonth, setCalendarMonth] = useState("April")
  const [calendarYear, setCalendarYear] = useState("2025")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedDates, setSelectedDates] = useState<Date[]>([])

  // Sample data
  const [leaveRecords, setLeaveRecords] = useState<LeaveRecord[]>([
    {
      id: "1",
      empId: "10009",
      empName: "Jeffrey Simmons",
      date: new Date(2025, 0, 20),
      leaveType: "LWP",
      reason: "Personal",
    },
    {
      id: "2",
      empId: "10006",
      empName: "Sahra Melendez",
      date: new Date(2025, 0, 12),
      leaveType: "PL",
      reason: "Family event",
    },
    {
      id: "3",
      empId: "10014",
      empName: "Rickie Preece",
      date: new Date(2025, 0, 29),
      leaveType: "SL",
      reason: "Sick",
    },
    {
      id: "4",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 14),
      leaveType: "PL",
      reason: "Personal",
    },
    {
      id: "5",
      empId: "10011",
      empName: "Xavier Morin",
      date: new Date(2025, 0, 3),
      leaveType: "LWP",
      reason: "Family emergency",
    },
    {
      id: "6",
      empId: "10010",
      empName: "Sidrah Welch",
      date: new Date(2025, 0, 24),
      leaveType: "LWP",
      reason: "Personal",
    },
    {
      id: "7",
      empId: "10011",
      empName: "Xavier Morin",
      date: new Date(2025, 1, 7),
      leaveType: "SL",
      reason: "Sick",
    },
    {
      id: "8",
      empId: "10002",
      empName: "Pierre Cote",
      date: new Date(2025, 0, 18),
      leaveType: "CL",
      reason: "Family event",
    },
    {
      id: "9",
      empId: "10002",
      empName: "Pierre Cote",
      date: new Date(2025, 0, 19),
      leaveType: "CL",
      reason: "Family event",
    },
    {
      id: "10",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 20),
      leaveType: "SL",
      reason: "Sick",
    },
  ])

  const [employees, setEmployees] = useState<Employee[]>([
    {
      id: "1",
      empId: "10001",
      empName: "Arya Arias",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 1,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 1,
      },
    },
    {
      id: "2",
      empId: "10002",
      empName: "Pierre Cote",
      leaveHistory: {
        privilegeLeave: 1,
        leaveWithoutPay: 0,
        sickLeave: 1,
        casualLeave: 3,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 5,
      },
    },
    {
      id: "3",
      empId: "10003",
      empName: "Miya Milner",
      leaveHistory: {
        privilegeLeave: 10,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 10,
      },
    },
    {
      id: "4",
      empId: "10004",
      empName: "Aahil Oliver",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "5",
      empId: "10005",
      empName: "Ronny Carney",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "6",
      empId: "10006",
      empName: "Sahra Melendez",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "7",
      empId: "10007",
      empName: "Judy Mcpherson",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 2,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 2,
      },
    },
    {
      id: "8",
      empId: "10008",
      empName: "Alesha Reed",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "9",
      empId: "10009",
      empName: "Jeffrey Simmons",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "10",
      empId: "10010",
      empName: "Sidrah Welch",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "11",
      empId: "10011",
      empName: "Xavier Morin",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "12",
      empId: "10012",
      empName: "Arfa Salazar",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "13",
      empId: "10013",
      empName: "Jaylen Nash",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "14",
      empId: "10014",
      empName: "Rickie Preece",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
    {
      id: "15",
      empId: "10015",
      empName: "Jaidon Mckeown",
      leaveHistory: {
        privilegeLeave: 0,
        leaveWithoutPay: 0,
        sickLeave: 0,
        casualLeave: 0,
        maternityLeave: 0,
        weddingLeave: 0,
        halfdayLeave: 0,
        total: 0,
      },
    },
  ])

  const leaveTypes: LeaveType[] = [
    { name: "Privilege Leave", code: "PL", color: "#0088FE" },
    { name: "Leave without Pay", code: "LWP", color: "#00C49F" },
    { name: "Sick Leave", code: "SL", color: "#FFBB28" },
    { name: "Casual Leave", code: "CL", color: "#FF8042" },
    { name: "Maternity Leave", code: "ML", color: "#8884d8" },
    { name: "Wedding Leave", code: "WL", color: "#82ca9d" },
    { name: "Halfday Leave", code: "HDL", color: "#ffc658" },
  ]

  // Employee leave history for selected employee
  const [employeeLeaveHistory, setEmployeeLeaveHistory] = useState<LeaveRecord[]>([
    {
      id: "1",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 30),
      leaveType: "SL",
      reason: "Sick",
    },
    {
      id: "2",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 20),
      leaveType: "SL",
      reason: "Sick",
    },
    {
      id: "3",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 16),
      leaveType: "SL",
      reason: "Sick",
    },
    {
      id: "4",
      empId: "10003",
      empName: "Miya Milner",
      date: new Date(2025, 0, 14),
      leaveType: "PL",
      reason: "Personal",
    },
  ])

  // Calendar data for monthly view
  const [calendarData, setCalendarData] = useState<Record<string, Record<string, string>>>({})

  // Effect to calculate leave duration
  useEffect(() => {
    if (leaveStartDate && leaveEndDate) {
      const days = differenceInDays(leaveEndDate, leaveStartDate) + 1
      setLeaveDuration(days)
    }
  }, [leaveStartDate, leaveEndDate])

  // Effect to find employee when ID changes
  useEffect(() => {
    if (employeeId) {
      const employee = employees.find((emp) => emp.empId === employeeId)
      if (employee) {
        setEmployeeName(employee.empName)
        setSelectedEmployee(employee)

        // Filter leave history for this employee
        const history = leaveRecords.filter((record) => record.empId === employeeId)
        setEmployeeLeaveHistory(history)
      } else {
        setEmployeeName("")
        setSelectedEmployee(null)
        setEmployeeLeaveHistory([])
      }
    } else {
      setEmployeeName("")
      setSelectedEmployee(null)
      setEmployeeLeaveHistory([])
    }
  }, [employeeId, employees, leaveRecords])

  // Effect to prepare calendar data
  useEffect(() => {
    const data: Record<string, Record<string, string>> = {}

    // Initialize all employees
    employees.forEach((emp) => {
      data[emp.empId] = {}
    })

    // Add leave records to calendar
    leaveRecords.forEach((record) => {
      const dateStr = format(record.date, "dd-MMM-yyyy")
      if (data[record.empId]) {
        data[record.empId][dateStr] = record.leaveType
      }
    })

    setCalendarData(data)
  }, [leaveRecords, employees])

  // Handle form submission for marking leave
  const handleSubmit = () => {
    if (!employeeId || !employeeName || !leaveStartDate || !leaveEndDate || !leaveType) {
      alert("Please fill in all required fields")
      return
    }

    // Create leave records for each day in the range
    let currentDate = leaveStartDate
    const newRecords: LeaveRecord[] = []

    while (currentDate <= leaveEndDate) {
      newRecords.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
        empId: employeeId,
        empName: employeeName,
        date: new Date(currentDate),
        leaveType,
        reason: leaveReason,
      })

      currentDate = addDays(currentDate, 1)
    }

    setLeaveRecords([...leaveRecords, ...newRecords])
    setEmployeeLeaveHistory([...employeeLeaveHistory, ...newRecords])

    // Update employee leave history
    const employee = employees.find((emp) => emp.empId === employeeId)
    if (employee) {
      // Update leave counts based on leave type
      const updatedEmployees = employees.map((emp) => {
        if (emp.empId === employeeId) {
          const updatedHistory = { ...emp.leaveHistory }

          switch (leaveType) {
            case "PL":
              updatedHistory.privilegeLeave += leaveDuration
              break
            case "LWP":
              updatedHistory.leaveWithoutPay += leaveDuration
              break
            case "SL":
              updatedHistory.sickLeave += leaveDuration
              break
            case "CL":
              updatedHistory.casualLeave += leaveDuration
              break
            case "ML":
              updatedHistory.maternityLeave += leaveDuration
              break
            case "WL":
              updatedHistory.weddingLeave += leaveDuration
              break
            case "HDL":
              updatedHistory.halfdayLeave += leaveDuration
              break
          }

          updatedHistory.total += leaveDuration

          return {
            ...emp,
            leaveHistory: updatedHistory,
          }
        }
        return emp
      })

      setEmployees(updatedEmployees)
    }

    // Reset form
    setLeaveReason("")
    alert("Leave marked successfully!")
  }

  // Handle form reset
  const handleReset = () => {
    setEmployeeId("")
    setEmployeeName("")
    setLeaveStartDate(new Date(2025, 3, 1))
    setLeaveEndDate(new Date(2025, 3, 10))
    setLeaveType("PL")
    setLeaveReason("")
    setLeaveDuration(10)
  }

  // Get leave type color
  const getLeaveTypeColor = (code: string) => {
    const leaveType = leaveTypes.find((type) => type.code === code)
    return leaveType ? leaveType.color : "#cccccc"
  }

  // Handle close button click
  const handleClose = () => {
    router.push("/establishment-activities")
  }

  // Generate days for the monthly calendar
  const generateDays = () => {
    const days = []
    const daysInMonth = new Date(2025, 1, 0).getDate() // Days in January 2025

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(i)
    }

    return days
  }

  // Get total leave counts
  const getTotalLeaveCounts = () => {
    return {
      privilegeLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.privilegeLeave, 0),
      leaveWithoutPay: employees.reduce((sum, emp) => sum + emp.leaveHistory.leaveWithoutPay, 0),
      sickLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.sickLeave, 0),
      casualLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.casualLeave, 0),
      maternityLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.maternityLeave, 0),
      weddingLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.weddingLeave, 0),
      halfdayLeave: employees.reduce((sum, emp) => sum + emp.leaveHistory.halfdayLeave, 0),
      total: employees.reduce((sum, emp) => sum + emp.leaveHistory.total, 0),
    }
  }

  const totalLeaveCounts = getTotalLeaveCounts()

  // Handle export to Excel
  const handleExportToExcel = () => {
    // Create data for export
    const exportData = employees.map((emp) => {
      const empData: Record<string, any> = {
        "EMP ID": emp.empId,
        "EMP Name": emp.empName,
      }

      // Add dates for the selected month
      const daysInMonth = new Date(2025, 3, 0).getDate()
      for (let i = 1; i <= daysInMonth; i++) {
        const dateStr = `${i < 10 ? "0" + i : i}-Apr-2025`
        empData[dateStr] = calendarData[emp.empId]?.[dateStr] || ""
      }

      // Add leave type totals
      empData["Privilege Leave"] = emp.leaveHistory.privilegeLeave
      empData["Leave without Pay"] = emp.leaveHistory.leaveWithoutPay
      empData["Sick Leave"] = emp.leaveHistory.sickLeave
      empData["Casual Leave"] = emp.leaveHistory.casualLeave
      empData["Maternity Leave"] = emp.leaveHistory.maternityLeave
      empData["Wedding Leave"] = emp.leaveHistory.weddingLeave
      empData["Halfday Leave"] = emp.leaveHistory.halfdayLeave
      empData["Total"] = emp.leaveHistory.total

      return empData
    })

    // Add a summary row
    exportData.push({
      "EMP ID": "TOTAL",
      "EMP Name": "",
      "Privilege Leave": totalLeaveCounts.privilegeLeave,
      "Leave without Pay": totalLeaveCounts.leaveWithoutPay,
      "Sick Leave": totalLeaveCounts.sickLeave,
      "Casual Leave": totalLeaveCounts.casualLeave,
      "Maternity Leave": totalLeaveCounts.maternityLeave,
      "Wedding Leave": totalLeaveCounts.weddingLeave,
      "Halfday Leave": totalLeaveCounts.halfdayLeave,
      Total: totalLeaveCounts.total,
    })

    // Create worksheet
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Create workbook and add worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Monthly Summary")

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, `Leave_Summary_${selectedMonth}.xlsx`)
  }

  // Generate calendar for Mark Leave tab
  const generateCalendar = () => {
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(calendarMonth)
    const year = Number.parseInt(calendarYear)

    if (monthIndex === -1 || isNaN(year)) return null

    const firstDay = new Date(year, monthIndex, 1).getDay()
    const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()

    const weeks = []
    let days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<td key={`empty-${i}`} className="bg-gray-200 p-4"></td>)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, monthIndex, day)
      const isSelected = selectedDates.some(
        (d) =>
          d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
      )

      days.push(
        <td
          key={day}
          className={`p-4 text-center text-lg font-medium ${isSelected ? "bg-blue-200" : "bg-yellow-300"} hover:bg-blue-100 cursor-pointer`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </td>,
      )

      if ((firstDay + day) % 7 === 0 || day === daysInMonth) {
        // If it's the end of a week or the last day, create a new row
        weeks.push(<tr key={`week-${weeks.length}`}>{days}</tr>)
        days = []
      }
    }

    return (
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-blue-200">
            <th className="p-3 text-center">Sun</th>
            <th className="p-3 text-center">Mon</th>
            <th className="p-3 text-center">Tue</th>
            <th className="p-3 text-center">Wed</th>
            <th className="p-3 text-center">Thu</th>
            <th className="p-3 text-center">Fri</th>
            <th className="p-3 text-center">Sat</th>
          </tr>
        </thead>
        <tbody>{weeks}</tbody>
      </table>
    )
  }

  // Handle date click in calendar
  const handleDateClick = (date: Date) => {
    const isAlreadySelected = selectedDates.some(
      (d) =>
        d.getDate() === date.getDate() && d.getMonth() === date.getMonth() && d.getFullYear() === date.getFullYear(),
    )

    if (isAlreadySelected) {
      // Remove date if already selected
      setSelectedDates(
        selectedDates.filter((d) => {
          return !(
            d.getDate() === date.getDate() &&
            d.getMonth() === date.getMonth() &&
            d.getFullYear() === date.getFullYear()
          )
        }),
      )
    } else {
      // Add date if not selected
      setSelectedDates([...selectedDates, date])
    }

    setSelectedDate(date)
  }

  // Handle previous month
  const handlePrevMonth = () => {
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(calendarMonth)
    if (monthIndex > 0) {
      setCalendarMonth(
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][monthIndex - 1],
      )
    } else {
      setCalendarMonth("December")
      setCalendarYear((Number.parseInt(calendarYear) - 1).toString())
    }
  }

  // Handle next month
  const handleNextMonth = () => {
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(calendarMonth)
    if (monthIndex < 11) {
      setCalendarMonth(
        [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ][monthIndex + 1],
      )
    } else {
      setCalendarMonth("January")
      setCalendarYear((Number.parseInt(calendarYear) + 1).toString())
    }
  }

  // Handle mark leave in calendar view
  const handleMarkLeaveInCalendar = () => {
    if (!employeeId || !employeeName || selectedDates.length === 0 || !leaveType) {
      alert("Please select an employee, dates, and leave type")
      return
    }

    // Create leave records for each selected date
    const newRecords: LeaveRecord[] = selectedDates.map((date) => ({
      id: Date.now().toString() + Math.random().toString(36).substr(2, 5),
      empId: employeeId,
      empName: employeeName,
      date: new Date(date),
      leaveType,
      reason: leaveReason,
    }))

    setLeaveRecords([...leaveRecords, ...newRecords])
    setEmployeeLeaveHistory([...employeeLeaveHistory, ...newRecords])

    // Update employee leave history
    const employee = employees.find((emp) => emp.empId === employeeId)
    if (employee) {
      // Update leave counts based on leave type
      const updatedEmployees = employees.map((emp) => {
        if (emp.empId === employeeId) {
          const updatedHistory = { ...emp.leaveHistory }

          switch (leaveType) {
            case "PL":
              updatedHistory.privilegeLeave += selectedDates.length
              break
            case "LWP":
              updatedHistory.leaveWithoutPay += selectedDates.length
              break
            case "SL":
              updatedHistory.sickLeave += selectedDates.length
              break
            case "CL":
              updatedHistory.casualLeave += selectedDates.length
              break
            case "ML":
              updatedHistory.maternityLeave += selectedDates.length
              break
            case "WL":
              updatedHistory.weddingLeave += selectedDates.length
              break
            case "HDL":
              updatedHistory.halfdayLeave += selectedDates.length
              break
          }

          updatedHistory.total += selectedDates.length

          return {
            ...emp,
            leaveHistory: updatedHistory,
          }
        }
        return emp
      })

      setEmployees(updatedEmployees)
    }

    // Reset selected dates
    setSelectedDates([])
    setLeaveReason("")
    alert("Leave marked successfully!")
  }

  return (
    <div className="min-h-screen p-4 bg-gray-50">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Staff Leave Management</h1>
        <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
          <X className="h-5 w-5" />
        </Button>
      </div>

      <Card className="mb-6 bg-gradient-to-r from-teal-600 to-teal-700 text-white">
        <CardHeader className="pb-2">
          <CardTitle className="text-center text-2xl">Automated Leave Tracker 2.0</CardTitle>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-4 w-full">
          <TabsTrigger value="leave-tracker" className="flex items-center gap-2">
            <CalendarIcon2 className="h-4 w-4 text-teal-500" />
            Leave Tracker
          </TabsTrigger>
          <TabsTrigger value="summary" className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-blue-500" />
            Summary
          </TabsTrigger>
          <TabsTrigger value="monthlySummary" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-purple-500" />
            Monthly Summary
          </TabsTrigger>
          <TabsTrigger value="markLeave" className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-green-500" />
            Mark Leave
          </TabsTrigger>
          <TabsTrigger value="setting" className="flex items-center gap-2">
            <Settings className="h-4 w-4 text-orange-500" />
            Setting
          </TabsTrigger>
        </TabsList>

        {/* Leave Tracker Tab (formerly Mark Leave) */}
        <TabsContent value="leave-tracker" className="space-y-4">
          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4">Leave Tracker:</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Employee ID</Label>
                    <Input
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="bg-white text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Employee Name</Label>
                    <Input
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="bg-white text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Leave Start Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white text-black"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {leaveStartDate ? format(leaveStartDate, "d-MMM-yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={leaveStartDate}
                          onSelect={(date) => date && setLeaveStartDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Leave End Date</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className="w-full justify-start text-left font-normal bg-white text-black"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {leaveEndDate ? format(leaveEndDate, "d-MMM-yyyy") : "Select date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={leaveEndDate}
                          onSelect={(date) => date && setLeaveEndDate(date)}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Leave Type</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name} ({type.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-white">Reason</Label>
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full h-32 p-2 rounded-md bg-white text-black"
                    />
                  </div>

                  <div className="text-center text-4xl font-bold my-4">{leaveDuration} day(s)</div>

                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handleSubmit} className="bg-white text-teal-700 hover:bg-gray-100">
                      Submit
                    </Button>
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="bg-transparent border-white text-white hover:bg-teal-700"
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leave History for Selected Employee</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="bg-green-600 text-white">EMP ID</TableHead>
                    <TableHead className="bg-green-600 text-white">EMP Name</TableHead>
                    <TableHead className="bg-green-600 text-white">Date</TableHead>
                    <TableHead className="bg-green-600 text-white">Leave Type</TableHead>
                    <TableHead className="bg-green-600 text-white">Reason</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {employeeLeaveHistory.length > 0 ? (
                    employeeLeaveHistory.map((record) => (
                      <TableRow key={record.id}>
                        <TableCell>{record.empId}</TableCell>
                        <TableCell>{record.empName}</TableCell>
                        <TableCell>{format(record.date, "dd-MMM-yy")}</TableCell>
                        <TableCell>
                          <span
                            className="px-2 py-1 rounded text-white"
                            style={{ backgroundColor: getLeaveTypeColor(record.leaveType) }}
                          >
                            {record.leaveType}
                          </span>
                        </TableCell>
                        <TableCell>{record.reason}</TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center">
                        No leave history found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Summary Tab */}
        <TabsContent value="summary" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Label>Start Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(startDate, "d-MMM-yy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={(date) => date && setStartDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="flex items-center space-x-2">
                  <Label>End Date:</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-[180px] justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {format(endDate, "d-MMM-yy")}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => date && setEndDate(date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-center">EMP ID</TableHead>
                      <TableHead className="text-center">EMP Name</TableHead>
                      <TableHead className="text-center bg-blue-100">
                        {totalLeaveCounts.privilegeLeave}
                        <div className="text-xs">Privilege Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-green-100">
                        {totalLeaveCounts.leaveWithoutPay}
                        <div className="text-xs">Leave without Pay</div>
                      </TableHead>
                      <TableHead className="text-center bg-yellow-100">
                        {totalLeaveCounts.sickLeave}
                        <div className="text-xs">Sick Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-orange-100">
                        {totalLeaveCounts.casualLeave}
                        <div className="text-xs">Casual Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-purple-100">
                        {totalLeaveCounts.maternityLeave}
                        <div className="text-xs">Maternity Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-pink-100">
                        {totalLeaveCounts.weddingLeave}
                        <div className="text-xs">Wedding Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-indigo-100">
                        {totalLeaveCounts.halfdayLeave}
                        <div className="text-xs">Halfday Leave</div>
                      </TableHead>
                      <TableHead className="text-center bg-orange-200">
                        {totalLeaveCounts.total}
                        <div className="text-xs">Total</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id}>
                        <TableCell className="text-center">{employee.empId}</TableCell>
                        <TableCell>{employee.empName}</TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.privilegeLeave > 0 ? employee.leaveHistory.privilegeLeave : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.leaveWithoutPay > 0 ? employee.leaveHistory.leaveWithoutPay : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.sickLeave > 0 ? employee.leaveHistory.sickLeave : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.casualLeave > 0 ? employee.leaveHistory.casualLeave : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.maternityLeave > 0 ? employee.leaveHistory.maternityLeave : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.weddingLeave > 0 ? employee.leaveHistory.weddingLeave : ""}
                        </TableCell>
                        <TableCell className="text-center">
                          {employee.leaveHistory.halfdayLeave > 0 ? employee.leaveHistory.halfdayLeave : ""}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {employee.leaveHistory.total > 0 ? employee.leaveHistory.total : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Monthly Summary Tab - Updated to match the UI design */}
        <TabsContent value="monthlySummary" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                  <Select value={selectedMonth} onValueChange={setSelectedMonth}>
                    <SelectTrigger className="w-[180px] bg-blue-100">
                      <SelectValue placeholder="Select month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="January-2025">January-2025</SelectItem>
                      <SelectItem value="February-2025">February-2025</SelectItem>
                      <SelectItem value="March-2025">March-2025</SelectItem>
                      <SelectItem value="April-2025">April-2025</SelectItem>
                      <SelectItem value="May-2025">May-2025</SelectItem>
                      <SelectItem value="June-2025">June-2025</SelectItem>
                      <SelectItem value="July-2025">July-2025</SelectItem>
                      <SelectItem value="August-2025">August-2025</SelectItem>
                      <SelectItem value="September-2025">September-2025</SelectItem>
                      <SelectItem value="October-2025">October-2025</SelectItem>
                      <SelectItem value="November-2025">November-2025</SelectItem>
                      <SelectItem value="December-2025">December-2025</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex space-x-2">
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-blue-500"></div>
                    <span className="text-xs">PL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-red-500"></div>
                    <span className="text-xs">LWP</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-green-500"></div>
                    <span className="text-xs">SL</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-4 h-4 bg-orange-500"></div>
                    <span className="text-xs">CL</span>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <div className="bg-blue-700 text-white p-2 text-center font-bold mb-2">Grand Total</div>
                <div className="flex mb-2">
                  <div className="flex-1 bg-blue-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.privilegeLeave}</div>
                    <div className="text-xs">Privilege Leave</div>
                    <div className="text-xs">PL</div>
                  </div>
                  <div className="flex-1 bg-green-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.leaveWithoutPay}</div>
                    <div className="text-xs">Leave without Pay</div>
                    <div className="text-xs">LWP</div>
                  </div>
                  <div className="flex-1 bg-yellow-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.sickLeave}</div>
                    <div className="text-xs">Sick Leave</div>
                    <div className="text-xs">SL</div>
                  </div>
                  <div className="flex-1 bg-orange-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.casualLeave}</div>
                    <div className="text-xs">Casual Leave</div>
                    <div className="text-xs">CL</div>
                  </div>
                  <div className="flex-1 bg-purple-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.maternityLeave}</div>
                    <div className="text-xs">Maternity Leave</div>
                    <div className="text-xs">ML</div>
                  </div>
                  <div className="flex-1 bg-pink-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.weddingLeave}</div>
                    <div className="text-xs">Wedding Leave</div>
                    <div className="text-xs">WL</div>
                  </div>
                  <div className="flex-1 bg-indigo-500 text-white p-2 text-center">
                    <div>{totalLeaveCounts.halfdayLeave}</div>
                    <div className="text-xs">Halfday Leave</div>
                    <div className="text-xs">HDL</div>
                  </div>
                  <div className="flex-1 bg-orange-600 text-white p-2 text-center">
                    <div>{totalLeaveCounts.total}</div>
                    <div className="text-xs">Total</div>
                  </div>
                </div>

                <Table className="border-collapse">
                  <TableHeader>
                    <TableRow>
                      <TableHead className="bg-blue-700 text-white text-center p-2">EMP ID</TableHead>
                      <TableHead className="bg-blue-700 text-white text-center p-2">EMP Name</TableHead>
                      {Array.from({ length: 18 }, (_, i) => i + 13).map((day) => (
                        <TableHead key={day} className="bg-blue-700 text-white text-center p-1 w-8">
                          <div>{day}</div>
                          <div className="text-xs">
                            {
                              [
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                                "Sun",
                                "Mon",
                                "Tue",
                                "Wed",
                                "Thu",
                                "Fri",
                                "Sat",
                              ][day - 13]
                            }
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="bg-blue-500 text-white text-center p-2">
                        <div>PL</div>
                      </TableHead>
                      <TableHead className="bg-green-500 text-white text-center p-2">
                        <div>LWP</div>
                      </TableHead>
                      <TableHead className="bg-yellow-500 text-white text-center p-2">
                        <div>SL</div>
                      </TableHead>
                      <TableHead className="bg-orange-500 text-white text-center p-2">
                        <div>CL</div>
                      </TableHead>
                      <TableHead className="bg-orange-600 text-white text-center p-2">
                        <div>Total</div>
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {employees.map((employee) => (
                      <TableRow key={employee.id} className="hover:bg-gray-50">
                        <TableCell className="bg-blue-700 text-white text-center p-2">{employee.empId}</TableCell>
                        <TableCell className="bg-blue-700 text-white p-2">{employee.empName}</TableCell>
                        {Array.from({ length: 18 }, (_, i) => i + 13).map((day) => {
                          const dateStr = `${day < 10 ? "0" + day : day}-Apr-2025`
                          const leaveType = calendarData[employee.empId]?.[dateStr]
                          const bgColor = leaveType
                            ? leaveType === "PL"
                              ? "bg-blue-500"
                              : leaveType === "LWP"
                                ? "bg-red-500"
                                : leaveType === "SL"
                                  ? "bg-green-500"
                                  : leaveType === "CL"
                                    ? "bg-orange-500"
                                    : "bg-gray-200"
                            : "bg-yellow-300"

                          return (
                            <TableCell key={day} className={`text-center p-0 w-8 ${bgColor}`}>
                              {leaveType && (
                                <div className="w-full h-full text-white text-xs flex items-center justify-center">
                                  {leaveType}
                                </div>
                              )}
                            </TableCell>
                          )
                        })}
                        <TableCell className="bg-blue-100 text-center p-2">
                          {employee.leaveHistory.privilegeLeave > 0 ? employee.leaveHistory.privilegeLeave : ""}
                        </TableCell>
                        <TableCell className="bg-green-100 text-center p-2">
                          {employee.leaveHistory.leaveWithoutPay > 0 ? employee.leaveHistory.leaveWithoutPay : ""}
                        </TableCell>
                        <TableCell className="bg-yellow-100 text-center p-2">
                          {employee.leaveHistory.sickLeave > 0 ? employee.leaveHistory.sickLeave : ""}
                        </TableCell>
                        <TableCell className="bg-orange-100 text-center p-2">
                          {employee.leaveHistory.casualLeave > 0 ? employee.leaveHistory.casualLeave : ""}
                        </TableCell>
                        <TableCell className="bg-orange-200 text-center p-2 font-bold">
                          {employee.leaveHistory.total > 0 ? employee.leaveHistory.total : ""}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mark Leave Tab - New tab with calendar UI */}
        <TabsContent value="markLeave" className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-2">
                      <Label>Month</Label>
                      <Select value={calendarMonth} onValueChange={setCalendarMonth}>
                        <SelectTrigger className="w-[180px] bg-blue-100">
                          <SelectValue placeholder="Select month" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="January">January</SelectItem>
                          <SelectItem value="February">February</SelectItem>
                          <SelectItem value="March">March</SelectItem>
                          <SelectItem value="April">April</SelectItem>
                          <SelectItem value="May">May</SelectItem>
                          <SelectItem value="June">June</SelectItem>
                          <SelectItem value="July">July</SelectItem>
                          <SelectItem value="August">August</SelectItem>
                          <SelectItem value="September">September</SelectItem>
                          <SelectItem value="October">October</SelectItem>
                          <SelectItem value="November">November</SelectItem>
                          <SelectItem value="December">December</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Label>Year</Label>
                      <Select value={calendarYear} onValueChange={setCalendarYear}>
                        <SelectTrigger className="w-[180px] bg-blue-100">
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="2023">2023</SelectItem>
                          <SelectItem value="2024">2024</SelectItem>
                          <SelectItem value="2025">2025</SelectItem>
                          <SelectItem value="2026">2026</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="bg-black text-white p-2 text-center relative">
                    <button
                      className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-full p-2"
                      onClick={handlePrevMonth}
                    >
                      <ChevronLeft className="h-5 w-5 text-white" />
                    </button>
                    <span className="text-xl font-italic">
                      {calendarMonth}-{calendarYear}
                    </span>
                    <button
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 rounded-full p-2"
                      onClick={handleNextMonth}
                    >
                      <ChevronRight className="h-5 w-5 text-white" />
                    </button>
                  </div>

                  <div className="border">{generateCalendar()}</div>

                  <div className="space-y-2 mt-4">
                    <Label>Selected Dates:</Label>
                    <div className="bg-gray-100 p-2 min-h-[50px] rounded">
                      {selectedDates.length > 0 ? (
                        <ul className="list-disc pl-5">
                          {selectedDates.map((date, index) => (
                            <li key={index}>{format(date, "dd-MMM-yyyy")}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500">No dates selected</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Employee ID</Label>
                    <Input
                      value={employeeId}
                      onChange={(e) => setEmployeeId(e.target.value)}
                      className="bg-white text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Employee Name</Label>
                    <Input
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      className="bg-white text-black"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Leave Type</Label>
                    <Select value={leaveType} onValueChange={setLeaveType}>
                      <SelectTrigger className="bg-white text-black">
                        <SelectValue placeholder="Select leave type" />
                      </SelectTrigger>
                      <SelectContent>
                        {leaveTypes.map((type) => (
                          <SelectItem key={type.code} value={type.code}>
                            {type.name} ({type.code})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Reason</Label>
                    <textarea
                      value={leaveReason}
                      onChange={(e) => setLeaveReason(e.target.value)}
                      className="w-full h-32 p-2 rounded-md bg-white text-black"
                    />
                  </div>

                  <div className="text-center text-4xl font-bold my-4">{selectedDates.length} day(s)</div>

                  <div className="flex justify-center space-x-4 mt-4">
                    <Button onClick={handleMarkLeaveInCalendar} className="bg-green-600 hover:bg-green-700">
                      Mark Leave
                    </Button>
                    <Button
                      onClick={() => setSelectedDates([])}
                      variant="outline"
                      className="bg-transparent border-gray-300 text-gray-700 hover:bg-gray-100"
                    >
                      Clear Selection
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Setting Tab */}
        <TabsContent value="setting" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Leave Types</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Leave Type</TableHead>
                      <TableHead>Leave Code</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {leaveTypes.map((type) => (
                      <TableRow key={type.code}>
                        <TableCell>{type.name}</TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded text-white" style={{ backgroundColor: type.color }}>
                            {type.code}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Month List</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableBody>
                    {[
                      "January-2025",
                      "February-2025",
                      "March-2025",
                      "April-2025",
                      "May-2025",
                      "June-2025",
                      "July-2025",
                      "August-2025",
                      "September-2025",
                      "October-2025",
                      "November-2025",
                      "December-2025",
                    ].map((month) => (
                      <TableRow key={month}>
                        <TableCell>{month}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button className="w-full" onClick={handleExportToExcel}>
                  <Download className="mr-2 h-4 w-4" />
                  Export Data
                </Button>

                <Button className="w-full" variant="destructive" onClick={() => alert("All data reset successfully!")}>
                  Reset All Data
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Import the missing components
import { BarChart3 } from "lucide-react"

