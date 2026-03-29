"use client"

import { useEffect, useState } from "react"
import SupplierCharts from "@/components/SupplierCharts"
import SupplierComparison from "@/components/SupplierComparison"

export default function SupplierDashboard(){

 const API = "http://localhost:5000"

 const [supplier,setSupplier] = useState<any>(null)
 const [herbData,setHerbData] = useState<any[]>([])
 const [supplierData,setSupplierData] = useState<any[]>([])

 useEffect(()=>{

  const supplierId = localStorage.getItem("supplierId")

  if(!supplierId){
   console.error("Supplier not logged in")
   return
  }

  fetch(`${API}/api/supplier/${supplierId}`)
  .then(res=>res.json())
  .then(data=>setSupplier(data))

  fetch(`${API}/api/analytics/herbs`)
  .then(res=>res.json())
  .then(data=>setHerbData(data))
  .catch(()=>setHerbData([]))

  fetch(`${API}/api/analytics/suppliers`)
  .then(res=>res.json())
  .then(data=>setSupplierData(data))
  .catch(()=>setSupplierData([]))

 },[])

 if(!supplier){
  return <p className="text-emerald-700 p-10">Loading Supplier Data...</p>
 }

 return(

 <div className="space-y-8">

  <div className="flex flex-wrap items-center justify-between gap-4">
   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     Supplier Dashboard
    </h1>
    <p className="text-sm text-emerald-700">
     Track processing KPIs and supply readiness for export and retail.
    </p>
   </div>
   <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm text-emerald-700">
    License: {supplier.licenseNumber}
   </div>
  </div>

  {/* PROFILE */}

  <div className="bg-white p-6 rounded-2xl flex flex-wrap items-center gap-6 border border-emerald-100 shadow-sm">

   <img
    src={`http://localhost:5000${supplier.profilePhoto}`}
    className="w-24 h-24 rounded-full border-2 border-emerald-200"
   />

   <div className="space-y-1">

    <h2 className="text-2xl font-bold text-emerald-900">
     {supplier.name}
    </h2>

    <p className="text-emerald-600">
     ⭐ {supplier.rating}/5
    </p>

    <p className="text-emerald-800">
     {supplier.companyName}
    </p>

    <p className="text-emerald-600 text-sm">
     Location: {supplier.location}
    </p>

   </div>

  </div>


  {/* STATS */}

  <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
    <p className="text-emerald-600">Batches Received</p>
    <h2 className="text-2xl text-emerald-900 font-bold">
     {supplier.totalBatchesReceived}
    </h2>
   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
    <p className="text-emerald-600">Processed Herbs</p>
    <h2 className="text-2xl text-emerald-900 font-bold">
     {supplier.processedHerbs} kg
    </h2>
   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
    <p className="text-emerald-600">Inventory Stock</p>
    <h2 className="text-2xl text-emerald-900 font-bold">
     {supplier.inventoryStock} kg
    </h2>
   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
    <p className="text-emerald-600">Experience</p>
    <h2 className="text-2xl text-emerald-900 font-bold">
     {supplier.experience} yrs
    </h2>
   </div>

  </div>


  {/* CHARTS */}

  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

   <SupplierCharts data={herbData} />

   <SupplierComparison data={supplierData} />

  </div>

 </div>

 )

}
