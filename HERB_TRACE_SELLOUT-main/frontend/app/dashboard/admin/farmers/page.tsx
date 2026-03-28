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

 <div className="p-10 text-white bg-[#041f1a] min-h-screen">

 <h1 className="text-3xl mb-8 font-bold">
 Farmers Management
 </h1>

 <div className="bg-[#062f27] rounded-xl overflow-hidden shadow-lg">

 <table className="w-full">

 <thead className="bg-[#083d33]">

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
 <tr key={f._id} className="border-b border-green-900 hover:bg-[#073a31]">

 {/* PHOTO */}

 <td className="p-4">

 <img
 src={f.profilePhoto || "/uploads/default.png"}
 className="w-10 h-10 rounded-full border border-green-500"
 />

 </td>

 {/* NAME */}

 <td className="p-4 font-semibold">
 {f.name}
 </td>

 {/* EMAIL */}

 <td className="p-4 text-gray-300">
 {f.email}
 </td>

 {/* FARM */}

 <td className="p-4">
 {f.farmName || "Not Provided"}
 </td>

 {/* STATUS */}

 <td className="p-4">

 {f.banned ?

 <span className="bg-red-600 px-3 py-1 rounded text-sm">
 Banned
 </span>

 :

 <span className="bg-green-600 px-3 py-1 rounded text-sm">
 Active
 </span>

 }

 </td>

 {/* ACTIONS */}

 <td className="p-4 flex gap-3">

 <Link
 href={`/dashboard/admin/farmers/${f._id}`}
 className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-sm"
 >
 View Details
 </Link>

 <button
 onClick={()=>banFarmer(f._id)}
 className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-sm"
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