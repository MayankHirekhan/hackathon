"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function TracePage(){

 const { id } = useParams()

 const API =
 process.env.NEXT_PUBLIC_API_URL ||
 "http://localhost:5000"

 const [batch,setBatch] = useState<any>(null)
 const [packet,setPacket] = useState<any>(null)
 const [farmer,setFarmer] = useState<any>(null)
 const [supplier,setSupplier] = useState<any>(null)

 const [loading,setLoading] = useState(true)
 const [error,setError] = useState("")

 useEffect(()=>{

 async function loadTrace(){

 try{

 const res = await fetch(`${API}/api/trace/${id}`)

 if(!res.ok){
  throw new Error("Trace API failed")
 }

 const data = await res.json()

 if(data.type === "packet"){
  setBatch(data.batch)
  setPacket(data.packet)
 }

 if(data.type === "batch"){
  setBatch(data.batch)
 }

 setFarmer(data.farmer || null)
 setSupplier(data.supplier || null)

 }catch(err){

 console.error(err)
 setError("Unable to load trace data")

 }

 setLoading(false)

 }

 loadTrace()

 },[id,API])


 if(loading){
 return(
  <div className="p-10 text-emerald-700">
   Loading trace data...
  </div>
 )
 }

 if(error){
 return(
  <div className="p-10 text-red-500">
   {error}
  </div>
 )
 }

 if(!batch){
 return(
  <div className="p-10 text-red-500">
   Batch data not found
  </div>
 )
 }


 return(

 <div className="min-h-screen bg-emerald-50 text-emerald-950 p-10">

 <div className="max-w-4xl mx-auto space-y-6">
  <div>
   <h1 className="text-3xl font-bold text-emerald-900">
   🌿 Herb Traceability
   </h1>
   <p className="text-sm text-emerald-700">
    Verified transparency from farm to shelf for India’s herbal supply chain.
   </p>
  </div>


  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-2">

  <p><b>Herb :</b> {batch.herbName}</p>

  <p><b>Batch ID :</b> {batch.batchId}</p>

  {packet && (
  <p><b>Packet ID :</b> {packet.packetId}</p>
  )}

  <p><b>Farmer :</b> {farmer?.name || batch.farmer}</p>

  <p><b>Supplier :</b> {supplier?.name || batch.supplierName}</p>

  <p><b>Harvest Date :</b> {batch.harvestDate}</p>

  <p><b>Quantity :</b> {batch.quantity} kg</p>

  <p><b>Location :</b> {batch.location}</p>

  </div>


  <div className="space-y-4">

  {(batch.latitude && batch.longitude) && (
   <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
    <p className="text-emerald-700 font-semibold mb-2">📍 GPS Coordinates</p>
    <p className="text-emerald-900 text-sm">Latitude: <b>{batch.latitude.toFixed(6)}</b></p>
    <p className="text-emerald-900 text-sm">Longitude: <b>{batch.longitude.toFixed(6)}</b></p>
   </div>
  )}

  {batch.geoImage && (
   <div>
    <p className="text-emerald-700 font-semibold mb-2">🗺️ Farm Location Map</p>
    <img
     src={batch.geoImage}
     className="rounded-xl border border-emerald-100 w-full"
    />
   </div>
  )}

  </div>


  <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">

  <p className="text-emerald-700 font-semibold">
  Blockchain Hash
  </p>

  <p className="break-all text-sm text-emerald-900">
  {batch.hash}
  </p>

  <p className="text-emerald-600 mt-2">
  Previous Hash
  </p>

  <p className="break-all text-sm text-emerald-700">
  {batch.previousHash}
  </p>

  </div>

 </div>

 </div>

 )

}
