"use client"

import { useEffect, useState } from "react"

export default function Certifications(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [certifications, setCertifications] = useState<any[]>([])
 const [loading, setLoading] = useState(true)

 useEffect(()=>{

  fetch(`${API}/api/batches`)
  .then(res=>res.json())
  .then(data=>{

   if(Array.isArray(data)){
    const testedBatches = data.filter((b:any)=>b.labTested === true)
    setCertifications(testedBatches)
   }

   setLoading(false)

  })
  .catch(err=>{

   console.error("Error fetching certifications:", err)
   setLoading(false)

  })

 }, [API])

 if(loading){
  return <p className="text-white p-10">Loading certifications...</p>
 }

 return(

  <div className="space-y-8">

   <h1 className="text-3xl font-bold text-green-400">
    ✅ Certifications
   </h1>

   {certifications.length === 0 ? (

    <div className="bg-[#083d34] p-6 rounded-xl">

     <p className="text-gray-300">
      No certifications issued yet
     </p>

     <p className="text-gray-400 text-sm mt-2">
      Complete batch testing to issue certifications
     </p>

    </div>

   ) : (

    <div className="space-y-4">

     {certifications.map(cert=>(

      <div
       key={cert._id}
       className="bg-gradient-to-r from-[#0b3d2f] to-[#083d34] p-6 rounded-xl border border-green-500"
      >

       <div className="flex justify-between items-start">

        <div>

         <h3 className="text-xl font-bold text-green-400">
          🏆 {cert.herbName}
         </h3>

         <p className="text-gray-300">
          Batch ID: {cert.batchId}
         </p>

         <p className="text-gray-400 text-sm">
          Farmer: {cert.farmer}
         </p>

         <p className="text-gray-400 text-sm">
          Quality Grade: A+
         </p>

         <p className="text-yellow-300 text-sm mt-2">
          ✅ Certified & Verified
         </p>

        </div>

        <div className="text-right">

         <p className="text-green-400 font-bold text-lg">
          ISO 9001
         </p>

         <p className="text-gray-400 text-sm">
          Certified
         </p>

         <button
          onClick={()=>window.print()}
          className="mt-3 bg-green-600 hover:bg-green-700 px-4 py-2 rounded font-semibold text-sm"
         >
          Print Certificate
         </button>

        </div>

       </div>

      </div>

     ))}

    </div>

   )}

  </div>

 )

}
