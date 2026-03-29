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
 location?: string
 latitude?: number
 longitude?: number
 geoImage?: string
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
   return res.json()
  })
  .then(data=>{

   if(data.success && Array.isArray(data.batches)){
    setBatches(data.batches)
   }else if(Array.isArray(data)){
    setBatches(data)
   }

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

   const res = await fetch(`${API}/api/lab/test-batch`,{
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
   })

   const data = await res.json()

   if(data.success){
    alert(`✅ Test results recorded: ${result.testResult}`)
    
    setBatches(batches.filter(b=> b.batchId !== batchId))
    
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
  return <p className="text-emerald-700 p-10">🧪 Loading batches for testing...</p>
 }

 return(

  <div className="space-y-8">

   <div>
    <h1 className="text-3xl font-bold text-emerald-900">
     🧪 Test Batches
    </h1>
    <p className="text-sm text-emerald-700">
     Record lab results and approve batches for packaging.
    </p>
   </div>

   {batches.length === 0 ? (

    <div className="bg-emerald-50 p-6 rounded-2xl border border-emerald-100 space-y-4">

     <p className="text-emerald-700 font-semibold">
      ℹ️ All batches have been tested! ✅
     </p>

     <div className="bg-white p-4 rounded-xl border border-emerald-100">

      <p className="text-emerald-700 text-sm font-semibold mb-2">
       Next steps:
      </p>

      <ol className="text-emerald-700 text-sm space-y-1 list-decimal list-inside">

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
       className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm"
      >

       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">

        <div>

         <h3 className="text-2xl font-semibold text-emerald-900">
          {batch.herbName}
         </h3>

         <p className="text-emerald-700 font-semibold">
          Batch: {batch.batchId}
         </p>

         <p className="text-emerald-600 text-sm mt-2">
          👨‍🌾 Farmer: {batch.farmer}
         </p>

         <p className="text-emerald-600 text-sm">
          📅 Harvest: {batch.harvestDate}
         </p>

         <p className="text-emerald-600 text-sm">
          ⚖️ Quantity: {batch.quantity} kg
         </p>

         <p className="text-emerald-600 text-sm">
          📍 Location: {batch.location}
         </p>

         {(batch.latitude && batch.longitude) && (
          <div className="mt-3 p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-sm">
           <p className="text-emerald-700 font-semibold mb-1">🗺️ GPS Coordinates</p>
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

        </div>

        <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">

         <p className="text-emerald-700 font-semibold text-sm mb-2">
          ⚙️ Processing Details:
         </p>

         <p className="text-emerald-700 text-sm">
          Method: {batch.processingMethod}
         </p>

         <p className="text-emerald-700 text-sm">
          Temp: {batch.dryingTemperature}°C
         </p>

         <p className="text-emerald-700 text-sm">
          Duration: {batch.processingDuration}
         </p>

        </div>

       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
         <label className="text-xs font-semibold text-emerald-700">Test Result</label>
         <select
          value={testResults[batch.batchId]?.testResult || ""}
          onChange={(e)=>updateTestResult(batch.batchId,"testResult",e.target.value)}
          className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
         >
          <option value="">Select Result</option>
          <option value="PASS">PASS</option>
          <option value="FAIL">FAIL</option>
         </select>
        </div>
        <div>
         <label className="text-xs font-semibold text-emerald-700">Notes</label>
         <input
          value={testResults[batch.batchId]?.notes || ""}
          onChange={(e)=>updateTestResult(batch.batchId,"notes",e.target.value)}
          placeholder="Observations / contaminants"
          className="mt-2 w-full border border-emerald-200 rounded-xl px-3 py-2 text-emerald-900"
         />
        </div>
       </div>

       <button
        onClick={()=>handleTestSubmit(batch.batchId)}
        disabled={submitting}
        className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl font-semibold"
       >
        {submitting ? "Submitting..." : "Submit Test Result"}
       </button>

      </div>

     ))}

    </div>

   )}

  </div>

 )

}
