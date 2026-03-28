const express = require("express")
const router = express.Router()

const Batch = require("../models/Batch")
const Supplier = require("../models/Supplier")
const Farmer = require("../models/Farmer")

/* =================================
   GET ALL FARMERS
================================= */

router.get("/admin/farmers", async (req, res) => {

 try {

  const farmers = await Farmer.find()

  res.json(farmers)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   GET FARMER DETAILS
================================= */

router.get("/admin/farmer/:id", async (req, res) => {

 try {

  const farmer = await Farmer.findById(req.params.id)

  res.json(farmer)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   FARMER HERB ANALYTICS
================================= */

router.get("/admin/farmer/:id/analytics", async (req, res) => {

 try {

  const data = await Batch.aggregate([

   {
    $match: {
     farmerId: req.params.id
    }
   },

   {
    $group: {
     _id: "$herbName",
     quantity: { $sum: "$quantity" }
    }
   },

   {
    $project: {
     herb: "$_id",
     quantity: 1,
     _id: 0
    }
   }

  ])

  res.json(data)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   FARMER BATCHES
================================= */

router.get("/admin/farmer/:id/batches", async (req, res) => {

 try {

  const batches = await Batch.find({
   farmerId: req.params.id
  })

  res.json(batches)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   FARMER COMPARISON
================================= */

router.get("/admin/farmers/comparison", async (req, res) => {

 try {

  const data = await Batch.aggregate([

   {
    $group: {
     _id: "$farmer",
     totalHarvest: { $sum: "$quantity" }
    }
   },

   {
    $project: {
     name: "$_id",
     totalHarvest: 1,
     _id: 0
    }
   },

   {
    $sort: { totalHarvest: -1 }
   }

  ])

  res.json(data)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   GET ALL SUPPLIERS
================================= */

router.get("/admin/suppliers", async (req, res) => {

 try {

  const suppliers = await Supplier.find()

  res.json(suppliers)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   SUPPLIER ANALYTICS
================================= */

router.get("/admin/supplier/:name/herbs", async (req, res) => {

 try {

  const data = await Batch.aggregate([

   {
    $match: {
     supplierName: req.params.name
    }
   },

   {
    $group: {
     _id: "$herbName",
     quantity: { $sum: "$quantity" }
    }
   },

   {
    $project: {
     herb: "$_id",
     quantity: 1,
     _id: 0
    }
   }

  ])

  res.json(data)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

/* =================================
   SUPPLIER COMPARISON
================================= */

router.get("/admin/suppliers/comparison", async (req, res) => {

 try {

  const suppliers = await Supplier.find()

  const data = suppliers.map((s) => ({
   name: s.name,
   processed: s.processedHerbs || 0
  }))

  res.json(data)

 } catch (err) {

  res.status(500).json({ error: err.message })

 }

})

router.get("/admin/supplier/:id", async(req,res)=>{

 try{

 const supplier =
 await Supplier.findById(req.params.id)

 res.json(supplier)

 }catch(err){

 res.status(500).json({error:err.message})

 }

})

router.get("/admin/supplier/:id/analytics", async(req,res)=>{

 try{

 const supplier =
 await Supplier.findById(req.params.id)

 const data = await Batch.aggregate([

 { $match:{ supplierName:supplier.name } },

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

module.exports = router