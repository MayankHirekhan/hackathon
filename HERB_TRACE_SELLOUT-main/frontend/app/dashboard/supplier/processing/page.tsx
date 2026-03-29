"use client"

import { useState, useEffect } from "react"

interface Batch {
 batchId: string
 herbName: string
 farmer: string
 quantity: number
 status: string
}

export default function ProcessingPage(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [batches, setBatches] = useState<Batch[]>([])
 const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null)
 const [loading, setLoading] = useState(true)
 const [submitting, setSubmitting] = useState(false)
 const [message, setMessage] = useState("")

 const [processingMethod, setProcessingMethod] = useState("air-dried")
 const [dryingTemperature, setDryingTemperature] = useState("")
 const [processingDuration, setProcessingDuration] = useState("")
 const [packetQuantity, setPacketQuantity] = useState("")

 useEffect(()=>{

  fetch(`${API}/api/batches`)
  .then(res => res.json())
  .then(data => {

   if(Array.isArray(data)){
    const receivedBatches = data.filter((b:any) => b.status === "received")
    setBatches(receivedBatches)
   }

   setLoading(false)

  })
  .catch(err => {

   console.error("Error:", err)
   setLoading(false)

  })

 }, [API])

 async function handleProcessing(){

  if(!selectedBatch){
   setMessage("❌ Please select a batch first")
   return
  }

  if(!processingMethod || !dryingTemperature || !processingDuration || !packetQuantity){
   setMessage("❌ Please fill in all processing details")
   return
  }

  setSubmitting(true)

  try{

   const batchRes = await fetch(`${API}/api/batches/${selectedBatch.batchId}/process`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     processingMethod,
     dryingTemperature: Number(dryingTemperature),
     processingDuration
    })
   })

   if(!batchRes.ok){
    const errorText = await batchRes.text()
    console.error("Batch update error:", errorText)
    setMessage(`❌ Failed to update batch: ${batchRes.status}`)
    setSubmitting(false)
    return
   }

   const batchData = await batchRes.json()

   if(!batchData.success){
    setMessage(`❌ ${batchData.message}`)
    setSubmitting(false)
    return
   }

   const packetRes = await fetch(`${API}/api/packets/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
     batchId: selectedBatch.batchId,
     herbName: selectedBatch.herbName,
     totalWeight: selectedBatch.quantity,
     packetWeight: (selectedBatch.quantity / Number(packetQuantity)).toFixed(2)
    })
   })

   if(!packetRes.ok){
    const errorText = await packetRes.text()
    console.error("Packet API error:", errorText)
    setMessage(`❌ Failed to create packets: ${packetRes.status}`)
    setSubmitting(false)
    return
   }

   const packetData = await packetRes.json()

   if(packetData.error){
    setMessage(`❌ ${packetData.error}`)
   }else{
    setMessage(`✅ Batch processed! Created ${packetQuantity} packets`)
    
    setSelectedBatch(null)
    setProcessingMethod("air-dried")
    setDryingTemperature("")
    setProcessingDuration("")
    setPacketQuantity("")
    
    setBatches(batches.filter(b => b.batchId !== selectedBatch.batchId))
   }

  }catch(err){

   console.error(err)
   setMessage("❌ Error processing batch")

  }finally{

   setSubmitting(false)

  }

 }

 if(loading){
  return <p className="text-emerald-700 p-10">⏳ Loading batches...</p>
 }

 return(

  <div className="space-y-6">

   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     ⚙️ Process Batch
    </h1>
    <p className="text-sm text-emerald-700">
     Move received batches through drying, processing, and packet creation.
    </p>
   </div>

   <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
    <h2 className="text-lg font-semibold text-emerald-900">
     📦 Select Batch to Process
    </h2>

    {batches.length === 0 ? (

     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
      <p className="text-emerald-700">
       ⚠️ No batches available for processing
      </p>
      <p className="text-emerald-600 text-sm mt-2">
       A batch must be created by a farmer and received by your unit.
      </p>
     </div>

    ) : (

     <div className="space-y-3">
      {batches.map(batch => (
       <div
        key={batch.batchId}
        onClick={() => setSelectedBatch(batch)}
        className={`p-4 rounded-xl cursor-pointer border transition ${
         selectedBatch?.batchId === batch.batchId
         ? "bg-emerald-50 border-emerald-300"
         : "bg-white border-emerald-100 hover:border-emerald-300"
        }`}
       >
        <div className="flex justify-between items-center">
         <div>
          <p className="font-semibold text-emerald-900">{batch.herbName}</p>
          <p className="text-emerald-600 text-sm">
           Batch ID: {batch.batchId}
          </p>
          <p className="text-emerald-600 text-sm">
           Farmer: {batch.farmer}
          </p>
          <p className="text-emerald-600 text-sm">
           Quantity: {batch.quantity} kg
          </p>
         </div>
         {selectedBatch?.batchId === batch.batchId && (
          <p className="text-emerald-700 font-semibold">✅ Selected</p>
         )}
        </div>
       </div>
      ))}
     </div>

    )}
   </div>

   {selectedBatch && (

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
     <h2 className="text-lg font-semibold text-emerald-900">
      🔧 Processing Details
     </h2>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
       <label className="text-xs font-semibold text-emerald-700">Processing Method</label>
       <select
        value={processingMethod}
        onChange={(e)=>setProcessingMethod(e.target.value)}
        className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
       >
        <option value="air-dried">Air Dried</option>
        <option value="sun-dried">Sun Dried</option>
        <option value="shade-dried">Shade Dried</option>
        <option value="oven-dried">Oven Dried</option>
       </select>
      </div>

      <div>
       <label className="text-xs font-semibold text-emerald-700">Drying Temperature (°C)</label>
       <input
        type="number"
        value={dryingTemperature}
        onChange={(e)=>setDryingTemperature(e.target.value)}
        className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
       />
      </div>

      <div>
       <label className="text-xs font-semibold text-emerald-700">Processing Duration</label>
       <input
        type="text"
        value={processingDuration}
        onChange={(e)=>setProcessingDuration(e.target.value)}
        placeholder="e.g., 8 hours"
        className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
       />
      </div>

      <div>
       <label className="text-xs font-semibold text-emerald-700">Packets to Create</label>
       <input
        type="number"
        value={packetQuantity}
        onChange={(e)=>setPacketQuantity(e.target.value)}
        placeholder="e.g., 50"
        className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
       />
      </div>
     </div>

     <button
      onClick={handleProcessing}
      disabled={submitting}
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-semibold"
     >
      {submitting ? "Processing..." : "Process Batch"}
     </button>
    </div>

   )}

   {message && (
    <div className={`p-4 rounded-xl text-sm ${message.includes("✅") ? "bg-emerald-50 text-emerald-800 border border-emerald-200" : "bg-amber-50 text-amber-800 border border-amber-200"}`}>
     {message}
    </div>
   )}

  </div>

 )

}
