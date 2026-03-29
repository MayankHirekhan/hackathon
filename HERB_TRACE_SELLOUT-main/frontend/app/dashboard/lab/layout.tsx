"use client"

import { useRouter, usePathname } from "next/navigation"

export default function LabLayout({
 children,
}: {
 children: React.ReactNode
}) {

 const router = useRouter()
 const pathname = usePathname()

 const menu = [
  {name:"Home",icon:"🏠",path:"/dashboard/lab"},
  {name:"Test Batches",icon:"🧪",path:"/dashboard/lab/tests"},
  {name:"Certifications",icon:"✅",path:"/dashboard/lab/certifications"},
  {name:"Reports",icon:"📊",path:"/dashboard/lab/reports"},
 ]

 function logout(){
  localStorage.removeItem("labId")
  router.push("/login")
 }

 return(

 <div className="min-h-screen bg-emerald-50 text-emerald-950 flex">

  {/* SIDEBAR */}

  <div className="w-72 bg-white border-r border-emerald-100 p-6 flex flex-col">

   <div className="mb-8">
    <h1 className="text-2xl font-bold text-emerald-900">
     🧪 HerbTracking
    </h1>
    <p className="text-xs uppercase tracking-[0.2em] text-emerald-600 mt-1">
     Lab Verification
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
      <span className="text-lg">{item.icon}</span>
      <span>{item.name}</span>
     </button>

     )

    })}

   </div>

   <button
    onClick={logout}
    className="w-full mt-auto mt-8 bg-emerald-600 hover:bg-emerald-700 text-white p-3 rounded-lg font-semibold"
   >
    Logout
   </button>

  </div>

  {/* MAIN CONTENT */}

  <div className="flex-1 p-8 overflow-auto">
   {children}
  </div>

 </div>

 )

}
