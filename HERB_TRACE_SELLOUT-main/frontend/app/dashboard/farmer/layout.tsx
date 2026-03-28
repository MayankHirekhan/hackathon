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

 <div className="min-h-screen bg-[#041f17] text-white flex">

  {/* SIDEBAR */}

  <div className="w-64 bg-[#062c21] border-r border-[#134e3a] p-6">

   <h1 className="text-2xl font-bold mb-10 text-green-400">
    🌿 HerbTrace
   </h1>

   <div className="space-y-2">

    {menu.map((item,index)=>{

     const active = pathname === item.path

     return(

     <button
      key={index}
      onClick={()=>router.push(item.path)}
      className={`w-full flex items-center gap-3 p-3 rounded-lg transition
      ${active ? "bg-[#0b3d2f] text-green-400" : "hover:bg-[#0b3d2f]"}`}
     >

      <span>{item.icon}</span>
      <span>{item.name}</span>

     </button>

     )

    })}

   </div>

  </div>

  {/* MAIN AREA */}

  <div className="flex-1 flex flex-col">

   {/* TOP BAR */}

   <div className="flex justify-end items-center p-4 border-b border-[#134e3a]">

    <button
     onClick={logout}
     className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
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