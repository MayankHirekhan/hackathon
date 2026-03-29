"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { QRCodeCanvas } from "qrcode.react"

export default function FarmerCertificate(){

 const { id } = useParams()

 const API =
 process.env.NEXT_PUBLIC_API_URL ||
 "http://localhost:5000"

 const BASE =
 process.env.NEXT_PUBLIC_BASE_URL ||
 "http://localhost:3000"

 const [farmer,setFarmer] = useState<any>(null)

 useEffect(()=>{

 fetch(`${API}/api/admin/farmer/${id}`)
 .then(res=>res.json())
 .then(setFarmer)

 },[id])

 if(!farmer){

 return(
 <div className="text-emerald-700 p-10">
 Loading certificate...
 </div>
 )

 }

 const certificateId =
 "HT-CERT-" + farmer._id.slice(-6).toUpperCase()

 const issueDate =
 new Date().toLocaleDateString()

 return(

 <div className="bg-white border border-emerald-200 rounded-3xl p-10 shadow-sm mt-10 relative">

 {/* SEAL */}

 <div className="absolute top-6 right-6 text-[90px] opacity-10">
 🌿
 </div>

 {/* HEADER */}

 <div className="text-center mb-8">

 <h1 className="text-3xl font-bold text-emerald-900">
 HerbTracking Authority
 </h1>

 <p className="text-emerald-700 text-sm">
 Herbal Supply Chain Verification Board (India)
 </p>

 </div>

 <h2 className="text-center text-2xl font-semibold mb-10 text-emerald-800">
 Farm Authenticity Certificate
 </h2>

 {/* TEXT */}

 <div className="text-center space-y-4 text-lg text-emerald-900">

 <p>This certificate confirms that</p>

 <p className="text-3xl font-bold text-emerald-700">
 {farmer.name}
 </p>

 <p>owner of</p>

 <p className="text-xl font-semibold">
 {farmer.farmName}
 </p>

 <p>located in</p>

 <p className="text-xl">
 {farmer.location}
 </p>

 <p>
 is a verified herbal producer within the
 HerbTracking national traceability network.
 </p>

 </div>

 {/* DETAILS */}

 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 text-sm">

 <div>
 <p className="text-emerald-600">Certificate ID</p>
 <p className="font-semibold text-emerald-900">{certificateId}</p>
 </div>

 <div>
 <p className="text-emerald-600">Issue Date</p>
 <p className="font-semibold text-emerald-900">{issueDate}</p>
 </div>

 <div>
 <p className="text-emerald-600">Experience</p>
 <p className="font-semibold text-emerald-900">
 {farmer.experience} years
 </p>
 </div>

 <div>
 <p className="text-emerald-600">Farmer Rating</p>
 <p className="font-semibold text-emerald-900">
 ⭐ {farmer.rating}/5
 </p>
 </div>

 </div>

 {/* FOOTER */}

 <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8">

 {/* SIGNATURE */}

 <div>

 <p className="text-emerald-600 text-sm">
 Authorized By
 </p>

 <p className="text-xl font-semibold mt-1 text-emerald-900">
 HerbTracking Authority
 </p>

 <div className="mt-2 border-t border-emerald-300 w-40"></div>

 <p className="text-xs mt-1 text-emerald-600">
 Digital Verification Signature
 </p>

 </div>

 {/* STAMP */}

 <div className="text-center">

 <div className="w-24 h-24 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-700 text-xs font-bold rotate-3 bg-emerald-50">
 VERIFIED
 </div>

 <p className="text-xs text-emerald-600 mt-2">
 Official Seal
 </p>

 </div>

 {/* QR */}

 <div className="text-center">

 <p className="text-emerald-600 text-sm mb-2">
 Verification QR
 </p>

 <QRCodeCanvas
 value={`${BASE}/trace/farmer/${farmer._id}`}
 size={90}
 />

 </div>

 </div>

 </div>

 )

}
