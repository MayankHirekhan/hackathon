const express = require("express")
const router = express.Router()

const Packet = require("../models/Packet")
const Batch = require("../models/Batch")

/* ===============================
   INVENTORY BY BATCH
=============================== */

router.get("/inventory", async (req,res)=>{

 try{

 const batches = await Batch.find()

 const inventory = await Promise.all(

 batches.map(async(batch)=>{

 const packets = await Packet.find({
 batchId:batch.batchId
 })

 return{

 batchId:batch.batchId,
 herbName:batch.herbName,
 farmer:batch.farmer,
 location:batch.location,
 packetCount:packets.length,
 packets

 }

 })

 )

 res.json(inventory)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

module.exports = router