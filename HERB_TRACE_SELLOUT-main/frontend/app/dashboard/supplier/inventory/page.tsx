"use client"

import { useEffect,useState } from "react"
import { QRCodeCanvas } from "qrcode.react"

interface Packet{
 packetId:string
 weight:number
}

interface BatchInventory{

 batchId:string
 herbName:string
 farmer:string
 location:string
 packetCount:number
 packets:Packet[]
 latitude?:number
 longitude?:number

}

export default function Inventory(){

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
const FRONTEND_URL = process.env.NEXT_PUBLIC_FRONTEND_URL || "http://localhost:3000"

const [inventory,setInventory] = useState<BatchInventory[]>([])
const [openBatch,setOpenBatch] = useState<string | null>(null)

useEffect(()=>{

fetch(`${API}/api/inventory`)
.then(res=>res.json())
.then(data=>{

 if(Array.isArray(data)){
 setInventory(data)
 }

})

},[])

return(

<div className="space-y-6">

<div>
 <h1 className="text-3xl font-bold text-emerald-900">
  Inventory
 </h1>
 <p className="text-sm text-emerald-700">
  View packaged batches and share QR codes for downstream partners.
 </p>
</div>

<div className="space-y-4">

{inventory.map(batch=>(

<div
key={batch.batchId}
className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"
>

<div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">

<div className="flex-1 text-sm text-emerald-700 space-y-1">

<p><b>Batch ID :</b> {batch.batchId}</p>
<p><b>Herb :</b> {batch.herbName}</p>
<p><b>Farmer :</b> {batch.farmer}</p>
<p><b>Location :</b> {batch.location}</p>
<p><b>Packets :</b> {batch.packetCount}</p>

{(batch.latitude && batch.longitude) && (
<div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-sm">
<p className="text-emerald-700 font-semibold mb-1">📍 GPS Coordinates</p>
<p className="text-emerald-900">Lat: <b>{batch.latitude.toFixed(6)}</b></p>
<p className="text-emerald-900">Lon: <b>{batch.longitude.toFixed(6)}</b></p>
</div>
)}

</div>

<button
className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
onClick={()=>{

setOpenBatch(
openBatch===batch.batchId
? null
: batch.batchId
)

}}
>

{openBatch===batch.batchId ? "Hide QR" : "View QR"}

</button>

</div>


{openBatch===batch.batchId &&(

<div className="bg-emerald-50 p-6 rounded-xl text-center mt-4 border border-emerald-100">

<p className="text-sm text-emerald-700 mb-4">
Scan this QR to receive the batch
</p>

<QRCodeCanvas
value={`${FRONTEND_URL}/receive/${batch.batchId}`}
size={150}
/>

<p className="text-sm mt-4 font-bold text-emerald-900">
Batch: {batch.batchId}
</p>

</div>

)}

</div>

))}

</div>

</div>

)

}
