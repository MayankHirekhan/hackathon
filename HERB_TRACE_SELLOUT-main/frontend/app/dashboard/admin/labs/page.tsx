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

 <div className="p-10 text-white">

 <h1 className="text-3xl mb-6">Lab Testers</h1>

 <table className="w-full bg-[#062f27] rounded-lg">

 <thead>

 <tr className="border-b border-green-900">

 <th className="p-3">Lab Name</th>
 <th className="p-3">Certificate</th>
 <th className="p-3">Verified Batches</th>

 </tr>

 </thead>

 <tbody>

 {labs.map((l)=>(
 <tr key={l._id} className="border-b border-green-900">

 <td className="p-3">{l.labName}</td>
 <td className="p-3">{l.certificateNumber}</td>
 <td className="p-3">{l.verified}</td>

 </tr>
 ))}

 </tbody>

 </table>

 </div>

 )

}