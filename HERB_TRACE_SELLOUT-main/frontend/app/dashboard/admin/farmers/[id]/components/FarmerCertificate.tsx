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
 <div className="text-white p-10">
 Loading certificate...
 </div>
 )

 }

 const certificateId =
 "HT-CERT-" + farmer._id.slice(-6).toUpperCase()

 const issueDate =
 new Date().toLocaleDateString()

 return(

 <div className="bg-[#062c21] border-[6px] border-green-700 rounded-xl p-10 shadow-xl mt-10 relative">

 {/* SEAL */}

 <div className="absolute top-6 right-6 text-[90px] opacity-10">
 🌿
 </div>

 {/* HEADER */}

 <div className="text-center mb-8">

 <h1 className="text-3xl font-bold text-green-400">
 HERBTRACE AUTHORITY
 </h1>

 <p className="text-gray-300 text-sm">
 Herbal Supply Chain Verification Board
 </p>

 </div>

 <h2 className="text-center text-2xl font-semibold mb-10">
 Farm Authenticity Certificate
 </h2>

 {/* TEXT */}

 <div className="text-center space-y-4 text-lg">

 <p>This certificate confirms that</p>

 <p className="text-3xl font-bold text-green-400">
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
 HerbTrace Blockchain Traceability Network.
 </p>

 </div>

 {/* DETAILS */}

 <div className="grid grid-cols-2 gap-6 mt-10 text-sm">

 <div>
 <p className="text-gray-400">Certificate ID</p>
 <p className="font-semibold">{certificateId}</p>
 </div>

 <div>
 <p className="text-gray-400">Issue Date</p>
 <p className="font-semibold">{issueDate}</p>
 </div>

 <div>
 <p className="text-gray-400">Experience</p>
 <p className="font-semibold">
 {farmer.experience} years
 </p>
 </div>

 <div>
 <p className="text-gray-400">Farmer Rating</p>
 <p className="font-semibold">
 ⭐ {farmer.rating}/5
 </p>
 </div>

 </div>

 {/* FOOTER */}

 <div className="flex justify-between items-end mt-12">

 {/* SIGNATURE */}

 <div>

 <p className="text-gray-400 text-sm">
 Authorized By
 </p>

 <p className="text-xl font-semibold mt-1">
 HerbTrace Authority
 </p>

 <div className="mt-2 border-t border-green-700 w-40"></div>

 <p className="text-xs mt-1">
 Digital Verification Signature
 </p>

 </div>

 {/* STAMP */}

 <div className="text-center">

 <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center text-red-500 text-xs font-bold rotate-12">
 VERIFIED
 </div>

 <p className="text-xs text-gray-400 mt-2">
 Official Seal
 </p>

 </div>

 {/* QR */}

 <div className="text-center">

 <p className="text-gray-400 text-sm mb-2">
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