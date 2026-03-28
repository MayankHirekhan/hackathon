const express = require("express")
const router = express.Router()

const Consumer = require("../models/Consumer")

/* ==========================
   CONSUMER LOGIN
========================== */

router.post("/consumer/login", async (req,res)=>{

 try{

 const {email,password} = req.body

 const consumer = await Consumer.findOne({
  email,
  password
 })

 if(!consumer){

  return res.status(401).json({
   message:"Invalid credentials"
  })

 }

 res.json({

  message:"Login successful",

  consumerId:consumer._id,

  name:consumer.name

 })

 }catch(err){

  res.status(500).json({
   error:err.message
  })

 }

})

/* ==========================
   GET CONSUMER PROFILE
========================== */

router.get("/consumer/:id", async(req,res)=>{

 try{

 const consumer = await Consumer.findById(req.params.id)

 if(!consumer){

 return res.status(404).json({
 message:"Consumer not found"
 })

 }

 res.json(consumer)

 }catch(err){

 res.status(500).json({
 error:err.message
 })

 }

})

const ConsumerHistory =
require("../models/ConsumerHistory")

router.get("/consumer/:id/history", async(req,res)=>{

const history =
await ConsumerHistory.find({
consumerId:req.params.id
}).sort({date:-1})

res.json(history)

})
   
module.exports = router