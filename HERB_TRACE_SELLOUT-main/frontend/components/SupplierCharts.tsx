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

export default function SupplierCharts({data}:any){

 const labels = data?.length ? data.map((d:any)=>d.herb) : ["No Data"]

 const values = data?.length ? data.map((d:any)=>d.quantity) : [0]

 const chartData={
  labels,
  datasets:[
   {
    label:"Herbs Processed (kg)",
    data:values,
    backgroundColor:"#22c55e"
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
   Herb Processing
  </h2>

  <div className="h-[300px]">
   <Bar data={chartData} options={options}/>
  </div>

 </div>

 )

}