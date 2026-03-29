"use client"

import { useEffect,useState } from "react"

export default function HerbsPage(){

const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000"

const [herbs,setHerbs] = useState<any[]>([])

useEffect(()=>{

fetch(`${API}/api/batches`)
.then(res=>res.json())
.then(setHerbs)

},[])

return(

<div className="space-y-6">

<div>
 <h1 className="text-3xl font-bold text-emerald-900">
  Available Herbs
 </h1>
 <p className="text-sm text-emerald-700">
  Explore verified batches ready for purchase.
 </p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

{herbs.map(h=>(
<div
key={h._id}
className="bg-white p-5 rounded-2xl border border-emerald-100 shadow-sm"
>

<p className="font-semibold text-emerald-900">
{h.herbName}
</p>

<p className="text-emerald-700 text-sm">Farmer: {h.farmer}</p>
<p className="text-emerald-600 text-sm">Location: {h.location}</p>
<p className="text-emerald-700 text-sm">Rating: ⭐ {h.rating}</p>

</div>
))}

</div>

</div>

)

}
