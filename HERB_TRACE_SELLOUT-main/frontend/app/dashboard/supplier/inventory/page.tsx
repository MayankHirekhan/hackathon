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

<div className="p-8 text-white">

<h1 className="text-3xl text-green-400 mb-6">
Inventory
</h1>

<div className="space-y-4">

{inventory.map(batch=>(

<div
key={batch.batchId}
className="bg-[#083d34] p-6 rounded-xl"
>

<div className="flex justify-between items-center">

<div>

<p><b>Batch ID :</b> {batch.batchId}</p>
<p><b>Herb :</b> {batch.herbName}</p>
<p><b>Farmer :</b> {batch.farmer}</p>
<p><b>Location :</b> {batch.location}</p>
<p><b>Packets :</b> {batch.packetCount}</p>

</div>

<button
className="bg-green-600 px-3 py-1 rounded"
onClick={()=>{

setOpenBatch(
openBatch===batch.batchId
? null
: batch.batchId
)

}}
>

View QR

</button>

</div>


{/* QR FOR BATCH RECEIVE */}

{openBatch===batch.batchId &&(

<div className="bg-[#062f27] p-6 rounded text-center mt-4">

<p className="text-sm text-gray-300 mb-4">
Scan this QR to receive the batch
</p>

<QRCodeCanvas
value={`${FRONTEND_URL}/receive/${batch.batchId}`}
size={150}
/>

<p className="text-sm mt-4 font-bold">
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