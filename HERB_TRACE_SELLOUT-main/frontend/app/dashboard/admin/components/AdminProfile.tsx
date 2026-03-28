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

 <div className="bg-[#062f27] p-6 rounded-lg flex items-center gap-6">

 <div className="w-20 h-20 rounded-full border-4 border-green-500"></div>

 <div>

 <h2 className="text-xl font-bold">{admin.name}</h2>

 <p className="text-gray-300">{admin.email}</p>

 <p className="text-sm text-gray-400">System Administrator</p>

 </div>

 </div>

 )

}