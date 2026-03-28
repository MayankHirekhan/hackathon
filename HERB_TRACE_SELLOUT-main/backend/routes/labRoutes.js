const express = require("express")
const router = express.Router()

const Lab = require("../models/Lab")
const Batch = require("../models/Batch")
const { validateStatusChange } = require("../utils/statusTransitions")

/* ===============================
   LAB LOGIN
=============================== */

router.post("/lab/login", async(req,res)=>{

 try{

  const { email, password } = req.body

  if(!email || !password){

   return res.status(400).json({
    success:false,
    message:"Email and password required"
   })

  }

  const lab = await Lab.findOne({email})

  if(!lab){

   return res.status(404).json({
    success:false,
    message:"Lab not found"
   })

  }

  if(lab.password !== password){

   return res.status(401).json({
    success:false,
    message:"Invalid credentials"
   })

  }

  res.json({

   success:true,
   message:"Login successful",
   lab:{
    _id:lab._id,
    name:lab.name,
    email:lab.email,
    labName:lab.labName,
    certifications:lab.certifications,
    location:lab.location,
    experience:lab.experience,
    totalBatchesTested:lab.totalBatchesTested,
    rating:lab.rating,
    profilePhoto:lab.profilePhoto
   }

  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success:false,
   error:err.message
  })

 }

})

/* ===============================
   GET BATCHES FOR TESTING (LAB) - MUST BE BEFORE /:id ROUTE
=============================== */

router.get("/lab/testable-batches", async(req,res)=>{

 try{

  console.log("🧪 Fetching testable batches for lab...")

  /* GET ALL BATCHES FIRST TO DEBUG */
  const allBatches = await Batch.find().sort({createdAt: -1})
  console.log(`📊 Total batches in DB: ${allBatches.length}`)
  if(allBatches.length > 0){
   console.log(`Status breakdown:`, allBatches.map(b=>b.status).reduce((acc,s)=>{acc[s]=(acc[s]||0)+1; return acc}, {}))
  }

  /* GET BATCHES WITH STATUS "RECEIVED" OR "PROCESSING" AND labTested = false */
  const testableBatches = await Batch.find({
   $or: [
    {status: "received", labTested: {$ne: true}},
    {status: "processing", labTested: {$ne: true}}
   ]
  }).sort({createdAt: -1})

  console.log(`✅ Found ${testableBatches.length} batches ready for testing (status=received or processing)`)

  /* If none found, show processing batches too */
  let batches = testableBatches
  if(batches.length === 0){
   console.log("ℹ️ No 'received' batches, showing 'processing' batches instead...")
   batches = await Batch.find({
    status: "processing",
    labTested: {$ne: true}
   }).sort({createdAt: -1})
  }

  /* If still none, show all batches */
  if(batches.length === 0){
   console.log("ℹ️ No 'processing' batches, showing all batches for debugging...")
   batches = await Batch.find().sort({createdAt: -1}).limit(5)
  }

  const formattedBatches = batches.map(b=>({
   batchId: b.batchId,
   herbName: b.herbName,
   farmer: b.farmer,
   quantity: b.quantity,
   unit: b.unit,
   harvestDate: b.harvestDate,
   location: b.location,
   supplierId: b.supplierId,
   status: b.status,
   receivedDate: b.receivedDate,
   processingMethod: b.processingMethod,
   dryingTemperature: b.dryingTemperature,
   processingDuration: b.processingDuration
  }))

  res.json({
   success: true,
   count: formattedBatches.length,
   totalInDB: allBatches.length,
   batches: formattedBatches
  })

 }catch(err){

  console.error("❌ Error fetching testable batches:", err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

/* ===============================
   GET LAB PROFILE
=============================== */

router.get("/lab/:id", async(req,res)=>{

 try{

  const { id } = req.params

  const lab = await Lab.findById(id)

  if(!lab){

   return res.status(404).json({
    success:false,
    message:"Lab not found"
   })

  }

  res.json({
   success:true,
   lab
  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success:false,
   error:err.message
  })

 }

})

/* ===============================
   CREATE LAB
=============================== */

router.post("/labs", async(req,res)=>{

 try{

  const { name, email, password, labName, certifications, location, experience } = req.body

  const existingLab = await Lab.findOne({email})

  if(existingLab){

   return res.status(400).json({
    success:false,
    message:"Lab already exists"
   })

  }

  const lab = new Lab({
   name,
   email,
   password,
   labName,
   certifications,
   location,
   experience,
   totalBatchesTested:0
  })

  await lab.save()

  res.json({
   success:true,
   message:"Lab created successfully",
   lab
  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success:false,
   error:err.message
  })

 }

})

/* ===============================
   RECORD TEST RESULTS (LAB)
=============================== */

router.post("/lab/test-batch", async(req,res)=>{

 try{

  const { batchId, labId, labName, labResult, testDetails } = req.body

  console.log("📨 Received test-batch request:", {batchId, labId, labName, labResult, testDetails})

  // More detailed validation
  const missing = []
  if(!batchId) missing.push("batchId")
  if(!labId) missing.push("labId")
  if(!labResult) missing.push("labResult")

  if(missing.length > 0){
   console.error("❌ Missing fields:", missing)
   return res.status(400).json({
    success: false,
    message: `Missing required fields: ${missing.join(", ")}`,
    received: {batchId, labId, labName, labResult}
   })
  }

  const batch = await Batch.findOne({batchId})

  if(!batch){

   return res.status(404).json({
    success: false,
    message: `Batch ${batchId} not found`
   })

  }

  /* VALIDATE STATUS TRANSITION - "RECEIVED" or "PROCESSING" batches can be tested */

  if(batch.status !== "received" && batch.status !== "processing"){

   return res.status(400).json({
    success: false,
    message: `Batch cannot be tested with current status "${batch.status}". Only "received" or "processing" batches can be tested.`
   })

  }

  const transitionCheck = validateStatusChange(batch.status, "tested", "lab")

  if(!transitionCheck.valid){

   return res.status(400).json({
    success: false,
    message: transitionCheck.message
   })

  }

  /* UPDATE BATCH WITH LAB RESULTS */

  batch.labTested = true
  batch.labName = labName
  batch.labResult = labResult
  batch.testDetails = testDetails || ""
  batch.labTestDate = new Date()

  /* IF PASS, UPDATE STATUS TO TESTED */

  if(labResult.toUpperCase() === "PASS"){
   batch.status = "tested"
   console.log(`✅ Batch ${batchId} passed testing`)
  }else{
   console.log(`❌ Batch ${batchId} failed testing`)
  }

  await batch.save()

  /* UPDATE LAB STATS */

  if(labId){
   await Lab.findByIdAndUpdate(
    labId,
    { $inc: { totalBatchesTested: 1 } }
   )
  }

  res.json({
   success: true,
   message: `Test results recorded. Status: ${labResult}`,
   batch
  })

 }catch(err){

  console.error("❌ Error recording test results:", err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

module.exports = router
