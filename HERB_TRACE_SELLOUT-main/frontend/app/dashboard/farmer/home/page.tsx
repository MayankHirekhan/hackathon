"use client"

import { useEffect,useState } from "react"
import { useRouter } from "next/navigation"
import { Bar } from "react-chartjs-2"

import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
} from "chart.js"

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Tooltip,
 Legend
)

export default function FarmerHome(){

const router = useRouter()
const API = "http://localhost:5000"

const [farmer,setFarmer] = useState<any>(null)
const [herbStats,setHerbStats] = useState<any>(null)
const [regionStats,setRegionStats] = useState<any>({})

useEffect(()=>{

const id = localStorage.getItem("farmerId")

if(!id){
 router.push("/login/farmer")
 return
}

fetch(`${API}/api/farmer/${id}`)
.then(res=>res.json())
.then(data=>{

 setFarmer(data)

 fetch(`${API}/api/production/${data._id}`)
 .then(res=>res.json())
 .then(setHerbStats)

 fetch(`${API}/api/production/region/${data.location}`)
 .then(res=>res.json())
 .then(setRegionStats)

})

},[])

if(!farmer){
 return <div className="text-emerald-700 p-10">Loading...</div>
}

const herbs = herbStats?.herbs || {}

const herbChart={
 labels:Object.keys(herbs),
 datasets:[
  {
   label:"Production (kg)",
   data:Object.values(herbs),
   backgroundColor:"#16a34a"
  }
 ]
}

const regionChart={
 labels:Object.keys(regionStats),
 datasets:[
  {
   label:"Regional Production",
   data:Object.values(regionStats),
   backgroundColor:"#22c55e"
  }
 ]
}

return(

<div className="space-y-8">

{/* PROFILE */}

<div className="bg-white p-6 rounded-2xl flex gap-6 border border-emerald-100 shadow-sm">

<img
src={farmer.profilePhoto || "/default.png"}
className="w-24 h-24 rounded-full border-2 border-emerald-200"
/>

<div>

<h2 className="text-2xl font-semibold text-emerald-900">{farmer.name}</h2>

<div className="text-emerald-600 text-sm mt-1">

{"⭐".repeat(Math.round(farmer.rating || 0))}

<span className="ml-2 text-emerald-700">
({farmer.rating}/5)
</span>

</div>

</div>

</div>


{/* FARM INFO */}

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

<div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-xs text-emerald-600">Farm</p>
 <p className="text-emerald-900 font-semibold mt-2">{farmer.farmName}</p>
</div>

<div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-xs text-emerald-600">Location</p>
 <p className="text-emerald-900 font-semibold mt-2">{farmer.location}</p>
</div>

<div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-xs text-emerald-600">Experience</p>
 <p className="text-emerald-900 font-semibold mt-2">{farmer.experience} yrs</p>
</div>

<div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm">
 <p className="text-xs text-emerald-600">Total Harvests</p>
 <p className="text-emerald-900 font-semibold mt-2">{herbStats?.totalHarvests || 0}</p>
</div>

</div>


{/* CHARTS */}

<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h3 className="font-semibold text-emerald-900 mb-3">Herb Cultivation</h3>

<div className="h-[250px]">
<Bar data={herbChart}/>
</div>

</div>

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h3 className="font-semibold text-emerald-900 mb-3">Regional Farmer Comparison</h3>

<div className="h-[250px]">
<Bar data={regionChart}/>
</div>

</div>

</div>


{/* REVIEWS */}

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

<h3 className="text-xl font-semibold text-emerald-900 mb-4">Farmer Reviews</h3>

{farmer.reviews?.length === 0 && (
<p className="text-emerald-600">No reviews yet</p>
)}

{farmer.reviews?.map((r:any,i:number)=>(
<div key={i} className="border-b border-emerald-100 pb-3 mb-3">

<p className="text-emerald-900 font-semibold">{r.user}</p>

<p className="text-emerald-600">
{"⭐".repeat(r.rating)}
</p>

<p className="text-emerald-700">{r.comment}</p>

</div>
))}

</div>

</div>

)

}
