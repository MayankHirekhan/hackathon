"use client"

import { useEffect,useState } from "react"

export default function SuppliersPage(){

 const [suppliers,setSuppliers]=useState<any[]>([])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/suppliers")
 .then(res=>res.json())
 .then(setSuppliers)

 },[])


 async function banSupplier(id:string){

 await fetch(`http://localhost:5000/api/admin/supplier/${id}/ban`,{
 method:"PUT"
 })

 alert("Supplier banned")

 }


 return(

 <div className="space-y-6">

  <div>
   <h1 className="text-3xl font-bold text-emerald-900">Suppliers</h1>
   <p className="text-sm text-emerald-700">Track processing partners and distribution readiness.</p>
  </div>

  <div className="bg-white rounded-2xl border border-emerald-100 shadow-sm overflow-hidden">

  <table className="w-full text-sm">

  <thead>

  <tr className="bg-emerald-50 text-emerald-800 text-left">

  <th className="p-4">Profile</th>
  <th className="p-4">Name</th>
  <th className="p-4">Company</th>
  <th className="p-4">Location</th>
  <th className="p-4">Rating</th>
  <th className="p-4">Actions</th>

  </tr>

  </thead>


  <tbody>

  {suppliers.map((s)=>(

  <tr
  key={s._id}
  className="border-b border-emerald-100 hover:bg-emerald-50/60 transition"
  >

  {/* PROFILE PHOTO */}

  <td className="p-4">

  <img
  src={
  s.profilePhoto ||
  "/uploads/default-supplier.png"
  }
  className="w-10 h-10 rounded-full border border-emerald-200 object-cover"
  />

  </td>


  {/* NAME */}

  <td className="p-4 font-semibold text-emerald-900">

  {s.name}

  </td>


  {/* COMPANY */}

  <td className="p-4">

  {s.companyName}

  </td>


  {/* LOCATION */}

  <td className="p-4 text-emerald-700">

  {s.location}

  </td>


  {/* RATING */}

  <td className="p-4">

  ⭐ {s.rating || 0}

  </td>


  {/* ACTIONS */}

  <td className="p-4 flex flex-wrap gap-2">

  <a
  href={`/dashboard/admin/suppliers/${s._id}`}
  className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1 rounded-lg text-xs font-semibold"
  >

  View Details

  </a>


  <button
  onClick={()=>banSupplier(s._id)}
  className="bg-white border border-red-200 text-red-700 hover:bg-red-50 px-3 py-1 rounded-lg text-xs font-semibold"
  >

  Ban

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
