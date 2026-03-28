const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Supplier = require("../models/Supplier")

/* ===============================
   HERB DEMAND ANALYTICS
=============================== */

router.get("/analytics/demand", async (req,res)=>{

 try{

  const result = await Batch.aggregate([
   {
    $group:{
     _id:"$herbName",
     totalQuantity:{ $sum:"$quantity" }
    }
   }
  ])

  res.json(result)

 }catch(err){
  res.status(500).json({error:err.message})
 }

})

/* ===============================
   TOTAL PRODUCTION
=============================== */

router.get("/analytics/production", async (req,res)=>{

 try{

  const result = await Batch.aggregate([
   {
    $group:{
     _id:null,
     totalProduction:{ $sum:"$quantity" }
    }
   }
  ])

  res.json(result)

 }catch(err){
  res.status(500).json({error:err.message})
 }

})

/* ===============================
   HERB PROCESSING GRAPH
=============================== */

router.get("/analytics/herbs", async (req,res)=>{

 try{

  const herbs = await Batch.aggregate([
   {
    $group:{
     _id:"$herbName",
     quantity:{ $sum:"$quantity" }
    }
   }
  ])

  const result = herbs.map(h=>({
   herb:h._id,
   quantity:h.quantity
  }))

  res.json(result)

 }catch(err){

  res.status(500).json({error:err.message})

 }

})

/* ===============================
   SUPPLIER COMPARISON GRAPH
=============================== */

router.get("/analytics/suppliers", async(req,res)=>{

 try{

  const suppliers = await Supplier.find()

  const result = suppliers.map(s=>({
   name:s.name,
   batches:s.totalBatchesReceived
  }))

  res.json(result)

 }catch(err){

  res.status(500).json({error:err.message})

 }

})

module.exports = router