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

<div className="p-10 text-white">

<h1 className="text-3xl text-green-400 mb-6">
Available Herbs
</h1>

<div className="grid grid-cols-4 gap-6">

{herbs.map(h=>(
<div
key={h._id}
className="bg-[#083d34] p-5 rounded-xl"
>

<p className="font-semibold">
{h.herbName}
</p>

<p>Farmer: {h.farmer}</p>
<p>Location: {h.location}</p>
<p>Rating: ⭐ {h.rating}</p>

</div>
))}

</div>

</div>

)

}