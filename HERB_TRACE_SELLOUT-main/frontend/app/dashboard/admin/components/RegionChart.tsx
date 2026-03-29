"use client"

import { useEffect,useState } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

export default function RegionChart(){

 const [data,setData]=useState<any[]>([])

 useEffect(()=>{

 fetch("http://localhost:5000/api/analytics/herbs")
 .then(res=>res.json())
 .then(data=>setData(data))

 },[])

  return(

  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

  <h2 className="text-xl font-semibold text-emerald-900 mb-4">Herb Production by Region</h2>

  <ResponsiveContainer width="100%" height={300}>

  <BarChart data={data}>

  <XAxis dataKey="herb"/>
  <YAxis/>
  <Tooltip/>

  <Bar dataKey="quantity" fill="#16a34a"/>

  </BarChart>

  </ResponsiveContainer>

  </div>

  )

}
