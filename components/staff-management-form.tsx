"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Select, SelectItem, SelectValue, SelectContent, SelectTrigger } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, differenceInYears } from "date-fns"
import { Search, CalendarIcon, Upload, X, Eye, Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import * as XLSX from "xlsx"
import { jsPDF } from "jspdf"
import "jspdf-autotable"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

type StaffMember = {
  id: string
  fullName: string
  nameWithInitials: string
  dob: string
  idNo: string
  sex: string
  nationality: string
  civilStatus: string
  permanentAddress: string
  telephoneNo: string
  religion: string
  temporaryAddress: string
  appointmentNumber: string
  designation: string
  appointmentDate: string
  grade: string
  service: string
  workingBranch: string
  ministry: string
  email: string
  widowOrphanNo: string
  ebDate1: string
  ebDate2: string
  ebDate3: string
  olQualification: OLQualification[]
  alQualification: ALQualification[]
  higherQualification: string
  spouseName: string
  occupation: string
  numberOfChildren: string
  fatherName: string
  motherName: string
  homeTp: string
  incrementDate: string
  arrivalDate: string
  confirmationDate: string
  retirementDate: string
  section: string
  mobileNo: string
  imageUrl: string
}

type OLQualification = {
  id: string
  serialNumber: string
  year: string
  subjectName: string
  result: string
}

type ALQualification = {
  id: string
  serialNumber: string
  year: string
  subjectName: string
  result: string
}

export default function StaffManagementForm() {
  const router = useRouter()

  // Add this function to handle the close button click
  const handleClose = () => {
    router.push("/establishment-activities")
  }

  const fileInputRef = useRef<HTMLInputElement>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // State for form fields
  const [fullName, setFullName] = useState("")
  const [nameWithInitials, setNameWithInitials] = useState("")
  const [dob, setDob] = useState<Date | undefined>(undefined)
  const [idNo, setIdNo] = useState("")
  const [sex, setSex] = useState("Female")
  const [nationality, setNationality] = useState("Sri Lankan")
  const [civilStatus, setCivilStatus] = useState("Single")
  const [permanentAddress, setPermanentAddress] = useState("")
  const [telephoneNo, setTelephoneNo] = useState("")
  const [religion, setReligion] = useState("Buddhism")
  const [temporaryAddress, setTemporaryAddress] = useState("")

  // Appointment details
  const [appointmentNumber, setAppointmentNumber] = useState("")
  const [designation, setDesignation] = useState("")
  const [appointmentDate, setAppointmentDate] = useState<Date | undefined>(undefined)
  const [grade, setGrade] = useState("Grade I")
  const [service, setService] = useState("Management Service Officer Service")
  const [workingBranch, setWorkingBranch] = useState("Establishment")
  const [ministry, setMinistry] = useState("")
  const [email, setEmail] = useState("")
  const [widowOrphanNo, setWidowOrphanNo] = useState("")
  const [ebDate1, setEbDate1] = useState("")
  const [ebDate2, setEbDate2] = useState("")
  const [ebDate3, setEbDate3] = useState("")

  // Education qualifications
  const [olQualifications, setOlQualifications] = useState<OLQualification[]>([
    { id: "1", serialNumber: "1", year: "", subjectName: "", result: "" },
  ])

  // AL qualifications as a table
  const [alQualifications, setAlQualifications] = useState<ALQualification[]>([
    { id: "1", serialNumber: "1", year: "", subjectName: "", result: "" },
  ])

  const [higherQualification, setHigherQualification] = useState("")
  const [showEducationPreview, setShowEducationPreview] = useState(false)

  // Family details
  const [spouseName, setSpouseName] = useState("")
  const [occupation, setOccupation] = useState("")
  const [numberOfChildren, setNumberOfChildren] = useState("")
  const [fatherName, setFatherName] = useState("")
  const [motherName, setMotherName] = useState("")
  const [homeTp, setHomeTp] = useState("")

  // Special dates
  const [incrementDate, setIncrementDate] = useState<Date | undefined>(undefined)
  const [arrivalDate, setArrivalDate] = useState<Date | undefined>(undefined)
  const [confirmationDate, setConfirmationDate] = useState<Date | undefined>(undefined)
  const [retirementDate, setRetirementDate] = useState<Date | undefined>(undefined)

  // Search
  const [searchId, setSearchId] = useState("")

  // Sample staff data
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([
    {
      id: "1",
      fullName: "Rasnayaka Mudiyanselage Sachini Dileepa Ilangakara",
      nameWithInitials: "R.M.S.D.K. Rasnayaka",
      dob: "6/12/1993",
      idNo: "936641350v",
      sex: "Female",
      nationality: "Sri Lankan",
      civilStatus: "Single",
      permanentAddress: "123 Main St, Colombo",
      telephoneNo: "0112345678",
      religion: "Buddhism",
      temporaryAddress: "",
      appointmentNumber: "APP001",
      designation: "Development Officer",
      appointmentDate: "01/15/2020",
      grade: "Grade I",
      service: "Development Officer Service",
      workingBranch: "Establishment",
      ministry: "Public Administration",
      email: "sachini@example.com",
      widowOrphanNo: "",
      ebDate1: "01/15/2021",
      ebDate2: "",
      ebDate3: "",
      olQualification: [
        { id: "1", serialNumber: "1", year: "2010", subjectName: "Mathematics", result: "A" },
        { id: "2", serialNumber: "2", year: "2010", subjectName: "Science", result: "B" },
      ],
      alQualification: [
        { id: "1", serialNumber: "1", year: "2012", subjectName: "Physics", result: "B" },
        { id: "2", serialNumber: "2", year: "2012", subjectName: "Chemistry", result: "C" },
      ],
      higherQualification: "Bachelor of Commerce - University of Colombo",
      spouseName: "",
      occupation: "",
      numberOfChildren: "0",
      fatherName: "R.M. Rasnayaka",
      motherName: "K.D. Ilangakara",
      homeTp: "0112345678",
      incrementDate: "01/15/2021",
      arrivalDate: "01/15/2020",
      confirmationDate: "07/15/2020",
      retirementDate: "06/12/2053",
      section: "Establishment",
      mobileNo: "767809506",
      imageUrl: "",
    },
    {
      id: "2",
      fullName: "Ilangakara Jeevanathi Hiroshini Kumari",
      nameWithInitials: "I.G.J.H.K.Ilangakara",
      dob: "11/14/1993",
      idNo: "938192189v",
      sex: "Female",
      nationality: "Sri Lankan Tamil",
      civilStatus: "Married",
      permanentAddress: "456 Park Ave, Kandy",
      telephoneNo: "0812345678",
      religion: "Hinduism",
      temporaryAddress: "789 Lake Rd, Colombo",
      appointmentNumber: "APP002",
      designation: "Administrative Officer",
      appointmentDate: "03/10/2019",
      grade: "Grade II",
      service: "Sri Lanka Administrative Service",
      workingBranch: "Establishment",
      ministry: "Public Administration",
      email: "hiroshini@example.com",
      widowOrphanNo: "",
      ebDate1: "03/10/2020",
      ebDate2: "03/10/2021",
      ebDate3: "",
      olQualification: [
        { id: "1", serialNumber: "1", year: "2009", subjectName: "Mathematics", result: "A" },
        { id: "2", serialNumber: "2", year: "2009", subjectName: "Science", result: "A" },
      ],
      alQualification: [
        { id: "1", serialNumber: "1", year: "2011", subjectName: "Physics", result: "A" },
        { id: "2", serialNumber: "2", year: "2011", subjectName: "Chemistry", result: "A" },
      ],
      higherQualification: "Bachelor of Science - University of Peradeniya",
      spouseName: "K.L. Perera",
      occupation: "Engineer",
      numberOfChildren: "1",
      fatherName: "G.H. Ilangakara",
      motherName: "P.J. Kumari",
      homeTp: "0812345678",
      incrementDate: "03/10/2020",
      arrivalDate: "03/10/2019",
      confirmationDate: "09/10/2019",
      retirementDate: "11/14/2053",
      section: "Establishment",
      mobileNo: "0718853923",
      imageUrl: "",
    },
    {
      id: "3",
      fullName: "Herash Mudiyanselage Nisansala Roshi",
      nameWithInitials: "H.M.N.R.Dissanayaka",
      dob: "7/26/1992",
      idNo: "927082640v",
      sex: "Female",
      nationality: "Sri Lankan",
      civilStatus: "Married",
      permanentAddress: "789 Hill St, Galle",
      telephoneNo: "0912345678",
      religion: "Buddhism",
      temporaryAddress: "",
      appointmentNumber: "APP003",
      designation: "Finance Officer",
      appointmentDate: "05/20/2018",
      grade: "Grade I",
      service: "Sri Lanka Accountancy Service",
      workingBranch: "Establishment",
      ministry: "Finance",
      email: "nisansala@example.com",
      widowOrphanNo: "",
      ebDate1: "05/20/2019",
      ebDate2: "05/20/2020",
      ebDate3: "05/20/2021",
      olQualification: [
        { id: "1", serialNumber: "1", year: "2008", subjectName: "Mathematics", result: "A" },
        { id: "2", serialNumber: "2", year: "2008", subjectName: "Science", result: "A" },
      ],
      alQualification: [
        { id: "1", serialNumber: "1", year: "2010", subjectName: "Physics", result: "A" },
        { id: "2", serialNumber: "2", year: "2010", subjectName: "Chemistry", result: "B" },
      ],
      higherQualification: "Bachelor of Commerce - University of Sri Jayewardenepura",
      spouseName: "T.K. Dissanayaka",
      occupation: "Accountant",
      numberOfChildren: "2",
      fatherName: "H.M. Dissanayaka",
      motherName: "L.R. Roshi",
      homeTp: "0912345678",
      incrementDate: "05/20/2019",
      arrivalDate: "05/20/2018",
      confirmationDate: "11/20/2018",
      retirementDate: "07/26/2052",
      section: "Establishment",
      mobileNo: "0701444291",
      imageUrl: "",
    },
  ])

  // Filtered staff members
  const [filteredStaffMembers, setFilteredStaffMembers] = useState<StaffMember[]>(staffMembers)

  // Calculate age based on confirmation date
  const calculateAge = () => {
    if (!confirmationDate) return ""
    const today = new Date()
    const years = differenceInYears(today, confirmationDate)
    return `${years} years`
  }

  // Handle form submission
  const handleSave = () => {
    // Create a new staff member object from form data
    const newStaffMember: StaffMember = {
      id: Date.now().toString(),
      fullName,
      nameWithInitials,
      dob: dob ? format(dob, "MM/dd/yyyy") : "",
      idNo,
      sex,
      nationality,
      civilStatus,
      permanentAddress,
      telephoneNo,
      religion,
      temporaryAddress,
      appointmentNumber,
      designation,
      appointmentDate: appointmentDate ? format(appointmentDate, "MM/dd/yyyy") : "",
      grade,
      service,
      workingBranch,
      ministry,
      email,
      widowOrphanNo,
      ebDate1,
      ebDate2,
      ebDate3,
      olQualification: olQualifications,
      alQualification: alQualifications,
      higherQualification,
      spouseName,
      occupation,
      numberOfChildren,
      fatherName,
      motherName,
      homeTp,
      incrementDate: incrementDate ? format(incrementDate, "MM/dd/yyyy") : "",
      arrivalDate: arrivalDate ? format(arrivalDate, "MM/dd/yyyy") : "",
      confirmationDate: confirmationDate ? format(confirmationDate, "MM/dd/yyyy") : "",
      retirementDate: retirementDate ? format(retirementDate, "MM/dd/yyyy") : "",
      section: workingBranch,
      mobileNo: telephoneNo,
      imageUrl: imagePreview || "",
    }

    // Check if staff member with this ID already exists
    const existingIndex = staffMembers.findIndex((staff) => staff.idNo === idNo)

    if (existingIndex >= 0) {
      // Update existing staff member
      const updatedStaffMembers = [...staffMembers]
      updatedStaffMembers[existingIndex] = newStaffMember
      setStaffMembers(updatedStaffMembers)
      setFilteredStaffMembers(updatedStaffMembers)
      alert("Staff information updated successfully!")
    } else {
      // Add new staff member
      const updatedStaffMembers = [...staffMembers, newStaffMember]
      setStaffMembers(updatedStaffMembers)
      setFilteredStaffMembers(updatedStaffMembers)
      alert("Staff information saved successfully!")
    }
  }

  // Clear form fields
  const clearForm = () => {
    setFullName("")
    setNameWithInitials("")
    setDob(undefined)
    setIdNo("")
    setSex("Female")
    setNationality("Sri Lankan")
    setCivilStatus("Single")
    setPermanentAddress("")
    setTelephoneNo("")
    setReligion("Buddhism")
    setTemporaryAddress("")

    setAppointmentNumber("")
    setDesignation("")
    setAppointmentDate(undefined)
    setGrade("Grade I")
    setService("Management Service Officer Service")
    setWorkingBranch("Establishment")
    setMinistry("")
    setEmail("")
    setWidowOrphanNo("")
    setEbDate1("")
    setEbDate2("")
    setEbDate3("")

    setOlQualifications([{ id: "1", serialNumber: "1", year: "", subjectName: "", result: "" }])
    setAlQualifications([{ id: "1", serialNumber: "1", year: "", subjectName: "", result: "" }])
    setHigherQualification("")

    setSpouseName("")
    setOccupation("")
    setNumberOfChildren("")
    setFatherName("")
    setMotherName("")
    setHomeTp("")

    setIncrementDate(undefined)
    setArrivalDate(undefined)
    setConfirmationDate(undefined)
    setRetirementDate(undefined)

    setImagePreview(null)

    // Reset filtered staff members to show all
    setFilteredStaffMembers(staffMembers)
  }

  // Handle delete
  const handleDelete = () => {
    if (!idNo) {
      alert("Please enter or search for an ID number to delete")
      return
    }

    if (confirm("Are you sure you want to delete this record?")) {
      const updatedStaffMembers = staffMembers.filter((staff) => staff.idNo !== idNo)
      setStaffMembers(updatedStaffMembers)
      setFilteredStaffMembers(updatedStaffMembers)
      clearForm()
      alert("Record deleted successfully!")
    }
  }

  // Handle update
  const handleUpdate = () => {
    if (!idNo) {
      alert("Please enter or search for an ID number to update")
      return
    }

    handleSave()
  }

  // Handle export to Excel
  const handleExport = () => {
    // Create a more comprehensive dataset with all fields
    const exportData = staffMembers.map((staff) => ({
      "Full Name": staff.fullName,
      "Name with Initials": staff.nameWithInitials,
      "Date of Birth": staff.dob,
      "ID Number": staff.idNo,
      Sex: staff.sex,
      Nationality: staff.nationality,
      "Civil Status": staff.civilStatus,
      "Permanent Address": staff.permanentAddress,
      "Telephone Number": staff.telephoneNo,
      Religion: staff.religion,
      "Temporary Address": staff.temporaryAddress,
      "Appointment Number": staff.appointmentNumber,
      Designation: staff.designation,
      "Appointment Date": staff.appointmentDate,
      Grade: staff.grade,
      Service: staff.service,
      "Working Branch": staff.workingBranch,
      Ministry: staff.ministry,
      Email: staff.email,
      "Widow/Orphan Number": staff.widowOrphanNo,
      "EB Date 1": staff.ebDate1,
      "EB Date 2": staff.ebDate2,
      "EB Date 3": staff.ebDate3,
      "Higher Qualification": staff.higherQualification,
      "Spouse Name": staff.spouseName,
      Occupation: staff.occupation,
      "Number of Children": staff.numberOfChildren,
      "Father's Name": staff.fatherName,
      "Mother's Name": staff.motherName,
      "Home TP": staff.homeTp,
      "Increment Date": staff.incrementDate,
      "Arrival Date": staff.arrivalDate,
      "Confirmation Date": staff.confirmationDate,
      "Retirement Date": staff.retirementDate,
      Section: staff.section,
      "Mobile Number": staff.mobileNo,
    }))

    // Create worksheet from staff members data with ALL fields
    const worksheet = XLSX.utils.json_to_sheet(exportData)

    // Create workbook and add the worksheet
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Staff Data")

    // Generate Excel file and trigger download
    XLSX.writeFile(workbook, "Complete_Staff_Database.xlsx")

    alert("Complete staff data exported successfully!")
  }

  // Handle print
  const handlePrint = () => {
    // If no ID is searched, alert the user
    if (!searchId && !idNo) {
      alert("Please search for a staff member by ID first")
      return
    }

    // Find the staff member to print
    const staffToPrint = staffMembers.find((staff) => staff.idNo === (searchId || idNo))

    if (!staffToPrint) {
      alert("No staff member found with the given ID")
      return
    }

    // Create a printable div
    const printContent = document.createElement("div")
    printContent.style.padding = "20px"
    printContent.style.fontFamily = "Arial, sans-serif"

    // Add header
    const header = document.createElement("div")
    header.innerHTML = `
  <div style="text-align: center; margin-bottom: 20px;">
    <h1 style="color: #004d40; margin-bottom: 5px;">Staff Member Professional & Personal Details Report</h1>
    <h2 style="color: #00796b; margin-bottom: 20px;">Divisional Secretariat, Galenbindunuwewa</h2>
  </div>
`
    printContent.appendChild(header)

    // Add personal details
    const personalDetails = document.createElement("div")
    personalDetails.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 5px;">Personal Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; width: 30%;"><strong>Full Name:</strong></td>
            <td style="padding: 8px;">${staffToPrint.fullName}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Name With Initials:</strong></td>
            <td style="padding: 8px;">${staffToPrint.nameWithInitials}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Date of Birth:</strong></td>
            <td style="padding: 8px;">${staffToPrint.dob}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>ID Number:</strong></td>
            <td style="padding: 8px;">${staffToPrint.idNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Sex:</strong></td>
            <td style="padding: 8px;">${staffToPrint.sex}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Nationality:</strong></td>
            <td style="padding: 8px;">${staffToPrint.nationality}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Civil Status:</strong></td>
            <td style="padding: 8px;">${staffToPrint.civilStatus}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Permanent Address:</strong></td>
            <td style="padding: 8px;">${staffToPrint.permanentAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Telephone Number:</strong></td>
            <td style="padding: 8px;">${staffToPrint.telephoneNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Religion:</strong></td>
            <td style="padding: 8px;">${staffToPrint.religion}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Temporary Address:</strong></td>
            <td style="padding: 8px;">${staffToPrint.temporaryAddress}</td>
          </tr>
        </table>
      </div>
    `
    printContent.appendChild(personalDetails)

    // Add appointment details
    const appointmentDetails = document.createElement("div")
    appointmentDetails.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 5px;">Appointment Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; width: 30%;"><strong>Appointment Number:</strong></td>
            <td style="padding: 8px;">${staffToPrint.appointmentNumber}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Designation:</strong></td>
            <td style="padding: 8px;">${staffToPrint.designation}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Appointment Date:</strong></td>
            <td style="padding: 8px;">${staffToPrint.appointmentDate}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Grade:</strong></td>
            <td style="padding: 8px;">${staffToPrint.grade}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Service:</strong></td>
            <td style="padding: 8px;">${staffToPrint.service}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Working Branch:</strong></td>
            <td style="padding: 8px;">${staffToPrint.workingBranch}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Ministry:</strong></td>
            <td style="padding: 8px;">${staffToPrint.ministry}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Email:</strong></td>
            <td style="padding: 8px;">${staffToPrint.email}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Widow/Orphan Number:</strong></td>
            <td style="padding: 8px;">${staffToPrint.widowOrphanNo}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>EB Dates:</strong></td>
            <td style="padding: 8px;">
              EB I: ${staffToPrint.ebDate1 || "N/A"} | 
              EB II: ${staffToPrint.ebDate2 || "N/A"} | 
              EB III: ${staffToPrint.ebDate3 || "N/A"}
            </td>
          </tr>
        </table>
      </div>
    `
    printContent.appendChild(appointmentDetails)

    // Add education qualifications
    const educationQualifications = document.createElement("div")
    educationQualifications.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 5px;">Education Qualifications</h3>
        <h4 style="color: #00796b; margin-top: 10px;">O/L Qualifications</h4>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Serial Number</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Year</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Subject Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${staffToPrint.olQualification
              .map(
                (qual) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.serialNumber}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.year}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.subjectName}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.result}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <h4 style="color: #00796b; margin-top: 15px;">A/L Qualifications</h4>
        <table style="width: 100%; border-collapse: collapse; border: 1px solid #ddd;">
          <thead>
            <tr style="background-color: #f2f2f2;">
              <th style="padding: 8px; border: 1px solid #ddd;">Serial Number</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Year</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Subject Name</th>
              <th style="padding: 8px; border: 1px solid #ddd;">Result</th>
            </tr>
          </thead>
          <tbody>
            ${staffToPrint.alQualification
              .map(
                (qual) => `
              <tr>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.serialNumber}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.year}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.subjectName}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${qual.result}</td>
              </tr>
            `,
              )
              .join("")}
          </tbody>
        </table>
        
        <h4 style="color: #00796b; margin-top: 15px;">Higher Qualifications</h4>
        <p style="padding: 8px;">${staffToPrint.higherQualification || "N/A"}</p>
      </div>
    `
    printContent.appendChild(educationQualifications)

    // Add family details
    const familyDetails = document.createElement("div")
    familyDetails.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 5px;">Family Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; width: 30%;"><strong>Spouse Name:</strong></td>
            <td style="padding: 8px;">${staffToPrint.spouseName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Occupation:</strong></td>
            <td style="padding: 8px;">${staffToPrint.occupation || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Number of Children:</strong></td>
            <td style="padding: 8px;">${staffToPrint.numberOfChildren || "0"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Father's Name:</strong></td>
            <td style="padding: 8px;">${staffToPrint.fatherName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Mother's Name:</strong></td>
            <td style="padding: 8px;">${staffToPrint.motherName || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Home TP:</strong></td>
            <td style="padding: 8px;">${staffToPrint.homeTp || "N/A"}</td>
          </tr>
        </table>
      </div>
    `
    printContent.appendChild(familyDetails)

    // Add special dates
    const specialDates = document.createElement("div")
    specialDates.innerHTML = `
      <div style="margin-bottom: 20px;">
        <h3 style="color: #004d40; border-bottom: 2px solid #004d40; padding-bottom: 5px;">Special Dates</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px; width: 30%;"><strong>Increment Date:</strong></td>
            <td style="padding: 8px;">${staffToPrint.incrementDate || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Date of Arrival at Office:</strong></td>
            <td style="padding: 8px;">${staffToPrint.arrivalDate || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Appointment Confirmed Date:</strong></td>
            <td style="padding: 8px;">${staffToPrint.confirmationDate || "N/A"}</td>
          </tr>
          <tr>
            <td style="padding: 8px;"><strong>Date of Retirement:</strong></td>
            <td style="padding: 8px;">${staffToPrint.retirementDate || "N/A"}</td>
          </tr>
        </table>
      </div>
    `
    printContent.appendChild(specialDates)

    // Add footer
    const footer = document.createElement("div")
    footer.innerHTML = `
  <div style="margin-top: 30px; display: flex; justify-content: space-between;">
    <div>
      <p style="font-weight: bold;">Divisional Secretary, Galenbindunuwewa</p>
    </div>
    <div style="text-align: right; font-size: 12px; color: #666;">
      <p>Printed on: ${format(new Date(), "PPP")}</p>
    </div>
  </div>
`
    printContent.appendChild(footer)

    // Create a new window for printing
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Staff Details - ${staffToPrint.nameWithInitials}</title>
            <style>
              @media print {
                body { font-family: Arial, sans-serif; color: #333; }
                h1, h2, h3, h4 { margin-top: 0; }
                table { page-break-inside: avoid; }
                tr { page-break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            ${printContent.outerHTML}
          </body>
        </html>
      `)

      printWindow.document.close()

      // Print after a short delay to ensure content is loaded
      setTimeout(() => {
        printWindow.print()
      }, 500)
    }
  }

  // Handle search by ID
  const handleSearch = () => {
    if (!searchId) {
      setFilteredStaffMembers(staffMembers)
      return
    }

    const foundStaff = staffMembers.find((staff) => staff.idNo === searchId)

    if (foundStaff) {
      // Fill form with found staff data
      setFullName(foundStaff.fullName)
      setNameWithInitials(foundStaff.nameWithInitials)
      setDob(foundStaff.dob ? new Date(foundStaff.dob) : undefined)
      setIdNo(foundStaff.idNo)
      setSex(foundStaff.sex)
      setNationality(foundStaff.nationality)
      setCivilStatus(foundStaff.civilStatus)
      setPermanentAddress(foundStaff.permanentAddress)
      setTelephoneNo(foundStaff.telephoneNo)
      setReligion(foundStaff.religion)
      setTemporaryAddress(foundStaff.temporaryAddress)

      setAppointmentNumber(foundStaff.appointmentNumber)
      setDesignation(foundStaff.designation)
      setAppointmentDate(foundStaff.appointmentDate ? new Date(foundStaff.appointmentDate) : undefined)
      setGrade(foundStaff.grade)
      setService(foundStaff.service)
      setWorkingBranch(foundStaff.workingBranch)
      setMinistry(foundStaff.ministry)
      setEmail(foundStaff.email)
      setWidowOrphanNo(foundStaff.widowOrphanNo)
      setEbDate1(foundStaff.ebDate1)
      setEbDate2(foundStaff.ebDate2)
      setEbDate3(foundStaff.ebDate3)

      setOlQualifications(foundStaff.olQualification)
      setAlQualifications(foundStaff.alQualification)
      setHigherQualification(foundStaff.higherQualification)

      setSpouseName(foundStaff.spouseName)
      setOccupation(foundStaff.occupation)
      setNumberOfChildren(foundStaff.numberOfChildren)
      setFatherName(foundStaff.fatherName)
      setMotherName(foundStaff.motherName)
      setHomeTp(foundStaff.homeTp)

      setIncrementDate(foundStaff.incrementDate ? new Date(foundStaff.incrementDate) : undefined)
      setArrivalDate(foundStaff.arrivalDate ? new Date(foundStaff.arrivalDate) : undefined)
      setConfirmationDate(foundStaff.confirmationDate ? new Date(foundStaff.confirmationDate) : undefined)
      setRetirementDate(foundStaff.retirementDate ? new Date(foundStaff.retirementDate) : undefined)

      setImagePreview(foundStaff.imageUrl)

      // Filter table to show only this staff member
      setFilteredStaffMembers([foundStaff])
    } else {
      alert("No staff member found with the given ID")
      setFilteredStaffMembers([])
    }
  }

  // Handle image upload
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check file type
      if (!["image/jpeg", "image/png", "image/tiff"].includes(file.type)) {
        alert("Please select a JPEG, PNG, or TIFF image")
        return
      }

      // Create a URL for the image preview
      const imageUrl = URL.createObjectURL(file)
      setImagePreview(imageUrl)
    }
  }

  // Handle adding a new OL qualification row
  const handleAddOlQualification = () => {
    setOlQualifications([
      ...olQualifications,
      {
        id: Date.now().toString(),
        serialNumber: (olQualifications.length + 1).toString(),
        year: "",
        subjectName: "",
        result: "",
      },
    ])
  }

  // Handle adding a new AL qualification row
  const handleAddAlQualification = () => {
    setAlQualifications([
      ...alQualifications,
      {
        id: Date.now().toString(),
        serialNumber: (alQualifications.length + 1).toString(),
        year: "",
        subjectName: "",
        result: "",
      },
    ])
  }

  // Handle updating OL qualification
  const handleOlQualificationChange = (id: string, field: keyof OLQualification, value: string) => {
    setOlQualifications(olQualifications.map((qual) => (qual.id === id ? { ...qual, [field]: value } : qual)))
  }

  // Handle updating AL qualification
  const handleAlQualificationChange = (id: string, field: keyof ALQualification, value: string) => {
    setAlQualifications(alQualifications.map((qual) => (qual.id === id ? { ...qual, [field]: value } : qual)))
  }

  // Format date for display
  const formatDate = (date: Date | undefined) => {
    return date ? format(date, "MM/dd/yyyy") : ""
  }

  // Handle key press in AL table cells to move to next cell
  const handleAlTableKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>,
    id: string,
    field: keyof ALQualification,
    index: number,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()

      // Determine the next field to focus based on current field
      let nextField: keyof ALQualification | null = null
      let nextId = id

      if (field === "serialNumber") {
        nextField = "year"
      } else if (field === "year") {
        nextField = "subjectName"
      } else if (field === "subjectName") {
        nextField = "result"
      } else if (field === "result") {
        // If we're at the last field of the last row, add a new row
        if (index === alQualifications.length - 1) {
          handleAddAlQualification()
          // Focus will be set in useEffect
          return
        } else {
          // Move to the first field of the next row
          nextId = alQualifications[index + 1].id
          nextField = "serialNumber"
        }
      }

      if (nextField) {
        // Find the next input element and focus it
        const nextInput = document.querySelector(
          `input[data-al-id="${nextId}"][data-field="${nextField}"]`,
        ) as HTMLInputElement
        if (nextInput) {
          nextInput.focus()
        }
      }
    }
  }

  // Handle download of education qualifications as PDF
  const handleDownloadEducationPDF = () => {
    const staffName = searchId
      ? staffMembers.find((staff) => staff.idNo === searchId)?.nameWithInitials || "Staff Member"
      : idNo
        ? staffMembers.find((staff) => staff.idNo === idNo)?.nameWithInitials || "Staff Member"
        : "Staff Member"

    // Create new jsPDF instance
    const doc = new jsPDF()

    // Add title
    doc.setFontSize(16)
    doc.setFont("helvetica", "bold")
    doc.text(`Education Qualifications - ${staffName}`, 105, 15, { align: "center" })

    // Add subtitle with date
    doc.setFontSize(10)
    doc.setFont("helvetica", "normal")
    doc.text(`Generated on ${format(new Date(), "PPP")}`, 105, 22, { align: "center" })
    doc.text("Divisional Secretariat, Galenbindunuwewa", 105, 27, { align: "center" })

    // Add divider line
    doc.setDrawColor(0, 77, 64)
    doc.setLineWidth(0.5)
    doc.line(14, 30, 196, 30)

    // Add O/L qualifications
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 77, 64)
    doc.text("O/L Qualifications", 14, 40)

    // Create table for O/L qualifications
    const olTableData = olQualifications.map((qual) => [qual.serialNumber, qual.year, qual.subjectName, qual.result])

    doc.autoTable({
      startY: 45,
      head: [["Serial Number", "Year", "Subject Name", "Result"]],
      body: olTableData,
      theme: "grid",
      headStyles: { fillColor: [0, 77, 64], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    })

    // Add A/L qualifications
    const olTableHeight = olQualifications.length * 10 + 10 // Approximate height
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 77, 64)
    doc.text("A/L Qualifications", 14, 45 + olTableHeight + 10)

    // Create table for A/L qualifications
    const alTableData = alQualifications.map((qual) => [qual.serialNumber, qual.year, qual.subjectName, qual.result])

    doc.autoTable({
      startY: 45 + olTableHeight + 15,
      head: [["Serial Number", "Year", "Subject Name", "Result"]],
      body: alTableData,
      theme: "grid",
      headStyles: { fillColor: [0, 77, 64], textColor: [255, 255, 255] },
      styles: { fontSize: 10 },
    })

    // Add Higher qualifications
    const alTableHeight = alQualifications.length * 10 + 10 // Approximate height
    doc.setFontSize(14)
    doc.setFont("helvetica", "bold")
    doc.setTextColor(0, 77, 64)
    doc.text("Higher Qualifications", 14, 45 + olTableHeight + alTableHeight + 25)

    // Add higher qualification text
    doc.setFontSize(12)
    doc.setFont("helvetica", "normal")
    doc.setTextColor(0, 0, 0)
    doc.text(higherQualification || "No higher qualifications added", 14, 45 + olTableHeight + alTableHeight + 35)

    // Add footer
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated on ${format(new Date(), "PPP")}`, 14, 280)
    doc.text("Divisional Secretariat, Galenbindunuwewa", 105, 280, { align: "center" })
    doc.text("Page 1 of 1", 196, 280, { align: "right" })

    // Save the PDF
    doc.save(`Education_Qualifications_${staffName.replace(/\s+/g, "_")}.pdf`)
  }

  // Create refs for calendar popover positioning
  const calendarRefs = {
    dob: useRef<HTMLDivElement>(null),
    appointmentDate: useRef<HTMLDivElement>(null),
    incrementDate: useRef<HTMLDivElement>(null),
    arrivalDate: useRef<HTMLDivElement>(null),
    confirmationDate: useRef<HTMLDivElement>(null),
    retirementDate: useRef<HTMLDivElement>(null),
  }

  // Custom calendar component with fixed positioning
  const CustomCalendar = ({
    date,
    onSelect,
    refKey,
  }: {
    date: Date | undefined
    onSelect: (date: Date | undefined) => void
    refKey: keyof typeof calendarRefs
  }) => {
    return (
      <div ref={calendarRefs[refKey]}>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal bg-white">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? formatDate(date) : "Select date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start" side="top">
            <div className="custom-calendar">
              <Calendar
                mode="single"
                selected={date}
                onSelect={onSelect}
                initialFocus
                captionLayout="dropdown-buttons"
                fromYear={1965}
                toYear={new Date().getFullYear()}
                className="custom-calendar-body"
              />
            </div>
          </PopoverContent>
        </Popover>
      </div>
    )
  }

  // Handle close button click
  const handleCloseClick = () => {
    // Navigate to the Activities of Establishment Section form
    router.push("/office-section")
  }

  // Fix the Staff Database layout to avoid horizontal scrolling
  // Update the main container to use a more responsive layout

  // Update the main container div to use a more responsive layout
  return (
    <div className="min-h-screen p-4" style={{ backgroundColor: "#B2BEB5" }}>
      {/* Header with HOME button and close icon */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-black">Staff Database System</h1>
        <div className="home-button-container relative">
          <button className="home-button" onClick={() => router.push("/office-section")}>
            HOME
          </button>
        </div>
      </div>

      {/* Main content with responsive grid layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left column - Personal Details */}
        <div className="bg-white border border-gray-300 p-3 rounded shadow-sm lg:col-span-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-blue-800">Personal Details</h2>
            <Button variant="ghost" size="icon" onClick={handleClose} className="h-8 w-8 rounded-full">
              <X className="h-5 w-5" />
            </Button>
          </div>

          {/* Personal details form fields */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Full Name:</label>
              <Input value={fullName} onChange={(e) => setFullName(e.target.value)} className="flex-1 bg-white" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Name With Initials:</label>
              <Input
                value={nameWithInitials}
                onChange={(e) => setNameWithInitials(e.target.value)}
                className="flex-1 bg-white"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">DOB:</label>
              <div className="flex-1">
                <CustomCalendar date={dob} onSelect={setDob} refKey="dob" />
              </div>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">ID NO:</label>
              <Input value={idNo} onChange={(e) => setIdNo(e.target.value)} className="flex-1 bg-white" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">SEX:</label>
              <Select value={sex} onValueChange={setSex}>
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="Select sex" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Nationality:</label>
              <Select value={nationality} onValueChange={setNationality}>
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Sri Lankan">Sri Lankan</SelectItem>
                  <SelectItem value="Sri Lankan Tamil">Sri Lankan Tamil</SelectItem>
                  <SelectItem value="Muslim">Muslim</SelectItem>
                  <SelectItem value="Burger">Burger</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Civil Status:</label>
              <Select value={civilStatus} onValueChange={setCivilStatus}>
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="Select civil status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Single">Single</SelectItem>
                  <SelectItem value="Married">Married</SelectItem>
                  <SelectItem value="Divorced">Divorced</SelectItem>
                  <SelectItem value="Widowed">Widowed</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Permanent Address:</label>
              <textarea
                value={permanentAddress}
                onChange={(e) => setPermanentAddress(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-md p-2 min-h-[100px]"
              />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Telephone NO:</label>
              <Input value={telephoneNo} onChange={(e) => setTelephoneNo(e.target.value)} className="flex-1 bg-white" />
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Religion:</label>
              <Select value={religion} onValueChange={setReligion}>
                <SelectTrigger className="flex-1 bg-white">
                  <SelectValue placeholder="Select religion" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Buddhism">Buddhism</SelectItem>
                  <SelectItem value="Hinduism">Hinduism</SelectItem>
                  <SelectItem value="Islam">Islam</SelectItem>
                  <SelectItem value="Christianity">Christianity</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center">
              <label className="w-40 text-right mr-4 text-gray-700">Temporary Address:</label>
              <textarea
                value={temporaryAddress}
                onChange={(e) => setTemporaryAddress(e.target.value)}
                className="flex-1 bg-white border border-gray-300 rounded-md p-2 min-h-[100px]"
              />
            </div>
          </div>
        </div>

        {/* Middle column - Appointment Details and Family Details */}
        <div className="flex flex-col gap-4 lg:col-span-5">
          {/* Staff Count and Search */}
          <div className="flex justify-between items-center bg-white border border-gray-300 p-3 rounded shadow-sm">
            <div className="bg-white border border-gray-300 p-2 rounded shadow-sm" style={{ width: "120px" }}>
              <span className="text-blue-800 font-bold">Staff Count: </span>
              <span className="bg-gray-100 px-2 py-1 rounded">{filteredStaffMembers.length}</span>
            </div>

            <div className="flex items-center">
              <div className="mr-2">
                <Search className="h-6 w-6 text-blue-800" />
              </div>
              <span className="text-gray-700 mr-2 whitespace-nowrap">SEARCH By ID:</span>
              <Input value={searchId} onChange={(e) => setSearchId(e.target.value)} className="w-40 bg-white" />
              <Button onClick={handleSearch} className="ml-2 bg-blue-600 hover:bg-blue-700" size="sm">
                Search
              </Button>
            </div>
          </div>

          {/* Appointment Details */}
          <div className="bg-white border border-gray-300 p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold text-blue-800 mb-4">Appointment Details</h2>

            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Appointment Number:</label>
                <Input
                  value={appointmentNumber}
                  onChange={(e) => setAppointmentNumber(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Designation:</label>
                <Input
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Appointment Date:</label>
                <div className="flex-1">
                  <CustomCalendar date={appointmentDate} onSelect={setAppointmentDate} refKey="appointmentDate" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Grade:</label>
                <Select value={grade} onValueChange={setGrade}>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Select grade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Grade I">Grade I</SelectItem>
                    <SelectItem value="Grade II">Grade II</SelectItem>
                    <SelectItem value="Grade III">Grade III</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Service:</label>
                <Select value={service} onValueChange={setService}>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Management Service Officer Service">
                      Management Service Officer Service
                    </SelectItem>
                    <SelectItem value="Sri Lanka Combine Service">Sri Lanka Combine Service</SelectItem>
                    <SelectItem value="Development Officer Service">Development Officer Service</SelectItem>
                    <SelectItem value="Sri Lanka Accountancy Service">Sri Lanka Accountancy Service</SelectItem>
                    <SelectItem value="Sri Lanka Administrative Service">Sri Lanka Administrative Service</SelectItem>
                    <SelectItem value="Planning Service">Planning Service</SelectItem>
                    <SelectItem value="Sri Lanka Scientific Service">Sri Lanka Scientific Service</SelectItem>
                    <SelectItem value="Sri Lanka Compilation service">Sri Lanka Compilation service</SelectItem>
                    <SelectItem value="Sri Lanka Information and Communication Service">
                      Sri Lanka Information and Communication Service
                    </SelectItem>
                    <SelectItem value="Sri Lanka Technical Service">Sri Lanka Technical Service</SelectItem>
                    <SelectItem value="Management Assistance – None Technical Service">
                      Management Assistance – None Technical Service
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Working Branch:</label>
                <Select value={workingBranch} onValueChange={setWorkingBranch}>
                  <SelectTrigger className="flex-1 bg-white">
                    <SelectValue placeholder="Select branch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Establishment">Establishment</SelectItem>
                    <SelectItem value="Account">Account</SelectItem>
                    <SelectItem value="Development">Development</SelectItem>
                    <SelectItem value="Land">Land</SelectItem>
                    <SelectItem value="Grama Niladhari">Grama Niladhari</SelectItem>
                    <SelectItem value="Administrative">Administrative</SelectItem>
                    <SelectItem value="Social Service">Social Service</SelectItem>
                    <SelectItem value="Field Officers">Field Officers</SelectItem>
                    <SelectItem value="Pension">Pension</SelectItem>
                    <SelectItem value="Persons Registrar">Persons Registrar</SelectItem>
                    <SelectItem value="Registrar">Registrar</SelectItem>
                    <SelectItem value="Small Business Counselling">Small Business Counselling</SelectItem>
                    <SelectItem value="Women & Child">Women & Child</SelectItem>
                    <SelectItem value="Buddhist Affairs">Buddhist Affairs</SelectItem>
                    <SelectItem value="Technical Officer">Technical Officer</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Ministry Or Dpt:</label>
                <Input value={ministry} onChange={(e) => setMinistry(e.target.value)} className="flex-1 bg-white" />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Email:</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white"
                  type="email"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Widow Orphan No:</label>
                <Input
                  value={widowOrphanNo}
                  onChange={(e) => setWidowOrphanNo(e.target.value)}
                  className="flex-1 bg-white"
                />
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Date of Passing EB:</label>
                <div className="flex space-x-1">
                  <span className="text-gray-700">EB I:</span>
                  <Select value={ebDate1} onValueChange={setEbDate1}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: new Date().getFullYear() - 1964 }, (_, i) => (
                        <SelectItem key={i} value={(1965 + i).toString()}>
                          {1965 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-700">EB II:</span>
                  <Select value={ebDate2} onValueChange={setEbDate2}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: new Date().getFullYear() - 1964 }, (_, i) => (
                        <SelectItem key={i} value={(1965 + i).toString()}>
                          {1965 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <span className="text-gray-700">EB III:</span>
                  <Select value={ebDate3} onValueChange={setEbDate3}>
                    <SelectTrigger className="w-20 bg-white">
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: new Date().getFullYear() - 1964 }, (_, i) => (
                        <SelectItem key={i} value={(1965 + i).toString()}>
                          {1965 + i}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Family Details */}
          <div className="bg-white border border-gray-300 p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold text-blue-800 mb-4">Family Details</h2>

            <div className="grid grid-cols-1 gap-4">
              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Husband/Wife Name:</label>
                <Input value={spouseName} onChange={(e) => setSpouseName(e.target.value)} className="flex-1 bg-white" />
              </div>

              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Occupation:</label>
                <Input value={occupation} onChange={(e) => setOccupation(e.target.value)} className="flex-1 bg-white" />
              </div>

              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Number of Children:</label>
                <Input
                  value={numberOfChildren}
                  onChange={(e) => setNumberOfChildren(e.target.value)}
                  className="flex-1 bg-white"
                  type="number"
                />
              </div>

              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Father's Name:</label>
                <Input value={fatherName} onChange={(e) => setFatherName(e.target.value)} className="flex-1 bg-white" />
              </div>

              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Mother's Name:</label>
                <Input value={motherName} onChange={(e) => setMotherName(e.target.value)} className="flex-1 bg-white" />
              </div>

              <div className="flex items-center">
                <label className="w-48 text-right mr-4 text-gray-700">Home TP:</label>
                <Input value={homeTp} onChange={(e) => setHomeTp(e.target.value)} className="flex-1 bg-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Right column - Education and Control Center */}
        <div className="flex flex-col gap-4 lg:col-span-3">
          {/* Education Qualifications */}
          <div className="bg-white border border-gray-300 p-4 rounded shadow-sm relative">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-800">Education Qualifications</h2>
              <Button
                onClick={() => setShowEducationPreview(!showEducationPreview)}
                className="bg-blue-600 hover:bg-blue-700"
                size="sm"
              >
                <Eye className="h-4 w-4 mr-1" />
                Preview
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-center text-blue-800 underline mb-2">OL:</h3>
                <div className="border rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Serial Number</TableHead>
                        <TableHead className="text-center">Year</TableHead>
                        <TableHead className="text-center">Subject Name</TableHead>
                        <TableHead className="text-center">Result</TableHead>
                        <TableHead className="w-10"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {olQualifications.map((qual) => (
                        <TableRow key={qual.id}>
                          <TableCell className="p-2">
                            <Input
                              value={qual.serialNumber}
                              onChange={(e) => handleOlQualificationChange(qual.id, "serialNumber", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Select
                              value={qual.year}
                              onValueChange={(value) => handleOlQualificationChange(qual.id, "year", value)}
                            >
                              <SelectTrigger className="h-8 text-sm">
                                <SelectValue placeholder="Year" />
                              </SelectTrigger>
                              <SelectContent>
                                {Array.from({ length: new Date().getFullYear() - 1964 }, (_, i) => (
                                  <SelectItem key={i} value={(1965 + i).toString()}>
                                    {1965 + i}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={qual.subjectName}
                              onChange={(e) => handleOlQualificationChange(qual.id, "subjectName", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              value={qual.result}
                              onChange={(e) => handleOlQualificationChange(qual.id, "result", e.target.value)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button onClick={handleAddOlQualification} className="mt-2 bg-green-600 hover:bg-green-700" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>

              <div>
                <h3 className="text-center text-blue-800 underline mb-2">AL:</h3>
                <div className="border rounded overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-center">Serial Number</TableHead>
                        <TableHead className="text-center">Year</TableHead>
                        <TableHead className="text-center">Subject Name</TableHead>
                        <TableHead className="text-center">Result</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {alQualifications.map((qual, index) => (
                        <TableRow key={qual.id}>
                          <TableCell className="p-2">
                            <Input
                              data-al-id={qual.id}
                              data-field="serialNumber"
                              value={qual.serialNumber}
                              onChange={(e) => handleAlQualificationChange(qual.id, "serialNumber", e.target.value)}
                              onKeyDown={(e) => handleAlTableKeyPress(e, qual.id, "serialNumber", index)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              data-al-id={qual.id}
                              data-field="year"
                              value={qual.year}
                              onChange={(e) => handleAlQualificationChange(qual.id, "year", e.target.value)}
                              onKeyDown={(e) => handleAlTableKeyPress(e, qual.id, "year", index)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              data-al-id={qual.id}
                              data-field="subjectName"
                              value={qual.subjectName}
                              onChange={(e) => handleAlQualificationChange(qual.id, "subjectName", e.target.value)}
                              onKeyDown={(e) => handleAlTableKeyPress(e, qual.id, "subjectName", index)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                          <TableCell className="p-2">
                            <Input
                              data-al-id={qual.id}
                              data-field="result"
                              value={qual.result}
                              onChange={(e) => handleAlQualificationChange(qual.id, "result", e.target.value)}
                              onKeyDown={(e) => handleAlTableKeyPress(e, qual.id, "result", index)}
                              className="h-8 text-sm"
                            />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                <Button onClick={handleAddAlQualification} className="mt-2 bg-green-600 hover:bg-green-700" size="sm">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Row
                </Button>
              </div>

              <div>
                <h3 className="text-center text-blue-800 underline mb-2">Higher</h3>
                <div
                  className="border rounded p-2 bg-white min-h-[120px]"
                  contentEditable={true}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault()
                      const selection = window.getSelection()
                      const range = selection?.getRangeAt(0)
                      const br = document.createElement("br")
                      const bullet = document.createElement("span")
                      bullet.innerHTML = "• "
                      range?.insertNode(br)
                      range?.setStartAfter(br)
                      range?.insertNode(bullet)
                      range?.setStartAfter(bullet)
                      range?.collapse(true)
                      return false
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: "• " }}
                />
              </div>
            </div>

            {/* Education Preview Modal */}
            {showEducationPreview && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-auto">
                  <h2 className="text-xl font-bold text-blue-800 mb-4 text-center">
                    Education Qualifications Preview -{" "}
                    {searchId
                      ? staffMembers.find((staff) => staff.idNo === searchId)?.nameWithInitials || "Staff Member"
                      : idNo
                        ? staffMembers.find((staff) => staff.idNo === idNo)?.nameWithInitials || "Staff Member"
                        : "Staff Member"}
                  </h2>

                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">O/L Qualifications</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Subject Name</TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {olQualifications.map((qual) => (
                            <TableRow key={qual.id}>
                              <TableCell>{qual.serialNumber}</TableCell>
                              <TableCell>{qual.year}</TableCell>
                              <TableCell>{qual.subjectName}</TableCell>
                              <TableCell>{qual.result}</TableCell>
                            </TableRow>
                          ))}
                          {olQualifications.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No O/L qualifications added
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">A/L Qualifications</h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Serial Number</TableHead>
                            <TableHead>Year</TableHead>
                            <TableHead>Subject Name</TableHead>
                            <TableHead>Result</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {alQualifications.map((qual) => (
                            <TableRow key={qual.id}>
                              <TableCell>{qual.serialNumber}</TableCell>
                              <TableCell>{qual.year}</TableCell>
                              <TableCell>{qual.subjectName}</TableCell>
                              <TableCell>{qual.result}</TableCell>
                            </TableRow>
                          ))}
                          {alQualifications.length === 0 && (
                            <TableRow>
                              <TableCell colSpan={4} className="text-center py-4 text-gray-500">
                                No A/L qualifications added
                              </TableCell>
                            </TableRow>
                          )}
                        </TableBody>
                      </Table>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-blue-700 border-b pb-2 mb-3">Higher Qualifications</h3>
                      <div className="p-3 bg-gray-50 rounded border">
                        {higherQualification || "No higher qualifications added"}
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between">
                    <Button onClick={handleDownloadEducationPDF} className="bg-green-600 hover:bg-green-700">
                      Download Now
                    </Button>
                    <Button onClick={() => setShowEducationPreview(false)} className="bg-blue-600 hover:bg-blue-700">
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Upload Image */}
          <div
            className="flex items-center justify-between border border-gray-300 p-4 rounded shadow-sm"
            style={{ backgroundColor: "#FFF0F5" }}
          >
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => fileInputRef.current?.click()}>
              <Upload className="mr-2 h-4 w-4" />
              Upload Image
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,image/tiff"
              onChange={handleImageUpload}
            />

            {imagePreview ? (
              <div className="w-24 h-24 border rounded overflow-hidden ml-4">
                <img src={imagePreview || "/placeholder.svg"} alt="Staff" className="w-full h-full object-cover" />
              </div>
            ) : (
              <div className="w-24 h-24 border rounded flex items-center justify-center bg-gray-100 ml-4">
                <span className="text-gray-400 text-xs text-center">No image</span>
              </div>
            )}
          </div>

          {/* Control Center */}
          <div className="bg-white border border-gray-300 p-4 rounded shadow-sm">
            <h2 className="text-lg font-bold text-blue-800 mb-4 text-center">Control Center</h2>

            <div className="grid grid-cols-2 gap-3">
              <Button
                className="bg-blue-600 hover:bg-blue-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={handleUpdate}
              >
                UPDATE
              </Button>

              <Button
                className="bg-green-600 hover:bg-green-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={handleSave}
              >
                SAVE
              </Button>

              <Button
                className="bg-amber-600 hover:bg-amber-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={clearForm}
              >
                CLEAR
              </Button>

              <Button
                className="bg-red-600 hover:bg-red-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={handleDelete}
              >
                DELETE
              </Button>

              <Button
                className="bg-purple-600 hover:bg-purple-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={handleExport}
              >
                EXPORT
              </Button>

              <Button
                className="bg-orange-600 hover:bg-orange-700 py-2 px-4 rounded-md shadow-sm transition-all hover:shadow-md"
                onClick={handlePrint}
              >
                PRINT
              </Button>
            </div>
          </div>

          {/* Special Dates */}
          <div className="bg-white border border-gray-300 p-4 rounded shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-blue-800">Special Dates</h2>
              <div className="animate-pulse-border">
                <div className="bg-gray-100 p-2 rounded">
                  <span className="text-sm text-gray-700">Now Age:</span>
                  <span className="ml-2 font-bold">{calculateAge()}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Increment Date:</label>
                <div className="w-40">
                  <CustomCalendar date={incrementDate} onSelect={setIncrementDate} refKey="incrementDate" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Date of Arrival:</label>
                <div className="w-40">
                  <CustomCalendar date={arrivalDate} onSelect={setArrivalDate} refKey="arrivalDate" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Confirmation Date:</label>
                <div className="w-40">
                  <CustomCalendar date={confirmationDate} onSelect={setConfirmationDate} refKey="confirmationDate" />
                </div>
              </div>

              <div className="flex items-center">
                <label className="w-40 text-right mr-2 text-gray-700">Retirement Date:</label>
                <div className="w-40">
                  <CustomCalendar date={retirementDate} onSelect={setRetirementDate} refKey="retirementDate" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Staff Records Table */}
      <div className="mt-4 bg-white border border-gray-300 p-4 rounded shadow-sm overflow-x-auto">
        <Table className="bg-[#FAE6FA]">
          <TableHeader className="bg-gray-100">
            <TableRow>
              <TableHead className="text-gray-700 text-center">FULL NAME</TableHead>
              <TableHead className="text-gray-700 text-center">NAME WITH INITIALS</TableHead>
              <TableHead className="text-gray-700 text-center">DOB</TableHead>
              <TableHead className="text-gray-700 text-center">ID NO</TableHead>
              <TableHead className="text-gray-700 text-center">SEX</TableHead>
              <TableHead className="text-gray-700 text-center">MOBILE NO</TableHead>
              <TableHead className="text-gray-700 text-center">CIVIL STATUS</TableHead>
              <TableHead className="text-gray-700 text-center">SECTION</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStaffMembers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-4 text-gray-500">
                  No staff members found
                </TableCell>
              </TableRow>
            ) : (
              filteredStaffMembers.map((staff) => (
                <TableRow key={staff.id} className="hover:bg-gray-50">
                  <TableCell className="text-gray-700">{staff.fullName}</TableCell>
                  <TableCell className="text-gray-700">{staff.nameWithInitials}</TableCell>
                  <TableCell className="text-gray-700">{staff.dob}</TableCell>
                  <TableCell className="text-gray-700">{staff.idNo}</TableCell>
                  <TableCell className="text-gray-700">{staff.sex}</TableCell>
                  <TableCell className="text-gray-700">{staff.mobileNo}</TableCell>
                  <TableCell className="text-gray-700">{staff.civilStatus}</TableCell>
                  <TableCell className="text-gray-700">{staff.section}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* CSS styles */}
      <style jsx global>{`
      /* From Uiverse.io by namecho */
      .home-button,
      .home-button::after {
        padding: 16px 20px;
        font-size: 18px;
        background: linear-gradient(45deg, transparent 5%, #ff013c 5%);
        border: 0;
        color: #fff;
        letter-spacing: 3px;
        line-height: 1;
        box-shadow: 6px 0px 0px #00e6f6;
        outline: transparent;
        position: relative;
      }

      .home-button::after {
        --slice-0: inset(50% 50% 50% 50%);
        --slice-1: inset(80% -6px 0 0);
        --slice-2: inset(50% -6px 30% 0);
        --slice-3: inset(10% -6px 85% 0);
        --slice-4: inset(40% -6px 43% 0);
        --slice-5: inset(80% -6px 5% 0);
        content: "HOVER ME";
        display: block;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(45deg, transparent 3%, #00e6f6 3%, #00e6f6 5%, #ff013c 5%);
        text-shadow: -3px -3px 0px #f8f005, 3px 3px 0px #00e6f6;
        clip-path: var(--slice-0);
      }

      .home-button:hover::after {
        animation: 1s glitch;
        animation-timing-function: steps(2, end);
      }

      @keyframes glitch {
        0% {
          clip-path: var(--slice-1);
          transform: translate(-20px, -10px);
        }

        10% {
          clip-path: var(--slice-3);
          transform: translate(10px, 10px);
        }

        20% {
          clip-path: var(--slice-1);
          transform: translate(-10px, 10px);
        }

        30% {
          clip-path: var(--slice-3);
          transform: translate(0px, 5px);
        }

        40% {
          clip-path: var(--slice-2);
          transform: translate(-5px, 0px);
        }

        50% {
          clip-path: var(--slice-3);
          transform: translate(5px, 0px);
        }

        60% {
          clip-path: var(--slice-4);
          transform: translate(5px, 10px);
        }

        70% {
          clip-path: var(--slice-2);
          transform: translate(-10px, 10px);
        }

        80% {
          clip-path: var(--slice-5);
          transform: translate(20px, -10px);
        }

        90% {
          clip-path: var(--slice-1);
          transform: translate(-10px, 0px);
        }

        100% {
          clip-path: var(--slice-1);
          transform: translate(0);
        }
      }
      
      .home-button-container {
        position: absolute;
        top: 10px;
        right: 20px;
      }
      
      /* Animated border for Now Age */
      .animate-pulse-border {
        position: relative;
        border-radius: 0.375rem;
        overflow: hidden;
      }
      
      .animate-pulse-border::before {
        content: '';
        position: absolute;
        top: -2px;
        left: -2px;
        right: -2px;
        bottom: -2px;
        background: linear-gradient(45deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
        background-size: 400%;
        z-index: -1;
        animation: animate-border 20s linear infinite;
        border-radius: 0.5rem;
      }
      
      @keyframes animate-border {
        0% {
          background-position: 0 0;
        }
        50% {
          background-position: 400% 0;
        }
        100% {
          background-position: 0 0;
        }
      }
      
      /* Custom Calendar Styles */
      .custom-calendar {
        background: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      
      .custom-calendar-body {
        padding: 12px;
      }
      
      /* Print styles */
      @media print {
        .home-button-container,
        button {
          display: none;
        }
      }

      .react-datepicker__header .react-datepicker__current-month,
      .react-datepicker__header .react-datepicker__header__dropdown {
        display: none !important;
      }
    `}</style>
    </div>
  )
}

