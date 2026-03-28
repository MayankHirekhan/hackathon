"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function Home(){

 const router = useRouter()

 useEffect(()=>{

  router.replace("/login")

 },[])

 return(

  <div className="min-h-screen bg-[#041f17] text-white flex items-center justify-center">

   <div className="text-center">

    <h1 className="text-4xl font-bold text-green-400">
     🌿 HerbTrace
    </h1>

    <p className="text-gray-400 mt-4">
     Launching Secure Herbal Supply Chain...
    </p>

   </div>

  </div>

 )

} 