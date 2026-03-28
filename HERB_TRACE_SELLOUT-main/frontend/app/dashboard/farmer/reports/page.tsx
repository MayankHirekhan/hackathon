"use client"

import { useEffect,useState } from "react"
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

export default function ReportsPage(){

const API = "http://localhost:5000"

const [farmer,setFarmer] = useState<any>(null)
const [production,setProduction] = useState<any>({})
const [region,setRegion] = useState<any>({})
const [demand,setDemand] = useState<any>(null)

useEffect(()=>{

const id = localStorage.getItem("farmerId")

if(!id) return

async function load(){

const farmerRes = await fetch(`${API}/api/farmer/${id}`)
const farmerData = await farmerRes.json()
setFarmer(farmerData)

const prod = await fetch(`${API}/api/production/${farmerData._id}`)
setProduction(await prod.json())

const reg = await fetch(`${API}/api/production/region/${farmerData.location}`)
setRegion(await reg.json())

const dem = await fetch(`${API}/api/analytics/demand`)
setDemand(await dem.json())

}

load()

},[])

if(!farmer){
return <div className="text-white p-10">Loading Reports...</div>
}

const herbChart={
labels:Object.keys(production.herbs || {}),
datasets:[
{
label:"Production (kg)",
data:Object.values(production.herbs || {}),
backgroundColor:"#22c55e"
}
]
}

const regionChart={
labels:Object.keys(region),
datasets:[
{
label:"Regional Production",
data:Object.values(region),
backgroundColor:"#4ade80"
}
]
}

return(

<div className="space-y-10 text-white">

<h1 className="text-3xl font-bold">
Farm Reports & Analytics
</h1>


<div className="bg-[#062c21] p-6 rounded">

<h3>Herb Cultivation</h3>

<div className="h-[300px]">
<Bar data={herbChart}/>
</div>

</div>


<div className="bg-[#062c21] p-6 rounded">

<h3>Regional Farmer Comparison</h3>

<div className="h-[300px]">
<Bar data={regionChart}/>
</div>

</div>


{demand && (

<div className="grid grid-cols-2 gap-6">

<div className="bg-[#062c21] p-6 rounded">

<p className="text-gray-400">Most Demanded Herb</p>

<p className="text-2xl text-green-400 font-bold">
{demand.mostDemanded?.[0] || "N/A"}
</p>

<p>{demand.mostDemanded?.[1] || 0} kg produced</p>

</div>


<div className="bg-[#062c21] p-6 rounded">

<p className="text-gray-400">Least Demanded Herb</p>

<p className="text-2xl text-yellow-400 font-bold">
{demand.leastDemanded?.[0] || "N/A"}
</p>

<p>{demand.leastDemanded?.[1] || 0} kg produced</p>

</div>

</div>

)}

</div>

)

}