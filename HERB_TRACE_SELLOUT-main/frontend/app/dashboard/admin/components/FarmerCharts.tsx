"use client"

import { useEffect,useState } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

export default function FarmerCharts(){

 const [farmer,setFarmer] = useState("")
 const [farmers,setFarmers] = useState<any[]>([])
 const [personal,setPersonal] = useState<any[]>([])
 const [comparison,setComparison] = useState<any[]>([])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/farmers")
 .then(res=>res.json())
 .then(data=>{
  setFarmers(data)
  if(data.length>0){
   setFarmer(data[0].name)
  }
 })

 fetch("http://localhost:5000/api/admin/farmers/comparison")
 .then(res=>res.json())
 .then(setComparison)

 },[])

 useEffect(()=>{

 if(!farmer) return

 fetch(`http://localhost:5000/api/admin/farmer/${farmer}/herbs`)
 .then(res=>res.json())
 .then(setPersonal)

 },[farmer])

 return(

 <div>

 <h2 className="text-xl mb-4">Farmer Analytics</h2>

 <select
 value={farmer}
 onChange={(e)=>setFarmer(e.target.value)}
 className="bg-[#041f1a] p-2 mb-4"
 >

 {farmers.map(f=>(
 <option key={f._id}>{f.name}</option>
 ))}

 </select>

 <div className="grid grid-cols-2 gap-6">

 {/* PERSONAL */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-2">Personal Harvest</h3>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={personal}>

 <XAxis dataKey="herb"/>
 <YAxis/>
 <Tooltip/>
 <Bar dataKey="quantity" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 {/* COMPARISON */}

 <div className="bg-[#062f27] p-6 rounded">

 <h3 className="mb-2">Farmer Comparison</h3>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={comparison}>

 <XAxis dataKey="name"/>
 <YAxis/>
 <Tooltip/>
 <Bar dataKey="totalHarvest" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 </div>

 </div>

 )

}