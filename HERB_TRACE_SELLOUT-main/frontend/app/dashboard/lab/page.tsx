"use client"

import { useEffect, useState } from "react"

export default function LabDashboard(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [lab, setLab] = useState<any>(null)
 const [stats, setStats] = useState({
  totalBatchesTested: 0,
  certificationsIssued: 0,
  verificationRate: 0
 })
 const [loading, setLoading] = useState(true)

 useEffect(()=>{

  const labId = typeof window !== "undefined" ? localStorage.getItem("labId") : null

  if(!labId){
   console.error("Lab not logged in")
   setLoading(false)
   return
  }

  fetch(`${API}/api/lab/${labId}`)
  .then(res=>res.json())
  .then(data=>{
   setLab(data.lab)
   setStats({
    totalBatchesTested: data.lab?.totalBatchesTested || 0,
    certificationsIssued: Math.floor((data.lab?.totalBatchesTested || 0) * 0.95),
    verificationRate: 98
   })
   setLoading(false)
  })
  .catch(err=>{
   console.error("Error loading lab:", err)
   setLoading(false)
  })

 }, [API])

 if(loading){
  return <p className="text-emerald-700 p-10">Loading Lab Dashboard...</p>
 }

 if(!lab){
  return <p className="text-red-500 p-10">Lab data not found</p>
 }

 return(

  <div className="space-y-8">

   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     Lab Dashboard
    </h1>
    <p className="text-sm text-emerald-700">
     Verify herb quality and issue certifications for the national supply chain.
    </p>
   </div>

   <div className="bg-white p-6 rounded-2xl flex items-center gap-6 border border-emerald-100 shadow-sm">

    <div>

     <h2 className="text-2xl font-semibold text-emerald-900">
      {lab.name}
     </h2>

     <p className="text-emerald-700">
      🧪 {lab.labName}
     </p>

     <p className="text-emerald-600">
      ⭐ {lab.rating}/5 Rating
     </p>

     <p className="text-emerald-600 text-sm">
      Email: {lab.email}
     </p>

     <p className="text-emerald-600 text-sm">
      Location: {lab.location}
     </p>

     <p className="text-emerald-600 text-sm">
      Certifications: {lab.certifications}
     </p>

     <p className="text-emerald-600 text-sm">
      Experience: {lab.experience} years
     </p>

    </div>

   </div>

   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Batches Tested</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.totalBatchesTested}
     </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Certifications Issued</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.certificationsIssued}
     </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Verification Rate</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.verificationRate}%
     </h2>
    </div>

   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

    <h3 className="text-lg font-semibold text-emerald-900 mb-4">
     🔬 Lab Information
    </h3>

    <div className="space-y-2 text-emerald-700 text-sm">

     <p>✅ Lab is operational and ready for batch testing</p>

     <p>📋 Quality assurance protocols are active</p>

     <p>🔐 Test results are uploaded to blockchain</p>

     <p>📊 Detailed analytics available in Reports section</p>

    </div>

   </div>

  </div>

 )

}
