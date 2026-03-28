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

 // Inventory states
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

  // Fetch inventories
  fetchInventories(id)

  // Initialize scanner on mount
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

   // Fetch farmer inventory
   const farmerRes = await fetch(`${API}/api/supplier/batches/farmer-inventory/${id}`)
   const farmerData = await farmerRes.json()
   console.log("✅ Farmer inventory response:", farmerData)
   if(farmerData.success){
    setFarmerInventory(farmerData.data || [])
   }

   // Fetch lab export inventory
   const labRes = await fetch(`${API}/api/supplier/batches/lab-export/${id}`)
   const labData = await labRes.json()
   console.log("✅ Lab export inventory response:", labData)
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

   // Create scanner with BETTER camera settings for live scanning
   const scanner = new Html5QrcodeScanner(
    "qr-reader", // Container ID
    { 
     fps: 30, // Higher FPS for better real-time detection
     qrbox: { width: 300, height: 300 }, // Larger box to detect QR at different distances
     aspectRatio: 1.0,
     disableFlip: false,
     formatsToSupport: ['QR_CODE'],
     experimentalFeatures: {
      useBarCodeDetectorIfSupported: true
     },
     // Better camera constraints for auto-focus and good quality
     videoConstraints: {
      facingMode: "environment",
      width: { min: 360, ideal: 1280, max: 1920 },
      height: { min: 360, ideal: 720, max: 1080 },
      focusMode: ["continuous", "auto", "single-shot"],
      focusDistance: 0,
      zoom: 1.0
     }
    },
    false // verbose mode
   )

   let scannedCodes = new Set()
   let isProcessing = false

   // Handle successful scan
   const onScanSuccess = async(decodedText: string)=>{
    if(scannedCodes.has(decodedText) || isProcessing){
     return
    }

    scannedCodes.add(decodedText)
    setTimeout(()=>{ scannedCodes.delete(decodedText) }, 3000)

    console.log("✅ QR Code Detected:", decodedText)
    setMessage(`✅ QR Detected! Processing...`)

    isProcessing = true

    try{
     const batchId = decodedText.split("/").pop()?.trim()
     console.log("📦 Extracted batchId:", batchId)

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
     console.log("✅ Server response:", data)

     if(data.success){
      setMessage(`✅ SUCCESS! Batch ${data.batch.batchId} received`)
      setManualBatchId("")
      // Refetch inventories
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

   // Handle error
   const onScanError = (err: any)=>{
    // Ignore "No QR code detected" errors
    if(err && err.message && !err.message.includes("No QR code detected")){
     console.warn("Scanner warning:", err)
    }
   }

   // Start the scanner
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
    // Refetch inventories
    fetchInventories(supplierId)

   }else{

    setMessage(`❌ ${data.message || "Batch receipt failed"}`)

   }

  }catch(error){

   console.error(error)
   setMessage("❌ Connection error")

  }

 }

 return(

  <div className="p-10 text-white space-y-6">

   <h1 className="text-3xl font-bold mb-6">
    📦 Receive Batch
   </h1>

   {/* SUPPLIER STATUS */}

   <div className={`p-4 rounded-lg ${supplierId ? "bg-green-900 border border-green-500" : "bg-red-900 border border-red-500"}`}>

    <p className={`font-semibold ${supplierId ? "text-green-300" : "text-red-300"}`}>

     {supplierId ? `✅ Logged in: ${supplierName || "Supplier"}` : "❌ Not logged in as supplier"}

    </p>

   </div>

   {!supplierId && (

    <div className="bg-yellow-900 border border-yellow-500 p-4 rounded-lg">

     <p className="text-yellow-300">⚠️ Please log in to supplier dashboard first</p>

    </div>

   )}

   {/* CAMERA SCANNER */}

   <div className="bg-[#083d34] p-6 rounded-xl border-2 border-green-600">

    <h2 className="text-xl font-bold text-green-400 mb-4">
     📷 QR Code Scanner
    </h2>

    <div className="bg-black rounded-lg overflow-hidden mb-4 border-4 border-green-700" style={{minHeight: "400px"}}>

     <div id="qr-reader" className="w-full"></div>

    </div>

    {/* STATUS */}
    <div className={`p-4 rounded mb-4 font-semibold ${message.includes("Ready") ? "bg-green-900 border border-green-500 text-green-300" : message.includes("✅") ? "bg-green-900 border border-green-500 text-green-300" : "bg-yellow-900 border border-yellow-500 text-yellow-300"}`}>
     {message || "🔍 Loading camera..."}
    </div>

    {cameraError && (
     <div className="bg-red-900 border border-red-500 p-3 rounded mb-4 text-red-300 text-sm">
      ⚠️ <b>Camera Error:</b> {cameraError}
     </div>
    )}

    {/* TROUBLESHOOTING */}
    <div className="bg-[#041f17] p-4 rounded border border-yellow-600 mb-4">
     <p className="text-yellow-300 font-bold text-sm mb-2">📸 How to Scan with Camera:</p>
     <ul className="text-xs text-yellow-200 space-y-1 list-disc list-inside">
      <li><b>Brightness:</b> Your camera needs GOOD lighting - bright room (not dark)</li>
      <li><b>Camera Focus:</b> Let camera AUTO-FOCUS - stay STILL for 2-3 seconds</li>
      <li><b>Distance:</b> 6-12 inches from your camera lens</li>
      <li><b>Angle:</b> QR code SQUARE to camera (not tilted 45°)</li>
      <li><b>Phone Screen:</b> Make QR LARGE and CLEAR (no glare)</li>
      <li><b>Test:</b> If camera won't work: try REFRESHING, use manual entry, or print QR code</li>
     </ul>
    </div>

    <button
     onClick={refreshScanner}
     className="w-full bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded font-semibold text-white text-sm mb-4"
    >
     🔄 Reset Scanner
    </button>

   </div>

   {/* MANUAL ENTRY FALLBACK */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h2 className="text-xl font-bold text-green-400 mb-4">
     ✏️ Or Enter Batch ID Manually
    </h2>

    <div className="flex gap-4 mb-4">

     <input
      type="text"
      placeholder="Enter Batch ID (e.g., BATCH-2024-001)"
      value={manualBatchId}
      onChange={(e)=>setManualBatchId(e.target.value)}
      className="flex-1 bg-[#041f17] border border-green-400 rounded p-3 text-white"
     />

     <button
      onClick={handleManualSubmit}
      className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded font-semibold"
     >
      Submit
     </button>

    </div>

    {/* IMAGE UPLOAD FOR TESTING */}
    <div className="mt-4 p-3 border-2 border-dashed border-green-500 rounded-lg">
     <p className="text-sm text-green-300 mb-2">📸 Test QR from Image (for debugging):</p>
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
         console.log("✅ Image scan result:", result)
         if(result){
          setMessage(`✅ Image QR: ${result.decodedText}`)
         }
        }catch(err){
         console.log("Image scan failed:", err)
         setMessage("❌ Image scan failed - try camera or manual entry")
        }
       }
      }}
      className="text-xs text-green-300 cursor-pointer"
     />
    </div>

   </div>

   {/* REFRESH INVENTORIES BUTTON */}
   <div className="text-center">
    <button
     onClick={()=>{ if(supplierId) fetchInventories(supplierId) }}
     className="bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600 px-8 py-3 rounded-lg font-bold text-white"
    >
     🔄 Refresh Inventories
    </button>
   </div>

   {/* INVENTORIES SUMMARY */}
   <div className="grid grid-cols-2 gap-4 mb-6">
    <div className="bg-blue-900 border-2 border-blue-500 p-4 rounded-lg text-center">
     <p className="text-blue-300 text-sm font-semibold">Farmer Inventory</p>
     <p className="text-3xl font-bold text-blue-200">{farmerInventory.length}</p>
     <p className="text-xs text-blue-400">Batches Received</p>
    </div>
    <div className="bg-purple-900 border-2 border-purple-500 p-4 rounded-lg text-center">
     <p className="text-purple-300 text-sm font-semibold">Lab Export Inventory</p>
     <p className="text-3xl font-bold text-purple-200">{labExportInventory.length}</p>
     <p className="text-xs text-purple-400">Lab Tested Batches</p>
    </div>
   </div>

   {/* FARMER INVENTORY */}
   <div className="bg-[#083d34] p-6 rounded-xl border-2 border-blue-600">

    <h2 className="text-xl font-bold text-blue-400 mb-4">
     🌾 Farmer Inventory (Received from Farmers)
    </h2>

    {loadingInventory ? (
     <p className="text-gray-400 text-center py-4">Loading inventory...</p>
    ) : farmerInventory.length === 0 ? (
     <div className="text-center py-8">
      <p className="text-gray-400 text-lg">📭 No batches received yet</p>
      <p className="text-gray-500 text-sm mt-2">Scan a QR code or enter a Batch ID above to get started</p>
     </div>
    ) : (
     <div className="space-y-4">
      {farmerInventory.map((batch:any)=>{
       const getStatusColor = (status:string) => {
        switch(status){
         case "received": return "bg-blue-700 text-blue-100"
         case "processing": return "bg-orange-700 text-orange-100"
         case "tested": return "bg-purple-700 text-purple-100"
         case "packaged": return "bg-green-700 text-green-100"
         default: return "bg-gray-700 text-gray-100"
        }
       }
       return(
        <div key={batch._id} className="bg-[#0a5047] p-5 rounded-lg border border-blue-500 hover:border-blue-400 transition">
         <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
           <p className="text-blue-300 text-sm font-mono">{batch.batchId}</p>
           <p className="text-blue-100 font-semibold text-lg mt-1">{batch.herbName}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-bold whitespace-nowrap ${getStatusColor(batch.status)}`}>
           {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
          </span>
         </div>
         <div className="grid grid-cols-2 gap-3 text-sm text-blue-200">
          <div>
           <p className="text-blue-400 font-semibold">Farmer</p>
           <p>{batch.farmer || "N/A"}</p>
          </div>
          <div>
           <p className="text-blue-400 font-semibold">Quantity</p>
           <p>{batch.quantity} {batch.unit}</p>
          </div>
          <div>
           <p className="text-blue-400 font-semibold">Harvest Date</p>
           <p>{batch.harvestDate ? new Date(batch.harvestDate).toLocaleDateString() : "N/A"}</p>
          </div>
         </div>
        </div>
       )
      })}
     </div>
    )}

   </div>

   {/* LAB EXPORT INVENTORY */}
   <div className="bg-[#1a3d34] p-6 rounded-xl border-2 border-purple-600">

    <h2 className="text-xl font-bold text-purple-400 mb-4">
     🔬 Lab Export Inventory (Passed Lab Tests)
    </h2>

    {loadingInventory ? (
     <p className="text-gray-400 text-center py-4">Loading inventory...</p>
    ) : labExportInventory.length === 0 ? (
     <div className="text-center py-8">
      <p className="text-gray-400 text-lg">📭 No batches passed lab tests yet</p>
      <p className="text-gray-500 text-sm mt-2">Once batches are tested and approved, they will appear here</p>
     </div>
    ) : (
     <div className="space-y-4">
      {labExportInventory.map((batch:any)=>{
       const getStatusColor = (status:string) => {
        switch(status){
         case "received": return "bg-blue-700 text-blue-100"
         case "processing": return "bg-orange-700 text-orange-100"
         case "tested": return "bg-purple-700 text-purple-100"
         case "packaged": return "bg-green-700 text-green-100"
         default: return "bg-gray-700 text-gray-100"
        }
       }
       const getResultColor = (result:string) => {
        return result?.toUpperCase() === "PASS" ? "bg-green-700 text-green-100" : "bg-red-700 text-red-100"
       }
       return(
        <div key={batch._id} className="bg-[#0f2622] p-5 rounded-lg border border-purple-500 hover:border-purple-400 transition">
         <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
           <p className="text-purple-300 text-sm font-mono">{batch.batchId}</p>
           <p className="text-purple-100 font-semibold text-lg mt-1">{batch.herbName}</p>
          </div>
          <span className={`px-3 py-1 rounded text-sm font-bold whitespace-nowrap ${getStatusColor(batch.status)}`}>
           {batch.status.charAt(0).toUpperCase() + batch.status.slice(1)}
          </span>
         </div>
         <div className="grid grid-cols-2 gap-3 text-sm text-purple-200 mb-3">
          <div>
           <p className="text-purple-400 font-semibold">Lab Name</p>
           <p>{batch.labName || "N/A"}</p>
          </div>
          <div>
           <p className="text-purple-400 font-semibold">Quantity</p>
           <p>{batch.quantity} {batch.unit}</p>
          </div>
          <div>
           <p className="text-purple-400 font-semibold">Test Date</p>
           <p>{batch.labTestDate ? new Date(batch.labTestDate).toLocaleDateString() : "N/A"}</p>
          </div>
          <div>
           <p className="text-purple-400 font-semibold">Test Result</p>
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

 )

}