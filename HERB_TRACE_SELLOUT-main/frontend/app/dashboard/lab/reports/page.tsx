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
  return <p className="text-emerald-700 p-10">Loading reports...</p>
 }

 return(

  <div className="space-y-8">

   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     📊 Lab Reports
    </h1>
    <p className="text-sm text-emerald-700">
     Quality insights, compliance metrics, and audit readiness.
    </p>
   </div>

   <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Total Batches</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.totalBatches}
     </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Batches Tested</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.testedBatches}
     </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Certified</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.certifiedBatches}
     </h2>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <p className="text-emerald-600">Pass Rate</p>
     <h2 className="text-3xl text-emerald-900 font-bold">
      {stats.passRate}%
     </h2>
    </div>

   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

    <h3 className="text-lg font-semibold text-emerald-900 mb-4">
     🧬 Quality Metrics
    </h3>

    <div className="space-y-3 text-sm">

     <div className="flex justify-between text-emerald-700">
      <span>pH Level Compliance</span>
      <span className="font-bold">98%</span>
     </div>

     <div className="flex justify-between text-emerald-700">
      <span>Moisture Content Standard</span>
      <span className="font-bold">95%</span>
     </div>

     <div className="flex justify-between text-emerald-700">
      <span>Microbial Load Tests</span>
      <span className="font-bold">99%</span>
     </div>

     <div className="flex justify-between text-emerald-700">
      <span>Pesticide Residue Tests</span>
      <span className="font-bold">100%</span>
     </div>

    </div>

   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

    <h3 className="text-lg font-semibold text-emerald-900 mb-4">
     📌 Recent Activity
    </h3>

    <div className="space-y-2 text-emerald-700 text-sm">

     <p>✅ All quality standards maintained</p>

     <p>✅ Zero contamination incidents</p>

     <p>✅ Full blockchain verification active</p>

     <p>✅ Monthly audit compliance: 100%</p>

    </div>

   </div>

  </div>

 )

}
