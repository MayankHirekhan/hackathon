"use client"

import Link from "next/link"

export default function AdminLayout({children}:{children:React.ReactNode}){

 return(
 <div className="flex min-h-screen bg-[#041f1a] text-white">

 {/* SIDEBAR */}

 <div className="w-60 bg-[#062f27] p-6">

 <h1 className="text-xl mb-8 font-bold text-green-400">HerbTrace</h1>

 <nav className="flex flex-col gap-4">

 <Link href="/dashboard/admin">Home</Link>

 <Link href="/dashboard/admin/farmers">Farmers</Link>

 <Link href="/dashboard/admin/suppliers">Suppliers</Link>

 <Link href="/dashboard/admin/labs">Lab Testers</Link>

 </nav>

 </div>

 {/* MAIN */}

 <div className="flex-1 p-10">

 {children}

 </div>

 </div>
 )
}