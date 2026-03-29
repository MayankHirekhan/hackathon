"use client"

import { useEffect, useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

interface Batch{
 _id:string
 herbName:string
 batchId:string
 harvestDate:string
 quantity:number
 location:string
 hash:string
 previousHash:string
 latitude?:number
 longitude?:number
 geoImage?:string
}

export default function Harvests(){

 const [batches,setBatches] = useState<Batch[]>([])
 const [loading,setLoading] = useState(true)
 const [error,setError] = useState("")

 const API =
 process.env.NEXT_PUBLIC_API_URL ||
 "http://localhost:5000"

 const FRONTEND_URL =
 process.env.NEXT_PUBLIC_FRONTEND_URL ||
 "http://localhost:3000"


 useEffect(()=>{

  const farmerId =
   typeof window !== "undefined"
   ? localStorage.getItem("farmerId")
   : null

  if(!farmerId){
   console.warn("No farmerId found in localStorage")
   setLoading(false)
   return
  }

  const url = `${API}/api/batches/farmer/${farmerId}`

  fetch(url)
  .then(async(res)=>{

   const text = await res.text()

   if(!res.ok){
    console.error(`API Error ${res.status}:`, text)
    throw new Error(`API request failed: ${res.status} - ${text}`)
   }

   if(text.startsWith("<!DOCTYPE")){
    throw new Error("Server returned HTML instead of JSON")
   }

   const data = JSON.parse(text)

   if(Array.isArray(data)){
    setBatches(data)
   }else{
    console.warn("Unexpected response:",data)
   }

   setLoading(false)

  })
  .catch(err=>{
   console.error("Harvest fetch error:",err)
   setError(`Unable to load harvest data: ${err.message}`)
   setLoading(false)
  })

 },[API])


 if(loading){
  return(
   <div className="text-emerald-700 p-10">
    Loading harvests...
   </div>
  )
 }


 if(error){
  return(
   <div className="text-red-500 p-10">
    {error}
   </div>
  )
 }


 return(

 <div className="space-y-6">

 <div>
  <h1 className="text-3xl font-bold text-emerald-900">
  My Harvests
  </h1>
  <p className="text-sm text-emerald-700">
   View every batch recorded for your farm, ready for processing and traceability.
  </p>
 </div>

 {batches.length===0 &&(
  <p className="text-emerald-600">
   No harvest batches found
  </p>
 )}


 <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

 {batches.map(batch=>(

 <div
 key={batch._id}
 className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"
 >

 <img
 src={`/herbs/${batch.herbName.toLowerCase()}.jpg`}
 className="h-40 w-full object-cover rounded-xl"
 />

 <h2 className="text-xl mt-4 font-semibold text-emerald-900">
 {batch.herbName}
 </h2>

 <div className="text-sm text-emerald-700 mt-2 space-y-1">
  <p>Batch ID : {batch.batchId}</p>
  <p>Harvest : {batch.harvestDate}</p>
  <p>Quantity : {batch.quantity} kg</p>
  <p>Location : {batch.location}</p>
 </div>

 {(batch.latitude && batch.longitude) && (
  <div className="mt-4 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-sm">
   <p className="text-emerald-700 font-semibold mb-2">📍 GPS Coordinates</p>
   <p className="text-emerald-900">Lat: <b>{batch.latitude.toFixed(6)}</b></p>
   <p className="text-emerald-900">Lon: <b>{batch.longitude.toFixed(6)}</b></p>
  </div>
 )}

 {batch.geoImage && (
  <img
   src={batch.geoImage}
   className="mt-3 rounded-xl border border-emerald-100 w-full"
   alt="Farm location map"
  />
 )}

 <div className="mt-4 bg-emerald-50 p-3 rounded-xl text-xs border border-emerald-100">

 <p className="text-emerald-700 font-semibold">
 Block Hash
 </p>

 <p className="break-all text-emerald-900">
 {batch.hash}
 </p>

 <p className="text-emerald-600 mt-2">
 Previous Block
 </p>

 <p className="break-all text-emerald-700">
 {batch.previousHash}
 </p>

 </div>


 <div className="mt-4 flex flex-col items-center gap-2">
  <p className="text-xs text-emerald-600">Consumer QR Verification</p>
  <QRCodeCanvas
   value={`${FRONTEND_URL}/trace/${batch.batchId}`}
   size={120}
  />

 </div>

 </div>

 ))}

 </div>

 </div>

 )

}
