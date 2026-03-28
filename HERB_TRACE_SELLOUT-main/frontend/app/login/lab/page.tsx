"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

export default function LabLogin(){

 const router = useRouter()
 const [email, setEmail] = useState("")
 const [password, setPassword] = useState("")
 const [error, setError] = useState("")
 const [loading, setLoading] = useState(false)

 const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

 async function handleLogin(){

  setLoading(true)
  setError("")

  try{

   const res = await fetch(`${API}/api/lab/login`, {
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({email, password})
   })

   const data = await res.json()

   if(data.success){

    localStorage.setItem("labId", data.lab._id)
    localStorage.setItem("labName", data.lab.name)
    router.push("/dashboard/lab")

   }else{

    setError(data.message || "Login failed")

   }

  }catch(err){

   console.error(err)
   setError("Connection error. Please try again.")

  }finally{

   setLoading(false)

  }

 }

 return(

 <div className="min-h-screen bg-[#041f17] flex items-center justify-center text-white">

  <div className="relative border border-[#134e3a] rounded-3xl p-12 w-[420px] bg-[#062c21]">

   <h1 className="text-3xl font-bold text-center mb-8">
    🧪 Lab Tester Login
   </h1>

   <input 
    placeholder="Email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    className="w-full p-3 mb-4 rounded bg-[#041f17] border border-[#134e3a]" 
   />

   <input 
    type="password" 
    placeholder="Password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    className="w-full p-3 mb-6 rounded bg-[#041f17] border border-[#134e3a]" 
   />

   {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

   <button
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-green-400 hover:bg-green-300 disabled:bg-gray-500 text-black p-3 rounded font-semibold"
   >
    {loading ? "Logging in..." : "Login"}
   </button>

  </div>

 </div>

 )

}