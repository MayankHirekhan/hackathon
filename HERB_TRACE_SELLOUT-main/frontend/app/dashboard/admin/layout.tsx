"use client"

import Link from "next/link"

export default function AdminLayout({children}:{children:React.ReactNode}){

 return(
 <div className="flex min-h-screen bg-emerald-50 text-emerald-950">

 {/* SIDEBAR */}

 <div className="w-64 bg-white border-r border-emerald-100 p-6 flex flex-col gap-8">

 <div>
  <h1 className="text-2xl font-bold text-emerald-900">🌿 HerbTracking</h1>
  <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mt-1">
   National Admin Console
  </p>
 </div>

 <nav className="flex flex-col gap-2 text-sm font-medium">

 <Link className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800" href="/dashboard/admin">Overview</Link>

 <Link className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800" href="/dashboard/admin/farmers">Farmers</Link>

 <Link className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800" href="/dashboard/admin/suppliers">Suppliers</Link>

 <Link className="px-3 py-2 rounded-lg hover:bg-emerald-50 text-emerald-800" href="/dashboard/admin/labs">Labs</Link>

 </nav>

 <div className="mt-auto text-xs text-emerald-600">
  Powered by India Herb Mission
 </div>

 </div>

 {/* MAIN */}

 <div className="flex-1 p-10">

 {children}

 </div>

 </div>
 )
}
