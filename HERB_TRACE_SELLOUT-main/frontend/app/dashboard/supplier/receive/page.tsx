"use client"

import { useEffect, useRef, useState } from "react"
import { Html5QrcodeScanner } from "html5-qrcode"

export default function ReceivePage(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const [message, setMessage] = useState("")
 const [manualBatchId, setManualBatchId] = useState("")
 const [cameraActive, setCameraActive] = useState(false)
 const [cameraError, setCameraError] = useState("")
 const [supplierId, setSupplierId] = useState<string | null>(null)
 const [supplierName, setSupplierName] = useState<string | null>(null)
 const scannerRef = useRef<Html5QrcodeScanner | null>(null)

 const [farmerInventory, setFarmerInventory] = useState<any[]>([])
 const [labExportInventory, setLabExportInventory] = useState<any[]>([])
 const [loadingInventory, setLoadingInventory] = useState(false)

 useEffect(()=>{

  const id = typeof window !== "undefined" ? localStorage.getItem("supplierId") : null
  const name = typeof window !== "undefined" ? localStorage.getItem("supplierName") : null
  
  setSupplierId(id)
  setSupplierName(name)

  if(!id){
   setMessage("❌ Not logged in as supplier")
   return
  }

  fetchInventories(id)

  const timer = setTimeout(()=>{
   startScanner()
  }, 500)

  return()=>{
   clearTimeout(timer)
   stopScanner()
  }

 },[supplierId])

 const fetchInventories = async(id: string)=>{
  try{
   setLoadingInventory(true)
   console.log("🔄 Fetching inventories for supplier:", id)

   const farmerRes = await fetch(`${API}/api/supplier/batches/farmer-inventory/${id}`)
   const farmerData = await farmerRes.json()
   if(farmerData.success){
    setFarmerInventory(farmerData.data || [])
   }

   const labRes = await fetch(`${API}/api/supplier/batches/lab-export/${id}`)
   const labData = await labRes.json()
   if(labData.success){
    setLabExportInventory(labData.data || [])
   }

  }catch(err){
   console.error("❌ Failed to fetch inventories:", err)
   alert("Error loading inventories: " + err)
  }finally{
   setLoadingInventory(false)
  }
 }

 const startScanner = async()=>{
  try{
   setCameraError("")
   setMessage("🔄 Initializing QR scanner...")

   const scanner = new Html5QrcodeScanner(
    "qr-reader",
    { 
     fps: 30,
     qrbox: { width: 300, height: 300 },
     aspectRatio: 1.0,
     disableFlip: false,
     experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
     },
     videoConstraints: {
      facingMode: "environment",
      width: { min: 360, ideal: 1280, max: 1920 },
      height: { min: 360, ideal: 720, max: 1080 }
     }
    },
    false
   )

   let scannedCodes = new Set()
   let isProcessing = false

   const onScanSuccess = async(decodedText: string)=>{
    if(scannedCodes.has(decodedText) || isProcessing){
     return
    }

    scannedCodes.add(decodedText)
    setTimeout(()=>{ scannedCodes.delete(decodedText) }, 3000)

    setMessage(`✅ QR Detected! Processing...`)

    isProcessing = true

    try{
     const batchId = decodedText.split("/").pop()?.trim()

     if(!batchId || batchId.length === 0){
      setMessage("❌ Invalid QR - no batch ID found")
      isProcessing = false
      return
     }

     const supplierId = 
      typeof window !== "undefined"
      ? localStorage.getItem("supplierId")
      : null

     setMessage("📦 Contacting server...")

     const res = await fetch(`${API}/api/receive/batch`,{
      method:"POST",
      headers:{ "Content-Type":"application/json" },
      body:JSON.stringify({ batchId, supplierId })
     })

     const data = await res.json()

     if(data.success){
      setMessage(`✅ SUCCESS! Batch ${data.batch.batchId} received`)
      setManualBatchId("")
      if(supplierId){
       fetchInventories(supplierId)
      }
     }else{
      setMessage(`❌ ${data.message} (ID: ${batchId})`)
     }

    }catch(error){
     console.error("❌ Error:", error)
     setMessage("❌ Connection error - try again")
    }finally{
     isProcessing = false
    }
   }

   const onScanError = (err: any)=>{
    if(err && err.message && !err.message.includes("No QR code detected")){
     console.warn("Scanner warning:", err)
    }
   }

   scanner.render(onScanSuccess, onScanError)
   scannerRef.current = scanner

   setCameraActive(true)
   setMessage("🟢 Ready! Point QR at camera...")

  }catch(err){
   console.error("❌ Camera error:", err)
   const msg = err instanceof Error ? err.message : String(err)
   setCameraError(msg)
   setMessage(`❌ Camera Error: ${msg}`)
   setCameraActive(false)
  }
 }

 const stopScanner = ()=>{
  if(scannerRef.current){
   try{
    scannerRef.current.clear()
    scannerRef.current = null
    console.log("✅ Scanner stopped")
   }catch(err){
    console.log("Scanner already stopped or error:", err)
   }
  }
 }

 const refreshScanner = ()=>{
  stopScanner()
  setMessage("")
  setCameraActive(false)
  setTimeout(()=>{
   startScanner()
  }, 500)
 }

 async function handleManualSubmit(){

  if(!manualBatchId.trim()){
   setMessage("Please enter a batch ID")
   return
  }

  try{

   const supplierId = 
    typeof window !== "undefined"
    ? localStorage.getItem("supplierId")
    : null

   if(!supplierId){
    setMessage("❌ Not logged in as supplier - please login")
    return
   }

   setMessage("📦 Processing batch...")

   const res = await fetch(`${API}/api/receive/batch`,{

    method:"POST",
    headers:{
     "Content-Type":"application/json"
    },

    body:JSON.stringify({
     batchId: manualBatchId.trim(),
     supplierId
    })

   })

   const data = await res.json()

   if(data.success){

    setMessage(`✅ Batch ${data.batch.batchId} received successfully!`)
    setManualBatchId("")
    fetchInventories(supplierId)

   }else{

    setMessage(`❌ Batch receipt failed: ${data.message || "Unknown error"}. Please verify the batch ID and try again.`)

   }

  }catch(err){

   console.error(err)
   setMessage("❌ Batch receipt failed: server error. Please retry in a few minutes.")

  }

 }

 const statusClass = message.includes("✅")
  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
  : message.includes("Ready")
  ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
  : "bg-amber-50 text-amber-800 border border-amber-200"

 return(

  <div className="space-y-8">

   <div className="flex flex-wrap items-center justify-between gap-4">
    <div>
     <h1 className="text-3xl font-bold text-emerald-900">Receive Batches</h1>
     <p className="text-sm text-emerald-700">
      Scan QR codes from farmers to accept batches into your processing line.
     </p>
    </div>
    {supplierName && (
     <div className="bg-emerald-50 border border-emerald-100 rounded-xl px-4 py-2 text-sm text-emerald-700">
      Logged in as <span className="font-semibold text-emerald-900">{supplierName}</span>
     </div>
    )}
   </div>

   {!supplierId && (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
     ⚠️ Please log in to supplier dashboard first
    </div>
   )}

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">
     <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold text-emerald-900">📷 QR Code Scanner</h2>
      <span className={`text-xs px-2 py-1 rounded-full ${cameraActive ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
       {cameraActive ? "Active" : "Standby"}
      </span>
     </div>

     <div className="bg-emerald-50 rounded-xl overflow-hidden border border-emerald-100" style={{minHeight: "360px"}}>
      <div id="qr-reader" className="w-full"></div>
     </div>

     <div className={`p-3 rounded-lg text-sm ${statusClass}`}>
      {message || "🔍 Loading camera..."}
     </div>

     {cameraError && (
      <div className="bg-red-50 border border-red-200 p-3 rounded-lg text-red-700 text-sm">
       ⚠️ <b>Camera Error:</b> {cameraError}
      </div>
     )}

     <div className="bg-emerald-50 p-4 rounded-xl border border-emerald-100">
      <p className="text-emerald-800 font-semibold text-sm mb-2">📸 Scan Tips</p>
      <ul className="text-xs text-emerald-700 space-y-1 list-disc list-inside">
       <li>Use bright lighting and keep the QR steady for 2-3 seconds.</li>
       <li>Hold the QR 6-12 inches away from the camera.</li>
       <li>Keep the QR square to the lens (avoid glare).</li>
      </ul>
     </div>

     <button
      onClick={refreshScanner}
      className="w-full bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-lg font-semibold text-white text-sm"
     >
      🔄 Reset Scanner
     </button>
    </div>

    <div className="space-y-6">
     <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
      <h2 className="text-lg font-semibold text-emerald-900 mb-4">
       ✏️ Enter Batch ID Manually
      </h2>
      <div className="flex flex-col md:flex-row gap-4 mb-4">
       <input
        type="text"
        placeholder="Enter Batch ID (e.g., BATCH-2024-001)"
        value={manualBatchId}
        onChange={(e)=>setManualBatchId(e.target.value)}
        className="flex-1 bg-white border border-emerald-200 rounded-lg p-3 text-emerald-900"
       />
       <button
        onClick={handleManualSubmit}
        className="bg-emerald-600 hover:bg-emerald-700 px-6 py-3 rounded-lg font-semibold text-white"
       >
        Submit
       </button>
      </div>

      <div className="mt-4 p-3 border border-dashed border-emerald-200 rounded-lg">
       <p className="text-sm text-emerald-700 mb-2">📸 Test QR from Image:</p>
       <input
        type="file"
        accept="image/*"
        onChange={async(e)=>{
         const file = e.target.files?.[0]
         if(file && scannerRef.current){
          try{
           const url = URL.createObjectURL(file)
           setMessage("🔄 Scanning image...")
           const result = await (scannerRef.current as any).decodeFromImage(undefined, url)
           if(result){
            setMessage(`✅ Image QR: ${result.decodedText}`)
           }
          }catch(err){
           console.log("Image scan failed:", err)
           setMessage("❌ Image scan failed - try camera or manual entry")
          }
         }
        }}
        className="text-xs text-emerald-700 cursor-pointer"
       />
      </div>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white border border-emerald-100 p-4 rounded-xl text-center shadow-sm">
       <p className="text-emerald-600 text-sm font-semibold">Farmer Inventory</p>
       <p className="text-3xl font-bold text-emerald-900">{farmerInventory.length}</p>
       <p className="text-xs text-emerald-600">Batches Received</p>
      </div>
      <div className="bg-white border border-emerald-100 p-4 rounded-xl text-center shadow-sm">
       <p className="text-emerald-600 text-sm font-semibold">Lab Export Inventory</p>
       <p className="text-3xl font-bold text-emerald-900">{labExportInventory.length}</p>
       <p className="text-xs text-emerald-600">Lab Tested Batches</p>
      </div>
     </div>
    </div>
   </div>

   <div className="text-center">
    <button
     onClick={()=>{ if(supplierId) fetchInventories(supplierId) }}
     className="bg-emerald-800 hover:bg-emerald-900 px-8 py-3 rounded-xl font-semibold text-white"
    >
     🔄 Refresh Inventories
    </button>
   </div>

   <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h2 className="text-lg font-semibold text-emerald-900 mb-4">
      🌾 Farmer Inventory (Received from Farmers)
     </h2>

     {loadingInventory ? (
      <p className="text-emerald-600 text-center py-4">Loading inventory...</p>
     ) : farmerInventory.length === 0 ? (
      <div className="text-center py-8">
       <p className="text-emerald-600 text-lg">📭 No batches received yet</p>
       <p className="text-emerald-500 text-sm mt-2">Scan a QR code or enter a Batch ID above to get started</p>
      </div>
     ) : (
      <div className="space-y-4">
       {farmerInventory.map((batch:any)=>{
        const getStatusColor = (status:string) => {
         switch(status){
          case "received": return "bg-blue-100 text-blue-800"
          case "processing": return "bg-amber-100 text-amber-800"
          case "tested": return "bg-purple-100 text-purple-800"
          case "packaged": return "bg-emerald-100 text-emerald-800"
          default: return "bg-gray-100 text-gray-700"
         }
        }
        return(
         <div key={batch._id} className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-start mb-3">
           <div className="flex-1">
            <p className="text-emerald-600 text-xs font-mono">{batch.batchId}</p>
            <p className="text-emerald-900 font-semibold text-lg mt-1">{batch.herbName}</p>
           </div>
           <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(batch.status)}`}>
            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
           </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-emerald-700">
           <div>
            <p className="text-emerald-500 font-semibold">Farmer</p>
            <p>{batch.farmer || "N/A"}</p>
           </div>
           <div>
            <p className="text-emerald-500 font-semibold">Quantity</p>
            <p>{batch.quantity} {batch.unit}</p>
           </div>
           <div>
            <p className="text-emerald-500 font-semibold">Harvest Date</p>
            <p>{batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString() : "N/A"}</p>
           </div>
          </div>
         </div>
        )
       })}
      </div>
     )}

    </div>

    <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
     <h2 className="text-lg font-semibold text-emerald-900 mb-4">
      🔬 Lab Export Inventory (Passed Lab Tests)
     </h2>

     {loadingInventory ? (
      <p className="text-emerald-600 text-center py-4">Loading inventory...</p>
     ) : labExportInventory.length === 0 ? (
      <div className="text-center py-8">
       <p className="text-emerald-600 text-lg">📭 No batches passed lab tests yet</p>
       <p className="text-emerald-500 text-sm mt-2">Once batches are tested and approved, they will appear here</p>
      </div>
     ) : (
      <div className="space-y-4">
       {labExportInventory.map((batch:any)=>{
        const getStatusColor = (status:string) => {
         switch(status){
          case "received": return "bg-blue-100 text-blue-800"
          case "processing": return "bg-amber-100 text-amber-800"
          case "tested": return "bg-purple-100 text-purple-800"
          case "packaged": return "bg-emerald-100 text-emerald-800"
          default: return "bg-gray-100 text-gray-700"
         }
        }
        const getResultColor = (result:string) => {
         return result?.toUpperCase() === "PASS" ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-700"
        }
        return(
         <div key={batch._id} className="bg-emerald-50 p-5 rounded-xl border border-emerald-100">
          <div className="flex justify-between items-start mb-3">
           <div className="flex-1">
            <p className="text-emerald-600 text-xs font-mono">{batch.batchId}</p>
            <p className="text-emerald-900 font-semibold text-lg mt-1">{batch.herbName}</p>
           </div>
           <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ${getStatusColor(batch.status)}`}>
            {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
           </span>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm text-emerald-700 mb-3">
           <div>
            <p className="text-emerald-500 font-semibold">Lab Name</p>
            <p>{batch.labName || "N/A"}</p>
           </div>
           <div>
            <p className="text-emerald-500 font-semibold">Quantity</p>
            <p>{batch.quantity} {batch.unit}</p>
           </div>
           <div>
            <p className="text-emerald-500 font-semibold">Test Date</p>
            <p>{batch.labTestDate ? new Date(batch.labTestDate).toLocaleDateString() : "N/A"}</p>
           </div>
           <div>
            <p className="text-emerald-500 font-semibold">Test Result</p>
            <span className={`px-2 py-1 rounded text-xs font-bold ${getResultColor(batch.labResult)}`}>
             {batch.labResult || "N/A"}
            </span>
           </div>
          </div>
         </div>
        )
       })}
      </div>
     )}

    </div>
   </div>

  </div>

 )

}
