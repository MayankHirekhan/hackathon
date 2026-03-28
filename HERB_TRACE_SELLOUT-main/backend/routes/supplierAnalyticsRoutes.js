    const express = require("express")
const router = express.Router()

const SupplierBatch = require("../models/SupplierBatch")
const Supplier = require("../models/Supplier")

/* ============================
   HERB PROCESSING ANALYTICS
============================ */

router.get("/analytics/herbs", async (req,res)=>{

 try{

 const batches = await SupplierBatch.find()

 const herbs = {}

 batches.forEach(b=>{

 const herb = b.herbName
 const qty = Number(b.quantity) || 0

 if(!herbs[herb]){
 herbs[herb] = 0
 }

 herbs[herb] += qty

 })

 const data = Object.keys(herbs).map(h=>({

 herb:h,
 quantity:herbs[h]

 }))

 res.json(data)

 }
 catch(err){

 res.status(500).json({error:err.message})

 }

})


/* ============================
   SUPPLIER COMPARISON
============================ */

router.get("/analytics/suppliers", async (req,res)=>{

 try{

 const suppliers = await Supplier.find()

 const data = suppliers.map(s=>({

 name:s.name,
 batches:s.totalBatchesReceived

 }))

 res.json(data)

 }
 catch(err){

 res.status(500).json({error:err.message})

 }

})

module.exports = router