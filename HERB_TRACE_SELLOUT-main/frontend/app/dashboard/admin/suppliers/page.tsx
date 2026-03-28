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

 <div className="p-10 bg-[#041f1a] min-h-screen text-white">

 <h1 className="text-3xl mb-8 font-bold">
 Suppliers
 </h1>

 <div className="bg-[#062f27] rounded-xl overflow-hidden shadow-lg">

 <table className="w-full text-sm">

 <thead>

 <tr className="border-b border-green-900 text-left">

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
 className="border-b border-green-900 hover:bg-[#073a31] transition"
 >

 {/* PROFILE PHOTO */}

 <td className="p-4">

 <img
 src={
 s.profilePhoto ||
 "/uploads/default-supplier.png"
 }
 className="w-10 h-10 rounded-full border border-green-500 object-cover"
 />

 </td>


 {/* NAME */}

 <td className="p-4 font-semibold">

 {s.name}

 </td>


 {/* COMPANY */}

 <td className="p-4">

 {s.companyName}

 </td>


 {/* LOCATION */}

 <td className="p-4 text-gray-300">

 {s.location}

 </td>


 {/* RATING */}

 <td className="p-4">

 ⭐ {s.rating || 0}

 </td>


 {/* ACTIONS */}

 <td className="p-4 flex gap-3">

 <a
 href={`/dashboard/admin/suppliers/${s._id}`}
 className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-xs"
 >

 View Details

 </a>


 <button
 onClick={()=>banSupplier(s._id)}
 className="bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-xs"
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