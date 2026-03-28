const express = require("express")
const router = express.Router()

const Packet = require("../models/Packet")
const Batch = require("../models/Batch")
const Farmer = require("../models/Farmer")
const Supplier = require("../models/Supplier")

/* =================================
   TRACE QR (PACKET OR BATCH)
================================= */

router.get("/trace/:id", async (req,res)=>{

 try{

 const id = req.params.id

 let packet = null
 let batch = null

 /* ==========================
    CHECK PACKET
 ========================== */

 packet = await Packet.findOne({packetId:id})

 if(packet){
  batch = await Batch.findOne({batchId:packet.batchId})
 }

 /* ==========================
    CHECK BATCH DIRECTLY
 ========================== */

 if(!batch){
  batch = await Batch.findOne({batchId:id})
 }

 if(!batch){
  return res.status(404).json({
   error:"Trace not found"
  })
 }

 /* ==========================
    FARMER
 ========================== */

 let farmer = null

 if(batch.farmerId){
  farmer = await Farmer.findById(batch.farmerId)
 }

 /* ==========================
    SUPPLIER
 ========================== */

 let supplier = null

 if(batch.supplierName){
  supplier = await Supplier.findOne({name:batch.supplierName})
 }

 return res.json({

  type: packet ? "packet" : "batch",

  packet,
  batch,
  farmer,
  supplier

 })

 }catch(err){

 console.error(err)

 res.status(500).json({
  error:"Server error"
 })

 }

})

module.exports = router