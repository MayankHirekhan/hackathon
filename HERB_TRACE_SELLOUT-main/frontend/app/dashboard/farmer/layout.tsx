"use client"

import { useRouter, usePathname } from "next/navigation"

export default function FarmerLayout({
 children,
}: {
 children: React.ReactNode
}) {

 const router = useRouter()
 const pathname = usePathname()

 const menu = [
  {name:"Home",icon:"🏠",path:"/dashboard/farmer/home"},
  {name:"Create Batch",icon:"📦",path:"/dashboard/farmer/batches"},
  {name:"My Harvests",icon:"🌾",path:"/dashboard/farmer/harvests"},
  {name:"Reports",icon:"📊",path:"/dashboard/farmer/reports"},
  {name:"Farm Certificate",icon:"📜",path:"/dashboard/farmer/certificate"},
 ]

 function logout(){
  router.push("/login")
 }

 return(

 <div className="min-h-screen bg-emerald-50 text-emerald-950 flex">

  {/* SIDEBAR */}

  <div className="w-72 bg-white border-r border-emerald-100 p-6 flex flex-col">

   <div className="mb-8">
    <h1 className="text-2xl font-bold text-emerald-900">
     🌾 HerbTracking
    </h1>
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mt-1">
     Kisan Dashboard
    </p>
   </div>

   <div className="space-y-2">

    {menu.map((item,index)=>{

     const active = pathname === item.path

     return(

     <button
      key={index}
      onClick={()=>router.push(item.path)}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl transition font-medium
      ${active ? "bg-emerald-100 text-emerald-900" : "text-emerald-700 hover:bg-emerald-50"}`}
     >

      <span>{item.icon}</span>
      <span>{item.name}</span>

     </button>

     )

    })}

   </div>

   <div className="mt-auto pt-6 text-xs text-emerald-600">
    Grow • Track • Earn Trust
   </div>

  </div>

  {/* MAIN AREA */}

  <div className="flex-1 flex flex-col">

   {/* TOP BAR */}

   <div className="flex justify-between items-center p-4 border-b border-emerald-100 bg-white">
    <p className="text-sm text-emerald-700">Namaste, farmer partner 👋</p>
    <button
     onClick={logout}
     className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg text-sm font-semibold"
    >
     Logout
    </button>

   </div>

   {/* PAGE CONTENT */}

   <div className="p-10">

    {children}

   </div>

  </div>

 </div>

 )

}
