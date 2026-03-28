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

 <div className="p-10 bg-[#041f1a] min-h-screen text-white">

 <h1 className="text-3xl mb-8">
 Supplier Details
 </h1>


 {/* PROFILE */}

 <div className="bg-[#062f27] p-6 rounded-lg flex gap-6 items-center">

 <img
 src={supplier.profilePhoto}
 className="w-24 h-24 rounded-full border-4 border-green-500"
 />

 <div>

 <h2 className="text-2xl font-bold">
 {supplier.name}
 </h2>

 <p>{supplier.email}</p>

 <p>{supplier.companyName}</p>

 <p className="text-gray-400">
 {supplier.location}
 </p>

 </div>

 </div>


 {/* STATS */}

 <div className="grid grid-cols-3 gap-6 mt-8">

 <div className="bg-[#062f27] p-6 rounded">
 Processed Herbs
 <h2 className="text-2xl">
 {supplier.processedHerbs}
 </h2>
 </div>

 <div className="bg-[#062f27] p-6 rounded">
 Inventory
 <h2 className="text-2xl">
 {supplier.inventoryStock}
 </h2>
 </div>

 <div className="bg-[#062f27] p-6 rounded">
 Batches Received
 <h2 className="text-2xl">
 {supplier.totalBatchesReceived}
 </h2>
 </div>

 </div>


 {/* PROCESSING CHART */}

 <div className="bg-[#062f27] p-6 rounded mt-10">

 <h2 className="text-xl mb-4">
 Herb Processing
 </h2>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={chart}>

 <XAxis dataKey="herb"/>

 <YAxis/>

 <Tooltip/>

 <Bar dataKey="quantity" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>


 {/* BATCH TABLE */}

 <div className="bg-[#062f27] p-6 rounded mt-10">

 <h2 className="text-xl mb-4">
 Batches Handled
 </h2>

 <table className="w-full">

 <thead>

 <tr className="border-b border-green-700">

 <th>Batch</th>
 <th>Herb</th>
 <th>Quantity</th>
 <th>Date</th>

 </tr>

 </thead>

 <tbody>

 {batches.map((b:any)=>(
 <tr key={b._id} className="border-b border-green-900">

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