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

/* ===========================
   LOAD FARMERS
=========================== */

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

/* ===========================
   LOAD SUPPLIERS
=========================== */

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

/* ===========================
   FARMER PERSONAL CHART
=========================== */

 useEffect(()=>{

 if(!selectedFarmer) return

 fetch(`http://localhost:5000/api/admin/farmer/${selectedFarmer}/herbs`)
 .then(res=>res.json())
 .then(setFarmerPersonal)

 },[selectedFarmer])

/* ===========================
   FARMER COMPARISON
=========================== */

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/farmers/comparison")
 .then(res=>res.json())
 .then(setFarmerComparison)

 },[])

/* ===========================
   SUPPLIER PERSONAL
=========================== */

 useEffect(()=>{

 if(!selectedSupplier) return

 fetch(`http://localhost:5000/api/admin/supplier/${selectedSupplier}/herbs`)
 .then(res=>res.json())
 .then(setSupplierPersonal)

 },[selectedSupplier])

/* ===========================
   SUPPLIER COMPARISON
=========================== */

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/suppliers/comparison")
 .then(res=>res.json())
 .then(setSupplierComparison)

 },[])

/* ===========================
   UI
=========================== */

 return(

 <div className="p-10 bg-[#041f1a] min-h-screen text-white">

 {/* ADMIN PROFILE */}

 <div className="flex items-center justify-between mb-10 bg-[#062f27] p-6 rounded">

 <div className="flex items-center gap-5">

 <img
 src="https://i.pravatar.cc/150?img=60"
 className="w-16 h-16 rounded-full border-4 border-green-500"
 />

 <div>
 <h2 className="text-xl">{admin.name}</h2>
 <p className="text-gray-300">{admin.email}</p>
 </div>

 </div>

 <button className="bg-red-500 px-4 py-2 rounded">
 Logout
 </button>

 </div>

 {/* FARMER ANALYTICS */}

 <h2 className="text-2xl mb-4">Farmer Analytics</h2>

 <select
 className="bg-[#062f27] p-3 mb-6 rounded"
 value={selectedFarmer}
 onChange={(e)=>setSelectedFarmer(e.target.value)}
 >

 {farmers.map(f=>(
 <option key={f._id}>{f.name}</option>
 ))}

 </select>

 <div className="grid grid-cols-2 gap-6 mb-12">

 {/* PERSONAL */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-3">Farmer Personal Harvest</h3>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={farmerPersonal}>

 <XAxis dataKey="herb"/>
 <YAxis/>
 <Tooltip/>
 <Bar dataKey="quantity" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 {/* COMPARISON */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-3">Farmer Comparison</h3>

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

 {/* SUPPLIER ANALYTICS */}

 <h2 className="text-2xl mb-4">Supplier Analytics</h2>

 <select
 className="bg-[#062f27] p-3 mb-6 rounded"
 value={selectedSupplier}
 onChange={(e)=>setSelectedSupplier(e.target.value)}
 >

 {suppliers.map(s=>(
 <option key={s._id}>{s.name}</option>
 ))}

 </select>

 <div className="grid grid-cols-2 gap-6">

 {/* PERSONAL */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-3">Supplier Personal Processing</h3>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={supplierPersonal}>

 <XAxis dataKey="herb"/>
 <YAxis/>
 <Tooltip/>
 <Bar dataKey="quantity" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 {/* COMPARISON */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-3">Supplier Comparison</h3>

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

 </div>

 )

}