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

  <div className="mt-12 space-y-4">

  <h2 className="text-xl font-semibold text-emerald-900">Supplier Comparison</h2>

  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

  <ResponsiveContainer width="100%" height={300}>

  <BarChart data={data}>

  <XAxis dataKey="name"/>
  <YAxis/>
  <Tooltip/>
  <Bar dataKey="processed" fill="#16a34a"/>

  </BarChart>

  </ResponsiveContainer>

  </div>

  </div>

  )

}
