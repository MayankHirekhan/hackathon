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

   // Prevent HTML parse error
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


 /* =========================
    LOADING
 ========================= */

 if(loading){
  return(
   <div className="text-white p-10">
    Loading harvests...
   </div>
  )
 }


 /* =========================
    ERROR
 ========================= */

 if(error){
  return(
   <div className="text-red-400 p-10">
    {error}
   </div>
  )
 }


 /* =========================
    UI
 ========================= */

 return(

 <div>

 <h1 className="text-3xl font-bold mb-8">
 My Harvests
 </h1>

 {batches.length===0 &&(
  <p className="text-gray-400">
   No harvest batches found
  </p>
 )}


 <div className="grid grid-cols-2 gap-6">

 {batches.map(batch=>(

 <div
 key={batch._id}
 className="bg-[#062c21] p-6 rounded-xl shadow-lg"
 >

 <img
 src={`/herbs/${batch.herbName.toLowerCase()}.jpg`}
 className="h-40 w-full object-cover rounded"
 />

 <h2 className="text-xl mt-3 font-semibold">
 {batch.herbName}
 </h2>

 <p>Batch ID : {batch.batchId}</p>
 <p>Harvest : {batch.harvestDate}</p>
 <p>Quantity : {batch.quantity} kg</p>
 <p>Location : {batch.location}</p>


 <div className="mt-4 bg-[#041f17] p-3 rounded text-xs">

 <p className="text-green-400">
 Block Hash
 </p>

 <p className="break-all text-gray-300">
 {batch.hash}
 </p>

 <p className="text-yellow-400 mt-2">
 Previous Block
 </p>

 <p className="break-all text-gray-400">
 {batch.previousHash}
 </p>

 </div>


 <div className="mt-4 flex justify-center">

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