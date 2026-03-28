const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Supplier = require("../models/Supplier")
const { validateStatusChange } = require("../utils/statusTransitions")

/* ===============================
   RECEIVE BATCH FROM QR
=============================== */

router.post("/receive/batch", async(req,res)=>{

try{

 const { batchId, supplierId } = req.body

 console.log("📦 Receive request - BatchID:", batchId, "SupplierID:", supplierId)

 /* VALIDATE INPUT */

 if(!batchId || !batchId.trim()){

 return res.status(400).json({
 success:false,
 message:"Batch ID is required"
 })

 }

 if(!supplierId){

 return res.status(400).json({
 success:false,
 message:"Supplier ID missing - please login again"
 })

 }

 /* FIND BATCH */

 const batch = await Batch.findOne({batchId: batchId.trim()})
 
 console.log("🔍 Database search result:", batch ? "✅ Found" : "❌ Not found")

 if(!batch){
 
 console.log("⚠️ Batch not found. Available batches:")
 const allBatches = await Batch.find().select("batchId status farmer").limit(10)
 console.log(allBatches)

 return res.status(404).json({
 success:false,
 message:`Batch ${batchId} not found in system`
 })

 }

 /* VALIDATE BATCH STATUS */

 if(batch.status !== "harvested" && batch.status !== "processing"){

 return res.status(400).json({
 success:false,
 message:`Batch cannot be received - current status is "${batch.status}". Only "harvested" or "processing" batches can be received.`
 })

 }

 /* VALIDATE STATUS TRANSITION  */

 const transitionCheck = validateStatusChange(batch.status, "received", "supplier")

 if(!transitionCheck.valid){

  return res.status(400).json({
   success: false,
   message: transitionCheck.message,
   details: transitionCheck.allowedNextStages
  })

 }

 /* UPDATE BATCH TO RECEIVED */

 batch.status = "received"
 batch.supplierId = supplierId
 batch.receivedDate = new Date()

 await batch.save()

 console.log("✅ Batch status updated to 'received'")

 /* UPDATE SUPPLIER STATS */

 if(supplierId){

 await Supplier.findByIdAndUpdate(
  supplierId,
  { 
   $inc: { totalBatchesReceived: 1 },
   lastBatchReceived: new Date()
  }
 )

 }

 res.json({

 success:true,
 message:"Batch received successfully",
 batch:{
  batchId: batch.batchId,
  herbName: batch.herbName,
  farmer: batch.farmer,
  quantity: batch.quantity,
  status: batch.status
 }

 })

}catch(err){

 console.error("❌ Error in receive/batch:", err)

 res.status(500).json({
 success:false,
 message:"Error receiving batch",
 error:err.message
 })

}

})

module.exports = router