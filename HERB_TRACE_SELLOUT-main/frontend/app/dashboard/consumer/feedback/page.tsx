"use client"

import { useEffect,useState } from "react"

export default function FeedbackPage(){

const API =
process.env.NEXT_PUBLIC_API_URL ||
"http://localhost:5000"

const [batches,setBatches] = useState<any[]>([])
const [batch,setBatch] = useState<any>(null)

const [rating,setRating] = useState(5)
const [comment,setComment] = useState("")

useEffect(()=>{

fetch(`${API}/api/batches`)
.then(res=>res.json())
.then(setBatches)

},[])

async function selectBatch(id:any){

const res =
await fetch(`${API}/api/batch/${id}`)

const data = await res.json()

setBatch(data)

}

async function submit(){

await fetch(`${API}/api/farmer/review`,{

method:"POST",
headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({

farmerId:batch.farmerId,
user:"Consumer",
rating,
comment

})

})

alert("Feedback submitted")

}

return(

<div className="space-y-6">

<div>
 <h1 className="text-3xl font-bold text-emerald-900">
  Farmer Feedback
 </h1>
 <p className="text-sm text-emerald-700">
  Share your experience to help farmers improve quality.
 </p>
</div>

<select
onChange={e=>selectBatch(e.target.value)}
className="p-3 bg-white border border-emerald-200 rounded-xl text-emerald-900 max-w-md"
>

<option>Select Batch</option>

{batches.map(b=>(
<option key={b._id} value={b.batchId}>
{b.batchId} - {b.herbName}
</option>
))}

</select>

{batch &&(

<div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm space-y-4">

<div className="text-sm text-emerald-700 space-y-1">
 <p>Farmer: {batch.farmer}</p>
 <p>Herb: {batch.herbName}</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
 <div>
  <label className="text-xs font-semibold text-emerald-700">Rating (1-5)</label>
  <input
   type="number"
   min="1"
   max="5"
   value={rating}
   onChange={e=>setRating(Number(e.target.value))}
   className="mt-2 p-2 border border-emerald-200 rounded-lg w-full text-emerald-900"
  />
 </div>
</div>

<textarea
value={comment}
onChange={e=>setComment(e.target.value)}
placeholder="Write your review"
className="block mt-3 p-3 border border-emerald-200 rounded-lg w-full text-emerald-900"
/>

<button
onClick={submit}
className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-semibold"
>
Submit Feedback
</button>

</div>

)}

</div>

)

}
