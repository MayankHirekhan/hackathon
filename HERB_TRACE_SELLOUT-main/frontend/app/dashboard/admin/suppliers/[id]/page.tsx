"use client"

import { useEffect,useState } from "react"
import { useParams } from "next/navigation"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"
import SupplierCertificate from "./components/SupplierCertificate"

export default function SupplierDetails(){

 const { id } = useParams()

 const [supplier,setSupplier]=useState<any>(null)
 const [batches,setBatches]=useState<any[]>([])
 const [chart,setChart]=useState<any[]>([])

 useEffect(()=>{

 fetch(`http://localhost:5000/api/admin/supplier/${id}`)
 .then(res=>res.json())
 .then(setSupplier)

 fetch(`http://localhost:5000/api/admin/supplier/${id}/batches`)
 .then(res=>res.json())
 .then(setBatches)

 fetch(`http://localhost:5000/api/admin/supplier/${id}/analytics`)
 .then(res=>res.json())
 .then(setChart)

 },[id])


 if(!supplier) return null


 return(

 <div className="space-y-10">

 <div>
  <h1 className="text-3xl font-bold text-emerald-900">Supplier Details</h1>
  <p className="text-sm text-emerald-700">Performance, batches handled, and certification status.</p>
 </div>

 {/* PROFILE */}

 <div className="bg-white p-6 rounded-2xl flex gap-6 items-center border border-emerald-100 shadow-sm">

 <img
 src={supplier.profilePhoto}
 className="w-24 h-24 rounded-full border-2 border-emerald-200"
 />

 <div>

 <h2 className="text-2xl font-semibold text-emerald-900">
 {supplier.name}
 </h2>

 <p className="text-emerald-700">{supplier.email}</p>

 <p className="text-emerald-800">{supplier.companyName}</p>

 <p className="text-emerald-600">
 {supplier.location}
 </p>

 </div>

 </div>


 {/* STATS */}

 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Processed Herbs</p>
 <h2 className="text-2xl font-semibold text-emerald-900">
 {supplier.processedHerbs}
 </h2>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Inventory</p>
 <h2 className="text-2xl font-semibold text-emerald-900">
 {supplier.inventoryStock}
 </h2>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Batches Received</p>
 <h2 className="text-2xl font-semibold text-emerald-900">
 {supplier.totalBatchesReceived}
 </h2>
 </div>

 </div>


 {/* PROCESSING CHART */}

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

 <h2 className="text-xl font-semibold text-emerald-900 mb-4">
 Herb Processing
 </h2>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={chart}>

 <XAxis dataKey="herb"/>

 <YAxis/>

 <Tooltip/>

 <Bar dataKey="quantity" fill="#16a34a"/>

 </BarChart>

 </ResponsiveContainer>

 </div>


 {/* BATCH TABLE */}

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

 <h2 className="text-xl font-semibold text-emerald-900 mb-4">
 Batches Handled
 </h2>

 <table className="w-full text-sm">

 <thead>

 <tr className="border-b border-emerald-100 text-emerald-700 text-left">

 <th>Batch</th>
 <th>Herb</th>
 <th>Quantity</th>
 <th>Date</th>

 </tr>

 </thead>

 <tbody>

 {batches.map((b:any)=>(
 <tr key={b._id} className="border-b border-emerald-50">

 <td>{b.batchId}</td>
 <td>{b.herbName}</td>
 <td>{b.quantity} kg</td>
 <td>{b.harvestDate}</td>

 </tr>
 ))}

 </tbody>

 </table>

 </div>


 {/* CERTIFICATE */}

 <div className="mt-10">

 <SupplierCertificate supplier={supplier}/>

 </div>

 </div>

 )

}
