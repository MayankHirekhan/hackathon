"use client"

import { useEffect,useState } from "react"

export default function LabsPage(){

 const [labs,setLabs]=useState<any[]>([])

 useEffect(()=>{

 fetch("http://localhost:5000/api/labs")
 .then(res=>res.json())
 .then(setLabs)

 },[])

 return(

 <div className="space-y-6">

 <div>
  <h1 className="text-3xl font-bold text-emerald-900">Lab Testers</h1>
  <p className="text-sm text-emerald-700">Accredited labs verifying purity and compliance.</p>
 </div>

 <div className="bg-white border border-emerald-100 rounded-2xl shadow-sm overflow-hidden">

 <table className="w-full text-sm">

 <thead>

 <tr className="border-b border-emerald-100 bg-emerald-50 text-emerald-800 text-left">

 <th className="p-3">Lab Name</th>
 <th className="p-3">Certificate</th>
 <th className="p-3">Verified Batches</th>

 </tr>

 </thead>

 <tbody>

 {labs.map((l)=>(
 <tr key={l._id} className="border-b border-emerald-100">

 <td className="p-3">{l.labName}</td>
 <td className="p-3">{l.certificateNumber}</td>
 <td className="p-3">{l.verified}</td>

 </tr>
 ))}

 </tbody>

 </table>

 </div>

 </div>

 )

}
