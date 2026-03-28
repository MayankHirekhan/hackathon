"use client"

import { useEffect, useRef, useState } from "react"
import { BrowserMultiFormatReader } from "@zxing/browser"

export default function ReceivePage(){

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 const videoRef = useRef<HTMLVideoElement>(null)
 const [message, setMessage] = useState("")
 const [scanner, setScanner] = useState<any>(null)
 const [manualBatchId, setManualBatchId] = useState("")
 const [cameraActive, setCameraActive] = useState(false)
 const [cameraError, setCameraError] = useState("")
 const [supplierId, setSupplierId] = useState<string | null>(null)
 const [supplierName, setSupplierName] = useState<string | null>(null)

 useEffect(()=>{

  const id = typeof window !== "undefined" ? localStorage.getItem("supplierId") : null
  const name = typeof window !== "undefined" ? localStorage.getItem("supplierName") : null
  
  setSupplierId(id)
  setSupplierName(name)

  if(!id){
   setMessage("❌ Not logged in as supplier")
   return
  }

  const codeReader = new BrowserMultiFormatReader()
  setScanner(codeReader)

  if(videoRef.current){

   try{

    codeReader.decodeFromVideoDevice(

     undefined,
     videoRef.current,

     async(result, err)=>{

      if(err && !cameraActive){
       setCameraError("Camera not accessible or permission denied")
       return
      }

      if(result){

       setCameraActive(true)
       const scannedText = result.getText()
       console.log("📱 Scanned QR:", scannedText)

       try{

        const batchId = scannedText.split("/").pop()?.trim()
        console.log("🔍 Extracted batchId:", batchId)

        if(!batchId){
         setMessage("❌ Invalid QR code format")
         return
        }

        const supplierId = 
         typeof window !== "undefined"
         ? localStorage.getItem("supplierId")
         : null

        setMessage("📦 Processing batch...")

        const res = await fetch(`${API}/api/receive/batch`,{

         method:"POST",
         headers:{
          "Content-Type":"application/json"
         },

         body:JSON.stringify({
          batchId,
          supplierId
         })

        })

        const data = await res.json()
        console.log("📡 Server response:", data)

        if(data.success){

         setMessage(`✅ Batch ${data.batch.batchId} received successfully!`)
         setManualBatchId("")

        }else{

         setMessage(`❌ ${data.message || "Batch receipt failed"} (ID: ${batchId})`)

        }

       }catch(error){

        console.error("❌ Error:", error)
        setMessage("❌ Connection error - check console")

       }

      }

     }

    ).then(controls=>{
     setScanner(controls)
    }).catch(err=>{
     console.error("Scanner error:", err)
     setCameraError("Failed to start scanner")
    })

   }catch(err){

    console.error("Camera setup error:", err)
    setCameraError("Camera setup failed")

   }

  }

  return()=>{

   if(scanner && typeof scanner.stop === 'function'){
    scanner.stop()
   }

  }

 },[API, cameraActive])

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

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h2 className="text-xl font-bold text-green-400 mb-4">
     📷 Scan QR Code
    </h2>

    <div className="bg-black rounded-lg overflow-hidden mb-4">

     <video
      ref={videoRef}
      className="w-full h-96 object-cover"
      autoPlay
      playsInline
     />

    </div>

    {cameraError && (

     <p className="text-red-400 text-sm mb-4">
      ⚠️ {cameraError} - Use manual entry below
     </p>

    )}

    <p className={`text-sm ${message.includes("✅") ? "text-green-400" : message.includes("❌") ? "text-red-400" : "text-yellow-400"}`}>
     {message || "Point camera at QR code..."}
    </p>

   </div>

   {/* MANUAL ENTRY FALLBACK */}

   <div className="bg-[#083d34] p-6 rounded-xl">

    <h2 className="text-xl font-bold text-green-400 mb-4">
     ✏️ Or Enter Batch ID Manually
    </h2>

    <div className="flex gap-4">

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

   </div>

  </div>

 )

}