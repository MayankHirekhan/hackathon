"use client"

import { useState, useRef, useEffect } from "react"

interface DatePickerFieldProps {
 label: string
 value: string
 onChange: (date: string) => void
}

export default function DatePickerField({ label, value, onChange }: DatePickerFieldProps) {
 const [showCalendar, setShowCalendar] = useState(false)
 const [currentMonth, setCurrentMonth] = useState(new Date())
 const calendarRef = useRef<HTMLDivElement>(null)

 // Format date for display
 const formatDate = (dateString: string) => {
  if (!dateString) return ""
  const date = new Date(dateString + "T00:00:00")
  return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })
 }

 // Get days in month
 const getDaysInMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate()
 }

 // Get first day of month
 const getFirstDayOfMonth = (date: Date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
 }

 // Generate calendar days
 const generateCalendarDays = () => {
  const daysInMonth = getDaysInMonth(currentMonth)
  const firstDay = getFirstDayOfMonth(currentMonth)
  const days = []

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
   days.push(null)
  }

  // Days of month
  for (let i = 1; i <= daysInMonth; i++) {
   days.push(i)
  }

  return days
 }

 // Handle day click
 const handleDayClick = (day: number) => {
  const selectedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
  const dateString = selectedDate.toISOString().split("T")[0]
  onChange(dateString)
  setShowCalendar(false)
 }

 // Handle month navigation
 const previousMonth = () => {
  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
 }

 const nextMonth = () => {
  setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
 }

 // Close calendar when clicking outside
 useEffect(() => {
  const handleClickOutside = (event: MouseEvent) => {
   if (calendarRef.current && !calendarRef.current.contains(event.target as Node)) {
    setShowCalendar(false)
   }
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
 }, [])

 const calendarDays = generateCalendarDays()
 const monthYear = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric" })

  return (
   <div className="space-y-2 relative" ref={calendarRef}>
    <label className="text-sm text-emerald-700 font-medium">{label}</label>

   {/* INPUT FIELD */}
    <div
     onClick={() => setShowCalendar(!showCalendar)}
     className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900 cursor-pointer hover:border-emerald-400 transition flex items-center justify-between shadow-sm"
    >
     <span>{value ? formatDate(value) : "Select date"}</span>
     <span className="text-lg">📅</span>
    </div>

   {/* CALENDAR POPUP */}
    {showCalendar && (
     <div className="absolute top-full left-0 mt-2 z-50 bg-white border border-emerald-200 rounded-2xl shadow-xl p-4 w-80">
     {/* MONTH/YEAR HEADER */}
      <div className="flex justify-between items-center mb-4">
       <button
        onClick={previousMonth}
        className="p-2 hover:bg-emerald-50 rounded text-emerald-600"
       >
        ◀
       </button>
       <h3 className="text-emerald-800 font-semibold text-center flex-1">{monthYear}</h3>
       <button
        onClick={nextMonth}
        className="p-2 hover:bg-emerald-50 rounded text-emerald-600"
       >
        ▶
       </button>
      </div>

     {/* WEEKDAY HEADERS */}
      <div className="grid grid-cols-7 gap-1 mb-2">
       {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
        <div key={day} className="text-center text-emerald-600 text-xs font-semibold py-1">
         {day}
        </div>
       ))}
      </div>

     {/* CALENDAR DAYS */}
      <div className="grid grid-cols-7 gap-1">
       {calendarDays.map((day, index) => (
        <button
         key={index}
         onClick={() => day && handleDayClick(day)}
         disabled={day === null}
         className={`
          p-2 rounded-lg text-sm font-medium transition
          ${day === null ? "bg-transparent cursor-default" : "hover:bg-emerald-100 text-emerald-800"}
          ${value && new Date(value).getDate() === day && new Date(value).getMonth() === currentMonth.getMonth() ? "bg-emerald-600 text-white font-semibold" : ""}
         `}
        >
         {day}
        </button>
       ))}
      </div>

     {/* CLOSE BUTTON */}
      <button
       onClick={() => setShowCalendar(false)}
       className="w-full mt-4 p-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-sm"
      >
       Close
      </button>
     </div>
    )}
   </div>
  )
}
