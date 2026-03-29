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

const historyRes =
await fetch(`${API}/api/consumer/${id}/history`)

const historyData = await historyRes.json()

setHistory(historyData)

setLoading(false)

}

loadData()

},[])

if(loading){
return <div className="p-10 text-emerald-700">Loading...</div>
}

if(!consumer){
return(
<div className="p-10 text-red-500">
Consumer not logged in
</div>
)
}

return(

<div className="space-y-8">

<div>
 <h1 className="text-3xl font-bold text-emerald-900">
  Consumer Dashboard
 </h1>
 <p className="text-sm text-emerald-700">
  Track verified herbs and build trust in every purchase.
 </p>
</div>

<div className="bg-white p-6 rounded-2xl flex flex-wrap gap-6 items-center border border-emerald-100 shadow-sm">

<img
src="/uploads/consumer-avatar.png"
className="w-20 h-20 rounded-full border-2 border-emerald-200"
/>

<div>

<h2 className="text-xl font-semibold text-emerald-900">
{consumer.name}
</h2>

<p className="text-emerald-700">{consumer.email}</p>
<p className="text-emerald-600">{consumer.location}</p>

<div className="flex flex-wrap gap-6 mt-3 text-sm text-emerald-700">

<p>Member ID: {consumer._id.slice(-6)}</p>
<p>Trust Score: ⭐ 4.8</p>
<p>Verified Products: {history.length}</p>

</div>

</div>

</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<button
onClick={()=>router.push("/dashboard/consumer/trace")}
className="bg-white border border-emerald-100 p-6 rounded-2xl hover:bg-emerald-50 text-left shadow-sm"
>
<p className="text-lg font-semibold text-emerald-900">🔍 Scan / Verify Product</p>
<p className="text-sm text-emerald-600 mt-2">Check authenticity instantly.</p>
</button>

<button
onClick={()=>router.push("/dashboard/consumer/herbs")}
className="bg-white border border-emerald-100 p-6 rounded-2xl hover:bg-emerald-50 text-left shadow-sm"
>
<p className="text-lg font-semibold text-emerald-900">🌿 Browse Herbs</p>
<p className="text-sm text-emerald-600 mt-2">Explore certified herbs.</p>
</button>

<button
onClick={()=>router.push("/dashboard/consumer/feedback")}
className="bg-white border border-emerald-100 p-6 rounded-2xl hover:bg-emerald-50 text-left shadow-sm"
>
<p className="text-lg font-semibold text-emerald-900">💬 Submit Feedback</p>
<p className="text-sm text-emerald-600 mt-2">Share your experience.</p>
</button>

</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-6">

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<p className="text-emerald-600">Verified Products</p>
<h2 className="text-2xl font-semibold text-emerald-900">{history.length}</h2>

</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<p className="text-emerald-600">Trusted Farmers</p>
<h2 className="text-2xl font-semibold text-emerald-900">12</h2>

</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<p className="text-emerald-600">Fraud Alerts</p>
<h2 className="text-2xl font-semibold text-emerald-900">0</h2>

</div>

</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h2 className="text-xl font-semibold text-emerald-900 mb-4">
Purchase / Verification History
</h2>

{history.length===0 &&(

<p className="text-emerald-600">
No products verified yet
</p>

)}

<table className="w-full text-sm">

<thead>

<tr className="border-b border-emerald-100 text-emerald-700 text-left">

<th className="p-2">Herb</th>
<th className="p-2">Batch</th>
<th className="p-2">Farmer</th>
<th className="p-2">Supplier</th>
<th className="p-2">Verified On</th>

</tr>

</thead>

<tbody>

{history.map((item:any)=>(
<tr key={item._id} className="border-b border-emerald-50">

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
