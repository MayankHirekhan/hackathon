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

/* ===========================
START CAMERA
=========================== */

useEffect(()=>{

const reader = new BrowserMultiFormatReader()

startScanner(reader)

return ()=>{

if(controlsRef.current && typeof controlsRef.current.stop === 'function'){
 controlsRef.current.stop()
}

}

},[API])

/* ===========================
CAMERA START
=========================== */

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

/* ===========================
VERIFY PRODUCT
=========================== */

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

/* ===========================
MANUAL VERIFY
=========================== */

function manualVerify(){

if(!batchId) return

verify(batchId.trim())

}

return(

<div className="p-10 text-white space-y-8">

<h1 className="text-3xl text-green-400">
Product Verification
</h1>

{/* SCANNER */}

<div className="bg-[#062c21] p-6 rounded-xl">

<h2 className="text-xl mb-4">
Scan QR Code
</h2>

<div className="flex gap-6 items-start">

<video
ref={videoRef}
className="w-[420px] h-[300px] rounded border border-green-800"
/>

<div className="space-y-3">

<p className="text-gray-400 text-sm">
Allow camera access and place the QR code inside the frame.
</p>

<p className="text-green-400">
Status: {status}
</p>

</div>

</div>

</div>

{/* MANUAL ENTRY */}

<div className="bg-[#062c21] p-6 rounded-xl">

<h2 className="text-xl mb-4">
Manual Batch ID
</h2>

<div className="flex gap-4">

<input
value={batchId}
onChange={(e)=>setBatchId(e.target.value)}
placeholder="Enter Batch ID"
className="p-3 bg-[#041f17] border border-green-800 rounded w-72"
/>

<button
onClick={manualVerify}
className="bg-green-600 px-6 py-3 rounded hover:bg-green-500"
>
Verify
</button>

</div>

</div>

{/* RESULT */}

{data &&(

<div className="bg-[#062c21] p-6 rounded-xl space-y-4">

<h2 className="text-xl text-green-400">
Herb Information
</h2>

<div className="grid grid-cols-2 gap-6">

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

{data.geoImage &&(

<div>

<p className="text-green-400 mt-4">
Farm Location
</p>

<img
src={data.geoImage}
className="rounded border border-green-700 mt-2"
/>

</div>

)}

<div className="mt-4">

<p className="text-green-400">
Blockchain Hash
</p>

<p className="break-all text-sm">
{data.hash}
</p>

<p className="text-yellow-400 mt-2">
Previous Hash
</p>

<p className="break-all text-sm">
{data.previousHash}
</p>

</div>

</div>

)}

</div>

)

}