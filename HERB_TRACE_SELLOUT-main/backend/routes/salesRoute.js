const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Packet = require("../models/Packet")
const Sale = require("../models/Sale")
const { validateStatusChange } = require("../utils/statusTransitions")

/* ===============================
   CREATE SALE RECORD
=============================== */

router.post("/sales/create", async(req,res)=>{

 try{

  const {
   batchId,
   packetIds,
   customerName,
   customerEmail,
   customerPhone,
   supplierId,
   supplierName,
   quantity,
   pricePerUnit,
   discount = 0,
   paymentMethod = "cash",
   deliveryAddress
  } = req.body

  if(!batchId || !customerName){
   return res.status(400).json({
    success: false,
    message: "Batch ID and customer name required"
   })
  }

  /* FIND BATCH */

  const batch = await Batch.findOne({batchId})

  if(!batch){
   return res.status(404).json({
    success: false,
    message: "Batch not found"
   })
  }

  /*  VALIDATE STATUS - CAN ONLY SELL TESTED PARCELS */

  if(batch.status !== "tested" && batch.status !== "packaged"){
   return res.status(400).json({
    success: false,
    message: `Cannot sell batch with status "${batch.status}". Only "tested" or "packaged" batches can be sold.`
   })
  }

  /* VALIDATE STATUS TRANSITION  */

  const transitionCheck = validateStatusChange(batch.status, "distributed", "supplier")

  if(!transitionCheck.valid){

   return res.status(400).json({
    success: false,
    message: transitionCheck.message
   })

  }

  /* CALCULATE PRICE */

  const totalPrice = quantity * pricePerUnit
  const finalPrice = totalPrice - discount

  /* GENERATE SALE ID */

  const saleCount = await Sale.countDocuments()
  const saleId = "SALE-" + (saleCount + 1).toString().padStart(5, "0")

  /* CREATE SALE RECORD */

  const sale = new Sale({
   saleId,
   batchId,
   packetIds: packetIds || [],
   customerId: customerEmail || customerPhone,
   customerName,
   customerEmail,
   customerPhone,
   supplierId,
   supplierName,
   quantity,
   unit: "packet",
   pricePerUnit,
   totalPrice,
   discount,
   finalPrice,
   paymentMethod,
   paymentStatus: "completed",
   deliveryAddress,
   deliveryStatus: "pending",
   saleDate: new Date()
  })

  await sale.save()

  /* UPDATE BATCH STATUS TO DISTRIBUTED */

  batch.status = "distributed"
  await batch.save()

  /* UPDATE PACKETS IF PROVIDED */

  if(packetIds && packetIds.length > 0){
   await Packet.updateMany(
    { packetId: { $in: packetIds } },
    { status: "sold", soldDate: new Date() }
   )
  }

  console.log(`💰 Sale recorded - ${saleId} for ${customerName}`)

  res.json({
   success: true,
   message: "Sale recorded successfully",
   sale
  })

 }catch(err){

  console.error("❌ Error creating sale:", err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

/* ===============================
   GET SALES BY SUPPLIER
=============================== */

router.get("/sales/supplier/:supplierId", async(req,res)=>{

 try{

  const { supplierId } = req.params

  const sales = await Sale.find({supplierId}).sort({saleDate: -1})

  /* CALCULATE METRICS */

  const totalRevenue = sales.reduce((sum, s) => sum + s.finalPrice, 0)
  const totalQuantity = sales.reduce((sum, s) => sum + s.quantity, 0)

  res.json({
   success: true,
   count: sales.length,
   totalRevenue,
   totalQuantity,
   sales
  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

/* ===============================
   GET SALES BY CONSUMER
=============================== */

router.get("/sales/customer/:customerId", async(req,res)=>{

 try{

  const { customerId } = req.params

  const sales = await Sale.find({
   $or: [
    { customerEmail: customerId },
    { customerPhone: customerId },
    { customerId: customerId }
   ]
  }).sort({saleDate: -1})

  res.json({
   success: true,
   count: sales.length,
   sales
  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

/* ===============================
   UPDATE DELIVERY STATUS
=============================== */

router.put("/sales/:saleId/delivery", async(req,res)=>{

 try{

  const { saleId } = req.params
  const { deliveryStatus, trackingNumber } = req.body

  const sale = await Sale.findOneAndUpdate(
   { saleId },
   {
    deliveryStatus,
    trackingNumber,
    deliveryDate: new Date()
   },
   { new: true }
  )

  if(!sale){
   return res.status(404).json({
    success: false,
    message: "Sale not found"
   })
  }

  console.log(`📦 Delivery status updated: ${saleId} → ${deliveryStatus}`)

  res.json({
   success: true,
   message: "Delivery status updated",
   sale
  })

 }catch(err){

  console.error(err)

  res.status(500).json({
   success: false,
   error: err.message
  })

 }

})

/* ===============================
   OLD: MARK PACKET AS SOLD
=============================== */

router.put("/packet/sell/:packetId", async(req,res)=>{

 const packet = await Packet.findOne({packetId:req.params.packetId})

 if(!packet){
  return res.status(404).json({message:"Packet not found"})
 }

 packet.status="sold"

 await packet.save()

 res.json({message:"Packet marked as sold"})

})

module.exports = router