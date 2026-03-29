"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

export default function FarmersPage(){

 const [farmers,setFarmers] = useState<any[]>([])

 useEffect(()=>{

  fetch("http://localhost:5000/api/admin/farmers")
  .then(res=>res.json())
  .then(data=>setFarmers(data))

 },[])


 const banFarmer = async(id:string)=>{

  await fetch(`http://localhost:5000/api/admin/farmer/${id}/ban`,{
   method:"PUT"
  })

  setFarmers(farmers.map(f=>
   f._id===id ? {...f,banned:!f.banned} : f
  ))

 }


 return(

 <div className="space-y-6">

  <div>
   <h1 className="text-3xl font-bold text-emerald-900">Farmers Management</h1>
   <p className="text-sm text-emerald-700">Monitor farmer onboarding, compliance, and field activity.</p>
  </div>

  <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

  <table className="w-full text-sm">

  <thead className="bg-emerald-50 text-emerald-800">

  <tr>

  <th className="p-4 text-left">Photo</th>
  <th className="p-4 text-left">Name</th>
  <th className="p-4 text-left">Email</th>
  <th className="p-4 text-left">Farm</th>
  <th className="p-4 text-left">Status</th>
  <th className="p-4 text-left">Actions</th>

  </tr>

  </thead>

  <tbody>

  {farmers.map((f)=>(
  <tr key={f._id} className="border-b border-emerald-100 hover:bg-emerald-50/60">

  {/* PHOTO */}

  <td className="p-4">

  <img
  src={f.profilePhoto || "/uploads/default.png"}
  className="w-10 h-10 rounded-full border border-emerald-200"
  />

  </td>

  {/* NAME */}

  <td className="p-4 font-semibold text-emerald-900">
  {f.name}
  </td>

  {/* EMAIL */}

  <td className="p-4 text-emerald-700">
  {f.email}
  </td>

  {/* FARM */}

  <td className="p-4">
  {f.farmName || "Not Provided"}
  </td>

  {/* STATUS */}

  <td className="p-4">

  {f.banned ?

  <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">
  Banned
  </span>

  :

  <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
  Active
  </span>

  }

  </td>

  {/* ACTIONS */}

  <td className="p-4 flex flex-wrap gap-2">

  <Link
  href={`/dashboard/admin/farmers/${f._id}`}
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
  >
  View Details
  </Link>

  <button
  onClick={()=>banFarmer(f._id)}
  className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-semibold"
  >
  {f.banned ? "Unban" : "Ban"}
  </button>

  </td>

  </tr>
  ))}

  </tbody>

  </table>

  </div>

  </div>

  )
}
