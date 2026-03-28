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

 /* PROCESSING FORM */
 const [processingMethod, setProcessingMethod] = useState("air-dried")
 const [dryingTemperature, setDryingTemperature] = useState("")
 const [processingDuration, setProcessingDuration] = useState("")
 const [packetQuantity, setPacketQuantity] = useState("")

 /* FETCH RECEIVED BATCHES */

 useEffect(()=>{

  fetch(`${API}/api/batches`)
  .then(res => res.json())
  .then(data => {

   if(Array.isArray(data)){
    /* Filter: Only RECEIVED batches ready for processing */
    const receivedBatches = data.filter((b:any) => b.status === "received")
    setBatches(receivedBatches)
    console.log(`Found ${receivedBatches.length} batches ready for processing`)
   }

   setLoading(false)

  })
  .catch(err => {

   console.error("Error:", err)
   setLoading(false)

  })

 }, [API])

 /* SUBMIT PROCESSING */

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

   /* Step 1: Update batch with processing details */

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

   /* Step 2: Create packets from the batch */

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
    
    /* Clear form and refresh */
    setSelectedBatch(null)
    setProcessingMethod("air-dried")
    setDryingTemperature("")
    setProcessingDuration("")
    setPacketQuantity("")
    
    /* Refresh batch list */
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
  return <p className="text-white p-10">⏳ Loading batches...</p>
 }

 return(

  <div className="p-10 text-white space-y-6">

   <h1 className="text-3xl font-bold text-green-400">
    ⚙️ Process Batch
   </h1>

   {/* SELECT BATCH */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h2 className="text-xl font-bold text-green-400 mb-4">
     📦 Select Batch to Process
    </h2>

    {batches.length === 0 ? (

     <div className="bg-[#041f17] p-4 rounded border border-yellow-600">

      <p className="text-yellow-300">
       ⚠️ No batches available for processing
      </p>

      <p className="text-gray-400 text-sm mt-2">
       A batch must be:
      </p>

      <ul className="text-gray-400 text-sm list-disc list-inside mt-1">

       <li>Created by farmer</li>
       <li>Received by supplier</li>

      </ul>

     </div>

    ) : (

     <div className="space-y-3">

      {batches.map(batch => (

       <div
        key={batch.batchId}
        onClick={() => setSelectedBatch(batch)}
        className={`p-4 rounded cursor-pointer border-2 transition ${
         selectedBatch?.batchId === batch.batchId
         ? "bg-green-900 border-green-500"
         : "bg-[#041f17] border-gray-600 hover:border-green-500"
        }`}
       >

        <div className="flex justify-between items-center">

         <div>

          <p className="font-bold">{batch.herbName}</p>

          <p className="text-gray-400 text-sm">
           Batch ID: {batch.batchId}
          </p>

          <p className="text-gray-400 text-sm">
           Farmer: {batch.farmer}
          </p>

          <p className="text-gray-400 text-sm">
           Quantity: {batch.quantity} kg
          </p>

         </div>

         <div className="text-right">

          {selectedBatch?.batchId === batch.batchId && (
           <p className="text-green-300 font-bold">✅ Selected</p>
          )}

         </div>

        </div>

       </div>

      ))}

     </div>

    )}

   </div>

   {/* PROCESSING DETAILS */}

   {selectedBatch && (

    <div className="bg-[#083d34] p-6 rounded-xl space-y-4">

     <h2 className="text-xl font-bold text-green-400 mb-4">
      🔧 Processing Details
     </h2>

     <div>

      <label className="text-gray-300 font-semibold block mb-2">
       Processing Method
      </label>

      <select
       value={processingMethod}
       onChange={(e) => setProcessingMethod(e.target.value)}
       className="w-full bg-[#041f17] border border-green-500 rounded p-3 text-white"
      >

       <option value="air-dried">Air-dried</option>
       <option value="oven-dried">Oven-dried</option>
       <option value="freeze-dried">Freeze-dried</option>
       <option value="sun-dried">Sun-dried</option>

      </select>

     </div>

     <div>

      <label className="text-gray-300 font-semibold block mb-2">
       Drying Temperature (°C)
      </label>

      <input
       type="number"
       placeholder="e.g., 45"
       value={dryingTemperature}
       onChange={(e) => setDryingTemperature(e.target.value)}
       className="w-full bg-[#041f17] border border-green-500 rounded p-3 text-white"
      />

     </div>

     <div>

      <label className="text-gray-300 font-semibold block mb-2">
       Processing Duration (days)
      </label>

      <input
       type="text"
       placeholder="e.g., 7 days"
       value={processingDuration}
       onChange={(e) => setProcessingDuration(e.target.value)}
       className="w-full bg-[#041f17] border border-green-500 rounded p-3 text-white"
      />

     </div>

     <div>

      <label className="text-gray-300 font-semibold block mb-2">
       Number of Packets to Create
      </label>

      <input
       type="number"
       placeholder="e.g., 100"
       value={packetQuantity}
       onChange={(e) => setPacketQuantity(e.target.value)}
       className="w-full bg-[#041f17] border border-green-500 rounded p-3 text-white"
      />

      {packetQuantity && selectedBatch && (
       <p className="text-gray-400 text-sm mt-2">

        Each packet: ~{(selectedBatch.quantity / Number(packetQuantity)).toFixed(2)} kg

       </p>
      )}

     </div>

     {message && (

      <div className={`p-3 rounded text-sm ${
       message.includes("✅") ? "bg-green-900 text-green-300" : "bg-red-900 text-red-300"
      }`}>

       {message}

      </div>

     )}

     <button
      onClick={handleProcessing}
      disabled={submitting || !selectedBatch}
      className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-3 rounded-lg font-bold text-white mt-4"
     >

      {submitting ? "⏳ Processing..." : "✅ Start Processing & Create Packets"}

     </button>

    </div>

   )}

  </div>

 )

}