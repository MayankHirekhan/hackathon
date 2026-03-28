"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

export default function ConsumerDashboard(){

const router = useRouter()

const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000"

const [consumer,setConsumer] = useState<any>(null)
const [history,setHistory] = useState<any[]>([])
const [loading,setLoading] = useState(true)

useEffect(()=>{

async function loadData(){

const id = localStorage.getItem("consumerId")

if(!id){
setLoading(false)
return
}

const res =
await fetch(`${API}/api/consumer/${id}`)

const data = await res.json()

setConsumer(data)

/* LOAD HISTORY */

const historyRes =
await fetch(`${API}/api/consumer/${id}/history`)

const historyData = await historyRes.json()

setHistory(historyData)

setLoading(false)

}

loadData()

},[])

if(loading){
return <div className="p-10 text-white">Loading...</div>
}

if(!consumer){
return(
<div className="p-10 text-red-400">
Consumer not logged in
</div>
)
}

return(

<div className="p-10 text-white space-y-8">

<h1 className="text-3xl text-green-400">
Consumer Dashboard
</h1>

{/* PROFILE CARD */}

<div className="bg-[#062c21] p-6 rounded-xl flex gap-6 items-center">

<img
src="/uploads/consumer-avatar.png"
className="w-20 h-20 rounded-full border-4 border-green-400"
/>

<div>

<h2 className="text-xl font-semibold">
{consumer.name}
</h2>

<p className="text-gray-300">{consumer.email}</p>
<p className="text-gray-400">{consumer.location}</p>

<div className="flex gap-6 mt-3 text-sm">

<p>Member ID: {consumer._id.slice(-6)}</p>
<p>Trust Score: ⭐ 4.8</p>
<p>Verified Products: {history.length}</p>

</div>

</div>

</div>

{/* QUICK ACTIONS */}

<div className="grid grid-cols-3 gap-6">

<button
onClick={()=>router.push("/dashboard/consumer/trace")}
className="bg-[#083d34] p-6 rounded-xl hover:bg-[#0b4f43]"
>
🔍 Scan / Verify Product
</button>

<button
onClick={()=>router.push("/dashboard/consumer/herbs")}
className="bg-[#083d34] p-6 rounded-xl hover:bg-[#0b4f43]"
>
🌿 Browse Herbs
</button>

<button
onClick={()=>router.push("/dashboard/consumer/feedback")}
className="bg-[#083d34] p-6 rounded-xl hover:bg-[#0b4f43]"
>
💬 Submit Feedback
</button>

</div>

{/* BLOCKCHAIN STATS */}

<div className="grid grid-cols-3 gap-6">

<div className="bg-[#062c21] p-6 rounded">

<p className="text-gray-400">Verified Products</p>
<h2 className="text-2xl">{history.length}</h2>

</div>

<div className="bg-[#062c21] p-6 rounded">

<p className="text-gray-400">Trusted Farmers</p>
<h2 className="text-2xl">12</h2>

</div>

<div className="bg-[#062c21] p-6 rounded">

<p className="text-gray-400">Fraud Alerts</p>
<h2 className="text-2xl text-red-400">0</h2>

</div>

</div>

{/* TRACE HISTORY */}

<div className="bg-[#062c21] p-6 rounded-xl">

<h2 className="text-xl mb-4">
Purchase / Verification History
</h2>

{history.length===0 &&(

<p className="text-gray-400">
No products verified yet
</p>

)}

<table className="w-full text-sm">

<thead>

<tr className="border-b border-green-700">

<th className="p-2 text-left">Herb</th>
<th className="p-2 text-left">Batch</th>
<th className="p-2 text-left">Farmer</th>
<th className="p-2 text-left">Supplier</th>
<th className="p-2 text-left">Verified On</th>

</tr>

</thead>

<tbody>

{history.map((item:any)=>(
<tr key={item._id} className="border-b border-green-900">

<td className="p-2">{item.herbName}</td>
<td className="p-2">{item.batchId}</td>
<td className="p-2">{item.farmer}</td>
<td className="p-2">{item.supplier}</td>
<td className="p-2">
{new Date(item.date).toLocaleDateString()}
</td>

</tr>
))}

</tbody>

</table>

</div>

</div>

)

}