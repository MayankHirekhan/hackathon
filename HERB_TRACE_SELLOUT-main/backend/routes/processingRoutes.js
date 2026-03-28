const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Farmer = require("../models/Farmer")

/* ===============================
   CREATE PROCESSING BATCH
=============================== */

router.post("/processing/create", async (req,res)=>{

try{

const {
herbName,
farmerName,
quantity,
temperature,
duration,
method,
yieldPercent,
waste,
latitude,
longitude
} = req.body

/* ===============================
VALIDATION
=============================== */

if(!herbName || !farmerName || !quantity){

return res.status(400).json({
success:false,
message:"Herb, Farmer and Quantity are required"
})

}

/* ===============================
FIND FARMER
=============================== */

const farmer = await Farmer.findOne({ name: farmerName })

if(!farmer){

return res.status(404).json({
success:false,
message:"Farmer not found"
})

}

/* ===============================
GENERATE BATCH ID
=============================== */

const count = await Batch.countDocuments()

const batchId =
"HB-" + (count+1).toString().padStart(4,"0")

/* ===============================
PREVIOUS HASH
=============================== */

const lastBatch = await Batch
.findOne()
.sort({createdAt:-1})

const previousHash =
lastBatch ? lastBatch.hash : "GENESIS"

/* ===============================
GOOGLE MAP IMAGE
=============================== */

let geoImage=""

if(latitude && longitude){

geoImage =
`https://maps.googleapis.com/maps/api/staticmap?center=${latitude},${longitude}&zoom=15&size=600x300&markers=color:red%7C${latitude},${longitude}`

}

/* ===============================
CREATE BATCH
=============================== */

const batch = new Batch({

batchId,

herbName,

farmer:farmerName,
farmerId:farmer._id,

quantity,
unit:"kg",

harvestDate:new Date(),

location:"Supplier Processing Facility",

latitude,
longitude,
geoImage,

processingMethod:method,
dryingTemperature:temperature,
processingDuration:duration,

previousHash

})

/* ===============================
GENERATE HASH
=============================== */

batch.hash = batch.generateHash()

await batch.save()

/* ===============================
SUCCESS RESPONSE
=============================== */

res.status(201).json({

success:true,
message:"Batch created successfully",
batch

})

}catch(err){

console.error("Processing error:",err)

res.status(500).json({
success:false,
error:err.message
})

}

})

module.exports = router