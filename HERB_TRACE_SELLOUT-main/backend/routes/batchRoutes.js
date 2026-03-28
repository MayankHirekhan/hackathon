const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Farmer = require("../models/Farmer")

/* ==========================
   GET ALL BATCHES
========================== */

router.get("/batches", async (req,res)=>{

 try{

  const batches = await Batch
   .find()
   .sort({createdAt:-1})

  res.json(batches)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ==========================
   GET FARMER BATCHES (FIXED)
========================== */

router.get("/batches/farmer/:farmerId", async(req,res)=>{

 try{

  const farmerId = req.params.farmerId
  let farmer = null

  try{
   farmer = await Farmer.findById(farmerId)

   if(!farmer){
    return res.status(404).json({
     error:"Farmer not found"
    })
   }
  }catch(err){
   return res.status(400).json({
    error:"Invalid farmer ID format"
   })
  }

  const query = { farmerId: farmerId }

  const batches = await Batch.find(query).sort({createdAt:-1})

  res.json(batches)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ==========================
   CREATE BATCH (BLOCKCHAIN)
========================== */

router.post("/batches", async (req,res)=>{

 try{

  const {farmerId, herbName, quantity, harvestDate, location, latitude, longitude} = req.body

  let farmer = null

  /* Fetch farmer if provided */
  if(farmerId){
   try{
    farmer = await Farmer.findById(farmerId)
   }catch(err){
    /* Invalid ObjectId - use basic info */
    console.warn("Invalid farmerId format:", farmerId)
   }
  }

  /* GENERATE BATCH ID */

  const count = await Batch.countDocuments()

  const batchId =
   "HB-" + (count+1).toString().padStart(4,"0")


  /* GET PREVIOUS BLOCK */

  const lastBlock = await Batch
   .findOne()
   .sort({createdAt:-1})

  const previousHash =
   lastBlock ? lastBlock.hash : "GENESIS"


  /* GOOGLE MAP IMAGE */

  const lat = latitude || 0
  const lon = longitude || 0

  const geoImage =
  `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lon}&zoom=15&size=600x300&markers=color:red%7C${lat},${lon}`


  /* CREATE BLOCK */

  const batch = new Batch({

   batchId,

   herbName: herbName || "Unknown",

   farmer: farmer ? farmer.name : "Unknown Farmer",

   farmerId: farmer ? farmer._id.toString() : farmerId || "N/A",

   quantity: quantity || 0,

   unit:"kg",

   harvestDate: harvestDate || new Date(),

   location: location || "Unknown",

   latitude:lat,

   longitude:lon,

   geoImage,

   profilePhoto: farmer ? farmer.profilePhoto : "",

   rating: farmer ? farmer.rating : 0,

   previousHash

  })


  /* GENERATE HASH */

  batch.hash = batch.generateHash()


  /* SAVE BLOCK */

  await batch.save()


  /* UPDATE FARMER STATS */
  
  if(farmerId){
   try{
    await Farmer.findByIdAndUpdate(
     farmerId,
     {
      $inc:{totalHarvests:1}
     }
    )
   }catch(err){
    console.warn("Could not update farmer stats:", err.message)
   }
  }


  res.json(batch)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ==========================
   TRACE SINGLE BATCH
========================== */

router.get("/batch/:batchId", async(req,res)=>{

 try{

  const batch = await Batch.findOne({
   batchId:req.params.batchId
  })

  if(!batch){

   return res.status(404).json({
    error:"Batch not found"
   })

  }

  res.json(batch)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ==========================
   VERIFY BLOCKCHAIN CHAIN
========================== */

router.get("/blockchain/verify", async(req,res)=>{

 try{

  const blocks = await Batch
   .find()
   .sort({createdAt:1})

  for(let i=1;i<blocks.length;i++){

   const current = blocks[i]
   const previous = blocks[i-1]

   if(current.previousHash !== previous.hash){

    return res.json({
     valid:false,
     message:"Blockchain chain broken",
     block:current.batchId
    })

   }

   const recalculatedHash =
    current.generateHash()

   if(current.hash !== recalculatedHash){

    return res.json({
     valid:false,
     message:"Hash mismatch detected",
     block:current.batchId
    })

   }

  }

  res.json({
   valid:true,
   message:"Blockchain integrity verified"
  })

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ==========================
   RECEIVE BATCH
========================== */

router.post("/batch/receive", async(req,res)=>{

 try{

  const {qrData} = req.body

  const batch = await Batch.findOne({
   batchId:qrData
  })

  if(!batch){

   return res.status(404).json({
    message:"Batch not found"
   })

  }

  batch.status = "received"

  await batch.save()

  res.json(batch)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})

/* UPDATE BATCH TO PROCESSING */
router.put("/batches/:batchId/process", async(req,res)=>{
 try{
  const {batchId} = req.params
  const {processingMethod, dryingTemperature, processingDuration} = req.body

  const batch = await Batch.findOne({batchId})

  if(!batch){
   return res.status(404).json({success:false, message:"Batch not found"})
  }

  batch.status = "processing"
  batch.processingMethod = processingMethod
  batch.dryingTemperature = dryingTemperature
  batch.processingDuration = processingDuration
  batch.processedAt = new Date()

  await batch.save()

  res.json({success:true, message:"Batch updated to processing", batch})
 }
 catch(err){
  res.status(500).json({success:false, error:err.message})
 }
})

/* UPDATE BATCH TO PACKAGED */
router.put("/batches/:batchId/package", async(req,res)=>{
 try{
  const {batchId} = req.params

  const batch = await Batch.findOne({batchId})

  if(!batch){
   return res.status(404).json({success:false, message:"Batch not found"})
  }

  if(batch.status !== "tested"){
   return res.status(400).json({success:false, message:`Batch must be "tested" to package. Current status: ${batch.status}`})
  }

  batch.status = "packaged"
  batch.packagedAt = new Date()

  await batch.save()

  res.json({success:true, message:"Batch marked as packaged", batch})
 }
 catch(err){
  res.status(500).json({success:false, error:err.message})
 }
})

module.exports = router