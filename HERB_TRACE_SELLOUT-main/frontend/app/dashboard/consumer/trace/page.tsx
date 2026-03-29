"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/browser"

export default function TracePage(){

const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000"

const videoRef = useRef<HTMLVideoElement>(null)
const controlsRef = useRef<any>(null)

const [batchId,setBatchId] = useState("")
const [data,setData] = useState<any>(null)
const [status,setStatus] = useState("Waiting for scan...")

useEffect(()=>{

const reader = new BrowserMultiFormatReader()

startScanner(reader)

return ()=>{

if(controlsRef.current && typeof controlsRef.current.stop === 'function'){
 controlsRef.current.stop()
}

}

},[API])

async function startScanner(reader:BrowserMultiFormatReader){

try{

const constraints = {
video:{
facingMode:"environment"
}
}

const controls = await reader.decodeFromConstraints(
 constraints,
 videoRef.current!,
 (result,error)=>{

  if(result){

   const id = result.getText().split("/").pop()?.trim()

   setStatus("QR detected")

   verify(id)

   if(controls && typeof controls.stop === 'function'){
    controls.stop()
   }

  }

 }
)

controlsRef.current = controls

}catch(err){

console.error(err)
setStatus("Camera permission denied")

}

}

async function verify(id:any){

try{

const cleanId = id.trim()

setStatus("Verifying product...")

const res = await fetch(`${API}/api/trace/${cleanId}`)

if(!res.ok){

setStatus("Invalid QR code")
return

}

const result = await res.json()

if(result.batch){

setData(result.batch)

setStatus("Product verified")
const history =
JSON.parse(localStorage.getItem("traceHistory") || "[]")

history.unshift(result.batch)

localStorage.setItem(
"traceHistory",
JSON.stringify(history.slice(0,5))
)

}else{

setStatus("Invalid QR code")

}

}catch(err){

console.error(err)
setStatus("Verification failed")

}

}

function manualVerify(){

if(!batchId) return

verify(batchId.trim())

}

return(

<div className="space-y-8">

<div>
 <h1 className="text-3xl font-bold text-emerald-900">
  Product Verification
 </h1>
 <p className="text-sm text-emerald-700">
  Scan a QR or enter a batch ID to verify herb authenticity.
 </p>
</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h2 className="text-lg font-semibold text-emerald-900 mb-4">
Scan QR Code
</h2>

<div className="flex flex-col lg:flex-row gap-6 items-start">

<video
ref={videoRef}
className="w-full lg:w-[420px] h-[300px] rounded-xl border border-emerald-200 bg-emerald-50"
/>

<div className="space-y-3 text-sm text-emerald-700">

<p>
Allow camera access and place the QR code inside the frame.
</p>

<p className="text-emerald-800 font-semibold">
Status: {status}
</p>

</div>

</div>

</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h2 className="text-lg font-semibold text-emerald-900 mb-4">
Manual Batch ID
</h2>

<div className="flex flex-col md:flex-row gap-4">

<input
value={batchId}
onChange={(e)=>setBatchId(e.target.value)}
placeholder="Enter Batch ID"
className="p-3 bg-white border border-emerald-200 rounded-xl w-full md:w-72 text-emerald-900"
/>

<button
onClick={manualVerify}
className="bg-emerald-600 px-6 py-3 rounded-xl hover:bg-emerald-700 text-white font-semibold"
>
Verify
</button>

</div>

</div>

{data &&(

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">

<h2 className="text-xl font-semibold text-emerald-900">
Herb Information
</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-emerald-700">

<div>

<p><b>Herb:</b> {data.herbName}</p>
<p><b>Batch:</b> {data.batchId}</p>
<p><b>Farmer:</b> {data.farmer}</p>
<p><b>Harvest:</b> {data.harvestDate}</p>

</div>

<div>

<p><b>Supplier:</b> {data.supplierName}</p>
<p><b>Location:</b> {data.location}</p>
<p><b>Quantity:</b> {data.quantity} kg</p>

</div>

</div>

<div className="mt-4 space-y-4">

{(data.latitude && data.longitude) && (
<div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
<p className="text-emerald-700 font-semibold mb-2">📍 GPS Coordinates</p>
<p className="text-emerald-900 text-sm">Latitude: <b>{data.latitude.toFixed(6)}</b></p>
<p className="text-emerald-900 text-sm">Longitude: <b>{data.longitude.toFixed(6)}</b></p>
</div>
)}

{data.geoImage &&(
<div>
<p className="text-emerald-700 font-semibold mb-2">🗺️ Farm Location Map</p>
<img
src={data.geoImage}
className="rounded-xl border border-emerald-100 w-full"
/>
</div>
)}

</div>

<div className="mt-4">

<p className="text-emerald-700 font-semibold">
Blockchain Hash
</p>

<p className="break-all text-sm text-emerald-900">
{data.hash}
</p>

<p className="text-emerald-600 mt-2">
Previous Hash
</p>

<p className="break-all text-sm text-emerald-700">
{data.previousHash}
</p>

</div>

</div>

)}

</div>

)

}
