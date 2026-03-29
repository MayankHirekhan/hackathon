"use client"

import Link from "next/link"

export default function SupplierLayout({
 children,
}:{
 children:React.ReactNode
}){

return(

<div className="flex min-h-screen bg-emerald-50 text-emerald-950">

{/* SIDEBAR */}

<div className="w-72 bg-white border-r border-emerald-100 p-6 flex flex-col gap-8">

<div>
 <h1 className="text-2xl font-bold text-emerald-900">
  📦 HerbTracking
 </h1>
 <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mt-1">
  Supply Partner
 </p>
</div>

<nav className="space-y-2 text-sm font-medium text-emerald-700">

<Link href="/dashboard/supplier" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
Dashboard
</Link>

<Link href="/dashboard/supplier/receive" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
Receive Batch
</Link>

<Link href="/dashboard/supplier/processing" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
Processing Log
</Link>

<Link href="/dashboard/supplier/packaging" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
Packaging
</Link>

<Link href="/dashboard/supplier/inventory" className="block px-3 py-2 rounded-lg hover:bg-emerald-50">
Inventory
</Link>

</nav>

<div className="mt-auto text-xs text-emerald-600">
 Reliable, traceable, export-ready
</div>

</div>

{/* CONTENT */}

<div className="flex-1 p-8">

<div className="bg-white border border-emerald-100 p-4 rounded-2xl mb-6 shadow-sm flex items-center justify-between">
 <div>
  <p className="text-sm text-emerald-700">Supply Chain Tracking</p>
  <h2 className="text-xl font-semibold text-emerald-900">Herb Movement Overview</h2>
 </div>
 <span className="text-2xl">🌿</span>
</div>

{children}

</div>

</div>

)

}
