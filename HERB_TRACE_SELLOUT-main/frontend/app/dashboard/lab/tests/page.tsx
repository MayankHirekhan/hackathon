"use client"

import { useEffect, useState } from "react"

interface Batch {
 batchId: string
 herbName: string
 farmer: string
 quantity: number
 unit: string
 harvestDate: string
 supplierId: string
 status: string
 processingMethod: string
 dryingTemperature: number
 processingDuration: string
}

export default function TestBatches(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [batches, setBatches] = useState<Batch[]>([])
 const [loading, setLoading] = useState(true)
 const [testResults, setTestResults] = useState<any>({})
 const [submitting, setSubmitting] = useState(false)
 const [labId, setLabId] = useState<string | null>(null)
 const [labName, setLabName] = useState<string | null>(null)

 useEffect(()=>{

  const id = typeof window !== "undefined" ? localStorage.getItem("labId") : null
  const name = typeof window !== "undefined" ? localStorage.getItem("labName") : null
  
  setLabId(id)
  setLabName(name)

  fetch(`${API}/api/lab/testable-batches`)
  .then(res=>{
   console.log("API response status:", res.status)
   return res.json()
  })
  .then(data=>{

   console.log("🧪 Lab API response:", data)

   if(data.success && Array.isArray(data.batches)){
    console.log(`✅ Got ${data.batches.length} testable batches`)
    setBatches(data.batches)
   }else if(Array.isArray(data)){
    console.log(`✅ Got ${data.length} testable batches (legacy format)`)
    setBatches(data)
   }else{
    console.log("⚠️ No batches in response")
   }

   setLoading(false)

  })
  .catch(err=>{
   console.error("❌ Error fetching batches:", err)
   setLoading(false)
  })
  .catch(err=>{

   console.error("❌ Error fetching batches:", err)
   setLoading(false)

  })

 }, [API])

 async function handleTestSubmit(batchId: string){

  const result = testResults[batchId]

  if(!result || !result.testResult){
   alert("Please select a test result")
   return
  }

  // Debug: Check all required fields
  console.log("📤 Submitting test results:")
  console.log("  batchId:", batchId)
  console.log("  labId:", labId)
  console.log("  labName:", labName)
  console.log("  labResult:", result.testResult)
  console.log("  testDetails:", result.notes)

  if(!labId){
   alert("⚠️ Lab ID not found. Please log in again.")
   return
  }

  setSubmitting(true)

  try{

   const payload = {
    batchId,
    labId,
    labName,
    labResult: result.testResult,
    testDetails: result.notes || ""
   }

   console.log("📨 Sending payload:", payload)

   const res = await fetch(`${API}/api/lab/test-batch`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
   })

   const data = await res.json()

   console.log("📥 Response:", data)

   if(data.success){
    alert(`✅ Test results recorded: ${result.testResult}`)
    
    /* REMOVE FROM TESTABLE BATCHES */
    setBatches(batches.filter(b=> b.batchId !== batchId))
    
    /* CLEAR TEST RESULT */
    setTestResults({...testResults, [batchId]: null})
   }else{
    alert(`❌ ${data.message}`)
   }

  }catch(err){
   console.error("❌ Error submitting:", err)
   alert("❌ Error submitting test results")
  }finally{
   setSubmitting(false)
  }

 }

 function updateTestResult(batchId: string, field: string, value: any){
  setTestResults({
   ...testResults,
   [batchId]: {
    ...testResults[batchId],
    [field]: value
   }
  })
 }

 if(loading){
  return <p className="text-white p-10">🧪 Loading batches for testing...</p>
 }

 return(

  <div className="space-y-8 p-8">

   <h1 className="text-3xl font-bold text-green-400">
    🧪 Test Batches
   </h1>

   {batches.length === 0 ? (

    <div className="bg-[#083d34] p-6 rounded-xl space-y-4">

     <p className="text-gray-300 font-bold">
      ℹ️ All batches have been tested! ✅
     </p>

     <div className="bg-[#041f17] p-4 rounded border border-green-600">

      <p className="text-green-300 text-sm font-semibold mb-2">
       Next steps:
      </p>

      <ol className="text-gray-300 text-sm space-y-1 list-decimal list-inside">

       <li>Supplier receives test results</li>
       <li>Supplier packages tested herbs</li>
       <li>Products distributed to consumers</li>

      </ol>

     </div>

    </div>

   ) : (

    <div className="space-y-4">

     {batches.map((batch: Batch)=>(

      <div
       key={batch.batchId}
       className="bg-[#083d34] p-6 rounded-xl border border-green-600"
      >

       <div className="grid grid-cols-2 gap-4 mb-4">

        <div>

         <h3 className="text-2xl font-bold text-green-400">
          {batch.herbName}
         </h3>

         <p className="text-gray-300 font-semibold">
          Batch: {batch.batchId}
         </p>

         <p className="text-gray-400 text-sm mt-2">
          👨‍🌾 Farmer: {batch.farmer}
         </p>

         <p className="text-gray-400 text-sm">
          📅 Harvest: {batch.harvestDate}
         </p>

         <p className="text-gray-400 text-sm">
          ⚖️ Quantity: {batch.quantity} kg
         </p>

         <p className="text-gray-400 text-sm">
          📍 Location: {batch.location}
         </p>

         {(batch.latitude && batch.longitude) && (
          <div className="mt-3 p-3 bg-[#062f27] rounded border border-green-600 text-sm">
           <p className="text-green-400 font-semibold mb-1">🗺️ GPS Coordinates</p>
           <p className="text-white">Lat: <b>{batch.latitude.toFixed(6)}</b></p>
           <p className="text-white">Lon: <b>{batch.longitude.toFixed(6)}</b></p>
          </div>
         )}

         {batch.geoImage && (
          <img
           src={batch.geoImage}
           className="mt-3 rounded border border-green-600 w-full"
           alt="Farm location map"
          />
         )}

        </div>

        <div className="bg-[#041f17] p-3 rounded">

         <p className="text-yellow-300 font-semibold text-sm mb-2">
          ⚙️ Processing Details:
         </p>

         <p className="text-gray-400 text-sm">
          Method: {batch.processingMethod}
         </p>

         <p className="text-gray-400 text-sm">
          Temp: {batch.dryingTemperature}°C
         </p>

         <p className="text-gray-400 text-sm">
          Duration: {batch.processingDuration}
         </p>

        </div>

       </div>

       {/* TEST INPUT FORM */}

       {!testResults[batch.batchId]?.submitted ? (

        <div className="bg-[#041f17] p-4 rounded mt-4 space-y-3">

         <p className="text-white font-semibold">🧪 Test Results:</p>

         <div>

          <label className="text-gray-300 text-sm">pH Level</label>

          <input
           type="number"
           placeholder="6.5"
           step="0.1"
           value={testResults[batch.batchId]?.phLevel || ""}
           onChange={(e)=>updateTestResult(batch.batchId, "phLevel", e.target.value)}
           className="w-full bg-[#062f27] border border-green-500 rounded p-2 text-white"
          />

         </div>

         <div>

          <label className="text-gray-300 text-sm">Moisture Content (%)</label>

          <input
           type="number"
           placeholder="12"
           step="0.1"
           value={testResults[batch.batchId]?.moisture || ""}
           onChange={(e)=>updateTestResult(batch.batchId, "moisture", e.target.value)}
           className="w-full bg-[#062f27] border border-green-500 rounded p-2 text-white"
          />

         </div>

         <div>

          <label className="text-gray-300 text-sm">Microbial Load (CFU/mL)</label>

          <input
           type="text"
           placeholder="< 100"
           value={testResults[batch.batchId]?.microbial || ""}
           onChange={(e)=>updateTestResult(batch.batchId, "microbial", e.target.value)}
           className="w-full bg-[#062f27] border border-green-500 rounded p-2 text-white"
          />

         </div>

         <div>

          <label className="text-gray-300 text-sm">Overall Result</label>

          <select
           value={testResults[batch.batchId]?.testResult || ""}
           onChange={(e)=>updateTestResult(batch.batchId, "testResult", e.target.value)}
           className="w-full bg-[#062f27] border border-green-500 rounded p-2 text-white"
          >

           <option value="">-- Select Result --</option>

           <option value="PASS">✅ PASS</option>

           <option value="FAIL">❌ FAIL</option>

          </select>

         </div>

         <div>

          <label className="text-gray-300 text-sm">Notes</label>

          <textarea
           placeholder="Any additional observations..."
           value={testResults[batch.batchId]?.notes || ""}
           onChange={(e)=>updateTestResult(batch.batchId, "notes", e.target.value)}
           className="w-full bg-[#062f27] border border-green-500 rounded p-2 text-white h-16"
          />

         </div>

         <button
          onClick={()=>handleTestSubmit(batch.batchId)}
          disabled={submitting}
          className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-4 py-2 rounded font-semibold text-white"
         >

          {submitting ? "⏳ Submitting..." : "✅ Submit Test Results"}

         </button>

        </div>

       ) : (

        <div className="bg-[#0b3d2f] border border-green-500 p-4 rounded mt-4 text-center">

         <p className="text-green-400 font-bold text-lg">✅ Test Submitted</p>

         <p className="text-gray-300 text-sm mt-1">
          Result: {testResults[batch.batchId]?.testResult}
         </p>

        </div>

       )}

      </div>

     ))}

    </div>

   )}

  </div>

 )

}
