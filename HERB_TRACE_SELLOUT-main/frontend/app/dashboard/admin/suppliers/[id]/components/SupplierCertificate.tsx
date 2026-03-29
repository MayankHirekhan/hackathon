"use client"

import { QRCodeCanvas } from "qrcode.react"

export default function SupplierCertificate({supplier}:any){

 const certificateId =
 "HT-SUP-" + supplier._id.slice(-6).toUpperCase()

 const issueDate =
 new Date().toLocaleDateString()

  return(

  <div className="bg-white border border-emerald-200 rounded-3xl p-10 shadow-sm">

  <div className="text-center mb-8">

  <h1 className="text-3xl font-bold text-emerald-900">
  HerbTracking Authority
  </h1>

  <p className="text-emerald-700 text-sm">
  AYUSH-aligned Supply Chain Verification Board
  </p>

  </div>


  <h2 className="text-center text-2xl font-semibold mb-10 text-emerald-800">
  Supplier Authenticity Certificate
  </h2>


  <div className="text-center space-y-4 text-lg text-emerald-900">

  <p>This certificate confirms that</p>

  <p className="text-3xl font-bold text-emerald-700">
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
  within the HerbTracking national network.
  </p>

  </div>


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
  {supplier.experience} years
  </p>
  </div>

  <div>
  <p className="text-emerald-600">Rating</p>
  <p className="font-semibold text-emerald-900">
  ⭐ {supplier.rating}
  </p>
  </div>

  </div>


  <div className="flex flex-col md:flex-row justify-between items-start md:items-end mt-12 gap-8">


  <div>

  <p className="text-emerald-600 text-sm">
  Authorized By
  </p>

  <p className="text-xl font-semibold mt-1 text-emerald-900">
  HerbTracking Authority
  </p>

  <div className="mt-2 border-t border-emerald-300 w-40"></div>

  </div>


  <div className="text-center">

  <div className="w-24 h-24 rounded-full border-2 border-emerald-600 flex items-center justify-center text-emerald-700 text-xs font-bold rotate-3 bg-emerald-50">
  VERIFIED
  </div>

  <p className="text-xs text-emerald-600 mt-2">
  Official Seal
  </p>

  </div>


  <div className="text-center">

  <p className="text-emerald-600 text-sm mb-2">
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
