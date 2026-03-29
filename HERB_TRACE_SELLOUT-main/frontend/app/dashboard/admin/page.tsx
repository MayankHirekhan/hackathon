"use client"

import { useEffect, useState } from "react"
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts"

export default function AdminDashboard(){

 const [farmers,setFarmers] = useState<any[]>([])
 const [suppliers,setSuppliers] = useState<any[]>([])

 const [selectedFarmer,setSelectedFarmer] = useState("")
 const [selectedSupplier,setSelectedSupplier] = useState("")

 const [farmerPersonal,setFarmerPersonal] = useState<any[]>([])
 const [farmerComparison,setFarmerComparison] = useState<any[]>([])

 const [supplierPersonal,setSupplierPersonal] = useState<any[]>([])
 const [supplierComparison,setSupplierComparison] = useState<any[]>([])

 const [admin,setAdmin] = useState<any>({
  name:"System Administrator",
  email:"admin@herbtrace.com"
 })

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/farmers")
 .then(res=>res.json())
 .then(data=>{
  setFarmers(data)
  if(data.length>0){
   setSelectedFarmer(data[0].name)
  }
 })

 },[])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/suppliers")
 .then(res=>res.json())
 .then(data=>{
  setSuppliers(data)
  if(data.length>0){
   setSelectedSupplier(data[0].name)
  }
 })

 },[])

 useEffect(()=>{

 if(!selectedFarmer) return

 fetch(`http://localhost:5000/api/admin/farmer/${selectedFarmer}/herbs`)
 .then(res=>res.json())
 .then(setFarmerPersonal)

 },[selectedFarmer])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/farmers/comparison")
 .then(res=>res.json())
 .then(setFarmerComparison)

 },[])

 useEffect(()=>{

 if(!selectedSupplier) return

 fetch(`http://localhost:5000/api/admin/supplier/${selectedSupplier}/herbs`)
 .then(res=>res.json())
 .then(setSupplierPersonal)

 },[selectedSupplier])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/suppliers/comparison")
 .then(res=>res.json())
 .then(setSupplierComparison)

 },[])

 return(

 <div className="space-y-10">

  <div className="flex flex-wrap items-center justify-between gap-4 bg-white border border-emerald-100 p-6 rounded-2xl shadow-sm">
   <div className="flex items-center gap-4">
    <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
     🛡️
    </div>
    <div>
     <h2 className="text-xl font-semibold text-emerald-900">{admin.name}</h2>
     <p className="text-sm text-emerald-700">{admin.email}</p>
     <p className="text-xs text-emerald-500">National Herb Network Control Room</p>
    </div>
   </div>
   <button className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold">
    Logout
   </button>
  </div>

  <section className="space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h2 className="text-2xl font-semibold text-emerald-900">Farmer Analytics</h2>
     <p className="text-sm text-emerald-700">Monitor harvest activity and state-wise performance.</p>
    </div>
    <select
     className="bg-white border border-emerald-200 px-3 py-2 rounded-lg text-emerald-900 shadow-sm"
     value={selectedFarmer}
     onChange={(e)=>setSelectedFarmer(e.target.value)}
    >
     {farmers.map(f=>(
      <option key={f._id}>{f.name}</option>
     ))}
    </select>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h3 className="mb-3 font-semibold text-emerald-800">Farmer Personal Harvest</h3>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={farmerPersonal}>
       <XAxis dataKey="herb"/>
       <YAxis/>
       <Tooltip/>
       <Bar dataKey="quantity" fill="#16a34a"/>
      </BarChart>
     </ResponsiveContainer>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h3 className="mb-3 font-semibold text-emerald-800">Farmer Comparison</h3>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={farmerComparison}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <Tooltip/>
       <Bar dataKey="totalHarvest" fill="#22c55e"/>
      </BarChart>
     </ResponsiveContainer>
    </div>
   </div>
  </section>

  <section className="space-y-4">
   <div className="flex flex-wrap items-center justify-between gap-3">
    <div>
     <h2 className="text-2xl font-semibold text-emerald-900">Supplier Analytics</h2>
     <p className="text-sm text-emerald-700">Track processing throughput and distribution readiness.</p>
    </div>
    <select
     className="bg-white border border-emerald-200 px-3 py-2 rounded-lg text-emerald-900 shadow-sm"
     value={selectedSupplier}
     onChange={(e)=>setSelectedSupplier(e.target.value)}
    >
     {suppliers.map(s=>(
      <option key={s._id}>{s.name}</option>
     ))}
    </select>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h3 className="mb-3 font-semibold text-emerald-800">Supplier Personal Processing</h3>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={supplierPersonal}>
       <XAxis dataKey="herb"/>
       <YAxis/>
       <Tooltip/>
       <Bar dataKey="quantity" fill="#16a34a"/>
      </BarChart>
     </ResponsiveContainer>
    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h3 className="mb-3 font-semibold text-emerald-800">Supplier Comparison</h3>
     <ResponsiveContainer width="100%" height={300}>
      <BarChart data={supplierComparison}>
       <XAxis dataKey="name"/>
       <YAxis/>
       <Tooltip/>
       <Bar dataKey="processed" fill="#22c55e"/>
      </BarChart>
     </ResponsiveContainer>
    </div>
   </div>
  </section>

 </div>

 )

}
