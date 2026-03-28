const express = require("express")
const router = express.Router()

const Farmer = require("../models/Farmer")
const Batch = require("../models/Batch")


/* ================================
   CREATE FARMER
================================ */

router.post("/farmers", async (req,res)=>{

 try{

  const farmer = new Farmer(req.body)

  const savedFarmer = await farmer.save()

  res.json(savedFarmer)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ================================
   GET ALL FARMERS
================================ */

router.get("/farmers", async (req,res)=>{

 try{

  const farmers = await Farmer.find()

  res.json(farmers)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ================================
   LOGIN FARMER
================================ */

router.post("/farmer/login", async (req,res)=>{

 try{

  const {email,password} = req.body

  const farmer = await Farmer.findOne({email,password})

  if(!farmer){

   return res.status(401).json({
    message:"Invalid credentials"
   })

  }

  res.json(farmer)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ================================
   GET FARMER PROFILE
================================ */

router.get("/farmer/:id", async (req,res)=>{

 try{

  const farmer = await Farmer.findById(req.params.id)

  if(!farmer){
   return res.status(404).json({ error:"Farmer not found" })
  }

  /* COUNT HARVESTS USING farmerId */

  const harvestCount = await Batch.countDocuments({
   farmerId: farmer._id.toString()
  })

  /* CALCULATE RATING */

  let rating = 0

  if(farmer.reviews.length>0){

   const total = farmer.reviews.reduce(
    (sum,r)=>sum+r.rating,
    0
   )

   rating = total / farmer.reviews.length
  }

  res.json({

   ...farmer.toObject(),

   totalHarvests: harvestCount,

   rating: Number(rating.toFixed(1))

  })

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ================================
   UPDATE PROFILE PHOTO
================================ */

router.put("/farmer/photo/:id", async(req,res)=>{

 try{

  const {photo} = req.body

  const farmer = await Farmer.findByIdAndUpdate(

   req.params.id,
   {profilePhoto:photo},
   {new:true}

  )

  res.json(farmer)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})


/* ================================
   ADD CUSTOMER REVIEW
================================ */

router.put("/farmer/review/:id", async(req,res)=>{

 try{

  const {user,comment,rating} = req.body

  const farmer = await Farmer.findById(req.params.id)

  if(!farmer){

   return res.status(404).json({
    error:"Farmer not found"
   })

  }

  farmer.reviews.push({
   user,
   comment,
   rating
  })

  await farmer.save()

  res.json(farmer)

 }
 catch(err){

  res.status(500).json({error:err.message})

 }

})

router.put("/farmer/profile/:id", async(req,res)=>{

 try{

 const farmer = await Farmer.findByIdAndUpdate(

 req.params.id,

 { profilePhoto:req.body.profilePhoto },

 { new:true }

 )

 res.json(farmer)

 }
 catch(err){

 res.status(500).json({error:err.message})

 }

})


module.exports = router