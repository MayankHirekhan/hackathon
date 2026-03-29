"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import {
 BarChart,
 Bar,
 XAxis,
 YAxis,
 Tooltip,
 ResponsiveContainer
} from "recharts"

import FarmerCertificate from "./components/FarmerCertificate"

export default function FarmerDetails(){

 const { id } = useParams()

 const [farmer,setFarmer] = useState<any>(null)
 const [batches,setBatches] = useState<any[]>([])
 const [chart,setChart] = useState<any[]>([])
 const [loading,setLoading] = useState(true)

 useEffect(()=>{

 async function loadData(){

 try{

 const farmerRes =
 await fetch(`http://localhost:5000/api/admin/farmer/${id}`)

 const farmerData =
 await farmerRes.json()

 setFarmer(farmerData)


 const batchRes =
 await fetch(`http://localhost:5000/api/admin/farmer/${id}/batches`)

 const batchData =
 await batchRes.json()

 setBatches(batchData)


 const chartRes =
 await fetch(`http://localhost:5000/api/admin/farmer/${id}/analytics`)

 const chartData =
 await chartRes.json()

 setChart(chartData)

 setLoading(false)

 }catch(err){

 console.error(err)

 }

 }

 loadData()

 },[id])


 if(loading){

 return(
 <div className="text-emerald-700 p-10">
 Loading farmer details...
 </div>
 )

 }


 return(

 <div className="space-y-10">

 <div>
  <h1 className="text-3xl font-bold text-emerald-900">Farmer Details</h1>
  <p className="text-sm text-emerald-700">Profile, batch history, and verified performance.</p>
 </div>

 {/* PROFILE */}

 <div className="bg-white p-6 rounded-2xl flex gap-6 items-center border border-emerald-100 shadow-sm">

 <img
 src={
 farmer.profilePhoto ||
 "https://i.pravatar.cc/150"
 }
 className="w-24 h-24 rounded-full border-2 border-emerald-200 object-cover"
 />

 <div>

 <h2 className="text-2xl font-semibold text-emerald-900">
 {farmer.name}
 </h2>

 <p className="text-emerald-700">
 {farmer.email}
 </p>

 <p className="text-emerald-800">
 {farmer.farmName}
 </p>

 <p className="text-emerald-600">
 {farmer.location}
 </p>

 </div>

 </div>

 {/* STATS */}

 <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Total Harvests</p>
 <h2 className="text-2xl font-semibold text-emerald-900 mt-2">
 {farmer.totalHarvests || 0}
 </h2>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Experience</p>
 <h2 className="text-2xl font-semibold text-emerald-900 mt-2">
 {farmer.experience} yrs
 </h2>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Rating</p>
 <h2 className="text-2xl font-semibold text-emerald-900 mt-2">
 ⭐ {farmer.rating || 0}
 </h2>
 </div>

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-sm text-emerald-600">Batches</p>
 <h2 className="text-2xl font-semibold text-emerald-900 mt-2">
 {batches.length}
 </h2>
 </div>

 </div>

 {/* HERB CHART */}

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

 <h2 className="text-xl font-semibold text-emerald-900 mb-4">
 Herb Production Analytics
 </h2>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={chart}>

 <XAxis dataKey="herb"/>

 <YAxis/>

 <Tooltip/>

 <Bar
 dataKey="quantity"
 fill="#16a34a"
 radius={[6,6,0,0]}
 />

 </BarChart>

 </ResponsiveContainer>

 </div>

 {/* BATCH TABLE */}

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

 <h2 className="text-xl font-semibold text-emerald-900 mb-4">
 Batches Generated
 </h2>

 <table className="w-full text-sm">

 <thead>

 <tr className="border-b border-emerald-100 text-emerald-700">

 <th className="py-3 text-left">Batch</th>
 <th className="text-left">Herb</th>
 <th className="text-left">Quantity</th>
 <th className="text-left">Date</th>

 </tr>

 </thead>

 <tbody>

 {batches.map((b:any)=>(
 <tr
 key={b._id}
 className="border-b border-emerald-50 hover:bg-emerald-50/60"
 >

 <td className="py-2">{b.batchId}</td>
 <td>{b.herbName}</td>
 <td>{b.quantity} kg</td>
 <td>{b.harvestDate}</td>

 </tr>
 ))}

 </tbody>

 </table>

 </div>

 {/* REVIEWS */}

 <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

 <h2 className="text-xl font-semibold text-emerald-900 mb-4">
 Reviews
 </h2>

 {farmer.reviews?.length > 0 ? (

 farmer.reviews.map((r:any,i:number)=>(
 <div
 key={i}
 className="border-b border-emerald-100 py-3"
 >

 <p className="font-semibold text-emerald-900">
 {r.user}
 </p>

 <p className="text-emerald-700">
 {r.comment}
 </p>

 <p className="text-emerald-600">⭐ {r.rating}</p>

 </div>
 ))

 ) : (

 <p className="text-emerald-600">
 No reviews available
 </p>

 )}

 </div>

 {/* CERTIFICATE */}

 <div className="mt-12">

 <FarmerCertificate/>

 </div>

 </div>

 )

}
