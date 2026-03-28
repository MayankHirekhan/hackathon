const express = require("express")
const router = express.Router()

const Supplier = require("../models/Supplier")
const Batch = require("../models/Batch")
const SupplierBatch = require("../models/SupplierBatch")

/* ===============================
   SUPPLIER LOGIN
=============================== */

router.post("/supplier/login", async(req,res)=>{

 try{

 const { email,password } = req.body

 let supplier = await Supplier.findOne({ email })

 if(!supplier){

  supplier = new Supplier({

   name: email.split("@")[0],
   email,
   password,

   companyName:"Herbal Distributor",

   licenseNumber:"LIC-"+Date.now(),

   location:"Tamil Nadu",

   experience:1,

   phone:"0000000000",

   totalBatchesReceived:0,
   processedHerbs:0,
   inventoryStock:0

  })

  await supplier.save()

 }

 if(supplier.password !== password){

  return res.status(401).json({
   message:"Invalid password"
  })

 }

 res.json({

  message:"Login successful",

  supplierId:supplier._id,
  name:supplier.name

 })

 }
 catch(err){

 res.status(500).json({error:err.message})

 }

})


/* ===============================
   GET SUPPLIER PROFILE
=============================== */

router.get("/supplier/:id", async(req,res)=>{

 try{

  const supplier = await Supplier.findById(req.params.id)

  if(!supplier){
   return res.status(404).json({message:"Supplier not found"})
  }

  res.json(supplier)

 }catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ===============================
   VERIFY FARMER BATCH
=============================== */

router.get("/supplier/verify/:batchId", async(req,res)=>{

 const batch = await Batch.findOne({batchId:req.params.batchId})

 if(!batch){
  return res.status(404).json({message:"Batch not found"})
 }

 res.json(batch)

})


/* ===============================
   APPROVE BATCH
=============================== */

router.post("/supplier/approve", async(req,res)=>{

 try{

 const { batchId, supplierId } = req.body

 const batch = await Batch.findOne({batchId})

 if(!batch){
  return res.status(404).json({message:"Batch not found"})
 }

 const supplier = await Supplier.findById(supplierId)

 if(!supplier){
  return res.status(404).json({message:"Supplier not found"})
 }

 /* SAVE SUPPLIER BATCH */

 const supplierBatch = new SupplierBatch({

  batchId:batch.batchId,
  herbName:batch.herbName,
  farmer:batch.farmer,
  quantity:batch.quantity,
  unit:batch.unit,
  harvestDate:batch.harvestDate,
  location:batch.location,
  supplierId:supplierId

 })

 await supplierBatch.save()


 /* UPDATE SUPPLIER STATS */

 supplier.totalBatchesReceived += 1
 supplier.processedHerbs += batch.quantity
 supplier.inventoryStock += batch.quantity

 await supplier.save()

 res.json({
  message:"Batch approved and inventory updated"
 })

 }catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ===============================
   GET SUPPLIER BATCHES
=============================== */

router.get("/supplier/batches/:supplierId", async(req,res)=>{

 try{

 const batches = await SupplierBatch.find({
  supplierId:req.params.supplierId
 })

 res.json(batches)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

/* ===============================
   SUPPLIER INVENTORY - FARMER INVENTORY
=============================== */

router.get("/supplier/batches/farmer-inventory/:supplierId", async(req,res)=>{

 try{

  const { supplierId } = req.params

  // Get all batches received by this supplier (status = "received")
  const farmerInventory = await Batch.find({
   supplierId: supplierId,
   status: "received"
  }).select("batchId herbName quantity unit harvestDate status farmer farmerId supplierProcessedDate latitude longitude geoImage").lean()

  return res.json({
   success: true,
   count: farmerInventory.length,
   data: farmerInventory
  })

 }catch(err){
  console.error("Farmer inventory fetch error:", err)
  return res.status(500).json({
   success: false,
   message: "Failed to fetch farmer inventory"
  })
 }

})

/* ===============================
   SUPPLIER INVENTORY - LAB EXPORT
=============================== */

router.get("/supplier/batches/lab-export/:supplierId", async(req,res)=>{

 try{

  const { supplierId } = req.params

  // Get all batches that passed lab tests (status = "tested" and labTested = true)
  const labExportInventory = await Batch.find({
   supplierId: supplierId,
   status: "tested",
   labTested: true
  }).select("batchId herbName quantity unit harvestDate status labName labResult labTestDate latitude longitude geoImage").lean()

  return res.json({
   success: true,
   count: labExportInventory.length,
   data: labExportInventory
  })

 }catch(err){
  console.error("Lab export inventory fetch error:", err)
  return res.status(500).json({
   success: false,
   message: "Failed to fetch lab export inventory"
  })
 }

})

module.exports = router