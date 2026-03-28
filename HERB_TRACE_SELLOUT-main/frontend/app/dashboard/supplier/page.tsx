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

  /* LOAD SUPPLIER PROFILE */

  fetch(`${API}/api/supplier/${supplierId}`)
  .then(res=>res.json())
  .then(data=>setSupplier(data))

  /* LOAD HERB PROCESSING DATA */

  fetch(`${API}/api/analytics/herbs`)
  .then(res=>res.json())
  .then(data=>setHerbData(data))
  .catch(()=>setHerbData([]))

  /* LOAD SUPPLIER COMPARISON DATA */

  fetch(`${API}/api/analytics/suppliers`)
  .then(res=>res.json())
  .then(data=>setSupplierData(data))
  .catch(()=>setSupplierData([]))

 },[])

 if(!supplier){
  return <p className="text-white p-10">Loading Supplier Data...</p>
 }

 return(

 <div className="space-y-8">

  <h1 className="text-3xl font-bold text-green-400">
   Supplier Dashboard
  </h1>

  {/* PROFILE */}

  <div className="bg-[#083d34] p-6 rounded-xl flex items-center gap-6">

   <img
    src={`http://localhost:5000${supplier.profilePhoto}`}
    className="w-24 h-24 rounded-full border-4 border-green-400"
   />

   <div>

    <h2 className="text-2xl font-bold text-white">
     {supplier.name}
    </h2>

    <p className="text-green-300">
     ⭐ {supplier.rating}/5
    </p>

    <p className="text-gray-300">
     {supplier.companyName}
    </p>

    <p className="text-gray-400 text-sm">
     License: {supplier.licenseNumber}
    </p>

    <p className="text-gray-400 text-sm">
     Location: {supplier.location}
    </p>

   </div>

  </div>


  {/* STATS */}

  <div className="grid grid-cols-4 gap-6">

   <div className="bg-[#083d34] p-6 rounded-xl">
    <p className="text-gray-300">Batches Received</p>
    <h2 className="text-2xl text-green-400 font-bold">
     {supplier.totalBatchesReceived}
    </h2>
   </div>

   <div className="bg-[#083d34] p-6 rounded-xl">
    <p className="text-gray-300">Processed Herbs</p>
    <h2 className="text-2xl text-green-400 font-bold">
     {supplier.processedHerbs} kg
    </h2>
   </div>

   <div className="bg-[#083d34] p-6 rounded-xl">
    <p className="text-gray-300">Inventory Stock</p>
    <h2 className="text-2xl text-green-400 font-bold">
     {supplier.inventoryStock} kg
    </h2>
   </div>

   <div className="bg-[#083d34] p-6 rounded-xl">
    <p className="text-gray-300">Experience</p>
    <h2 className="text-2xl text-green-400 font-bold">
     {supplier.experience} yrs
    </h2>
   </div>

  </div>


  {/* CHARTS */}

  <div className="grid grid-cols-2 gap-6">

   <SupplierCharts data={herbData} />

   <SupplierComparison data={supplierData} />

  </div>

 </div>

 )

}