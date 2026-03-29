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

 <div className="min-h-screen bg-emerald-50 flex items-center justify-center px-6">

  <div className="w-full max-w-md bg-white border border-emerald-100 rounded-3xl p-8 shadow-sm">

   <div className="flex items-center gap-3 mb-6">
    <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-700">
     🧪
    </div>
    <div>
     <p className="text-xs uppercase tracking-[0.2em] text-emerald-600">Lab Login</p>
     <h1 className="text-2xl font-bold text-emerald-900">HerbTracking</h1>
    </div>
   </div>

   <p className="text-sm text-emerald-700 mb-6">
    Verify quality reports, contaminants, and certifications aligned with Indian standards.
   </p>

   <input 
    placeholder="Email"
    value={email}
    onChange={(e)=>setEmail(e.target.value)}
    className="w-full p-3 mb-4 rounded-xl border border-emerald-200 text-emerald-900" 
   />

   <input 
    type="password" 
    placeholder="Password"
    value={password}
    onChange={(e)=>setPassword(e.target.value)}
    className="w-full p-3 mb-4 rounded-xl border border-emerald-200 text-emerald-900" 
   />

   {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

   <button
    onClick={handleLogin}
    disabled={loading}
    className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white p-3 rounded-xl font-semibold"
   >
    {loading ? "Logging in..." : "Login"}
   </button>

   <button
    onClick={() => router.push("/login")}
    className="mt-3 w-full border border-emerald-200 text-emerald-700 py-2 rounded-xl text-sm font-semibold"
   >
    Back to role selection
   </button>

  </div>

 </div>

 )

}
