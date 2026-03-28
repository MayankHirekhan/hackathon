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
      <span className="text-lg">{item.icon}</span>
      <span>{item.name}</span>
     </button>

     )

    })}

   </div>

   <button
    onClick={logout}
    className="w-full mt-auto mt-8 bg-red-600 hover:bg-red-700 p-3 rounded-lg"
   >
    🚪 Logout
   </button>

  </div>

  {/* MAIN CONTENT */}

  <div className="flex-1 p-8 overflow-auto">
   {children}
  </div>

 </div>

 )

}
