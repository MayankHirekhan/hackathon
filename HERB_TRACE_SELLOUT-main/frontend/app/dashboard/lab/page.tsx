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
  return <p className="text-white p-10">Loading Lab Dashboard...</p>
 }

 if(!lab){
  return <p className="text-red-400 p-10">Lab data not found</p>
 }

 return(

  <div className="space-y-8">

   <h1 className="text-3xl font-bold text-green-400">
    Lab Dashboard
   </h1>

   {/* PROFILE */}

   <div className="bg-[#083d34] p-6 rounded-xl flex items-center gap-6">

    <div>

     <h2 className="text-2xl font-bold text-white">
      {lab.name}
     </h2>

     <p className="text-green-300">
      🧪 {lab.labName}
     </p>

     <p className="text-gray-300">
      ⭐ {lab.rating}/5 Rating
     </p>

     <p className="text-gray-400 text-sm">
      Email: {lab.email}
     </p>

     <p className="text-gray-400 text-sm">
      Location: {lab.location}
     </p>

     <p className="text-gray-400 text-sm">
      Certifications: {lab.certifications}
     </p>

     <p className="text-gray-400 text-sm">
      Experience: {lab.experience} years
     </p>

    </div>

   </div>

   {/* STATS */}

   <div className="grid grid-cols-3 gap-6">

    <div className="bg-[#083d34] p-6 rounded-xl">
     <p className="text-gray-300">Batches Tested</p>
     <h2 className="text-3xl text-green-400 font-bold">
      {stats.totalBatchesTested}
     </h2>
    </div>

    <div className="bg-[#083d34] p-6 rounded-xl">
     <p className="text-gray-300">Certifications Issued</p>
     <h2 className="text-3xl text-blue-400 font-bold">
      {stats.certificationsIssued}
     </h2>
    </div>

    <div className="bg-[#083d34] p-6 rounded-xl">
     <p className="text-gray-300">Verification Rate</p>
     <h2 className="text-3xl text-yellow-400 font-bold">
      {stats.verificationRate}%
     </h2>
    </div>

   </div>

   {/* RECENT ACTIVITY */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h3 className="text-xl font-bold text-green-400 mb-4">
     🔬 Lab Information
    </h3>

    <div className="space-y-2 text-gray-300">

     <p>✅ Lab is operational and ready for batch testing</p>

     <p>📋 Quality assurance protocols are active</p>

     <p>🔐 Test results are uploaded to blockchain</p>

     <p>📊 Detailed analytics available in Reports section</p>

    </div>

   </div>

  </div>

 )

}
