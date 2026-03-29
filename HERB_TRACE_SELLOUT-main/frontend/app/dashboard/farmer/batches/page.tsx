"use client"

import { useState } from "react"
import DatePickerField from "@/components/DatePickerField"

export default function CreateHarvest(){

 const [herbName,setHerbName] = useState("")
 const [quantity,setQuantity] = useState("")
 const [harvestDate,setHarvestDate] = useState("")

 const [latitude,setLatitude] = useState<number | null>(null)
 const [longitude,setLongitude] = useState<number | null>(null)

 const [geoImage,setGeoImage] = useState<string | null>(null)

 const API = process.env.NEXT_PUBLIC_API_URL


 const herbImage =
  herbName ? `/herbs/${herbName.toLowerCase()}.jpg` : null


 const detectLocation = () => {

  if(!navigator.geolocation){
   alert("Geolocation not supported")
   return
  }

  navigator.geolocation.getCurrentPosition(

   (position)=>{

    const lat = position.coords.latitude
    const lon = position.coords.longitude

    setLatitude(lat)
    setLongitude(lon)

    const map =
    `https://static.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=600x300&markers=${lat},${lon},red-pushpin`

    setGeoImage(map)

   },

   ()=>{
    alert("Please allow GPS permission")
   }

  )

 }


 const createBatch = async () => {

  const farmerId = localStorage.getItem("farmerId")

  if(!latitude || !longitude){
   alert("Please detect farm location first")
   return
  }

  const res = await fetch(`${API}/api/batches`,{

   method:"POST",

   headers:{
    "Content-Type":"application/json"
   },

   body:JSON.stringify({

    herbName,
    quantity,
    harvestDate,
    farmerId,

    latitude,
    longitude,

    geoImage

   })

  })

  const data = await res.json()

  alert("Harvest batch created successfully")

  console.log(data)

 }


 return(

 <div className="max-w-2xl mx-auto bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 space-y-6">

 <h1 className="text-3xl font-bold text-center text-emerald-900">
 Create Harvest Batch
 </h1>

 <p className="text-center text-sm text-emerald-700">
 Record fresh harvests with geo-tagged details for complete farm transparency.
 </p>


 <div className="space-y-2">

 <label className="text-sm font-semibold text-emerald-700">
 Select Herb
 </label>

 <select
 className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900"
 value={herbName}
 onChange={(e)=>setHerbName(e.target.value)}
 >

 <option value="">Choose Herb</option>

 <option value="Tulsi">Tulsi</option>
 <option value="Neem">Neem</option>
 <option value="Mint">Mint</option>
 <option value="Brahmi">Brahmi</option>
 <option value="Turmeric">Turmeric</option>
 <option value="Ashwagandha">Ashwagandha</option>

 </select>

 </div>


 {herbImage &&(

 <div className="bg-emerald-50 p-3 rounded-2xl border border-emerald-100">

 <img
 src={herbImage}
 className="w-full h-44 object-cover rounded-xl"
 />

 </div>

 )}


 <div className="space-y-2">

 <label className="text-sm font-semibold text-emerald-700">
 Quantity (kg)
 </label>

 <input
 type="number"
 className="w-full p-3 rounded-xl bg-white border border-emerald-200 text-emerald-900"
 placeholder="Enter quantity"
 value={quantity}
 onChange={e=>setQuantity(e.target.value)}
 />

 </div>


 <DatePickerField
  label="Harvest Date"
  value={harvestDate}
  onChange={(date) => setHarvestDate(date)}
 />


 <button
 onClick={detectLocation}
 className="w-full bg-emerald-600 hover:bg-emerald-700 transition p-3 rounded-xl font-semibold text-white"
 >
 Detect Farm GPS Location
 </button>


 {(latitude && longitude) &&(

 <div className="bg-emerald-50 p-4 rounded-2xl space-y-3 border border-emerald-100">

 <div className="bg-white p-3 rounded-xl border border-emerald-200">
  <p className="text-emerald-700 font-semibold text-sm mb-2">📍 GPS Coordinates</p>
  <p className="text-emerald-900 text-sm">Latitude: <b>{latitude.toFixed(6)}</b></p>
  <p className="text-emerald-900 text-sm">Longitude: <b>{longitude.toFixed(6)}</b></p>
 </div>

 <p className="text-emerald-700 text-sm font-semibold">🗺️ Farm GPS Location</p>

 {geoImage && (
  <img
   src={geoImage}
   className="rounded-xl w-full border border-emerald-200"
  />
 )}

 </div>

 )}


 <button
 onClick={createBatch}
 className="w-full bg-emerald-800 hover:bg-emerald-900 transition p-3 rounded-xl font-semibold text-white"
 >
 Create Harvest Batch
 </button>


 </div>

 )

}
