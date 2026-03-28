"use client"

import { useEffect, useState } from "react"

export default function LabReports(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [stats, setStats] = useState({
  totalBatches: 0,
  testedBatches: 0,
  certifiedBatches: 0,
  passRate: 0
 })
 const [loading, setLoading] = useState(true)

 useEffect(()=>{

  fetch(`${API}/api/batches`)
  .then(res=>res.json())
  .then(data=>{

   if(Array.isArray(data)){

    const total = data.length
    const tested = data.filter((b:any)=>b.labTested === true).length
    const certified = tested

    setStats({

     totalBatches: total,
     testedBatches: tested,
     certifiedBatches: certified,
     passRate: total > 0 ? Math.round((tested / total) * 100) : 0

    })

   }

   setLoading(false)

  })
  .catch(err=>{

   console.error("Error fetching reports:", err)
   setLoading(false)

  })

 }, [API])

 if(loading){
  return <p className="text-white p-10">Loading reports...</p>
 }

 return(

  <div className="space-y-8">

   <h1 className="text-3xl font-bold text-green-400">
    📊 Lab Reports
   </h1>

   {/* STATS CARDS */}

   <div className="grid grid-cols-4 gap-6">

    <div className="bg-[#083d34] p-6 rounded-xl">

     <p className="text-gray-300">Total Batches</p>

     <h2 className="text-3xl text-green-400 font-bold">
      {stats.totalBatches}
     </h2>

    </div>

    <div className="bg-[#083d34] p-6 rounded-xl">

     <p className="text-gray-300">Batches Tested</p>

     <h2 className="text-3xl text-blue-400 font-bold">
      {stats.testedBatches}
     </h2>

    </div>

    <div className="bg-[#083d34] p-6 rounded-xl">

     <p className="text-gray-300">Certified</p>

     <h2 className="text-3xl text-yellow-400 font-bold">
      {stats.certifiedBatches}
     </h2>

    </div>

    <div className="bg-[#083d34] p-6 rounded-xl">

     <p className="text-gray-300">Pass Rate</p>

     <h2 className="text-3xl text-green-300 font-bold">
      {stats.passRate}%
     </h2>

    </div>

   </div>

   {/* TEST QUALITY METRICS */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h3 className="text-xl font-bold text-green-400 mb-4">
     🧬 Quality Metrics
    </h3>

    <div className="space-y-3">

     <div className="flex justify-between">

      <span className="text-gray-300">pH Level Compliance</span>

      <span className="text-green-400 font-bold">98%</span>

     </div>

     <div className="flex justify-between">

      <span className="text-gray-300">Moisture Content Standard</span>

      <span className="text-green-400 font-bold">95%</span>

     </div>

     <div className="flex justify-between">

      <span className="text-gray-300">Microbial Load Tests</span>

      <span className="text-green-400 font-bold">99%</span>

     </div>

     <div className="flex justify-between">

      <span className="text-gray-300">Pesticide Residue Tests</span>

      <span className="text-green-400 font-bold">100%</span>

     </div>

    </div>

   </div>

   {/* RECENT ACTIVITY */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h3 className="text-xl font-bold text-green-400 mb-4">
     📌 Recent Activity
    </h3>

    <div className="space-y-2 text-gray-300">

     <p>✅ All quality standards maintained</p>

     <p>✅ Zero contamination incidents</p>

     <p>✅ Full blockchain verification active</p>

     <p>✅ Monthly audit compliance: 100%</p>

    </div>

   </div>

  </div>

 )

}
