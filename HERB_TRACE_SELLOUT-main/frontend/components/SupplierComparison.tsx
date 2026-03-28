"use client"

import {
 Chart as ChartJS,
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
} from "chart.js"

import { Bar } from "react-chartjs-2"

ChartJS.register(
 CategoryScale,
 LinearScale,
 BarElement,
 Title,
 Tooltip,
 Legend
)

export default function SupplierComparison({data}:any){

 const labels = data?.length ? data.map((s:any)=>s.name) : ["No Suppliers"]

 const values = data?.length ? data.map((s:any)=>s.batches) : [0]

 const chartData={
  labels,
  datasets:[
   {
    label:"Batches Processed",
    data:values,
    backgroundColor:"#4ade80"
   }
  ]
 }

 const options={
  responsive:true,
  maintainAspectRatio:false
 }

 return(

 <div className="bg-[#083d34] p-6 rounded-xl">

  <h2 className="text-green-400 mb-4">
   Supplier Comparison
  </h2>

  <div className="h-[300px]">
   <Bar data={chartData} options={options}/>
  </div>

 </div>

 )

}