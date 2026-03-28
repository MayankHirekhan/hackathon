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


/* ======================
   HERB IMAGE
====================== */

 const herbImage =
  herbName ? `/herbs/${herbName.toLowerCase()}.jpg` : null


/* ======================
   DETECT FARM LOCATION
====================== */

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

    /* OPENSTREETMAP IMAGE (FREE - NO API KEY NEEDED) */

    const map =
    `https://static.openstreetmap.de/staticmap.php?center=${lat},${lon}&zoom=15&size=600x300&markers=${lat},${lon},red-pushpin`

    setGeoImage(map)

   },

   ()=>{
    alert("Please allow GPS permission")
   }

  )

 }


/* ======================
   CREATE BATCH
====================== */

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

 <div className="max-w-2xl mx-auto mt-10 bg-[#062c21] p-8 rounded-xl shadow-xl space-y-6">

 <h1 className="text-3xl font-bold text-center text-green-400">
 Create Harvest Batch
 </h1>


{/* ======================
   HERB SELECT
====================== */}

 <div className="space-y-2">

 <label className="text-sm text-gray-300">
 Select Herb
 </label>

 <select
 className="w-full p-3 rounded bg-[#041f17] border border-green-700"
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


{/* ======================
   HERB IMAGE
====================== */}

 {herbImage &&(

 <div className="bg-[#041f17] p-3 rounded-lg">

 <img
 src={herbImage}
 className="w-full h-44 object-cover rounded"
 />

 </div>

 )}


{/* ======================
   QUANTITY
====================== */}

 <div className="space-y-2">

 <label className="text-sm text-gray-300">
 Quantity (kg)
 </label>

 <input
 type="number"
 className="w-full p-3 rounded bg-[#041f17] border border-green-700"
 placeholder="Enter quantity"
 value={quantity}
 onChange={e=>setQuantity(e.target.value)}
 />

 </div>


{/* ======================
   HARVEST DATE
====================== */}

 <DatePickerField
  label="Harvest Date"
  value={harvestDate}
  onChange={(date) => setHarvestDate(date)}
 />


 <button
 onClick={detectLocation}
 className="w-full bg-green-600 hover:bg-green-700 transition p-3 rounded font-semibold"
 >
 Detect Farm GPS Location
 </button>


{/* ======================
   COORDINATES & MAP PREVIEW
====================== */}

 {(latitude && longitude) &&(

 <div className="bg-[#041f17] p-4 rounded-lg space-y-3">

 <div className="bg-[#062c21] p-3 rounded border border-green-600">
  <p className="text-green-400 font-semibold text-sm mb-2">📍 GPS Coordinates</p>
  <p className="text-white text-sm">Latitude: <b>{latitude.toFixed(6)}</b></p>
  <p className="text-white text-sm">Longitude: <b>{longitude.toFixed(6)}</b></p>
 </div>

 <p className="text-green-400 text-sm font-semibold">🗺️ Farm GPS Location</p>

 {geoImage && (
  <img
   src={geoImage}
   className="rounded-lg w-full border border-green-600"
  />
 )}

 </div>

 )}


{/* ======================
   CREATE BATCH
====================== */}

 <button
 onClick={createBatch}
 className="w-full bg-blue-600 hover:bg-blue-700 transition p-3 rounded font-semibold"
 >
 Create Harvest Batch
 </button>


 </div>

 )

}