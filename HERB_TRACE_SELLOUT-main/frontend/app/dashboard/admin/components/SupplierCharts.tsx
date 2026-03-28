"use client"

import { useEffect,useState } from "react"
import { BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer } from "recharts"

export default function SupplierCharts(){

 const [data,setData]=useState<any[]>([])

 useEffect(()=>{

 fetch("http://localhost:5000/api/admin/suppliers/comparison")
 .then(res=>res.json())
 .then(setData)

 },[])

 return(

 <div className="mt-12">

 <h2 className="text-xl mb-4">Supplier Comparison</h2>

 <div className="bg-[#062f27] p-6 rounded">

 <ResponsiveContainer width="100%" height={300}>

 <BarChart data={data}>

 <XAxis dataKey="name"/>
 <YAxis/>
 <Tooltip/>
 <Bar dataKey="processed" fill="#22c55e"/>

 </BarChart>

 </ResponsiveContainer>

 </div>

 </div>

 )

}