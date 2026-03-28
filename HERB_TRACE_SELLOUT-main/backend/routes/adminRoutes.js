const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Supplier = require("../models/Supplier")

/* ==========================
   FARMER HERB ANALYTICS
========================== */

router.get("/admin/farmer/:name/herbs", async(req,res)=>{

 try{

 const farmerName = req.params.name

 const data = await Batch.aggregate([

 {
  $match:{ farmer: farmerName }
 },

 {
  $group:{
   _id:"$herbName",
   quantity:{ $sum:"$quantity" }
  }
 },

 {
  $project:{
   herb:"$_id",
   quantity:1,
   _id:0
  }
 }

 ])

 res.json(data)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

/* ==========================
   FARMER COMPARISON
========================== */

router.get("/admin/farmers/comparison", async(req,res)=>{

 try{

 const data = await Batch.aggregate([

 {
  $group:{
   _id:"$farmer",
   totalHarvest:{ $sum:"$quantity" }
  }
 },

 {
  $project:{
   name:"$_id",
   totalHarvest:1,
   _id:0
  }
 }

 ])

 res.json(data)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

/* ==========================
   SUPPLIER PERSONAL DATA
========================== */

router.get("/admin/supplier/:name/herbs", async(req,res)=>{

 try{

 const supplierName = req.params.name

 const data = await Batch.aggregate([

 {
  $match:{ supplierName:supplierName }
 },

 {
  $group:{
   _id:"$herbName",
   quantity:{ $sum:"$quantity" }
  }
 },

 {
  $project:{
   herb:"$_id",
   quantity:1,
   _id:0
  }
 }

 ])

 res.json(data)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

/* ==========================
   SUPPLIER COMPARISON
========================== */

router.get("/admin/suppliers/comparison", async(req,res)=>{

 try{

 const suppliers = await Supplier.find()

 const data = suppliers.map(s=>({

 name:s.name,
 processed:s.processedHerbs || 0

 }))

 res.json(data)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

module.exports = router