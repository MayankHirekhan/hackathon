"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Home(){

 const router = useRouter()
 const [batchId,setBatchId] = useState("")

 function handleTrace(){
  if(!batchId.trim()) return
  router.push(`/trace/${batchId.trim()}`)
 }

 return(

 <div className="min-h-screen bg-emerald-50 text-emerald-950">

  <div className="max-w-6xl mx-auto px-6 py-14 space-y-16">

   <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
    <div>
     <p className="text-xs uppercase tracking-[0.3em] text-emerald-600">HerbTracking • Bharat</p>
     <h1 className="text-4xl md:text-5xl font-bold text-emerald-900 mt-3">
      Track every herb from farm to pharmacy.
     </h1>
     <p className="text-lg text-emerald-700 mt-4 max-w-2xl">
      A green-first supply chain platform built for India’s Ayurveda, nutraceutical, and herbal wellness ecosystem.
     </p>
     <div className="mt-6 flex flex-wrap gap-3">
      <button
       onClick={()=>router.push("/login")}
       className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold"
      >
       Enter Network
      </button>
      <button
       onClick={()=>router.push("/login")}
       className="bg-white border border-emerald-200 text-emerald-800 px-6 py-3 rounded-xl font-semibold"
      >
       Partner Sign-in
      </button>
     </div>
    </div>
    <div className="bg-white border border-emerald-100 rounded-3xl p-6 shadow-sm w-full md:w-96">
     <p className="text-sm font-semibold text-emerald-800">Quick Trace</p>
     <p className="text-xs text-emerald-600 mt-1">Scan or enter batch ID to verify authenticity.</p>
     <div className="mt-4 space-y-3">
      <input
       value={batchId}
       onChange={(e)=>setBatchId(e.target.value)}
       placeholder="Enter batch or packet ID"
       className="w-full border border-emerald-200 rounded-lg px-4 py-3 text-emerald-900"
      />
      <button
       onClick={handleTrace}
       className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold"
      >
       Verify Herb Journey
      </button>
     </div>
    </div>
   </header>

   <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {[
     {title:"Farmer First",text:"Capture harvests, geo-coordinates, and mandis with verified timestamps.",icon:"🌾"},
     {title:"Trusted Labs",text:"Upload tests aligned with AYUSH and FSSAI checkpoints.",icon:"🧪"},
     {title:"Consumer Confidence",text:"Share blockchain-backed transparency with every QR scan.",icon:"🛡️"},
    ].map((item)=>(
     <div key={item.title} className="bg-white border border-emerald-100 rounded-2xl p-6 shadow-sm">
      <div className="text-3xl">{item.icon}</div>
      <h3 className="text-lg font-semibold text-emerald-900 mt-4">{item.title}</h3>
      <p className="text-sm text-emerald-700 mt-2">{item.text}</p>
     </div>
    ))}
   </section>

   <section className="bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm grid grid-cols-1 lg:grid-cols-3 gap-6">
    <div>
     <h2 className="text-2xl font-semibold text-emerald-900">Why HerbTracking?</h2>
     <p className="text-emerald-700 mt-3">
      Built for India’s herbal economy—farmers, processors, labs, and consumers—so every batch stays trusted.
     </p>
    </div>
    <div className="space-y-4 text-sm text-emerald-700">
     <p>✅ Geo-tagged harvests and drying records.</p>
     <p>✅ Supplier processing logs with inventory trail.</p>
     <p>✅ Blockchain hashes for tamper-proof evidence.</p>
    </div>
    <div className="space-y-4 text-sm text-emerald-700">
     <p>✅ QR-based consumer verification.</p>
     <p>✅ State-wise compliance reporting.</p>
     <p>✅ Export-ready documentation snapshots.</p>
    </div>
   </section>

  </div>

 </div>

 )

}
