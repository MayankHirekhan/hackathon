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
 return <div className="text-white p-10">Loading...</div>
}

const herbs = herbStats?.herbs || {}

const herbChart={
 labels:Object.keys(herbs),
 datasets:[
  {
   label:"Production (kg)",
   data:Object.values(herbs),
   backgroundColor:"#22c55e"
  }
 ]
}

const regionChart={
 labels:Object.keys(regionStats),
 datasets:[
  {
   label:"Regional Production",
   data:Object.values(regionStats),
   backgroundColor:"#4ade80"
  }
 ]
}

return(

<div className="space-y-8 text-white">

{/* PROFILE */}

<div className="bg-[#062c21] p-6 rounded-xl flex gap-6">

<img
src={farmer.profilePhoto || "/default.png"}
className="w-24 h-24 rounded-full border-4 border-green-500"
/>

<div>

<h2 className="text-2xl font-bold">{farmer.name}</h2>

<div className="text-yellow-400">

{"⭐".repeat(Math.round(farmer.rating || 0))}

<span className="ml-2 text-gray-300">
({farmer.rating}/5)
</span>

</div>

</div>

</div>


{/* FARM INFO */}

<div className="grid grid-cols-4 gap-6">

<div className="bg-[#062c21] p-4 rounded">
Farm: {farmer.farmName}
</div>

<div className="bg-[#062c21] p-4 rounded">
Location: {farmer.location}
</div>

<div className="bg-[#062c21] p-4 rounded">
Experience: {farmer.experience} yrs
</div>

<div className="bg-[#062c21] p-4 rounded">
Total Harvests: {herbStats?.totalHarvests || 0}
</div>

</div>


{/* CHARTS */}

<div className="grid grid-cols-2 gap-6">

<div className="bg-[#062c21] p-6 rounded">

<h3>Herb Cultivation</h3>

<div className="h-[250px]">
<Bar data={herbChart}/>
</div>

</div>

<div className="bg-[#062c21] p-6 rounded">

<h3>Regional Farmer Comparison</h3>

<div className="h-[250px]">
<Bar data={regionChart}/>
</div>

</div>

</div>


{/* REVIEWS */}

<div className="bg-[#062c21] p-6 rounded-xl">

<h3 className="text-xl mb-4">Farmer Reviews</h3>

{farmer.reviews?.length === 0 && (
<p className="text-gray-400">No reviews yet</p>
)}

{farmer.reviews?.map((r:any,i:number)=>(
<div key={i} className="border-b border-green-800 pb-3 mb-3">

<p className="text-green-400">{r.user}</p>

<p className="text-yellow-400">
{"⭐".repeat(r.rating)}
</p>

<p className="text-gray-300">{r.comment}</p>

</div>
))}

</div>

</div>

)

}