"use client"

import { useEffect,useState } from "react"

export default function AdminProfile(){

 const [admin,setAdmin]=useState<any>(null)

 useEffect(()=>{

 const data = JSON.parse(localStorage.getItem("admin") || "{}")

 setAdmin(data)

 },[])

 if(!admin) return null

  return(

  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm flex items-center gap-6">

  <div className="w-16 h-16 rounded-full border-2 border-emerald-300 bg-emerald-50 flex items-center justify-center text-emerald-700">
   🛡️
  </div>

  <div>

  <h2 className="text-xl font-semibold text-emerald-900">{admin.name}</h2>

  <p className="text-emerald-700">{admin.email}</p>

  <p className="text-sm text-emerald-600">National Operations Desk</p>

  </div>

  </div>

  )

}
