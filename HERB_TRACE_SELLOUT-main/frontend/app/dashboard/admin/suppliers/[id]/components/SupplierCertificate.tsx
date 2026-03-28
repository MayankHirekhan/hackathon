"use client"

import { QRCodeCanvas } from "qrcode.react"

export default function SupplierCertificate({supplier}:any){

 const certificateId =
 "HT-SUP-" + supplier._id.slice(-6).toUpperCase()

 const issueDate =
 new Date().toLocaleDateString()

 return(

 <div className="bg-[#062c21] border-[6px] border-green-700 rounded-xl p-10 shadow-xl">

 <div className="text-center mb-8">

 <h1 className="text-3xl font-bold text-green-400">
 HERBTRACE AUTHORITY
 </h1>

 <p className="text-gray-300 text-sm">
 Herbal Supply Chain Verification Board
 </p>

 </div>


 <h2 className="text-center text-2xl font-semibold mb-10">
 Supplier Authenticity Certificate
 </h2>


 <div className="text-center space-y-4 text-lg">

 <p>This certificate confirms that</p>

 <p className="text-3xl font-bold text-green-400">
 {supplier.name}
 </p>

 <p>representing</p>

 <p className="text-xl font-semibold">
 {supplier.companyName}
 </p>

 <p>located in</p>

 <p className="text-xl">
 {supplier.location}
 </p>

 <p>
 is an authorized herbal supply chain distributor
 within the HerbTrace Blockchain Network.
 </p>

 </div>


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
 {supplier.experience} years
 </p>
 </div>

 <div>
 <p className="text-gray-400">Rating</p>
 <p className="font-semibold">
 ⭐ {supplier.rating}
 </p>
 </div>

 </div>


 <div className="flex justify-between items-end mt-12">


 <div>

 <p className="text-gray-400 text-sm">
 Authorized By
 </p>

 <p className="text-xl font-semibold mt-1">
 HerbTrace Authority
 </p>

 <div className="mt-2 border-t border-green-700 w-40"></div>

 </div>


 <div className="text-center">

 <div className="w-24 h-24 rounded-full border-4 border-red-600 flex items-center justify-center text-red-500 text-xs font-bold rotate-12">
 VERIFIED
 </div>

 <p className="text-xs text-gray-400 mt-2">
 Official Seal
 </p>

 </div>


 <div className="text-center">

 <p className="text-gray-400 text-sm mb-2">
 Verification QR
 </p>

 <QRCodeCanvas
 value={`http://localhost:3000/trace/supplier/${supplier._id}`}
 size={90}
 />

 </div>

 </div>

 </div>

 )

}