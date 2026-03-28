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

 <div className="bg-[#062f27] p-6 rounded-lg">

 <h2 className="text-xl mb-4">Herb Production</h2>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={data}>

 <XAxis dataKey="herb"/>
 <YAxis/>
 <Tooltip/>

 <Bar dataKey="quantity" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 )

}