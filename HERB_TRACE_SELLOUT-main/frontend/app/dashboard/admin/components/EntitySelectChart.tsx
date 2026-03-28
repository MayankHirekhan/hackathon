"use client"

import { useState,useEffect } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

export default function EntitySelectChart(){

 const [type,setType]=useState("farmers")
 const [data,setData]=useState<any[]>([])

 useEffect(()=>{

 const url =
 type==="farmers"
 ? "http://localhost:5000/api/admin/farmers"
 : "http://localhost:5000/api/admin/suppliers"

 fetch(url)
 .then(res=>res.json())
 .then(setData)

 },[type])

 return(

 <div className="bg-[#062f27] p-6 rounded-lg">

 <div className="flex justify-between mb-4">

 <h2 className="text-xl">Comparison Chart</h2>

 <select
 value={type}
 onChange={(e)=>setType(e.target.value)}
 className="bg-[#041f1a] p-2 rounded"
 >

 <option value="farmers">Farmers</option>
 <option value="suppliers">Suppliers</option>

 </select>

 </div>

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={data}>

 <XAxis dataKey="name"/>
 <YAxis/>
 <Tooltip/>

 <Bar dataKey="totalHarvests" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 )

}