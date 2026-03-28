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

<div className="p-10 text-white space-y-6">

<h1 className="text-3xl text-green-400">
Farmer Feedback
</h1>

<select
onChange={e=>selectBatch(e.target.value)}
className="p-3 bg-[#041f17]"
>

<option>Select Batch</option>

{batches.map(b=>(
<option key={b._id} value={b.batchId}>
{b.batchId} - {b.herbName}
</option>
))}

</select>

{batch &&(

<div className="bg-[#062c21] p-6 rounded-xl">

<p>Farmer: {batch.farmer}</p>
<p>Herb: {batch.herbName}</p>

<input
type="number"
min="1"
max="5"
value={rating}
onChange={e=>setRating(Number(e.target.value))}
className="p-2 bg-[#041f17] mt-3"
/>

<textarea
value={comment}
onChange={e=>setComment(e.target.value)}
placeholder="Write your review"
className="block mt-3 p-3 bg-[#041f17]"
/>

<button
onClick={submit}
className="bg-green-600 px-4 py-2 mt-4 rounded"
>
Submit Feedback
</button>

</div>

)}

</div>

)

}