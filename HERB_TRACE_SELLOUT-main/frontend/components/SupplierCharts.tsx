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
     backgroundColor:"#16a34a"
    }
   ]
  }

 const options={
  responsive:true,
  maintainAspectRatio:false
 }

  return(

  <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">

   <h2 className="text-emerald-900 font-semibold mb-4">
    Herb Processing (kg)
   </h2>

   <div className="h-[300px]">
    <Bar data={chartData} options={options}/>
   </div>

  </div>

  )

}
