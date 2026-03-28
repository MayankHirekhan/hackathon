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
 <div className="text-white p-10">
 Loading farmer details...
 </div>
 )

 }


 return(

 <div className="p-10 bg-[#041f1a] min-h-screen text-white">

 <h1 className="text-3xl mb-10 font-bold">
 Farmer Details
 </h1>

 {/* PROFILE */}

 <div className="bg-[#062f27] p-6 rounded-lg flex gap-6 items-center shadow-lg">

 <img
 src={
 farmer.profilePhoto ||
 "https://i.pravatar.cc/150"
 }
 className="w-24 h-24 rounded-full border-4 border-green-500 object-cover"
 />

 <div>

 <h2 className="text-2xl font-bold">
 {farmer.name}
 </h2>

 <p className="text-gray-300">
 {farmer.email}
 </p>

 <p className="text-gray-200">
 {farmer.farmName}
 </p>

 <p className="text-gray-400">
 {farmer.location}
 </p>

 </div>

 </div>

 {/* STATS */}

 <div className="grid grid-cols-4 gap-6 mt-10">

 <div className="bg-[#062f27] p-6 rounded shadow">
 Total Harvests
 <h2 className="text-2xl mt-2">
 {farmer.totalHarvests || 0}
 </h2>
 </div>

 <div className="bg-[#062f27] p-6 rounded shadow">
 Experience
 <h2 className="text-2xl mt-2">
 {farmer.experience} yrs
 </h2>
 </div>

 <div className="bg-[#062f27] p-6 rounded shadow">
 Rating
 <h2 className="text-2xl mt-2">
 ⭐ {farmer.rating || 0}
 </h2>
 </div>

 <div className="bg-[#062f27] p-6 rounded shadow">
 Batches
 <h2 className="text-2xl mt-2">
 {batches.length}
 </h2>
 </div>

 </div>

 {/* HERB CHART */}

 <div className="bg-[#062f27] p-6 rounded mt-12 shadow">

 <h2 className="text-xl mb-4">
 Herb Production Analytics
 </h2>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={chart}>

 <XAxis dataKey="herb" stroke="#ccc"/>

 <YAxis stroke="#ccc"/>

 <Tooltip/>

 <Bar
 dataKey="quantity"
 fill="#22c55e"
 radius={[6,6,0,0]}
 />

 </BarChart>

 </ResponsiveContainer>

 </div>

 {/* BATCH TABLE */}

 <div className="bg-[#062f27] p-6 rounded mt-12 shadow">

 <h2 className="text-xl mb-4">
 Batches Generated
 </h2>

 <table className="w-full text-sm">

 <thead>

 <tr className="border-b border-green-700">

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
 className="border-b border-green-900 hover:bg-[#073a31]"
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

 <div className="bg-[#062f27] p-6 rounded mt-12 shadow">

 <h2 className="text-xl mb-4">
 Reviews
 </h2>

 {farmer.reviews?.length > 0 ? (

 farmer.reviews.map((r:any,i:number)=>(
 <div
 key={i}
 className="border-b border-green-900 py-3"
 >

 <p className="font-bold">
 {r.user}
 </p>

 <p className="text-gray-300">
 {r.comment}
 </p>

 <p>⭐ {r.rating}</p>

 </div>
 ))

 ) : (

 <p className="text-gray-400">
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