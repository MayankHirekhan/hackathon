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
  return <p className="text-emerald-700 p-10">Loading certifications...</p>
 }

 return(

  <div className="space-y-8">

   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     ✅ Certifications
    </h1>
    <p className="text-sm text-emerald-700">
     Certified batches ready for packaging and export.
    </p>
   </div>

   {certifications.length === 0 ? (

    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100">

     <p className="text-emerald-700">
      No certifications issued yet
     </p>

     <p className="text-emerald-600 text-sm mt-2">
      Complete batch testing to issue certifications
     </p>

    </div>

   ) : (

    <div className="space-y-4">

     {certifications.map(cert=>(

      <div
       key={cert._id}
       className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"
      >

       <div className="flex flex-wrap justify-between items-start gap-4">

        <div>

         <h3 className="text-xl font-semibold text-emerald-900">
          🏆 {cert.herbName}
         </h3>

         <p className="text-emerald-700">
          Batch ID: {cert.batchId}
         </p>

         <p className="text-emerald-600 text-sm">
          Farmer: {cert.farmer}
         </p>

         <p className="text-emerald-600 text-sm">
          Quality Grade: A+
         </p>

         <p className="text-emerald-700 text-sm mt-2">
          ✅ Certified & Verified
         </p>

        </div>

        <div className="text-right">

         <p className="text-emerald-900 font-bold text-lg">
          ISO 9001
         </p>

         <p className="text-emerald-600 text-sm">
          Certified
         </p>

         <button
          onClick={()=>window.print()}
          className="mt-3 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold text-sm"
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
